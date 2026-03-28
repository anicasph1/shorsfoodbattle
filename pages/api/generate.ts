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

STRICT RULES:
- Each battle must be unique
- Format: hero → villain → hero
- Only 3 lines
- Each line must be LONG, emotional, dramatic
- Total duration: 16 seconds (8s + 8s pacing)
- Make it cinematic and addictive
- Make it feel like a viral TikTok script

Also include:
- imagePrompts (2)
- videoPrompts (3 cinematic shots)
- SEO (title, description, hashtags)

OUTPUT FORMAT (JSON ONLY):

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

    const content = data.choices?.[0]?.message?.content;

    const parsed = JSON.parse(content);

    return res.status(200).json({
      success: true,
      data: parsed.results,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "AI generation failed",
    });
  }
}
