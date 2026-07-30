import { useState } from "react";
import { 
  X, Download, FileText, ZoomIn, ZoomOut, Maximize2, Minimize2, 
  Sparkles, CheckCircle2, Shield, Calendar, Award, BookOpen, MapPin, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SchoolProfileConfig } from "../types";
import SchoolLogo from "./SchoolLogo";

interface SchoolProfileModalProps {
  config: SchoolProfileConfig;
  isOpen: boolean;
  onClose: () => void;
  isAdminPreview?: boolean;
}

export default function SchoolProfileModal({
  config,
  isOpen,
  onClose,
  isAdminPreview = false,
}: SchoolProfileModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative w-full bg-white border border-indigo-150 rounded-[32px] shadow-2xl overflow-hidden flex flex-col text-slate-900 transition-all duration-300 ${
            isFullscreen ? "h-[98vh] max-w-[98vw]" : "h-[90vh] max-w-5xl"
          }`}
        >
          {/* Admin Preview Header Tag */}
          {isAdminPreview && (
            <div className="bg-amber-500 text-slate-950 text-center text-[11px] font-bold py-1 px-3 uppercase tracking-widest flex items-center justify-center space-x-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ADMIN PREVIEW MODE • OFFICIAL SCHOOL PROFILE (PDF)</span>
            </div>
          )}

          {/* Top Gradient Accent Line */}
          <div className="h-2 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 w-full shrink-0" />

          {/* Modal Toolbar Header */}
          <div className="p-4 sm:px-6 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Title & File Meta */}
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-100 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
                    {config.title || "Shristi Academy • School Profile & Prospectus"}
                  </h3>
                  <span className="hidden sm:inline-block bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                    OFFICIAL PDF
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center space-x-3">
                  <span>📄 {config.fileName || "Shristi_Academy_School_Profile_2083.pdf"}</span>
                  {config.fileSize && <span>• {config.fileSize}</span>}
                  {config.updatedAt && <span>• Updated {config.updatedAt}</span>}
                </p>
              </div>
            </div>

            {/* Controls: Zoom, Fullscreen, Download, Close */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Zoom Controls */}
              <div className="hidden md:flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200/80 text-xs font-semibold">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 py-1 hover:bg-white text-indigo-700 rounded-lg transition-all cursor-pointer font-bold"
                  title="Reset Zoom"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Fullscreen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex p-2.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Download Copy Button */}
              {config.pdfUrl && (
                <a
                  href={config.pdfUrl}
                  download={config.fileName || "Shristi_Academy_School_Profile.pdf"}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
                  title="Download PDF Copy"
                >
                  <Download className="w-3.5 h-3.5 text-pink-300" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              )}

              {/* Close Modal */}
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
                title="Close Window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content / In-Browser PDF Preview Viewer */}
          <div className="flex-1 bg-slate-900/95 overflow-auto p-2 sm:p-4 relative flex justify-center items-start">
            {config.pdfUrl ? (
              <div 
                className="w-full h-full min-h-[60vh] bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                {/* Standard Browser PDF Viewer Object + iframe fallback */}
                <object
                  data={config.pdfUrl}
                  type="application/pdf"
                  className="w-full h-full min-h-[75vh]"
                >
                  <iframe
                    src={config.pdfUrl}
                    title="School Profile PDF Preview"
                    className="w-full h-full min-h-[75vh] border-0"
                  >
                    <div className="p-8 text-center text-slate-700 space-y-4">
                      <p>Your browser does not support direct PDF embed.</p>
                      <a
                        href={config.pdfUrl}
                        download={config.fileName}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold"
                      >
                        Download School Profile PDF
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            ) : (
              /* ELEGANT BUILT-IN DIGITAL PROSPECTUS PREVIEW (Fallback when no custom file uploaded) */
              <div 
                className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 text-left space-y-8 shadow-2xl my-auto transition-all duration-200 overflow-y-auto max-h-[80vh]"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              >
                {/* Document Letterhead */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-indigo-600 pb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-indigo-50 border-2 border-indigo-500 rounded-2xl flex items-center justify-center p-1">
                      <SchoolLogo className="w-full h-full" />
                    </div>
                    <div>
                      <h1 className="font-display font-black text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-pink-600">
                        SHRISTI ACADEMY
                      </h1>
                      <p className="text-xs font-mono font-bold text-indigo-800 uppercase tracking-wider">
                        Institutional Profile & Academic Prospectus 2083/2084 BS
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-500 space-y-1">
                    <p className="font-extrabold text-indigo-700">Government Approved (CDC)</p>
                    <p>Est. 2016 AD • Mid-Baneshwor, Ktm</p>
                    <p className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded-full inline-block">
                      Official Document
                    </p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-4">
                  <h2 className="font-display font-black text-xl text-slate-900 border-l-4 border-pink-500 pl-3">
                    1. Executive Overview & Mission
                  </h2>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    Shristi Academy is a premier educational institution committed to delivering academic rigor, practical science-technology exposure, and moral character building for students from Kindergarten to Class 10 (SEE Board). Located in the heart of Mid-Baneshwor, Kathmandu, our campus features modern robotics & computer facilities, dedicated science labs, and a warm, safe learning environment.
                  </p>
                </div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl w-fit">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-xs text-indigo-950 uppercase">Academic Excellence</h3>
                    <p className="text-[11.5px] text-slate-600 font-medium">100% SEE Board success rate with exemplary GPA achievements.</p>
                  </div>

                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-2">
                    <div className="p-2 bg-purple-600 text-white rounded-xl w-fit">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-xs text-purple-950 uppercase">Modern Curriculum</h3>
                    <p className="text-[11.5px] text-slate-600 font-medium">CDC aligned syllabus integrated with coding, robotics, & audiovisual learning.</p>
                  </div>

                  <div className="p-4 bg-pink-50/60 border border-pink-100 rounded-2xl space-y-2">
                    <div className="p-2 bg-pink-600 text-white rounded-xl w-fit">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-xs text-pink-950 uppercase">Safe Campus & Care</h3>
                    <p className="text-[11.5px] text-slate-600 font-medium">CCTV monitored premises, organic lunch menu, and dedicated transport network.</p>
                  </div>
                </div>

                {/* Key Facilities & Admission Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h2 className="font-display font-black text-base text-slate-900 border-l-4 border-indigo-500 pl-3">
                      2. Key Institutional Facilities
                    </h2>
                    <ul className="space-y-2 text-xs font-semibold text-slate-700">
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>State-of-the-art Computer & Science Laboratories</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Interactive Smart Classrooms with Projectors</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Comprehensive Reference Library & Study Hall</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Indoor & Outdoor Sports Infrastructure</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display font-black text-base text-slate-900 border-l-4 border-purple-500 pl-3">
                      3. Admission & Contact Info
                    </h2>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2 text-slate-700 font-medium">
                      <p className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Mid-Baneshwor, Kathmandu, Nepal</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Tel: 01-4496573 • Mobile: +977-9851082643</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Admissions Open for Session 2083 BS (Playgroup to Grade 9)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-mono">
                  <p>* Note for Administrator: You can replace this document anytime with an official school profile PDF file in Secretariat Cabinet.</p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center space-x-2 text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Use mouse wheel or controls above to zoom and scroll through the document preview.</span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
