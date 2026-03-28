'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [food, setFood] = useState('');
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food }),
      });

      const data = await res.json();
      setResult(data.data);
    } catch {
      alert('Error generating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 dark:from-black dark:via-gray-900 dark:to-black transition-all">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">🔥 Tyzn Shorts</h1>

        <button
          onClick={() => setDark(!dark)}
          className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white hover:scale-105 transition"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* INPUT CARD */}
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">

        <input
          value={food}
          onChange={(e) => setFood(e.target.value)}
          placeholder="Enter food..."
          className="w-full p-3 rounded-lg mb-4 bg-white/20 text-white placeholder-gray-300 outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-black text-white hover:scale-105 transition"
        >
          {loading ? 'Generating...' : 'Generate Food Battle'}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {result.map((item, idx) => (
            <div
              key={idx}
              className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >

              {/* TITLE */}
              <h2 className="text-lg font-bold text-white mb-3">
                {item.pair.hero} ⚔️ {item.pair.villain}
              </h2>

              {/* SCRIPT */}
              <div className="text-sm text-gray-200 space-y-1 mb-3">
                {item.script.dialogue.map((d: any, i: number) => (
                  <p key={i}>
                    <span className="font-semibold text-white">{d.speaker}:</span> {d.line}
                  </p>
                ))}
              </div>

              {/* COPY BUTTON */}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    item.script.dialogue.map((d: any) => `${d.speaker}: ${d.line}`).join('\n')
                  )
                }
                className="text-xs bg-white text-black px-3 py-1 rounded hover:scale-105 transition"
              >
                Copy Script
              </button>

              {/* BADGE */}
              <div className="absolute top-2 right-2 text-xs bg-black/50 px-2 py-1 rounded text-white">
                Viral
              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}
