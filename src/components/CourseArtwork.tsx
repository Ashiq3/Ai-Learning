import type { ClassId } from '../types/course';

/**
 * Bespoke crisp SVG architectural cover illustrations for the Hero Course Preview
 * and Featured Live Course Cards. Always render cleanly at retina sharpness in
 * both Light and Matte Black themes without external image dependencies.
 */
export function HeroCoursePreviewArt() {
  return (
    <div
      aria-label="AI Backend Master Course architecture preview diagram"
      className="relative aspect-[16/9] w-full overflow-hidden bg-[#0C101A]"
    >
      {/* Subtle architectural dot & coordinate grid */}
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        role="img"
        aria-label="4-layer AI Backend architecture flow from Browser Client to API Gateway, Backend Engine, and Database plus AI Model"
      >
        <defs>
          <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          </pattern>
          <radialGradient id="hero-glow-blue" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0C101A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-glow-emerald" cx="82%" cy="74%" r="40%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0C101A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        <rect width="640" height="360" fill="#0C101A" />
        <rect width="640" height="360" fill="url(#hero-grid)" />
        <rect width="640" height="360" fill="url(#hero-glow-blue)" />
        <rect width="640" height="360" fill="url(#hero-glow-emerald)" />

        {/* Subtle connecting request / response data pipelines */}
        <path
          d="M 184 152 C 218 152, 224 152, 256 152"
          stroke="url(#line-grad)"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <path
          d="M 384 152 C 414 152, 420 112, 456 112"
          stroke="#60A5FA"
          strokeWidth="1.75"
          strokeOpacity="0.85"
          strokeDasharray="5 5"
        />
        <path
          d="M 384 152 C 414 152, 420 202, 456 202"
          stroke="#34D399"
          strokeWidth="1.75"
          strokeOpacity="0.85"
          strokeDasharray="5 5"
        />

        {/* Layer 1: Client Browser Card */}
        <g transform="translate(36, 98)">
          <rect
            width="148"
            height="112"
            rx="12"
            fill="#131926"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="1.2"
          />
          <rect width="148" height="24" rx="12" fill="#192133" />
          <rect y="14" width="148" height="10" fill="#192133" />
          <circle cx="14" cy="12" r="2.8" fill="#475569" />
          <circle cx="24" cy="12" r="2.8" fill="#475569" />
          <circle cx="34" cy="12" r="2.8" fill="#475569" />
          <rect x="48" y="8" width="84" height="8" rx="4" fill="#0F1522" />
          {/* UI Wireframe inside browser */}
          <rect x="14" y="38" width="76" height="9" rx="4" fill="#E2E8F0" fillOpacity="0.88" />
          <rect x="14" y="54" width="118" height="6" rx="3" fill="#64748B" fillOpacity="0.55" />
          <rect x="14" y="66" width="96" height="6" rx="3" fill="#64748B" fillOpacity="0.4" />
          <rect x="14" y="82" width="60" height="16" rx="5" fill="#2563EB" />
          <text
            x="24"
            y="93"
            fill="#FFFFFF"
            fontSize="8.5"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            POST /ask
          </text>
          <text
            x="0"
            y="130"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            01 · Frontend UI
          </text>
        </g>

        {/* Layer 2: Backend Server / API Engine (Focal Center) */}
        <g transform="translate(256, 82)">
          <rect
            width="128"
            height="144"
            rx="14"
            fill="#141C2E"
            stroke="#3B82F6"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          <rect x="14" y="16" width="100" height="22" rx="6" fill="rgba(37,99,235,0.18)" />
          <text
            x="24"
            y="30"
            fill="#93C5FD"
            fontSize="9.5"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            BACKEND API
          </text>
          {/* 4 Job Rows */}
          <g transform="translate(14, 48)">
            <rect width="100" height="17" rx="4" fill="#1B253B" />
            <circle cx="10" cy="8.5" r="2.5" fill="#60A5FA" />
            <text x="19" y="11.5" fill="#E2E8F0" fontSize="8.5" fontFamily="DM Sans, sans-serif">
              Bouncer · Auth
            </text>
          </g>
          <g transform="translate(14, 70)">
            <rect width="100" height="17" rx="4" fill="#1B253B" />
            <circle cx="10" cy="8.5" r="2.5" fill="#34D399" />
            <text x="19" y="11.5" fill="#E2E8F0" fontSize="8.5" fontFamily="DM Sans, sans-serif">
              Referee · Rules
            </text>
          </g>
          <g transform="translate(14, 92)">
            <rect width="100" height="17" rx="4" fill="#1B253B" />
            <circle cx="10" cy="8.5" r="2.5" fill="#FBBF24" />
            <text x="19" y="11.5" fill="#E2E8F0" fontSize="8.5" fontFamily="DM Sans, sans-serif">
              Vault · .env Keys
            </text>
          </g>
          <g transform="translate(14, 114)">
            <rect width="100" height="17" rx="4" fill="#1B253B" />
            <circle cx="10" cy="8.5" r="2.5" fill="#A78BFA" />
            <text x="19" y="11.5" fill="#E2E8F0" fontSize="8.5" fontFamily="DM Sans, sans-serif">
              Engine · 24/7 Cloud
            </text>
          </g>
          <text
            x="0"
            y="162"
            fill="#E2E8F0"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            02 · Cloud Backend
          </text>
        </g>

        {/* Layer 3A: AI Model / Token Engine */}
        <g transform="translate(456, 68)">
          <rect
            width="148"
            height="82"
            rx="12"
            fill="#131926"
            stroke="rgba(96,165,250,0.35)"
            strokeWidth="1.2"
          />
          <text
            x="14"
            y="24"
            fill="#93C5FD"
            fontSize="9"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            LLM · TOKENS
          </text>
          {/* Token pieces */}
          <rect x="14" y="34" width="32" height="16" rx="4" fill="rgba(59,130,246,0.24)" />
          <rect x="50" y="34" width="42" height="16" rx="4" fill="rgba(16,185,129,0.24)" />
          <rect x="96" y="34" width="36" height="16" rx="4" fill="rgba(251,191,36,0.22)" />
          <rect x="14" y="56" width="118" height="8" rx="4" fill="#1E293B" />
          <rect x="14" y="56" width="84" height="8" rx="4" fill="#3B82F6" />
        </g>

        {/* Layer 3B: Persistent Database */}
        <g transform="translate(456, 166)">
          <rect
            width="148"
            height="82"
            rx="12"
            fill="#131926"
            stroke="rgba(52,211,153,0.32)"
            strokeWidth="1.2"
          />
          <text
            x="14"
            y="24"
            fill="#6EE7B7"
            fontSize="9"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="600"
          >
            POSTGRESQL · DB
          </text>
          <rect x="14" y="35" width="120" height="11" rx="3" fill="#1C2537" />
          <rect x="14" y="50" width="120" height="11" rx="3" fill="#1C2537" />
          <rect x="20" y="39" width="44" height="3" rx="1.5" fill="#34D399" />
          <rect x="74" y="39" width="46" height="3" rx="1.5" fill="#64748B" />
          <rect x="20" y="54" width="56" height="3" rx="1.5" fill="#60A5FA" />
          <rect x="86" y="54" width="34" height="3" rx="1.5" fill="#64748B" />
          <text
            x="0"
            y="99"
            fill="#94A3B8"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
            fontWeight="600"
          >
            03 · AI &amp; Memory Layer
          </text>
        </g>

        {/* Bottom Subtle Status Bar inside Diagram */}
        <line x1="36" y1="308" x2="604" y2="308" stroke="rgba(148,163,184,0.14)" strokeWidth="1" />
        <text
          x="36"
          y="330"
          fill="#94A3B8"
          fontSize="10.5"
          fontFamily="IBM Plex Mono, monospace"
        >
          HTTPS 200 OK · JSON · PostgreSQL · Vector RAG · Production Agents
        </text>
      </svg>
    </div>
  );
}

