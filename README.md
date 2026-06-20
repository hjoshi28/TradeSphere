# TradeSphere 📊

A high-contrast, minimalist full-stack virtual trading simulator and AI-powered portfolio management application. Built using the MERN stack (MongoDB, Express, React, Node.js), TradeSphere features real-time financial telemetry using the Finnhub API and provides custom portfolio risk auditing through Google's Gemini AI architecture.

---

## 🚀 Core Platform Modules

### 1. Identity Management & Secure Infrastructure
* **Stateful Sessions:** Implements standard JWT authorization lifecycles stored securely in `localStorage` for seamless view routing.
* **Cryptographic Hashing:** Salts and hashes data records using `bcryptjs` middleware inside MongoDB pipelines before persistence.
* **Protected Middleware:** Custom server-side validation intercepts unauthenticated API calls to secure data integrity.
* **Virtual Capital Ingestion:** Automatically provisions newly initialized investor balances with **$100,000** in mock simulation funds.

### 2. Real-Time Market Data Proxy Engine
* **Secure Key Abstraction:** Features a backend API routing gateway that communicates with the Finnhub Developer API, hiding premium private access keys from browser exposure.
* **Concurrent Lookup Processing:** Uses parallelized JavaScript execution loops (`Promise.all()`) on the backend to rapidly fetch multi-asset stock ticker quotes simultaneously.
* **Client Polling Interceptors:** Implements light interface data polling loops that fetch live valuation changes every 15 seconds without stalling page load cycles.

### 3. Stock Trading Simulator Terminal
* **Two-Way Order Routing:** Supports instant **BUY** and **SELL** trade logic matched directly to real-time asset market curves.
* **Server-Side Capital Validation:** Validates trades instantly against database state balances, blocking order entries if cash reserves are insufficient or if a user attempts to sell more shares than they own.
* **Transaction History Ledger:** Compiles a persistent, historical audit trail of all completed trades, displaying order states across custom data views.

### 4. Portfolio Management & Aggregation Analytics
* **Holdings Consolidation Engine:** Dynamically collapses fragmented purchases of duplicate symbols into neat asset rows while automatically recalculating the investment **Average Cost Basis**.
* **Asset Allocation Visuals:** Combines component mappings with `Recharts` data parsing to map active portfolio configurations into interactive pie charts broken down by market sector.
* **Mathematical Risk Score Calculation:** Calculates a sector concentration score (0–100) using internal formulas inspired by the Herfindahl-Hirschman Index model to instantly highlight diversification health.

### 5. Dynamic Watchlist Management System
* **Atomic MongoDB Array Updates:** Uses atomic array filters (`$addToSet` and `$pull`) to smoothly add and remove tracking targets without introducing data duplicates.
* **Ticker Pre-Flight Validation:** Queries market routers to confirm symbol validity before writing them to the database, ensuring invalid tickers are immediately blocked.
* **Daily Shift Tracking Badges:** Evaluates real-time daily movement metrics (+/- %) dynamically color-coded in muted typography fields.
* **Click-to-Load Interaction Bridge:** Allows users to select any asset on their watchlist to instantly load its telemetry and real-time pricing straight into the core order terminal execution panel.

### 6. AI-Powered Portfolio Auditor
* **Generative AI Risk Auditing:** Connects to Google's **Gemini API** (`gemini-2.5-flash`) via an internal network proxy layer to run on-demand portfolio rebalancing audits.
* **Contextual Data Injection:** Bundles active asset quantities, raw cost baselines, free cash balances, and sector concentration structures on the server to send a highly structured data context to the model.
* **Actionable Rebalancing Strategies:** Renders professional, concise strategy insights directly onto the user's dashboard view, giving actionable advice on how to deploy remaining cash to mitigate sector risks.

---

## 🛠️ Technical Stack & Architecture

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Client-Side Frontend** | React.js (v18), Vite, Tailwind CSS (v3), Recharts, React Router DOM (v6), Axios |
| **Server-Side Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, Mongoose ODM, Cors, Dotenv |
| **Database Architecture** | MongoDB (NoSQL Document Store) |
| **Third-Party Service APIs** | Finnhub Stock API, Google Gemini AI Engine (`gemini-2.5-flash`) |

---

## 🎨 Design Philosophy

TradeSphere rejects common, generic templates. Its design language is inspired by clean, developer-focused software environments like Linear, Stripe, and Vercel. 
* **Matte Black Canvas:** Avoids harsh glowing neon elements for a solid, minimal gray-and-black landscape (`#18181b` borders).
* **Intentional Color Coding:** Uses clean, muted tones of **Amethyst Purple** and **Pastel Rose Pink** to indicate financial growth and changes without adding visual clutter.
* **Readability Scale:** Features larger typography settings paired with bold labels (`font-black`, `font-bold`) to maintain high contrast and clear visual structure.

---

