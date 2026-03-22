# 💪 Coach Bro — AI Gym Chatbot

A Friendly AI fitness coach that roasts your excuses, writes workout splits, and gives real gym advice. Built with React + Vite, powered by Groq (free AI API).

---

## 🖥️ Live Demo

> Add your Vercel link here after deploying

---

## 🚀 Features

- 💬 Chat with an AI gym coach that actually knows fitness
- 📋 Generates full workout splits (PPL, Upper/Lower, Full Body, etc.)
- 😤 Roasts your excuses in real time
- 🍗 Answers nutrition questions (protein, bulking, cutting, macros)
- ⚡ Quick-tap starter chips so you're never staring at a blank screen
- 📱 Fully responsive — works on mobile and desktop

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React + Vite | Frontend framework |
| Groq API | Free AI API (LLaMA 3.3 model) |
| CSS-in-JS | Styling (no external UI library) |
| Vercel | Deployment |

---

## 📁 Project Structure

```
fitness-chat-bot/
├── index.html          # Entry HTML file
├── package.json        # Project dependencies
├── vite.config.js      # Vite configuration
├── .env                # API key (never push this to GitHub)
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Main chatbot component (all code lives here)
```

---

## ⚙️ Getting Started Locally

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Fitness-chat-bot.git
cd Fitness-chat-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Groq API key

- Go to [console.groq.com](https://console.groq.com)
- Sign up for free (no credit card needed)
- Click **API Keys** → **Create API Key** → Copy it

### 4. Create a `.env` file in the root folder

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 5. Run locally

```bash
npm run dev
```

---

## 🌐 Deploying to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo → click **Deploy**
4. Go to **Settings → Environment Variables**
5. Add `VITE_GROQ_API_KEY` with your Groq API key
6. Click **Redeploy**

---

## 💡 How It Works

1. User types a message or clicks a starter chip
2. The message is sent to Groq's API along with a custom system prompt that defines Coach Bro's personality
3. Groq returns a response using the LLaMA 3.3 70B model
4. The response is displayed in the chat with a typing indicator while loading

---

## 🤖 Customizing the AI Personality

The entire personality of Coach Bro is defined in the `SYSTEM_PROMPT` constant at the top of `src/App.jsx`. Edit it to change how the coach talks, what topics it covers, or to build a completely different chatbot.

---
