import { motion } from "motion/react";
import { Award, Heart, ShieldCheck, Laptop, Flame, Handshake } from "lucide-react";

export default function WhyShristi() {
  const pillars = [
    {
      id: "why-pillar-1",
      title: "1. Top Quality Learning",
      highlight: "Great Results & Exam Success",
      description: "Since 2016, we help every student build strong skills in math, science, and languages so they do well in school and national SEE board exams.",
      icon: Award,
      badgeColor: "bg-pink-100 text-pink-700 border-pink-300",
      accentBg: "hover:border-pink-500 hover:bg-pink-50/10 shadow-pink-100/45",
      label: "Strong Studies"
    },
    {
      id: "why-pillar-2",
      title: "2. Growing Beyond Books",
      highlight: "Sports, Arts & Teamwork",
      description: "We encourage students to play sports, join fun activities, make good friends, and build real confidence every single day.",
      icon: Flame,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
      accentBg: "hover:border-purple-500 hover:bg-purple-50/10 shadow-purple-100/45",
      label: "Sports & Play"
    },
    {
      id: "why-pillar-3",
      title: "3. Caring & Friendly Teachers",
      highlight: "Kind Guidance for Every Child",
      description: "Our teachers know each student by name, listen to their questions, and give extra help so no child is ever left behind.",
      icon: Heart,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-300",
      accentBg: "hover:border-indigo-500 hover:bg-indigo-50/10 shadow-indigo-100/45",
      label: "Kind Mentors"
    },
    {
      id: "why-pillar-4",
      title: "4. Good Values & Respect",
      highlight: "Honesty, Kindness & Good Habits",
      description: "We teach children to be polite, honest, and respectful, helping them grow into caring people who treat everyone with kindness.",
      icon: Handshake,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-300",
      accentBg: "hover:border-indigo-500 hover:bg-indigo-50/10 shadow-indigo-100/45",
      label: "Good Habits"
    },
    {
      id: "why-pillar-5",
      title: "5. Safe & Healthy School",
      highlight: "Secure Campus & Fresh Meals",
      description: "Your child is always safe here. We have secure gates, friendly supervisors, and fresh, healthy school lunches every day.",
      icon: ShieldCheck,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
      accentBg: "hover:border-purple-500 hover:bg-purple-50/10 shadow-purple-100/45",
      label: "Safe & Warm"
    },
    {
      id: "why-pillar-6",
      title: "6. Computer & Science Labs",
      highlight: "Fun Hands-On Practice",
      description: "Students learn by doing! They try real experiments in our science labs and learn modern technology skills in our computer lab.",
      icon: Laptop,
      badgeColor: "bg-pink-100 text-pink-700 border-pink-300",
      accentBg: "hover:border-pink-500 hover:bg-pink-50/10 shadow-pink-100/45",
      label: "Modern Labs"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-indigo-100 relative overflow-hidden" id="why-shristi">
      {/* Playful Floating Glow Blobs to make the section look extremely bright & popping */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      
      <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-4 py-2 rounded-xl inline-block shadow-sm">
            🏫 Why Families Choose Shristi Academy
          </span>
          <h2 id="why-shristi-title" className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Why Shristi Academy?
          </h2>
          <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed">
            Six simple reasons why parents and students love learning with us in Mid-Baneshwor, Kathmandu.
          </p>
        </div>

        {/* Pillars Responsive Grid (Cards Format - optimized airy card proportions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                id={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group bg-white p-7 sm:p-8 lg:p-9 xl:p-10 rounded-[32px] border-2 border-slate-200/85 shadow-md hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between transition-all duration-300 ${pillar.accentBg}`}
              >
                <div className="space-y-6">
                  {/* Icon Bag */}
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${pillar.badgeColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-6 h-6 shrink-0" />
                    </div>
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
                      {pillar.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-left">
                    {/* Main Title - MUCH LARGER & BOLDER AS REQUESTED */}
                    <h3 className="font-display font-black text-xl sm:text-2xl text-slate-950 tracking-tight leading-tight group-hover:text-indigo-700 transition-colors">
                      {pillar.title}
                    </h3>
                    
                    {/* Highlighted core concept - bold & larger */}
                    <p className="text-indigo-700 font-black text-sm sm:text-base leading-snug">
                      👉 {pillar.highlight}
                    </p>
                  </div>

                  {/* Description - highly professional copy, legible */}
                  <p className="text-slate-700 text-sm leading-relaxed font-bold text-left">
                    {pillar.description}
                  </p>
                </div>

                {/* Micro ornament indicator */}
                <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100 flex items-center justify-between text-slate-400 group-hover:text-indigo-700 transition-colors">
                  <span className="text-[11px] font-mono font-black tracking-widest uppercase">
                    Pillar {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-current" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
