import { useState } from "react";
import { Award, Target, Landmark, Quote, PhoneCall, Check, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import vaniImage from "../assets/images/vani_pradhan.png";
import shantiImage from "../assets/images/shanti_pradhan.png";

import montessoriImg from "../assets/images/montessori_learning_1782145030889.jpg";
import scienceLabImg from "../assets/images/science_lab_1782145047179.jpg";
import schoolActivitiesImg from "../assets/images/school_activities_1782145063241.jpg";

const GALLERY_ITEMS = [
  {
    image: montessoriImg,
    category: "Kindergarten Foundations",
    title: "Learning Through Joyful Play",
    description: "Young children building foundational motor skills and social confidence in our standalone preparation class."
  },
  {
    image: scienceLabImg,
    category: "Secondary Academy",
    title: "Preparing Scholars for SEE Success",
    description: "Equipped science, technology, and computer reference infrastructures guiding exemplary board results."
  },
  {
    image: schoolActivitiesImg,
    category: "Co-Curricular Activities",
    title: "Vibrant Teamwork & Character Play",
    description: "Nurturing balanced athletic teamwork, confidence, and mutual cooperation through school activities."
  }
];

export default function AboutUs() {
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const values = [
    { 
      title: "Academic Excellence", 
      description: "Rigorous focus on core syllabus accompanied by regular mock tests and assessments.",
      icon: Award, 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
    },
    { 
      title: "Holistic Character", 
      description: "Values of humility, mutual respect, and regular civic programs form our base.",
      icon: Target, 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      title: "Community & Culture", 
      description: "We celebrate rich ethnic diversity and foster localized leadership qualities.",
      icon: Landmark, 
      color: "bg-pink-50 text-pink-600 border-pink-100" 
    },
  ];

  const featuresList = [
    "State-of-the-Art Science & Botany Labs",
    "Smart Audio-Visual Interactive Classrooms",
    "Computer Science Center (NEB Configured)",
    "Extensive Secondary General Reference Library",
    "Clean Secure College Transportation Network",
    "Dedicated Indoor & Outdoor Sports Complexes",
    "Affordable Fees with Complete Scholarship Options",
    "Counseling Support for Career & Abroad Studies"
  ];

  return (
    <section className="py-20 px-4 bg-white border-y border-indigo-100/45" id="about-us">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
            Our Identity
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Cultivating Confident, Compassionate, and Capable Individuals
          </h2>
          <p className="text-slate-600 font-semibold text-base sm:text-lg leading-relaxed">
            Shristi Academy delivers high-quality education from Kindergarten to Class 10 (SEE). We merge modern science & tech utilities with a safe, caring, family-like campus atmosphere in Kathmandu.
          </p>
        </div>

        {/* Content Row: Story & Principal's Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Story Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-left">
              <h3 className="font-display font-bold text-2xl text-slate-900">
                The Legacy of Shristi Academy
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-bold border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50/20 rounded-r-lg pr-2">
                Established in 2016 AD, Shristi Academy was founded to deliver exceptional educational standards to Kathmandu's youth.
              </p>
              
              <ul className="space-y-2 text-slate-600 text-xs sm:text-sm font-semibold pt-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">•</span>
                  <span><strong>Student-First Curriculum:</strong> CDC aligned core studies coupled with interactive, evidence-based practical learning.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">•</span>
                  <span><strong>Robust Health & Wellness:</strong> We provide fresh, nutritious organic school meals and daily active physical playgroups.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">•</span>
                  <span><strong>Dedicated Mentors:</strong> Highly certified, compassionate teachers committed to standard school board exams.</span>
                </li>
              </ul>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="border border-indigo-50/50 p-4 rounded-xl bg-slate-50/80 space-y-2 shadow-sm hover:shadow-md transition-all">
                    <div className={`p-2 w-9 h-9 rounded-lg border flex items-center justify-center ${v.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-800">{v.title}</h4>
                    <p className="text-[10.5px] text-slate-500 leading-normal font-medium">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Principal & Administrator dual message cards Column */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 relative">
            
            {/* Card 1: Principal Vani Pradhan */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-indigo-50/20 to-white text-slate-800 rounded-[24px] p-6 shadow-md relative overflow-hidden border border-indigo-100 flex flex-col justify-between group hover:border-indigo-300 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-pink-600 font-mono text-xs font-bold">
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-[9px] tracking-wider uppercase font-black">
                     Principal Message
                  </span>
                  <div className="flex items-center space-x-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-[9px] text-indigo-700 font-bold">
                    <Quote className="w-3 text-pink-500 shrink-0" />
                    <span>" I Care, So I Teach "</span>
                  </div>
                </div>
                <p className="italic text-slate-700 text-xs sm:text-[13px] leading-relaxed font-semibold">
                  "Our purpose is to provide a safe, happy environment for your child, where they are able to be themselves and thrive; while acquiring the academic foundations to achieve their absolute best in life."
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 shrink-0 bg-white shadow-sm">
                    <img 
                      src={vaniImage} 
                      alt="Vani Pradhan" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">Vani Pradhan</h4>
                    <p className="text-[9.5px] text-indigo-600 font-bold">Principal, Shristi Academy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Administrator Shanti K. Pradhan */}
            <div className="bg-gradient-to-br from-emerald-50/60 via-emerald-50/10 to-white text-slate-800 rounded-[24px] p-6 shadow-md relative overflow-hidden border border-emerald-100 flex flex-col justify-between group hover:border-emerald-300 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-emerald-700 font-mono text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[9px] tracking-wider uppercase font-black">
                     Administration Message
                  </span>
                  <div className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px] text-emerald-700 font-bold">
                    <Quote className="w-3 text-emerald-600 shrink-0" />
                    <span>" Family-like Nurture "</span>
                  </div>
                </div>
                <p className="italic text-slate-700 text-xs sm:text-[13px] leading-relaxed font-semibold">
                  "Shristi Academy is a place where learning feels like home. We meticulously blend academic rigor with heartfelt nurture, helping our students grow smart, strong, and confident."
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 bg-white shadow-sm">
                    <img 
                      src={shantiImage} 
                      alt="Shanti K. Pradhan" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">Shanti K. Pradhan</h4>
                    <p className="text-[9.5px] text-emerald-700 font-bold">Administrator, Shristi Academy</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Campus Gallery Section - DENSE & LARGE PICTORIAL SHOWCASE */}
        <div className="space-y-8 pt-12 border-t border-slate-100/80">
          <div className="text-left space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
              School Life In Action
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
              Moments of Joy, Discovery, & Academic Progress
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl font-semibold">
              Take an interactive look inside Shristi Academy. <strong>Click any photo to open full-screen view</strong> to see our vibrant campus activities, science laboratory setups, and classroom playgroups.
            </p>
          </div>

          {/* GIGANTIC RESPONSIVE GRID FOR VIVID GRAPHICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedImage(item)}
                className="bg-white rounded-[28px] overflow-hidden border border-indigo-100/50 p-4 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Wrap (Vivid Aspect Ratio) */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating category */}
                  <div className="absolute top-3 left-3 bg-[#1e1b4b]/95 backdrop-blur-sm text-white text-[9px] font-mono font-extrabold uppercase px-2.5 py-1.5 rounded-lg shadow-md">
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
                  <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 font-semibold leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Facilities Section Showcase */}
        <div className="bg-[#FAF9F6]/90 rounded-[32px] p-8 md:p-12 border border-indigo-50/50 shadow-sm shadow-indigo-100/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-sans text-left">
            
            {/* Title Block */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider block">
                Modern Campus Amenities
              </span>
              <h3 className="font-display font-black text-2xl md:text-3xl text-slate-900 leading-tight">
                Academic Facilities Equipped for Tomorrow
              </h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold">
                We maintain active setup facilities to support computer programming, interactive science tests, safe bus transit routes, and co-curricular sports.
              </p>
              
              <div className="p-4 bg-white rounded-2xl border border-indigo-50/50 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-indigo-600 flex items-center">
                  <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                  Need a Physical Campus Tour?
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Our premises in Mid-Baneshwor, Kathmandu are open for walk-ins from Monday to Friday, 9:00 AM to 4:00 PM. Call us at <strong>01-4496573</strong> to schedule.
                </p>
              </div>
            </div>

            {/* List Showcase Block */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuresList.map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-indigo-50/50 flex items-center space-x-3 hover:translate-x-1 hover:border-indigo-100 transition-all shadow-sm"
                >
                  <div className="bg-indigo-50 text-indigo-600 p-1 rounded-lg shrink-0">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{feature}</span>
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
