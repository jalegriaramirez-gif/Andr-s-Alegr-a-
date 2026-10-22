import React from 'react';

interface ApprenticeFigureProps {
  stationNumber: number;
  className?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ApprenticeFigure: React.FC<ApprenticeFigureProps> = ({
  stationNumber,
  className = '',
  isCompleted = false,
  isActive = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36'
  }[size];

  // STATION 1: Identidad & ADN SENA - Aprendiz con chaleco institucional portando con orgullo el logosímbolo
  if (stationNumber === 1) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105" aria-label="Figura de Aprendiz SENA - Identidad y Valores">
          <defs>
            <linearGradient id="bgGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39A900" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00324D" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="skinGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5c29b" />
              <stop offset="100%" stopColor="#e5a97d" />
            </linearGradient>
            <linearGradient id="vestGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39A900" />
              <stop offset="100%" stopColor="#257a00" />
            </linearGradient>
          </defs>

          {/* Halo background */}
          <circle cx="80" cy="80" r="72" fill="url(#bgGlow1)" stroke="#39A900" strokeWidth="2" strokeDasharray={isActive ? "4 4" : "none"} className={isActive ? "animate-spin-slow" : ""} />

          {/* Body & Clothes: SENA Vest */}
          <path d="M48 140 C48 108 60 102 80 102 C100 102 112 108 112 140 Z" fill="#00324D" />
          <path d="M52 140 L58 106 C66 103 94 103 102 106 L108 140 Z" fill="url(#vestGrad1)" />
          {/* Vest collar & zipper */}
          <path d="M80 106 L80 140" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
          <polygon points="76,104 84,104 80,112" fill="#ffffff" />
          {/* SENA Logo badge on left chest */}
          <circle cx="68" cy="118" r="5" fill="#ffffff" />
          <circle cx="68" cy="118" r="3.5" fill="#39A900" />

          {/* Neck */}
          <rect x="74" y="86" width="12" height="18" fill="url(#skinGrad1)" rx="4" />

          {/* Head & Face */}
          <ellipse cx="80" cy="68" rx="22" ry="24" fill="url(#skinGrad1)" />
          {/* Hair */}
          <path d="M56 62 C56 42 70 36 84 36 C98 36 104 44 104 56 C96 52 90 52 82 54 C74 56 68 54 56 62 Z" fill="#2d1c14" />
          {/* Eyes & Smile */}
          <circle cx="72" cy="68" r="2.5" fill="#1e293b" />
          <circle cx="88" cy="68" r="2.5" fill="#1e293b" />
          <circle cx="73" cy="67" r="0.8" fill="#ffffff" />
          <circle cx="89" cy="67" r="0.8" fill="#ffffff" />
          <path d="M74 76 Q80 82 86 76" stroke="#c2410c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Cheeks */}
          <circle cx="68" cy="74" r="3" fill="#f43f5e" opacity="0.3" />
          <circle cx="92" cy="74" r="3" fill="#f43f5e" opacity="0.3" />

          {/* Raised Arm with SENA Flag/Banner */}
          <path d="M106 114 Q124 102 130 84" stroke="url(#skinGrad1)" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Flagpole & SENA Flag */}
          <line x1="130" y1="50" x2="130" y2="92" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <rect x="130" y="52" width="22" height="15" fill="#ffffff" stroke="#39A900" strokeWidth="1.5" rx="2" />
          <circle cx="141" cy="59.5" r="3" fill="#39A900" />

          {/* Left Hand Holding Induction Tablet */}
          <rect x="34" y="112" width="20" height="26" rx="3" fill="#0f172a" stroke="#39A900" strokeWidth="1.5" transform="rotate(-15 44 125)" />
          <rect x="36" y="114" width="16" height="20" rx="1.5" fill="#38bdf8" opacity="0.7" transform="rotate(-15 44 125)" />

