import { 
  FlaskConical, Calculator, Scale, ToyBrick, 
  GraduationCap, Check, HelpCircle, Award, BookOpen, Layers
} from "lucide-react";
import { motion } from "motion/react";
import { AcademicProgram } from "../types";

export default function Academics() {
  // Aligned strictly with real school curriculum details in Kathmandu, Nepal
  const programs = [
    {
      id: "kindergarten",
      level: "Kindergarten",
      title: "Kindergarten Foundation Class",
      focus: "Play-Based Phonics & Socialization",
      description: "A specialized play-based preparatory program designed to build early phonics, letters, numbers, and motor coordination skills to establish confidence before Class 1.",
      subjects: ["English Phonics", "Nepali Shabda Bodh", "Basic Numeracy & Shapes", "Creative Arts & Songs", "Sensory & Social Play"],
      careers: ["Builds Learning Enthusiasm", "Enhances Basic Motor Skills", "Establishes Core Alphabetical Foundations"],
      duration: "1 Year Standalone Class",
      iconName: "ToyBrick"
    },
    {
      id: "primary-level",
      level: "Primary School",
      title: "Primary Education (Class 1 to 5)",
      focus: "CDC Aligned Dual-Language Core",
      description: "Comprehensive primary curriculum fully certified by CDC Nepal. This stage builds strong mental arithmetic, multi-lingual reading, and scientific query awareness.",
      subjects: ["English Expression", "Nepali Vyakaran", "Primary Mathematics", "Science & Environment", "Social Studies & Moral Values", "Creative Art & Craft"],
      careers: ["Dual-Language Reading & Writing", "Basic Scientific Method Foundations", "Collaborative Peer Coordination"],
      duration: "5 Years (Classes 1 - 5)",
      iconName: "BookOpen"
    },
    {
      id: "lower-secondary",
      level: "Lower Secondary",
      title: "Lower Secondary (Class 6 to 8)",
      focus: "Analytical Problem Solving & IT Labs",
      description: "Critical transition program emphasizing computer laboratory studies, complex arithmetic, scientific experiments, and creative language literature.",
      subjects: ["Compulsory Mathematics", "General Science & Labs", "English Literature Studies", "Nepali Sahitya", "Social Studies & Geography", "Computer & Tech Studies"],
      careers: ["Logical & Analytical Comprehension", "Fundamental Computer Literacy", "Preparation for Rigorous Secondary Standards"],
      duration: "3 Years (Classes 6 - 8)",
      iconName: "FlaskConical"
    },
    {
      id: "secondary-level",
      level: "Secondary School",
      title: "Secondary Board Prep (Class 9 & 10)",
      focus: "Comprehensive SEE National Board Prep",
      description: "Rigorous academic program fully tailored to help young scholars achieve outstanding GPA scores in the national Secondary Education Examination (SEE).",
      subjects: ["SEE Compulsory Mathematics", "Optional Mathematics / Account", "Science & Advanced Physics", "Social Studies & Civics", "Nepali & Computer Science", "English Rhetoric"],
      careers: ["Rigorous Prep for National SEE Board Exams", "Stream Selection Alignment (STEM/Management)", "Advanced Analytical Reasoning Skills"],
      duration: "2 Years (Classes 9 - 10)",
      iconName: "GraduationCap"
    }
  ];

  // Mapping helper for Lucide Icons
  const renderIcon = (name: string) => {
    switch (name) {
      case "ToyBrick": return <ToyBrick className="w-6 h-6" />;
      case "BookOpen": return <BookOpen className="w-6 h-6" />;
      case "FlaskConical": return <FlaskConical className="w-6 h-6" />;
      default: return <GraduationCap className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-24 px-4 bg-white/40 border-y border-indigo-100/50" id="academics">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
            Curriculum Structure
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Academic Paths to Power Diverse Strengths
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed">
            At Shristi Academy, we structure our educational milestones into clear, high-impact categories. We nurture student potential from early playgroups up to secondary board certification (SEE).
          </p>
        </div>

        {/* Core Educational Philosophy - streamlined & prominent */}
        <div className="bg-[#FAF9F6]/85 border border-indigo-100 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto text-center shadow-md">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-bold">
            🥗 <span className="text-indigo-600">Student Well-being Priority:</span> Shristi Academy couples rigorous National Examination Board (NEB/CDC) syllabus preparation with organic campus-prepared lunches and active daily sports/wellness sessions to ensure healthy physical and mental development.
          </p>
        </div>

        {/* Content Render Grid */}
        <div className="min-h-[450px]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 items-stretch"
          >
            {programs.map((program) => (
              <div 
                key={program.id}
                className="bg-white border border-slate-200 p-8 md:p-10 rounded-[36px] shadow-xl shadow-indigo-100/25 flex flex-col justify-between hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="space-y-6">
                  
                  {/* Program Header */}
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">
                      {renderIcon(program.iconName)}
                    </div>
                    <span className="text-[11px] font-mono uppercase bg-purple-50 text-purple-700 py-1.5 px-3.5 rounded-xl font-black tracking-wider">
                      {program.duration}
                    </span>
                  </div>

                  {/* Program Details */}
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-2xl text-slate-950 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                      {program.title}
                    </h3>
                    
                    {/* Emphasis Focus Tag - HIGHLY PROMINENT */}
                    <div className="bg-indigo-50/70 border border-indigo-100 px-3 py-1.5 rounded-xl">
                      <p className="text-indigo-700 font-extrabold text-xs sm:text-sm">
                        🔑 Focus: {program.focus}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                      {program.description}
                    </p>
                  </div>

                  {/* Subjects Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-black text-xs text-indigo-600 tracking-wider uppercase font-mono">
                      Key Learning Subjects
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {program.subjects.map((sub, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Highlights/Outcomes Block */}
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-black text-xs text-indigo-600 tracking-wider uppercase font-mono">
                      Direct Academic Benefits
                    </h4>
                    <div className="space-y-2">
                      {program.careers.map((career, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600 font-extrabold">
                          <div className="p-0.5 bg-indigo-100 text-indigo-700 rounded-lg mt-0.5 shrink-0">
                            <Check className="w-3.5 h-3.5 text-indigo-700 font-black" />
                          </div>
                          <span className="leading-tight">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </div>

        {/* SEE Examination Compliance Alert Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-slate-300 rounded-[32px] p-8 md:p-10 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto font-sans">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full bg-pink-400 shrink-0 animate-pulse" />
              <h4 className="font-black text-base text-white">Full National CDC Curriculum Compliance</h4>
            </div>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed font-semibold">
              Our academic syllables, reference guidelines, and textbooks update automatically in strict compliance with the Curriculum Development Centre (CDC) of Nepal. This ensures all students are meticulously prepared to achieve outstanding GPAs in the national Secondary Education Examination (SEE).
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-[11px] font-mono text-pink-300 font-black bg-indigo-950/80 uppercase border border-pink-900/40 py-2.5 px-5 rounded-full shadow-lg">
              CDC Affiliated Board
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
