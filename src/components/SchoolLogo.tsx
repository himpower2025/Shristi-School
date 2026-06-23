import React from "react";
import logoImage from "../assets/images/shristi_logo_1781709321314.jpg";

interface SchoolLogoProps {
  className?: string;
  showText?: boolean;
}

export default function SchoolLogo({ className = "w-10 h-10", showText = false }: SchoolLogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoImage}
        alt="Shristi Academy Logo"
        className="w-full h-full object-contain rounded-full"
        referrerPolicy="no-referrer"
      />
      {showText && (
        <div className="ml-3 text-left">
          <span className="font-display font-black text-lg text-slate-800 tracking-tight leading-none block">
            SHRISTI
          </span>
          <span className="text-[9px] text-[#e05326] font-mono tracking-widest leading-none font-black uppercase mt-1 block">
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
}
