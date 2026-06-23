import { useState } from "react";
import { 
  Megaphone, Calendar, User, Search, Pin, 
  ExternalLink, Layers, Eye, Users, ShieldAlert, Sparkles, Filter, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Notice, NoticeCategory } from "../types";

interface NoticeBoardProps {
  notices: Notice[];
  onOpenAdminMode: () => void;
  isAdminMode: boolean;
}

export default function NoticeBoard({ notices, onOpenAdminMode, isAdminMode }: NoticeBoardProps) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [filterCategory, setFilterCategory] = useState<NoticeCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: (NoticeCategory | "All")[] = ["All", "Academic", "Event", "Exam", "Result", "Holiday"];

  // Filtering Notices based on constraints
  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = filterCategory === "All" || notice.category === filterCategory;
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Divide into Pinned & Unpinned. Pinned always goes first!
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Otherwise chronological descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const getCategoryTheme = (category: NoticeCategory) => {
    switch (category) {
      case "Academic": return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
      case "Event": return "bg-purple-50 text-purple-600 border-purple-200/50";
      case "Exam": return "bg-amber-50 text-amber-600 border-amber-200/50";
      case "Result": return "bg-pink-50 text-pink-600 border-pink-200/50";
      case "Holiday": return "bg-rose-50 text-rose-600 border-rose-200/50";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <section className="py-24 px-4 bg-white/70 backdrop-blur-md bg-dot-grid" id="notice-board">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-indigo-50/50">
          <div className="text-left space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
              Notice Board
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Announcements & Notices Center
            </h2>
            <p className="text-slate-500 font-medium text-sm max-w-xl leading-normal">
              Browse public directives, terminal exam schedules, student results, and cultural calendars published directly by Shristi Academy school administration.
            </p>
          </div>
          
          {/* Quick CMS Access Widget banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white p-5 rounded-[24px] shadow-lg shadow-indigo-150 border border-indigo-800/40 flex items-center space-x-4 max-w-sm shrink-0">
            <div className="p-2.5 bg-white/10 text-pink-300 rounded-2xl shadow-inner">
              <Megaphone className="w-5.5 h-5.5 animate-pulse text-pink-300" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white leading-normal">CMS Staff Entry Point</p>
              <button 
                onClick={onOpenAdminMode}
                className="text-[11px] text-pink-300 font-bold flex items-center hover:underline cursor-pointer tracking-wider"
              >
                <span>Access Creator Panel</span>
                <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF9F6] p-4 rounded-3xl border border-indigo-50/50 font-sans shadow-sm">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search announcements, audience, titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-slate-800 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold shadow-inner"
            />
          </div>

          {/* Filtering buttons list */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            <div className="flex items-center space-x-1.5 text-slate-400 mr-2 text-xs font-mono font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Category:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  filterCategory === cat
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-100"
                    : "bg-white text-slate-600 hover:text-indigo-600 border border-indigo-50/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Grid of notice cards */}
        {sortedNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <AnimatePresence mode="popLayout">
              {sortedNotices.map((notice, index) => {
                const categoryClass = getCategoryTheme(notice.category);
                return (
                  <motion.div
                    key={notice.id}
                    layoutId={`notice-card-${notice.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => setSelectedNotice(notice)}
                    className={`bg-white border rounded-[32px] p-6 flex flex-col justify-between shadow-xl shadow-indigo-100/10 cursor-pointer hover:shadow-2xl hover:border-indigo-250 hover:shadow-indigo-100/40 transition-all group ${
                      notice.pinned 
                        ? "border-pink-200 bg-pink-50/10 ring-1 ring-pink-500/10" 
                        : "border-indigo-50/50"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Meta information row */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold font-mono tracking-wider rounded-lg border uppercase ${categoryClass}`}>
                            {notice.category}
                          </span>
                          
                          {/* target constraints */}
                          <span className="flex items-center text-[10px] text-slate-400 font-mono font-bold">
                            <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {notice.targetAudience}
                          </span>
                        </div>

                        {/* PIN badge */}
                        {notice.pinned && (
                          <span className="flex items-center text-xs font-black text-pink-600 font-mono tracking-wide shrink-0">
                            <Pin className="w-3.5 h-3.5 text-pink-500 mr-1 rotate-45 fill-pink-500" />
                            PINNED
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h3 className="font-display font-black text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-[1.3]">
                        {notice.title}
                      </h3>

                      {/* Short snippet */}
                      <p className="text-[12px] text-slate-500 leading-relaxed font-semibold line-clamp-3">
                        {notice.content}
                      </p>
                    </div>

                    {/* Bottom Metadata row */}
                    <div className="mt-6 pt-4 border-t border-indigo-55/40 flex items-center justify-between text-[11px] text-slate-400 font-mono font-semibold">
                      <div className="flex items-center space-x-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{notice.date}</span>
                      </div>
                      
                      <button className="text-indigo-600 group-hover:text-indigo-500 flex items-center font-extrabold text-[11px]">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Read Notice</span>
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-[#FAF9F6] border border-dashed border-indigo-100 text-center py-16 px-4 rounded-3xl max-w-lg mx-auto shadow-sm">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-sm text-slate-700">No Announcements Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no notices matching your choice of category or search text criteria. Try broadening your keywords.
            </p>
          </div>
        )}

      </div>

      {/* Notice Detail MODAL Popup overlay */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotice(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Body card */}
            <motion.div
              layoutId={`notice-card-${selectedNotice.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-left max-w-2xl w-full rounded-[32px] overflow-hidden shadow-2xl border border-indigo-50 p-6 md:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              
              {/* Close button */}
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tag header */}
              <div className="flex flex-wrap items-center gap-2 pr-6">
                <span className={`px-2.5 py-1 text-[10px] font-extrabold font-mono tracking-wider rounded-lg border uppercase ${getCategoryTheme(selectedNotice.category)}`}>
                  {selectedNotice.category}
                </span>
                
                {/* target constraints */}
                <span className="flex items-center text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100 font-bold">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Target: <strong className="text-slate-600">{selectedNotice.targetAudience}</strong>
                </span>

                {selectedNotice.pinned && (
                  <span className="flex items-center text-[10px] font-black text-pink-600 font-mono bg-pink-50 px-2.5 py-1 rounded-md border border-pink-100">
                    <Pin className="w-3 h-3 text-pink-500 mr-1 fill-pink-500 rotate-45" />
                    PINNED DIRECTIVE
                  </span>
                )}
              </div>

              {/* Title heading */}
              <div className="space-y-2">
                <h3 className="font-display font-black text-xl md:text-2xl text-slate-900 tracking-tight leading-tight">
                  {selectedNotice.title}
                </h3>

                {/* Author and Date metadata */}
                <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono font-bold">
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Published By: <strong className="text-slate-600">{selectedNotice.author}</strong></span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date: <strong className="text-slate-600">{selectedNotice.date}</strong></span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-indigo-50" />

              {/* Core Notice Content text */}
              <div className="space-y-4">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>

              {/* Stamp of Authentic Seal */}
              <div className="bg-indigo-50/40 p-4 border border-indigo-100 rounded-2xl flex items-center justify-between gap-4 font-sans">
                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-black text-indigo-800 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600 fill-indigo-200" />
                    Certified Public Release
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Mid-Baneshwor, Kathmandu Academic Affairs Stamp: 025/2083
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="border border-dashed border-indigo-400 text-indigo-600 font-mono font-bold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded transform rotate-[-4deg]">
                    AUTHENTIC RELEASE
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs font-sans cursor-pointer transition-colors shadow-md shadow-indigo-100"
                >
                  Close Announcement
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
