import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AICC_API_KEY,
  baseURL: "https://api.ai.cc/v1",
});

function getPair(food?: string) {
  if (food) {
    return {
      hero: food,
      villain: "Ultra Processed Junk Food",
    };
  }

  const pairs = [
    { hero: "Grilled Salmon", villain: "Fried Chicken" },
    { hero: "Avocado", villain: "Cheesy Burger" },
    { hero: "Green Smoothie", villain: "Soda" },
    { hero: "Oatmeal", villain: "Sugary Cereal" },
  ];

  return pairs[Math.floor(Math.random() * pairs.length)];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { food } = req.body;
    const { hero, villain } = getPair(food);

    const prompt = `
Create a VIRAL food battle short.

Hero: ${hero}
Villain: ${villain}

RULES:
- Aggressive emotional dialogue
- 12–16 seconds
- HERO dominant, VILLAIN defensive
- Add pauses "..."

RETURN STRICT JSON:

{
  "script": {
    "duration": "12-16 seconds",
    "dialogue": [
      { "speaker": "${hero}", "line": "..." },
      { "speaker": "${villain}", "line": "..." },
      { "speaker": "${hero}", "line": "..." }
    ]
  },
  "imagePrompts": [
    "...",
    "..."
  ],
  "videoPrompts": [
    "...",
    "..."
  ],
  "seo": {
    "title": "...",
    "description": "...",
    "tags": ["...", "..."],
    "hashtags": ["...", "..."]
  }
}

NO TEXT OUTSIDE JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a viral shorts creator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
    });

    const raw = completion.choices[0].message.content || "";

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // 🔥 fallback (ANTI-CRASH + STILL VIRAL)
      parsed = {
        script: {
          duration: "12-16 seconds",
          dialogue: [
            { speaker: hero, line: "You look good... but you destroy people slowly." },
            { speaker: villain, line: "People love me more than you." },
            { speaker: hero, line: "Yeah... until their body pays the price." }
          ]
        },
        imagePrompts: [
          `${hero} cinematic lighting, ultra detailed, powerful pose`,
          `${villain} greasy texture, weak posture, dramatic lighting`
        ],
        videoPrompts: [
          `${hero} aggressively confronting ${villain} in kitchen, dynamic camera`,
          `${hero} dominates ${villain}, intense cinematic ending`
        ],
        seo: {
          title: `${hero} vs ${villain} (REAL TRUTH EXPOSED)`,
          description: "Healthy vs junk food battle. Watch till the end.",
          tags: ["food battle", "viral shorts", "healthy vs junk"],
          hashtags: ["#foodbattle", "#viral", "#shorts"]
        }
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        pair: { hero, villain },
        ...parsed,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate",
    });
  }
}
