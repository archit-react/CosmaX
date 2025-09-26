# CosmaX (AI ChatBot · Gemini + React + TypeScript + Vercel Backend)

A futuristic AI chatbot interface powered by **Google Gemini API**, now upgraded to a **full-stack architecture**. Built with React, TypeScript, Tailwind CSS, and Express-style serverless APIs on Vercel. Features a secure backend proxy for Gemini API calls, lightweight auth/rate-limiting, and a dark JSR-inspired theme with animated UI.

[Live Project](https://cosmax.vercel.app/)

---

## Preview

<br><br>

![CosmaX UI](./screenshots/cosmax-ui.png)

<br><br>

![CosmaX Chat UI](./screenshots/chat-ui.png)

---

## Features

- **Full-stack Gemini API Integration**  
  - Serverless backend (`/api/chat`) proxies requests → API key never exposed  
  - Automatic model fallback (`gemini-2.5-flash`, `gemini-2.5-pro`, etc.)  

- **Security & Reliability**  
  - shared-secret auth (`x-cosmax-key`) between frontend ↔ backend  
  - Simple per-IP rate limiting (prevents spam/abuse)  
  - Minimal logging (no full prompts stored)  

- **UI & Branding**  
  - Typewriter animation for bot replies (`useTypewriter` hook)  
  - CosmaX dark themed background + particles (space-inspired)
  - Custom favicon & logo branding (robotics-inspired)  
  - Scroll-to-bottom floating button with smooth Framer Motion animations  
  - Chat bubbles with timestamps styled with glassmorphism  
  - Responsive macOS-style layout (desktop + mobile)  

- **Smart UX**  
  - Hero section → logo transitions from center to corner when chat begins  
  - Optimized file structure with clean TypeScript types  

---

## Technologies Used

| Frontend       | Styling       | Backend / API      | AI Model             | Other Tools   |
| -------------- | ------------- | ------------------ | -------------------- | ------------- |
| React + Vite   | Tailwind CSS  | Vercel Serverless  | Gemini 2.5 (Flash/Pro) | TypeScript    |
| Framer Motion  | Responsive UI | Express-style APIs | REST fetch proxy     | ESLint, .env  |

---

## Project Structure

```
api/
└── chat.ts              # Backend proxy: Gemini API call + auth + rate limiting

src/
 ┣ assets/
 ┃ ┣ favicon.svg
 ┃ ┗ react.svg
 ┣ components/
 ┃ ┣ ChatMessage.tsx
 ┃ ┣ Composer.tsx
 ┃ ┣ CosmaXLogo.tsx
 ┃ ┣ ParticlesBackground.tsx
 ┃ ┣ ScrollToBottom.tsx
 ┃ ┗ SocialLinks.tsx
 ┣ hooks/
 ┃ ┗ useTypewriter.ts
 ┣ pages/
 ┃ ┗ Home.tsx
 ┣ services/
 ┃ ┗ gemini.ts           # Frontend → backend API wrapper
 ┣ types/
 ┃ ┗ chat.ts
 ┣ App.tsx
 ┣ index.css
 ┣ main.tsx
 ┗ vite-env.d.ts
```

---

## Challenges and Solutions

### 1. API Key Security  
- Issue: Frontend-only setup exposed API key risk  
- Fix: Added backend `/api/chat` route. The key now lives only on the server  

### 2. Abuse Prevention  
- Added per-IP rate limiting in backend (configurable via `.env`)  
- Added shared-secret header (`x-cosmax-key`) so only allowed frontends can call API  

### 3. Model Reliability  
- Gemini API models sometimes return `403/404`  
- Fix: Implemented fallback strategy → tries multiple candidates until success  

### 4. UI Refinements  
- Unified dark background across components  
- Added Framer Motion scroll-to-bottom button  
- Refined Composer positioning for clean responsive layouts  

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/archit-react/cosmax.git
cd cosmax
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
# Gemini API Key (server-only, never exposed to browser)
GEMINI_API_KEY=your_gemini_api_key

# Optional: simple shared-secret auth (frontend + backend must match)
COSMAX_CLIENT_KEY=your-strong-secret
VITE_COSMAX_CLIENT_KEY=your-strong-secret

# Optional: basic per-IP rate limiting
RATE_LIMIT_COUNT=30
RATE_LIMIT_WINDOW_MS=60000
```

### 4. Start Development Server

```bash
npm run dev
```

---

## Future Improvements

- Streaming responses (token-by-token)  
- Voice input + speech output  
- Persistent chat history (Firebase/DB)  
- Authentication (Google login, per-user limits)  
- Multi-language support  
- Unit tests with Vitest + RTL  

---

## Author

**Archit Sharma**  
Full-Stack Developer | Chandigarh, India  

- [GitHub](https://github.com/archit-react)  
- [LinkedIn](https://www.linkedin.com/in/archit-react)  

---

## License

MIT License  
