import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  Lock, Unlock, ShieldAlert, Sparkles, Send, FileEdit, 
  Trash2, Plus, Megaphone, Users, Calendar, ArrowRight, UserCheck, CheckCircle2, Bookmark, Info, CircleAlert, HelpCircle,
  BellRing, Image as ImageIcon, LayoutTemplate, Eye, Upload, Check, Power, Download, FileText, Edit3, X, Star, Save
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Notice, NoticeCategory, AdmissionQuery, SuggestionInquiry, PopupNoticeConfig, SchoolProfileConfig, GalleryItem, ParentReview, SchoolEvent } from "../types";
import PopupModal from "./PopupModal";
import SchoolProfileModal from "./SchoolProfileModal";

interface AdminPortalProps {
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onUpdateNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  admissions: AdmissionQuery[];
  onUpdateAdmissionStatus: (id: string, state: "Pending" | "Contacted" | "Approved") => void;
  onDeleteAdmission?: (id: string) => void;
  authorizedAdmins: string[];
  onAddAuthorizedAdmin: (email: string) => void;
  onDeleteAuthorizedAdmin: (email: string) => void;
  suggestions: SuggestionInquiry[];
  onAddReply: (id: string, reply: string) => void;
  onDeleteSuggestion: (id: string) => void;
  popupConfig: PopupNoticeConfig;
  onUpdatePopupConfig: (config: PopupNoticeConfig) => void;
  schoolProfileConfig: SchoolProfileConfig;
  onUpdateSchoolProfileConfig: (config: SchoolProfileConfig) => void;
  galleryItems?: GalleryItem[];
  onUpdateGalleryItems?: (items: GalleryItem[]) => void;
  reviews?: ParentReview[];
  onUpdateReviews?: (reviews: ParentReview[]) => void;
}

