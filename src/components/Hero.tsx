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
    title: "Kindergarten Foundations",
    description: "Building strong initial literacy and coordination in a warm, standalone prep class.",
    tag: "Primary Life"
  },
  {
    image: labImg,
    title: "Science & Technology",
    description: "Hands-on projects and modern digital literacy for secondary scholars.",
    tag: "Academics"
  },
  {
    image: playImg,
    title: "Vibrant Campus Life",
    description: "Fostering physical health, character building, and creative team play.",
    tag: "Activity Profile"
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
    <section className="relative overflow-hidden bg-[#FAF9F6] bg-dot-grid text-slate-800 min-h-[92vh] flex flex-col justify-center py-20 px-4">
      {/* Background Ambience Glares - Soft & Elegant Sass colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/40 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-200/30 blur-[130px] pointer-events-none animate-pulse" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Messaging Column */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
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
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] text-slate-900">
              Education for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                Excellence & Character.
              </span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Nurturing young minds in Mid-Baneshwor, Kathmandu. Shristi Academy merges foundational kindergarten preparation with rigorous secondary education to prepare scholars for SEE excellence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onApplyNow}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-95 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2.5 cursor-pointer transition-all hover:translate-y-[-3px]"
            >
              <GraduationCap className="w-5.5 h-5.5" />
              <span>Apply Online Admission</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={onExplorePrograms}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-indigo-700 font-bold rounded-2xl border border-indigo-100 flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-all hover:translate-y-[-3px]"
            >
              <span>Explore Curriculum Outlets</span>
            </button>
          </div>

          {/* Location Badge */}
          <div className="pt-2 flex items-center space-x-4 text-slate-400 text-xs font-mono font-bold">
            <span className="flex items-center text-indigo-600">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-2 animate-ping" />
              Admissions Open for Batch 2083 BS
            </span>
            <span>•</span>
            <span className="text-slate-500">Kindergarten to Class 10 (SEE)</span>
          </div>

        </div>

        {/* Visual Right Showcase Column (SaaS inspired card UI layout + Mini Gallery) */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-[420px] lg:max-w-none">
            
            {/* Visual Backframe Glow - Beautiful neon purple orange palette */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 via-purple-400/10 to-pink-400/20 rounded-[36px] blur-3xl transform rotate-6 pointer-events-none" />

            {/* Premium Card Container */}
            <div className="relative bg-white/80 backdrop-blur-md border border-indigo-50 p-6 md:p-8 rounded-[32px] shadow-2xl shadow-indigo-100/60">
              
              <div className="flex justify-between items-center mb-5">
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>Campus Gallery Live</span>
                </div>
              </div>

              {/* Dynamic Slideshow Showcase Card */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100/40 shadow-md group/gallery mb-6">
                
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
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-md text-indigo-700 font-mono text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-lg select-none">
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
                <div className="bg-[#FAF9F6]/80 p-3.5 border border-indigo-50/50 rounded-2xl flex items-center space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 text-indigo-600 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                    <GraduationCap className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-xs text-slate-900">Kindergarten to SEE Level</h3>
                    <p className="text-[10px] text-slate-500">Excelling from Kindergarten to Class 10</p>
                  </div>
                </div>

                {/* Visual Segment 2: Interactive Tech */}
                <div className="bg-[#FAF9F6]/80 p-3.5 border border-indigo-50/50 rounded-2xl flex items-center space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 text-purple-600 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                    <Users className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-xs text-slate-900">Modern Digital Pedagogy</h3>
                    <p className="text-[10px] text-slate-500">Audio-Visual classrooms & tech labs</p>
                  </div>
                </div>

                {/* Academic certified progress bar */}
                <div className="pt-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono font-bold">
                    <span>Academic Quality Standard</span>
                    <span className="text-indigo-600 font-extrabold">Grade A+ Certified</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full w-[96%]" />
                  </div>
                </div>

                {/* Government accreditation badge */}
                <div className="p-3 bg-pink-50/50 border border-pink-100/40 rounded-xl flex items-start space-x-2 text-left">
                  <AlertCircle className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    Accredited under the National Examinations Board (NEB) of Nepal, recognized for fostering scholar excellence.
                  </p>
                </div>

              </div>
              
            </div>

            {/* Tiny Floating decorative tag */}
            <div className="absolute -bottom-4 right-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
              #ModernNepalPedagogy
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
