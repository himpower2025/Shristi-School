import { useState, useEffect } from "react";
import SchoolLogo from "./SchoolLogo";
import { 
  Menu, X, Shield, ShieldCheck, NotebookText, Bell, 
  MapPin, GraduationCap, Home, BookOpen, Clock, Layers,
  Phone, Mail, Calendar, ChevronRight, Award, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  unreadCount: number;
}

export default function Header({ 
  currentSection, 
  setCurrentSection, 
  isAdminMode, 
  setIsAdminMode,
  unreadCount 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "home", label: "Welcome Home", sub: "Main Entrance Screen", icon: Home },
    { id: "about", label: "About Our Legacy", sub: "Our History (Established 2016 AD)", icon: Layers },
    { id: "academics", label: "Academic Programs", sub: "Kindergarten & SEE Curriculums", icon: BookOpen },
    { id: "notices", label: "Notices & Announcements", sub: "Circulars, Routings & Events", icon: NotebookText, badge: unreadCount },
    { id: "suggestions", label: "Suggestion Board", sub: "Parents' inquiries & shared complaints", icon: HelpCircle },
    { id: "tools", label: "School Calendar", sub: "Official Schedule & Dynamic Events", icon: Calendar },
    { id: "admission", label: "Admissions & Entry", sub: "Apply Online for Session 2083 BS", icon: GraduationCap, highlights: true },
  ];

  const handleNavigate = (id: string) => {
    setCurrentSection(id);
    setIsAdminMode(false);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Professional Utility Info Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-pink-600 text-white text-[11px] py-2.5 px-4 shadow-sm hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-mono">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-white font-extrabold">
              <MapPin className="w-3.5 h-3.5 mr-1 text-pink-300" />
              Mid-Baneshwor, Kathmandu, Nepal
            </span>
            <span className="text-white/40">|</span>
            <span className="text-pink-100 font-black uppercase tracking-widest">Shristi Academy (Established 2016 AD)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-black">Call: <strong className="text-pink-200">01-4496573</strong></span>
            <span>•</span>
            <span className="text-white font-black">info@shristiacademy.edu.np</span>
          </div>
        </div>
      </div>

      {/* Persistent Elegant Header Container */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b-2 border-indigo-200 py-3 shadow-lg" 
          : "bg-white border-b-2 border-slate-100 py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          {/* Left: School Logo & Title */}
          <div 
            onClick={() => handleNavigate("home")}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white border-2 border-indigo-500 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden p-0.5">
              <SchoolLogo className="w-full h-full" />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-indigo-800 tracking-tight leading-none block">
                SHRISTI ACADEMY
              </span>
              <p className="text-[10px] text-indigo-700 font-extrabold font-mono tracking-widest leading-none mt-1.5 uppercase">
                Primary & Secondary School
              </p>
            </div>
          </div>

          {/* Right Area: Main Call to Action & Hamburger Multi-Trigger (Desktop + Mobile Unified) */}
          <div className="flex items-center space-x-3.5">
            {/* Admissions Quick Apply Button - Persistent for excellent UX Conversion */}
            <button
              onClick={() => handleNavigate("admission")}
              className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-black text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md border border-pink-200 hidden md:block"
            >
              Apply Online
            </button>

            {/* Pinned Announcements Bell Quick-click */}
            <button
              onClick={() => handleNavigate("notices")}
              className="p-2.5 text-slate-700 hover:text-indigo-600 relative bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:scale-110 transition-all"
              title="Show Notices"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Elite 3-line Hamburger Menu Button (Unified For Desktop & Mobile) */}
            <button
              id="hamburger-navigation-trigger"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl shadow-md border border-indigo-500/30 transition-all duration-300 hover:scale-[1.05] cursor-pointer group"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-pink-300 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[11px] sm:text-xs font-mono font-black tracking-widest uppercase">
                Menu
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Sliding Navigation Overlay Drawer (Right-Side Panel) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Blur Lockout Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950 backdrop-blur-sm z-50 transition-opacity"
            />

            {/* Sidebar drawer body */}
            <motion.div
              id="main-navigation-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Top Header Area */}
              <div className="p-6 border-b border-slate-50 bg-[#FAF9F6]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 bg-white border border-indigo-50 rounded-xl flex items-center justify-center p-0.5 shadow-sm">
                      <SchoolLogo className="w-full h-full" />
                    </div>
                    <div>
                      <span className="font-display font-black text-xs text-slate-800 tracking-wider">
                        SHRISTI NAVIGATION
                      </span>
                      <p className="text-[8px] text-slate-400 font-mono tracking-widest uppercase block leading-none">
                        MBN-Kathmandu Hub
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-100 hover:border-slate-200 rounded-xl transition-all shadow-sm"
                    title="Close Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Content Body: Primary Menu Items */}
              <div className="px-6 py-8 flex-grow space-y-6">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase block mb-2">
                  Academic Portals
                </span>

                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id && !isAdminMode;
                    return (
                      <button
                        key={item.id}
                        id={`drawer-menu-item-${item.id}`}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full group p-4 rounded-[20px] border flex items-start text-left transition-all duration-200 ${
                          item.highlights
                            ? "bg-gradient-to-r from-indigo-900 to-purple-900 text-white border-transparent shadow-lg shadow-indigo-100"
                            : isActive
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                              : "bg-slate-50 border-slate-50 hover:bg-slate-100/70 hover:border-slate-200/50 text-slate-800"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          item.highlights 
                            ? "bg-indigo-800 text-white" 
                            : isActive 
                              ? "bg-white text-indigo-600 shadow-sm" 
                              : "bg-white text-slate-400 shadow-sm"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="ml-3.5 flex-grow">
                          <div className="flex items-center">
                            <span className="font-display font-bold text-[14px]">
                              {item.label}
                            </span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="ml-2 bg-pink-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 flex items-center justify-center shadow-sm">
                                {item.badge} New
                              </span>
                            )}
                            <ChevronRight className={`w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${item.highlights ? "text-purple-300" : "text-indigo-400"}`} />
                          </div>
                          <p className={`text-[11px] font-medium leading-normal mt-0.5 ${
                            item.highlights 
                              ? "text-indigo-200" 
                              : isActive 
                                ? "text-indigo-500" 
                                : "text-slate-400"
                          }`}>
                            {item.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Staff Toggle Divider and Trigger */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase block">
                        Administrative Desk
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">For teachers & school registrars</p>
                    </div>
                    
                    <button
                      id="drawer-admin-portal-trigger"
                      onClick={() => {
                        setIsAdminMode(!isAdminMode);
                        setIsDrawerOpen(false);
                      }}
                      className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all duration-300 ${
                        isAdminMode 
                          ? "bg-pink-50 border-pink-100 text-pink-700 shadow-sm" 
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/80 shadow-sm"
                      }`}
                    >
                      {isAdminMode ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
                          <span>CMS Mode On</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span>Staff Login</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Contact Panel */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 font-sans text-xs space-y-4">
                <div className="flex items-center space-x-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium font-mono text-[11px] text-slate-700">01-4496573 / 9851088741</span>
                </div>
                <div className="flex items-center space-x-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium font-mono text-[11px] text-slate-700">info@shristiacademy.edu.np</span>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-center">
                  <p className="text-[9px] text-slate-400 font-medium">© {new Date().getFullYear()} Shristi Academy Secondary School. All Rights Reserved.</p>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
