import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Upload, Trash2, Plus, 
  FileText, CalendarDays, Eye, RefreshCw, AlertCircle, Info, Download, Trash
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

export default function ToolsSection({ isAdmin = false }: ToolsSectionProps) {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [calendarImage, setCalendarImage] = useState<string | null>(null);
  
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

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCalendarImage(base64String);
      localStorage.setItem("shristi_calendar_uploaded_image", base64String);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded calendar image
  const handleRemoveImage = () => {
    if (confirm("Are you sure you want to remove the custom uploaded calendar? It will revert to the default school bulletin display.")) {
      setCalendarImage(null);
      localStorage.removeItem("shristi_calendar_uploaded_image");
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
    }
  };

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
          
          {/* LEFT COLUMN: School Calendar Image Board & Uploader */}
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-indigo-50/70 p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/5 space-y-6 text-left flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50/70 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-xl">
                    <CalendarDays className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">Official Calendar Board</h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Current Session: 2083 Bikram Sambat</p>
                  </div>
                </div>

                {calendarImage && (
                  <a
                    href={calendarImage}
                    download="Shristi_Academy_Academic_Calendar.png"
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-[10px] px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer select-none"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD CALENDAR</span>
                  </a>
                )}
              </div>

              {/* Interactive Upload / Display Box */}
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

            </div>

            {/* Admin Upload controls box */}
            {isAdmin ? (
              <div className="bg-[#FAF9F6]/50 border-t border-indigo-50 pt-5 space-y-3.5">
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
              <div className="border-t border-slate-100 pt-5 text-center sm:text-left">
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
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">Dynamic ECA & Co-Curricular</p>
                  </div>
                </div>
              </div>

              {/* Event Lists with scroll */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {events.length > 0 ? (
                  events.map((evt) => (
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

