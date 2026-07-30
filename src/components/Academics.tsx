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
      title: "Kindergarten Program",
      focus: "Play, Letters & Numbers",
      description: "A fun and gentle play-based program that helps young children build early reading, counting, drawing, and social skills before starting Grade 1.",
      subjects: ["English Phonics & Reading", "Nepali Word Learning", "Basic Numbers & Shapes", "Drawing, Craft & Songs", "Fun Play & Socializing"],
      careers: ["Builds a Love for Learning", "Improves Fine Motor & Hand Skills", "Learns Alphabet & Numbers Easily"],
      duration: "Early Learning Stage",
      iconName: "ToyBrick"
    },
    {
      id: "primary-level",
      level: "Primary School",
      title: "Primary School (Classes 1 to 5)",
      focus: "Reading, Writing & Science Basics",
      description: "Covers the official national curriculum. Focuses on building strong reading and writing skills in English and Nepali, basic math, and simple science concepts.",
      subjects: ["English Language", "Nepali Reading & Grammar", "Mathematics", "Science & Environment", "Social Studies & Values", "Arts & Crafts"],
      careers: ["Reading & Writing in English & Nepali", "Understanding Science Basics", "Developing Good Study Habits & Teamwork"],
      duration: "Classes 1 to 5 (5 Years)",
      iconName: "BookOpen"
    },
    {
      id: "lower-secondary",
      level: "Lower Secondary",
      title: "Lower Secondary (Classes 6 to 8)",
      focus: "Maths, Science & Computer Studies",
      description: "Prepares students for higher classes with practical computer labs, science experiments, problem-solving math, and creative language reading.",
      subjects: ["Mathematics", "General Science & Experiments", "English Reading & Writing", "Nepali Literature", "Social Studies & Civics", "Computer Studies"],
      careers: ["Problem-Solving & Logical Thinking", "Computer & Typing Literacy", "Smooth Step to High School"],
      duration: "Classes 6 to 8 (3 Years)",
      iconName: "FlaskConical"
    },
    {
      id: "secondary-level",
      level: "Secondary School",
      title: "Secondary SEE Prep (Classes 9 & 10)",
      focus: "National Board (SEE) Exam Success",
      description: "Focused preparation for the national Secondary Education Examination (SEE). Includes practice tests, teacher guidance, and subject coaching to achieve top marks.",
      subjects: ["Compulsory Mathematics", "Optional Maths / Accounting", "Science & Physics", "Social Studies & Civics", "Nepali & Computer Science", "English Language"],
      careers: ["Thorough Preparation for National SEE Exams", "Prepares for High School Streams (Science/Management)", "Builds Strong Exam Confidence"],
      duration: "Classes 9 & 10 (2 Years)",
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
    <section className="py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-white/40 border-y border-indigo-100/50" id="academics">
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
            Our Academic Programs
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Clear Learning Steps for Every Age
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed">
            At Shristi Academy, we guide children through each stage of learning—from early fun in Kindergarten all the way to Grade 10 SEE exams.
          </p>
        </div>

        {/* Core Educational Philosophy - streamlined & prominent */}
        <div className="bg-[#FAF9F6]/85 border border-indigo-100 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto text-center shadow-md">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-bold">
            🥗 <span className="text-indigo-600">Student Health & Well-being:</span> Shristi Academy combines official national curriculum studies with fresh, healthy school lunches and daily sports activities to keep students energetic, healthy, and happy.
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
            {programs.map((program, pIdx) => {
              // Custom vibrant themes for each level to make the website look colorful, bouncy and highly intuitive!
              const themes = [
                {
                  bg: "bg-gradient-to-b from-white to-pink-50/35 hover:border-pink-400 shadow-pink-100/30 hover:shadow-pink-200/50",
                  border: "border-pink-200",
                  iconBg: "bg-pink-100 text-pink-700 border-pink-200",
                  durBg: "bg-pink-200/80 text-pink-950 font-black border border-pink-300",
                  focusBg: "bg-pink-50 border-pink-200/60",
                  focusText: "text-pink-900",
                  dotColor: "bg-pink-500",
                  benefitIcon: "bg-pink-100 text-pink-800 border-pink-200"
                },
                {
                  bg: "bg-gradient-to-b from-white to-indigo-50/35 hover:border-indigo-400 shadow-indigo-100/30 hover:shadow-indigo-200/50",
                  border: "border-indigo-200",
                  iconBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
                  durBg: "bg-indigo-200/80 text-indigo-950 font-black border border-indigo-300",
                  focusBg: "bg-indigo-50 border-indigo-200/60",
                  focusText: "text-indigo-900",
                  dotColor: "bg-indigo-500",
                  benefitIcon: "bg-indigo-100 text-indigo-800 border-indigo-200"
                },
                {
                  bg: "bg-gradient-to-b from-white to-purple-50/35 hover:border-purple-400 shadow-purple-100/30 hover:shadow-purple-200/50",
                  border: "border-purple-200",
                  iconBg: "bg-purple-100 text-purple-700 border-purple-200",
                  durBg: "bg-purple-200/80 text-purple-950 font-black border border-purple-300",
                  focusBg: "bg-purple-50 border-purple-200/60",
                  focusText: "text-purple-900",
                  dotColor: "bg-purple-500",
                  benefitIcon: "bg-purple-100 text-purple-800 border-purple-200"
                },
                {
                  bg: "bg-gradient-to-b from-white to-indigo-50/20 hover:border-pink-500 shadow-indigo-100/40 hover:shadow-pink-200/60 border-2 border-indigo-200",
                  border: "border-indigo-300",
                  iconBg: "bg-gradient-to-r from-pink-500 to-indigo-600 text-white border-transparent",
                  durBg: "bg-pink-500 text-slate-950 font-black border-2 border-white shadow-md",
                  focusBg: "bg-gradient-to-r from-pink-50 to-indigo-50 border-pink-300",
                  focusText: "text-indigo-950",
                  dotColor: "bg-pink-500",
                  benefitIcon: "bg-indigo-600 text-white border-transparent"
                }
              ];
              const t = themes[pIdx] || themes[0];

              return (
                <div 
                  key={program.id}
                  className={`bg-white border-2 ${t.border} p-8 md:p-10 rounded-[36px] shadow-xl flex flex-col justify-between hover:scale-[1.04] transition-all duration-300 group ${t.bg}`}
                >
                  <div className="space-y-6">
                    
                    {/* Program Header */}
                    <div className="flex justify-between items-start">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm ${t.iconBg}`}>
                        {renderIcon(program.iconName)}
                      </div>
                      <span className={`text-[11px] font-mono uppercase py-1.5 px-3.5 rounded-xl font-black tracking-wider ${t.durBg}`}>
                        {program.duration}
                      </span>
                    </div>

                    {/* Program Details */}
                    <div className="space-y-3 text-left">
                      <h3 className="font-display font-black text-2xl text-slate-950 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {program.title}
                      </h3>
                      
                      {/* Emphasis Focus Tag - HIGHLY PROMINENT */}
                      <div className={`border px-3.5 py-2 rounded-xl ${t.focusBg}`}>
                        <p className={`font-black text-xs sm:text-sm ${t.focusText}`}>
                          🔑 Focus: {program.focus}
                        </p>
                      </div>

                      <p className="text-slate-700 text-sm leading-relaxed font-bold">
                        {program.description}
                      </p>
                    </div>

                    {/* Subjects Block */}
                    <div className="space-y-3 pt-2 text-left">
                      <h4 className="font-black text-xs text-indigo-700 tracking-wider uppercase font-mono">
                        Key Learning Subjects
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5">
                        {program.subjects.map((sub, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 font-extrabold">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dotColor}`} />
                            <span className="truncate">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Highlights/Outcomes Block */}
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 space-y-4 text-left">
                    <div className="space-y-3">
                      <h4 className="font-black text-xs text-indigo-700 tracking-wider uppercase font-mono">
                        Direct Academic Benefits
                      </h4>
                      <div className="space-y-2">
                        {program.careers.map((career, idx) => (
                          <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 font-black">
                            <div className={`p-0.5 rounded-lg mt-0.5 shrink-0 border ${t.benefitIcon}`}>
                              <Check className="w-3.5 h-3.5 font-black" />
                            </div>
                            <span className="leading-tight">{career}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
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
