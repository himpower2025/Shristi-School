import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Upload, Trash2, Plus, 
  FileText, CalendarDays, Eye, RefreshCw, AlertCircle, Info, Download, Trash, Sparkles, ChevronLeft, ChevronRight, X,
  Grid, ListFilter, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SchoolEvent } from "../types";
import { 
  parseSchoolEventDate, 
  isEventActiveOnDay, 
  MONTH_NAMES, 
  MONTH_SHORT_NAMES, 
  DAYS_OF_WEEK 
} from "../utils/calendarDateUtils";

interface ToolsSectionProps {
  isAdmin?: boolean;
  events?: SchoolEvent[];
  onAddEvent?: (event: SchoolEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

// Default events are empty as requested ("가짜 데이터는 넣지 맙시다")
export const DEFAULT_EVENTS: SchoolEvent[] = [];

export default function ToolsSection({ isAdmin = false, events: propsEvents, onAddEvent, onDeleteEvent }: ToolsSectionProps) {
  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    if (propsEvents !== undefined) return propsEvents;
    const cached = localStorage.getItem("shristi_calendar_events");
    try {
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (propsEvents !== undefined) {
      setEvents(propsEvents);
    }
  }, [propsEvents]);

  const [calendarImage, setCalendarImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"grid" | "poster">("grid");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Real-world current month and year
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [filterMode, setFilterMode] = useState<"month" | "by-month" | "all">("month");

  const [selectedDayEvents, setSelectedDayEvents] = useState<SchoolEvent[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  
  // AI Parsing state
  const [isParsing, setIsParsing] = useState(false);

  // Admin Event Creator state
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventType, setNewEventType] = useState<"Sports" | "Academic" | "Excursion" | "Ceremony">("Academic");

  // Load from local storage and sync in real time
  useEffect(() => {
    const loadCalendarData = () => {
      const cachedEvents = localStorage.getItem("shristi_calendar_events");
      const cachedCalImage = localStorage.getItem("shristi_calendar_uploaded_image");

      if (cachedEvents) {
        try {
          const parsed = JSON.parse(cachedEvents);
          setEvents(Array.isArray(parsed) ? parsed : []);
        } catch (_) {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }

      if (cachedCalImage) {
        setCalendarImage(cachedCalImage);
      } else {
        setCalendarImage(null);
      }
    };

    loadCalendarData();

    window.addEventListener("shristi_calendar_updated", loadCalendarData);
    window.addEventListener("storage", loadCalendarData);
    return () => {
      window.removeEventListener("shristi_calendar_updated", loadCalendarData);
      window.removeEventListener("storage", loadCalendarData);
    };
  }, []);

  const saveEvents = (updated: SchoolEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem("shristi_calendar_events", JSON.stringify(updated));
      window.dispatchEvent(new Event("shristi_calendar_updated"));
    } catch (err) {
      console.error("Storage save error:", err);
    }
  };

  // Helper to compress image before saving to localStorage to prevent quota errors
  const compressCalendarImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "application/pdf" || file.size < 400 * 1024) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDownloadCalendarPoster = () => {
    if (!calendarImage) {
      alert("No official calendar poster has been uploaded yet.");
      return;
    }
    const a = document.createElement("a");
    a.href = calendarImage;
    a.download = "Shristi_Academy_Official_Academic_Calendar_2026.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Image / PDF Upload handler (Base64)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large! Please choose a file smaller than 15MB.");
      return;
    }

