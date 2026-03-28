import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  const generate = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food: input,
        }),
      });

      const data = await res.json();

      setResult(data.data || []);
    } catch (err) {
      console.error(err);
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white"
          : "bg-gradient-to-br from-gray-100 to-white text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-xl font-bold">🔥 Tyzn Shorts</h1>

        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition"
        >
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {/* INPUT BOX */}
      <div className="flex justify-center mt-10">
        <div className="w-[400px] p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter food..."
            className="w-full p-3 rounded-lg bg-black/30 outline-none mb-4"
          />

          <button
            onClick={generate}
            disabled={loading}
            className="w-full p-3 bg-black rounded-lg hover:scale-105 transition font-semibold"
          >
            {loading ? "Generating..." : "Generate Food Battle"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="grid md:grid-cols-3 gap-6 p-10">
        {result?.length > 0 &&
          result.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:scale-105 transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">
                  {item.pair.hero} ⚔️ {item.pair.villain}
                </h2>
                <span className="text-xs bg-black/40 px-2 py-1 rounded">
                  Viral
                </span>
              </div>

              {/* SCRIPT */}
              <div className="space-y-2 text-sm mb-4">
                {item.script.dialogue.map((line: any, idx: number) => (
                  <p key={idx}>
                    <b>{line.speaker}:</b> {line.line}
                  </p>
                ))}
              </div>

              {/* COPY BUTTON */}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    item.script.dialogue
                      .map((l: any) => `${l.speaker}: ${l.line}`)
                      .join("\n")
                  )
                }
                className="px-3 py-1 text-xs bg-white/20 rounded hover:bg-white/30 transition"
              >
                Copy Script
              </button>

              {/* EXTRA */}
              <div className="mt-4 text-xs opacity-80 space-y-1">
                <p>🎬 {item.videoPrompts?.[0]}</p>
                <p>🧠 {item.imagePrompts?.[0]}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
