import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are COACH BRO — the most jacked, no-nonsense, hilarious gym coach on the planet. You're a hybrid of a powerlifter, bodybuilder, and sports scientist who actually knows what they're talking about.

YOUR PERSONALITY:
- Call the user "bro" constantly (but not every single sentence)
- Brutally roast excuses ("I don't have time" = "You have time to scroll Instagram for 2 hours tho?")
- Hype them up when they share wins or PRs ("LETS GOOO BRO THAT'S INSANE")
- Use gym slang naturally: "gains", "PR", "natty", "swole", "pump", "bulk", "cut", "hypertrophy", "progressive overload"
- Occasionally use ALL CAPS for emphasis on important points
- Use emojis sparingly but effectively: 💪🔥😤📈
- Keep it fun, energetic, never boring — but always give REAL, ACCURATE fitness advice

YOUR KNOWLEDGE BASE:
- Program design: PPL, Upper/Lower, Full Body, 5/3/1, GZCLP, nSuns, PHUL, PHAT
- Nutrition: TDEE, macros, bulking/cutting/recomp, protein timing, creatine, caffeine
- Exercise science: progressive overload, RPE, RIR, periodization, deload weeks, volume landmarks
- Big lifts: squat, bench, deadlift, OHP form cues and common mistakes
- Hypertrophy principles: 10-20 sets per muscle per week, mechanical tension, metabolic stress
- Recovery: sleep, DOMS, active recovery, when to push vs rest
- Common excuses and how to demolish them

