# AI ChatBot (Gemini + React + TypeScript)

A real-time AI chatbot interface powered by Google Gemini Pro API, built with React, TypeScript, Tailwind CSS, and modern hooks. Designed with a macOS-style UI, typewriter animation, dark/light mode, and model switcher — suitable for production-ready use or portfolio projects.

[Watch Live App](https://ai-chat-bot-app-seven.vercel.app/)

## Features

- Gemini Pro API Integration
- Typewriter animation using a custom useTypewriter hook
- Dark/Light Mode toggle with useTheme.ts
- Model Selector Sidebar UI ready
- Real-time chat bubbles with timestamps
- Sticky footer and scroll-to-bottom behavior
- Fully responsive macOS-style UI
- Clean modular project structure

## Technologies Used

| Frontend     | Styling       | AI API               | Other        |
| ------------ | ------------- | -------------------- | ------------ |
| React + Vite | Tailwind CSS  | Gemini 1.5 Flash API | TypeScript   |
| Custom Hooks | Responsive UI | REST fetch           | ESLint, .env |

## Project Structure

```
src/
├── assets/
├── components/
├── hooks/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
├── index.tsx
```

## Challenges and Solutions

### 1. Gemini API trimming first word

- Issue: Gemini API occasionally returned incomplete first words.
- Fix: Added whitespace padding and adjusted `useTypewriter.ts` with `trimStart()`.
- Also added regex cleanup in gemini.ts to fix merged words.

### 2. TypeScript ESLint warnings

- Resolved `prefer-const`, `implicit any` errors by explicitly typing parameters and constants.

### 3. UI and UX refinement

- Focused on clean, modern styling with Tailwind.
- Ensured keyboard accessibility and layout responsiveness.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/archit-react/ai-chatbot.git
cd ai-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Get your key from: https://aistudio.google.com/app/apikey

### 4. Start Development Server

```bash
npm run dev
```

## Future Improvements

- Streaming responses
- Voice input support
- Unit testing with Vitest and React Testing Library
- Firebase sync for chat history
- Multi-language support

## Author

Archit Sharma  
Front-End Developer | Chandigarh, India

- GitHub: https://github.com/archit-react
- LinkedIn: https://www.linkedin.com/in/archit-react

## License

MIT License
