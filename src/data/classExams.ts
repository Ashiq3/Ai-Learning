import type { ClassId } from '../types/course';
import type { ClassExamDefinition } from '../types/exam';

export const CLASS_EXAMS: Record<ClassId, ClassExamDefinition> = {
  1: {
    classId: 1,
    examVersion: 'v1',
    title: 'Class 01 Official Exam: Frontend, Backend, Cloud & DNS',
    subtitle:
      '5 auto-graded conceptual & multi-select questions + 1 short written explanation. Score 80%+ to pass — wrong answers give helpful hints & slide links on Attempts #1–2, then unlock full explanations on Attempt #3 or pass.',
    passPercent: 80,
    estimatedMinutes: 15,
    questions: [
      {
        id: 'c1_q1',
        type: 'mcq',
        prompt:
          'A customer opens Chrome DevTools Elements panel on an e-commerce site and edits the price text from $500 to $1 before clicking Checkout. Why will the real store still charge $500?',
        options: [
          'Because Chrome blocks editing prices in HTML',
          'Because the Frontend HTML edit only changes the customer’s local screen; the Backend calculates the real price on its private server',
          'Because CSS resets the price automatically when you click Checkout',
          'Because DNS rewrites the webpage back to $500 every second',
        ],
        correctIndices: [1],
        hint: 'Remember the restaurant analogy: changing a number on your paper menu does not change the kitchen’s cash register! Review Slide 11 & Slide 16.',
        reviewSlideNumber: 16,
        explanationEn:
          'Anything inside the user’s browser (Frontend) can be edited by the user at any time. Real apps always recalculate prices and verify security rules inside the hidden Backend server.',
        explanationBanglish:
          'Browser-e (Frontend) jekono text change korle shudhu nijer screen-ei change hoy — real dam ar security check shob somoy Backend server-e hoy!',
      },
      {
        id: 'c1_q2',
        type: 'mcq',
        prompt:
          'You type `chatgpt.com` into your browser and press Enter. What is the VERY FIRST thing DNS does before your request can reach OpenAI’s cloud servers?',
        options: [
          'It compiles Python code inside your phone',
          'It translates the human-readable domain name into the server’s numeric IP address',
          'It creates a brand new database table for your account',
          'It downloads CSS animations from Chrome DevTools',
        ],
        correctIndices: [1],
        hint: 'Think of the Internet’s giant phonebook: humans remember names, computers dial numbers. Review Slide 24.',
        reviewSlideNumber: 24,
        explanationEn:
          'DNS (Domain Name System) acts as the Internet’s phonebook, converting human-friendly names like chatgpt.com into machine-routable IP addresses.',
        explanationBanglish:
          'DNS internet-er phonebook — manush-er lekha domain name-ke server-er exact IP address (number)-e convert kore dey.',
      },
      {
        id: 'c1_q3',
        type: 'mcq',
        prompt:
          'Your AI side-project suddenly goes viral with 2,000 people clicking at once. You were hosting the Backend on your home laptop. Why does it crash, whereas a Cloud Server (like Railway) stays online?',
        options: [
          'Home laptops cannot run HTML buttons',
          'Cloud servers run 24/7 in redundant data centers with high bandwidth and auto-scaling, unlike a single home laptop',
          'Cloud servers never receive HTTP requests from mobile phones',
          'Home laptops do not support JavaScript or CSS',
        ],
        correctIndices: [1],
        hint: 'Compare your laptop sleeping at 2 AM with a 24/7 data center cluster in the Server Stress Lab. Review Slide 22.',
        reviewSlideNumber: 22,
        explanationEn:
          'A home laptop has limited CPU, residential internet, and sleeps when closed. Cloud platforms like Railway run on 24/7 data-center hardware that scales across multiple machines.',
        explanationBanglish:
          'Laptop bondho holei app off ar traffic barle hang hoye jay — Cloud server (Railway/AWS) 24/7 data center-e chole ar load barle auto-scale kore.',
      },
      {
        id: 'c1_q4',
        type: 'multi-select',
        prompt:
          'Select ALL items that belong strictly to the FRONTEND (running inside the user’s browser or phone):',
        options: [
          'HTML structure (buttons, headings, input boxes)',
          'CSS styling (colors, fonts, dark-mode spacing)',
          'Secret AI provider API keys and billing credentials',
          'JavaScript button click animations and instant UI feedback',
          'Private customer password hashes stored permanently',
        ],
        correctIndices: [0, 1, 3],
        hint: 'Ask yourself: "Is this drawn on the user’s screen, or must it stay locked inside the hidden kitchen?" Review Slide 8 & Slide 9.',
        reviewSlideNumber: 8,
        explanationEn:
          'HTML, CSS, and client-side JavaScript make up the Frontend running on the user’s device. API keys and password databases must stay safely on the Backend.',
        explanationBanglish:
          'HTML, CSS ar UI interaction JavaScript shudhu Frontend-e thake; API key ba password kokhono Frontend-e rakha jabe na!',
      },
      {
        id: 'c1_q5',
        type: 'multi-select',
        prompt:
          'You open the Chrome DevTools Network Tab while debugging a broken AI app. Select ALL real debugging clues you can inspect there:',
        options: [
          'Whether each Backend request succeeded (200) or failed (red row)',
          'How many milliseconds (Time) the Backend took to reply',
          'Which CSS color palette the designer prefers in Figma',
          'The size of the data transferred between Frontend and Backend',
        ],
        correctIndices: [0, 1, 3],
        hint: 'Remember the 4 numbered pins we inspected on the real Chrome DevTools Network screenshot! Review Slide 31.',
        reviewSlideNumber: 31,
        explanationEn:
          'The Chrome Network tab records every live HTTP request, showing Status (200 vs failed), Size transferred, and exact Time in milliseconds — making it your #1 debugging tool.',
        explanationBanglish:
          'Chrome Network tab-e prottekta request-er Status (200 naki failed), Size ar koto millisecond laglo — shob live dekha jay!',
      },
      {
        id: 'c1_q6',
        type: 'short-answer',
        prompt:
          'In your own words (2–3 sentences), explain what happens step-by-step from the moment you tap "Send" on an AI chat app until the reply appears on your screen.',
        options: [],
        correctIndices: [],
        hint: 'Mention at least: Frontend click → DNS/Internet → Cloud Backend processing → Response painted back on screen. Review Slide 30.',
        reviewSlideNumber: 30,
        explanationEn:
          'A strong explanation walks through: (1) Frontend captures your message on screen, (2) Browser resolves the server address via DNS and sends a Request over HTTPS, (3) Cloud Backend processes the logic/AI call securely, and (4) Backend returns a Response that the Frontend paints as a chat bubble.',
        explanationBanglish:
          'Bhalo uttor-e 4ta step thakbe: Frontend theke click -> DNS diye server khuje Request pathano -> Cloud Backend-e kaj howa -> Response fire eshe screen-e dekhano.',
        rubricGuide:
          '2 pts: Clearly connects Frontend -> DNS/Request -> Cloud Backend -> Response back to UI. 1 pt: Mentions Frontend & Backend but misses Request/Response flow. 0 pts: Off-topic or empty.',
      },
    ],
  },
  2: {
    classId: 2,
    examVersion: 'v1',
    title: 'Class 02 Official Exam: APIs, HTTP Methods, JSON & Keys',
    subtitle:
      '5 auto-graded API & debugging questions + 1 short written security explanation. Score 80%+ to pass — Option A Smart Hints guide you on Attempts #1–2.',
    passPercent: 80,
    estimatedMinutes: 15,
    questions: [
      {
        id: 'c2_q1',
        type: 'mcq',
        prompt:
          'Why should an AI chat prompt or user login password ALWAYS be sent with HTTP `POST` instead of HTTP `GET`?',
        options: [
          'GET requests do not work over HTTPS',
          'GET puts parameters directly in the visible URL address bar & browser history, while POST seals data inside the hidden Request Body',
          'POST requests are always 10x faster than GET requests',
          'GET requests can only be sent from Postman, not Chrome',
        ],
        correctIndices: [1],
        hint: 'Imagine typing your password and seeing `?password=Secret123` appear in your Chrome URL bar! Review Slide 10.',
        reviewSlideNumber: 10,
        explanationEn:
          'GET attaches data as visible URL query parameters (`?q=...`), which leak into browser history and server logs. POST places sensitive payloads and long AI prompts inside the hidden Request Body.',
        explanationBanglish:
          'GET korle data browser-er URL bar-e open dekha jay! Tai password ba boro AI prompt shob somoy POST-er hidden Body-te pathate hoy.',
      },
      {
        id: 'c2_q2',
        type: 'mcq',
        prompt:
          'You call an AI API in Postman and receive `401 Unauthorized`. What is the FIRST thing you should check?',
        options: [
          'Whether your Wi-Fi router needs a restart',
          'Whether your `Authorization: Bearer <API_KEY>` header is missing, misspelled, or expired',
          'Whether your CSS file has a syntax error',
          'Whether the server is running Python 2 instead of Python 3',
        ],
        correctIndices: [1],
        hint: 'Remember the VIP nightclub bouncer analogy: 401 means "Who are you? Show me your valid VIP badge!" Review Slide 25 & Slide 30.',
        reviewSlideNumber: 25,
        explanationEn:
          'HTTP 401 Unauthorized specifically means authentication failed — your API key is missing, invalid, or formatted incorrectly in the Authorization header.',
        explanationBanglish:
          '401 Unauthorized mane bouncer tomake chinche na — tomar Authorization Header-e API key missing ba vul ache!',
      },
      {
        id: 'c2_q3',
        type: 'mcq',
        prompt:
          'Look closely at this JSON payload: `{ "model": "gemini-2.5-flash", "prompt": "Hello", }`. Why does the Backend reject it with `400 Bad Request`?',
        options: [
          'JSON does not allow the word "prompt"',
          'There is an illegal trailing comma right before the closing curly brace `}`',
          'JSON requires single quotes instead of double quotes',
          'JSON keys must be written in ALL CAPS',
        ],
        correctIndices: [1],
        hint: 'Check the very last item right before `}` — remember Bug #3 from our JSON Syntax Doctor lab! Review Slide 17.',
        reviewSlideNumber: 17,
        explanationEn:
          'Strict JSON forbids trailing commas after the final key-value pair and strictly requires double quotes `" "` around every key and string value.',
        explanationBanglish:
          'Strict JSON-e last line-er sheshe extra comma (trailing comma) thaklei server parse korte pare na ar 400 Bad Request dey!',
      },
      {
        id: 'c2_q4',
        type: 'multi-select',
        prompt:
          'Select ALL best practices for keeping your OpenAI / Gemini API Keys safe in a real production app:',
        options: [
          'Store the key inside a server-side `.env` file or Cloud Environment Variables',
          'Add `.env` to `.gitignore` so secrets are never pushed to public GitHub repos',
          'Paste the key directly inside your React Frontend component for faster calls',
          'Route AI requests from Frontend → Your Backend → AI Provider so the key never touches the browser',
        ],
        correctIndices: [0, 1, 3],
        hint: 'Anyone can press F12 in Chrome to inspect Frontend code — where must secret keys live? Review Slide 22 & Slide 23.',
        reviewSlideNumber: 22,
        explanationEn:
          'API keys must live exclusively in server-side `.env` variables (ignored by Git) and be used only by your Backend server — never shipped to the Frontend browser.',
        explanationBanglish:
          'API key shob somoy server-er `.env` file-e rakhba, `.gitignore`-e add korba, ar Frontend theke direct call na kore Backend diye call korba!',
      },
      {
        id: 'c2_q5',
        type: 'multi-select',
        prompt:
          'Match the right HTTP Status Codes! Select ALL statements that are 100% TRUE:',
        options: [
          '`200 OK` means the request succeeded and the response arrived cleanly',
          '`404 Not Found` means the endpoint URL path does not exist on the server',
          '`429 Too Many Requests` means you hit the API rate limit by sending calls too fast',
          '`500 Internal Server Error` means your user forgot to type a comma in their JSON',
        ],
        correctIndices: [0, 1, 2],
        hint: 'Remember the golden rule: `4xx` = caller/client mistake, `5xx` = the server itself crashed inside the kitchen! Review Slide 25 & Slide 26.',
        reviewSlideNumber: 26,
        explanationEn:
          '200 = Success, 404 = Wrong/missing endpoint URL, 429 = Rate limit exceeded. A missing JSON comma causes 400 Bad Request, whereas 500 means an unexpected crash inside the server.',
        explanationBanglish:
          '200 mane success, 404 mane vul URL, 429 mane beshi speed-e call koray rate limit! Ar 500 mane server-er bhitore crash hoise (user-er JSON comma vul hole 400 hoy).',
      },
      {
        id: 'c2_q6',
        type: 'short-answer',
        prompt:
          'Your friend built a cool AI app and pasted their `GEMINI_API_KEY` directly into their React Frontend button click code. Explain in 2–3 sentences why this is dangerous and how to fix the architecture.',
        options: [],
        correctIndices: [],
        hint: 'Explain how anyone can steal it using Chrome DevTools Network/Sources and what sits in the middle to protect it. Review Slide 22 & Slide 31.',
        reviewSlideNumber: 22,
        explanationEn:
          'Any visitor can open Chrome DevTools Network tab, copy the exposed API key in seconds, and run up huge bills on the owner’s account. The fix is moving the key into a server-side `.env` file and having the Frontend call your own Backend endpoint, which securely forwards the request to the AI provider.',
        explanationBanglish:
          'Frontend-e API key rakhle je keu Chrome F12 Network tab theke 5 second-e key churi kore bill bariye dibe! Solution: key Backend `.env`-e rakha ebong Frontend -> Backend -> AI API flow follow kora.',
        rubricGuide:
          '2 pts: Explains DevTools key theft/billing risk AND recommends Backend proxy + .env. 1 pt: Mentions security risk but vague fix. 0 pts: Incorrect/empty.',
      },
    ],
  },
  3: {
    classId: 3,
    examVersion: 'v1',
    title: 'Class 03 Official Exam: Code, Frameworks, Databases & Tokens',
    subtitle:
      '5 auto-graded architecture questions + 1 short written synthesis covering Backend Languages, Supabase Databases, CRUD, Tokens & Context Windows.',
    passPercent: 80,
    estimatedMinutes: 15,
    questions: [
      {
        id: 'c3_q1',
        type: 'mcq',
        prompt:
          'You are building a React Frontend app and want to use ONE single programming language for both Frontend and Backend API routes. Which Backend stack fits best?',
        options: [
          'Node.js + Express (JavaScript / TypeScript)',
          'HTML + CSS only',
          'SQL + Chrome DevTools',
          'DNS + Postman',
        ],
        correctIndices: [0],
        hint: 'Compare the two Backend superstars from Part 1: Python (FastAPI) vs JavaScript (Node.js + Express). Review Slide 4 & Slide 7.',
        reviewSlideNumber: 7,
        explanationEn:
          'Node.js + Express lets you write both your React Frontend and Backend API routes in JavaScript/TypeScript, whereas Python + FastAPI shines for heavy AI/ML data pipelines.',
        explanationBanglish:
          'React-er sathe ek-i language (JavaScript/TypeScript) use korte chaile Node.js + Express best; ar AI/ML heavy kaj hole Python + FastAPI best!',
      },
      {
        id: 'c3_q2',
        type: 'mcq',
        prompt:
          'Why does a pure AI model feel like a "Goldfish" with zero memory unless you pair it with a Database like Supabase?',
        options: [
          'Because AI models delete your browser cookies automatically',
          'Because AI APIs are stateless — every new API call starts fresh unless your Backend loads past messages from a Database and sends them back in the Context Window',
          'Because JSON envelopes can only carry 1 word at a time',
          'Because FastAPI turns off RAM every 10 seconds',
        ],
        correctIndices: [1],
        hint: 'Remember our Goldfish vs Supabase CRUD lab and how Slide 28 assembles a stateful AI request! Review Slide 17 & Slide 28.',
        reviewSlideNumber: 28,
        explanationEn:
          'LLM APIs do not remember previous turns on their own (they are stateless). Your Backend queries past chat history from a Database (SELECT) and includes it in the new prompt’s Context Window.',
        explanationBanglish:
          'AI API stateless (Goldfish-er moto) — prottek call-e notun kore shuru kore! Tai Backend age Database theke purono chat load kore Context Window-te pathay.',
      },
      {
        id: 'c3_q3',
        type: 'mcq',
        prompt:
          'A user chats for 2 hours in one thread and the conversation exceeds the model’s Context Window token limit. What happens next?',
        options: [
          'The user’s laptop battery immediately drains',
          'The oldest messages at the top of the conversation get truncated/forgotten (or the API rejects the oversized prompt) so recent turns fit inside the token bucket',
          'Supabase automatically deletes the entire user account',
          'Tokens turn into CSS stylesheets',
        ],
        correctIndices: [1],
        hint: 'Think of the Context Window as a fixed-size water bucket — what happens when you pour more water in? Review Slide 25 & Slide 26.',
        reviewSlideNumber: 26,
        explanationEn:
          'The Context Window is a strict token ceiling (System Prompt + Chat History + New Prompt + Reply). Once full, the oldest messages drop out of working memory unless summarized or retrieved.',
        explanationBanglish:
          'Context Window ekta fixed balti (bucket)-r moto — token full hoye gele shobcheye purono message gula balti theke pore jay (AI vule jay)!',
      },
      {
        id: 'c3_q4',
        type: 'multi-select',
        prompt:
          'Select ALL TRUE statements about Databases, Tables, Foreign Keys, and CRUD:',
        options: [
          'A Table is like a structured spreadsheet tab (e.g., `users`, `messages`) with Rows for records and Columns for fields',
          'A Foreign Key (like `user_id` inside `messages`) connects rows across two tables without duplicating user info',
          'CRUD stands for Create (INSERT), Read (SELECT), Update (UPDATE), and Delete (DELETE)',
          'Saving data in a React `useState` variable keeps it permanently across devices 3 months later',
        ],
        correctIndices: [0, 1, 2],
        hint: 'Review how Supabase organizes tables, links them with Foreign Keys, and runs the 4 CRUD actions. Review Slide 14, 15 & 16.',
        reviewSlideNumber: 15,
        explanationEn:
          'Relational databases organize records into Tables connected by Foreign Keys and manipulated via CRUD (INSERT, SELECT, UPDATE, DELETE). React `useState` vanishes as soon as the tab reloads.',
        explanationBanglish:
          'Table holo spreadsheet-er moto, Foreign Key duita table-ke connect kore, ar CRUD (INSERT/SELECT/UPDATE/DELETE) diyei database-e shob kaj hoy!',
      },
      {
        id: 'c3_q5',
        type: 'multi-select',
        prompt:
          'Select ALL TRUE facts about AI Tokens (based on what we saw in the live GPT-4o Tiktokenizer):',
        options: [
          'AI models do not read raw English letters — they slice text into subword chunks called Tokens and convert them into numeric Token IDs',
          'Long or uncommon words (and many non-English scripts like Bangla) often split into MULTIPLE tokens, costing more than short English words',
          'API billing and Context Window limits are both measured in Tokens, not pages or sentences',
          'Every single English word is guaranteed to equal exactly 10 tokens',
        ],
        correctIndices: [0, 1, 2],
        hint: 'Recall the colored subword chips and raw numbers we inspected on the live Tiktokenizer screenshot! Review Slide 21 & Slide 22.',
        reviewSlideNumber: 22,
        explanationEn:
          'Tokenizers break text into subwords mapped to numeric IDs. Roughly 100 English tokens ≈ 75 words, while non-English scripts can take more tokens — and both cost & context limits count tokens.',
        explanationBanglish:
          'AI text-ke subword chunk (Token) ar numeric ID-te bhange; Bangla ba boro shobdo beshi token ney, ar bill + memory limit duitai Token hishebe count hoy!',
      },
      {
        id: 'c3_q6',
        type: 'short-answer',
        prompt:
          'You just completed 9 hours of AI Backend Foundations! Imagine you are explaining to a complete beginner how Frontend, Backend Code, Database, and an AI Model API work together in ONE stateful chat message. Write 3–4 clear sentences.',
        options: [],
        correctIndices: [],
        hint: 'Trace the 8-Stop Production AI Backend pipeline from Slide 30: Frontend → Backend Route → Database Read → AI API (with Tokens) → Database Save → UI Reply.',
        reviewSlideNumber: 30,
        explanationEn:
          'A complete synthesis covers: Frontend sends the user prompt via HTTPS POST to your Backend route (FastAPI/Express); Backend fetches past chat history from the Database (Supabase SELECT), builds the token Context Window, calls the AI Model API with its secret `.env` key, saves the new reply back to the Database (INSERT), and returns clean JSON to paint on the Frontend.',
        explanationBanglish:
          'Best answer-e pura cycle thakbe: Frontend POST pathay -> Backend route Database theke purono history load kore -> secret `.env` key diye AI API call kore -> notun reply Database-e INSERT kore save kore -> Frontend-e 200 OK reply dekhay!',
        rubricGuide:
          '2 pts: Connects all 4 pieces (Frontend, Backend route, Database read/save, AI API + tokens/key). 1 pt: Connects 2–3 pieces accurately. 0 pts: Incomplete or confused.',
      },
    ],
  },
};
