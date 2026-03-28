'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

interface FoodPair {
  hero: string;
  villain: string;
}

interface DialogueLine {
  speaker: string;
  line: string;
}

interface Script {
  dialogue: DialogueLine[];
  duration: string;
}

interface SEO {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
}

interface GeneratedContent {
  pair: FoodPair;
  script: Script;
  imagePrompts: string[];
  videoPrompts: string[];
  seo: SEO;
}

interface GenerationResponse {
  success: boolean;
  data?: GeneratedContent;
  error?: string;
}

export default function Home() {
  const [food, setFood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const randomFoods = [
    'Avocado Toast','Protein Shake','Kale Chips','Acai Bowl',
    'Green Juice','Quinoa Bowl','Grilled Salmon','Greek Yogurt',
  ];

  const handleRandomize = () => {
    const random = randomFoods[Math.floor(Math.random() * randomFoods.length)];
    setFood(random);
    setResult(null);
    setError('');
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food: food || undefined }),
      });

      const data: GenerationResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate content');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head>
        <title>Tyzn Shorts Content</title>
      </Head>

      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Viral Food Battles
        </h1>

        <div className="max-w-xl mx-auto space-y-4">
          <input
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter food..."
            className="w-full p-3 border rounded"
          />

          <button
            onClick={handleRandomize}
            className="w-full p-3 border rounded"
          >
            Randomize
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full p-3 bg-black text-white rounded"
          >
            {isLoading ? 'Generating...' : 'Generate Food Battle'}
          </button>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
        </div>

        {/* SAFE RESULT RENDER */}
        {result?.script && (
          <div className="max-w-3xl mx-auto mt-10 space-y-6">

            {/* Pair */}
            <div>
              <h2 className="text-xl font-bold">Battle</h2>
              <p>{result?.pair?.hero} VS {result?.pair?.villain}</p>
            </div>

            {/* Script */}
            <div>
              <h2 className="text-xl font-bold">
                Script ({result?.script?.duration})
              </h2>

              {result?.script?.dialogue?.map((line, i) => (
                <div key={i}>
                  <strong>{line?.speaker}</strong>: {line?.line}
                </div>
              ))}
            </div>

            {/* Image Prompts */}
            <div>
              <h2 className="text-xl font-bold">Image Prompts</h2>

              {result?.imagePrompts?.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>

            {/* Video Prompts */}
            <div>
              <h2 className="text-xl font-bold">Video Prompts</h2>

              {result?.videoPrompts?.map((p, i) => (
                <div key={i}>{p}</div>
              ))}
            </div>

            {/* SEO */}
            <div>
              <h2 className="text-xl font-bold">SEO</h2>

              <p><strong>Title:</strong> {result?.seo?.title}</p>
              <p>{result?.seo?.description}</p>

              <div>
                {result?.seo?.tags?.map((tag, i) => (
                  <span key={i} style={{ marginRight: 5 }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                {result?.seo?.hashtags?.map((tag, i) => (
                  <span key={i} style={{ marginRight: 5 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </>
  );
}
