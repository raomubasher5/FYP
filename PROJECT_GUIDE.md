# Automatrix: Enterprise-Grade Modular Architecture (MongoDB)

Unified AI Agent-Powered Social Media Management Platform — **Layered (Controller-Service-Repository) Architecture**, **Factory Pattern for AI providers**, **Strategy Pattern for multi-channel publishing**, backed by a **real MongoDB database** (Mongoose).

> **Honest-data policy (important):** This application contains **no dummy/seeded data**.
> The database starts empty. Every number shown in the UI (KPIs, charts, sentiment,
> recommendations) is computed from **real data stored in MongoDB**. Where data does
> not exist yet, the UI shows honest empty states ("—", zero, "No data yet") instead of
> fabricated figures. Publishing runs in a clearly-labeled **sandbox simulation**:
> dispatch receipts are recorded locally, but **no real platform API call is made,
> no fake URLs are generated, and no engagement metrics are invented**.

---

## 1. Quick Start

```bash
npm run setup        # installs root + client deps, builds the client
npm run dev:mongo    # terminal 1: start a REAL local MongoDB (mongod via mongodb-memory-server)
npm start            # terminal 2: start the Express API + serve the built client (port 3000)
# -> http://localhost:3000
```

Or use your own database (local `mongod` or MongoDB Atlas) — set in `.env`:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/automatrix
```

**Verify the real-data pipeline end-to-end:**

```bash
node scripts/verify-mongo.js   # full lifecycle smoke test with dummy-data assertions
```

---

## 2. Modular Directory Breakdown

```
automatrix/
├── backend/
│   └── src/
│       ├── config/            # Environment & configuration registry (incl. MONGO_URI)
│       │   └── index.js
│       ├── models/            # Mongoose schemas (real MongoDB collections)
│       │   ├── BusinessProfile.js   # singleton business profile (empty until user fills it)
│       │   ├── SocialAccount.js     # user-registered real channels
│       │   ├── Post.js              # post pipeline: draft -> scheduled -> published
│       │   ├── Log.js               # operational audit log
│       │   └── Comment.js           # real audience comments imported for sentiment
│       ├── db/
│       │   └── mongo.js       # Mongoose connection lifecycle (fail-fast + graceful close)
│       ├── controllers/       # HTTP Request / Response handling (thin, one class per resource)
│       │   ├── PostController.js      # post lifecycle endpoints
│       │   ├── ProfileController.js   # business profile + AI provider configuration
│       │   ├── AccountController.js   # channel registration, connection toggle, sandbox/live mode
│       │   ├── AnalyticsController.js # metrics overview + real audience comment import
│       │   ├── SystemController.js    # audit logs + workspace reset
│       │   └── index.js               # aggregator (exports all controllers)
│       ├── services/          # Core Business Logic & Orchestration
│       │   ├── ai/            # AI Engine — Factory & Strategy pattern
│       │   │   ├── BaseAIProvider.js  # Abstract interface contract
│       │   │   ├── MockAIProvider.js  # Fully offline template engine (no network, no images)
│       │   │   ├── ContextualAIProvider.js # Offline contextual templates + live AI images
│       │   │   ├── GeminiProvider.js  # Real Google Gemini LLM
│       │   │   ├── GroqProvider.js    # Real Groq Llama LLM
│       │   │   └── index.js           # AIFactory & AIService facade
│       │   ├── insights/
│       │   │   └── InsightEngine.js   # Data-driven recommendations from REAL post metrics
│       │   ├── publishers/    # Multi-Channel Publishing — Strategy Pattern (sandbox receipts,
│       │   │   └── index.js          #   no live API calls, no fabricated URLs/metrics)
│       │   ├── PostService.js         # Post lifecycle & domain logic
│       │   ├── SchedulerService.js    # Background worker (mutex lock & timer)
│       │   └── AnalyticsService.js    # Real metrics aggregation, 7-day trend, NLP delegation
│       ├── repositories/      # DAO / Data Access Layer (Mongoose, one module per collection)
│       │   ├── PostRepository.js
│       │   ├── AccountRepository.js
│       │   ├── ProfileRepository.js
│       │   ├── LogRepository.js
│       │   ├── CommentRepository.js
│       │   └── index.js       # aggregator (exports all repositories)
│       ├── routes/            # One dedicated router file per resource
│       │   ├── postRoutes.js          # /api/posts (+ /generate, /:id/approve, /:id/publish-now)
│       │   ├── profileRoutes.js       # /api/profile (+ /ai-config)
│       │   ├── accountRoutes.js       # /api/accounts (+ /:id/toggle, /:id/mode)
│       │   ├── analyticsRoutes.js     # /api/analytics (+ /comments)
│       │   ├── systemRoutes.js        # /api/system (+ /logs, /reset)
│       │   └── index.js               # aggregator (mounts all routers under /api)
│       ├── middlewares/       # Centralized error handler, request logger
│       ├── utils/             # ApiResponse envelope, AppError, asyncHandler
│       ├── app.js             # Express application setup
│       └── server.js          # Mongo connect -> scheduler -> HTTP, graceful shutdown
├── client/
│   └── src/
│       ├── services/api/      # API client + endpoint modules
│       ├── hooks/             # useAppEngine — state sync & polling
│       ├── context/           # AppContext, ThemeContext
│       ├── components/
│       │   ├── common/        # Reusable UI primitives + ThemeToggle
│       │   ├── layout/        # AppLayout, Header, Sidebar
│       │   ├── SocialPreviews.jsx  # Native channel mockups (no fake engagement counts)
│       │   ├── AnalyticsTab.jsx     # Real KPIs, imported comments, data-driven recommendations
│       │   ├── AccountsTab.jsx      # Register real channels, sandbox/live mode, honest notices
│       │   ├── StudioTab.jsx        # AI composer with editable per-platform drafts
│       │   ├── QueueTab.jsx         # Approvals & lifecycle pipeline
│       │   └── CalendarTab.jsx      # Content calendar planner
│       ├── pages/             # Dashboard, Composer, Calendar, Queue, Analytics, Channels,
│       │                      #   Settings, Onboarding
│       ├── App.jsx
│       └── index.css
├── scripts/
│   ├── mongo-local.js         # Real local mongod for development (mongodb-memory-server)
│   └── verify-mongo.js        # End-to-end verification with dummy-data assertions
├── .env                       # Local environment (MONGO_URI, AI keys, scheduler)
├── .env.example
└── package.json
```

---

## 3. Why this is Production / Industrial Standard

1. **Separation of Concerns (SoC):**
   * **Controllers** only handle HTTP inputs/outputs.
   * **Services** contain business logic and rule validation.
   * **Repositories** manage all MongoDB access via Mongoose — zero query logic leaks into business code.
   * **Publishers** isolate each platform behind the **Strategy Pattern**.

2. **Real Persistence (MongoDB + Mongoose):**
   * Typed schemas with indexes, unique constraints and JSON transforms.
   * Fail-fast connection at boot with an actionable error message.
   * Graceful shutdown: scheduler stop -> HTTP close -> `mongoose.disconnect()`.

3. **Decoupled AI Engine (Factory Pattern):**
   * `BaseAIProvider` contract; switch `mock | contextual | gemini | groq` via `.env` or the in-app Settings (no restart).
   * Gemini/Groq make **real LLM calls**; their images are generated from the LLM's own `imagePrompt` (Pollinations diffusion API) — never a hardcoded stock photo.

4. **Data-Driven Insights, Not Invented Ones:**
   * `InsightEngine` computes recommendations (top channel, best posting window, top topic) **only** from real published posts and their recorded metrics. No data -> empty list -> honest UI empty state.
   * Sentiment analysis runs only over **real comments the user imports** (Analytics -> "Imported Audience Comments").

5. **Standardized API Responses:**
   ```json
   { "success": true, "statusCode": 200, "message": "...", "data": { ... }, "timestamp": "..." }
   ```

6. **Graceful Process Lifecycle:** SIGTERM/SIGINT handled; timers cleared; DB streams closed before exit.

---

## 4. API Surface (under `/api`)

| Method | Route | Purpose |
|---|---|---|
| GET/POST | `/posts` | list / create posts |
| GET/PUT/DELETE | `/posts/:id` | read / update / delete |
| POST | `/posts/generate` | AI multi-platform generation |
| POST | `/posts/:id/approve` | draft -> scheduled |
| POST | `/posts/:id/publish-now` | publish (sandbox simulation) |
| GET/PUT | `/profile` | business profile (singleton) |
| POST | `/profile/ai-config` | switch AI provider at runtime |
| GET/POST | `/accounts` | list / **register real channels** |
| POST | `/accounts/:id/toggle` | connect / disconnect |
| POST | `/accounts/:id/mode` | sandbox / live mode |
| DELETE | `/accounts/:id` | remove channel |
| GET | `/analytics` | real overview, sentiment, comments, recommendations, 7-day trend |
| POST | `/analytics/comments` | import a real audience comment |
| GET | `/logs` | audit log |
| POST | `/system/reset` | clear posts/comments/logs (profile & channels kept) |

---

## 5. Environment Variables (`.env`)

| Variable | Default | Notes |
|---|---|---|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/automatrix` | Your real database (local or Atlas) |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | Express API + production client |
| `AI_PROVIDER` | `mock` | `mock` \| `contextual` \| `gemini` \| `groq` |
| `GEMINI_API_KEY` / `GROQ_API_KEY` | — | Required for the corresponding provider |
| `SCHEDULER_INTERVAL_MS` | `4000` | Background publish-worker tick |
