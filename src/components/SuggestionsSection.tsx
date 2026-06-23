import { useState, FormEvent } from "react";
import { 
  MessageSquare, Lock, Unlock, HelpCircle, Send, CheckCircle, 
  Trash2, ShieldCheck, Key, Eye, AlertCircle, Sparkles, MessageCircleCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SuggestionInquiry } from "../types";

interface SuggestionsSectionProps {
  suggestions: SuggestionInquiry[];
  onAddSuggestion: (suggestion: SuggestionInquiry) => void;
  isAdmin: boolean;
  onAddReply?: (id: string, reply: string) => void;
  onDeleteSuggestion?: (id: string) => void;
}

export default function SuggestionsSection({
  suggestions,
  onAddSuggestion,
  isAdmin,
  onAddReply,
  onDeleteSuggestion
}: SuggestionsSectionProps) {
  // Toggle for suggestion writing form
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("School Facilities");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formPin, setFormPin] = useState(""); // 4-digit code
  const [successMsg, setSuccessMsg] = useState("");

  // Lock status (id -> unlocked state)
  const [unlockedIds, setUnlockedIds] = useState<Record<string, boolean>>({});
  const [unlockInputs, setUnlockInputs] = useState<Record<string, string>>({});
  const [unlockErrors, setUnlockErrors] = useState<Record<string, string>>({});

  // Admin reply states
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const categories = [
    "School Facilities",
    "Academic Quality",
    "ECA & Sports Track",
    "Safety & Nurture",
    "Nutritious Cafeteria",
    "Other/General Inquiry"
  ];

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formTitle.trim() || !formContent.trim()) {
      alert("Please fill in all general details.");
      return;
    }

    if (!/^\d{4}$/.test(formPin)) {
      alert("Please specify a 4-digit numeric access PIN (e.g., 1234) to protect your message details.");
      return;
    }

    const created: SuggestionInquiry = {
      id: "suggest-" + Date.now(),
      title: formTitle,
      parentName: formName,
      category: formCategory,
      content: formContent,
      pin: formPin,
      submittedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    onAddSuggestion(created);

    // Reset form
    setFormTitle("");
    setFormName("");
    setFormContent("");
    setFormPin("");
    setShowForm(false);

    setSuccessMsg("🎉 Your inquiry/suggestion was successfully files to the school board! Give your 4-digit password to the administrator or use it to unlock your details below.");
    setTimeout(() => setSuccessMsg(""), 7000);
  };

  const handleUnlockSubmit = (id: string, pin: string, entryPin: string) => {
    if (pin === entryPin) {
      setUnlockedIds(prev => ({ ...prev, [id]: true }));
      setUnlockErrors(prev => ({ ...prev, [id]: "" }));
    } else {
      setUnlockErrors(prev => ({ ...prev, [id]: "Invalid 4-digit code. Please try again." }));
    }
  };

  const handleReplySubmit = (id: string) => {
    const text = replyInputs[id];
    if (!text || !text.trim()) return;
    if (onAddReply) {
      onAddReply(id, text);
      setReplyInputs(prev => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <section className="py-20 px-4 bg-[#FAF9F6] font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block">
            👪 Community Voice Board
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Parents' Shared Suggestion Desk
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            We value your voice! Parents can submit general inquiries, complaints, suggestions, or nutritional tips. 
            Specify a <strong className="text-indigo-650">4-digit lock code</strong> so that the details remain private between you and academic heads.
          </p>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl text-xs flex items-start space-x-3 shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-medium">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FRONT ACTIONS AREA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-indigo-50 rounded-3xl shadow-sm">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Have something to ask our Cabinet?</h4>
            <p className="text-[11px] text-slate-400 font-medium">No account login required. Write a prompt securely under 3 minutes.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-mono font-black rounded-2xl text-xs transition-all shadow-md cursor-pointer tracking-wider"
          >
            {showForm ? "✕ CLOSE WRITING DESK" : "✍ Write an Inquiry / Suggestion"}
          </button>
        </div>

        {/* WRITING DESK EXPANDED FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form 
                onSubmit={handleFormSubmit}
                className="bg-white border border-indigo-100 p-6 sm:p-8 rounded-[32px] shadow-xl text-left space-y-6"
              >
                <div className="flex items-center space-x-3 border-b border-indigo-50 pb-4">
                  <div className="w-9 h-9 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Write Anonymous or Signed Suggestion</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Real-time submission ledger for Shristi council</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">PARENT / GUARDIAN NAME</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ram Bahadur Thapa"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-indigo-50 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-bold shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">CATEGORY AREA</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-indigo-50 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-bold shadow-none"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">INQUIRY SUBJECT / TITLE</label>
                    <input
                      required
                      type="text"
                      placeholder="Brief title summarizing your request or feedback..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-indigo-50 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-bold shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">YOUR MESSAGE / EXPLANATION</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Provide precise details so the Academic Lead and Vani Pradhan (Principal) can take appropriate action and write back to you..."
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-indigo-50 p-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 font-bold shadow-inner"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase flex items-center">
                      <Key className="w-3.5 h-3.5 text-indigo-600 mr-1" />
                      SET 4-DIGIT PIN CODE (REQUIRED)
                    </label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      pattern="\d{4}"
                      placeholder="e.g. 5056"
                      value={formPin}
                      onChange={(e) => setFormPin(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-900 focus:outline-none focus:border-indigo-600 font-mono font-black shadow-inner tracking-widest text-center"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Remember this custom code. You will type it in to view details and school replies.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-black tracking-wider rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-200" />
                    <span>FILE TO ACCREDITED CABINET BOARD</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPLAINTS/SUGGESTIONS CHRONOLOGY LEDGER */}
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-indigo-50 pb-3">
            <h3 className="font-display font-black text-lg text-slate-900">
              Active Suggestion Ledger ({suggestions.length})
            </h3>
            {isAdmin && (
              <span className="flex items-center text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100 rounded-md font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Cabinet Master Bypass: Allowed
              </span>
            )}
          </div>

          {suggestions.length > 0 ? (
            <div className="space-y-6">
              {suggestions.map((item) => {
                const isSecured = !isAdmin && !unlockedIds[item.id];
                const codeInputValue = unlockInputs[item.id] || "";
                const codeErrorStr = unlockErrors[item.id] || "";

                return (
                  <div 
                    key={item.id}
                    className="p-6 bg-white border border-indigo-50 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between space-y-4"
                  >
                    {/* Header tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10.5px] font-mono font-bold text-slate-400 bg-[#FAF9F6] px-3 py-1 rounded-lg border border-indigo-50/50">
                          {item.submittedAt}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/30 font-mono">
                          {item.category}
                        </span>
                      </div>

                      {/* Locked status labels */}
                      <span className={`inline-flex items-center text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border ${
                        isSecured 
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                      }`}>
                        {isSecured ? (
                          <>
                            <Lock className="w-3 h-3 mr-1 text-amber-600" />
                            Private Details Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-1 text-emerald-600 animate-pulse" />
                            Details Unlocked
                          </>
                        )}
                      </span>
                    </div>

                    {/* Meta Subject */}
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-base text-slate-900 tracking-tight leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        Submitted by Parent: <strong className="text-slate-700 font-extrabold">{item.parentName}</strong>
                      </p>
                    </div>

                    {/* Text Body container (Locked/Unlocked variants) */}
                    <div>
                      {isSecured ? (
                        /* SECURED CONTENT VERIFICATION CARD */
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-center">
                          <div className="flex flex-col items-center justify-center space-y-1.5">
                            <Lock className="w-5 h-5 text-indigo-400" />
                            <p className="text-slate-600 font-bold text-xs">This parent inquiry contains secure, private feedback.</p>
                            <p className="text-[11px] text-slate-400 font-medium">To view the full details and replies, type in the 4-digit code set by the parent during file submission:</p>
                          </div>

                          <div className="max-w-xs mx-auto flex items-center space-x-2">
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="4-digit lock PIN"
                              value={codeInputValue}
                              onChange={(e) => setUnlockInputs(prev => ({ ...prev, [item.id]: e.target.value.replace(/\D/g, "") }))}
                              className="w-full bg-white border border-indigo-100 p-2.5 rounded-xl text-center text-xs text-indigo-950 font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-600/10 placeholder:tracking-normal placeholder:font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => handleUnlockSubmit(item.id, item.pin, codeInputValue)}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                            >
                              Unlock
                            </button>
                          </div>

                          {codeErrorStr && (
                            <p className="text-pink-600 font-mono font-bold text-[10px]">{codeErrorStr}</p>
                          )}
                        </div>
                      ) : (
                        /* UNLOCKED FULL CONTENT DIRECTIVE */
                        <div className="space-y-4 pt-1 animate-fadeIn">
                          <div className="p-4 bg-indigo-50/20 border border-indigo-100/40 rounded-2xl">
                            <p className="text-[10px] text-indigo-400 font-mono uppercase font-black tracking-wider mb-1">Parent Message Details:</p>
                            <p className="text-[12.5px] text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap">
                              {item.content}
                            </p>
                          </div>

                          {/* Render Admin Replies */}
                          <div className="space-y-3">
                            <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Official Cabinet Clarifications:
                            </h5>

                            {item.adminReply ? (
                              <div className="p-4 bg-gradient-to-r from-emerald-50/40 to-indigo-50/30 border border-emerald-100 rounded-2xl relative space-y-1 shadow-sm">
                                <div className="absolute top-2.5 right-3 flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>COUNCIL ANSWERED</span>
                                </div>
                                <p className="text-slate-800 font-bold text-[12px] leading-relaxed">
                                  "{item.adminReply}"
                                </p>
                                <span className="block text-[8.5px] font-mono font-bold text-slate-400 pt-1">
                                  Answered by Shristi Administration on {item.repliedAt || "Live Portal"}
                                </span>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400 font-medium">
                                No official cabinet response has been published yet.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions (Admin Controls) */}
                    {isAdmin && (
                      <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-600 font-black tracking-wider block uppercase">Cabinet Reply Management:</span>
                          {onDeleteSuggestion && (
                            <button
                              onClick={() => {
                                if (confirm("Remove this parent inquiry permanently from school board database?")) {
                                  onDeleteSuggestion(item.id);
                                }
                              }}
                              className="text-pink-600 hover:text-pink-800 font-mono font-bold flex items-center space-x-1 cursor-pointer bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>DELETE</span>
                            </button>
                          )}
                        </div>

                        {onAddReply && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type in the official response to write back, then click publish..."
                              value={replyInputs[item.id] || ""}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="flex-grow bg-white border border-indigo-150 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleReplySubmit(item.id)}
                              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-[32px] border border-indigo-100 text-center shadow-xl shadow-indigo-150/5">
              <MessageCircleCode className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-extrabold text-slate-700">No suggestions submitted yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Be the first to address a request to our administrative council! Click "Write an Inquiry" above.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
