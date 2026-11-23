import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  Laptop,
  Plus,
  Send,
  Server,
  Trash2,
} from 'lucide-react';
import {
  computeContextWindowUsage,
  computeServerLoad,
  simulatePostmanCall,
  tokenizeText,
  validateJsonPayload,
} from '../../utils/courseLogic';

/* ---------- 1. CLASS 1: FRONTEND X-RAY LAB (HTML / CSS / JS TOGGLE + CLICKABLE PARTS) ---------- */
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
      desc: 'Formats the server’s reply cleanly with padding, dark/light contrast, and rounded corners.',
    },
    input: {
      title: 'Prompt Box & Send Button (JavaScript Event)',
      desc: 'JavaScript listens for your click, grabs the typed text, and hands it off toward the Backend Server.',
    },
  }[selectedPart];

  return (
    <div className="grid w-full max-w-[1000px] grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Live Mock Browser Screen */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCssOn((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              cssOn
                ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
                : 'border-[#ffad70] bg-[#342319] text-[#ffad70]'
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
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              jsOn
                ? 'border-[#80b6ff] bg-[#172a42] text-[#80b6ff]'
                : 'border-[#ff8585] bg-[#361c22] text-[#ff8585]'
            }`}
          >
            JavaScript Clicks: {jsOn ? 'ON' : 'OFF (Frozen)'}
          </button>
        </div>

        <div
          className={
            cssOn
              ? 'rounded-2xl border border-white/15 bg-[#f4f2e9] p-5 text-[#17232f] space-y-3 shadow-xl'
              : 'border-2 border-dashed border-[#8ca3b1] bg-white p-4 text-black font-serif space-y-2'
          }
        >
          <button
            type="button"
            onClick={() => setSelectedPart('header')}
            className={`w-full text-left transition-all ${
              cssOn
                ? `flex items-center justify-between rounded-xl px-3.5 py-2.5 border ${
                    selectedPart === 'header'
                      ? 'border-[#0d6e5c] bg-[#dff5ee]'
                      : 'border-[#d6d0bc] bg-[#ebe7da]'
                  }`
                : 'underline font-bold'
            }`}
          >
            <span>AI Tutor App</span>
            <span className="font-mono text-[10px]">[Click to inspect Header]</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPart('bubble')}
            className={`w-full text-left transition-all ${
              cssOn
                ? `rounded-xl px-4 py-3 text-xs border ${
                    selectedPart === 'bubble'
                      ? 'border-[#0d6e5c] bg-[#dff5ee]'
                      : 'border-[#dad4c2] bg-white'
                  }`
                : 'block border border-black p-1 text-xs'
            }`}
          >
            <strong>AI Reply:</strong> Turn off CSS above to see ugly 1995 raw HTML skeleton!
          </button>

          <div
            onClick={() => setSelectedPart('input')}
            className={
              cssOn
                ? `flex items-center gap-2 rounded-xl p-2 border cursor-pointer ${
                    selectedPart === 'input'
                      ? 'border-[#0d6e5c] bg-[#dff5ee]'
                      : 'border-[#d6d0bc] bg-white'
                  }`
                : 'flex gap-2 pt-2'
            }
          >
            <div className="flex-1 px-2 text-xs text-[#546471]">Type a prompt here...</div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPart('input');
                setClickedNote(true);
              }}
              className={
                cssOn
                  ? 'rounded-lg bg-[#17232f] px-3.5 py-1.5 font-mono text-xs font-bold text-[#60e0c0]'
                  : 'border border-black px-2 py-0.5 text-xs bg-gray-200'
              }
            >
              Send
            </button>
          </div>

          {clickedNote && (
            <p className="font-mono text-[11px] font-semibold text-[#9b4f1b]">
              {jsOn
                ? '✓ JavaScript fired! Button captured click and prepared a Backend request.'
                : '✗ JavaScript is OFF! Clicking Send does absolutely nothing — dead statue!'}
            </p>
          )}
        </div>
      </div>

      {/* Right X-Ray Explanation */}
      <div className="lg:col-span-5 flex flex-col justify-center rounded-2xl border border-[#60e0c0]/35 bg-[#132433] p-6 space-y-3">
        <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#60e0c0] uppercase">
          FRONTEND X-RAY INSPECTOR
        </span>
        <h3 className="font-display text-lg font-extrabold text-[#f1f5f4]">{info.title}</h3>
        <p className="text-sm leading-relaxed text-[#c6dae3]">{info.desc}</p>
        <div className="rounded-xl bg-[#0b141f] p-3.5 font-mono text-[11px] text-[#9eb6c4] space-y-1">
          <div>• HTML = Bones (Text &amp; Buttons)</div>
          <div>• CSS = Clothes (Colors &amp; Spacing)</div>
          <div>• JS = Muscles (Clicks &amp; Animation)</div>
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
    <div className="w-full max-w-[980px] space-y-5">
      <div className="rounded-2xl border border-white/12 bg-[#132433] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="stress-users"
            className="font-mono text-xs font-semibold text-[#dbe8ee]"
          >
            DRAG LIVE VISITORS HITTING YOUR APP AT THE SAME SECOND
          </label>
          <span className="rounded-md bg-[#60e0c0] px-3 py-1 font-mono text-sm font-extrabold text-[#08171c] tabular-nums">
            {users} Concurrent Users
          </span>
        </div>
        <input
          id="stress-users"
          type="range"
          min={1}
          max={400}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="w-full accent-[#60e0c0] cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Home Laptop */}
        <div
          className={`rounded-2xl border p-5 space-y-3 transition-colors ${
            laptop.status === 'OVERLOADED'
              ? 'border-[#ff8585] bg-[#31191f]'
              : 'border-white/12 bg-[#12202e]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-[#ffad70]" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-[#f1f5f4]">
                Your Home Laptop
              </h3>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#ff8585]">
              {laptop.statusLabel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-xs text-[#9cb0bc]">
              <span>CPU Load</span>
              <span>{laptop.cpuPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/40">
              <div
                className={`h-full transition-all ${
                  laptop.cpuPct > 85 ? 'bg-[#ff8585]' : 'bg-[#ffad70]'
                }`}
                style={{ width: `${laptop.cpuPct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between font-mono text-xs text-[#b8cdd6] pt-1">
            <span>Response Wait: {laptop.latencyMs} ms</span>
            <span>{laptop.uptimeLabel}</span>
          </div>
        </div>

        {/* Cloud Server */}
        <div className="rounded-2xl border border-[#60e0c0]/45 bg-[#122d34] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[#60e0c0]" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-[#f1f5f4]">
                Cloud Server (Railway / AWS)
              </h3>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#60e0c0]">
              {cloud.statusLabel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-mono text-xs text-[#9cb0bc]">
              <span>Auto-Scaled Cluster CPU</span>
              <span>{cloud.cpuPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full bg-[#60e0c0] transition-all"
                style={{ width: `${cloud.cpuPct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between font-mono text-xs text-[#c7ebe3] pt-1">
            <span>Response Wait: {cloud.latencyMs} ms</span>
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
      ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
      : result.accent === 'orange'
        ? 'border-[#ffad70] bg-[#342319] text-[#ffad70]'
        : 'border-[#ff8585] bg-[#361b21] text-[#ff8585]';

  return (
    <div className="grid w-full max-w-[1040px] grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Request Builder */}
      <div className="lg:col-span-6 rounded-2xl border border-white/14 bg-[#12202f] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#60e0c0]">
            1. BUILD REQUEST (LIKE POSTMAN)
          </span>
          <button
            type="button"
            onClick={() => setSpamCount(0)}
            className="font-mono text-[10px] text-[#8ca3b1] hover:text-white"
          >
            Reset Rate Counter ({spamCount}/5)
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
            className="rounded-lg border border-white/15 bg-[#0a131d] px-2.5 py-2 font-mono text-xs font-bold text-[#60e0c0]"
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
            className="flex-1 rounded-lg border border-white/15 bg-[#0a131d] px-3 py-2 font-mono text-xs text-[#edf4f5]"
          />

          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#60e0c0] px-4 py-2 font-mono text-xs font-extrabold text-[#08171c] hover:bg-[#7ae8cc] whitespace-nowrap"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            Send
          </button>
        </div>

        {/* Header API Key Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0b141f] px-3.5 py-2.5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#c7dae2]">
            <KeyRound className="h-3.5 w-3.5 text-[#ffad70]" aria-hidden="true" />
            Authorization Header
          </div>
          <button
            type="button"
            onClick={() => setHasValidKey((k) => !k)}
            className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-bold ${
              hasValidKey
                ? 'bg-[#15353a] text-[#60e0c0]'
                : 'bg-[#361b21] text-[#ff8585]'
            }`}
          >
            {hasValidKey ? 'Bearer sk_live_valid ✓' : 'Missing Key (Trigger 401)'}
          </button>
        </div>

        {/* JSON Body Editor */}
        {method === 'POST' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8ca3b1]">
              <span>JSON REQUEST BODY (TRY DELETING A COMMA FOR 400!)</span>
            </div>
            <textarea
              aria-label="JSON Request Body"
              rows={4}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded-xl border border-white/12 bg-[#0a131d] p-3 font-mono text-xs text-[#d6edea]"
            />
          </div>
        )}
      </div>

      {/* Live Response Inspector */}
      <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/14 bg-[#0b131d] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#ffad70]">
            2. LIVE SERVER RESPONSE
          </span>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`rounded-md border px-2.5 py-0.5 font-extrabold ${badgeColor}`}>
              {result.statusCode} {result.statusText}
            </span>
            <span className="text-[#8ca3b1]">{result.latencyMs} ms</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#cfe0e6]">{result.explanation}</p>

        <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/8 bg-[#080f18] p-4 font-mono text-xs leading-relaxed text-[#b7f2e3]">
          {result.responseJson}
        </pre>

        <p className="font-mono text-[10px] text-[#7c94a5]">
          Try: (1) Turn off Key → 401 · (2) Change URL to /wrong → 404 · (3) Click Send 6 times → 429!
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
    hint: 'Every key-value line (except the last one) needs a comma at the end!',
  },
  {
    title: 'Bug #2: Single Quotes Instead of Double Quotes',
    broken: "{\n  'model': 'gemini-2.5-flash',\n  'temperature': 0.7\n}",
    fixed: '{\n  "model": "gemini-2.5-flash",\n  "temperature": 0.7\n}',
    hint: 'JSON strictly requires DOUBLE quotes " " — single quotes crash the server!',
  },
  {
    title: 'Bug #3: Trailing Comma at the End',
    broken: '{\n  "prompt": "Hello AI",\n  "max_tokens": 200,\n}',
    fixed: '{\n  "prompt": "Hello AI",\n  "max_tokens": 200\n}',
    hint: 'Remove the extra comma after 200 — the last item inside { } must NOT have a comma.',
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
    <div className="w-full max-w-[920px] space-y-4">
      <div className="flex flex-wrap justify-center gap-2">
        {JSON_CHALLENGES.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => selectChallenge(i)}
            className={`rounded-lg border px-3.5 py-1.5 font-mono text-xs font-semibold ${
              i === idx
                ? 'border-[#60e0c0] bg-[#15353a] text-[#60e0c0]'
                : 'border-white/12 bg-[#12202e] text-[#9eb2be]'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-7 space-y-2">
          <textarea
            aria-label="Edit JSON to fix syntax"
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#0a131d] p-4 font-mono text-sm leading-relaxed text-[#e6f3f2]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft(JSON_CHALLENGES[idx].fixed)}
              className="rounded-lg bg-[#60e0c0] px-3.5 py-1.5 font-mono text-xs font-bold text-[#08171c]"
            >
              Auto-Fix This JSON
            </button>
            <button
              type="button"
              onClick={() => setDraft(JSON_CHALLENGES[idx].broken)}
              className="rounded-lg border border-white/15 bg-[#12202e] px-3.5 py-1.5 font-mono text-xs text-[#9cb0bc]"
            >
              Reset Bug
            </button>
          </div>
        </div>

        <div
          className={`md:col-span-5 flex flex-col justify-center rounded-2xl border p-5 space-y-3 ${
            check.valid
              ? 'border-[#60e0c0]/55 bg-[#123338]'
              : 'border-[#ff8585]/55 bg-[#331a20]'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold">
            {check.valid ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-[#60e0c0]" aria-hidden="true" />
                <span className="text-[#60e0c0]">VALID JSON · READY FOR API!</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-[#ff8585]" aria-hidden="true" />
                <span className="text-[#ff8585]">BROKEN JSON (WOULD RETURN 400)</span>
              </>
            )}
          </div>
          <p className="font-mono text-[11px] text-[#dbe8ee]">
            {check.valid
              ? 'Your server can now parse every key and value cleanly!'
              : check.error}
          </p>
          <div className="rounded-xl bg-black/25 p-3 text-xs text-[#ffe0bf]">
            <strong className="font-mono text-[10px] text-[#ffad70] block mb-1">HINT:</strong>
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
    <div className="grid w-full max-w-[1040px] grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Left: Goldfish vs Connected AI Chat */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/12 bg-[#132433] p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold text-[#60e0c0]">
            AI MEMORY TEST
          </span>
          <button
            type="button"
            onClick={() => {
              setConnected((c) => !c);
              setAskedName(false);
            }}
            className={`rounded-lg px-3 py-1 font-mono text-[11px] font-bold ${
              connected
                ? 'bg-[#60e0c0] text-[#08171c]'
                : 'bg-[#342319] text-[#ffad70] border border-[#ffad70]/45'
            }`}
          >
            Supabase DB: {connected ? 'CONNECTED' : 'OFF (Goldfish)'}
          </button>
        </div>

        <div className="space-y-2 rounded-xl bg-[#0a131d] p-3.5 text-xs">
          <div className="ml-auto max-w-[88%] rounded-lg bg-[#1d484d] px-3 py-2 text-[#c8f7ea]">
            Turn 1: My name is Nadia. I want to build an AI shop bot.
          </div>
          {askedName && (
            <>
              <div className="ml-auto max-w-[88%] rounded-lg bg-[#1d484d] px-3 py-2 text-[#c8f7ea]">
                Turn 2 (Next Day): What am I building?
              </div>
              <div
                className={`mr-auto max-w-[92%] rounded-lg border px-3 py-2 ${
                  connected
                    ? 'border-[#60e0c0]/55 bg-[#133336] text-[#d5faf0]'
                    : 'border-[#ffad70]/50 bg-[#342319] text-[#ffd7b4]'
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
          className="w-full rounded-lg border border-[#60e0c0]/50 bg-[#15353a] py-2 font-mono text-xs font-bold text-[#60e0c0] hover:bg-[#1a4349]"
        >
          Ask AI Next Day: “What am I building?”
        </button>
      </div>

      {/* Right: Live CRUD Table */}
      <div className="lg:col-span-7 rounded-2xl border border-white/12 bg-[#0b131d] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#80b6ff]">
            <Database className="h-4 w-4" aria-hidden="true" />
            TABLE: chat_messages (LIVE CRUD)
          </div>
          <span className="font-mono text-[10px] text-[#8ca3b1]">{rows.length} saved rows</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#122231] text-[10px] text-[#8ca3b1]">
              <tr>
                <th className="px-3 py-2">id</th>
                <th className="px-3 py-2">user</th>
                <th className="px-3 py-2">message</th>
                <th className="px-3 py-2 text-right">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 text-[#d5e4ea]">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 text-[#60e0c0]">{r.id}</td>
                  <td className="px-3 py-2">{r.user}</td>
                  <td className="px-3 py-2 font-sans">{r.message}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      aria-label={`Delete row ${r.id}`}
                      onClick={() => setRows((prev) => prev.filter((item) => item.id !== r.id))}
                      className="rounded p-1 text-[#ff8585] hover:bg-[#361b21]"
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
            placeholder="CREATE new row (e.g. Save my preference)..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 rounded-lg border border-white/15 bg-[#12202e] px-3 py-2 text-xs text-[#edf4f5]"
          />
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 rounded-lg bg-[#60e0c0] px-3.5 py-2 font-mono text-xs font-bold text-[#08171c] whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            INSERT Row
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 6. CLASS 3: LIVE TOKENIZER & CONTEXT WINDOW BUCKET ---------- */
const TOKEN_CHIP_STYLES = [
  'bg-[#173c3c] text-[#8ef3da] border-[#60e0c0]/45',
  'bg-[#35261b] text-[#ffd1a8] border-[#ffad70]/45',
  'bg-[#192c47] text-[#a9ceff] border-[#80b6ff]/45',
  'bg-[#341f2a] text-[#ffb3c6] border-[#ff8585]/45',
  'bg-[#252440] text-[#cfc4ff] border-[#a89bff]/45',
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
      <div className="grid w-full max-w-[980px] grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5 rounded-2xl border border-white/12 bg-[#132433] p-5 space-y-4">
          <span className="font-mono text-[11px] font-bold text-[#60e0c0]">
            CONTEXT WINDOW BUCKET SIZE
          </span>
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs text-[#d3e2e8]">
              <span>Used: {bucket.usedTokens} tokens</span>
              <span>Limit: {bucket.maxTokens} tokens</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-black/40">
              <div
                className={`h-full transition-all ${
                  bucket.droppedCount > 0 ? 'bg-[#ffad70]' : 'bg-[#60e0c0]'
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
            className="w-full accent-[#60e0c0] cursor-pointer"
          />

          <button
            type="button"
            onClick={() =>
              setMessages((m) => [
                ...m,
                { text: `User: Follow-up question #${m.length + 1} (16 tokens)`, tokens: 16 },
              ])
            }
            className="w-full rounded-lg bg-[#60e0c0] py-2 font-mono text-xs font-bold text-[#08171c]"
          >
            + Add Another Long Chat Turn (16 Tokens)
          </button>

          <p className="text-xs text-[#9eb2be]">
            Drag the limit down or add turns — watch the oldest message fall out of the AI’s short-term memory!
          </p>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-white/12 bg-[#0b131d] p-5 space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#60e0c0]">INSIDE AI’S ACTIVE MEMORY ({bucket.keptMessages.length})</span>
            <span className="text-[#ff8585]">FORGOTTEN / DROPPED ({bucket.droppedCount})</span>
          </div>

          <div className="space-y-2">
            {bucket.droppedMessages.map((msg, i) => (
              <div
                key={`drop-${i}`}
                className="rounded-lg border border-[#ff8585]/35 bg-[#2d171c] px-3 py-2 text-xs text-[#ffb8b8] line-through opacity-75"
              >
                DROPPED: {msg}
              </div>
            ))}
            {bucket.keptMessages.map((msg, i) => (
              <div
                key={`kept-${i}`}
                className="rounded-lg border border-[#60e0c0]/35 bg-[#122e33] px-3 py-2 text-xs text-[#d9f8f0]"
              >
                ACTIVE: {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[960px] space-y-4">
      <div className="rounded-2xl border border-white/14 bg-[#132433] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="live-tok" className="font-mono text-xs font-bold text-[#60e0c0]">
            TYPE ANY SENTENCE (TRY LONG WORDS OR BANGLISH!)
          </label>
          <div className="flex gap-3 font-mono text-xs tabular-nums">
            <span className="text-[#dbe8ee]">
              Tokens: <strong className="text-[#60e0c0]">{tok.tokenCount}</strong>
            </span>
            <span className="text-[#9cb0bc]">Chars: {tok.charCount}</span>
            <span className="text-[#ffad70]">
              Est: ${tok.estimatedSingleCallUsd.toFixed(6)}
            </span>
          </div>
        </div>

        <input
          id="live-tok"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-[#0a131d] px-4 py-2.5 text-sm text-[#f1f5f4]"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tok.pieces.map((p) => (
            <span
              key={p.id}
              className={`inline-flex flex-col items-center rounded-lg border px-2.5 py-1 font-mono text-xs ${
                TOKEN_CHIP_STYLES[p.colorIndex]
              }`}
            >
              <span>{p.text.replace(/ /g, '·')}</span>
              <span className="text-[9px] opacity-75">#{p.tokenId}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
