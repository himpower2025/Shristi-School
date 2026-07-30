export type NoticeCategory = "Academic" | "Event" | "Exam" | "Result" | "Holiday";

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  date: string;
  author: string;
  pinned: boolean;
  targetAudience: string;
}

export interface AcademicProgram {
  id: string;
  level: "Kindergarten" | "Primary School" | "Lower Secondary" | "Secondary School";
  title: string;
  description: string;
  subjects: string[];
  careers: string[];
  duration: string;
  iconName: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  time: string;
  location: string;
  type: "Sports" | "Academic" | "Excursion" | "Ceremony";
}

export interface AdmissionQuery {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  mobileNo: string;
  gradeOfInterest: string;
  previousSchool: string;
  district: string;
  submittedAt: string;
  status: "Pending" | "Contacted" | "Approved";
}

export interface SuggestionInquiry {
  id: string;
  title: string;
  parentName: string;
  email: string;
  mobileNo: string;
  category: string;
  content: string;
  pin: string; // 4-digit security code
  submittedAt: string;
  createdAtMs?: number; // Epoch timestamp for 1-year auto-expiration
  adminReply?: string;
  repliedAt?: string;
}

export interface PopupNoticeConfig {
  enabled: boolean;
  type: "image" | "custom";
  // Option 1: Image / Poster / PDF File
  mediaUrl?: string | null;
  mediaType?: "image" | "pdf";
  fileName?: string;
  
  // Option 2: Structured Event / Notice Format
  title: string;
  badge?: string;
  eventTime?: string;
  eventLocation?: string;
  content: string;
  ctaText?: string;
  ctaLink?: string;
  
  updatedAt?: string;
}

export interface SchoolProfileConfig {
  pdfUrl: string | null;
  fileName: string;
  fileSize?: string;
  updatedAt?: string;
  title?: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
  description: string;
  uploadedAt?: string;
}

export interface ParentReview {
  id: string;
  reviewerName: string;
  role: string; // e.g., "Parent of Class 3", "Kindergarten Parent", "Alumni Parent"
  rating: number; // 1 to 5
  title: string; // Short headline
  comment: string;
  tags?: string[]; // e.g. ["Passionate Teachers", "Safe Environment"]
  date: string;
  isVerified: boolean;
  isApproved: boolean;
  avatarColor?: string;
}

