# Automatrix: Enterprise-Grade Clean Modular Architecture

This project has been re-architected to meet **production software engineering standards** using the **Layered (Controller-Service-Repository) Architecture**, **Factory Pattern for AI providers**, and **Strategy Pattern for multi-channel publishing**.

---

## 1. Modular Directory Breakdown

```
automatrix/
├── backend/
│   ├── src/
│   │   ├── config/               # Environment & configuration registry (.env validator)
│   │   │   └── index.js
│   │   ├── controllers/          # HTTP Request / Response handling (Clean, thin controllers)
│   │   │   ├── PostController.js
│   │   │   ├── index.js          # ProfileController, AccountController, etc.
│   │   ├── services/             # Core Business Logic & Orchestration
│   │   │   ├── ai/               # AI Engine with Factory & Strategy pattern
│   │   │   │   ├── BaseAIProvider.js  # Abstract interface contract
│   │   │   │   ├── MockAIProvider.js  # Decoupled mock provider (empty AI module)
│   │   │   │   └── index.js           # AIFactory & AIService facade
│   │   │   ├── publishers/       # Multi-Channel Publishing Strategy Pattern
│   │   │   │   └── index.js           # Twitter, Instagram, Facebook, TikTok publishers
│   │   │   ├── PostService.js         # Post lifecycle & domain logic
│   │   │   ├── SchedulerService.js    # Background worker with mutex lock & timer
│   │   │   └── AnalyticsService.js    # Metrics aggregator & NLP delegator
│   │   ├── repositories/         # DAO / Data Access Layer (Abstracts database storage)
│   │   │   ├── BaseRepository.js      # Storage interface & persistence engine
│   │   │   ├── PostRepository.js      # Post database queries & mutations
│   │   │   └── index.js               # AccountRepository, ProfileRepository, LogRepository
│   │   ├── routes/               # Modular REST API routing
│   │   │   ├── postRoutes.js
│   │   │   └── index.js               # Root router aggregating sub-routers
│   │   ├── middlewares/          # Standard enterprise middlewares
│   │   │   ├── errorHandler.js        # Centralized error handler
│   │   │   └── requestLogger.js       # HTTP request logger
│   │   ├── utils/                # Standardized response envelopes & custom errors
│   │   │   ├── ApiResponse.js         # JSend-style standard: { success, statusCode, data, message }
│   │   │   ├── AppError.js            # Operational custom error class
│   │   │   └── asyncHandler.js        # High-order function eliminating try/catch blocks
│   │   ├── app.js                # Express application setup
│   │   └── server.js             # Process lifecycle, port binding & graceful shutdown
│   └── data/
│       └── db.json               # Persisted datastore
├── client/
│   ├── src/
│   │   ├── services/api/         # Axios-like API client with response interceptors
│   │   │   ├── client.js              # Base fetch wrapper with error unwrapping
│   │   │   ├── postApi.js             # Post endpoints
│   │   │   ├── accountApi.js          # Channel endpoints
│   │   │   └── index.js
│   │   ├── hooks/                # Custom React Hooks
│   │   │   └── useAppEngine.js        # State synchronization & polling engine
│   │   ├── components/
│   │   │   ├── common/                # Reusable UI primitives (Button, Badge, Card, Toast)
│   │   │   ├── SocialPreviews.jsx     # Native channel UI mockups (IG, TW, FB, TikTok)
│   │   │   ├── Navbar.jsx             # Top brand header & live scheduler indicators
│   │   │   ├── DashboardTab.jsx       # Overview KPIs & audit activity stream
│   │   │   ├── StudioTab.jsx          # AI multi-platform composer
│   │   │   ├── CalendarTab.jsx        # Content calendar planner
│   │   │   ├── QueueTab.jsx           # Post approvals & lifecycle pipeline
│   │   │   ├── AnalyticsTab.jsx       # NLP sentiment analysis & recommendations
│   │   │   ├── AccountsTab.jsx        # Channel OAuth & sandbox manager
│   │   │   └── SettingsTab.jsx        # Business profile & AI mode configuration
│   │   ├── App.jsx               # Decoupled root presentation view
│   │   └── index.css
│   └── package.json
├── .env                          # Local environment variables
├── .env.example                  # Environment template
└── package.json                  # Root runner & build scripts
```

---

## 2. Why this is Production / Industrial Standard

1. **Separation of Concerns (SoC):**
   * **Controllers** only handle HTTP inputs/outputs and response status codes.
   * **Services** contain business logic and rule validations.
   * **Repositories** manage data access and persistence, completely decoupling database queries from business rules.
   * **Publishers** isolate each social media network's API specifics using the **Strategy Pattern**.

2. **Decoupled AI Engine (Factory Pattern):**
   * The AI module is abstracted behind `BaseAIProvider`.
   * Switching between `Mock`, `Gemini`, `Groq`, or `OpenAI` requires changing **only `AI_PROVIDER`** in `.env`.

3. **Standardized API Responses:**
   * Every endpoint returns an enterprise response envelope:
   ```json
   {
     "success": true,
     "statusCode": 200,
     "message": "Resource retrieved successfully",
     "data": { ... },
     "timestamp": "2026-09-24T10:30:00.000Z"
   }
   ```

4. **Graceful Process Lifecycle:**
   * Handles `SIGTERM` and `SIGINT` signals, safely clearing timers and closing database streams before exiting.
