import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  KeyRound,
  Laptop,
  Lock,
  Play,
  Plus,
  Scale,
  Send,
  Server,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  computeContextWindowUsage,
  computeServerLoad,
  simulateBackendJobTest,
  simulatePostmanCall,
  tokenizeText,
  validateJsonPayload,
  type BackendJobId,
} from '../../utils/courseLogic';

/* ---------- 1. CLASS 1: FRONTEND X-RAY LAB ---------- */
export function FrontendXrayLab() {
  const [cssOn, setCssOn] = useState(true);
  const [jsOn, setJsOn] = useState(true);
  const [selectedPart, setSelectedPart] = useState<'header' | 'bubble' | 'input'>('input');
  const [clickedNote, setClickedNote] = useState(false);

  const info = {
    header: {
      title: 'Top Bar (HTML Skeleton + CSS Layout)',
      desc: 'Draws the logo and model picker. Purely visual inside the user’s browser — zero AI thinking happens here.',
    },
    bubble: {
      title: 'Message Bubble (HTML Text + CSS Colors)',
      desc: 'Formats the server’s reply cleanly with padding, contrast, and rounded corners.',
    },
    input: {
      title: 'Prompt Box & Send Button (JavaScript Event)',
      desc: 'JavaScript listens for your click, grabs the typed text, and hands it off toward the Backend Server.',
    },
  }[selectedPart];

  return (
    <div className="grid w-full max-w-[1000px] grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Live Mock Browser Screen */}
      <div className="lg:col-span-7 space-y-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCssOn((v) => !v)}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
              cssOn
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-amber-300 bg-amber-50 text-amber-900'
            }`}
          >
            CSS Styling: {cssOn ? 'ON' : 'OFF (Raw HTML)'}
          </button>
          <button
            type="button"
            onClick={() => {
              setJsOn((v) => !v);
              setClickedNote(false);
            }}
            className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
              jsOn
                ? 'border-blue-300 bg-[#EFF6FF] text-[#1D4ED8]'
                : 'border-red-300 bg-red-50 text-red-800'
            }`}
          >
            JavaScript Clicks: {jsOn ? 'ON' : 'OFF (Frozen)'}
          </button>
        </div>

        <div
          data-preserve-light={!cssOn ? 'true' : undefined}
          className={
            cssOn
              ? 'rounded-xl border border-slate-200 bg-white p-5 text-slate-900 space-y-3 shadow-[0_2px_10px_rgba(15,23,42,0.05)]'
              : 'border-2 border-dashed border-slate-400 bg-white p-4 text-black font-serif space-y-2'
          }
        >
          <button
            type="button"
            onClick={() => setSelectedPart('header')}
            className={`w-full text-left transition-all ${
              cssOn
                ? `flex items-center justify-between rounded-lg px-4 py-2.5 border text-sm font-semibold ${
                    selectedPart === 'header'
                      ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1E40AF]'
                      : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`
                : 'underline font-bold'
            }`}
          >
            <span>AI Tutor App</span>
            <span className="font-mono text-[11px] font-normal text-slate-500">
              Click to inspect header
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPart('bubble')}
            className={`w-full text-left transition-all ${
              cssOn
                ? `rounded-lg px-4 py-3 text-[13.5px] border ${
                    selectedPart === 'bubble'
                      ? 'border-[#1D4ED8] bg-[#EFF6FF] text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`
                : 'block border border-black p-1 text-xs'
            }`}
          >
            <strong>AI Reply:</strong> Toggle CSS off above to inspect the unstyled HTML skeleton.
          </button>

          <div
            onClick={() => setSelectedPart('input')}
            className={
              cssOn
                ? `flex items-center gap-2 rounded-lg p-2 border cursor-pointer ${
                    selectedPart === 'input'
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                      : 'border-slate-200 bg-slate-50/70'
                  }`
                : 'flex gap-2 pt-2'
            }
          >
            <div className="flex-1 px-2 text-xs text-slate-500">Type a prompt here…</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPart('input');
                setClickedNote(true);
              }}
              className={
                cssOn
                  ? 'rounded-md bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1E40AF]'
                  : 'border border-black px-2 py-0.5 text-xs bg-gray-200'
              }
            >
              Send
            </button>
          </div>

          {clickedNote && (
            <p
              className={`text-xs font-semibold ${
                jsOn ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {jsOn
                ? '✓ JavaScript fired: captured click and prepared a Backend request.'
                : '✗ JavaScript is OFF: clicking Send does nothing.'}
            </p>
          )}
        </div>
      </div>

      {/* Right X-Ray Explanation */}
      <div className="lg:col-span-5 flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <span className="text-xs font-semibold text-[#1D4ED8]">Frontend X-Ray Inspector</span>
        <h3 className="font-display text-lg font-bold text-slate-900">{info.title}</h3>
        <p className="text-[14.5px] leading-[1.6] text-slate-600">{info.desc}</p>
        <ul className="border-t border-slate-100 pt-3.5 font-mono text-xs text-slate-600 space-y-1.5">
          <li>• HTML = Structure (Text &amp; Buttons)</li>
          <li>• CSS = Styling (Colors &amp; Spacing)</li>
          <li>• JS = Behavior (Clicks &amp; Events)</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- 1B. CLASS 1 SLIDE 15: INTERACTIVE 4 BACKEND JOBS LIVE TEST LAB ---------- */
const BACKEND_JOB_CARDS: {
  id: BackendJobId;
  badge: string;
  title: string;
  subtitle: string;
  points: string[];
}[] = [
  {
    id: 'bouncer',
    badge: 'Job 01 · Bouncer',
    title: 'Check Identity',
    subtitle: 'Who is asking?',
    points: [
      'Verifies login email & account session',
      'Checks Free tier vs Pro tier access',
      'Blocks strangers from private chats',
    ],
  },
  {
    id: 'referee',
    badge: 'Job 02 · Referee',
    title: 'Enforce Real Rules',
    subtitle: 'Is this allowed?',
    points: [
      'Calculates real checkout prices & discounts',
      'Stops spam bots sending rapid clicks',
      'Rejects tampered browser values',
    ],
  },
  {
    id: 'vault',
    badge: 'Job 03 · Vault',
    title: 'Guard Secrets & Data',
    subtitle: 'Keep private things private',
    points: [
      'Hides paid OpenAI / Gemini secret keys',
      'Reads & saves user history securely',
      'Never exposes secrets to F12 Inspect',
    ],
  },
  {
    id: 'engine',
    badge: 'Job 04 · Engine',
    title: 'Do Heavy Work',
    subtitle: 'Run AI & process files',
    points: [
      'Sends prompts to AI models cleanly',
      'Processes PDFs, audio, or images remotely',
      'Returns a tiny clean reply to screen',
    ],
  },
];

export function BackendJobsLab() {
  const [activeJob, setActiveJob] = useState<BackendJobId>('bouncer');
  const [bouncerRole, setBouncerRole] = useState<'stranger' | 'free' | 'pro'>('stranger');
  const [tamperedPrice, setTamperedPrice] = useState(1);
  const [vaultLocation, setVaultLocation] = useState<'frontend' | 'backend'>('frontend');
  const [engineTask, setEngineTask] = useState<'pdf' | 'notes' | 'audio'>('pdf');
  const [runCounter, setRunCounter] = useState(0);

  const result = simulateBackendJobTest({
    job: activeJob,
    bouncerRole,
    tamperedPriceBdt: tamperedPrice,
    officialPriceBdt: 380,
    vaultLocation,
    engineTask,
  });

  const verdictBannerStyle =
    result.tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
      : result.tone === 'amber'
        ? 'border-amber-200 bg-amber-50/70 text-amber-950'
        : 'border-red-200 bg-red-50/70 text-red-950';

  const verdictTitleColor =
    result.tone === 'emerald'
      ? 'text-emerald-800'
      : result.tone === 'amber'
        ? 'text-amber-800'
        : 'text-red-800';

  return (
    <div className="w-full max-w-[1060px] space-y-5">
      {/* Top Row: 4 Interactive Backend Job Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {BACKEND_JOB_CARDS.map((card) => {
          const isSelected = card.id === activeJob;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveJob(card.id)}
              aria-pressed={isSelected}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-[#1D4ED8] bg-[#EFF6FF] ring-1 ring-[#1D4ED8]/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span className={isSelected ? 'text-[#1D4ED8]' : 'text-slate-500'}>
                    {card.badge}
                  </span>
                  {card.id === 'bouncer' && <ShieldCheck className="h-3.5 w-3.5 text-[#1D4ED8]" aria-hidden="true" />}
                  {card.id === 'referee' && <Scale className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />}
                  {card.id === 'vault' && <Lock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />}
                  {card.id === 'engine' && <Cpu className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />}
                </div>
                <h3 className="font-display text-[15.5px] font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500">{card.subtitle}</p>
              </div>
              <ul className="mt-3 space-y-1 border-t border-slate-100 pt-2.5 text-[12px] leading-snug text-slate-600">
                {card.points.map((pt) => (
                  <li key={pt}>• {pt}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Interactive Live Test Bench + Real-World Browser Test Guide */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Run Live Test Controls */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-[#1D4ED8]">
              Live Test Simulator · Test Job #{BACKEND_JOB_CARDS.findIndex((c) => c.id === activeJob) + 1}
            </span>
            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
              {runCounter > 0 ? `Test #${runCounter} executed` : 'Interactive'}
            </span>
          </div>

          {activeJob === 'bouncer' && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-slate-600">
                Pick who is trying to open Nadia’s private chat history, then run the Bouncer test:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['stranger', 'Stranger (Logged Out)'],
                    ['free', 'Free User'],
                    ['pro', 'Pro User'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setBouncerRole(val);
                      setRunCounter((c) => c + 1);
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      bouncerRole === val
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeJob === 'referee' && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-slate-600">
                Pretend you opened Chrome DevTools and edited a <strong>৳380 Kacchi</strong> price on your screen. Enter any hacked price and test checkout:
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <label htmlFor="referee-price" className="text-xs font-semibold text-slate-700">
                  Tampered Browser Price (৳):
                </label>
                <input
                  id="referee-price"
                  type="number"
                  min={0}
                  max={5000}
                  value={tamperedPrice}
                  onChange={(e) => {
                    setTamperedPrice(Number(e.target.value));
                    setRunCounter((c) => c + 1);
                  }}
                  className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm font-semibold text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTamperedPrice(1);
                    setRunCounter((c) => c + 1);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
                >
                  Hack to ৳1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTamperedPrice(380);
                    setRunCounter((c) => c + 1);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
                >
                  Honest ৳380
                </button>
              </div>
            </div>
          )}

          {activeJob === 'vault' && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-slate-600">
                Choose where to put your paid AI secret key, then run a stranger’s <strong>F12 Inspect Scan</strong>:
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setVaultLocation('frontend');
                    setRunCounter((c) => c + 1);
                  }}
                  className={`rounded-lg border p-3 text-left text-xs font-semibold transition-colors ${
                    vaultLocation === 'frontend'
                      ? 'border-red-300 bg-red-50 text-red-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Store in Frontend Browser (Unsafe)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVaultLocation('backend');
                    setRunCounter((c) => c + 1);
                  }}
                  className={`rounded-lg border p-3 text-left text-xs font-semibold transition-colors ${
                    vaultLocation === 'backend'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Lock Inside Backend Vault (Safe)
                </button>
              </div>
            </div>
          )}

          {activeJob === 'engine' && (
            <div className="space-y-3">
              <p className="text-[13.5px] text-slate-600">
                Pick a heavy task and watch how your phone offloads the heavy lifting to the Backend Engine:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['pdf', '50-Page PDF'],
                    ['notes', 'Study Quiz AI'],
                    ['audio', 'Bangla Voice'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setEngineTask(val);
                      setRunCounter((c) => c + 1);
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      engineTask === val
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-[#0F172A] p-3.5 font-mono text-xs leading-relaxed text-slate-100">
            <span className="block text-[10px] text-blue-300 mb-1">SENT FROM BROWSER</span>
            {result.frontendSent}
          </div>

          <button
            type="button"
            onClick={() => setRunCounter((c) => c + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Run Live Backend Test
          </button>
        </div>

        {/* Right: Live Backend Verdict + Real-World Chrome Test Guide */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className={`rounded-lg border p-4 space-y-2 ${verdictBannerStyle}`}>
            <div className={`flex items-center gap-2 text-sm font-semibold ${verdictTitleColor}`}>
              {result.allowed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{result.verdictTitle}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-slate-700">
              {result.backendDecided}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-1.5">
            <span className="block text-xs font-semibold text-slate-900">
              How to test this for real in Chrome right now
            </span>
            <p className="text-[13.5px] leading-relaxed text-slate-600">
              {result.realWorldHowToTest}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. CLASS 1: LAPTOP VS CLOUD SERVER STRESS LAB ---------- */
export function ServerStressLab() {
  const [users, setUsers] = useState(25);
  const laptop = computeServerLoad('laptop', users);
  const cloud = computeServerLoad('cloud', users);

  return (
    <div className="w-full max-w-[960px] space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="stress-users" className="text-sm font-semibold text-slate-900">
            Concurrent visitors hitting your app at the same second
          </label>
          <span className="font-mono text-sm font-bold text-[#1D4ED8] tabular-nums">
            {users} concurrent users
          </span>
        </div>
        <input
          id="stress-users"
          type="range"
          min={1}
          max={400}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="w-full accent-[#1D4ED8] cursor-pointer"
        />
        <div className="flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
          <span>1 user</span>
          <span>100 users</span>
          <span>250 users</span>
          <span>400 users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Home Laptop */}
        <div
          className={`rounded-xl border p-6 space-y-4 transition-colors ${
            laptop.status === 'OVERLOADED'
              ? 'border-red-300 bg-red-50/50'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Laptop className="h-5 w-5 text-slate-600" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Your Home Laptop
              </h3>
            </div>
            <span
              className={`font-mono text-xs font-semibold ${
                laptop.status === 'OVERLOADED' ? 'text-red-700' : 'text-amber-700'
              }`}
            >
              {laptop.status === 'OVERLOADED' ? '▲ ' : '● '}
              {laptop.statusLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs text-slate-600 tabular-nums">
              <span>CPU Load</span>
              <span className="font-semibold">{laptop.cpuPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all ${
                  laptop.cpuPct > 85 ? 'bg-red-600' : 'bg-amber-500'
                }`}
                style={{ width: `${laptop.cpuPct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-slate-100 pt-3 font-mono text-xs text-slate-600 tabular-nums">
            <span>Response wait: {laptop.latencyMs} ms</span>
            <span>{laptop.uptimeLabel}</span>
          </div>
        </div>

        {/* Cloud Server */}
        <div className="rounded-xl border border-emerald-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Server className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Cloud Server (Railway / AWS)
              </h3>
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-700">
              ● {cloud.statusLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs text-slate-600 tabular-nums">
              <span>Auto-Scaled Cluster CPU</span>
              <span className="font-semibold">{cloud.cpuPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-600 transition-all"
                style={{ width: `${cloud.cpuPct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-slate-100 pt-3 font-mono text-xs text-slate-600 tabular-nums">
            <span>Response wait: {cloud.latencyMs} ms</span>
            <span>{cloud.uptimeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. CLASS 2: INTERACTIVE MINI-POSTMAN WORKBENCH ---------- */
export function PostmanMiniLab() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'DELETE'>('POST');
  const [endpoint, setEndpoint] = useState('/v1/chat');
  const [hasValidKey, setHasValidKey] = useState(true);
  const [bodyText, setBodyText] = useState(
    '{\n  "model": "ai-tutor-fast",\n  "prompt": "Explain APIs in 1 sentence"\n}'
  );
  const [spamCount, setSpamCount] = useState(0);
  const [result, setResult] = useState(() =>
    simulatePostmanCall({
      method: 'POST',
      endpoint: '/v1/chat',
      hasValidApiKey: true,
      bodyText: '{"model":"ai-tutor-fast","prompt":"Explain APIs"}',
      spamCount: 0,
    })
  );

  const handleSend = () => {
    const nextSpam = spamCount + 1;
    setSpamCount(nextSpam);
    setResult(
      simulatePostmanCall({
        method,
        endpoint,
        hasValidApiKey: hasValidKey,
        bodyText,
        spamCount: nextSpam,
      })
    );
  };

  const badgeColor =
    result.accent === 'teal'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : result.accent === 'orange'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-red-200 bg-red-50 text-red-800';

  return (
    <div className="grid w-full max-w-[1040px] grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Request Builder */}
      <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#1D4ED8]">
            1. Build Request (Postman style)
          </span>
          <button
            type="button"
            onClick={() => setSpamCount(0)}
            className="font-mono text-xs text-slate-500 hover:text-slate-900 tabular-nums"
          >
            Reset rate counter ({spamCount}/5)
          </button>
        </div>

        {/* Method + URL + Send */}
        <div className="flex gap-2">
          <select
            aria-label="HTTP Method"
            value={method}
            onChange={(e) => {
              const m = e.target.value as 'GET' | 'POST' | 'DELETE';
              setMethod(m);
              if (m === 'GET') setEndpoint('/v1/models');
              if (m === 'POST') setEndpoint('/v1/chat');
              if (m === 'DELETE') setEndpoint('/v1/history/42');
            }}
            className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            aria-label="Endpoint path"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send
          </button>
        </div>

        {/* Header API Key Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
            <KeyRound className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            Authorization Header
          </div>
          <button
            type="button"
            onClick={() => setHasValidKey((k) => !k)}
            className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
              hasValidKey
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {hasValidKey ? 'Bearer sk_live_valid ✓' : 'Missing Key (Trigger 401)'}
          </button>
        </div>

        {/* JSON Body Editor */}
        {method === 'POST' && (
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-500">
              JSON Request Body (try deleting a comma to trigger 400)
            </span>
            <textarea
              aria-label="JSON Request Body"
              rows={4}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#0F172A] p-3 font-mono text-xs leading-relaxed text-slate-100 focus:border-[#1D4ED8] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Live Response Inspector */}
      <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold text-slate-900">
            2. Live Server Response
          </span>
          <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
            <span className={`rounded-md border px-2.5 py-0.5 font-semibold ${badgeColor}`}>
              {result.statusCode} {result.statusText}
            </span>
            <span className="text-slate-500">{result.latencyMs} ms</span>
          </div>
        </div>

        <p className="text-[13.5px] leading-relaxed text-slate-600">{result.explanation}</p>

        <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#0F172A] p-4 font-mono text-xs leading-relaxed text-slate-100">
          {result.responseJson}
        </pre>

        <p className="text-xs text-slate-500">
          Try: (1) Toggle Key off → 401 · (2) Change URL to <code className="font-mono">/wrong</code> → 404 · (3) Click Send 6 times → 429.
        </p>
      </div>
    </div>
  );
}

/* ---------- 4. CLASS 2: JSON DOCTOR LAB ---------- */
const JSON_CHALLENGES = [
  {
    title: 'Bug #1: Missing Comma',
    broken: '{\n  "student": "Nadia"\n  "course": "AI Backend"\n}',
    fixed: '{\n  "student": "Nadia",\n  "course": "AI Backend"\n}',
    hint: 'Every key-value line (except the last one) needs a comma at the end.',
  },
  {
    title: 'Bug #2: Single Quotes',
    broken: "{\n  'model': 'gemini-2.5-flash',\n  'temperature': 0.7\n}",
    fixed: '{\n  "model": "gemini-2.5-flash",\n  "temperature": 0.7\n}',
    hint: 'JSON strictly requires double quotes " " — single quotes cause a syntax error.',
  },
  {
    title: 'Bug #3: Trailing Comma',
    broken: '{\n  "prompt": "Hello AI",\n  "max_tokens": 200,\n}',
    fixed: '{\n  "prompt": "Hello AI",\n  "max_tokens": 200\n}',
    hint: 'Remove the extra comma after 200 — the last item inside { } must not have a trailing comma.',
  },
];

export function JsonDoctorLab() {
  const [idx, setIdx] = useState(0);
  const [draft, setDraft] = useState(JSON_CHALLENGES[0].broken);
  const check = validateJsonPayload(draft);

  const selectChallenge = (nextIdx: number) => {
    setIdx(nextIdx);
    setDraft(JSON_CHALLENGES[nextIdx].broken);
  };

  return (
    <div className="w-full max-w-[920px] space-y-5">
      <div className="flex flex-wrap justify-center">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          {JSON_CHALLENGES.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => selectChallenge(i)}
              className={`rounded-md px-3.5 py-1.5 text-xs transition-all ${
                i === idx
                  ? 'bg-white font-semibold text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-7 space-y-3">
          <textarea
            aria-label="Edit JSON to fix syntax"
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#0F172A] p-4 font-mono text-sm leading-relaxed text-slate-100 focus:border-[#1D4ED8] focus:outline-none"
          />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setDraft(JSON_CHALLENGES[idx].fixed)}
              className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors"
            >
              Auto-Fix JSON
            </button>
            <button
              type="button"
              onClick={() => setDraft(JSON_CHALLENGES[idx].broken)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset Bug
            </button>
          </div>
        </div>

        <div
          className={`md:col-span-5 flex flex-col justify-center rounded-xl border p-6 space-y-3.5 ${
            check.valid
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-red-200 bg-red-50/70'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            {check.valid ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <span className="text-emerald-900">Valid JSON · Ready for API</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-700" aria-hidden="true" />
                <span className="text-red-900">Invalid JSON (HTTP 400)</span>
              </>
            )}
          </div>
          <p className="font-mono text-xs leading-relaxed text-slate-700">
            {check.valid
              ? 'Your server can now parse every key and value cleanly.'
              : check.error}
          </p>
          <div className="rounded-lg border border-slate-200/80 bg-white p-3.5 text-xs leading-relaxed text-slate-700">
            <strong className="font-semibold text-amber-800 block mb-1">Hint</strong>
            {JSON_CHALLENGES[idx].hint}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 5. CLASS 3: LIVE DATABASE MEMORY & CRUD LAB ---------- */
interface ChatRow {
  id: number;
  user: string;
  message: string;
}

export function DatabaseMemoryLab() {
  const [connected, setConnected] = useState(true);
  const [rows, setRows] = useState<ChatRow[]>([
    { id: 101, user: 'Nadia', message: 'Hi! My goal is to build an AI shop bot.' },
    { id: 102, user: 'AI Tutor', message: 'Saved! Let us start with Class 3 Databases.' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [askedName, setAskedName] = useState(false);

  const handleAddRow = () => {
    const clean = newMsg.trim() || 'Remember: I prefer Banglish examples!';
    setRows((prev) => [...prev, { id: 101 + prev.length, user: 'Nadia', message: clean }]);
    setNewMsg('');
  };

  return (
    <div className="grid w-full max-w-[1040px] grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left: Goldfish vs Connected AI Chat */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-900">AI Memory Test</span>
          <button
            type="button"
            onClick={() => {
              setConnected((c) => !c);
              setAskedName(false);
            }}
            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
              connected
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            Database: {connected ? 'Connected' : 'Off (Goldfish)'}
          </button>
        </div>

        <div className="space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-[13px]">
          <div className="ml-auto max-w-[88%] rounded-lg bg-[#1D4ED8] px-3 py-2 text-white">
            Turn 1: My name is Nadia. I want to build an AI shop bot.
          </div>
          {askedName && (
            <>
              <div className="ml-auto max-w-[88%] rounded-lg bg-[#1D4ED8] px-3 py-2 text-white">
                Turn 2 (Next Day): What am I building?
              </div>
              <div
                className={`mr-auto max-w-[92%] rounded-lg border px-3 py-2 ${
                  connected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                    : 'border-amber-200 bg-amber-50 text-amber-950'
                }`}
              >
                {connected
                  ? `Read ${rows.length} rows from Supabase! You are Nadia, building an AI shop bot.`
                  : 'Sorry! Without a Database, I wiped my memory when you closed the tab.'}
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAskedName(true)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-800 hover:border-[#1D4ED8]/40 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors"
        >
          Ask AI Next Day: “What am I building?”
        </button>
      </div>

      {/* Right: Live CRUD Table */}
      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-900">
            <Database className="h-4 w-4 text-[#1D4ED8]" aria-hidden="true" />
            table: chat_messages
          </div>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {rows.length} saved rows
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
              <tr>
                <th className="px-3.5 py-2.5 font-medium">id</th>
                <th className="px-3.5 py-2.5 font-medium">user</th>
                <th className="px-3.5 py-2.5 font-medium">message</th>
                <th className="px-3.5 py-2.5 text-right font-medium">delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-[#1D4ED8] tabular-nums">
                    {r.id}
                  </td>
                  <td className="px-3.5 py-2.5 font-medium text-slate-900">{r.user}</td>
                  <td className="px-3.5 py-2.5">{r.message}</td>
                  <td className="px-3.5 py-2.5 text-right">
                    <button
                      type="button"
                      aria-label={`Delete row ${r.id}`}
                      onClick={() => setRows((prev) => prev.filter((item) => item.id !== r.id))}
                      className="rounded p-1 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            aria-label="New message row"
            placeholder="Insert a new row (e.g., Save my preference)…"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Insert Row
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 6. CLASS 3: LIVE TOKENIZER & CONTEXT WINDOW BUCKET ---------- */
const TOKEN_CHIP_STYLES = [
  'bg-blue-50 text-blue-900 border-blue-200',
  'bg-emerald-50 text-emerald-900 border-emerald-200',
  'bg-amber-50 text-amber-900 border-amber-200',
  'bg-rose-50 text-rose-900 border-rose-200',
  'bg-indigo-50 text-indigo-900 border-indigo-200',
];

export function TokenizerContextLab({ variant }: { variant?: string }) {
  const [text, setText] = useState('Explain AI backends simply for a vibe coder!');
  const [maxBucket, setMaxBucket] = useState(60);
  const [messages, setMessages] = useState([
    { text: 'System: You are a friendly AI tutor.', tokens: 12 },
    { text: 'User: My name is Nadia from Dhaka.', tokens: 14 },
    { text: 'AI: Welcome Nadia! Ready to learn.', tokens: 12 },
    { text: 'User: Explain Python FastAPI.', tokens: 10 },
  ]);

  const tok = tokenizeText(text);
  const bucket = computeContextWindowUsage(messages, maxBucket);

  if (variant === 'context-bucket') {
    return (
      <div className="grid w-full max-w-[980px] grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-xs font-semibold text-[#1D4ED8]">
            Context Window Token Limit
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs text-slate-700 tabular-nums">
              <span>Used: {bucket.usedTokens} tokens</span>
              <span>Limit: {bucket.maxTokens} tokens</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all ${
                  bucket.droppedCount > 0 ? 'bg-amber-500' : 'bg-[#1D4ED8]'
                }`}
                style={{ width: `${bucket.percentFull}%` }}
              />
            </div>
          </div>

          <input
            type="range"
            aria-label="Context window token limit"
            min={25}
            max={90}
            value={maxBucket}
            onChange={(e) => setMaxBucket(Number(e.target.value))}
            className="w-full accent-[#1D4ED8] cursor-pointer"
          />

          <button
            type="button"
            onClick={() =>
              setMessages((m) => [
                ...m,
                { text: `User: Follow-up question #${m.length + 1} (16 tokens)`, tokens: 16 },
              ])
            }
            className="w-full rounded-lg bg-[#1D4ED8] py-2.5 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors"
          >
            + Add Chat Turn (16 Tokens)
          </button>

          <p className="text-[13px] leading-relaxed text-slate-600">
            Lower the token limit or add turns to see older messages fall out of active memory.
          </p>
        </div>

        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 space-y-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold tabular-nums">
            <span className="text-emerald-700">
              Active Memory ({bucket.keptMessages.length})
            </span>
            <span className="text-red-700">
              Dropped / Forgotten ({bucket.droppedCount})
            </span>
          </div>

          <div className="space-y-2">
            {bucket.droppedMessages.map((msg, i) => (
              <div
                key={`drop-${i}`}
                className="rounded-lg border border-red-200 bg-red-50/70 px-3.5 py-2 text-xs text-red-800 line-through"
              >
                Dropped: {msg}
              </div>
            ))}
            {bucket.keptMessages.map((msg, i) => (
              <div
                key={`kept-${i}`}
                className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3.5 py-2 text-xs text-emerald-950"
              >
                Active: {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[960px]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="live-tok" className="text-sm font-semibold text-slate-900">
            Type any sentence to inspect tokens (try long words or Banglish)
          </label>
          <div className="flex gap-4 font-mono text-xs tabular-nums">
            <span className="text-slate-700">
              Tokens: <strong className="text-[#1D4ED8]">{tok.tokenCount}</strong>
            </span>
            <span className="text-slate-500">Chars: {tok.charCount}</span>
            <span className="text-emerald-700 font-semibold">
              Est: ${tok.estimatedSingleCallUsd.toFixed(6)}
            </span>
          </div>
        </div>

        <input
          id="live-tok"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[15px] text-slate-900 focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/15"
        />

        <div className="flex flex-wrap gap-2 pt-1">
          {tok.pieces.map((p) => (
            <span
              key={p.id}
              className={`inline-flex flex-col items-center rounded-md border px-2.5 py-1 font-mono text-xs ${
                TOKEN_CHIP_STYLES[p.colorIndex]
              }`}
            >
              <span>{p.text.replace(/ /g, '·')}</span>
              <span className="text-[10px] opacity-70 tabular-nums">#{p.tokenId}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
