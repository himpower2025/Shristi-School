import { useState } from "react";
import { X, Calendar, MapPin, Sparkles, Download, FileText, ArrowRight, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PopupNoticeConfig } from "../types";
import SchoolLogo from "./SchoolLogo";

interface PopupModalProps {
  config: PopupNoticeConfig;
  isOpen: boolean;
  onClose: () => void;
  onDontShowToday?: () => void;
  onActionClick?: (link: string) => void;
  isPreviewMode?: boolean;
}

export default function PopupModal({
  config,
  isOpen,
  onClose,
  onDontShowToday,
  onActionClick,
  isPreviewMode = false,
}: PopupModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleCloseClick = () => {
    if (dontShowAgain && onDontShowToday) {
      onDontShowToday();
    }
    onClose();
  };

  const handleCtaAction = () => {
    if (dontShowAgain && onDontShowToday) {
      onDontShowToday();
    }
    onClose();
    if (config.ctaLink && onActionClick) {
      onActionClick(config.ctaLink);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl my-auto bg-white border border-indigo-100 rounded-[32px] shadow-2xl overflow-hidden text-slate-900"
        >
          {/* Admin Preview Header Tag */}
          {isPreviewMode && (
            <div className="bg-amber-500 text-slate-950 text-center text-[11px] font-mono font-black py-1 px-3 uppercase tracking-widest flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE ADMIN PREVIEW MODE • VISITOR WILL SEE THIS POPUP</span>
            </div>
          )}

          {/* Top Decorative Accent Line */}
          <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 w-full" />

          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-indigo-50/80 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100/80 rounded-2xl text-indigo-700 border border-indigo-200/60 shadow-sm shrink-0">
                <SchoolLogo className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase text-indigo-600 tracking-wider block">
                  Shristi Academy Board • Notice
                </span>
                <span className="inline-block bg-pink-100 text-pink-700 border border-pink-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide mt-0.5">
                  {config.badge || "SPECIAL ANNOUNCEMENT"}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseClick}
              className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              title="Close Popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
            {/* OPTION 1: Poster Image / PDF Document Display */}
            {config.type === "image" ? (
              <div className="space-y-4">
                {config.mediaUrl ? (
                  config.mediaType === "pdf" ? (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-lg text-slate-900">
                          {config.title || "Official Document / PDF Announcement"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {config.fileName || "Official_School_Document.pdf"}
                        </p>
                      </div>
                      <a
                        href={config.mediaUrl}
                        download={config.fileName || "Shristi_Academy_Document.pdf"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download & View PDF Document</span>
                      </a>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-indigo-100 bg-slate-900 shadow-inner group">
                      <img
                        src={config.mediaUrl}
                        alt={config.title || "Official School Poster"}
                        className="w-full max-h-[50vh] object-contain mx-auto rounded-xl"
                      />
                      <div className="absolute bottom-3 right-3">
                        <a
                          href={config.mediaUrl}
                          download="Shristi_Academy_Poster.jpg"
                          className="bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20 flex items-center space-x-1.5 shadow-lg"
                        >
                          <Download className="w-3.5 h-3.5 text-pink-300" />
                          <span>Download Image</span>
                        </a>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold">No poster or PDF image uploaded yet by admin.</p>
                  </div>
                )}

                {/* Additional Title / Content if specified */}
                {config.title && (
                  <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-snug">
                    {config.title}
                  </h3>
                )}
                {config.content && (
                  <p className="text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {config.content}
                  </p>
                )}
              </div>
            ) : (
              /* OPTION 2: Structured Shristi Aesthetic Notice */
              <div className="space-y-6">
                {/* Main Heading */}
                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                    {config.title || "Important School Event & Announcement"}
                  </h3>
                </div>

                {/* Event Time & Location Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {config.eventTime && (
                    <div className="flex items-start space-x-3 bg-indigo-50/70 border border-indigo-100 p-3.5 rounded-2xl">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-indigo-700 uppercase block">
                          Date & Schedule
                        </span>
                        <span className="text-xs font-bold text-slate-800 leading-snug block mt-0.5">
                          {config.eventTime}
                        </span>
                      </div>
                    </div>
                  )}

                  {config.eventLocation && (
                    <div className="flex items-start space-x-3 bg-purple-50/70 border border-purple-100 p-3.5 rounded-2xl">
                      <div className="p-2 bg-purple-600 text-white rounded-xl shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black text-purple-700 uppercase block">
                          Venue / Location
                        </span>
                        <span className="text-xs font-bold text-slate-800 leading-snug block mt-0.5">
                          {config.eventLocation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content Body */}
                <div className="bg-[#FAF9F6] border border-indigo-50 p-4 sm:p-5 rounded-2xl text-slate-700 text-sm font-semibold leading-relaxed whitespace-pre-wrap shadow-inner">
                  {config.content || "Please contact administration for complete event schedule details."}
                </div>

                {/* Call To Action Button if Link or Action specified */}
                {config.ctaText && (
                  <div className="pt-1">
                    <button
                      onClick={handleCtaAction}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer"
                    >
                      <BellRing className="w-4 h-4 text-pink-200" />
                      <span>{config.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:px-6 bg-slate-50 border-t border-slate-100 text-xs">
            {/* Don't show again today option */}
            <label className="flex items-center space-x-2 text-slate-600 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-[11.5px]">Do not show this popup again today</span>
            </label>

            {/* Close Button */}
            <button
              onClick={handleCloseClick}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
