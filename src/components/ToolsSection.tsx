import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Upload, Trash2, Plus, 
  FileText, CalendarDays, Eye, RefreshCw, AlertCircle, Info, Download, Trash, Sparkles, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SchoolEvent } from "../types";

interface ToolsSectionProps {
  isAdmin?: boolean;
}

const DEFAULT_EVENTS: SchoolEvent[] = [
  {
    id: "evt-1",
    title: "First Terminal Examination Reviews",
    date: "June 25, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Active Block A Halls",
    description: "Compulsory term review starting for Grade 1 up to Class 10 (SEE batches).",
    type: "Academic"
  },
  {
    id: "evt-2",
    title: "Science & Robotics Exhibition 2026",
    date: "July 05, 2026",
    time: "9:30 AM onwards",
    location: "Main Ground Exhibition Tent",
    description: "Interactive projects, coding, chemistry visual tests by our Senior School science students.",
    type: "Excursion"
  },
  {
    id: "evt-3",
    title: "Inter-House Volleyball Finals",
    date: "July 12, 2026",
    time: "1:30 PM - 4:00 PM",
    location: "Mid-Baneshwor Campus Sports Court",
    description: "The peak final volleyball faceoff between Mount Everest House and Annapurna House.",
    type: "Sports"
  },
  {
    id: "evt-4",
    title: "Bhanu Jayanti Celebrations",
    date: "July 13, 2026",
    time: "11:00 AM - 2:00 PM",
    location: "Auditorium Hall Building B",
    description: "Nepalese kavya, poetry completions, dramatic plays marking Bhanubhakta Acharya's legacy.",
    type: "Ceremony"
  }
];

