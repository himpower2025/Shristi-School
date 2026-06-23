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
  level: "Pre-School" | "Primary School" | "Secondary School";
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
  category: string;
  content: string;
  pin: string; // 4-digit security code
  submittedAt: string;
  adminReply?: string;
  repliedAt?: string;
}

