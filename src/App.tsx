import { useState, useEffect } from "react";
import { 
  Megaphone, Shield, NotebookText, Users, Landmark, 
  MapPin, CheckCircle, HelpCircle, ArrowUp, Calendar, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Notice, AdmissionQuery, SuggestionInquiry, PopupNoticeConfig, SchoolProfileConfig, GalleryItem } from "./types";

// Import modular subcomponents
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutUs, { DEFAULT_GALLERY_ITEMS } from "./components/AboutUs";

import Academics from "./components/Academics";
import NoticeBoard from "./components/NoticeBoard";
import AdminPortal from "./components/AdminPortal";
import AdmissionForm from "./components/AdmissionForm";
import ToolsSection from "./components/ToolsSection";
import Footer from "./components/Footer";
import WhyShristi from "./components/WhyShristi";
import SuggestionsSection from "./components/SuggestionsSection";
import PopupModal from "./components/PopupModal";
import SchoolProfileModal from "./components/SchoolProfileModal";
import ParentReviews, { DEFAULT_PARENT_REVIEWS } from "./components/ParentReviews";
import { ParentReview } from "./types";

// DEFAULT SCHOOL PROFILE CONFIGURATION
const DEFAULT_SCHOOL_PROFILE_CONFIG: SchoolProfileConfig = {
  pdfUrl: null,
  fileName: "Shristi_Academy_School_Profile_2083.pdf",
  fileSize: "2.4 MB",
  title: "Shristi Academy • School Profile Prospectus 2083 BS",
  description: "Official institutional prospectus detailing academic programs, SEE board performance history, faculty credentials, and campus infrastructure.",
  updatedAt: "June 2026",
};

