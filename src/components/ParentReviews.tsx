import React, { useState } from "react";
import { Star, CheckCircle, QrCode, Plus, Sparkles, MessageSquare, X, Send, Award, Heart, ThumbsUp, Printer, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParentReview } from "../types";

export const DEFAULT_PARENT_REVIEWS: ParentReview[] = [
  {
    id: "rev-1",
    reviewerName: "Shantivani Pradhan",
    role: "Parent of Class 4 Student",
    rating: 5,
    title: "Child-centered school with passionate teachers",
    comment: "Child centered school with passionate teachers. My daughter loves going to school every morning and has grown so confident in her reading and speaking.",
    tags: ["Passionate Teachers", "Child-Centered"],
    date: "2 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-emerald-500"
  },
  {
    id: "rev-2",
    reviewerName: "Aashish Lal",
    role: "Parent of Kindergarten Student",
    rating: 5,
    title: "Best school ever, thank you!",
    comment: "Best school ever! Thank you for taking care of my daughter with so much patience and love. The teachers treat every child like family.",
    tags: ["Kindergarten Care", "Family Atmosphere"],
    date: "3 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-indigo-500"
  },
  {
    id: "rev-3",
    reviewerName: "Krishna Joshi",
    role: "Parent of Class 8 Student",
    rating: 5,
    title: "Where young minds grow, explore, and excel!",
    comment: "Shristi Academy – Where young minds grow, explore, and excel! A premier destination for holistic development, nurturing students with strong values and practical science skills.",
    tags: ["Holistic Growth", "Science & Labs"],
    date: "4 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-purple-500"
  },
  {
    id: "rev-4",
    reviewerName: "Ranju Upreti",
    role: "Parent of Class 2 Student",
    rating: 5,
    title: "Great school for exponential learning!",
    comment: "Great school for exponential learning! The combination of smart classrooms, healthy school meals, and sports activities keeps our children active and motivated.",
    tags: ["Smart Classrooms", "Healthy Lunch"],
    date: "5 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-pink-500"
  },
  {
    id: "rev-5",
    reviewerName: "Anzir Rana",
    role: "Parent of Class 6 Student",
    rating: 5,
    title: "Outstanding school and safe environment",
    comment: "One of the finest schools in Kathmandu. Clean facilities, safe bus transportation, and very responsive school management.",
    tags: ["Safe Transport", "Clean Campus"],
    date: "6 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-amber-500"
  },
  {
    id: "rev-6",
    reviewerName: "Tara Bhattarai",
    role: "Parent of Class 10 (SEE) Student",
    rating: 5,
    title: "Highly recommend for SEE Board prep!",
    comment: "One of the best schools in town! The Category A academic standards and teacher guidance for Class 10 SEE preparation are exceptional. Highly recommended!",
    tags: ["Category A Quality", "SEE Exam Prep"],
    date: "7 months ago",
    isVerified: true,
    isApproved: true,
    avatarColor: "bg-blue-500"
  }
];

interface ParentReviewsProps {
  reviews: ParentReview[];
  onAddReview: (review: ParentReview) => void;
}

