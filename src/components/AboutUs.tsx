import { useState } from "react";
import { Award, Target, Landmark, Quote, PhoneCall, Check, X, Maximize2, FileText, Eye, Download, Sparkles, ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SchoolProfileConfig, GalleryItem } from "../types";
import vaniImage from "../assets/images/vani_pradhan.png";
import shantiImage from "../assets/images/shanti_pradhan.png";

import montessoriImg from "../assets/images/montessori_learning_1782145030889.jpg";
import scienceLabImg from "../assets/images/science_lab_1782145047179.jpg";
import schoolActivitiesImg from "../assets/images/school_activities_1782145063241.jpg";

import outdoorExcursionImg from "../assets/images/outdoor_excursion_1785494441208.jpg";
import munAssemblyImg from "../assets/images/mun_assembly_1785494464389.jpg";
import sportsDayRelayImg from "../assets/images/sports_day_relay_1785494481636.jpg";
import taekwondoClassImg from "../assets/images/taekwondo_class_1785494497659.jpg";
import tableTennisTournamentImg from "../assets/images/table_tennis_tournament_1785494515181.jpg";

export const DEFAULT_GALLERY_ITEMS: (GalleryItem & { fallbackImage?: string })[] = [
  {
    id: "gal-1",
    image: outdoorExcursionImg,
    fallbackImage: montessoriImg,
    category: "Outdoor Excursion",
    title: "Nature & Bougainvillea Field Trip",
    description: "Young kindergarten students exploring nature and outdoors under the blooming Bougainvillea tree."
  },
  {
    id: "gal-2",
    image: munAssemblyImg,
    fallbackImage: scienceLabImg,
    category: "MUN & Global Leadership",
    title: "Model United Nations (MUN) Assembly",
    description: "Shristi Academy students engaging in Model United Nations (MUN) diplomatic debate and public speaking."
  },
  {
    id: "gal-3",
    image: sportsDayRelayImg,
    fallbackImage: schoolActivitiesImg,
    category: "Annual Sports Day",
    title: "Annual Sports Day Relay Race",
    description: "Primary school students competing in high-energy track events and baton relay races."
  },
  {
    id: "gal-4",
    image: taekwondoClassImg,
    fallbackImage: schoolActivitiesImg,
    category: "Taekwondo & Fitness",
    title: "Taekwondo Martial Arts Class",
    description: "Building physical endurance, coordination, and martial arts self-defense discipline."
  },
  {
    id: "gal-5",
    image: tableTennisTournamentImg,
    fallbackImage: scienceLabImg,
    category: "State Sports Achievement",
    title: "U-14 Table Tennis Champions 2025",
    description: "Proud student athletes receiving honors in the Bagmati Province Selection Match."
  }
];

interface AboutUsProps {
  onOpenSchoolProfile?: () => void;
  schoolProfileConfig?: SchoolProfileConfig;
  galleryItems?: GalleryItem[];
}

