import { motion } from "motion/react";
import { Award, Compass, Heart, ShieldAlert, ShieldCheck, Laptop, Flame, Handshake } from "lucide-react";

export default function WhyShristi() {
  const pillars = [
    {
      id: "why-pillar-1",
      title: "A Legacy of Excellence",
      description: "Shristi Academy was established in 2016 with a commitment to providing academic excellence, critical thinking, and compassionate learning for every student.",
      icon: Award,
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200/50",
      accentBg: "hover:border-amber-400 group-hover:bg-amber-50"
    },
    {
      id: "why-pillar-2",
      title: "Holistic Development",
      description: "We nurture the whole child—intellectually, emotionally, socially, and physically—preparing them to thrive in school and life with self-assurance.",
      icon: Flame,
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200/50",
      accentBg: "hover:border-purple-400 group-hover:bg-purple-50"
    },
    {
      id: "why-pillar-3",
      title: "Experienced & Passionate Educators",
      description: "Our teachers bring both expertise and heart into every classroom, ensuring personalized, empathetic, and engaging learning experiences for every single student.",
      icon: Heart,
      badgeColor: "bg-pink-100 text-pink-700 border-pink-200/50",
      accentBg: "hover:border-pink-400 group-hover:bg-pink-50"
    },
    {
      id: "why-pillar-4",
      title: "Inclusive & Respectful Environment",
      description: "We foster a space where every child feels seen, valued, and heard—celebrating localized ethnic diversity while actively promoting universal empathy.",
      icon: Handshake,
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200/50",
      accentBg: "hover:border-emerald-400 group-hover:bg-emerald-50"
    },
    {
      id: "why-pillar-5",
      title: "Safe & Supportive Setting",
      description: "Children flourish best where they feel absolutely safe. At Shristi, we offer a secure, highly protective and caring atmosphere that encourages confidence.",
      icon: ShieldCheck,
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200/50",
      accentBg: "hover:border-blue-400 group-hover:bg-blue-50"
    },
    {
      id: "why-pillar-6",
      title: "Modern, Interactive Learning",
      description: "With a focus on practical, evidence-based teaching, students engage in hands-on tasks, digital programming utilities, and real-world science evaluations.",
      icon: Laptop,
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200/50",
      accentBg: "hover:border-indigo-400 group-hover:bg-indigo-50"
    }
  ];

  return (
    <section className="py-20 px-4 bg-slate-50 border-y border-slate-100/80" id="why-shristi">
      <div className="max-w-7xl mx-auto space-y-14">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-150 px-3.5 py-1.5 rounded-full inline-block">
            Proven Pedagogical Standards
          </span>
          <h2 id="why-shristi-title" className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Why Shristi Academy?
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            Discover the six structural pillars that make Shristi Academy the finest preparatory institution in Mid-Baneshwor, Kathmandu. We blend a historic educational legacy with modern experiential learning.
          </p>
        </div>

        {/* Pillars Responsive Grid (Cards Format - highly visible, clean offset colors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                className={`group bg-white p-6 sm:p-8 rounded-[24px] border border-slate-100/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${pillar.accentBg}`}
              >
                <div className="space-y-4">
                  {/* Icon Bag */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.badgeColor} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-extrabold text-lg text-slate-800 tracking-tight leading-snug group-hover:text-indigo-900 transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-[13px] sm:text-sm leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>

                {/* Micro ornament indicator */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-300 group-hover:text-indigo-500 transition-colors">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                    Pillar {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
