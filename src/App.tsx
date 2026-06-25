import { useState, useEffect } from "react";
import { 
  Megaphone, Shield, NotebookText, Users, Landmark, 
  MapPin, CheckCircle, HelpCircle, ArrowUp, Calendar, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Notice, AdmissionQuery, SuggestionInquiry } from "./types";

// Import modular subcomponents
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Academics from "./components/Academics";
import NoticeBoard from "./components/NoticeBoard";
import AdminPortal from "./components/AdminPortal";
import AdmissionForm from "./components/AdmissionForm";
import ToolsSection from "./components/ToolsSection";
import Footer from "./components/Footer";
import WhyShristi from "./components/WhyShristi";
import SuggestionsSection from "./components/SuggestionsSection";

// DEFAULT MOCK NOTICES FOR REALISTIC INITIALIZATION
const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "Urgent: Admissions Open for New Session (Kindergarten to Class 10) - Batch 2083 BS",
    content: "Shristi Academy Secondary School hereby announces that online registration queries are officially open for our Kindergarten class, Primary classes (Class 1-5), Lower Secondary classes (Class 6-8), and Secondary Level (Class 9-10) programs.\n\nProspective parents and pupils are directed to complete our interactive Admissions form on the website or visit our administrative registrar desk in Mid-Baneshwor, Kathmandu for final enrollment and document review.\n\nEntrance examinations and orientations are scheduled to take place on Saturday, June 27, 2026. Complete merit scholarships are available for topper students and underprivileged backgrounds.",
    category: "Academic",
    date: "June 15, 2026",
    targetAudience: "Kindergarten - Class 10",
    author: "Vani Pradhan, Principal",
    pinned: true
  },
  {
    id: "notice-2",
    title: "First Terminal Examinations Timetables Released (Grade 1 - 10)",
    content: "Notice is hereby given to all teachers, parents, and students that the First Terminal Examinations of Shristi Academy for the academic year 2083/2084 are scheduled to begin on Sunday, June 28, 2026.\n\nThe detailed subject-wise routings and examination regulations can be viewed in the downloads section. Students must ensure they clear all due monthly fees and acquire their physical admittance cards from the administrative desk by June 25, 2026.\n\nStudents who do not present a valid physical admit card will be barred from examinations. Daily exams will take place from 10:00 AM to 1:00 PM.",
    category: "Exam",
    date: "June 10, 2026",
    targetAudience: "Grade 1 - 10",
    author: "Exam Controller Office",
    pinned: false
  },
  {
    id: "notice-3",
    title: "Inter-House Athletics Tournaments & ECA Events Board",
    content: "Active sports leagues are starting at Shristi campus! In keeping with our 'Education for Character' core motto, Shristi Sports Guild is hosting the local Inter-House Volleyball, Chess, and Public Speaking leagues starting next week.\n\nAll houses (Lhotse, Everest, Annapurna, and Kanjirowa) must submit their primary sports squads containing boys and girls subgroups to the ECA coordinator's office by Wednesday afternoon.\n\nSpecial prizes and medals will be presented during Bhanu Jayanti. Join to cheer on your housemates!",
    category: "Event",
    date: "June 05, 2026",
    targetAudience: "Grade 6 - 10",
    author: "ECA Coordinator",
    pinned: false
  },
  {
    id: "notice-4",
    title: "Public Vacation Release: Auspicious Occasion of Janai Purnima",
    content: "This is to inform all students, faculty, and clerical staff that Shristi Academy will remain physically closed on Monday on the holy occasion of Jamai Purnima / Raksha Bandhan.\n\nDaily physical classrooms will resume normal timetables from Tuesday, June 23, 2026, conforming to 9:30 AM principal hours.\n\nWe wish a very healthy and blessed festival to our community of parents and pupils.",
    category: "Holiday",
    date: "June 01, 2026",
    targetAudience: "All Classes",
    author: "Administration",
    pinned: false
  }
];