          {/* Sparkles / Status */}
          {isCompleted ? (
            <circle cx="128" cy="30" r="12" fill="#39A900" stroke="#ffffff" strokeWidth="2">
              <animate attributeName="r" values="11;13;11" dur="2s" repeatCount="indefinite" />
            </circle>
          ) : (
            <circle cx="128" cy="30" r="10" fill="#00324D" stroke="#38bdf8" strokeWidth="1.5" />
          )}
          <text x="128" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">1</text>
        </svg>
      </div>
    );
  }

  // STATION 2: Derechos del Aprendiz - Aprendiz con casco EPP, gafas de protección y levantando la mano en participación
  if (stationNumber === 2) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105" aria-label="Figura de Aprendiz SENA - Derechos y Seguridad EPP">
          <defs>
            <linearGradient id="bgGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#39A900" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>

          {/* Halo background */}
          <circle cx="80" cy="80" r="72" fill="url(#bgGlow2)" stroke="#0284c7" strokeWidth="2" strokeDasharray={isActive ? "4 4" : "none"} className={isActive ? "animate-spin-slow" : ""} />

          {/* Body & Overalls with High-Visibility Stripes */}
          <path d="M48 140 C48 110 60 104 80 104 C100 104 112 110 112 140 Z" fill="#00324D" />
          {/* Reflective safety vest overlay */}
          <path d="M54 140 L60 108 L100 108 L106 140 Z" fill="#facc15" />
          {/* Reflective silver stripes */}
          <line x1="62" y1="124" x2="98" y2="124" stroke="#e2e8f0" strokeWidth="4" />
          <line x1="68" y1="108" x2="68" y2="140" stroke="#e2e8f0" strokeWidth="3" />
          <line x1="92" y1="108" x2="92" y2="140" stroke="#e2e8f0" strokeWidth="3" />

          {/* Neck */}
          <rect x="74" y="88" width="12" height="18" fill="#e5a97d" rx="4" />

          {/* Head */}
          <ellipse cx="80" cy="72" rx="21" ry="22" fill="#f5c29b" />

          {/* Safety Glasses (EPP) */}
          <rect x="62" y="66" width="15" height="10" rx="3" fill="#38bdf8" opacity="0.75" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="83" y="66" width="15" height="10" rx="3" fill="#38bdf8" opacity="0.75" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="77" y1="71" x2="83" y2="71" stroke="#0284c7" strokeWidth="2" />
          {/* Eyes behind glasses */}
          <circle cx="69" cy="71" r="2.5" fill="#0f172a" />
          <circle cx="91" cy="71" r="2.5" fill="#0f172a" />
          {/* Confident Smile */}
          <path d="M74 81 Q80 86 86 81" stroke="#c2410c" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Safety Helmet (Casco Blanco con logo SENA) */}
          <path d="M54 62 C54 38 64 32 80 32 C96 32 106 38 106 62 Z" fill="url(#helmetGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M50 62 L110 62 L106 66 L54 66 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="80" cy="48" r="5" fill="#39A900" />
          <path d="M78 48 L80 45 L82 48" stroke="#ffffff" strokeWidth="1.5" fill="none" />

          {/* Right Arm Raised: Exercising Voice & Rights */}
          <path d="M108 116 Q126 96 132 72" stroke="#f5c29b" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="132" cy="70" r="5" fill="#f5c29b" />
          {/* Due process paper in hand */}
          <rect x="124" y="44" width="16" height="22" rx="2" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" transform="rotate(10 132 55)" />
          <line x1="127" y1="50" x2="137" y2="52" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="127" y1="55" x2="135" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="127" y1="60" x2="136" y2="61" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Number badge */}
          {isCompleted ? (
            <circle cx="128" cy="30" r="12" fill="#39A900" stroke="#ffffff" strokeWidth="2" />
          ) : (
            <circle cx="128" cy="30" r="10" fill="#00324D" stroke="#0284c7" strokeWidth="1.5" />
          )}
          <text x="128" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">2</text>
        </svg>
      </div>
    );
  }

  // STATION 3: Deberes del Aprendiz - Aprendiz puntual portando carné visible en el pecho y mochila
  if (stationNumber === 3) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105" aria-label="Figura de Aprendiz SENA - Deberes y Carné Institucional">
          <defs>
            <linearGradient id="bgGlow3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Halo background */}
          <circle cx="80" cy="80" r="72" fill="url(#bgGlow3)" stroke="#10b981" strokeWidth="2" strokeDasharray={isActive ? "4 4" : "none"} className={isActive ? "animate-spin-slow" : ""} />

          {/* Backpack Straps */}
          <path d="M48 115 L56 140" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M112 115 L104 140" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />

          {/* Body & Polo Shirt */}
          <path d="M48 140 C48 108 60 102 80 102 C100 102 112 108 112 140 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          {/* Green Collar */}
          <path d="M68 102 L80 114 L92 102 Z" fill="#39A900" />

          {/* LANYARD WITH OFFICIAL SENA CARNÉ (Crucial duty!) */}
          <path d="M72 104 L78 122 L82 122 L88 104" stroke="#39A900" strokeWidth="2.5" fill="none" />
          {/* The ID Card */}
          <rect x="73" y="122" width="14" height="18" rx="2" fill="#ffffff" stroke="#00324D" strokeWidth="1.5" />
          <rect x="75" y="124" width="5" height="5" fill="#38bdf8" />
          <line x1="82" y1="125" x2="85" y2="125" stroke="#39A900" strokeWidth="1" />
          <line x1="82" y1="127" x2="85" y2="127" stroke="#64748b" strokeWidth="0.8" />
          <line x1="75" y1="132" x2="85" y2="132" stroke="#64748b" strokeWidth="1" />
          <line x1="75" y1="135" x2="83" y2="135" stroke="#64748b" strokeWidth="1" />

          {/* Neck */}
          <rect x="74" y="86" width="12" height="18" fill="#e5a97d" rx="4" />

          {/* Head & Hair */}
          <ellipse cx="80" cy="68" rx="22" ry="24" fill="#f5c29b" />
          {/* Neat short hair */}
          <path d="M56 60 C56 40 70 34 82 34 C94 34 104 42 104 56 C98 52 86 52 74 54 C66 56 60 56 56 60 Z" fill="#334155" />

          {/* Eyes & Warm smile */}
          <circle cx="72" cy="68" r="2.5" fill="#1e293b" />
          <circle cx="88" cy="68" r="2.5" fill="#1e293b" />
          <path d="M74 76 Q80 82 86 76" stroke="#c2410c" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Left Arm Checking Wristwatch (Puntualidad Duty) */}
          <path d="M50 114 Q38 110 38 98 Q46 94 56 98" stroke="#f5c29b" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Watch */}
          <circle cx="44" cy="99" r="5" fill="#00324D" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="44" y1="99" x2="44" y2="96" stroke="#ffffff" strokeWidth="1" />
          <line x1="44" y1="99" x2="46" y2="99" stroke="#ffffff" strokeWidth="1" />

          {/* Number badge */}
          {isCompleted ? (
            <circle cx="128" cy="30" r="12" fill="#39A900" stroke="#ffffff" strokeWidth="2" />
          ) : (
            <circle cx="128" cy="30" r="10" fill="#00324D" stroke="#10b981" strokeWidth="1.5" />
          )}
          <text x="128" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">3</text>
        </svg>
      </div>
    );
  }

  // STATION 4: Convivencia & Faltas - Aprendiz como mediador de paz, portando el Código de Integridad y Balanza
  if (stationNumber === 4) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105" aria-label="Figura de Aprendiz SENA - Convivencia y Comité de Ética">
          <defs>
            <linearGradient id="bgGlow4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="peaceVest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00324D" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Halo background */}
          <circle cx="80" cy="80" r="72" fill="url(#bgGlow4)" stroke="#f59e0b" strokeWidth="2" strokeDasharray={isActive ? "4 4" : "none"} className={isActive ? "animate-spin-slow" : ""} />

          {/* Body */}
          <path d="M48 140 C48 108 60 102 80 102 C100 102 112 108 112 140 Z" fill="url(#peaceVest)" />

          {/* White mediation dove / emblem on shirt */}
          <path d="M80 114 C75 110 70 115 76 122 C79 125 80 128 80 128 C80 128 81 125 84 122 C90 115 85 110 80 114 Z" fill="#ffffff" />

          {/* Neck */}
          <rect x="74" y="86" width="12" height="18" fill="#d97706" opacity="0.3" rx="4" />
          <rect x="74" y="86" width="12" height="18" fill="#f5c29b" rx="4" />

          {/* Head with curly hair */}
          <ellipse cx="80" cy="68" rx="22" ry="24" fill="#e5a97d" />
          <path d="M54 58 C52 42 66 32 80 32 C96 32 108 42 106 58 C100 52 92 50 80 50 C68 50 60 54 54 58 Z" fill="#18181b" />
          <circle cx="56" cy="48" r="6" fill="#18181b" />
          <circle cx="68" cy="38" r="7" fill="#18181b" />
          <circle cx="84" cy="36" r="7" fill="#18181b" />
          <circle cx="98" cy="44" r="6" fill="#18181b" />

          {/* Eyes & Friendly Empathetic Smile */}
          <circle cx="72" cy="68" r="2.5" fill="#1e293b" />
          <circle cx="88" cy="68" r="2.5" fill="#1e293b" />
          <path d="M75 77 Q80 83 85 77" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Left Hand: Open hand of mediation and respectful dialogue */}
          <path d="M50 114 Q32 106 28 92" stroke="#e5a97d" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="90" r="5" fill="#e5a97d" />

          {/* Right Hand Holding the Balance of Justice & Code of Integrity */}
          <path d="M110 114 Q128 106 132 96" stroke="#e5a97d" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Scales of Justice */}
          <line x1="126" y1="80" x2="142" y2="80" stroke="#f59e0b" strokeWidth="2" />
          <line x1="134" y1="76" x2="134" y2="94" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="126,82 122,90 130,90" fill="#f59e0b" opacity="0.8" />
          <polygon points="142,82 138,90 146,90" fill="#f59e0b" opacity="0.8" />

          {/* Number badge */}
          {isCompleted ? (
            <circle cx="128" cy="30" r="12" fill="#39A900" stroke="#ffffff" strokeWidth="2" />
          ) : (
            <circle cx="128" cy="30" r="10" fill="#00324D" stroke="#f59e0b" strokeWidth="1.5" />
          )}
          <text x="128" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">4</text>
        </svg>
      </div>
    );
  }

  // STATION 5: Etapa Productiva & Graduación - Aprendiz con portafolio/laptop, listo para la empresa y certificación
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105" aria-label="Figura de Aprendiz SENA - Etapa Productiva y Empleo">
        <defs>
          <linearGradient id="bgGlow5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#39A900" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Halo background */}
        <circle cx="80" cy="80" r="72" fill="url(#bgGlow5)" stroke="#8b5cf6" strokeWidth="2" strokeDasharray={isActive ? "4 4" : "none"} className={isActive ? "animate-spin-slow" : ""} />

        {/* Body: Business Casual / Technical Professional */}
        <path d="M48 140 C48 108 60 102 80 102 C100 102 112 108 112 140 Z" fill="url(#suitGrad)" />
        {/* Shirt & Tie/Scarf */}
        <polygon points="74,102 86,102 80,118" fill="#ffffff" />
        <polygon points="78,106 82,106 83,124 80,128 77,124" fill="#39A900" />

        {/* Neck */}
        <rect x="74" y="86" width="12" height="18" fill="#f5c29b" rx="4" />

        {/* Head */}
        <ellipse cx="80" cy="68" rx="22" ry="24" fill="#f5c29b" />
        {/* Sleek styled hair */}
        <path d="M56 60 C56 40 70 34 84 34 C98 34 104 42 104 56 C96 50 88 50 78 52 C68 54 62 56 56 60 Z" fill="#451a03" />

        {/* Eyes & Triumphant Smile */}
        <circle cx="72" cy="68" r="2.5" fill="#1e293b" />
        <circle cx="88" cy="68" r="2.5" fill="#1e293b" />
        <circle cx="73" cy="67" r="0.8" fill="#ffffff" />
        <circle cx="89" cy="67" r="0.8" fill="#ffffff" />
        <path d="M74 76 Q80 83 86 76" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Right Arm: Holding Productive Stage Portfolio / Laptop Case */}
        <rect x="114" y="106" width="26" height="20" rx="3" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="122" y1="106" x2="132" y2="106" stroke="#f59e0b" strokeWidth="2" />
        <path d="M106 114 Q116 110 120 114" stroke="#f5c29b" strokeWidth="7" strokeLinecap="round" fill="none" />

        {/* Left Arm: Thumbs up / Graduation Scroll */}
        <path d="M50 114 Q36 96 32 82" stroke="#f5c29b" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Certificate Scroll with Green Ribbon */}
        <rect x="22" y="72" width="20" height="9" rx="2" fill="#ffffff" stroke="#00324D" strokeWidth="1" transform="rotate(-20 32 76)" />
        <line x1="28" y1="74" x2="28" y2="82" stroke="#39A900" strokeWidth="2.5" transform="rotate(-20 32 76)" />

        {/* Golden Star for Certification readiness */}
        <polygon points="128,42 131,48 138,49 133,54 134,60 128,57 122,60 123,54 118,49 125,48" fill="#facc15" stroke="#eab308" strokeWidth="1">
          <animate attributeName="transform" type="rotate" from="0 128 51" to="360 128 51" dur="10s" repeatCount="indefinite" />
        </polygon>

        {/* Number badge */}
        {isCompleted ? (
          <circle cx="128" cy="30" r="12" fill="#39A900" stroke="#ffffff" strokeWidth="2" />
        ) : (
          <circle cx="128" cy="30" r="10" fill="#00324D" stroke="#8b5cf6" strokeWidth="1.5" />
        )}
        <text x="128" y="34" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">5</text>
      </svg>
    </div>
  );
};