export default function AboutUs({ onOpenSchoolProfile, schoolProfileConfig, galleryItems }: AboutUsProps) {
  const activeGallery = galleryItems && galleryItems.length > 0 ? galleryItems : DEFAULT_GALLERY_ITEMS;
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const values = [
    { 
      title: "Strong Academics", 
      description: "Focus on core subjects with clear teaching, regular practice, and helpful feedback.",
      icon: Award, 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
    },
    { 
      title: "Good Values & Character", 
      description: "Teaching respect, honesty, kindness, and good habits for everyday life.",
      icon: Target, 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      title: "Friendly Community", 
      description: "A welcoming, family-like school where students support each other.",
      icon: Landmark, 
      color: "bg-pink-50 text-pink-600 border-pink-100" 
    },
  ];

  const featuresList = [
    "Modern Science & Chemistry Labs",
    "Smart Classrooms with Audio-Visual Tools",
    "Computer Lab with High-Speed Internet",
    "School Library with Books & Study Guides",
    "Safe & Reliable School Bus Service",
    "Indoor & Outdoor Sports Facilities",
    "Affordable Fees & Scholarship Support",
    "Friendly Guidance for Higher Studies"
  ];

  return (
    <section className="py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white border-y border-indigo-100/45" id="about-us">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto space-y-20">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full shadow-md text-xs font-mono font-black tracking-widest uppercase">
            <Award className="w-4 h-4 text-amber-200" />
            <span>Government Certified Category 'A' School</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Helping Every Child Learn, Grow, and Succeed
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed">
            Shristi Academy offers quality education from Kindergarten to Class 10 (SEE). Officially recognized as a <strong className="text-indigo-900 underline decoration-amber-400 decoration-4">Category A</strong> school by government education standards, we combine top-quality facilities with a safe, warm, and welcoming school environment.
          </p>
        </div>

        {/* OFFICIAL SCHOOL PROFILE SHOWCASE BANNER */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-700/50 relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-pink-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL SCHOOL BROCHURE</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Shristi Academy School Profile & PDF Guide
            </h3>
            <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed">
              Read our official school guide to learn about our campus, facilities, expert teachers, and SEE exam achievements. View the full PDF directly in your browser anytime!
            </p>
            {schoolProfileConfig?.fileName && (
              <p className="text-[11px] font-mono text-indigo-300/80">
                Current File: {schoolProfileConfig.fileName} {schoolProfileConfig.fileSize ? `(${schoolProfileConfig.fileSize})` : ""}
              </p>
            )}
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenSchoolProfile}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white rounded-2xl text-xs font-mono font-black tracking-wider shadow-lg shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-105"
            >
              <Eye className="w-4 h-4 text-white" />
              <span>VIEW SCHOOL PROFILE (PDF)</span>
            </button>
          </div>
        </div>

        {/* Content Row: Story & Principal's Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Story Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-left">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-950">
                About Shristi Academy
              </h3>
              
              {/* Highlight Statement - enlarged */}
              <p className="text-indigo-950 text-base sm:text-lg leading-relaxed font-black border-l-4 border-indigo-600 pl-4 py-2 bg-indigo-50/30 rounded-r-2xl pr-4 shadow-sm">
                Founded in 2016 AD, Shristi Academy was created to give children in Kathmandu a strong education and a safe place to learn and grow.
              </p>
              
              <ul className="space-y-3 text-slate-700 text-sm sm:text-base font-bold pt-2">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2.5 font-black text-lg">•</span>
                  <span><strong>Certified Category 'A' School:</strong> Top-rated by government education standards for excellent classrooms, qualified teachers, and strong exam results.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2.5 font-black text-lg">•</span>
                  <span><strong>Easy-to-Follow Curriculum:</strong> National curriculum taught with hands-on activities and interactive lessons.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2.5 font-black text-lg">•</span>
                  <span><strong>Healthy Meals & Activities:</strong> Freshly prepared school lunches and daily sports for healthy growth.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2.5 font-black text-lg">•</span>
                  <span><strong>Caring Teachers:</strong> Kind, experienced teachers who give personal attention to every child.</span>
                </li>
              </ul>
            </div>

            {/* Category A Institutional School Accreditation Showcase Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-indigo-50/50 p-6 sm:p-7 rounded-[28px] border-2 border-amber-300/80 shadow-md space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
                    <Award className="w-5 h-5 text-amber-100" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-700 tracking-wider uppercase block">Government Accreditation</span>
                    <h4 className="font-display font-black text-lg text-slate-900">Certified Category 'A' School</h4>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-mono font-black rounded-full shadow-sm">Grade A</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                Shristi Academy is officially certified as a <strong>Category A</strong> school by government education authorities. Category 'A' is the highest rating given to schools that meet strict standards for good classrooms, qualified teachers, student safety, cleanliness, and top SEE exam scores.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase">Facilities</span>
                  <span className="text-xs font-black text-amber-900">Category A</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase">Teaching</span>
                  <span className="text-xs font-black text-amber-900">Category A</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase">Clean & Safe</span>
                  <span className="text-xs font-black text-amber-900">Category A</span>
                </div>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="border border-indigo-100 p-5 rounded-2xl bg-slate-50/80 space-y-3 shadow-sm hover:shadow-md transition-all">
                    <div className={`p-2.5 w-11 h-11 rounded-xl border flex items-center justify-center ${v.color} shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-slate-950">{v.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Principal & Administrator dual message cards Column */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8 relative">
            
            {/* Card 1: Principal Vani Pradhan */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-indigo-50/20 to-white text-slate-800 rounded-[32px] p-8 shadow-md relative overflow-hidden border border-indigo-150 flex flex-col justify-between group hover:border-indigo-300 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-pink-600 font-mono text-xs font-bold">
                  <span className="bg-pink-100 text-pink-800 px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-black">
                     Principal Message
                  </span>
                  <div className="flex items-center space-x-1.5 bg-indigo-50 px-3 py-1.5 rounded-full text-[10px] text-indigo-700 font-bold">
                    <Quote className="w-3.5 text-pink-500 shrink-0" />
                    <span>" I Care, So I Teach "</span>
                  </div>
                </div>
                
                {/* Founders quotes - MUCH LARGER & MORE PROFESSIONAL */}
                <p className="italic text-slate-900 text-sm sm:text-base md:text-lg leading-relaxed font-black">
                  "Our ultimate goal is to provide a safe, happy environment for your child, where they are fully able to express themselves, thrive, and acquire the fundamental academic building blocks to achieve their absolute best in life."
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 shrink-0 bg-white shadow-md">
                    <img 
                      src={vaniImage} 
                      alt="Vani Pradhan" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-950">Vani Pradhan</h4>
                    <p className="text-xs text-indigo-600 font-bold">Principal, Shristi Academy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Administrator Shanti K. Pradhan */}
            <div className="bg-gradient-to-br from-emerald-50/60 via-emerald-50/10 to-white text-slate-800 rounded-[32px] p-8 shadow-md relative overflow-hidden border border-emerald-150 flex flex-col justify-between group hover:border-emerald-300 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-emerald-700 font-mono text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-black">
                     Administration Message
                  </span>
                  <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-full text-[10px] text-emerald-700 font-bold">
                    <Quote className="w-3.5 text-emerald-600 shrink-0" />
                    <span>" Family-like Nurture "</span>
                  </div>
                </div>

                {/* Quote - MUCH LARGER */}
                <p className="italic text-slate-900 text-sm sm:text-base md:text-lg leading-relaxed font-black">
                  "Shristi Academy is a place where learning feels like home. We meticulously blend intense academic focus with heartfelt holistic care, helping students grow smart, physically strong, and resilient."
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 bg-white shadow-md">
                    <img 
                      src={shantiImage} 
                      alt="Shanti K. Pradhan" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-950">Shanti K. Pradhan</h4>
                    <p className="text-xs text-emerald-700 font-bold">Administrator, Shristi Academy</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Campus Gallery Section - DENSE & LARGE PICTORIAL SHOWCASE */}
        <div className="space-y-8 pt-16 border-t border-slate-150">
          <div className="text-left space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
              School Life In Action
            </span>
            <h3 className="font-display font-black text-3xl md:text-4xl text-slate-900 tracking-tight leading-none">
              Moments of Joy, Discovery, & Academic Progress
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-bold">
              Take an interactive look inside Shristi Academy. <strong>Click any photo to open full-screen view</strong> to see our vibrant campus activities, science laboratory setups, and classroom playgroups.
            </p>
          </div>

          {/* GIGANTIC RESPONSIVE GRID FOR VIVID GRAPHICS (DYNAMIC - ONLY UPLOADED PHOTOS DISPLAYED, MAX 10) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeGallery.slice(0, 10).map((item) => (
              <motion.div
                key={item.id || item.title}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedImage(item)}
                className="bg-white rounded-[32px] overflow-hidden border border-slate-200 p-5 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Wrap (Vivid Aspect Ratio) */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = (item as any).fallbackImage || montessoriImg;
                    }}
                  />
                  {/* Floating category */}
                  <div className="absolute top-3 left-3 bg-[#1e1b4b]/95 backdrop-blur-sm text-white text-[10px] font-mono font-black uppercase px-3 py-1.5 rounded-xl shadow-md">
                    {item.category}
                  </div>
                  {/* Hover indicator overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/95 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-lg">
                      <Maximize2 className="w-4 h-4 text-indigo-600" />
                      <span>View Full Photo</span>
                    </div>
                  </div>
                </div>
                
                {/* Brief, impact-oriented descriptions */}
                <div className="p-4 text-left space-y-1.5">
                  <h4 className="font-black text-lg text-slate-950 group-hover:text-indigo-600 transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Facilities Section Showcase */}
        <div className="bg-gradient-to-br from-indigo-50/75 via-white to-pink-50/50 rounded-[36px] p-8 md:p-12 border-2 border-indigo-200 shadow-xl shadow-indigo-100/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-sans text-left">
            
            {/* Title Block */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-mono text-indigo-600 font-black uppercase tracking-wider block">
                Modern Campus Amenities
              </span>
              <h3 className="font-display font-black text-3xl text-slate-950 leading-tight">
                Academic Facilities Equipped for Tomorrow
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-bold">
                We maintain state-of-the-art facilities to support deep scientific inquiry, computing studies, comfortable local transit routes, and co-curricular physical play.
              </p>
              
              <div className="p-5 bg-white rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
                <h4 className="text-sm font-black text-indigo-700 flex items-center">
                  <PhoneCall className="w-4 h-4 mr-1.5 text-pink-500" />
                  Need a Physical Campus Tour?
                </h4>
                <p className="text-xs text-slate-600 font-bold">
                  Our premises in Mid-Baneshwor, Kathmandu are open for walk-ins from Monday to Friday, 9:00 AM to 4:00 PM. Call us at <strong className="text-indigo-700">01-4496573</strong> to schedule.
                </p>
              </div>
            </div>

            {/* List Showcase Block - LARGE TEXT AS REQUESTED */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuresList.map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center space-x-3 hover:translate-x-1 hover:border-indigo-300 transition-all shadow-sm"
                >
                  <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg shrink-0 border border-indigo-100">
                    <Check className="w-4 h-4 text-indigo-700 font-black" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800">{feature}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* GORGEOUS LIGHTBOX VIEWING PORTAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full text-slate-100 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                aria-label="Close image"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Big Image Section */}
              <div className="relative aspect-[16/10] bg-black select-none">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = (selectedImage as any).fallbackImage || montessoriImg;
                  }}
                />
                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-mono font-bold uppercase py-1 px-3 rounded-lg shadow">
                  {selectedImage.category}
                </div>
              </div>

              {/* Image Description Block */}
              <div className="p-6 md:p-8 bg-slate-900 border-t border-white/5 text-left space-y-2">
                <h3 className="font-display font-extrabold text-lg md:text-xl text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                  {selectedImage.description}
                </p>
                <div className="pt-3 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <span>🏫 Shristi Academy Secondary School</span>
                  <span>•</span>
                  <span>Mid-Baneshwor, Kathmandu</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
