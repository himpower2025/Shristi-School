import { useState, FormEvent } from "react";
import { 
  User, Mail, Phone, School, MapPin, Check, 
  Sparkles, Calendar, ArrowRight, ShieldCheck, BookmarkCheck, FileCheck2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdmissionQuery } from "../types";

interface AdmissionFormProps {
  onSubmitQuery: (query: {
    studentName: string;
    parentName: string;
    email: string;
    mobileNo: string;
    gradeOfInterest: string;
    previousSchool: string;
    district: string;
  }) => void;
}

export default function AdmissionForm({ onSubmitQuery }: AdmissionFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Fields State variables
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [gradeOfInterest, setGradeOfInterest] = useState("Primary School (Grade 1 - 5)");
  const [previousSchool, setPreviousSchool] = useState("");
  const [district, setDistrict] = useState("Kathmandu");

  // Local helper submit
  const handleProceedNext = () => {
    if (step === 1) {
      if (!studentName.trim() || !parentName.trim() || !mobileNo.trim()) {
        alert("Please fill in Student Name, Parent Name and Mobile Number to proceed.");
        return;
      }
      setStep(2);
    }
  };

  const handleSubmitFinal = (e: FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !mobileNo.trim() || !gradeOfInterest) {
      alert("Please ensure all required fields are complete.");
      return;
    }

    // Submit up to App state manager
    onSubmitQuery({
      studentName,
      parentName,
      email: email || "no-email@shristi.edu.np",
      mobileNo,
      gradeOfInterest,
      previousSchool: previousSchool || "K-10 Board School",
      district
    });

    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setStep(1);
    setIsSubmitted(false);
    setStudentName("");
    setParentName("");
    setEmail("");
    setMobileNo("");
    setGradeOfInterest("Primary School (Grade 1 - 5)");
    setPreviousSchool("");
    setDistrict("Kathmandu");
  };

  return (
    <section className="py-24 px-4 bg-[#FAF9F6] text-slate-800 relative overflow-hidden" id="admission">
      {/* Background glare */}
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-pink-200/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 font-sans">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
            Admissions Hub
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
            Begin Your Academic Journey Today
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
            Fill out our digital query wizard to reserve slots, request syllabus schedules, or schedule individual counseling sessions with Shristi Academy academic registrar office.
          </p>
        </div>

        {/* Wizard Main block */}
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md border border-indigo-100 p-6 md:p-8 rounded-[32px] shadow-2xl shadow-indigo-100/30 relative font-sans">
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form-wizard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-left"
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between pb-4 border-b border-indigo-50/50">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-xs text-indigo-600">
                      0{step}
                    </span>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest font-mono">
                      {step === 1 ? "Student Demographics" : "Academic Grades & Core Studies"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono font-bold">Step {step} of 2</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-550 via-purple-500 to-pink-500 h-full transition-all duration-300"
                    style={{ width: step === 1 ? "50%" : "100%", backgroundColor: "#4f46e5" }}
                  />
                </div>

                {/* STEP 1 FIELDS */}
                {step === 1 ? (
                  <div className="space-y-4 pt-2">
                    
                    {/* Student Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">STUDENT FULL NAME *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          placeholder="e.g. Aayush Sapkota"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full bg-white border border-indigo-100 pl-11 pr-4 py-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Parent Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">GUARDIAN / PARENT FULL NAME *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          placeholder="e.g. Ram Bahadur Sapkota"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="w-full bg-white border border-indigo-100 pl-11 pr-4 py-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mobile Contact */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">MOBILE CONTACT NUMBER *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            required
                            type="tel"
                            placeholder="e.g. 98510XXXXX"
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            className="w-full bg-white border border-indigo-100 pl-11 pr-4 py-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-mono font-bold shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">EMAIL ADDRESS (OPTIONAL)</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            placeholder="aayush@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-indigo-100 pl-11 pr-4 py-3 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-mono font-bold shadow-inner"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleProceedNext}
                        className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-95 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center space-x-2 transition-all shadow-md shadow-indigo-100 hover:translate-y-[-2px]"
                      >
                        <span>Configure school details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ) : (
                  
                  /* STEP 2 FIELDS */
                  <form onSubmit={handleSubmitFinal} className="space-y-4 pt-2">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Grade seeking list */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">STREAM / GRADE SEEKING *</label>
                        <select
                          value={gradeOfInterest}
                          onChange={(e) => setGradeOfInterest(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3.5 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                        >
                          <option value="Montessori Pre-School (Nursery/LKG/UKG)">Montessori Pre-School (Nursery/LKG/UKG)</option>
                          <option value="Primary School (Grade 1 - 5)">Primary School (Class 1 - 5)</option>
                          <option value="Secondary School (Grade 6 - 10)">Secondary School (Class 6 - 10)</option>
                        </select>
                      </div>

                      {/* District of origin */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">DISTRICT OF ORIGIN</label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-white border border-indigo-100 p-3.5 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                        >
                          <option value="Kathmandu">Kathmandu</option>
                          <option value="Bhaktapur">Bhaktapur</option>
                          <option value="Lalitpur">Lalitpur</option>
                          <option value="Chitwan">Chitwan</option>
                          <option value="Kavre">Kavre</option>
                          <option value="Other Districts">Other Districts (Outside Valley)</option>
                        </select>
                      </div>
                    </div>

                    {/* Previous Academic School */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">LAST BOARDED SCHOOL / COLLEGE</label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Sagarmatha School, Kathmandu"
                          value={previousSchool}
                          onChange={(e) => setPreviousSchool(e.target.value)}
                          className="w-full bg-white border border-indigo-100 pl-11 pr-4 py-3 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start space-x-2.5">
                      <ShieldCheck className="w-4.5 h-4.5 text-indigo-550 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-500 leading-normal font-medium">
                        Your data is safe under school policies. It will directly propagate into Principal Vani Pradhan's CMS review dashboard securely.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-3.5 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-mono font-bold cursor-pointer border border-indigo-50"
                      >
                        BACK TO STEP 1
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-mono font-bold rounded-2xl text-xs uppercase cursor-pointer flex items-center space-x-2 transition-all shadow-md shadow-indigo-100"
                      >
                        <FileCheck2 className="w-4 h-4 text-purple-200" />
                        <span>SUBMIT REGISTRATION QUERY</span>
                      </button>
                    </div>

                  </form>
                )}
              </motion.div>
            ) : (
              
              /* CONFIRMATION SUCCESS VIEW */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 text-slate-800"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">Query Successfully Filed!</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto font-semibold">
                    Namaste <strong>{studentName}</strong>, your query regarding <strong>{gradeOfInterest}</strong> has been securely logged into the school admissions directory.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-indigo-100 max-w-md mx-auto text-left space-y-2 font-bold text-slate-500 text-xs shadow-inner">
                  <p className="font-mono text-indigo-600 font-bold text-[10px] uppercase">Next Steps & Information:</p>
                  <p>1. This query has been registered in the live school directory database.</p>
                  <p>2. Our academic staff will audit your previous school listings: <strong className="text-slate-700">{previousSchool || "N/A"}</strong>.</p>
                  <p>3. A counselor will dial your mobile contacts: <strong className="text-slate-700">{mobileNo}</strong> shortly.</p>
                  <p className="text-emerald-700 pt-1 text-[10px]">✓ Prepared for secure verification at: <strong className="text-emerald-800">info@shristiacademy.edu.np</strong></p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href={`mailto:info@shristiacademy.edu.np?subject=${encodeURIComponent(
                      `[Shristi Academy Admission] ${studentName} - ${gradeOfInterest}`
                    )}&body=${encodeURIComponent(
                      `Dear Administrator,\n\nI am submitting an official registration query for Shristi Academy (Mid-Baneshwor, Kathmandu).\n\nDetails:\n- Student: ${studentName}\n- Parent Name: ${parentName}\n- Group/Grade: ${gradeOfInterest}\n- Contact Number: ${mobileNo}\n- Contact Email: ${email || "None"}\n- Previous Institution: ${previousSchool || "N/A"}\n- District: ${district}\n\nPlease help us complete formal verification.\n\nWarm regards,\n${parentName}`
                    )}`}
                    className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer hover:translate-y-[-1.5px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-200" />
                    <span>EMATCH DISPATCH EMAIL</span>
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-5 py-3 bg-white text-slate-600 border border-indigo-150 hover:bg-[#FAF9F6] font-mono font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    SUBMIT ANOTHER QUERY
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
