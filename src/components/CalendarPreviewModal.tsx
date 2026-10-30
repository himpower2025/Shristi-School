import React, { useState } from "react";
import { 
  Calendar, Clock, MapPin, X, ExternalLink, Sparkles, 
  FileText, CheckCircle2, ChevronRight, Download, Eye, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SchoolEvent } from "../types";

interface CalendarPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: SchoolEvent[];
  calendarPoster: string | null;
  onOpenLiveWebsite?: () => void;
}

export default function CalendarPreviewModal({
  isOpen,
  onClose,
  events,
  calendarPoster,
  onOpenLiveWebsite,
}: CalendarPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"events" | "poster">("events");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Academic", "Sports", "Excursion", "Ceremony"];
  const filteredEvents = events.filter(
    (evt) => categoryFilter === "All" || evt.type === categoryFilter
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[28px] sm:rounded-[36px] shadow-2xl border border-indigo-150 flex flex-col overflow-hidden text-left"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-indigo-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Calendar className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-display font-black text-lg text-white">
                    Live Calendar Website Preview
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded-full">
                    ● Live on Site
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  This is the exact view parents and students see on the school website.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onOpenLiveWebsite && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLiveWebsite();
                  }}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  title="View full interactive calendar on website"
                >
                  <span>Open Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader Navigation / Tabs */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "events"
                    ? "bg-white text-indigo-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📅 Academic Events ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("poster")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "poster"
                    ? "bg-white text-indigo-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📄 Official Calendar Poster {calendarPoster ? "✓" : ""}
              </button>
            </div>

            {activeTab === "events" && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-slate-400 mr-1 uppercase">Filter:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-grow space-y-4">
            {activeTab === "events" ? (
              <div>
                {filteredEvents.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl space-y-2">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-sm text-slate-700">No scheduled events found</p>
                    <p className="text-xs text-slate-400">
                      {categoryFilter !== "All"
                        ? `No events currently match the "${categoryFilter}" filter.`
                        : "You can add new exams, vacations, and sports events in the Academic Calendar tab."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                              evt.type === "Sports"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : evt.type === "Excursion"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : evt.type === "Ceremony"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            }`}
                          >
                            {evt.type}
                          </span>

                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-slate-800 block">
                              {evt.endDate ? `${evt.date} ~ ${evt.endDate}` : evt.date}
                            </span>
                            {evt.endDate && (
                              <span className="text-[9px] font-mono font-bold text-amber-600 block">
                                Multi-day Vacation / Exam
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {evt.title}
                          </h4>
                          {evt.description && (
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                              {evt.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                          {evt.time && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>{evt.time}</span>
                            </span>
                          )}
                          {evt.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{evt.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {calendarPoster ? (
                  <div className="space-y-3">
                    <div className="bg-slate-900/5 p-3 rounded-2xl border border-slate-200 flex items-center justify-center">
                      <img
                        src={calendarPoster}
                        alt="Official Printed School Calendar Poster"
                        className="max-h-[60vh] object-contain rounded-xl shadow-lg border border-slate-300"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>This official poster is currently published on the school website.</span>
                      </div>
                      <a
                        href={calendarPoster}
                        download="Shristi_Academy_Academic_Calendar_2083.jpg"
                        className="px-3.5 py-1.5 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Poster</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl space-y-2">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-sm text-slate-700">No Calendar Poster Uploaded</p>
                    <p className="text-xs text-slate-400">
                      Upload your official school calendar poster image or PDF in the Academic Calendar tab.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Any updates you make in the Admin Portal are instantly synchronized.</span>
            </p>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              {onOpenLiveWebsite && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLiveWebsite();
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Go to Live Website Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