const MONTHS_2026 = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ToolsSection({ isAdmin = false }: ToolsSectionProps) {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [calendarImage, setCalendarImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"grid" | "poster">("grid");
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(5); // Default to June (index 5)
  const [selectedDayEvents, setSelectedDayEvents] = useState<SchoolEvent[]>([]);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  
  // AI Parsing state
  const [isParsing, setIsParsing] = useState(false);

  // Admin Event Creator state
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventType, setNewEventType] = useState<"Sports" | "Academic" | "Excursion" | "Ceremony">("Academic");

  // Load from local storage
  useEffect(() => {
    const cachedEvents = localStorage.getItem("shristi_calendar_events");
    const cachedCalImage = localStorage.getItem("shristi_calendar_uploaded_image");

    if (cachedEvents) {
      setEvents(JSON.parse(cachedEvents));
    } else {
      setEvents(DEFAULT_EVENTS);
      localStorage.setItem("shristi_calendar_events", JSON.stringify(DEFAULT_EVENTS));
    }

    if (cachedCalImage) {
      setCalendarImage(cachedCalImage);
    }
  }, []);

  const saveEvents = (updated: SchoolEvent[]) => {
    setEvents(updated);
    localStorage.setItem("shristi_calendar_events", JSON.stringify(updated));
  };

  // Image Upload handler (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large! Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCalendarImage(base64String);
      localStorage.setItem("shristi_calendar_uploaded_image", base64String);
      setActiveTab("poster");
    };
    reader.readAsDataURL(file);
  };

  // AI Calendar Parse API Call
  const handleAIParseCalendar = async () => {
    if (!calendarImage) return;
    setIsParsing(true);
    try {
      const res = await fetch("/api/parse-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: calendarImage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to parse calendar");
      }

      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        // Map dynamic events
        const parsedEvents: SchoolEvent[] = data.events.map((evt: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: evt.title || "Unnamed Event",
          date: evt.date || "June 25, 2026",
          time: evt.time || "All Day",
          location: evt.location || "School Premises",
          description: evt.description || "Parsed via Shristi AI Assistant.",
          type: (["Sports", "Academic", "Excursion", "Ceremony"].includes(evt.type) ? evt.type : "Academic") as any
        }));

        // Merge and update
        const merged = [...parsedEvents, ...events];
        saveEvents(merged);
        alert(`🎉 성공! AI가 업로드된 학교 일정을 분석하여 ${parsedEvents.length}개의 주요 학사 일정을 자동으로 추출하고 타임라인과 월별 캘린더에 연동했습니다!`);
        setActiveTab("grid");
      }
    } catch (error: any) {
      console.error(error);
      alert(`AI 파싱에 실패했습니다: ${error.message}. API 키가 올바르게 구성되어 있는지 확인하세요.`);
    } finally {
      setIsParsing(false);
    }
  };

  // Remove uploaded calendar image
  const handleRemoveImage = () => {
    if (confirm("Are you sure you want to remove the custom uploaded calendar? It will revert to the default school bulletin display.")) {
      setCalendarImage(null);
      localStorage.removeItem("shristi_calendar_uploaded_image");
      setActiveTab("grid");
    }
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
      time: newEventTime.trim() || "All Day",
      location: newEventLocation.trim() || "School Premises",
      description: newEventDesc.trim() || "No additional details provided.",
      type: newEventType
    };

    const updated = [added, ...events];
    saveEvents(updated);

    // reset fields
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventTime("");
    setNewEventLocation("");
    setNewEventDesc("");
  };

  // Delete event handler
  const handleDeleteEvent = (id: string) => {
    if (confirm("Permanently remove this school event from the dynamic list?")) {
      const updated = events.filter(e => e.id !== id);
      saveEvents(updated);
      setSelectedDayEvents(prev => prev.filter(e => e.id !== id));
    }
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

  // Calculate 2026 Calendar Grid
  const year = 2026;
  const firstDayIndex = new Date(year, currentMonthIndex, 1).getDay();
  const totalDaysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();

  // Create empty offset days and month days
  const offsetDays = Array(firstDayIndex).fill(null);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const calendarCells = [...offsetDays, ...monthDays];

  // Get events on a specific day
  const getEventsOnDay = (day: number) => {
    return events.filter(evt => {
      try {
        const d = new Date(evt.date);
        return d.getFullYear() === year && d.getMonth() === currentMonthIndex && d.getDate() === day;
      } catch {
        return false;
      }
    });
  };

  // Select day handler
  const handleSelectDay = (day: number) => {
    setSelectedDayNumber(day);
    setSelectedDayEvents(getEventsOnDay(day));
  };

  // Sort events chronologically for the Timeline
  const sortedEvents = [...events].sort((a, b) => {
    try {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } catch {
      return 0;
    }
  });

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden" id="portal-tools">
      {/* Ambient background blur circles */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-pink-100/30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
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
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-indigo-50/70 p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/5 space-y-6 text-left flex flex-col justify-between">
            
            <div className="space-y-5">
              
              {/* Header section with Tabs */}
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

                {/* Tab buttons */}
                <div className="flex bg-indigo-50 p-1 rounded-xl border border-indigo-100/40 select-none">
                  <button
                    onClick={() => setActiveTab("grid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "grid" 
                        ? "bg-white text-indigo-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Interactive Monthly
                  </button>
                  <button
                    onClick={() => setActiveTab("poster")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "poster" 
                        ? "bg-white text-indigo-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Calendar Poster
                  </button>
                </div>
              </div>

              {/* TAB 1: Interactive Monthly Grid View */}
              {activeTab === "grid" && (
                <div className="space-y-4">
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-indigo-100/40 shadow-sm">
                    <button
                      onClick={prevMonth}
                      className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-display font-black text-sm sm:text-base text-slate-900">
                      {MONTHS_2026[currentMonthIndex]} {year}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors cursor-pointer"
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
                            Schedule on {MONTHS_2026[currentMonthIndex]} {selectedDayNumber}, {year}
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
              )}

              {/* TAB 2: Official Calendar Poster / Upload Box */}
              {activeTab === "poster" && (
                <div className="bg-white border border-indigo-100/50 rounded-2xl p-4 shadow-inner min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                  {calendarImage ? (
                    <div className="space-y-4 w-full text-center">
                      <img 
                        src={calendarImage} 
                        alt="Official School Academic Calendar" 
                        className="max-h-[360px] w-auto mx-auto rounded-xl object-contain border border-indigo-50 shadow-sm"
                      />
                      <p className="text-[11px] text-slate-400 font-semibold italic">
                        ✓ Custom school calendar image is live on the community board.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8 space-y-5 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-900 text-sm">No Custom Calendar Uploaded</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Standard calendar routines and seasonal events are currently rendering on the sidebar timetable. Admins may upload an official calendar poster anytime.
                        </p>
                      </div>

                      {/* Quick Default CSS Informational view when no image */}
                      <div className="bg-[#FAF9F6] border border-indigo-50 p-4 rounded-xl text-left space-y-2">
                        <span className="text-[9px] font-mono font-black text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          2083 Calendar Highlights
                        </span>
                        <ul className="text-[10.5px] text-slate-600 space-y-1.5 font-semibold">
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                            <span>Baishakh: New Admission Intake Cycles</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                            <span>Ashadh: Mid-Term Assessments</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                            <span>Dashain & Tihar holiday recesses</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                    onClick={handleAIParseCalendar}
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
                    You are in <strong className="text-indigo-600">Administrator View</strong>. You can upload or replace the main calendar image immediately below.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <label className="flex-grow flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs px-5 py-3 rounded-xl cursor-pointer shadow-md shadow-indigo-100 transition-all select-none">
                    <Upload className="w-4 h-4 text-pink-300" />
                    <span>UPLOAD CALENDAR IMAGE</span>
                    <input 
                      type="file" 
                      accept="image/*" 
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
                  * Note: School administrators can log into the Secretariat cabinet to upload an official printed school calendar image.
                </p>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Upcoming School Events and Lists */}
          <div className="lg:col-span-5 bg-white border border-indigo-100 p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/5 space-y-6 text-left flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-50/70 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">Key Events Timeline</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Academic & Co-Curricular (Chronological)</p>
                  </div>
                </div>
              </div>

              {/* Event Lists with scroll */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((evt) => (
                    <div 
                      key={evt.id}
                      className="bg-[#FAF9F6] border border-indigo-50/80 p-4 rounded-2xl space-y-2 hover:border-indigo-150 transition-all duration-300 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-indigo-700 font-black bg-indigo-50 border border-indigo-100/50 py-0.5 px-2 rounded uppercase tracking-wider">
                          {evt.type}
                        </span>
                        
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono font-bold">
                          <Calendar className="w-3.5 h-3.5 text-slate-450" />
                          <span>{evt.date}</span>
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

                      {/* Admin deletion trigger on event row */}
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
                  <div className="text-center py-10 text-slate-400 text-xs font-semibold">No upcoming events are currently mapped. Add custom ones below.</div>
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
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Event Title..."
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="bg-white border border-indigo-100 p-2 rounded-lg text-slate-850 font-bold focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Date (e.g. July 24, 2026)..."
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
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
    </section>
  );
}