export function ModuleCoverArt({ classId }: { classId: ClassId }) {
  if (classId === 1) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0D1321]">
        <svg
          viewBox="0 0 480 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          role="img"
          aria-label="Class 01 illustration: Browser frontend connecting via DNS to 24/7 Cloud Servers"
        >
          <defs>
            <pattern id="m1-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            </pattern>
            <radialGradient id="m1-glow" cx="68%" cy="42%" r="58%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#0D1321" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="480" height="270" fill="#0D1321" />
          <rect width="480" height="270" fill="url(#m1-grid)" />
          <rect width="480" height="270" fill="url(#m1-glow)" />

          {/* Connection Arc */}
          <path
            d="M 190 135 C 228 96, 256 96, 294 135"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M 294 152 C 256 188, 228 188, 190 152"
            stroke="#34D399"
            strokeWidth="1.75"
            strokeOpacity="0.8"
          />
          <rect x="214" y="88" width="56" height="20" rx="6" fill="#172554" stroke="#3B82F6" strokeOpacity="0.6" />
          <text x="225" y="101" fill="#BFDBFE" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
            DNS/IP
          </text>

          {/* Left: Browser Window */}
          <g transform="translate(38, 72)">
            <rect width="152" height="124" rx="10" fill="#141C2E" stroke="rgba(148,163,184,0.24)" strokeWidth="1.2" />
            <rect width="152" height="24" rx="10" fill="#1C263D" />
            <rect y="14" width="152" height="10" fill="#1C263D" />
            <circle cx="14" cy="12" r="2.5" fill="#64748B" />
            <circle cx="23" cy="12" r="2.5" fill="#64748B" />
            <circle cx="32" cy="12" r="2.5" fill="#64748B" />
            <rect x="14" y="38" width="84" height="9" rx="4" fill="#E2E8F0" fillOpacity="0.85" />
            <rect x="14" y="54" width="122" height="7" rx="3.5" fill="#64748B" fillOpacity="0.5" />
            <rect x="14" y="68" width="98" height="7" rx="3.5" fill="#64748B" fillOpacity="0.35" />
            <rect x="14" y="88" width="54" height="20" rx="5" fill="#2563EB" />
            <rect x="74" y="88" width="62" height="20" rx="5" fill="#1E293B" />
          </g>

          {/* Right: 24/7 Cloud Server Stack */}
          <g transform="translate(294, 62)">
            <rect width="148" height="42" rx="8" fill="#141C2E" stroke="#3B82F6" strokeOpacity="0.55" strokeWidth="1.2" />
            <circle cx="18" cy="21" r="4" fill="#34D399" />
            <rect x="32" y="15" width="64" height="5" rx="2.5" fill="#E2E8F0" fillOpacity="0.85" />
            <rect x="32" y="24" width="44" height="4" rx="2" fill="#64748B" />

            <rect y="52" width="148" height="42" rx="8" fill="#141C2E" stroke="rgba(148,163,184,0.24)" strokeWidth="1.2" />
            <circle cx="18" cy="73" r="4" fill="#60A5FA" />
            <rect x="32" y="67" width="76" height="5" rx="2.5" fill="#CBD5E1" fillOpacity="0.7" />
            <rect x="32" y="76" width="52" height="4" rx="2" fill="#64748B" />

            <rect y="104" width="148" height="42" rx="8" fill="#141C2E" stroke="rgba(148,163,184,0.2)" strokeWidth="1.2" />
            <circle cx="18" cy="125" r="4" fill="#60A5FA" />
            <rect x="32" y="119" width="60" height="5" rx="2.5" fill="#CBD5E1" fillOpacity="0.55" />
            <rect x="32" y="128" width="84" height="4" rx="2" fill="#475569" />
          </g>
        </svg>
      </div>
    );
  }

  if (classId === 2) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B1418]">
        <svg
          viewBox="0 0 480 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          role="img"
          aria-label="Class 02 illustration: REST API methods, JSON envelope, .env API key vault, and 200 OK status code"
        >
          <defs>
            <pattern id="m2-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            </pattern>
            <radialGradient id="m2-glow" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0B1418" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="480" height="270" fill="#0B1418" />
          <rect width="480" height="270" fill="url(#m2-grid)" />
          <rect width="480" height="270" fill="url(#m2-glow)" />

          {/* JSON Envelope Card */}
          <g transform="translate(38, 48)">
            <rect width="234" height="174" rx="12" fill="#111C24" stroke="rgba(52,211,153,0.34)" strokeWidth="1.2" />
            <rect x="16" y="16" width="52" height="20" rx="5" fill="#065F46" />
            <text x="27" y="29.5" fill="#A7F3D0" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="700">
              POST
            </text>
            <text x="78" y="29.5" fill="#CBD5E1" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              /v1/chat/reply
            </text>
            <line x1="16" y1="48" x2="218" y2="48" stroke="rgba(148,163,184,0.16)" />
            <text x="18" y="72" fill="#94A3B8" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              {'{'}
            </text>
            <text x="32" y="94" fill="#60A5FA" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              &quot;model&quot;: <tspan fill="#A7F3D0">&quot;ai-fast&quot;</tspan>,
            </text>
            <text x="32" y="116" fill="#60A5FA" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              &quot;prompt&quot;: <tspan fill="#FDE68A">&quot;Explain APIs&quot;</tspan>,
            </text>
            <text x="32" y="138" fill="#60A5FA" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              &quot;status&quot;: <tspan fill="#34D399">200</tspan>
            </text>
            <text x="18" y="158" fill="#94A3B8" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">
              {'}'}
            </text>
          </g>

          {/* Right Stacked Cards: .env Vault & Status Codes */}
          <g transform="translate(298, 56)">
            <rect width="144" height="72" rx="10" fill="#111C24" stroke="rgba(251,191,36,0.35)" strokeWidth="1.2" />
            <text x="16" y="26" fill="#FCD34D" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              .env VAULT
            </text>
            <rect x="16" y="38" width="112" height="18" rx="4" fill="#192732" />
            <text x="24" y="50" fill="#CBD5E1" fontSize="9" fontFamily="IBM Plex Mono, monospace">
              API_KEY=••••••••
            </text>

            <rect y="88" width="144" height="72" rx="10" fill="#111C24" stroke="rgba(96,165,250,0.32)" strokeWidth="1.2" />
            <text x="16" y="114" fill="#93C5FD" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              HTTP STATUS
            </text>
            <rect x="16" y="126" width="34" height="18" rx="4" fill="rgba(16,185,129,0.2)" />
            <text x="23" y="138" fill="#34D399" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              200
            </text>
            <rect x="55" y="126" width="34" height="18" rx="4" fill="rgba(251,191,36,0.2)" />
            <text x="62" y="138" fill="#FBBF24" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              401
            </text>
            <rect x="94" y="126" width="34" height="18" rx="4" fill="rgba(248,113,113,0.2)" />
            <text x="101" y="138" fill="#F87171" fontSize="9" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
              429
            </text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#11101C]">
      <svg
        viewBox="0 0 480 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
        role="img"
        aria-label="Class 03 illustration: FastAPI and Express backend connected to PostgreSQL database and AI token context window"
      >
        <defs>
          <pattern id="m3-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          </pattern>
          <radialGradient id="m3-glow" cx="62%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#11101C" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="480" height="270" fill="#11101C" />
        <rect width="480" height="270" fill="url(#m3-grid)" />
        <rect width="480" height="270" fill="url(#m3-glow)" />

        {/* Left: Database Cylinder / Rows */}
        <g transform="translate(38, 54)">
          <rect width="176" height="162" rx="12" fill="#181728" stroke="rgba(129,140,248,0.38)" strokeWidth="1.2" />
          <text x="16" y="28" fill="#A5B4FC" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
            DATABASE · CRUD
          </text>
          <g transform="translate(16, 44)">
            <rect width="144" height="26" rx="6" fill="#222138" />
            <text x="10" y="16.5" fill="#E2E8F0" fontSize="9" fontFamily="IBM Plex Mono, monospace">
              users_table
            </text>
            <text x="102" y="16.5" fill="#34D399" fontSize="8.5" fontFamily="IBM Plex Mono, monospace">
              SAVED
            </text>
          </g>
          <g transform="translate(16, 78)">
            <rect width="144" height="26" rx="6" fill="#222138" />
            <text x="10" y="16.5" fill="#E2E8F0" fontSize="9" fontFamily="IBM Plex Mono, monospace">
              chat_memory
            </text>
            <text x="102" y="16.5" fill="#60A5FA" fontSize="8.5" fontFamily="IBM Plex Mono, monospace">
              INDEX
            </text>
          </g>
          <g transform="translate(16, 112)">
            <rect width="144" height="26" rx="6" fill="#222138" />
            <text x="10" y="16.5" fill="#E2E8F0" fontSize="9" fontFamily="IBM Plex Mono, monospace">
              exam_scores
            </text>
            <text x="102" y="16.5" fill="#FBBF24" fontSize="8.5" fontFamily="IBM Plex Mono, monospace">
              SYNC
            </text>
          </g>
        </g>

        {/* Right: AI Tokenizer & Context Window */}
        <g transform="translate(238, 54)">
          <rect width="204" height="162" rx="12" fill="#181728" stroke="rgba(251,191,36,0.34)" strokeWidth="1.2" />
          <text x="16" y="28" fill="#FCD34D" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
            AI TOKENS &amp; CONTEXT
          </text>
          {/* Token Chips */}
          <rect x="16" y="44" width="46" height="22" rx="5" fill="rgba(59,130,246,0.24)" />
          <text x="24" y="58.5" fill="#BFDBFE" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            Back
          </text>
          <rect x="68" y="44" width="40" height="22" rx="5" fill="rgba(16,185,129,0.24)" />
          <text x="77" y="58.5" fill="#A7F3D0" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            end
          </text>
          <rect x="114" y="44" width="72" height="22" rx="5" fill="rgba(168,85,247,0.24)" />
          <text x="122" y="58.5" fill="#E9D5FF" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            FastAPI
          </text>

          <rect x="16" y="74" width="54" height="22" rx="5" fill="rgba(251,191,36,0.22)" />
          <text x="24" y="88.5" fill="#FDE68A" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            Token
          </text>
          <rect x="76" y="74" width="60" height="22" rx="5" fill="rgba(59,130,246,0.22)" />
          <text x="84" y="88.5" fill="#BFDBFE" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            Window
          </text>

          {/* Context Meter */}
          <text x="16" y="122" fill="#94A3B8" fontSize="9" fontFamily="IBM Plex Mono, monospace">
            CONTEXT BUCKET · 68%
          </text>
          <rect x="16" y="132" width="172" height="10" rx="5" fill="#25243D" />
          <rect x="16" y="132" width="118" height="10" rx="5" fill="#6366F1" />
        </g>
      </svg>
    </div>
  );
}