// DEFAULT POPUP ANNOUNCEMENT CONFIGURATION
const DEFAULT_POPUP_CONFIG: PopupNoticeConfig = {
  enabled: false, // Turned OFF by default as requested
  type: "custom",
  mediaUrl: null,
  mediaType: "image",
  title: "2083/2084 Annual Parent Orientation & Cultural Gala",
  badge: "SPECIAL ANNOUNCEMENT",
  eventTime: "Saturday, August 15, 2026 • 10:00 AM - 2:00 PM",
  eventLocation: "Shristi Academy Main Auditorium, Mid-Baneshwor",
  content: "We cordially invite all current and prospective parents to our annual school orientation and cultural showcase. Tour our modern computer and robotics labs, meet faculty members, and review merit scholarship opportunities.",
  ctaText: "Apply For Admission",
  ctaLink: "#admissions"
};

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
    email: "sanjay.shrestha@gmail.com",
    mobileNo: "+977-9851023456",
    title: "Inquiry on Kindergarten Early Friday Pickup Hours",
    content: "Hi Shristi Team, since Friday school sessions end early for the kindergarten kids, could we request slightly extended pickup hours at the playground helper lounge until 1:00 PM? Some of us work until 12:30 PM. Thank you!",
    category: "Academics & Schedule",
    pin: "4321",
    submittedAt: "June 20, 2026, 11:30 AM",
    createdAtMs: Date.now() - 36000000,
    adminReply: "Dear Mr. Shrestha, we appreciate your query. Starting next Friday, we will keep the Kindergarten indoor play lounge open with two on-duty keepers until 1:30 PM to facilitate convenient parent pickups.",
    repliedAt: "June 21, 2026, 09:00 AM"
  },
  {
    id: "sugg-2",
    parentName: "Rita Karki",
    email: "rita.karki@yahoo.com",
    mobileNo: "+977-9841987654",
    title: "School Bus Transport Route Extension to Sallaghari",
    content: "Greetings, is it possible for the afternoon secondary school bus route to go slightly further near the Sallaghari roundabout? It is currently about a 12-minute walk from our main gate.",
    category: "Facilities & Transport",
    pin: "9988",
    submittedAt: "June 19, 2026, 03:45 PM",
    createdAtMs: Date.now() - 72000000
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
  const [popupConfig, setPopupConfig] = useState<PopupNoticeConfig>(DEFAULT_POPUP_CONFIG);
  const [isVisitorPopupOpen, setIsVisitorPopupOpen] = useState(false);
  const [schoolProfileConfig, setSchoolProfileConfig] = useState<SchoolProfileConfig>(DEFAULT_SCHOOL_PROFILE_CONFIG);
  const [isSchoolProfileOpen, setIsSchoolProfileOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [parentReviews, setParentReviews] = useState<ParentReview[]>([]);

  // Load from local storage or initialize realistic mock templates
  useEffect(() => {
    const cachedNotices = localStorage.getItem("shristi_notices_cache");
    const cachedAdmissions = localStorage.getItem("shristi_admissions_cache");
    const cachedAdmins = localStorage.getItem("shristi_admins_cache");
    const cachedSuggestions = localStorage.getItem("shristi_suggestions_cache");
    const cachedPopup = localStorage.getItem("shristi_popup_config_cache");
    const cachedProfile = localStorage.getItem("shristi_school_profile_cache");
    const cachedGallery = localStorage.getItem("shristi_gallery_items_cache");
    const cachedReviews = localStorage.getItem("shristi_parent_reviews_cache");

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
      try {
        const parsed: SuggestionInquiry[] = JSON.parse(cachedSuggestions);
        const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const validSuggestions = parsed.filter(item => {
          const createdTime = item.createdAtMs || (item.submittedAt ? Date.parse(item.submittedAt) : 0) || now;
          return (now - createdTime) <= ONE_YEAR_MS;
        });
        setSuggestions(validSuggestions);
        localStorage.setItem("shristi_suggestions_cache", JSON.stringify(validSuggestions));
      } catch (err) {
        setSuggestions(INITIAL_SUGGESTIONS);
      }
    } else {
      setSuggestions(INITIAL_SUGGESTIONS);
      localStorage.setItem("shristi_suggestions_cache", JSON.stringify(INITIAL_SUGGESTIONS));
    }

    if (cachedPopup) {
      try {
        const parsed: PopupNoticeConfig = JSON.parse(cachedPopup);
        setPopupConfig(parsed);
        const isClosedToday = sessionStorage.getItem("shristi_popup_closed_today");
        if (parsed.enabled && !isClosedToday) {
          setIsVisitorPopupOpen(true);
        }
      } catch (err) {
        setPopupConfig(DEFAULT_POPUP_CONFIG);
      }
    } else {
      setPopupConfig(DEFAULT_POPUP_CONFIG);
      localStorage.setItem("shristi_popup_config_cache", JSON.stringify(DEFAULT_POPUP_CONFIG));
    }

    if (cachedProfile) {
      try {
        setSchoolProfileConfig(JSON.parse(cachedProfile));
      } catch (err) {
        setSchoolProfileConfig(DEFAULT_SCHOOL_PROFILE_CONFIG);
      }
    } else {
      setSchoolProfileConfig(DEFAULT_SCHOOL_PROFILE_CONFIG);
      localStorage.setItem("shristi_school_profile_cache", JSON.stringify(DEFAULT_SCHOOL_PROFILE_CONFIG));
    }

    if (cachedGallery) {
      try {
        const parsed = JSON.parse(cachedGallery);
        setGalleryItems(Array.isArray(parsed) ? parsed : DEFAULT_GALLERY_ITEMS);
      } catch (err) {
        setGalleryItems(DEFAULT_GALLERY_ITEMS);
      }
    } else {
      setGalleryItems(DEFAULT_GALLERY_ITEMS);
      localStorage.setItem("shristi_gallery_items_cache", JSON.stringify(DEFAULT_GALLERY_ITEMS));
    }

    if (cachedReviews) {
      try {
        let parsed: ParentReview[] = JSON.parse(cachedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Fix spelling typo "Christi" -> "Shristi" in any existing cached reviews
          parsed = parsed.map(rev => {
            if (rev.reviewerName === "Krishna Joshi" && rev.comment.includes("Christi Academy")) {
              return {
                ...rev,
                comment: rev.comment.replace("Christi Academy", "Shristi Academy")
              };
            }
            return rev;
          });
          setParentReviews(parsed);
          localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(parsed));
        } else {
          setParentReviews(DEFAULT_PARENT_REVIEWS);
          localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(DEFAULT_PARENT_REVIEWS));
        }
      } catch (err) {
        setParentReviews(DEFAULT_PARENT_REVIEWS);
        localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(DEFAULT_PARENT_REVIEWS));
      }
    } else {
      setParentReviews(DEFAULT_PARENT_REVIEWS);
      localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(DEFAULT_PARENT_REVIEWS));
    }
  }, []);

  const handleAddParentReview = (newReview: ParentReview) => {
    const updated = [newReview, ...parentReviews];
    setParentReviews(updated);
    localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(updated));
    showToast("✓ Thank you! Your review has been recorded.");
  };

  const handleUpdateParentReviews = (updated: ParentReview[]) => {
    setParentReviews(updated);
    localStorage.setItem("shristi_parent_reviews_cache", JSON.stringify(updated));
    showToast("✓ Parent reviews updated.");
  };

  const handleUpdatePopupConfig = (updated: PopupNoticeConfig) => {
    setPopupConfig(updated);
    localStorage.setItem("shristi_popup_config_cache", JSON.stringify(updated));
    if (updated.enabled) {
      sessionStorage.removeItem("shristi_popup_closed_today");
      setIsVisitorPopupOpen(true);
      showToast("📢 Website Pop-up is now ACTIVE for visitors.");
    } else {
      setIsVisitorPopupOpen(false);
      showToast("💾 Pop-up settings saved (Currently inactive).");
    }
  };

  const handleUpdateSchoolProfileConfig = (updated: SchoolProfileConfig) => {
    setSchoolProfileConfig(updated);
    localStorage.setItem("shristi_school_profile_cache", JSON.stringify(updated));
    showToast("📄 School Profile PDF updated successfully!");
  };

  const handleUpdateGalleryItems = (updated: GalleryItem[]) => {
    const limited = updated.slice(0, 10);
    setGalleryItems(limited);
    localStorage.setItem("shristi_gallery_items_cache", JSON.stringify(limited));
    showToast("🖼️ Campus photo gallery updated!");
  };


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
      
      {/* Visitor Site-Wide Popup Modal */}
      <PopupModal
        config={popupConfig}
        isOpen={isVisitorPopupOpen}
        onClose={() => setIsVisitorPopupOpen(false)}
        onDontShowToday={() => sessionStorage.setItem("shristi_popup_closed_today", "true")}
        onActionClick={(link) => {
          if (link && link.startsWith("#")) {
            const targetSect = link.substring(1);
            setCurrentSection(targetSect);
            setIsAdminMode(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />

      {/* Official School Profile PDF Preview Modal */}
      <SchoolProfileModal
        config={schoolProfileConfig}
        isOpen={isSchoolProfileOpen}
        onClose={() => setIsSchoolProfileOpen(false)}
      />

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
        onOpenSchoolProfile={() => setIsSchoolProfileOpen(true)}
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
                popupConfig={popupConfig}
                onUpdatePopupConfig={handleUpdatePopupConfig}
                schoolProfileConfig={schoolProfileConfig}
                onUpdateSchoolProfileConfig={handleUpdateSchoolProfileConfig}
                galleryItems={galleryItems}
                onUpdateGalleryItems={handleUpdateGalleryItems}
                reviews={parentReviews}
                onUpdateReviews={handleUpdateParentReviews}
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
                  <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white font-sans" id="home-community-hub">
                    <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto space-y-12">
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

                    </div>
                  </section>

                  {/* Sleek Parent Reviews & QR Code Feedback Section */}
                  <ParentReviews
                    reviews={parentReviews}
                    onAddReview={handleAddParentReview}
                  />
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
                  <AboutUs 
                    onOpenSchoolProfile={() => setIsSchoolProfileOpen(true)}
                    schoolProfileConfig={schoolProfileConfig}
                    galleryItems={galleryItems}
                  />
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