RESPONSE STYLE:
- Keep responses punchy and scannable — use short paragraphs or quick bullet points
- For workout splits, format them clearly with days and exercises
- Always end with a challenge or call to action ("Now stop reading and GO LIFT")
- If someone mentions an injury, be responsible and tell them to see a physio — no bro science on injuries
- Max 250 words per response unless writing a full program`;

const STARTER_CHIPS = [
  { emoji: "📋", text: "Write me a PPL split" },
  { emoji: "😤", text: "Roast my excuse — I'm too tired" },
  { emoji: "🍗", text: "How much protein do I actually need?" },
  { emoji: "📈", text: "I just hit a new bench PR!" },
  { emoji: "🧱", text: "How do I start a bulk?" },
  { emoji: "💀", text: "I haven't trained in 3 months" },
];

const ROAST_LINES = [
  "The weights aren't gonna lift themselves, bro. 😤",
  "Every second you wait, someone else is getting jacked. Just saying. 💪",
  "What's the excuse today? Let's hear it so I can destroy it. 🔥",
  "You came here for a reason. Let's get to work. 📈",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 18px", alignItems: "center" }}>
      <span style={{ fontSize: "0.78rem", color: "#f5c518", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em", marginRight: 6 }}>BRO IS THINKING</span>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#f5c518",
          display: "inline-block",
          animation: `blink 1s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function GymBroCoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roastIndex] = useState(() => Math.floor(Math.random() * ROAST_LINES.length));
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...newMessages,
    ],
  }),
});
if (!res.ok) throw new Error("Coach is offline. Try again.");
const data = await res.json();
const reply = data.choices?.[0]?.message?.content || "...";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message);
      setMessages(newMessages.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #e8e8e8;
          font-family: 'Barlow', sans-serif;
          min-height: 100vh;
          overflow: hidden;
        }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.9); }
          40% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(245,197,24,0); }
        }

        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100%;
          margin: 0 auto;
          background: #0d0d0d;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid texture */
        .app::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,197,24,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: 2px solid #f5c518;
          background: #0d0d0d;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .header-badge {
          background: #f5c518;
          color: #0a0a0a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          width: 48px; height: 48px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          animation: pulse-border 2.5s ease-in-out infinite;
        }

        .header-info { flex: 1; }

        .header-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.1em;
          color: #f5c518;
          line-height: 1;
        }

        .header-sub {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
          margin-top: 2px;
        }

        .status-dot {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
          box-shadow: 0 0 6px #22c55e;
        }

        .chat-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 20px 10px;
          position: relative;
          z-index: 1;
        }

        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          animation: fadeIn 0.5s ease;
          gap: 0;
        }

        .empty-mascot {
          font-size: 64px;
          animation: shake 2.5s ease-in-out infinite;
          display: block;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 16px rgba(245,197,24,0.3));
        }

        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          letter-spacing: 0.08em;
          color: #f5c518;
          line-height: 1;
          margin-bottom: 8px;
        }

        .empty-sub {
          color: #888;
          font-size: 0.88rem;
          max-width: 320px;
          line-height: 1.5;
          margin-bottom: 28px;
        }

        .chips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
          max-width: 420px;
        }

        .chip {
          background: #161616;
          border: 1px solid #2a2a2a;
          color: #ccc;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          font-family: 'Barlow', sans-serif;
          font-weight: 500;
          text-align: left;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chip:hover {
          background: #1e1e00;
          border-color: #f5c518;
          color: #f5c518;
          transform: translateY(-1px);
        }

        .chip-emoji { font-size: 1rem; flex-shrink: 0; }

        /* Messages */
        .message-wrap {
          display: flex;
          margin-bottom: 18px;
          animation: slideUp 0.3s ease forwards;
        }

        .message-wrap.user { justify-content: flex-end; }
        .message-wrap.assistant { justify-content: flex-start; }

        .coach-avatar {
          width: 34px; height: 34px;
          background: #f5c518;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          margin-right: 10px;
          margin-top: 2px;
          align-self: flex-start;
        }

        .bubble {
          max-width: 72%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.65;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .bubble.user {
          background: #f5c518;
          color: #0a0a0a;
          font-weight: 600;
          border-radius: 14px 14px 4px 14px;
        }

        .bubble.assistant {
          background: #161616;
          border: 1px solid #2a2a2a;
          color: #e0e0e0;
          border-radius: 4px 14px 14px 14px;
        }

        .typing-wrap {
          display: flex;
          align-items: flex-start;
          margin-bottom: 18px;
          animation: fadeIn 0.2s ease;
        }

        /* Error */
        .error-bar {
          background: #1a0a0a;
          border: 1px solid #7f1d1d;
          color: #f87171;
          padding: 10px 16px;
          font-size: 0.82rem;
          margin: 0 20px 10px;
          border-radius: 8px;
          text-align: center;
        }

        /* Input area */
        .input-area {
          padding: 12px 16px 16px;
          border-top: 1px solid #1e1e1e;
          background: #0d0d0d;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          background: #161616;
          border: 1.5px solid #2a2a2a;
          border-radius: 12px;
          padding: 10px 12px;
          transition: border-color 0.2s;
        }

        .input-row:focus-within {
          border-color: #f5c518;
        }

        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e8e8e8;
          font-family: 'Barlow', sans-serif;
          font-size: 0.92rem;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
          min-height: 24px;
        }

        .input-field::placeholder { color: #555; }

        .send-btn {
          background: #f5c518;
          border: none;
          color: #0a0a0a;
          width: 36px; height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
          transition: all 0.15s ease;
          font-weight: 700;
        }

        .send-btn:hover:not(:disabled) {
          background: #ffe040;
          transform: scale(1.05);
        }

        .send-btn:disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        .input-hint {
          text-align: center;
          font-size: 0.68rem;
          color: #444;
          margin-top: 8px;
          letter-spacing: 0.05em;
        }

        @media (max-width: 480px) {
          .chips-grid { grid-template-columns: 1fr; max-width: 340px; }
          .bubble { max-width: 85%; }
          .empty-title { font-size: 1.8rem; }
        }
      `}</style>

      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="header-badge">💪</div>
          <div className="header-info">
            <div className="header-title">COACH BRO</div>
            <div className="header-sub">
              <span className="status-dot" />
              Gym AI · No excuses accepted
            </div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#444", letterSpacing: "0.05em" }}>
            GET GAINS
          </div>
        </div>

        {/* Chat scroll */}
        <div className="chat-scroll">
          {isEmpty ? (
            <div className="empty-state">
              <span className="empty-mascot">🏋️</span>
              <div className="empty-title">WHAT'S THE PLAN TODAY?</div>
              <div className="empty-sub">{ROAST_LINES[roastIndex]}</div>
              <div className="chips-grid">
                {STARTER_CHIPS.map((c, i) => (
                  <button key={i} className="chip" onClick={() => sendMessage(c.text)}>
                    <span className="chip-emoji">{c.emoji}</span>
                    {c.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`message-wrap ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="coach-avatar">💪</div>
                  )}
                  <div className={`bubble ${msg.role}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="typing-wrap">
                  <div className="coach-avatar">💪</div>
                  <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px 14px 14px 14px", minWidth: 160 }}>
                    <TypingDots />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && <div className="error-bar">⚠️ {error}</div>}

        {/* Input */}
        <div className="input-area">
          <div className="input-row">
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Ask Coach Bro anything... no excuses."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              style={{ height: "auto" }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              ↑
            </button>
          </div>
          <div className="input-hint">ENTER to send · SHIFT+ENTER for new line</div>
        </div>
      </div>
    </>
  );
}

