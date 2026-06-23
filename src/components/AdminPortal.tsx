import { useState, FormEvent } from "react";
import { 
  Lock, Unlock, ShieldAlert, Sparkles, Send, FileEdit, 
  Trash2, Plus, Megaphone, Users, Calendar, ArrowRight, UserCheck, CheckCircle2, Bookmark, Info, CircleAlert, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Notice, NoticeCategory, AdmissionQuery, SuggestionInquiry } from "../types";

interface AdminPortalProps {
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onUpdateNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  admissions: AdmissionQuery[];
  onUpdateAdmissionStatus: (id: string, state: "Pending" | "Contacted" | "Approved") => void;
  authorizedAdmins: string[];
  onAddAuthorizedAdmin: (email: string) => void;
  onDeleteAuthorizedAdmin: (email: string) => void;
  suggestions: SuggestionInquiry[];
  onAddReply: (id: string, reply: string) => void;
  onDeleteSuggestion: (id: string) => void;
}

export default function AdminPortal({ 
  notices, 
  onAddNotice, 
  onUpdateNotice, 
  onDeleteNotice,
  admissions,
  onUpdateAdmissionStatus,
  authorizedAdmins,
  onAddAuthorizedAdmin,
  onDeleteAuthorizedAdmin,
  suggestions,
  onAddReply,
  onDeleteSuggestion
}: AdminPortalProps) {
  // Login Gate State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedEmail, setLoggedEmail] = useState("");

  // CMS Tabs State variables
  const [cmsTab, setCmsTab] = useState<"ManageNo" | "WritePost" | "Admit" | "Admins" | "ParentsVoice">("ManageNo");

  // Dynamic admin add input field
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // Notices Edit State variables
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  // Form Field State variables
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<NoticeCategory>("Academic");
  const [postAudience, setPostAudience] = useState("All Classes");
  const [postAuthor, setPostAuthor] = useState("Administration");
  const [postPinned, setPostPinned] = useState(false);

  // Admin reply edit mapping
  const [adminReplyTexts, setAdminReplyTexts] = useState<Record<string, string>>({});

  // Helper login check
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const isAuthorized = authorizedAdmins.some(adminEmail => adminEmail.trim().toLowerCase() === cleanEmail);
    if (isAuthorized && password === "Nmo#2009") {
      setIsLoggedIn(true);
      setLoggedEmail(cleanEmail);
      setLoginError("");
    } else {
      setLoginError("Access denied. Please check your dynamic admin email or default password (Nmo#2009).");
    }
  };

  const autofillDemo = () => {
    setEmail("info@shristiacademy.edu.np");
    setPassword("Nmo#2009");
    setLoginError("");
  };

  const handleCreateOrUpdateNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      alert("Please fill in Title and Content fields.");
      return;
    }

    const todayDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });

    if (editingNoticeId) {
      // Find original notice
      const original = notices.find(n => n.id === editingNoticeId);
      if (original) {
        const updated: Notice = {
          ...original,
          title: postTitle,
          content: postContent,
          category: postCategory,
          targetAudience: postAudience,
          author: postAuthor,
          pinned: postPinned,
          date: todayDate // updated
        };
        onUpdateNotice(updated);
        setEditingNoticeId(null);
      }
    } else {
      const created: Notice = {
        id: "notice-" + Date.now(),
        title: postTitle,
        content: postContent,
        category: postCategory,
        targetAudience: postAudience,
        author: postAuthor,
        pinned: postPinned,
        date: todayDate
      };
      onAddNotice(created);
    }

    // Reset Form Fields
    setPostTitle("");
    setPostContent("");
    setPostCategory("Academic");
    setPostAudience("All Classes");
    setPostAuthor("Administration");
    setPostPinned(false);
    
    // Switch Tab to manage list
    setCmsTab("ManageNo");
  };

  const handleEditNoticeClick = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setPostTitle(notice.title);
    setPostContent(notice.content);
    setPostCategory(notice.category);
    setPostAudience(notice.targetAudience);
    setPostAuthor(notice.author);
    setPostPinned(notice.pinned);
    
    // Switch to Write Tab
    setCmsTab("WritePost");
  };

  const cancelEditing = () => {
    setEditingNoticeId(null);
    setPostTitle("");
    setPostContent("");
    setPostCategory("Academic");
    setPostAudience("All Classes");
    setPostAuthor("Administration");
    setPostPinned(false);
    setCmsTab("ManageNo");
  };

  return (
    <div className="py-24 px-4 bg-[#FAF9F6] border-t border-indigo-100 text-slate-850 font-sans min-h-[85vh] bg-dot-grid">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            
            /* SECURE ACCESS CREDENTIALS GATE */
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 border border-indigo-100 rounded-[32px] shadow-2xl shadow-indigo-100 relative overflow-hidden text-left space-y-6">
                
                {/* Visual Glare */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-pink-500/10 blur-xl pointer-events-none" />

                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">Shristi Staff Center</h3>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest font-black">AUTHORIZED PERSONNEL ONLY</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100/55 rounded-2xl flex items-start space-x-3">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                    You must be registered as a certified teacher, administrative clerk, secondary supervisor, or senior principal to update public directives.
                  </p>
                </div>

                {/* Form fields */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">EMAIL OR USERNAME</label>
                    <input
                      required
                      type="text"
                      placeholder="info@shristiacademy.edu.np"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/25 font-mono font-bold shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">ADMIN ACCESS PASSWORD</label>
                    <input
                      required
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/25 font-mono font-bold shadow-inner"
                    />
                  </div>

                  {loginError && (
                    <div className="text-pink-600 text-xs font-mono font-bold flex items-center space-x-1.5">
                      <CircleAlert className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs font-mono rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:translate-y-[-2px]"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>VERIFY ACCESS PASS</span>
                  </button>
                </form>

                <div className="h-[1px] bg-indigo-50 my-2" />

                {/* Autofill helper for demo convenience */}
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 mb-2 font-semibold">Want to simulate a Principal's workspace?</p>
                  <button
                    type="button"
                    onClick={autofillDemo}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100/50 text-indigo-700 text-xs font-extrabold rounded-xl border border-indigo-100/40 cursor-pointer transition-all"
                  >
                    ⚡ Fast-Fill Principal Account (Vani Pradhan)
                  </button>
                </div>

              </div>
            </motion.div>

          ) : (

            /* AUTHORIZED CMS WORKSPACE */
            <motion.div 
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 text-left"
            >
              
              {/* Dashboard header banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-indigo-100 rounded-[32px] shadow-sm shadow-indigo-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-100">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">Shristi Academy Admin (Cabinet)</h2>
                    <p className="text-[11px] text-indigo-600 font-mono font-bold">Status: <span className="text-pink-650 font-black">{loggedEmail}</span> Logged In • Live Sync Active</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    Secure Logout
                  </button>
                </div>
              </div>

              {/* CRM Navigation Tabs */}
              <div className="flex space-x-2 border-b border-indigo-50/50 pb-2 overflow-x-auto whitespace-nowrap">
                <button
                  onClick={() => setCmsTab("ManageNo")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                    cmsTab === "ManageNo"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  📰 ANNOUNCEMENTS ({notices.length})
                </button>
                
                <button
                  onClick={() => setCmsTab("WritePost")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                    cmsTab === "WritePost"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  {editingNoticeId ? "✏️ EDIT NOTICE" : "➕ CREATE NOTICE"}
                </button>

                <button
                  onClick={() => setCmsTab("Admit")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                    cmsTab === "Admit"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  🎓 ADMISSIONS ({admissions.length})
                </button>

                <button
                  onClick={() => setCmsTab("Admins")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                    cmsTab === "Admins"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  👥 MANAGE ADMINS ({authorizedAdmins.length})
                </button>

                <button
                  onClick={() => setCmsTab("ParentsVoice")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer ${
                    cmsTab === "ParentsVoice"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  💬 PARENTS' VOICE ({suggestions.length})
                </button>
              </div>

              {/* Tab Outputs */}
              <div className="min-h-[400px]">
                
                {/* TAB 1: MANAGE PUBLIC NOTICES */}
                {cmsTab === "ManageNo" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 border border-indigo-100/50 rounded-2xl shadow-sm">
                      <p className="text-xs text-slate-500 font-bold font-mono">
                        Showing all current notices active on the Shristi public home board.
                      </p>
                      <button
                        onClick={() => setCmsTab("WritePost")}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>QUICK CREATE</span>
                      </button>
                    </div>

                    {notices.length > 0 ? (
                      <div className="overflow-x-auto bg-white border border-indigo-100 rounded-[28px] shadow-xl shadow-indigo-100/10">
                        <table className="w-full text-slate-800 font-sans text-xs text-left min-w-[700px]">
                          <thead className="bg-[#FAF9F6] text-slate-500 font-mono font-bold text-[10px] tracking-wider border-b border-indigo-50 uppercase">
                            <tr>
                              <th className="py-4 px-6">STAFF STATE</th>
                              <th className="py-4 px-6">NOTICE FILE TITLE</th>
                              <th className="py-4 px-6">CATEGORY</th>
                              <th className="py-4 px-6">AUDIENCE TARGET</th>
                              <th className="py-4 px-6 text-right">METRIC ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-50/50 font-bold text-slate-600">
                            {notices.map((notice) => (
                              <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-6 font-mono font-bold">
                                  {notice.pinned ? (
                                    <span className="inline-flex items-center text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-black">
                                      PINNED
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">NORMAL</span>
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  <div>
                                    <span className="font-extrabold text-slate-900 text-sm block leading-snug">{notice.title}</span>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase mt-0.5 block">{notice.date} • {notice.author}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[10px] uppercase font-mono font-black">
                                    {notice.category}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-mono text-slate-500 font-bold">
                                  {notice.targetAudience}
                                </td>
                                <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                                  
                                  {/* Toggle Pin Action button */}
                                  <button
                                    onClick={() => {
                                      onUpdateNotice({ ...notice, pinned: !notice.pinned });
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-extrabold ${
                                      notice.pinned 
                                        ? "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100" 
                                        : "bg-white border-indigo-100 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                                    }`}
                                    title="Toggle Pin state"
                                  >
                                    PIN
                                  </button>

                                  <button
                                    onClick={() => handleEditNoticeClick(notice)}
                                    className="p-2 bg-white border border-indigo-100 text-purple-650 rounded-lg hover:border-purple-300 hover:bg-purple-50"
                                    title="Edit Notice details"
                                  >
                                    <FileEdit className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete: "${notice.title}"?`)) {
                                        onDeleteNotice(notice.id);
                                      }
                                    }}
                                    className="p-2 bg-white border border-indigo-100 text-rose-500 rounded-lg hover:border-rose-300 hover:bg-rose-50"
                                    title="Delete notice Permanent"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-white p-12 text-center rounded-[32px] border border-indigo-100 shadow-xl shadow-indigo-150/10">
                        <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="font-bold text-slate-700">No announcements in list</h4>
                        <p className="text-xs text-slate-400 mt-1">Start by writing a fresh notice using the creator form tab!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: WRITE / POST / EDIT FORM */}
                {cmsTab === "WritePost" && (
                  <form onSubmit={handleCreateOrUpdateNotice} className="bg-white border border-indigo-100 p-6 md:p-8 rounded-[32px] shadow-2xl space-y-6 max-w-3xl mx-auto text-left font-sans">
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-display font-black text-lg text-slate-900">
                          {editingNoticeId ? "Modify Announcement Properties" : "Formulate New Public Notice"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
                          {editingNoticeId ? "Original notices will be modified with today's date" : "Approved notices will instantly appear on the front page noticeboard"}
                        </p>
                      </div>
                      {editingNoticeId && (
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-rose-600 rounded-lg border border-indigo-100 text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Cancel / Reset
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Notice Title */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase">ANNOUNCEMENT TITLE *</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Science Board Internal Evaluation Dates & Guidelines"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>

                      {/* Notice Category */}
                      <div className="space-y-1.5 animate-none">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase">NOTICE CATEGORY</label>
                        <select
                          value={postCategory}
                          onChange={(e) => setPostCategory(e.target.value as NoticeCategory)}
                          className="w-full bg-white border border-indigo-100 p-3.5 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600"
                        >
                          <option value="Academic">Academic</option>
                          <option value="Event">Event</option>
                          <option value="Exam">Exam</option>
                          <option value="Result">Result</option>
                          <option value="Holiday">Holiday</option>
                        </select>
                      </div>

                      {/* Notice Target Audience */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase">TARGET AUDIENCE CLASS</label>
                        <input
                          type="text"
                          placeholder="Grade 11 & 12, Parents, All Classes"
                          value={postAudience}
                          onChange={(e) => setPostAudience(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>

                      {/* Publisher Author */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase">PUBLISHER NAME</label>
                        <input
                          type="text"
                          placeholder="Exam Controller Sila Sapkota, Administrative Office"
                          value={postAuthor}
                          onChange={(e) => setPostAuthor(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>

                      {/* Pin to Top Checkbox */}
                      <div className="flex items-center space-x-3 bg-[#FAF9F6] border border-indigo-100 p-3 rounded-xl">
                        <input
                          id="form-pin-checkbox"
                          type="checkbox"
                          checked={postPinned}
                          onChange={(e) => setPostPinned(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 bg-white rounded border-indigo-100 focus:ring-indigo-500 focus:ring-opacity-25"
                        />
                        <label htmlFor="form-pin-checkbox" className="text-xs font-mono font-bold text-slate-500 select-none cursor-pointer">
                          HIGHLIGHT PINNED NOTICE TO TOP
                        </label>
                      </div>

                      {/* Content Area */}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase">ANNOUNCEMENT TEXT CONTENTS *</label>
                        <textarea
                          required
                          rows={6}
                          placeholder="Write the public message directives here. Detail out timetables, regulations, dates, and instructions clearly..."
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs text-slate-850 font-bold focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>

                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      {editingNoticeId && (
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-mono font-bold cursor-pointer border border-indigo-100"
                        >
                          CANCEL EDIT
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs font-mono rounded-xl shadow-md cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{editingNoticeId ? "PUBLISH MODIFIED NOTICE" : "POST ANNOUNCEMENT BOARD"}</span>
                      </button>
                    </div>

                  </form>
                )}

                {/* TAB 3: ADMISSIONS SUBMISSIONS DIRECTORY */}
                {cmsTab === "Admit" && (
                  <div className="space-y-4 text-left font-sans">
                    <div className="bg-white p-5 border border-indigo-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1 font-sans">
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-indigo-600" />
                          Admissions Leads Pipeline
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-normal font-medium">
                          These represent interactive online admissions queries filled out by parents and prospective students. Call them directly to process physical campus registrations.
                        </p>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 py-1.5 px-3 rounded-xl text-[10px] text-indigo-700 font-mono font-bold whitespace-nowrap">
                        Academic Term: <strong>2083/2084 session</strong>
                      </div>
                    </div>

                    {admissions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {admissions.map((admit) => (
                          <div 
                            key={admit.id} 
                            className="bg-white border border-indigo-100/50 p-6 rounded-[28px] flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-300 relative shadow-sm"
                          >
                            <div className="space-y-3.5">
                              {/* Header Metadata */}
                              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                                <span>{admit.submittedAt}</span>
                                
                                <span className={`px-2.5 py-0.5 rounded-lg border font-black uppercase text-[9px] tracking-wider ${
                                  admit.status === "Approved" 
                                    ? "bg-indigo-50 border-indigo-150 text-indigo-600" 
                                    : admit.status === "Contacted"
                                      ? "bg-purple-50 border-purple-150 text-purple-600"
                                      : "bg-amber-50 border-amber-150 text-amber-600"
                                }`}>
                                  {admit.status}
                                </span>
                              </div>

                              {/* Student Details */}
                              <div className="space-y-1">
                                <h4 className="text-base font-black text-slate-905 font-display tracking-tight leading-normal">
                                  {admit.studentName}
                                </h4>
                                <p className="text-xs text-slate-500 font-semibold">
                                  Parent name: <strong className="text-slate-800">{admit.parentName}</strong>
                                </p>
                              </div>

                              {/* Table specs */}
                              <div className="grid grid-cols-2 gap-y-3 text-xs font-bold pt-2 text-slate-500 border-t border-indigo-50/50">
                                <div>
                                  <span className="block text-[9px] text-slate-400 uppercase font-mono">Grade Applied</span>
                                  <span className="font-bold text-slate-800 text-xs">{admit.gradeOfInterest}</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] text-slate-400 uppercase font-mono">Mobile Contact</span>
                                  <span className="font-mono font-bold text-indigo-600 leading-normal text-xs">{admit.mobileNo}</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] text-slate-400 uppercase font-mono">Previous School</span>
                                  <span className="truncate block font-bold text-slate-600 text-xs">{admit.previousSchool || "N/A"}</span>
                                </div>
                                <div>
                                  <span className="block text-[9px] text-slate-400 uppercase font-mono">District</span>
                                  <span className="font-bold text-slate-600 text-xs">{admit.district || "Bhaktapur"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions state cycler */}
                            <div className="pt-4 border-t border-indigo-50/50 flex justify-between items-center text-xs">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">CYCLE STATE:</span>
                              
                              <div className="flex space-x-1.5 font-mono text-[10px] font-bold">
                                <button
                                  onClick={() => onUpdateAdmissionStatus(admit.id, "Pending")}
                                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${admit.status === "Pending" ? "bg-amber-500 text-slate-950 font-bold border border-amber-500/10 shadow-sm" : "bg-slate-100 text-slate-500 hover:text-indigo-600"}`}
                                >
                                  PEND
                                </button>
                                <button
                                  onClick={() => onUpdateAdmissionStatus(admit.id, "Contacted")}
                                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${admit.status === "Contacted" ? "bg-purple-600 text-white font-bold shadow-sm" : "bg-slate-100 text-slate-500 hover:text-indigo-600"}`}
                                >
                                  CALL
                                </button>
                                <button
                                  onClick={() => onUpdateAdmissionStatus(admit.id, "Approved")}
                                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${admit.status === "Approved" ? "bg-indigo-600 text-white font-bold shadow-sm" : "bg-slate-100 text-slate-500 hover:text-indigo-600"}`}
                                >
                                  APPROVE
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-12 text-center rounded-[32px] border border-indigo-100 shadow-xl shadow-indigo-150/10">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <h4 className="font-bold text-slate-700 font-sans">No Admission Applicants Yet</h4>
                        <p className="text-xs text-slate-400 mt-1">Registrations will propagate here as soon as users complete the admissions wizard!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: AUTHORIZED ADMINS LIST */}
                {cmsTab === "Admins" && (
                  <div className="space-y-6 text-left font-sans">
                    <div className="bg-white p-5 border border-indigo-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                          <Users className="w-4 h-4 mr-1.5 text-indigo-600" />
                          Dynamic Administrator Clearance
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-normal font-medium">
                          Manage and authorize secondary emails for logins. The password for all registered administrators is <strong className="text-[#3B2C83]">Nmo#2009</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Add Admin Email Form */}
                    <div className="bg-white p-6 border border-indigo-50 rounded-[28px] shadow-sm space-y-4">
                      <h4 className="text-xs font-mono font-bold text-slate-500 uppercase">Authorize New Administrator Email</h4>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                        <input
                          type="email"
                          placeholder="e.g. viceprincipal@shristyacademy.edu.np"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="flex-grow bg-[#FAF9F6] border border-indigo-100 p-3 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = newAdminEmail.trim().toLowerCase();
                            if (!trimmed) {
                              alert("Please specify a valid email address.");
                              return;
                            }
                            if (!trimmed.includes("@")) {
                              alert("Please enter a valid email format.");
                              return;
                            }
                            if (authorizedAdmins.some(ad => ad.toLowerCase() === trimmed)) {
                              alert("This email is already registered and authorized.");
                              return;
                            }
                            onAddAuthorizedAdmin(trimmed);
                            setNewAdminEmail("");
                          }}
                          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black text-xs rounded-xl cursor-pointer shadow-sm"
                        >
                          AUTHORIZE EMAIL
                        </button>
                      </div>
                    </div>

                    {/* Table listing admins */}
                    <div className="bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-bold text-slate-600 min-w-[600px]">
                          <thead className="bg-[#FAF9F6] text-[10px] text-slate-400 font-mono tracking-wider border-b border-indigo-50 uppercase">
                            <tr>
                              <th className="py-4 px-6">AUTHORIZED ADMIN EMAIL ADDRESSES</th>
                              <th className="py-4 px-6">MEMBERSHIP CLEARANCE LEVEL</th>
                              <th className="py-4 px-6 text-right">METRIC REVOKES</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-50/50 text-slate-700">
                            {authorizedAdmins.map((emailItem, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4 px-6 font-mono font-black text-slate-800">
                                  {emailItem}
                                </td>
                                <td className="py-4 px-6">
                                  {emailItem === "info@shristiacademy.edu.np" ? (
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Primary Founder Account</span>
                                  ) : (
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-550 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Delegated Staff Admin</span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-right w-36">
                                  {emailItem !== "info@shristiacademy.edu.np" ? (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Revoke administrator access privileges for ${emailItem}?`)) {
                                          onDeleteAuthorizedAdmin(emailItem);
                                        }
                                      }}
                                      className="text-pink-600 hover:text-pink-850 font-mono text-[10px] bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg border border-pink-100 cursor-pointer font-bold"
                                    >
                                      Revoke Access
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-mono italic pr-3 font-semibold">Primary Core Locked</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: PUBLIC PARENTS' VOICE SUGGESTIONS AND REPLIES */}
                {cmsTab === "ParentsVoice" && (
                  <div className="space-y-6 text-left font-sans">
                    <div className="bg-white p-5 border border-indigo-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                          <HelpCircle className="w-4 h-4 mr-1.5 text-indigo-600" />
                          Parents' Shared Directives & Clarifications
                        </h4>
                        <p className="text-[11px] text-slate-505 leading-normal font-medium flex items-center">
                          Inspect suggestions and dry-run feedback sent in by parents. Write instant replies to resolve inquiries on the public board.
                        </p>
                      </div>
                    </div>

                    {suggestions.length > 0 ? (
                      <div className="space-y-6">
                        {suggestions.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-white border border-indigo-150 p-6 rounded-[28px] shadow-sm space-y-4 hover:border-indigo-300 transition-all duration-300"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold border-b border-indigo-50/50 pb-3">
                              <span>Submitted on: {item.submittedAt}</span>
                              <span className="bg-purple-100/50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-100 font-mono">
                                Category: {item.category}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-black text-slate-900 leading-snug font-display">
                                  {item.title}
                                </h4>
                                <span className="text-[10px] font-mono text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 whitespace-nowrap font-black">
                                  Parent PIN: {item.pin}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                Filed by: <strong className="text-slate-800">{item.parentName}</strong>
                              </p>
                            </div>

                            <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/20">
                              <p className="text-xs font-bold text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {item.content}
                              </p>
                            </div>

                            {/* Replies Section in Admin board */}
                            <div className="space-y-2 border-t border-indigo-50/60 pt-4">
                              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 font-black">
                                Cabinet Response:
                              </span>

                              {item.adminReply ? (
                                <div className="p-4 bg-emerald-50/50 border border-emerald-105 text-slate-800 rounded-2xl text-xs space-y-1">
                                  <p className="font-bold">"{item.adminReply}"</p>
                                  <span className="block text-[9px] font-mono text-emerald-600 font-black uppercase">
                                    ✓ Replied on: {item.repliedAt || "Live Portal"}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 font-medium italic">No active reply rendered yet.</p>
                              )}

                              {/* Form to submit reply */}
                              <div className="flex gap-2 pt-1.5">
                                <input
                                  type="text"
                                  placeholder={item.adminReply ? "Revise existing response..." : "Type in your official response..."}
                                  value={adminReplyTexts[item.id] || ""}
                                  onChange={(e) => setAdminReplyTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="flex-grow bg-[#FAF9F6] border border-indigo-100 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const replyText = adminReplyTexts[item.id];
                                    if (!replyText || !replyText.trim()) return;
                                    onAddReply(item.id, replyText);
                                    setAdminReplyTexts(prev => ({ ...prev, [item.id]: "" }));
                                  }}
                                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-black tracking-wide cursor-pointer font-bold"
                                >
                                  PUBLISH RESPONSE
                                </button>
                              </div>
                            </div>

                            {/* Deletes */}
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  if (confirm("Permanently wipe this suggestion from Shristi databases?")) {
                                    onDeleteSuggestion(item.id);
                                  }
                                }}
                                className="text-pink-600 hover:text-pink-850 font-mono text-[10px] bg-pink-50 hover:bg-pink-100 border border-pink-100 px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer font-bold"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Purge Inquiry Record</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-12 text-center rounded-[32px] border border-indigo-100 text-slate-400">
                        No parental voice feedback records filed yet.
                      </div>
                    )}
                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