// DEFAULT MOCK APPLICANTS FOR CONVENIENCE REVIEW
const INITIAL_ADMISSIONS: AdmissionQuery[] = [
  {
    id: "admit-101",
    studentName: "Aashish Giri",
    parentName: "Hari Prasad Giri",
    email: "aashish.giri@gmail.com",
    mobileNo: "+977-9851088741",
    gradeOfInterest: "Secondary School (Grade 6 - 10)",
    previousSchool: "Sagarmatha Secondary School, Bhaktapur",
    district: "Bhaktapur",
    submittedAt: "June 16, 2026, 04:30 PM",
    status: "Pending"
  },
  {
    id: "admit-102",
    studentName: "Susmita Dahal",
    parentName: "Badri Dahal",
    email: "susmita.d@outlook.com",
    mobileNo: "+977-9841334415",
    gradeOfInterest: "Primary School (Grade 1 - 5)",
    previousSchool: "Apex High Boarding, Kathmandu",
    district: "Kathmandu",
    submittedAt: "June 15, 2026, 02:15 PM",
    status: "Contacted"
  }
];

// DEFAULT MOCK SUGGESTIONS & FAQS FOR COMMUNICATIVE PARENT DIALOGS
const INITIAL_SUGGESTIONS: SuggestionInquiry[] = [
  {
    id: "sugg-1",
    parentName: "Sanjay Shrestha",
    title: "Inquiry on Kindergarten Early Friday Pickup Hours",
    content: "Hi Shristi Team, since Friday school sessions end early for the kindergarten kids, could we request slightly extended pickup hours at the playground helper lounge until 1:00 PM? Some of us work until 12:30 PM. Thank you!",
    category: "Academics & Schedule",
    pin: "4321",
    submittedAt: "June 20, 2026, 11:30 AM",
    adminReply: "Dear Mr. Shrestha, we appreciate your query. Starting next Friday, we will keep the Kindergarten indoor play lounge open with two on-duty keepers until 1:30 PM to facilitate convenient parent pickups.",
    repliedAt: "June 21, 2026, 09:00 AM"
  },
  {
    id: "sugg-2",
    parentName: "Rita Karki",
    title: "School Bus Transport Route Extension to Sallaghari",
    content: "Greetings, is it possible for the afternoon secondary school bus route to go slightly further near the Sallaghari roundabout? It is currently about a 12-minute walk from our main gate.",
    category: "Facilities & Transport",
    pin: "9988",
    submittedAt: "June 19, 2026, 03:45 PM"
  }
];

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core synchronized school database
  const [notices, setNotices] = useState<Notice[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionQuery[]>([]);
  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionInquiry[]>([]);

  // Load from local storage or initialize realistic mock templates
  useEffect(() => {
    const cachedNotices = localStorage.getItem("shristi_notices_cache");
    const cachedAdmissions = localStorage.getItem("shristi_admissions_cache");
    const cachedAdmins = localStorage.getItem("shristi_admins_cache");
    const cachedSuggestions = localStorage.getItem("shristi_suggestions_cache");

    if (cachedNotices) {
      setNotices(JSON.parse(cachedNotices));
    } else {
      setNotices(INITIAL_NOTICES);
      localStorage.setItem("shristi_notices_cache", JSON.stringify(INITIAL_NOTICES));
    }

    if (cachedAdmissions) {
      setAdmissions(JSON.parse(cachedAdmissions));
    } else {
      setAdmissions(INITIAL_ADMISSIONS);
      localStorage.setItem("shristi_admissions_cache", JSON.stringify(INITIAL_ADMISSIONS));
    }

    if (cachedAdmins) {
      setAuthorizedAdmins(JSON.parse(cachedAdmins));
    } else {
      const defaultAdmins = [
        "info@shristiacademy.edu.np",
        "principal@shristyacademy.edu.np",
        "viceprincipal@shristyacademy.edu.np"
      ];
      setAuthorizedAdmins(defaultAdmins);
      localStorage.setItem("shristi_admins_cache", JSON.stringify(defaultAdmins));
    }

    if (cachedSuggestions) {
      setSuggestions(JSON.parse(cachedSuggestions));
    } else {
      setSuggestions(INITIAL_SUGGESTIONS);
      localStorage.setItem("shristi_suggestions_cache", JSON.stringify(INITIAL_SUGGESTIONS));
    }
  }, []);

  // Sync back to local storage whenever they change
  const saveNoticesToStorage = (updatedList: Notice[]) => {
    setNotices(updatedList);
    localStorage.setItem("shristi_notices_cache", JSON.stringify(updatedList));
  };

  const saveAdmissionsToStorage = (updatedList: AdmissionQuery[]) => {
    setAdmissions(updatedList);
    localStorage.setItem("shristi_admissions_cache", JSON.stringify(updatedList));
  };

  const saveAdminsToStorage = (updatedList: string[]) => {
    setAuthorizedAdmins(updatedList);
    localStorage.setItem("shristi_admins_cache", JSON.stringify(updatedList));
  };

  const saveSuggestionsToStorage = (updatedList: SuggestionInquiry[]) => {
    setSuggestions(updatedList);
    localStorage.setItem("shristi_suggestions_cache", JSON.stringify(updatedList));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // CMS METRIC CRUD ACTION HANDLERS
  const handleAddNotice = (newNotice: Notice) => {
    const updated = [newNotice, ...notices];
    saveNoticesToStorage(updated);
    showToast("🎉 Public announcement successfully posted onto Notice Board!");
  };

  const handleUpdateNotice = (updatedNotice: Notice) => {
    const updated = notices.map(n => n.id === updatedNotice.id ? updatedNotice : n);
    saveNoticesToStorage(updated);
    showToast("✏️ Announcement successfully updated & synchronized.");
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    saveNoticesToStorage(updated);
    showToast("🗑️ Notice resource permanently removed from school board.");
  };

  const handleCreateAdmissionQuery = (query: {
    studentName: string;
    parentName: string;
    email: string;
    mobileNo: string;
    gradeOfInterest: string;
    previousSchool: string;
    district: string;
  }) => {
    const created: AdmissionQuery = {
      ...query,
      id: "admit-" + Date.now(),
      submittedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "Pending" // initial
    };

    const updated = [created, ...admissions];
    saveAdmissionsToStorage(updated);
    showToast("🎓 Admission query successfully filed! Checking with Sila Sapkota office.");
  };

  const handleUpdateAdmissionStatus = (id: string, newState: "Pending" | "Contacted" | "Approved") => {
    const updated = admissions.map(ad => ad.id === id ? { ...ad, status: newState } : ad);
    saveAdmissionsToStorage(updated);
    showToast(`💼 Applicant status updated to: ${newState}`);
  };

  const handleAddAuthorizedAdmin = (email: string) => {
    const cleaned = email.trim().toLowerCase();
    if (!authorizedAdmins.includes(cleaned)) {
      const updated = [...authorizedAdmins, cleaned];
      saveAdminsToStorage(updated);
      showToast(`👤 Dynamic authorization granted to: ${cleaned}`);
    }
  };

  const handleDeleteAuthorizedAdmin = (email: string) => {
    const cleaned = email.trim().toLowerCase();
    if (cleaned === "info@shristiacademy.edu.np") return;
    const updated = authorizedAdmins.filter(ad => ad.toLowerCase() !== cleaned);
    saveAdminsToStorage(updated);
    showToast(`🗑️ Revoked login clearance for: ${cleaned}`);
  };

  const handleAddSuggestion = (newSugg: SuggestionInquiry) => {
    const updated = [newSugg, ...suggestions];
    saveSuggestionsToStorage(updated);
    showToast("💬 Suggestion successfully recorded onto community board!");
  };

  const handleAddReply = (id: string, replyText: string) => {
    const updated = suggestions.map(item => {
      if (item.id === id) {
        return {
          ...item,
          adminReply: replyText,
          repliedAt: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          })
        };
      }
      return item;
    });
    saveSuggestionsToStorage(updated);
    showToast("✓ Response successfully published and synced on public board.");
  };

  const handleDeleteSuggestion = (id: string) => {
    const updated = suggestions.filter(item => item.id !== id);
    saveSuggestionsToStorage(updated);
    showToast("🗑️ Inquiry item permanently purged.");
  };

  // Scroll smoothly to top helper
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract last notice title to display in Hero alert
  const lastNoticeTitle = notices.length > 0 ? notices[0].title : "";

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans overflow-x-hidden">
      
      {/* Toast alert notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 border border-emerald-500/30 text-white py-3 px-6 rounded-2xl shadow-2xl font-mono text-xs font-semibold flex items-center space-x-2.5 max-w-sm sm:max-w-md"
          >
            <CheckCircle className="w-4 h-4 text-emerald-100 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navigation Header */}
      <Header 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        unreadCount={notices.length}
      />

      {/* Main Body Organizer */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isAdminMode ? (
            
            /* SPECIAL INTEGRATED CMS DASHBOARD FOR SHRISTI ACADEMY LEADERS */
            <motion.div
              key="admin-workspace"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-emerald-50 border-b border-emerald-100 p-4 text-center text-xs font-mono text-slate-600 flex justify-center items-center space-x-2">
                <Landmark className="w-3.5 h-3.5 text-emerald-600 mr-1 animate-pulse" />
                <span>You are in <strong className="text-emerald-800">MBN-Kathmandu Admin Panel</strong>. Notices published here sync in real-time.</span>
              </div>
              
              <AdminPortal 
                notices={notices}
                onAddNotice={handleAddNotice}
                onUpdateNotice={handleUpdateNotice}
                onDeleteNotice={handleDeleteNotice}
                admissions={admissions}
                onUpdateAdmissionStatus={handleUpdateAdmissionStatus}
                authorizedAdmins={authorizedAdmins}
                onAddAuthorizedAdmin={handleAddAuthorizedAdmin}
                onDeleteAuthorizedAdmin={handleDeleteAuthorizedAdmin}
                suggestions={suggestions}
                onAddReply={handleAddReply}
                onDeleteSuggestion={handleDeleteSuggestion}
              />
            </motion.div>

          ) : (

            /* PUBLIC SCHOOL PAGES SECTIONS */
            <motion.div
              key="public-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Show matching component scroll flow or direct routed sections based on currentSection */}
              {currentSection === "home" ? (
                <>
                  {/* High impact sleek introduction hero */}
                  <Hero 
                    onExplorePrograms={() => setCurrentSection("academics")}
                    onApplyNow={() => setCurrentSection("admission")}
                    onViewNotices={() => setCurrentSection("notices")}
                    lastNoticeTitle={lastNoticeTitle}
                  />

                  {/* Clean 6-pillars cards layout representing values on safe white section (uncluttered, highly readable) */}
                  <WhyShristi />

                  {/* Latest Notices & Live Communication Hub Widget */}
                  <section className="py-20 px-4 bg-white font-sans" id="home-community-hub">
                    <div className="max-w-5xl mx-auto space-y-12">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1 rounded-md inline-block">
                            Live Communications Hub
                          </span>
                          <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Recent Announcements & Event Alerts
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-sm font-medium">
                            Daily updates, emergency notifications, and exam routings from Principal Vani Pradhan's workspace.
                          </p>
                        </div>
                        <button
                          onClick={() => setCurrentSection("notices")}
                          className="shrink-0 flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-850 bg-indigo-50 hover:bg-indigo-100 px-4.5 py-2.5 rounded-xl transition-all"
                        >
                          <span>Open Notice Board</span>
                          <Megaphone className="w-4.5 h-4.5 text-indigo-500" />
                        </button>
                      </div>

                      {/* Display 2 recent notices */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notices.slice(0, 2).map((notice) => (
                          <div 
                            key={notice.id}
                            className="p-6 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-3xl space-y-4 transition-all duration-300 group flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10.5px] font-mono font-bold text-slate-400 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                                  {notice.date}
                                </span>
                                <span className={`text-[10px] font-semibold font-mono rounded-md px-2 py-0.5 uppercase tracking-wider ${
                                  notice.category === "Academic" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" :
                                  notice.category === "Exam" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                  notice.category === "Holiday" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                                  "bg-purple-100 text-purple-700 border border-purple-200"
                                }`}>
                                  {notice.category}
                                </span>
                              </div>

                              <h4 className="font-display font-black text-sm text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                {notice.title}
                              </h4>

                              <p className="text-slate-500 font-medium text-[12px] leading-relaxed line-clamp-3">
                                {notice.content}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-slate-200/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span>By: {notice.author}</span>
                              <button 
                                onClick={() => setCurrentSection("notices")}
                                className="text-indigo-600 hover:underline font-bold text-[10.5px] flex items-center"
                              >
                                Read announcement ➜
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Micro Call to Action card */}
                      <div className="bg-gradient-to-r from-indigo-900 via-[#372473] to-purple-900 p-6 sm:p-8 rounded-[28px] border border-indigo-800/40 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="text-pink-300 font-mono text-[10px] font-black uppercase tracking-wider">Admissions open online</p>
                          <h4 className="font-display font-extrabold text-base sm:text-lg">Are you ready to enroll your child for Batch 2083?</h4>
                          <p className="text-indigo-100/80 text-xs font-medium">Slots are highly regulated to preserve small classroom sizes and teacher ratios.</p>
                        </div>
                        <button
                          onClick={() => setCurrentSection("admission")}
                          className="shrink-0 bg-white hover:bg-pink-50 text-indigo-900 hover:text-indigo-950 font-bold text-[12px] px-6 py-3 rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Fill Application Form
                        </button>
                      </div>

                    </div>
                  </section>
                </>
              ) : currentSection === "about" ? (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">Corporate Profile & History</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        Nurturing Scholars Since 2016 AD • Mid-Baneshwor, Kathmandu
                      </p>
                    </div>
                  </div>
                  <AboutUs />
                </div>
              ) : currentSection === "academics" ? (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">Pedagogies & Streams</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        National Syllabus CDC Affiliated Pathways
                      </p>
                    </div>
                  </div>
                  <Academics />
                </div>
              ) : currentSection === "notices" ? (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">Directives & Routings</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        Official Announcements Bureau
                      </p>
                    </div>
                  </div>
                  <NoticeBoard 
                    notices={notices}
                    onOpenAdminMode={() => { setIsAdminMode(true); }}
                    isAdminMode={isAdminMode}
                  />
                </div>
              ) : currentSection === "tools" ? (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">School Academic Calendar</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        Official Academic Calendar & Upcoming Events
                      </p>
                    </div>
                  </div>
                  <ToolsSection isAdmin={isAdminMode} />
                </div>
              ) : currentSection === "suggestions" ? (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">Parents' Suggestion Board</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        Secured Parent Queries & School Feedback
                      </p>
                    </div>
                  </div>
                  <SuggestionsSection 
                    suggestions={suggestions}
                    onAddSuggestion={handleAddSuggestion}
                    isAdmin={false}
                  />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-[#FAF9F6] py-16 text-center border-b border-indigo-100/60">
                    <div className="absolute top-0 left-1/4 w-[280px] h-[280px] rounded-full bg-pink-150/10 blur-[80px] pointer-events-none" />
                    <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-150/15 blur-[80px] pointer-events-none" />
                    <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
                      <h2 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">Admissions Dashboard</h2>
                      <p className="inline-flex items-center space-x-1.5 bg-indigo-50/70 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-indigo-100/40 shadow-sm">
                        Secure Admissions & Slots Requests
                      </p>
                    </div>
                  </div>
                  <AdmissionForm onSubmitQuery={handleCreateAdmissionQuery} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate Accessible Footer */}
      <Footer 
        onNavigate={(sect) => {
          setCurrentSection(sect);
          setIsAdminMode(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAdmin={() => {
          setIsAdminMode(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Simple floating back to top hook button - colorful prestige colors without death-black meanings */}
      <button
        onClick={handleScrollTop}
        className="fixed bottom-6 right-6 p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border border-transparent rounded-full shadow-2xl hover:scale-110 transition-all cursor-pointer z-40 hidden md:block"
        title="Scroll back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
}