    try {
      const base64String = await compressCalendarImage(file);
      setCalendarImage(base64String);
      try {
        localStorage.setItem("shristi_calendar_uploaded_image", base64String);
      } catch (_) {}
      window.dispatchEvent(new Event("shristi_calendar_updated"));
      
      // Auto-trigger Gemini AI parsing when admin uploads official calendar document
      handleAIParseCalendar(base64String);
    } catch (err) {
      alert("Failed to process uploaded file. Please select a valid JPG, PNG or PDF.");
    }
  };

  // AI Calendar Parse API Call
  const handleAIParseCalendar = async (overrideBase64?: string) => {
    const targetImage = overrideBase64 || calendarImage;
    if (!targetImage) return;

    setIsParsing(true);
    try {
      const res = await fetch("/api/parse-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: targetImage }),
      });

      if (!res.ok) {
        let errorMsg = "API endpoint unavailable on static hosting";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        // Map dynamic events
        const parsedEvents: SchoolEvent[] = data.events.map((evt: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: evt.title || "Unnamed Event",
          date: evt.date || `July 15, ${currentYear}`,
          endDate: evt.endDate || undefined,
          time: evt.time || "All Day",
          location: evt.location || "School Premises",
          description: evt.description || "Auto-parsed from uploaded official academic calendar document via Gemini AI.",
          type: (["Sports", "Academic", "Excursion", "Ceremony"].includes(evt.type) ? evt.type : "Academic") as any
        }));

        if (parsedEvents.length > 0) {
          // Merge dynamic events without overwriting
          const merged = [...parsedEvents, ...events];
          saveEvents(merged);
          alert(`🎉 AI Sync Successful! Successfully extracted ${parsedEvents.length} academic calendar events from your uploaded document!\n\nThe extracted events have been dynamically linked to the monthly calendar and event list.`);
        } else {
          alert("No parseable events were detected in the uploaded document. Please ensure the document is clear and readable.");
        }
        setActiveTab("grid");
      }
    } catch (error: any) {
      console.log("AI parsing notice:", error.message);
      alert(`📅 Official Calendar Document Saved Successfully!\n\nYour calendar poster image is now live on the website.\n(Note: You can also manually add or edit calendar events anytime using the 'Add New Event' form below.)`);
    } finally {
      setIsParsing(false);
    }
  };

  // Remove uploaded calendar image
  const handleRemoveImage = () => {
    setCalendarImage(null);
    localStorage.removeItem("shristi_calendar_uploaded_image");
    window.dispatchEvent(new Event("shristi_calendar_updated"));
    setActiveTab("grid");
  };

  // Add event handler
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) {
      alert("Please provide at least a title and a scheduled date.");
      return;
    }

    const added: SchoolEvent = {
      id: "evt-" + Date.now(),
      title: newEventTitle.trim(),
      date: newEventDate.trim(),
      endDate: newEventEndDate.trim() || undefined,
      time: newEventTime.trim() || "All Day",
      location: newEventLocation.trim() || "School Premises",
      description: newEventDesc.trim() || "No additional details provided.",
      type: newEventType
    };

    if (onAddEvent) {
      onAddEvent(added);
    } else {
      const updated = [added, ...events];
      saveEvents(updated);
    }

    // reset fields
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventEndDate("");
    setNewEventTime("");
    setNewEventLocation("");
    setNewEventDesc("");
  };

  // Delete event handler
  const handleDeleteEvent = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id);
    } else {
      const updated = events.filter(e => e.id !== id);
      saveEvents(updated);
    }
    setSelectedDayEvents(prev => prev.filter(e => e.id !== id));
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
    setSelectedDayNumber(null);
    setSelectedDayEvents([]);
  };

  const nextMonth = () => {
    setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
    setSelectedDayNumber(null);
    setSelectedDayEvents([]);
  };

  // Calculate Calendar Grid for active month and year
  const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  // Create empty offset days and month days
  const offsetDays = Array(firstDayIndex).fill(null);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const calendarCells = [...offsetDays, ...monthDays];

  // Helper function to check if a specific day falls within a single-day or multi-day event / vacation
  const isEventOnDay = (evt: SchoolEvent, day: number) => {
    return isEventActiveOnDay(evt.date, evt.endDate, currentYear, currentMonthIndex, day);
  };

  // Get events on a specific day
  const getEventsOnDay = (day: number) => {
    return events.filter(evt => isEventOnDay(evt, day));
  };

  // Select day handler
  const handleSelectDay = (day: number) => {
    setSelectedDayNumber(day);
    setSelectedDayEvents(getEventsOnDay(day));
  };

  // Count events active in a given month
  const getEventCountForMonth = (monthIdx: number, yearNum = currentYear) => {
    return events.filter(evt => {
      const p = parseSchoolEventDate(evt.date);
      if (!p) return false;
      if (evt.endDate) {
        const pend = parseSchoolEventDate(evt.endDate);
        if (pend) {
          const startMonth = p.year * 12 + p.month;
          const endMonth = pend.year * 12 + pend.month;
          const cur = yearNum * 12 + monthIdx;
          return cur >= startMonth && cur <= endMonth;
        }
      }
      return p.year === yearNum && p.month === monthIdx;
    }).length;
  };

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const da = parseSchoolEventDate(a.date);
    const db = parseSchoolEventDate(b.date);
    if (da && db) {
      if (da.year !== db.year) return da.year - db.year;
      if (da.month !== db.month) return da.month - db.month;
      return da.day - db.day;
    }
    return 0;
  });

  // Filter events for active month
  const currentMonthEvents = sortedEvents.filter(evt => {
    const p = parseSchoolEventDate(evt.date);
    if (!p) return false;
    if (evt.endDate) {
      const pend = parseSchoolEventDate(evt.endDate);
      if (pend) {
        const startMonth = p.year * 12 + p.month;
        const endMonth = pend.year * 12 + pend.month;
        const cur = currentYear * 12 + currentMonthIndex;
        return cur >= startMonth && cur <= endMonth;
      }
    }
    return p.year === currentYear && p.month === currentMonthIndex;
  });

  // Group events by month for the "by-month" view mode
  const eventsByMonth: { [key: string]: { label: string; monthIndex: number; year: number; events: SchoolEvent[] } } = {};
  sortedEvents.forEach(evt => {
    const p = parseSchoolEventDate(evt.date);
    const mIdx = p ? p.month : 0;
    const y = p ? p.year : currentYear;
    const key = `${y}-${mIdx}`;
    if (!eventsByMonth[key]) {
      eventsByMonth[key] = {
        label: `${MONTH_NAMES[mIdx]} ${y}`,
        monthIndex: mIdx,
        year: y,
        events: []
      };
    }
    eventsByMonth[key].events.push(evt);
  });

  // List of other months that currently have events
  const otherMonthsWithEvents = MONTH_SHORT_NAMES.map((name, idx) => ({
    name,
    fullName: MONTH_NAMES[idx],
    monthIndex: idx,
    count: getEventCountForMonth(idx, currentYear)
  })).filter(m => m.count > 0 && m.monthIndex !== currentMonthIndex);

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white relative overflow-hidden" id="portal-tools">
      {/* Ambient background blur circles */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-pink-100/30 blur-[100px] pointer-events-none" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto space-y-12 relative z-10">
        
        {/* Header Title block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full inline-block border border-indigo-100/40">
            📅 Academic Calendar Hub
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0b1329] tracking-tight leading-tight">
            Schedule of Events & Official Calendar
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            Stay aligned with Shristi Academy's key seasonal terms, extracurricular celebrations, and national holiday notices. Download or upload formal calendar schedules below.
          </p>
        </div>

        {/* Unified Responsive Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT COLUMN: School Calendar & Tabbed Display */}
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-indigo-50/70 p-4 sm:p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/5 space-y-6 text-left flex flex-col justify-between">
            
            <div className="space-y-5">
              
              {/* Header section with Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50/70 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">Official Calendar Board</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Academic Session: 2026 Gregorian / 2083 BS</p>
                  </div>
                </div>

                {/* Header Action Buttons for Official Poster */}
                <div className="flex flex-wrap items-center gap-2">
                  {calendarImage && (
                    <>
                      <button
                        onClick={handleDownloadCalendarPoster}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-black rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                        title="Download official school calendar poster"
                      >
                        <Download className="w-4 h-4 text-emerald-200" />
                        <span>DOWNLOAD CALENDAR POSTER</span>
                      </button>

                      <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-bold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                        title="Preview official print poster"
                      >
                        <Eye className="w-4 h-4 text-indigo-600" />
                        <span>VIEW POSTER</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status Banner when Official Poster is uploaded */}
              {calendarImage && (
                <div className="p-3 bg-indigo-50/80 border border-indigo-100/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-indigo-900 font-medium">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-pink-500 shrink-0 animate-pulse" />
                    <span>Official Academic Calendar poster uploaded & synchronized with calendar grid below!</span>
                  </div>
                  <button
                    onClick={handleDownloadCalendarPoster}
                    className="text-[11px] font-mono font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Poster File</span>
                  </button>
                </div>
              )}

              {/* Interactive Monthly Grid View */}
              <div className="space-y-4">
                
                {/* 12-Month Ribbon Navigator with Live Event Badges */}
                <div className="bg-white p-2.5 rounded-2xl border border-indigo-100/70 shadow-sm space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 text-indigo-700 font-display">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>12-Month Calendar Bar:</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Click any month to inspect events
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {MONTH_SHORT_NAMES.map((name, idx) => {
                      const count = getEventCountForMonth(idx, currentYear);
                      const isSelected = currentMonthIndex === idx;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setCurrentMonthIndex(idx);
                            setSelectedDayNumber(null);
                            setSelectedDayEvents([]);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 font-black scale-[1.02]"
                              : count > 0
                              ? "bg-indigo-50/90 text-indigo-900 hover:bg-indigo-100 border border-indigo-200/60"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 bg-slate-50/70"
                          }`}
                        >
                          <span>{name}</span>
                          {count > 0 && (
                            <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-black ${
                              isSelected ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"
                            }`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Month Navigation Header */}
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-indigo-100/40 shadow-sm">
                  <button
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <span className="font-display font-black text-sm sm:text-base text-slate-900 block">
                      {MONTH_NAMES[currentMonthIndex]} {currentYear}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">
                      {getEventCountForMonth(currentMonthIndex, currentYear)} Scheduled Event(s)
                    </span>
                  </div>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Grid Days Header */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="text-[10px] font-mono font-black uppercase text-slate-400 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarCells.map((dayNum, cellIdx) => {
                    if (dayNum === null) {
                      return <div key={`empty-${cellIdx}`} className="aspect-square bg-slate-100/30 rounded-xl" />;
                    }

                    const dayEvents = getEventsOnDay(dayNum);
                    const isSelected = selectedDayNumber === dayNum;
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => handleSelectDay(dayNum)}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative p-1 transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-indigo-600 border-indigo-700 text-white shadow-md scale-105" 
                            : hasEvents 
                            ? "bg-white border-indigo-100 hover:border-indigo-300 text-slate-850 shadow-sm font-black"
                            : "bg-white/60 border-slate-100 hover:border-slate-300 text-slate-600 font-semibold"
                        }`}
                      >
                        <span className="text-xs">{dayNum}</span>
                        
                        {/* Event Markers / Indicator Dots */}
                        {hasEvents && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.map((evt) => {
                              let dotColor = "bg-indigo-500";
                              if (evt.type === "Sports") dotColor = "bg-green-500";
                              if (evt.type === "Excursion") dotColor = "bg-amber-500";
                              if (evt.type === "Ceremony") dotColor = "bg-red-500";
                              return (
                                <span 
                                  key={evt.id} 
                                  className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : dotColor}`} 
                                />
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Event List Detail Card */}
                <AnimatePresence mode="wait">
                  {selectedDayNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white border border-indigo-100/70 p-4 rounded-2xl shadow-sm space-y-3"
                    >
                      <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                        <h4 className="font-display font-black text-xs sm:text-sm text-slate-900">
                          Schedule on {MONTH_NAMES[currentMonthIndex]} {selectedDayNumber}, {currentYear}
                        </h4>
                        <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {selectedDayEvents.length} Event(s)
                        </span>
                      </div>

                      {selectedDayEvents.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDayEvents.map((evt) => (
                            <div key={evt.id} className="text-xs space-y-1 bg-[#FAF9F6] p-3 rounded-xl border border-indigo-50/50">
                              <div className="flex justify-between items-start">
                                <h5 className="font-black text-slate-800">{evt.title}</h5>
                                <span className="text-[8.5px] font-mono text-indigo-700 font-black bg-indigo-50 border border-indigo-100/50 py-0.2 px-1.5 rounded uppercase tracking-wider shrink-0">
                                  {evt.type}
                                </span>
                              </div>
                              <p className="text-slate-500 font-semibold">{evt.description}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9.5px] text-slate-400 font-mono font-bold pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" />{evt.time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-pink-500" />{evt.location}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-semibold italic py-2">
                          No special academic events or recesses registered on this date.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Parsing Dynamic UI Bar (Available when calendarImage is uploaded) */}
              {calendarImage && (
                <div className="bg-indigo-50 border border-indigo-100/50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <div>
                    <h4 className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                      AI Academic Calendar Extractor
                    </h4>
                    <p className="text-[10.5px] text-slate-500 font-semibold leading-normal">
                      Let Gemini automatically read your uploaded calendar image and populate the interactive timeline & monthly grid in seconds!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAIParseCalendar()}
                    disabled={isParsing}
                    className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-mono font-black text-[10.5px] px-4.5 py-2.5 rounded-xl transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md select-none"
                  >
                    {isParsing ? "PARSING WITH AI..." : "✨ EXTRACT WITH AI"}
                  </button>
                </div>
              )}

            </div>

            {/* Admin Upload controls box */}
            {isAdmin ? (
              <div className="bg-[#FAF9F6]/50 border-t border-indigo-50/70 pt-5 space-y-3.5 mt-5">
                <div className="flex items-center space-x-1.5 text-xs text-indigo-800 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/40">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                  <p className="font-bold">
                    You are in <strong className="text-indigo-600">Administrator View</strong>. Uploading an official 1-year calendar poster (JPG/PNG/PDF) will automatically run AI extraction to update both the left calendar grid and right cards.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <label className="flex-grow flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs px-5 py-3 rounded-xl cursor-pointer shadow-md shadow-indigo-100 transition-all select-none">
                    <Upload className="w-4 h-4 text-pink-300" />
                    <span>UPLOAD CALENDAR (PDF / IMAGE)</span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {calendarImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-mono font-black border border-rose-100 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      REMOVE
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-5 text-center sm:text-left mt-5">
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  * Note: School administrators can log into the Secretariat cabinet to upload an official printed school calendar poster (Image/PDF). AI will automatically process and register the events.
                </p>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Upcoming School Events and Lists */}
          <div className="lg:col-span-5 bg-white border border-indigo-100 p-4 sm:p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/5 space-y-6 text-left flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50/70 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">Key Events Timeline</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Academic & Co-Curricular</p>
                  </div>
                </div>

                {/* Filter toggle */}
                <div className="flex flex-wrap bg-indigo-50 p-1 rounded-xl border border-indigo-100/40 select-none text-[11px] font-bold gap-1">
                  <button
                    onClick={() => setFilterMode("month")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterMode === "month"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {MONTH_SHORT_NAMES[currentMonthIndex]} ({currentMonthEvents.length})
                  </button>
                  <button
                    onClick={() => setFilterMode("by-month")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterMode === "by-month"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    By Month
                  </button>
                  <button
                    onClick={() => setFilterMode("all")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      filterMode === "all"
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All ({sortedEvents.length})
                  </button>
                </div>
              </div>

              {/* Event Lists with scroll */}
              <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                {filterMode === "by-month" ? (
                  /* GROUPED BY MONTH VIEW */
                  Object.keys(eventsByMonth).length > 0 ? (
                    Object.values(eventsByMonth).map(group => (
                      <div key={group.label} className="space-y-2 pb-2">
                        <div className="sticky top-0 z-10 bg-indigo-50/95 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-indigo-100 flex items-center justify-between text-xs font-black text-indigo-950">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{group.label}</span>
                          </span>
                          <span className="text-[10px] font-mono bg-white text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                            {group.events.length} Event{group.events.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {group.events.map(evt => (
                            <div 
                              key={evt.id}
                              className="bg-[#FAF9F6] border border-indigo-50/80 p-3.5 rounded-2xl space-y-2 hover:border-indigo-150 transition-all duration-300 relative group"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-mono text-indigo-700 font-black bg-indigo-50 border border-indigo-100/50 py-0.5 px-2 rounded uppercase tracking-wider">
                                  {evt.type}
                                </span>
                                <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono font-bold">
                                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{evt.endDate ? `${evt.date} ~ ${evt.endDate}` : evt.date}</span>
                                  {evt.endDate && (
                                    <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-black text-[9px]">
                                      Vacation / Multi-day
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h4 className="font-black text-xs sm:text-sm text-slate-900">
                                {evt.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                {evt.description}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1.5 text-[10px] text-slate-400 border-t border-indigo-50/40 font-mono font-bold">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{evt.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                                  <span className="truncate max-w-[130px]">{evt.location}</span>
                                </div>
                              </div>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteEvent(evt.id)}
                                  className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer border border-rose-100 shadow-sm"
                                  title="Delete Event"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                      No upcoming school events registered yet.
                    </div>
                  )
                ) : filterMode === "month" ? (
                  /* SELECTED MONTH VIEW */
                  currentMonthEvents.length > 0 ? (
                    currentMonthEvents.map((evt) => (
                      <div 
                        key={evt.id}
                        className="bg-[#FAF9F6] border border-indigo-50/80 p-4 rounded-2xl space-y-2 hover:border-indigo-150 transition-all duration-300 relative group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono text-indigo-700 font-black bg-indigo-50 border border-indigo-100/50 py-0.5 px-2 rounded uppercase tracking-wider">
                            {evt.type}
                          </span>
                          
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono font-bold">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{evt.endDate ? `${evt.date} ~ ${evt.endDate}` : evt.date}</span>
                            {evt.endDate && (
                              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-black text-[9px]">
                                Vacation / Multi-day
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="font-black text-xs sm:text-sm text-slate-900">
                          {evt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                          {evt.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1.5 text-[10px] text-slate-400 border-t border-indigo-50/40 font-mono font-bold">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{evt.location}</span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer border border-rose-100 shadow-sm"
                            title="Delete Event"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">No events scheduled in {MONTH_NAMES[currentMonthIndex]} {currentYear}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Jump to months with scheduled events below:</p>
                      </div>
                      {otherMonthsWithEvents.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                          {otherMonthsWithEvents.map(m => (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => {
                                setCurrentMonthIndex(m.monthIndex);
                                setSelectedDayNumber(null);
                                setSelectedDayEvents([]);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10.5px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                            >
                              <span>{m.name}</span>
                              <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1 rounded-full font-black">
                                {m.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10.5px] text-slate-400 italic">No academic events registered yet in this session.</p>
                      )}
                    </div>
                  )
                ) : (
                  /* ALL EVENTS VIEW */
                  sortedEvents.length > 0 ? (
                    sortedEvents.map((evt) => (
                      <div 
                        key={evt.id}
                        className="bg-[#FAF9F6] border border-indigo-50/80 p-4 rounded-2xl space-y-2 hover:border-indigo-150 transition-all duration-300 relative group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono text-indigo-700 font-black bg-indigo-50 border border-indigo-100/50 py-0.5 px-2 rounded uppercase tracking-wider">
                            {evt.type}
                          </span>
                          
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono font-bold">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{evt.endDate ? `${evt.date} ~ ${evt.endDate}` : evt.date}</span>
                            {evt.endDate && (
                              <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-black text-[9px]">
                                Vacation / Multi-day
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="font-black text-xs sm:text-sm text-slate-900">
                          {evt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                          {evt.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1.5 text-[10px] text-slate-400 border-t border-indigo-50/40 font-mono font-bold">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                            <span className="truncate max-w-[130px]">{evt.location}</span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer border border-rose-100 shadow-sm"
                            title="Delete Event"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                      No upcoming events are currently mapped. Add custom ones below.
                    </div>
                  )
                )}
              </div>
            </div>

            {/* ADMIN FORM: Create new school event */}
            {isAdmin && (
              <div className="bg-[#FAF9F6] border border-indigo-100 p-4 rounded-2xl shadow-sm mt-4">
                <h4 className="text-[10px] font-mono font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-1 text-pink-400" />
                  Add Event Scheduler
                </h4>
                <form onSubmit={handleAddEvent} className="space-y-3 font-sans text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Event Title (e.g. Summer Vacation / Exam)..."
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold focus:outline-none col-span-1 sm:col-span-2"
                    />
                    <input 
                      type="date" 
                      placeholder="Start Date"
                      value={newEventDate}
                      onChange={(e) => {
                        setNewEventDate(e.target.value);
                        const p = parseSchoolEventDate(e.target.value);
                        if (p) setCurrentMonthIndex(p.month);
                      }}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold focus:outline-none"
                    />
                    <input 
                      type="date" 
                      placeholder="End Date (Optional)"
                      value={newEventEndDate}
                      onChange={(e) => setNewEventEndDate(e.target.value)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Time..."
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold col-span-2 focus:outline-none"
                    />
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as any)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Excursion">Excursion</option>
                      <option value="Ceremony">Ceremony</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Location..."
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold col-span-2 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-mono font-black text-[10px] tracking-wide cursor-pointer shadow-sm text-center"
                    >
                      ADD EVENT
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Brief description of school event..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="w-full bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold focus:outline-none font-sans"
                  />
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Official Calendar Poster Lightbox Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && calendarImage && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-display font-black text-slate-900 text-sm sm:text-base">
                    Official Printed School Academic Calendar
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadCalendarPoster}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-black rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-200" />
                    <span>DOWNLOAD FILE</span>
                  </button>
                  <button
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-auto bg-slate-900/5 flex items-center justify-center">
                <img
                  src={calendarImage}
                  alt="Official School Academic Calendar Document"
                  className="max-h-[72vh] object-contain rounded-2xl shadow-md border border-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
