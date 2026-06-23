import { Award, Target, Landmark, Quote, ClipboardCheck, Sparkles, BookOpen, Laptop, PhoneCall, Check } from "lucide-react";
import { motion } from "motion/react";
import vaniImage from "../assets/images/vani_pradhan_headshot_1781710198419.jpg";
import shantiImage from "../assets/images/shanti_pradhan_headshot_1781710218826.jpg";

import montessoriImg from "../assets/images/montessori_learning_1782145030889.jpg";
import scienceLabImg from "../assets/images/science_lab_1782145047179.jpg";
import schoolActivitiesImg from "../assets/images/school_activities_1782145063241.jpg";

const GALLERY_ITEMS = [
  {
    image: montessoriImg,
    category: "Montessori Early Years",
    title: "Learning Through Joyful Play",
    description: "Young children building foundational motor skills and critical reasoning using custom child-centered pedagogy."
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
  const values = [
    { 
      title: "Academic Excellence", 
      description: "Rigorous focus on core syllabus accompanied by regular internal assessments, mock tests, and interactive revisions.",
      icon: Award, 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
    },
    { 
      title: "Holistic Character", 
      description: "Values of humility, mutual respect, discipline, and regular civic programs form the solid base of our curriculum.",
      icon: Target, 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      title: "Community & Culture", 
      description: "We represent the rich cultural ethos of Nepal, celebrating ethnic diversity and fostering localized leadership.",
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
    <section className="py-24 px-4 bg-white border-y border-indigo-100/45" id="about-us">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
            Our Identity
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Cultivating Confident, Compassionate, and Capable Individuals
          </h2>
          <p className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
            Shristi Academy is a distinguished educational institution dedicated to fostering a nurturing, inclusive, and inspiring learning environment. Guided by a student-first philosophy, we prepare children from their earliest years to navigate the world with integrity and self-assurance.
          </p>
        </div>

        {/* Content Row: Story & Principal's Message */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Story Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-left">
              <h3 className="font-display font-bold text-2xl text-slate-900">
                The Legacy of Shristi Academy
              </h3>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50/20 rounded-r-lg pr-2">
                Established in 2016 AD, Shristi Academy was founded to deliver an exceptional, long-standing standard of academic and personal excellence to students in the heart of Kathmandu.
              </p>
              <p className="text-slate-700 text-sm sm:text-[14px] leading-relaxed font-semibold">
                Our academic philosophy rests on a holistic, child-centered approach that nurtures each student’s intellectual, emotional, and social development. We emphasize interactive, evidence-based teaching methods, delivering a comprehensive curriculum that includes English, Nepali, Mathematics, Science, Computer Studies, Music, and Art.
              </p>
              <p className="text-slate-700 text-sm sm:text-[14px] leading-relaxed font-medium">
                In addition to rigorous academic pursuits, we place a paramount emphasis on student well-being. We provide fresh, nutritious meals and snacks, and integrate professional-led physical activities into our roster to ensure the well-balanced development of every young mind.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="border border-indigo-50/50 p-5 rounded-2xl bg-slate-50/80 space-y-3 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                    <div className={`p-2.5 w-11 h-11 rounded-xl border flex items-center justify-center ${v.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800">{v.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Principal & Administrator dual message cards Column */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 relative">
            
            {/* Card 1: Principal Vani Pradhan */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-indigo-50/20 to-white text-slate-800 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-100 flex flex-col justify-between group hover:border-indigo-300 hover:scale-[1.01] transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/10 blur-lg pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-pink-600 font-mono text-xs font-bold">
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-black">
                     Principal Speech
                  </span>
                  <div className="flex items-center space-x-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-[9px] text-indigo-700 font-bold border border-indigo-100/30">
                    <Quote className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>" I Care, So I Teach "</span>
                  </div>
                </div>
                
                <p className="italic text-slate-700 text-[12.5px] leading-relaxed font-semibold">
                  "Our purpose is to provide a safe, happy environment for your child, where they are able to be themselves and thrive; while acquiring the academic and personal foundations needed to achieve their absolute best in life."
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-indigo-100 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-400 shrink-0 bg-white shadow-md">
                    <img 
                      src={vaniImage} 
                      alt="Vani Pradhan (Principal)" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Vani Pradhan</h4>
                    <p className="text-[10.5px] text-indigo-600 font-bold">Principal, Shristi Academy</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[9px] font-mono text-pink-600 block font-black uppercase tracking-wider">
                    School Council
                  </span>
                  <span className="text-[8px] text-indigo-500 font-bold block">
                    Academic Chair
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Administrator Shanti K. Pradhan */}
            <div className="bg-gradient-to-br from-emerald-50/60 via-emerald-50/10 to-white text-slate-800 rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-100 flex flex-col justify-between group hover:border-emerald-300 hover:scale-[1.01] transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-lg pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-emerald-700 font-mono text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-black">
                     Administration Desk
                  </span>
                  <div className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px] text-emerald-700 font-bold border border-emerald-100/30">
                    <Quote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>" I Care, So I Teach "</span>
                  </div>
                </div>
                
                <p className="italic text-slate-700 text-[12.5px] leading-relaxed font-semibold">
                  "Shristi Academy is a place where learning feels like home. We meticulously blend academic rigor with heartfelt nurture, helping our students grow smart, exceptionally strong, and thoroughly sure of themselves."
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-emerald-100 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0 bg-white shadow-md">
                    <img 
                      src={shantiImage} 
                      alt="Shanti K. Pradhan (Administrator)" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Shanti K. Pradhan</h4>
                    <p className="text-[10.5px] text-emerald-700 font-bold">Administrator, Shristi Academy</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[9px] font-mono text-emerald-600 block font-black uppercase tracking-wider">
                    Executive Desk
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold block">
                    Operations Lead
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Campus Gallery Section */}
        <div className="space-y-8 pt-10 border-t border-slate-100/80">
          <div className="text-left space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
              School Life In Action
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
              Moments of Joy, Discovery, & Academic Progress
            </h3>
            <p className="text-slate-500 text-sm max-w-2xl font-medium">
              Take an interactive look inside Shristi Academy - where modern facilities meet dynamic curriculum outlets and students grow smart and confident.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[24px] overflow-hidden border border-indigo-50 p-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#1e1b4b]/95 backdrop-blur-sm text-white text-[9px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-lg">
                    {item.category}
                  </div>
                </div>
                <div className="p-4 text-left flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
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
                Shristi Academy invests heavily in student infrastructure. We maintain physical setups to support real chemical testing, programming, sports tournaments, and general study resources.
              </p>
              
              <div className="p-4 bg-white rounded-2xl border border-indigo-50/50 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-indigo-600 flex items-center">
                  <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
                  Need a Physical Campus Tour?
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Our premises in Mid-Baneshwor, Kathmandu are open for walk-ins from Sunday to Friday, 9:00 AM to 4:00 PM. Contact us to schedule.
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
    </section>
  );
}