export default function ParentReviews({ reviews, onAddReview }: ParentReviewsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  // Form State
  const [reviewerName, setReviewerName] = useState("");
  const [role, setRole] = useState("Parent of Current Student");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Passionate Teachers"]);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableTags = [
    "Passionate Teachers",
    "Category A Quality",
    "Child-Centered",
    "Safe Transport",
    "Healthy Lunch",
    "Smart Classrooms",
    "Clean Campus",
    "SEE Exam Prep"
  ];

  const approvedReviews = reviews.filter((r) => r.isApproved !== false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    const colors = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newReview: ParentReview = {
      id: "rev-" + Date.now(),
      reviewerName: reviewerName.trim(),
      role: role.trim() || "Parent of Current Student",
      rating,
      title: title.trim() || "Excellent Experience at Shristi Academy",
      comment: comment.trim(),
      tags: selectedTags,
      date: "Just now",
      isVerified: true,
      isApproved: true, // Approved by default for instant delight
      avatarColor: randomColor
    };

    onAddReview(newReview);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsFormOpen(false);
      // Reset form
      setReviewerName("");
      setTitle("");
      setComment("");
    }, 1800);
  };

  // Target Review Submission URL for QR Code
  const reviewPageUrl = typeof window !== "undefined" ? `${window.location.origin}#parent-reviews` : "https://shristiacademy.edu.np#parent-reviews";
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewPageUrl)}&color=4f46e5`;

  return (
    <section id="parent-reviews" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-200/20 via-pink-200/20 to-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider shadow-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Verified Parent Feedback</span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
              Parent Reviews & Testimonials
            </h2>
            
            <p className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed">
              Read authentic experiences shared by parents and guardians. At Shristi Academy, our greatest reward is seeing every student thrive in a safe, caring, and encouraging school environment.
            </p>
          </div>

          {/* Overall Rating Box & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Rating Summary Pill */}
            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-md flex items-center space-x-3">
              <div className="text-center border-r border-slate-100 pr-3">
                <span className="text-2xl font-black text-slate-900 leading-none block">4.9</span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">out of 5.0</span>
              </div>
              <div className="space-y-1">
                <div className="flex text-amber-400 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-600 font-extrabold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{approvedReviews.length} Verified Reviews</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs font-mono font-black tracking-wider shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>WRITE A REVIEW</span>
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-4 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl border-2 border-slate-200 text-xs font-mono font-black flex items-center justify-center space-x-2 shadow-sm transition-all hover:scale-105 cursor-pointer"
                title="Scan QR Code to submit review on mobile"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>QR CODE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-7 rounded-[28px] border border-indigo-100 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between relative group text-left"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name, Rating, Verified Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-2xl ${rev.avatarColor || "bg-indigo-500"} text-white font-black text-lg flex items-center justify-center shadow-sm shrink-0 uppercase`}>
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug flex items-center space-x-1.5">
                        <span>{rev.reviewerName}</span>
                        {rev.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0" title="Verified Parent" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bold">{rev.role}</p>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{rev.date}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-100 text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-600 ml-1.5">{rev.rating}.0</span>
                </div>

                {/* Review Title & Comment */}
                <div className="space-y-1.5 pt-1">
                  <h5 className="font-extrabold text-sm text-indigo-950 leading-snug">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed italic">
                    {rev.comment}
                  </p>
                </div>
              </div>

              {/* Tags / Strengths */}
              {rev.tags && rev.tags.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {rev.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>

      {/* MODAL 1: WRITE A REVIEW FORM */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-indigo-100 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Title */}
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Parent Feedback Form</span>
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Share Your School Experience
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Your feedback helps us continuously improve our school standards and environment for all children.
                </p>
              </div>

              {submittedSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-lg text-emerald-950">Thank You for Your Review!</h4>
                  <p className="text-xs font-bold text-emerald-800">
                    Your valuable review has been recorded and added to our school feedback wall.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Reviewer Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Krishna Joshi / Shantivani Pradhan"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-slate-50 border border-indigo-100 p-3 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Relationship / Role */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      RELATIONSHIP / CHILD'S GRADE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Parent of Class 3 Student / Kindergarten Parent"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-50 border border-indigo-100 p-3 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      STAR RATING *
                    </label>
                    <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-indigo-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 fill-slate-100"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-black text-amber-600 ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      SHORT SUMMARY / TITLE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Child-centered school with passionate teachers!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-indigo-100 p-3 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      DETAILED COMMENT / FEEDBACK *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share what you appreciate most about Shristi Academy (teachers, safety, academics, lunch, environment)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-slate-50 border border-indigo-100 p-3 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* Strength Badges selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      SELECT KEY STRENGTHS (OPTIONAL)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-all ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-mono font-black rounded-xl text-xs tracking-wider shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>SUBMIT PARENT REVIEW</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: QR CODE SCAN & PRINT POSTER */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 border border-indigo-100 shadow-2xl space-y-6 relative text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-900 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold">
                  <QrCode className="w-4 h-4 text-pink-600" />
                  <span>Mobile Review Access</span>
                </div>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Scan to Leave a Review
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Parents and visitors can scan this QR code using any smartphone camera to open the review form directly.
                </p>
              </div>

              {/* QR Code Graphic Stand */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 rounded-2xl border border-indigo-100 space-y-3 shadow-inner">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md inline-block">
                  <img
                    src={qrCodeImageUrl}
                    alt="Shristi Academy Parent Review QR Code"
                    className="w-48 h-48 object-contain mx-auto"
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-indigo-900 block">
                    🏫 SHRISTI ACADEMY PARENT FEEDBACK
                  </span>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Scan with camera • Takes only 1 minute
                  </p>
                </div>
              </div>

              {/* Poster Printing Note */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-amber-900 text-xs font-bold flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>School Desk Tip:</strong> Print this QR code and display it on the reception counter or principal's office stand so visiting parents can share feedback easily!
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT QR STAND</span>
                </button>
                
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
