# Actionable Links

Actionable Links is an interactive onboarding and guide delivery platform that transforms static content (YouTube videos, website links, or text instructions) into live, step-by-step walkthroughs directly on target web interfaces.

The platform consists of a Next.js Creator Console, a shared validation package, and a browser-extension overlay HUD player, powered by Google Gemini 2.5 Flash for automatic step extraction.

---

## 📂 Project Structure

```text
ActionLinks/
├── actionable-links-extension/  # Vite + React + TypeScript Chrome MV3 Extension (HUD Player)
├── app/                         # Next.js 15 + Supabase Web App (Creator Console & API Gateway)
├── packages/
│   └── shared/                  # Shared Zod validation schemas & TypeScript types
├── generate_report.py           # Programmatic PDF report builder
└── README.md                    # Project Documentation
```

### 1. [Shared Package](file:///e:/ActionLinks/packages/shared)
Declares unified data models and schemas used by both the extension player and Next.js portal:
* `StepSchema`: Model for target actions (selectors, types like click/input/hover, and directions).
* `TutorialSchema`: Schema representing guides, estimates, hostnames, and step groupings.
* `ProgressSchema`: Tracks current and completed step indices.

### 2. [Next.js App Portal](file:///e:/ActionLinks/app)
The backend engine and tutorial management dashboard:
* **Database**: Runs on PostgreSQL (via Supabase) with active RLS (Row Level Security) policies protecting user progress and private guides.
* **AI Generation**: Leverages the Gemini 2.5 Flash API to digest YouTube transcripts or website scrapes and compile validated interactive walkthrough steps.
* **API Gateways**: Exposes endpoints (`/api/v1/*`) with custom CORS credentials headers allowing the Chrome extension to query templates and save progress.

### 3. [Chrome Extension Player](file:///e:/ActionLinks/actionable-links-extension)
The frontend runtime player injected on target websites:
* **Shadow DOM Isolation**: Mounts HUD panels inside a custom Shadow Root (`#actionlinks-extension-root`) to protect styles from host site collisions.
* **Spotlight SVG Cutout**: Renders a dark backdrop with an SVG mask cutout to visually highlight active HTML selectors.
* **Dynamic DOM Observer**: Uses `MutationObserver` to watch for element injection inside Single Page Apps (SPAs), recovering missing step targets automatically.
* **Popup Dashboard**: Lists available guides matching the user's active tab domain.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher, v22 recommended)
* **npm** or **yarn**
* **Supabase account** (or local docker CLI instance)

### 1. Set Up the Shared Package
First, navigate to the shared directory and install dependencies to prepare typing references:
```bash
cd packages/shared
npm install
```

### 2. Configure and Run the Web App
1. Navigate to the `app` directory:
   ```bash
   cd ../../app
   npm install
   ```
2. Copy `.env.example` to `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
3. Run migrations on your Supabase dashboard or using the Supabase CLI using the SQL files inside `app/supabase/migrations/`.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The portal will be running at `http://localhost:3000`.

### 3. Build and Load the Chrome Extension
1. Navigate to the extension directory:
   ```bash
   cd ../actionable-links-extension
   npm install
   ```
2. Start the Vite bundler in watch mode:
   ```bash
   npm run dev
   ```
   This will compile files into the `dist/` directory.
3. Open your browser and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the `dist/` directory inside `actionable-links-extension`.

---

## 🛠️ Technical Design Highlights

* **Styling Security**: The extension bundles overlay CSS separately and loads it using `chrome.runtime.getURL("assets/overlay.css")` inside the Shadow Root.
* **Dynamic State Syncing**: Background worker adapter captures local state and triggers `SYNC_PROGRESS` calls asynchronously, writing backups to Chrome Extension Local Storage.
* **Schema Safety**: API responses are validated at runtime via `safeParse` to prevent faulty element actions from breaking page operations.
