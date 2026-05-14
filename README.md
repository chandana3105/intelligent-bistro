# 🍽️ The Intelligent Bistro

A premium mobile dining experience where guests browse the menu, customize dishes, and manage their order through a conversational AI waiter — all wrapped in a high-fidelity React Native UI.

> Built as a take-home challenge to demonstrate effective use of AI coding tools (Claude Code) to ship production-quality software fast.

---

## ✨ What it does

| Capability | Where to try it |
|---|---|
| Conversational ordering — "Add two spicy chicken sandwiches and a large water" | **AI Waiter** tab |
| Mood-driven recommendations — tap a chip like "Date night" and the AI plans a meal | **Home** tab |
| Browse menu by category with photos | **Menu** tab |
| Tap any dish for a hero photo + customizations (spice level, doneness, add-ons, sauce, etc.) | Tap any menu card |
| Cart with per-customization rows, quantity controls, tax/total | **Cart** tab |
| Time-of-day greeting + cart summary | **Home** tab |

The AI returns structured JSON (`{ message, actions[], suggestions[] }`) that the client interprets into cart mutations with haptic feedback.

---

## 🧱 Architecture

```
bistro/
├── client/                       # Expo React Native app (TypeScript)
│   ├── app/(tabs)/               # Expo Router file-based tabs
│   │   ├── index.tsx             #   Home — greeting, mood chips, CTAs
│   │   ├── menu.tsx              #   Menu — categorized list with photos
│   │   ├── chat.tsx              #   AI Waiter conversation
│   │   └── cart.tsx              #   Cart with totals and checkout
│   ├── components/
│   │   └── DishDetailModal.tsx   # Hero image + customization sheet
│   ├── hooks/useChat.ts          # Chat state + applies AI actions to cart
│   ├── store/cartStore.ts        # Zustand cart store with cartKey for variants
│   ├── utils/api.ts              # parseOrder() / fetchMenu()
│   └── assets/                   # icon.png, logo-mark.png, splash.png
└── server/                       # Node.js + Express
    ├── index.js                  # Helmet + CORS + rate limit + routing
    ├── menu.js                   # Menu data with images, options, prices
    └── routes/orders.js          # POST /parse — calls Claude with structured prompt
```

---

## 🛠 Tech stack

| Layer | Choice | Why |
|---|---|---|
| Mobile | **React Native + Expo SDK 54** | One codebase, fast iteration via Expo Go |
| Routing | **expo-router** | File-based tabs, deep-link friendly |
| Styling | StyleSheet + LinearGradient + BlurView | Premium dark-gold theme, no theme-library overhead |
| State | **Zustand** | Tiny global store, no boilerplate |
| Backend | **Node.js + Express 5** | Familiar, instant to set up |
| Security | helmet, cors, express-rate-limit | Standard middleware hygiene |
| AI | **Anthropic Claude** (`claude-sonnet-4-5`) | Strong instruction-following + structured-JSON output |
| Haptics | expo-haptics | Tactile feedback on every cart mutation |

---

## 🤖 How the AI works

**System prompt** (`server/routes/orders.js`) gives Claude:
- A compact menu (id | name | price | category | tags)
- A strict JSON schema for replies
- Rules for matching items by name/tags ("water" → still or sparkling), handling ambiguity, staying in waiter persona

**Per-request**, the server forwards the user's message plus a short cart context (`"Current cart: 1x Wagyu Burger"`) so Claude can reason about modifications.

**Response shape** the client expects back:
```json
{
  "message": "Two spicy chicken sandwiches and a large still water coming right up! 🌶️",
  "actions": [
    { "type": "add", "itemId": "m1", "quantity": 2 },
    { "type": "add", "itemId": "d1", "quantity": 1, "note": "Large" }
  ],
  "suggestions": ["Add truffle fries?", "What about dessert?"]
}
```

The server enriches each action with full menu data, then the client's `useChat` hook applies actions to the Zustand store (add/remove/update_quantity/clear_cart) and triggers light/medium/warning haptics.

---

## 🚀 Running it locally

### Prerequisites
- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- iPhone/Android with **Expo Go** app installed, OR an emulator/simulator

### 1 — Backend

```bash
cd server
npm install

# Create .env with your API key
echo ANTHROPIC_API_KEY=sk-ant-api03-... > .env
echo PORT=3001 >> .env

npm run dev
```

Server runs on `http://localhost:3001`. Health check: `GET /health`.

### 2 — Frontend

```bash
cd client
npm install --legacy-peer-deps
npx expo start
```

**Important** — set the API base URL for your environment in [`client/utils/api.ts`](client/utils/api.ts):

| Target | `API_BASE_URL` |
|---|---|
| iOS Simulator / Web | `http://localhost:3001` |
| Android Emulator | `http://10.0.2.2:3001` |
| Physical phone (Expo Go) | `http://YOUR.LAN.IP:3001` (find via `ipconfig` on Windows / `ifconfig` on Mac) |

For physical-device testing on Windows, ensure firewall allows port 3001:
```powershell
New-NetFirewallRule -DisplayName "Bistro Server" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

Then scan the QR code from the Expo dev server with Expo Go.

---

## 🎨 Design system

- **Background** — `#1A1008` warm espresso (with `#0D0804` gradient end)
- **Primary** — `#D4A853` gold
- **Cards** — `#211508` with `#2A1E10` subtle borders
- **Text** — `#F0E8D8` cream
- **Muted** — `#8A7050` dusty gold

Mark / icon — minimalist crossed fork & knife. Two variants:
- `assets/icon.png` — cream + dark mark (iOS/Android home-screen icon)
- `assets/logo-mark.png` — transparent gold mark (in-app branding)
- `assets/splash.png` — gold mark on dark for the launch screen

---

## 🔑 API surface

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/orders/menu` | GET | Full menu grouped by category, with images & options |
| `/api/orders/parse` | POST | Send `{ message, cartContext[] }`, get `{ message, actions[], suggestions[] }` |
| `/health` | GET | Liveness check |

`/api/orders/*` is rate-limited to **30 req/min per IP**.

---

## 🧠 AI-assisted development

This project was built primarily using **Claude Code (Sonnet 4.6 / 4.7)** as a pair-programmer. Notable workflow:

- Whole-app scaffolding from the challenge spec in a single session
- Iterative UI refinement against phone screenshots (e.g. fixing tab-bar overlap, mojibake emoji, splash config)
- Debugging the dev environment (broken `dotenv` env-var precedence on Windows, firewall rules for physical-device testing, Expo SDK version mismatch)
- Generating brand assets (icon, logo, splash) programmatically via `System.Drawing` since no design tool was set up

The end result: an idiomatic, structured codebase that doesn't read as AI-generated — clear separation of concerns, no over-engineering, no dead code.

---

## 🗺 What I'd add next

- **AI-driven customization** — extend the system prompt so the AI can say "Medium-Rare Wagyu burger with bacon" and it routes to the dish detail logic
- **Order persistence** — currently checkout is `Alert.alert`; wire up to a DB and an order-status screen
- **Image responses in chat** — let the AI surface a dish photo inline when recommending
- **Pull-to-refresh on chat** with conversation summarization
- **Tablet layout** — currently iPhone-first; tablet would benefit from a master/detail split

---

## 📄 License

Built for evaluation. MIT-equivalent — feel free to read, learn, fork.
