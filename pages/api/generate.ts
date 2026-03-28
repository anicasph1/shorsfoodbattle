import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { food } = req.body || {};
    const hero = food || "Avocado Toast";

    const response = await fetch("https://api.ai.cc/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_CC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a viral TikTok food battle content generator.",
          },
          {
            role: "user",
            content: `
Create 3 DIFFERENT viral food battles using "${hero}".

RULES:
- Format: hero → villain → hero
- Only 3 lines
- Each line must be LONG, emotional, dramatic, and punchy
- Must feel like viral TikTok dialogue
- Total duration: 16 seconds (8s + 8s)
- Avoid generic phrases

Also include:
- imagePrompts (2)
- videoPrompts (3 cinematic shots)
- SEO (title, description, hashtags)

RETURN JSON ONLY:

{
  "results": [
    {
      "pair": { "hero": "", "villain": "" },
      "script": {
        "duration": "16s",
        "dialogue": [
          { "speaker": "", "line": "" },
          { "speaker": "", "line": "" },
          { "speaker": "", "line": "" }
        ]
      },
      "imagePrompts": [],
      "videoPrompts": [],
      "seo": {
        "title": "",
        "description": "",
        "hashtags": []
      }
    }
  ]
}
`
          }
        ],
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 🔥 CLEAN RESPONSE
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("PARSE ERROR:", cleaned);

      return res.status(500).json({
        success: false,
        error: "Invalid AI response",
      });
    }

    return res.status(200).json({
      success: true,
      data: parsed.results || parsed,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "AI generation failed",
    });
  }
}