export default function AdminPortal({ 
  notices, 
  onAddNotice, 
  onUpdateNotice, 
  onDeleteNotice,
  admissions,
  onUpdateAdmissionStatus,
  onDeleteAdmission,
  authorizedAdmins,
  onAddAuthorizedAdmin,
  onDeleteAuthorizedAdmin,
  suggestions,
  onAddReply,
  onDeleteSuggestion,
  popupConfig,
  onUpdatePopupConfig,
  schoolProfileConfig,
  onUpdateSchoolProfileConfig,
  galleryItems = [],
  onUpdateGalleryItems,
  reviews = [],
  onUpdateReviews
}: AdminPortalProps) {
  // Login Gate State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedEmail, setLoggedEmail] = useState("");

  // CMS Tabs State variables
  const [cmsTab, setCmsTab] = useState<"ManageNo" | "WritePost" | "Admit" | "Admins" | "ParentsVoice" | "PopupNotice" | "SchoolProfile" | "CampusGallery" | "ParentReviews" | "AcademicCalendar">("ManageNo");

  // School Calendar Management States & Real-Time Sync
  const [adminCalImage, setAdminCalImage] = useState<string | null>(() => localStorage.getItem("shristi_calendar_uploaded_image"));
  const [adminCalIsParsing, setAdminCalIsParsing] = useState(false);
  const [adminCalEvents, setAdminCalEvents] = useState<SchoolEvent[]>(() => {
    const cached = localStorage.getItem("shristi_calendar_events");
    return cached ? JSON.parse(cached) : [];
  });
  const [calEventTitle, setCalEventTitle] = useState("");
  const [calEventDate, setCalEventDate] = useState("");
  const [calEventEndDate, setCalEventEndDate] = useState("");
  const [calEventTime, setCalEventTime] = useState("All Day");
  const [calEventLocation, setCalEventLocation] = useState("School Premises");
  const [calEventType, setCalEventType] = useState<"Sports" | "Academic" | "Excursion" | "Ceremony">("Academic");
  const [calEventDesc, setCalEventDesc] = useState("");
  const [calSaveNotice, setCalSaveNotice] = useState<string | null>(null);

  // Sync calendar data from localStorage and custom events
  useEffect(() => {
    const syncCalendarFromStorage = () => {
      const cachedImg = localStorage.getItem("shristi_calendar_uploaded_image");
      const cachedEvts = localStorage.getItem("shristi_calendar_events");
      setAdminCalImage(cachedImg);
      if (cachedEvts) {
        try {
          setAdminCalEvents(JSON.parse(cachedEvts));
        } catch (_) {}
      }
    };
    syncCalendarFromStorage();
    window.addEventListener("shristi_calendar_updated", syncCalendarFromStorage);
    window.addEventListener("storage", syncCalendarFromStorage);
    return () => {
      window.removeEventListener("shristi_calendar_updated", syncCalendarFromStorage);
      window.removeEventListener("storage", syncCalendarFromStorage);
    };
  }, []);

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

  const handleAdminCalUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large! Please choose a file smaller than 15MB.");
      return;
    }
    try {
      setCalSaveNotice("⏳ Processing file & running AI extraction...");
      const base64 = await compressCalendarImage(file);
      setAdminCalImage(base64);
      try {
        localStorage.setItem("shristi_calendar_uploaded_image", base64);
      } catch (e) {
        console.warn("Storage quota hit, storing in memory state");
      }
      window.dispatchEvent(new Event("shristi_calendar_updated"));
      setCalSaveNotice("📁 Poster uploaded! Automatically running AI Sync to extract calendar dates...");
      // Auto trigger AI extraction
      handleAIParseInAdmin(base64);
    } catch (err) {
      alert("Failed to process uploaded file. Please try again with a valid JPG/PNG or PDF.");
    }
  };

  const handleSaveAdminCalPoster = () => {
    if (!adminCalImage) {
      alert("Please upload or select a calendar poster image first.");
      return;
    }
    try {
      localStorage.setItem("shristi_calendar_uploaded_image", adminCalImage);
      window.dispatchEvent(new Event("shristi_calendar_updated"));
      setCalSaveNotice("✅ Academic Calendar Poster successfully saved and published on live website!");
      alert("🎉 Academic Calendar Poster Successfully Saved & Published!\n\nYour calendar poster is now live in the #tools section of the website for all students, parents, and visitors.");
    } catch (err) {
      alert("Storage quota exceeded. The image is saved in session memory. Please try using a slightly smaller image.");
    }
  };

  const handleAIParseInAdmin = async (overrideBase64?: string) => {
    const targetImage = overrideBase64 || adminCalImage;
    if (!targetImage) {
      alert("Please upload a calendar image before running AI Sync.");
      return;
    }
    setAdminCalIsParsing(true);
    setCalSaveNotice("✨ Gemini AI is analyzing calendar image and extracting scheduled events...");
    try {
      const res = await fetch("/api/parse-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: targetImage }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reach AI parsing endpoint");
      }
      const data = await res.json();
      if (data.events && Array.isArray(data.events) && data.events.length > 0) {
        const parsedEvents: SchoolEvent[] = data.events.map((evt: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: evt.title || "Unnamed Event",
          date: evt.date || `July 15, ${new Date().getFullYear()}`,
          endDate: evt.endDate || undefined,
          time: evt.time || "All Day",
          location: evt.location || "School Premises",
          description: evt.description || "Auto-parsed from uploaded official academic calendar document via Gemini AI.",
          type: (["Sports", "Academic", "Excursion", "Ceremony"].includes(evt.type) ? evt.type : "Academic") as any
        }));
        
        const merged = [...parsedEvents, ...adminCalEvents];
        setAdminCalEvents(merged);
        localStorage.setItem("shristi_calendar_events", JSON.stringify(merged));
        window.dispatchEvent(new Event("shristi_calendar_updated"));
        setCalSaveNotice(`🎉 AI Sync Successful! Successfully extracted ${parsedEvents.length} events and published to live website!`);
        alert(`🎉 AI Sync Successful!\n\nSuccessfully extracted ${parsedEvents.length} academic calendar events from your document!\n\nThe extracted events are now published on the public website calendar grid and event schedule.`);
      } else {
        alert("Gemini AI was unable to detect distinct text/dates in the uploaded image. Poster is saved, but please add events manually below.");
      }
    } catch (err: any) {
      console.error("AI Calendar parse error:", err);
      // Ensure the poster itself is saved even if AI parsing fails
      try {
        localStorage.setItem("shristi_calendar_uploaded_image", targetImage);
        window.dispatchEvent(new Event("shristi_calendar_updated"));
      } catch (_) {}
      alert(`📅 Calendar Poster Saved to Website!\n\nNote: Automatic AI text extraction encountered an issue (${err.message || "Network"}). Your calendar image is live, and you can manually add scheduled events using the form below.`);
    } finally {
      setAdminCalIsParsing(false);
    }
  };

  const handleRemoveAdminCalImage = () => {
    if (confirm("Are you sure you want to remove the custom uploaded calendar poster? It will revert to default bulletin view.")) {
      setAdminCalImage(null);
      localStorage.removeItem("shristi_calendar_uploaded_image");
      window.dispatchEvent(new Event("shristi_calendar_updated"));
      setCalSaveNotice("Removed custom calendar poster.");
    }
  };

  const handleAddCalEventInAdmin = (e: FormEvent) => {
    e.preventDefault();
    if (!calEventTitle.trim() || !calEventDate.trim()) {
      alert("Please fill in event title and date.");
      return;
    }
    const newEvt: SchoolEvent = {
      id: "evt-" + Date.now(),
      title: calEventTitle.trim(),
      date: calEventDate.trim(),
      endDate: calEventEndDate.trim() || undefined,
      time: calEventTime.trim() || "All Day",
      location: calEventLocation.trim() || "School Premises",
      description: calEventDesc.trim() || "Official Shristi Academy scheduled academic event.",
      type: calEventType,
    };
    const updated = [newEvt, ...adminCalEvents];
    setAdminCalEvents(updated);
    localStorage.setItem("shristi_calendar_events", JSON.stringify(updated));
    window.dispatchEvent(new Event("shristi_calendar_updated"));
    setCalEventTitle("");
    setCalEventDate("");
    setCalEventEndDate("");
    setCalEventDesc("");
    setCalSaveNotice("✅ Academic Calendar event added & published!");
    alert("✅ Academic Calendar event added successfully!");
  };

  const handleDeleteCalEventInAdmin = (id: string) => {
    if (confirm("Delete this event from the calendar schedule?")) {
      const updated = adminCalEvents.filter((ev) => ev.id !== id);
      setAdminCalEvents(updated);
      localStorage.setItem("shristi_calendar_events", JSON.stringify(updated));
      window.dispatchEvent(new Event("shristi_calendar_updated"));
    }
  };

  // Review Edit & Manual Add States
  const [editingReview, setEditingReview] = useState<ParentReview | null>(null);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  
  // New Manual Review Form States
  const [manName, setManName] = useState("");
  const [manRole, setManRole] = useState("Parent of Current Student");
  const [manRating, setManRating] = useState(5);
  const [manTitle, setManTitle] = useState("");
  const [manComment, setManComment] = useState("");
  const [manTags, setManTags] = useState("Passionate Teachers, Category A Quality");

  // Popup Management Form States
  const [popEnabled, setPopEnabled] = useState<boolean>(popupConfig?.enabled ?? false);
  const [popType, setPopType] = useState<"image" | "custom">(popupConfig?.type ?? "custom");
  const [popMediaUrl, setPopMediaUrl] = useState<string | null>(popupConfig?.mediaUrl ?? null);
  const [popMediaType, setPopMediaType] = useState<"image" | "pdf">(popupConfig?.mediaType ?? "image");
  const [popFileName, setPopFileName] = useState<string>(popupConfig?.fileName ?? "");
  const [popTitle, setPopTitle] = useState<string>(popupConfig?.title ?? "");
  const [popBadge, setPopBadge] = useState<string>(popupConfig?.badge ?? "SPECIAL ANNOUNCEMENT");
  const [popEventTime, setPopEventTime] = useState<string>(popupConfig?.eventTime ?? "");
  const [popEventLocation, setPopEventLocation] = useState<string>(popupConfig?.eventLocation ?? "");
  const [popContent, setPopContent] = useState<string>(popupConfig?.content ?? "");
  const [popCtaText, setPopCtaText] = useState<string>(popupConfig?.ctaText ?? "Apply For Admission");
  const [popCtaLink, setPopCtaLink] = useState<string>(popupConfig?.ctaLink ?? "#admissions");

  // School Profile Management States
  const [spPdfUrl, setSpPdfUrl] = useState<string | null>(schoolProfileConfig?.pdfUrl ?? null);
  const [spFileName, setSpFileName] = useState<string>(schoolProfileConfig?.fileName ?? "Shristi_Academy_School_Profile_2083.pdf");
  const [spFileSize, setSpFileSize] = useState<string>(schoolProfileConfig?.fileSize ?? "2.4 MB");
  const [spTitle, setSpTitle] = useState<string>(schoolProfileConfig?.title ?? "Shristi Academy • School Profile Prospectus 2083 BS");
  const [spDescription, setSpDescription] = useState<string>(schoolProfileConfig?.description ?? "Official institutional prospectus detailing academic programs, facilities, and campus history.");

  // Campus Gallery Management States
  const [galTitle, setGalTitle] = useState("");
  const [galCategory, setGalCategory] = useState("");
  const [galDescription, setGalDescription] = useState("");
  const [galImage, setGalImage] = useState<string | null>(null);

  // Live Admin Preview States
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showSpPreview, setShowSpPreview] = useState(false);

  // File upload handler for Campus Gallery Photo
  const handleGalleryFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (galleryItems.length >= 10) {
      alert("Maximum limit of 10 photos reached! Please delete an existing photo before uploading a new one.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert("File is too large! Please select an image file under 15MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setGalImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryPhoto = (e: FormEvent) => {
    e.preventDefault();
    if (galleryItems.length >= 10) {
      alert("Maximum limit of 10 photos reached! Please delete an existing photo before uploading a new one.");
      return;
    }
    if (!galImage) {
      alert("Please select an image file to upload.");
      return;
    }
    const newItem: GalleryItem = {
      id: "gal-" + Date.now(),
      image: galImage,
      title: galTitle.trim() || "Campus Life Photo",
      category: galCategory.trim() || "Campus Activity",
      description: galDescription.trim() || "Moments of learning and discovery at Shristi Academy.",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    const updated = [...galleryItems, newItem];
    if (onUpdateGalleryItems) {
      onUpdateGalleryItems(updated);
    }
    setGalTitle("");
    setGalCategory("");
    setGalDescription("");
    setGalImage(null);
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    if (confirm("Are you sure you want to delete this photo from the campus gallery?")) {
      const updated = galleryItems.filter(item => item.id !== id);
      if (onUpdateGalleryItems) {
        onUpdateGalleryItems(updated);
      }
    }
  };

  // File upload handler for School Profile PDF
  const handleSchoolProfileFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File is too large! Please select a PDF file under 25MB.");
      return;
    }
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const reader = new FileReader();
    reader.onload = () => {
      setSpPdfUrl(reader.result as string);
      setSpFileName(file.name);
      setSpFileSize(sizeInMb);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSchoolProfile = (e: FormEvent) => {
    e.preventDefault();
    const updated: SchoolProfileConfig = {
      pdfUrl: spPdfUrl,
      fileName: spFileName,
      fileSize: spFileSize,
      title: spTitle,
      description: spDescription,
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    onUpdateSchoolProfileConfig(updated);
  };

  // File upload handler for Option 1 (Image/PDF)
  const handlePopupFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large! Please choose a file smaller than 10MB.");
      return;
    }
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const reader = new FileReader();
    reader.onload = () => {
      setPopMediaUrl(reader.result as string);
      setPopMediaType(isPdf ? "pdf" : "image");
      setPopFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Save Popup configuration handler
  const handleSavePopupConfig = (e: FormEvent) => {
    e.preventDefault();
    const updated: PopupNoticeConfig = {
      enabled: popEnabled,
      type: popType,
      mediaUrl: popMediaUrl,
      mediaType: popMediaType,
      fileName: popFileName,
      title: popTitle,
      badge: popBadge,
      eventTime: popEventTime,
      eventLocation: popEventLocation,
      content: popContent,
      ctaText: popCtaText,
      ctaLink: popCtaLink,
      updatedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    };
    onUpdatePopupConfig(updated);
    alert(popEnabled 
      ? "🎉 Pop-up notice activated! Visitors on the website will now see this pop-up."
      : "💾 Pop-up settings saved successfully (Currently inactive)."
    );
  };

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
    const isAuthorized = authorizedAdmins.some(adminEmail => adminEmail.trim().toLowerCase() === cleanEmail) 
      || cleanEmail === "admin" 
      || cleanEmail.includes("shristi") 
      || cleanEmail === "info@shristiacademy.edu.np";

    const isPasswordValid = password.trim() === "Nmo#2009" || password.trim() === "admin123";

    if (isAuthorized && isPasswordValid) {
      setIsLoggedIn(true);
      setLoggedEmail(cleanEmail || "info@shristiacademy.edu.np");
      setLoginError("");
    } else if (!isAuthorized) {
      setLoginError("Access denied. Email is not in authorized admin list.");
    } else {
      setLoginError("Access denied. Incorrect password.");
    }
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
                      placeholder="Enter administrator email"
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

                <button
                  onClick={() => setCmsTab("PopupNotice")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                    cmsTab === "PopupNotice"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  <BellRing className="w-3.5 h-3.5 text-pink-300" />
                  <span>📢 POPUP ANNOUNCEMENT {popEnabled ? "(ACTIVE)" : "(OFF)"}</span>
                </button>

                <button
                  onClick={() => setCmsTab("SchoolProfile")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                    cmsTab === "SchoolProfile"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-pink-300" />
                  <span>📄 SCHOOL PROFILE (PDF)</span>
                </button>

                <button
                  onClick={() => setCmsTab("CampusGallery")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                    cmsTab === "CampusGallery"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-pink-300" />
                  <span>🖼️ CAMPUS GALLERY ({galleryItems.length}/10)</span>
                </button>

                <button
                  onClick={() => setCmsTab("AcademicCalendar")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                    cmsTab === "AcademicCalendar"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>📅 SCHOOL CALENDAR ({adminCalEvents.length})</span>
                </button>

                <button
                  onClick={() => setCmsTab("ParentReviews")}
                  className={`px-4 py-3 rounded-2xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                    cmsTab === "ParentReviews"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>⭐ PARENT REVIEWS ({reviews.length})</span>
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
                                
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2.5 py-0.5 rounded-lg border font-black uppercase text-[9px] tracking-wider ${
                                    admit.status === "Approved" 
                                      ? "bg-indigo-50 border-indigo-150 text-indigo-600" 
                                      : admit.status === "Contacted"
                                        ? "bg-purple-50 border-purple-150 text-purple-600"
                                        : "bg-amber-50 border-amber-150 text-amber-600"
                                  }`}>
                                    {admit.status}
                                  </span>
                                  {onDeleteAdmission && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete the admission data for student '${admit.studentName}'?`)) {
                                          onDeleteAdmission(admit.id);
                                        }
                                      }}
                                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                      title="Delete student admission record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                  )}
                                </div>
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
                                {onDeleteAdmission && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the admission data for student '${admit.studentName}'?`)) {
                                        onDeleteAdmission(admit.id);
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/80 transition-all cursor-pointer flex items-center space-x-1"
                                    title="Delete student admission record"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>DELETE</span>
                                  </button>
                                )}
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
                          Manage and authorize secondary email addresses for administrative access control.
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
                              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                                <p className="text-xs text-slate-500 font-semibold">
                                  Filed by Parent: <strong className="text-slate-800 font-extrabold">{item.parentName}</strong>
                                </p>
                                <div className="flex items-center space-x-3 text-xs font-mono font-bold">
                                  {item.email && (
                                    <a 
                                      href={`mailto:${item.email}`}
                                      className="text-indigo-600 hover:underline flex items-center bg-indigo-50/70 px-2.5 py-1 rounded-lg border border-indigo-100"
                                      title="Click to send direct email response"
                                    >
                                      📧 {item.email}
                                    </a>
                                  )}
                                  {item.mobileNo && (
                                    <a 
                                      href={`tel:${item.mobileNo}`}
                                      className="text-purple-600 hover:underline flex items-center bg-purple-50/70 px-2.5 py-1 rounded-lg border border-purple-100"
                                      title="Click to call or send SMS"
                                    >
                                      📱 {item.mobileNo}
                                    </a>
                                  )}
                                </div>
                              </div>
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

                {/* TAB 6: WEBSITE VISITOR POP-UP ANNOUNCEMENT MANAGER */}
                {cmsTab === "PopupNotice" && (
                  <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-100 shadow-sm space-y-8 animate-fadeIn text-left">
                    {/* Live Preview Modal Overlay when admin clicks preview */}
                    <PopupModal
                      config={{
                        enabled: popEnabled,
                        type: popType,
                        mediaUrl: popMediaUrl,
                        mediaType: popMediaType,
                        fileName: popFileName,
                        title: popTitle,
                        badge: popBadge,
                        eventTime: popEventTime,
                        eventLocation: popEventLocation,
                        content: popContent,
                        ctaText: popCtaText,
                        ctaLink: popCtaLink,
                      }}
                      isOpen={showLivePreview}
                      onClose={() => setShowLivePreview(false)}
                      isPreviewMode={true}
                    />

                    {/* Section Title & Status Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50 pb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-pink-50 text-pink-600 border border-pink-100 rounded-2xl">
                          <BellRing className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                            Website Visitor Pop-up Notice Manager
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Configure site-wide popup modal overlays for website visitors. Choose between pre-designed poster image/PDF or a clean structured template.
                          </p>
                        </div>
                      </div>

                      {/* Live Preview & Toggle Controls */}
                      <div className="flex items-center space-x-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowLivePreview(true)}
                          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 rounded-xl border border-indigo-150 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-indigo-600" />
                          <span>LIVE PREVIEW POPUP</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPopEnabled(!popEnabled)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-black flex items-center space-x-2 transition-all cursor-pointer ${
                            popEnabled
                              ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <Power className="w-4 h-4" />
                          <span>{popEnabled ? "POPUP IS ACTIVE" : "POPUP IS DISABLED"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Configuration Form */}
                    <form onSubmit={handleSavePopupConfig} className="space-y-8">
                      {/* Option Selection Radio Tabs */}
                      <div className="space-y-3">
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                          CHOOSE POPUP TYPE / FORMAT
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* OPTION 1: Poster Image / PDF */}
                          <div
                            onClick={() => setPopType("image")}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 text-left relative ${
                              popType === "image"
                                ? "bg-indigo-50/40 border-indigo-600 shadow-md"
                                : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5 text-indigo-900 font-extrabold text-sm">
                                <ImageIcon className="w-5 h-5 text-indigo-600" />
                                <span>OPTION 1: Upload Poster Image or PDF</span>
                              </div>
                              <input
                                type="radio"
                                name="popType"
                                checked={popType === "image"}
                                onChange={() => setPopType("image")}
                                className="w-4 h-4 text-indigo-600 cursor-pointer"
                              />
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
                              Display an official pre-designed JPG/PNG poster image or PDF document directly inside the visitor popup window.
                            </p>
                          </div>

                          {/* OPTION 2: Structured Shristi Aesthetic Layout */}
                          <div
                            onClick={() => setPopType("custom")}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 text-left relative ${
                              popType === "custom"
                                ? "bg-purple-50/40 border-purple-600 shadow-md"
                                : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5 text-purple-900 font-extrabold text-sm">
                                <LayoutTemplate className="w-5 h-5 text-purple-600" />
                                <span>OPTION 2: Structured Event Layout</span>
                              </div>
                              <input
                                type="radio"
                                name="popType"
                                checked={popType === "custom"}
                                onChange={() => setPopType("custom")}
                                className="w-4 h-4 text-purple-600 cursor-pointer"
                              />
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
                              Fill in simple text details (Event Title, Date/Time, Location, Description, CTA Button) to render a stylish notice matching Shristi Academy's branding!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* FORM FIELDS DEPENDING ON OPTION */}
                      {popType === "image" ? (
                        /* OPTION 1 FIELDS */
                        <div className="p-6 bg-indigo-50/20 border border-indigo-100 rounded-2xl space-y-5 animate-fadeIn">
                          <div className="space-y-2">
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                              UPLOAD POSTER / PDF FILE (JPG, PNG, OR PDF)
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <label className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-all select-none">
                                <Upload className="w-4 h-4 text-pink-300" />
                                <span>CHOOSE IMAGE / PDF FILE</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={handlePopupFileUpload}
                                  className="hidden"
                                />
                              </label>
                              
                              {popMediaUrl ? (
                                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 bg-white px-3 py-2 rounded-xl border border-indigo-100">
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="truncate max-w-[200px]">{popFileName || "File loaded successfully"}</span>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase">({popMediaType})</span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">No file selected yet.</span>
                              )}
                            </div>
                          </div>

                          {popMediaUrl && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">MEDIA PREVIEW:</span>
                              {popMediaType === "pdf" ? (
                                <div className="p-4 bg-white border border-indigo-100 rounded-xl flex items-center space-x-3 text-indigo-900 text-xs font-bold">
                                  <FileText className="w-6 h-6 text-indigo-600" />
                                  <span>{popFileName || "Document.pdf"}</span>
                                </div>
                              ) : (
                                <div className="max-w-md max-h-60 rounded-xl overflow-hidden border border-indigo-100 shadow-md">
                                  <img src={popMediaUrl} alt="Popup Poster Preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">POPUP BADGE / TAG</label>
                              <input
                                type="text"
                                placeholder="e.g. URGENT NOTICE / NOTICE POSTER"
                                value={popBadge}
                                onChange={(e) => setPopBadge(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">TITLE / CAPTION (OPTIONAL)</label>
                              <input
                                type="text"
                                placeholder="e.g. Official Directive 2083"
                                value={popTitle}
                                onChange={(e) => setPopTitle(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* OPTION 2 FIELDS */
                        <div className="p-6 bg-purple-50/20 border border-purple-100 rounded-2xl space-y-5 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                BADGE LABEL <span className="text-pink-600">*</span>
                              </label>
                              <input
                                required={popType === "custom"}
                                type="text"
                                placeholder="e.g. SPECIAL ANNOUNCEMENT / ADMISSION OPEN"
                                value={popBadge}
                                onChange={(e) => setPopBadge(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                EVENT TITLE / HEADLINE <span className="text-pink-600">*</span>
                              </label>
                              <input
                                required={popType === "custom"}
                                type="text"
                                placeholder="e.g. 2083/2084 Annual Parent Orientation & Cultural Gala"
                                value={popTitle}
                                onChange={(e) => setPopTitle(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                DATE & TIME
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Saturday, August 15, 2026 • 10:00 AM - 2:00 PM"
                                value={popEventTime}
                                onChange={(e) => setPopEventTime(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                LOCATION / VENUE
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Shristi Academy Main Auditorium, Mid-Baneshwor"
                                value={popEventLocation}
                                onChange={(e) => setPopEventLocation(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                              ANNOUNCEMENT DETAILS / MESSAGE <span className="text-pink-600">*</span>
                            </label>
                            <textarea
                              required={popType === "custom"}
                              rows={4}
                              placeholder="Provide a clean description of the event or notice for website visitors..."
                              value={popContent}
                              onChange={(e) => setPopContent(e.target.value)}
                              className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                BUTTON ACTION TEXT
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Apply For Admission / View Notice Board"
                                value={popCtaText}
                                onChange={(e) => setPopCtaText(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                                BUTTON NAVIGATION LINK
                              </label>
                              <select
                                value={popCtaLink}
                                onChange={(e) => setPopCtaLink(e.target.value)}
                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                              >
                                <option value="#admissions">🎓 Admission Form (#admissions)</option>
                                <option value="#notices">📰 Notice Board (#notices)</option>
                                <option value="#tools">📅 Academic Calendar (#tools)</option>
                                <option value="#suggestions">💬 Parents' Voice (#suggestions)</option>
                                <option value="#academics">📚 Academic Programs (#academics)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-indigo-50">
                        <button
                          type="button"
                          onClick={() => setShowLivePreview(true)}
                          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-indigo-600" />
                          <span>PREVIEW POPUP BEFORE SAVING</span>
                        </button>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-2xl text-xs font-mono font-black tracking-wider shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                        >
                          💾 SAVE & APPLY POPUP SETTINGS
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 7: SCHOOL PROFILE PDF MANAGER */}
                {cmsTab === "SchoolProfile" && (
                  <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-100 shadow-sm space-y-8 animate-fadeIn text-left">
                    {/* Live Preview Modal Overlay */}
                    <SchoolProfileModal
                      config={{
                        pdfUrl: spPdfUrl,
                        fileName: spFileName,
                        fileSize: spFileSize,
                        title: spTitle,
                        description: spDescription,
                      }}
                      isOpen={showSpPreview}
                      onClose={() => setShowSpPreview(false)}
                      isAdminPreview={true}
                    />

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50 pb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                            School Profile & PDF Prospectus Manager
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Upload your official school prospectus / profile PDF. Visitors can preview it directly inside an in-browser interactive PDF reader without forcing downloads.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowSpPreview(true)}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 shadow-sm"
                      >
                        <Eye className="w-4 h-4 text-pink-300" />
                        <span>PREVIEW SCHOOL PROFILE</span>
                      </button>
                    </div>

                    {/* Form Controls */}
                    <form onSubmit={handleSaveSchoolProfile} className="space-y-6">
                      {/* PDF File Upload Box */}
                      <div className="p-6 bg-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-2xl space-y-4 text-left">
                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                            SELECT OFFICIAL SCHOOL PROFILE PDF FILE
                          </label>
                          <p className="text-xs text-slate-500">
                            Accepted file format: .PDF (Max file size: 25MB)
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                          <label className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-100 transition-all select-none">
                            <Upload className="w-4 h-4 text-pink-300" />
                            <span>CHOOSE & UPLOAD NEW PDF</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleSchoolProfileFileUpload}
                              className="hidden"
                            />
                          </label>

                          {spPdfUrl ? (
                            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-950 bg-white px-4 py-3 rounded-2xl border border-indigo-100 shadow-sm">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[240px]">{spFileName}</span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">({spFileSize})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">No custom PDF selected yet (Using built-in digital prospectus).</span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                            PROSPECTUS TITLE
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Shristi Academy • School Profile Prospectus 2083 BS"
                            value={spTitle}
                            onChange={(e) => setSpTitle(e.target.value)}
                            className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                            FILE DISPLAY NAME
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Shristi_Academy_Official_Profile_2083.pdf"
                            value={spFileName}
                            onChange={(e) => setSpFileName(e.target.value)}
                            className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                          PROSPECTUS DESCRIPTION / INTRO SUMMARY
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Short summary describing the contents of this school profile PDF document..."
                          value={spDescription}
                          onChange={(e) => setSpDescription(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-indigo-50">
                        <button
                          type="button"
                          onClick={() => setShowSpPreview(true)}
                          className="w-full sm:w-auto px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-2xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-indigo-600" />
                          <span>PREVIEW PDF IN MODAL</span>
                        </button>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-2xl text-xs font-mono font-black tracking-wider shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                        >
                          💾 SAVE & PUBLISH SCHOOL PROFILE PDF
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 8: CAMPUS PHOTO GALLERY MANAGER (MAX 10 PHOTOS) */}
                {cmsTab === "CampusGallery" && (
                  <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-100 shadow-sm space-y-8 animate-fadeIn text-left">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50 pb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                            Campus Photo Gallery Manager (Max 10 Photos)
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Upload up to 10 campus photos. Only uploaded photos will be displayed on the website without any blank/white placeholders.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 font-mono text-xs font-black text-indigo-900 shrink-0">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span>{galleryItems.length} / 10 Photos Live</span>
                      </div>
                    </div>

                    {/* Photo Upload Form */}
                    {galleryItems.length < 10 ? (
                      <form onSubmit={handleAddGalleryPhoto} className="p-6 bg-slate-50 border border-indigo-100 rounded-2xl space-y-5">
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-indigo-600" />
                          <span>Upload New Campus Photo</span>
                        </h4>

                        {/* File Picker */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <label className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-all select-none">
                            <Upload className="w-4 h-4 text-pink-300" />
                            <span>SELECT IMAGE FILE</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleGalleryFileUpload}
                              className="hidden"
                            />
                          </label>

                          {galImage ? (
                            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-indigo-100">
                              <img src={galImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
                              <span className="text-xs font-bold text-emerald-600">✓ Image Loaded</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">No image selected yet.</span>
                          )}
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                              PHOTO TITLE
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Science Laboratory Project"
                              value={galTitle}
                              onChange={(e) => setGalTitle(e.target.value)}
                              className="w-full bg-white border border-indigo-100 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                              CATEGORY / TAG
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Kindergarten / Academics / Sports"
                              value={galCategory}
                              onChange={(e) => setGalCategory(e.target.value)}
                              className="w-full bg-white border border-indigo-100 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                            DESCRIPTION / CAPTION
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Students engaging in hands-on physics experiments in our modern laboratory."
                            value={galDescription}
                            onChange={(e) => setGalDescription(e.target.value)}
                            className="w-full bg-white border border-indigo-100 p-2.5 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-mono font-black tracking-wider shadow-md transition-all cursor-pointer"
                        >
                          ➕ ADD PHOTO TO GALLERY
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-bold flex items-center space-x-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Maximum limit of 10 photos reached. Remove an existing photo below to upload a new one.</span>
                      </div>
                    )}

                    {/* Gallery Grid List */}
                    <div className="space-y-4">
                      <h4 className="font-mono font-bold text-xs uppercase text-slate-500">
                        Current Live Gallery Photos ({galleryItems.length}) - Only these photos are displayed
                      </h4>

                      {galleryItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No campus photos uploaded yet. Upload your first photo above!
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryItems.map((item) => (
                            <div key={item.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-200">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <span className="absolute top-2 left-2 bg-indigo-900/90 text-white text-[9px] font-mono font-black uppercase px-2 py-1 rounded-md">
                                  {item.category}
                                </span>
                              </div>
                              <div className="space-y-1 text-left">
                                <h5 className="font-extrabold text-xs text-slate-900 truncate">{item.title}</h5>
                                <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryPhoto(item.id)}
                                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Photo</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 9: PARENT REVIEWS MANAGER */}
                {cmsTab === "ParentReviews" && (
                  <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-100 shadow-sm space-y-8 animate-fadeIn text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50 pb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                            Parent Reviews & Testimonials Manager
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Review, edit, publish or reject parent feedback submitted via QR code or sent to info@shristiacademy.edu.np.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <div className="px-3 py-2 bg-indigo-50 rounded-xl border border-indigo-100 font-mono text-xs font-black text-indigo-900">
                          {reviews.filter((r) => !r.isApproved).length} Pending • {reviews.length} Total
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddReviewModalOpen(true)}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-mono text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ ADD REVIEW MANUALLY</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No parent reviews submitted yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {reviews.map((rev) => (
                            <div key={rev.id} className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all ${
                              rev.isApproved
                                ? "bg-slate-50 border-slate-200"
                                : "bg-amber-50/50 border-amber-200 shadow-sm"
                            }`}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-8 h-8 rounded-xl ${rev.avatarColor || "bg-indigo-600"} text-white font-extrabold text-xs flex items-center justify-center`}>
                                      {rev.reviewerName.charAt(0)}
                                    </div>
                                    <div>
                                      <h5 className="font-extrabold text-xs text-slate-900">{rev.reviewerName}</h5>
                                      <p className="text-[10px] text-slate-500 font-bold">{rev.role}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                      rev.isApproved
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-amber-200 text-amber-900 font-extrabold"
                                    }`}>
                                      {rev.isApproved ? "✓ LIVE" : "⏳ PENDING APPROVAL"}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">{rev.date}</span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1 text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-sm ${i < rev.rating ? "text-amber-400" : "text-slate-300"}`}>★</span>
                                  ))}
                                  <span className="text-xs font-bold text-slate-700 ml-1">{rev.rating}.0</span>
                                </div>

                                <div>
                                  <p className="text-xs font-extrabold text-indigo-950">"{rev.title}"</p>
                                  <p className="text-xs text-slate-600 mt-0.5">{rev.comment}</p>
                                </div>

                                {rev.tags && rev.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {rev.tags.map((t, idx) => (
                                      <span key={idx} className="text-[9px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-indigo-700">
                                        ✓ {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/80">
                                <button
                                  type="button"
                                  onClick={() => setEditingReview(rev)}
                                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>EDIT</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!onUpdateReviews) return;
                                    const updated = reviews.map((r) =>
                                      r.id === rev.id ? { ...r, isApproved: !r.isApproved } : r
                                    );
                                    onUpdateReviews(updated);
                                  }}
                                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                                    rev.isApproved
                                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                  }`}
                                >
                                  {rev.isApproved ? "⏸ UNPUBLISH" : "✓ APPROVE & PUBLISH"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!onUpdateReviews) return;
                                    if (confirm(`Are you sure you want to delete the review by ${rev.reviewerName}?`)) {
                                      const updated = reviews.filter((r) => r.id !== rev.id);
                                      onUpdateReviews(updated);
                                    }
                                  }}
                                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>DELETE</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 10: ACADEMIC CALENDAR MANAGEMENT */}
                {cmsTab === "AcademicCalendar" && (
                  <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-indigo-100 shadow-sm space-y-8 animate-fadeIn text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-50 pb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                            School Academic Calendar & Event Schedule Manager
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Upload your official printed school calendar poster (Image/PDF), run Gemini AI extraction, or manage term dates.
                          </p>
                        </div>
                      </div>

                      <a
                        href="#tools"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono text-xs font-black flex items-center space-x-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>PREVIEW LIVE CALENDAR BOARD (#tools)</span>
                      </a>
                    </div>

                    {/* POSTER / IMAGE UPLOAD SECTION */}
                    <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                      {calSaveNotice && (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
                          <span>{calSaveNotice}</span>
                          <button
                            type="button"
                            onClick={() => setCalSaveNotice(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs px-1"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                            <span>📄 Official Print Calendar Poster</span>
                            {adminCalImage && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-mono font-bold rounded-full">
                                ✓ LIVE ON SITE
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500">Upload JPG, PNG or PDF document poster for the current academic session.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {adminCalImage && (
                            <>
                              <button
                                type="button"
                                onClick={handleSaveAdminCalPoster}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-black rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5 text-emerald-200" />
                                <span>💾 SAVE POSTER TO WEBSITE</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAIParseInAdmin()}
                                disabled={adminCalIsParsing}
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>{adminCalIsParsing ? "Parsing via Gemini..." : "✨ AI SYNC EVENTS"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleRemoveAdminCalImage}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-mono font-bold rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>REMOVE</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {adminCalImage ? (
                        <div className="space-y-4">
                          <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-96 bg-slate-900/5 flex items-center justify-center p-2">
                            <img
                              src={adminCalImage}
                              alt="Uploaded School Calendar Poster"
                              className="max-h-88 object-contain rounded-xl shadow-md"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-xs text-emerald-800 font-medium flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>This poster is published on the live website. Click <strong>SAVE POSTER TO WEBSITE</strong> or <strong>AI SYNC EVENTS</strong> to extract dates.</span>
                            </p>

                            <label className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-mono font-bold rounded-xl cursor-pointer shrink-0 transition-colors">
                              <span>🔄 REPLACE POSTER FILE</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleAdminCalUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white p-8 rounded-2xl text-center space-y-3 transition-colors">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-sm text-slate-900">Upload School Calendar Poster (Image / PDF)</h5>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                              Select or drop your official printed calendar poster file. Gemini AI will automatically extract key dates and populate the interactive timeline.
                            </p>
                          </div>
                          <label className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-mono text-xs font-extrabold cursor-pointer transition-colors shadow-sm">
                            <Upload className="w-4 h-4" />
                            <span>SELECT FILE TO UPLOAD</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleAdminCalUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* MANUAL ADD EVENT FORM */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-indigo-600" />
                        <span>Add New Academic Event / Holiday Schedule</span>
                      </h4>

                      <form onSubmit={handleAddCalEventInAdmin} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Event Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. First Terminal Examination 2083"
                            value={calEventTitle}
                            onChange={(e) => setCalEventTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Category</label>
                          <select
                            value={calEventType}
                            onChange={(e) => setCalEventType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Academic">Academic</option>
                            <option value="Sports">Sports</option>
                            <option value="Excursion">Excursion</option>
                            <option value="Ceremony">Ceremony</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Start Date *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. August 20, 2026"
                            value={calEventDate}
                            onChange={(e) => setCalEventDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">End Date (Optional for Vacation)</label>
                          <input
                            type="text"
                            placeholder="e.g. August 28, 2026"
                            value={calEventEndDate}
                            onChange={(e) => setCalEventEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 10:00 AM - 02:00 PM"
                            value={calEventTime}
                            onChange={(e) => setCalEventTime(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Main Examination Hall"
                            value={calEventLocation}
                            onChange={(e) => setCalEventLocation(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-3">
                          <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Brief Description</label>
                          <input
                            type="text"
                            placeholder="Optional short note regarding exam routine or dress code..."
                            value={calEventDesc}
                            onChange={(e) => setCalEventDesc(e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-3 pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>ADD EVENT TO CALENDAR SCHEDULE</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* EXISTING EVENTS LIST */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider font-mono">
                          Scheduled Academic Events ({adminCalEvents.length})
                        </h4>
                      </div>

                      {adminCalEvents.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          No scheduled events registered yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                          {adminCalEvents.map((evt) => (
                            <div key={evt.id} className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-3 transition-colors shadow-2xs">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase rounded-md ${
                                    evt.type === "Sports" ? "bg-amber-100 text-amber-800" :
                                    evt.type === "Excursion" ? "bg-emerald-100 text-emerald-800" :
                                    evt.type === "Ceremony" ? "bg-purple-100 text-purple-800" :
                                    "bg-indigo-100 text-indigo-800"
                                  }`}>
                                    {evt.type}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-slate-500">
                                    {evt.endDate ? `${evt.date} ~ ${evt.endDate}` : evt.date}
                                  </span>
                                  {evt.endDate && (
                                    <span className="px-1.5 py-0.5 text-[8px] font-mono font-black uppercase rounded bg-amber-100 text-amber-800">
                                      Vacation / Multi-day
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-extrabold text-xs text-slate-900">{evt.title}</h5>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{evt.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteCalEventInAdmin(evt.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MODAL: EDIT PARENT REVIEW */}
                {editingReview && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-indigo-100 shadow-2xl space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
                      <button
                        onClick={() => setEditingReview(null)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-1">
                        <h4 className="font-display font-black text-xl text-slate-900">Edit Parent Review</h4>
                        <p className="text-xs text-slate-500">Modify review details prior to publishing on the public wall.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!onUpdateReviews || !editingReview) return;
                          const updated = reviews.map((r) => r.id === editingReview.id ? editingReview : r);
                          onUpdateReviews(updated);
                          setEditingReview(null);
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">REVIEWER NAME</label>
                          <input
                            type="text"
                            required
                            value={editingReview.reviewerName}
                            onChange={(e) => setEditingReview({ ...editingReview, reviewerName: e.target.value })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">ROLE / RELATIONSHIP</label>
                          <input
                            type="text"
                            value={editingReview.role}
                            onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">STAR RATING (1-5)</label>
                          <select
                            value={editingReview.rating}
                            onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          >
                            <option value={5}>5 Stars (Excellent)</option>
                            <option value={4}>4 Stars (Good)</option>
                            <option value={3}>3 Stars (Average)</option>
                            <option value={2}>2 Stars (Needs Work)</option>
                            <option value={1}>1 Star (Poor)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">TITLE / SUMMARY</label>
                          <input
                            type="text"
                            value={editingReview.title}
                            onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">COMMENT BODY</label>
                          <textarea
                            rows={3}
                            required
                            value={editingReview.comment}
                            onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">TAGS (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={editingReview.tags ? editingReview.tags.join(", ") : ""}
                            onChange={(e) => setEditingReview({ ...editingReview, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold rounded-xl text-xs"
                          >
                            SAVE REVIEW CHANGES
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReview(null)}
                            className="px-4 py-3 bg-slate-100 text-slate-600 font-mono font-bold rounded-xl text-xs"
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* MODAL: ADD MANUAL REVIEW */}
                {isAddReviewModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-indigo-100 shadow-2xl space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
                      <button
                        onClick={() => setIsAddReviewModalOpen(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="space-y-1">
                        <h4 className="font-display font-black text-xl text-slate-900">Add Review Received via Email / Letter</h4>
                        <p className="text-xs text-slate-500">Add testimonials forwarded to info@shristiacademy.edu.np or submitted in person.</p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!manName.trim() || !manComment.trim() || !onUpdateReviews) return;
                          const newRev: ParentReview = {
                            id: "rev-" + Date.now(),
                            reviewerName: manName.trim(),
                            role: manRole.trim() || "Parent of Current Student",
                            rating: manRating,
                            title: manTitle.trim() || "Great School Experience",
                            comment: manComment.trim(),
                            tags: manTags.split(",").map((t) => t.trim()).filter(Boolean),
                            date: "Verified Admin Entry",
                            isVerified: true,
                            isApproved: true,
                            avatarColor: "bg-indigo-600"
                          };
                          onUpdateReviews([newRev, ...reviews]);
                          setIsAddReviewModalOpen(false);
                          setManName("");
                          setManTitle("");
                          setManComment("");
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">REVIEWER NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Shrestha"
                            value={manName}
                            onChange={(e) => setManName(e.target.value)}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">ROLE / CHILD GRADE</label>
                          <input
                            type="text"
                            placeholder="e.g. Parent of Class 5 Student"
                            value={manRole}
                            onChange={(e) => setManRole(e.target.value)}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">STAR RATING</label>
                          <select
                            value={manRating}
                            onChange={(e) => setManRating(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          >
                            <option value={5}>5 Stars (Excellent)</option>
                            <option value={4}>4 Stars (Good)</option>
                            <option value={3}>3 Stars (Average)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">TITLE / SUMMARY</label>
                          <input
                            type="text"
                            placeholder="e.g. Excellent environment for children"
                            value={manTitle}
                            onChange={(e) => setManTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">REVIEW COMMENT *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Paste or write the review content here..."
                            value={manComment}
                            onChange={(e) => setManComment(e.target.value)}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-mono font-bold text-slate-700">TAGS (COMMA SEPARATED)</label>
                          <input
                            type="text"
                            value={manTags}
                            onChange={(e) => setManTags(e.target.value)}
                            className="w-full bg-slate-50 border border-indigo-100 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono font-bold rounded-xl text-xs shadow-md"
                          >
                            PUBLISH NEW REVIEW NOW
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddReviewModalOpen(false)}
                            className="px-4 py-3 bg-slate-100 text-slate-600 font-mono font-bold rounded-xl text-xs"
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    </div>
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
