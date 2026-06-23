import { MapPin, Phone, Mail, GraduationCap, Award, ExternalLink, Globe, Layers, BookOpen, Clock, Facebook, Youtube } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onNavigate, onOpenAdmin }: FooterProps) {
  
  const academicMenus = [
    { label: "Montessori Early Years", section: "academics" },
    { label: "Primary School (Classes 1-5)", section: "academics" },
    { label: "Secondary School (Classes 6-10)", section: "academics" },
    { label: "SEE Board Preparation Track", section: "academics" },
    { label: "Computer Lab & Robotics Club", section: "academics" },
  ];

  const servicesMenus = [
    { label: "Online Admissions Query Register", section: "admission" },
    { label: "NEB Nepal GPA Grading Calculator", section: "tools" },
    { label: "Co-curricular events timeline", section: "tools" },
    { label: "CDC Syllabus downloads center", section: "academics" },
    { label: "Admissions prospectus (DRAFT)", section: "admission" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#18154D] via-[#110E36] to-[#0A0824] text-slate-100 font-sans text-xs border-t border-indigo-900/60 pt-20 pb-12 relative overflow-hidden">
      {/* Premium glowing ambient backdrops */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-indigo-500/20 to-purple-500/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-10 w-[250px] h-[250px] bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left relative z-10">
        
        {/* COLUMN 1: CORPORATE MARK BRAND */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-white border border-indigo-200 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950/40 overflow-hidden p-0.5">
              <SchoolLogo className="w-full h-full" />
            </div>
            <div>
              <span className="font-display font-black text-lg text-white tracking-tight leading-none block">
                SHRISTI ACADEMY
              </span>
              <span className="text-[9px] text-pink-300 font-mono tracking-widest leading-none font-black uppercase mt-1.5 block">
                PRIMARY & SECONDARY SCHOOL
              </span>
            </div>
          </div>
          
          <p className="leading-relaxed text-[12px] text-slate-300/95 font-medium">
            Providing premium holistic education since 2016 AD in Mid-Baneshwor, Kathmandu, Nepal, dedicated to fostering a rich academic legacy.
          </p>

          <div className="p-4 bg-indigo-950/50 border border-indigo-900/40 rounded-2xl space-y-2 text-left font-mono text-[10px]">
            <p className="text-pink-400 font-black uppercase tracking-wider">Board affiliation:</p>
            <p className="text-slate-200 font-bold">National Examinations Board (NEB) of Nepal</p>
            <p className="text-slate-400 font-semibold select-all">School Code: BS-2056-KTM</p>
          </div>

          {/* Secure Admin Portal relocated safely here in Column 1 to avoid hover overlaps */}
          <button 
            type="button" 
            onClick={onOpenAdmin}
            className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 rounded-xl text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-2 text-[10px] uppercase tracking-wider font-mono font-bold cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Secure Admin Entry</span>
          </button>
        </div>

        {/* COLUMN 2: ACADEMIC SECTIONS MENUS */}
        <div className="space-y-4">
          <h4 className="font-black text-[10.5px] text-white uppercase tracking-widest font-mono flex items-center border-b border-white/10 pb-2">
            <BookOpen className="w-3.5 h-3.5 mr-2 text-indigo-400" />
            Academics Outlets
          </h4>
          <ul className="space-y-2 text-slate-300 font-semibold">
            {academicMenus.map((menu, i) => (
              <li key={i}>
                <button
                  onClick={() => onNavigate(menu.section)}
                  className="hover:text-indigo-300 transition-colors flex items-center group text-left cursor-pointer text-[12px] py-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-all text-indigo-300 mr-2 -translate-x-1 group-hover:translate-x-0 inline-block">›</span>
                  {menu.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3: STUDENTS & PORTALS MENUS */}
        <div className="space-y-4">
          <h4 className="font-black text-[10.5px] text-white uppercase tracking-widest font-mono flex items-center border-b border-white/10 pb-2">
            <GraduationCap className="w-3.5 h-3.5 mr-2 text-purple-400" />
            Admissions & Portal
          </h4>
          <ul className="space-y-2 text-slate-300 font-semibold">
            {servicesMenus.map((menu, i) => (
              <li key={i}>
                <button
                  onClick={() => onNavigate(menu.section)}
                  className="hover:text-purple-300 transition-colors flex items-center group text-left cursor-pointer text-[12px] py-1"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-all text-purple-300 mr-2 -translate-x-1 group-hover:translate-x-0 inline-block">›</span>
                  {menu.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: DIRECT CONTACT DESK DIRECTORY */}
        <div className="space-y-4">
          <h4 className="font-black text-[10.5px] text-white uppercase tracking-widest font-mono flex items-center border-b border-white/10 pb-2">
            <Globe className="w-3.5 h-3.5 mr-2 text-pink-400" />
            Direct Contact Desk
          </h4>
          <ul className="space-y-4 font-semibold text-slate-300">
            <li className="flex items-start text-[11.5px] gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 mt-0.5 shrink-0 border border-indigo-550/20">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-white font-black block text-[12px]">Kathmandu Campus</span>
                <p className="text-slate-300 font-semibold text-[10.5px] mt-0.5">Mid-Baneshwor, Kathmandu, Nepal</p>
                <p className="text-slate-400 text-[9.5px] mt-0.5">(Near Puja Pratisthan)</p>
              </div>
            </li>
            
            <li className="flex items-start text-[11.5px] gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 mt-0.5 shrink-0 border border-purple-550/20">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-white font-black block text-[12px]">Contact Numbers</span>
                <p className="text-indigo-300 font-mono text-[11px] font-black mt-0.5">Landline: 01-4496573</p>
                <p className="text-purple-300 font-mono text-[10px] font-bold mt-1">Mobile: +977-9761682858, 9709757025</p>
              </div>
            </li>

            <li className="flex items-start text-[11.5px] gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg text-pink-300 mt-0.5 shrink-0 border border-pink-550/20">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-white font-black block text-[12px]">Official Email & Hour</span>
                <p className="text-slate-300 font-bold text-[10.5px] mt-0.5">info@shristiacademy.edu.np</p>
                <div className="mt-1.5 flex items-center space-x-1 text-[9px] font-mono text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-md inline-block border border-pink-500/20">
                  <Clock className="w-2.5 h-2.5 inline mr-1" />
                  <span>Weekdays: 9 AM - 4 PM</span>
                </div>
              </div>
            </li>

            {/* Social Media connects requested instead of old link */}
            <li className="pt-2 space-y-3">
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono">Connect with Shristi</p>
              <div className="flex items-center space-x-3">
                <a 
                  href="https://www.facebook.com/people/International-Kindergarten-Shristi-Academy-Nepal/100063633037329/" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#1877F2]/20 text-[#1877F2] hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-[#1877F2]/40 shadow-sm"
                  title="Facebook Page"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
                <a 
                  href="https://www.youtube.com/@ShristiAcademy-wp3ls" 
                  target="_blank" 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FF0000]/25 text-[#FF0000] hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-[#FF0000]/40 shadow-sm"
                  title="YouTube Channel"
                >
                  <Youtube className="w-4.5 h-4.5" />
                </a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* FOOTER BOTTOM METADATA BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] font-mono relative z-10 font-bold">
        
        <div className="text-center sm:text-left leading-relaxed">
          <span>© Since 2016 - {new Date().getFullYear()} Shristi Academy. All Rights Reserved.</span>
          <span className="hidden md:inline"> | Approved by Ministry of Education, Nepal.</span>
        </div>

        <div className="text-right text-slate-400 flex items-center bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          <span>Verified Academy Portal</span>
        </div>

      </div>
    </footer>
  );
}
