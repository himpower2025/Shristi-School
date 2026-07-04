import { 
  FlaskConical, Calculator, Scale, ToyBrick, 
  GraduationCap, Check, HelpCircle, Award, BookOpen, Layers
} from "lucide-react";
import { motion } from "motion/react";
import { AcademicProgram } from "../types";

export default function Academics() {
  // Aligned strictly with real school curriculum details in Kathmandu, Nepal
  const programs: AcademicProgram[] = [
    {
      id: "kindergarten",
      level: "Kindergarten",
      title: "Kindergarten Foundation Class",
      description: "A single-year preparatory program designed to introduce letters, basic numeracy, fine motor coordination, and social behavior before entering Class 1.",
      subjects: ["English Phonics", "Nepali Shabda Bodh", "Basic Numeracy & Shapes", "Creative Arts & Songs", "Sensory & Social Play"],
      careers: ["Builds Learning Enthusiasm", "Enhances Basic Motor Skills", "Establishes Core Alphabetical Foundations"],
      duration: "1 Year Standalone Class",
      iconName: "ToyBrick"
    },
    {
      id: "primary-level",
      level: "Primary School",
      title: "Primary Education (Class 1 to 5)",
      description: "Core primary curriculum aligned with CDC Nepal, ensuring solid foundations in math operations, natural science awareness, and dual-language comprehension.",
      subjects: ["English Expression", "Nepali Vyakaran", "Primary Mathematics", "Science & Environment", "Social Studies & Moral Values", "Creative Art & Craft"],
      careers: ["Dual-Language Reading & Writing", "Basic Scientific Method Foundations", "Collaborative Peer Coordination"],
      duration: "5 Years (Classes 1 - 5)",
      iconName: "BookOpen"
    },
    {
      id: "lower-secondary",
      level: "Lower Secondary",
      title: "Lower Secondary Foundations (Class 6 to 8)",
      description: "Critical transition phase with an increased focus on laboratory testing, mathematical problem-solving, computing concepts, and language literature.",
      subjects: ["Compulsory Mathematics", "General Science & Labs", "English Literature Studies", "Nepali Sahitya", "Social Studies & Geography", "Computer & Tech Studies"],
      careers: ["Logical & Analytical Comprehension", "Fundamental Computer Literacy", "Preparation for Rigorous Secondary Standards"],
      duration: "3 Years (Classes 6 - 8)",
      iconName: "FlaskConical"
    },
    {
      id: "secondary-level",
      level: "Secondary School",
      title: "Secondary Board Prep (Class 9 & 10)",
      description: "Rigorous high-school modules comprehensively prepared for the national Secondary Education Examination (SEE) following the strict CDC guidelines.",
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
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Academic Outlets to Power Diverse Strengths
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            At Shristi Academy, we divide our academic milestones into clear, targeted, and cohesive paths. We guide students from early playgroups up to secondary school certification (SEE).
          </p>
        </div>

        {/* Core Educational Philosophy - streamlined */}
        <div className="bg-[#FAF9F6]/85 border border-indigo-100 rounded-2xl p-5 max-w-3xl mx-auto text-center shadow-sm">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold">
            🥗 <strong>Student Well-being Priority:</strong> Shristi Academy couples rigorous National Examination Board syllabus preparation with fresh, balanced organic campus meals and professional physical workouts to ensure robust physical growth alongside academic excellence.
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
                className="bg-white border border-indigo-50/50 p-6 md:p-8 rounded-[32px] shadow-xl shadow-indigo-100/20 flex flex-col justify-between hover:border-indigo-200 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="space-y-6">
                  
                  {/* Program Header */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100/50 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">
                      {renderIcon(program.iconName)}
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-purple-50 text-purple-600 py-1.5 px-3 rounded-xl font-bold">
                      {program.duration}
                    </span>
                  </div>

                  {/* Program Details */}
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {program.description}
                    </p>
                  </div>

                  {/* Subjects Block */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-xs text-indigo-600 tracking-wider uppercase font-mono">
                      Key Learning Subjects
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {program.subjects.map((sub, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-bold">
                          <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Highlights/Outcomes Block */}
                <div className="mt-8 pt-6 border-t border-indigo-50/50 space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-indigo-600 tracking-wider uppercase font-mono">
                      Direct Learning Benefits
                    </h4>
                    <div className="space-y-1.5">
                      {program.careers.map((career, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-500 font-bold">
                          <div className="p-0.5 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5 shrink-0">
                            <Check className="w-3 h-3 text-indigo-600" />
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
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-slate-350 rounded-[28px] p-8 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto font-sans">
          <div className="space-y-1.5 text-left max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shrink-0 animate-pulse" />
              <h4 className="font-black text-sm text-white">Full CDC Nepal Curriculum Compliance</h4>
            </div>
            <p className="text-[11px] text-indigo-200/90 leading-normal font-medium">
              Our academic syllables and textbooks update automatically in strict compliance with the Curriculum Development Centre (CDC) of Nepal. This ensures junior and senior scholars are meticulously prepared for the national Secondary Education Examination (SEE).
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-[10px] font-mono text-pink-300 font-bold bg-[#1e1b4b] uppercase border border-pink-900/30 py-2 px-4 rounded-full shadow-lg">
              CDC Affiliated Board
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
