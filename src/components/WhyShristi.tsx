import { motion } from "motion/react";
import { Award, Heart, ShieldCheck, Laptop, Flame, Handshake } from "lucide-react";

export default function WhyShristi() {
  const pillars = [
    {
      id: "why-pillar-1",
      title: "I. Academic Excellence Legacy",
      highlight: "SEE Toppers & Board Success",
      description: "Established in 2016 AD, we deliver premier curriculum modules, outstanding National Board Exam (SEE) preparation, and comprehensive learning foundations.",
      icon: Award,
      badgeColor: "bg-pink-100 text-pink-700 border-pink-300",
      accentBg: "hover:border-pink-500 hover:bg-pink-50/10 shadow-pink-100/45",
      label: "Gold Standard"
    },
    {
      id: "why-pillar-2",
      title: "II. Holistic Development",
      highlight: "Beyond Classroom Boundaries",
      description: "Nurturing emotional maturity, collaborative teamwork, and physical fitness alongside scholastic milestones to foster confident leaders.",
      icon: Flame,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
      accentBg: "hover:border-purple-500 hover:bg-purple-50/10 shadow-purple-100/45",
      label: "Vitality & Play"
    },
    {
      id: "why-pillar-3",
      title: "III. Distinguished Faculty",
      highlight: "Experienced & Compassionate",
      description: "Our highly licensed, certified educators bring active empathy, academic rigor, and individual attention to unleash every student's potential.",
      icon: Heart,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-300",
      accentBg: "hover:border-indigo-500 hover:bg-indigo-50/10 shadow-indigo-100/45",
      label: "Heart & Nurture"
    },
    {
      id: "why-pillar-4",
      title: "IV. Cultural Harmony & Ethics",
      highlight: "Humility, Respect & Integrity",
      description: "Celebrating diverse background heritages in Kathmandu while anchoring students in mutual respect, ethical leadership, and high civic values.",
      icon: Handshake,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-300",
      accentBg: "hover:border-indigo-500 hover:bg-indigo-50/10 shadow-indigo-100/45",
      label: "Integrity"
    },
    {
      id: "why-pillar-5",
      title: "V. Safe & Supportive Sanctuary",
      highlight: "A Protective Second Home",
      description: "A secure, modern campus equipped with round-the-clock safety, professional counseling, and healthy, nutrient-rich meal options.",
      icon: ShieldCheck,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
      accentBg: "hover:border-purple-500 hover:bg-purple-50/10 shadow-purple-100/45",
      label: "Care & Comfort"
    },
    {
      id: "why-pillar-6",
      title: "VI. Advanced Laboratories & Tech",
      highlight: "Practical Experiential Learning",
      description: "Equipped science labs, multi-media classrooms, and advanced computer workstations to translate textbook theory into real-world insights.",
      icon: Laptop,
      badgeColor: "bg-pink-100 text-pink-700 border-pink-300",
      accentBg: "hover:border-pink-500 hover:bg-pink-50/10 shadow-pink-100/45",
      label: "Innovation Hub"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white border-y-2 border-indigo-100 relative overflow-hidden" id="why-shristi">
      {/* Playful Floating Glow Blobs to make the section look extremely bright & popping */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-black uppercase tracking-widest text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-4 py-2 rounded-xl inline-block shadow-sm">
            🏫 Our 6 Pillars of Educational Philosophy
          </span>
          <h2 id="why-shristi-title" className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Why Shristi Academy?
          </h2>
          <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed">
            Discover the six core institutional anchors that drive our excellence in Mid-Baneshwor, Kathmandu. We blend a historic academic legacy with highly focused experiential learning.
          </p>
        </div>

        {/* Pillars Responsive Grid (Cards Format - highly visible, clean offset colors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
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
                className={`group bg-white p-8 sm:p-10 rounded-[32px] border-2 border-slate-200/85 shadow-md hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between transition-all duration-300 ${pillar.accentBg}`}
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
