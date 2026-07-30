import React, { useState, useEffect } from "react";
import { ArrowRight, GraduationCap, Users, AlertCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import learningImg from "../assets/images/montessori_learning_1782145030889.jpg";
import labImg from "../assets/images/science_lab_1782145047179.jpg";
import playImg from "../assets/images/school_activities_1782145063241.jpg";

interface HeroProps {
  onExplorePrograms: () => void;
  onApplyNow: () => void;
  onViewNotices: () => void;
  lastNoticeTitle: string;
}

const CAMPUS_MOMENTS = [
  {
    image: learningImg,
    title: "Kindergarten Classes",
    description: "Building basic reading, counting, and social confidence in a warm, friendly environment.",
    tag: "Kindergarten"
  },
  {
    image: labImg,
    title: "Science & Computers",
    description: "Fun science experiments and practical computer skills for growing minds.",
    tag: "Academics"
  },
  {
    image: playImg,
    title: "Vibrant School Life",
    description: "Sports, teamwork, creative arts, and healthy outdoor activities.",
    tag: "School Life"
  }
];

export default function Hero({ onExplorePrograms, onApplyNow, onViewNotices, lastNoticeTitle }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the gallery slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_MOMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % CAMPUS_MOMENTS.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + CAMPUS_MOMENTS.length) % CAMPUS_MOMENTS.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] bg-dot-grid text-slate-800 min-h-[92vh] flex flex-col justify-center py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      {/* Background Ambience Glares - Soft & Elegant Sass colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/40 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-200/30 blur-[130px] pointer-events-none animate-pulse" />

      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-center">
        
        {/* Text Messaging Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Announcement Alert Capsule */}
          {lastNoticeTitle && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onViewNotices}
              className="inline-flex items-center space-x-2 bg-white hover:bg-indigo-50/50 border border-indigo-100 p-2 pr-5 rounded-full text-xs cursor-pointer shadow-sm transition-all max-w-full"
            >
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shrink-0">
                Latest Notice
              </span>
              <span className="text-slate-600 font-semibold truncate max-w-[180px] sm:max-w-md">
                {lastNoticeTitle}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            </motion.div>
          )}

          {/* Heading */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block border border-indigo-150">
                🏫 Shristi Academy Secondary School
              </span>
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 border border-amber-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Category 'A' Certified
              </span>
            </div>
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-slate-900">
              Where Young Minds <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Thrive & Excel.
              </span>
            </h1>
            <p className="text-indigo-700 text-lg sm:text-xl font-black italic border-l-4 border-pink-500 pl-4 py-1 bg-pink-50/30 rounded-r-lg max-w-lg">
              "I Care, So I Teach" — Our School Motto
            </p>
            <p className="text-slate-700 text-lg sm:text-xl font-bold leading-relaxed max-w-2xl">
              Welcoming students in Mid-Baneshwor, Kathmandu from Kindergarten to Class 10 (SEE). We offer a safe, caring, and friendly school environment with quality education and supportive teachers.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={onApplyNow}
              className="px-8 py-4 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 hover:from-pink-500 hover:to-pink-600 hover:scale-105 active:scale-95 text-slate-950 font-black rounded-2xl shadow-xl shadow-pink-200/60 flex items-center justify-center space-x-2.5 cursor-pointer transition-all duration-300 border-b-4 border-pink-600"
            >
              <GraduationCap className="w-6 h-6 text-slate-950" />
              <span className="text-sm sm:text-base tracking-tight">Apply for Admission</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExplorePrograms}
              className="px-8 py-4 bg-white hover:bg-indigo-50 hover:scale-105 active:scale-95 text-indigo-700 font-black rounded-2xl border-2 border-indigo-500 flex items-center justify-center space-x-2 cursor-pointer shadow-md transition-all duration-300"
            >
              <span className="text-sm sm:text-base">Explore Our Classes</span>
            </button>
          </div>

          {/* Location Badge */}
          <div className="pt-6 flex flex-wrap gap-y-2 items-center gap-x-4 text-slate-600 text-xs sm:text-sm font-mono font-black">
            <span className="flex items-center text-indigo-700 bg-indigo-100/65 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-sm">
              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2 animate-ping" />
              Admissions Open for Batch 2083 BS
            </span>
            <span className="hidden sm:inline text-indigo-300">•</span>
            <span className="text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">Kindergarten to Class 10 (SEE)</span>
          </div>

        </div>

        {/* Visual Right Showcase Column (SaaS inspired card UI layout + Mini Gallery) */}
        <div className="lg:col-span-6 relative pt-8 lg:pt-0">
          <div className="relative mx-auto max-w-[420px] lg:max-w-none">
            
            {/* Visual Backframe Glow - Beautiful neon purple orange palette */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/30 via-purple-400/20 to-pink-400/30 rounded-[36px] blur-3xl transform rotate-6 pointer-events-none" />

            {/* Playful Floating Badges */}
            <div className="absolute left-1 sm:-left-10 top-16 bg-white/95 border-2 border-indigo-500 p-2.5 sm:p-3 rounded-2xl shadow-xl z-20 flex items-center space-x-2 animate-bounce cursor-pointer select-none" style={{ animationDuration: "3s" }}>
              <span className="text-lg sm:text-xl">📚</span>
              <div className="text-left leading-none">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-black block">CURRICULUM</span>
                <span className="text-[11px] sm:text-xs font-black text-indigo-950">Govt. Approved</span>
              </div>
            </div>

            <div className="absolute right-1 sm:-right-8 top-1/3 bg-white/95 border-2 border-pink-500 p-2.5 sm:p-3 rounded-2xl shadow-xl z-20 flex items-center space-x-2 animate-pulse cursor-pointer select-none" style={{ animationDuration: "2.5s" }}>
              <span className="text-lg sm:text-xl">🚌</span>
              <div className="text-left leading-none">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-black block">SCHOOL BUS</span>
                <span className="text-[11px] sm:text-xs font-black text-pink-950">Safe Transport</span>
              </div>
            </div>

            <div className="absolute left-1 sm:-left-6 bottom-32 bg-white/95 border-2 border-purple-500 p-2.5 sm:p-3 rounded-2xl shadow-xl z-20 items-center space-x-2 animate-bounce cursor-pointer select-none hidden sm:flex" style={{ animationDuration: "4.5s" }}>
              <span className="text-lg sm:text-xl">🍲</span>
              <div className="text-left leading-none">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-black block">NUTRITION</span>
                <span className="text-[11px] sm:text-xs font-black text-purple-950">Healthy Lunch</span>
              </div>
            </div>

            {/* Premium Card Container */}
            <div className="relative bg-white/90 backdrop-blur-md border-2 border-indigo-100 p-6 md:p-8 rounded-[32px] shadow-2xl shadow-indigo-100/80">
              
              <div className="flex justify-between items-center mb-5">
                <div className="flex space-x-2 items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider border border-indigo-100">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: "3s" }} />
                  <span>Campus Life In Action</span>
                </div>
              </div>

              {/* Dynamic Slideshow Showcase Card */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-200 shadow-inner group/gallery mb-6">
                
                {/* Active Image with transition */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={CAMPUS_MOMENTS[currentSlide].image}
                      alt={CAMPUS_MOMENTS[currentSlide].title}
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Tag */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-md text-indigo-700 font-mono text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-xl select-none border border-indigo-100">
                  {CAMPUS_MOMENTS[currentSlide].tag}
                </div>

                {/* Chevron Navigation Controls - visible on hover or mobile always */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow text-slate-800 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow text-slate-800 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Bottom Overlay Info Text */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left pointer-events-none select-none">
                  <h4 className="text-white font-extrabold text-sm font-display tracking-tight leading-tight">
                    {CAMPUS_MOMENTS[currentSlide].title}
                  </h4>
                  <p className="text-slate-200 text-[10px] sm:text-[11px] font-medium opacity-90 truncate mt-0.5">
                    {CAMPUS_MOMENTS[currentSlide].description}
                  </p>
                </div>

                {/* Image Indicator Dots */}
                <div className="absolute right-3.5 bottom-3.5 flex items-center space-x-1 z-10">
                  {CAMPUS_MOMENTS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? "w-4 bg-pink-500" : "w-1.5 bg-white/60 hover:bg-white"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>

              {/* Showcase School Highlights */}
              <div className="space-y-4">
                
                {/* Visual Segment 1: Classroom Pedagogy */}
                <div className="bg-indigo-50/60 p-4 border border-indigo-100 rounded-2xl flex items-center space-x-3.5 shadow-sm hover:scale-[1.02] transition-transform duration-200">
                  <div className="w-11 h-11 text-indigo-700 bg-white border border-indigo-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-sm text-indigo-950">Kindergarten to Grade 10</h3>
                    <p className="text-xs text-slate-600 font-bold">Complete care and quality education for all ages</p>
                  </div>
                </div>

                {/* Visual Segment 2: Interactive Tech */}
                <div className="bg-purple-50/60 p-4 border border-purple-100 rounded-2xl flex items-center space-x-3.5 shadow-sm hover:scale-[1.02] transition-transform duration-200">
                  <div className="w-11 h-11 text-purple-700 bg-white border border-purple-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-sm text-purple-950">Modern Classrooms & Tech Labs</h3>
                    <p className="text-xs text-slate-600 font-bold">Smart boards, computers, and science labs</p>
                  </div>
                </div>

                {/* Academic certified progress bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1.5 font-mono font-black">
                    <span>Academic Quality Rating</span>
                    <span className="text-indigo-700 font-black">Top Grade A Standard</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full w-[96%]" />
                  </div>
                </div>

                {/* Government accreditation badge */}
                <div className="p-4 bg-pink-50 border border-pink-100 rounded-xl flex items-start space-x-3 text-left shadow-sm">
                  <AlertCircle className="w-4 h-4 text-pink-600 shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-xs text-slate-700 leading-relaxed font-bold">
                    Official Category 'A' School approved by Nepal's National Examinations Board (NEB), recognized for academic excellence and student success.
                  </p>
                </div>

              </div>
              
            </div>

            {/* Tiny Floating decorative tag */}
            <div className="absolute -bottom-4 right-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-mono text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full shadow-lg">
              #QualityEducationNepal
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
