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
            content: "You generate viral TikTok food battle scripts.",
          },
          {
            role: "user",
            content: `
Create 3 DIFFERENT viral food battles using "${hero}".

STRICT:
- hero → villain → hero
- 3 lines ONLY
- LONG dramatic lines
- cinematic tone
- no generic phrases

RETURN ONLY PURE JSON. NO TEXT. NO EXPLANATION.

FORMAT:
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
`,
          },
        ],
        temperature: 1,
      }),
    });

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // 🔥 HARD CLEAN
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^[^\{]*/, "") // remove anything before first {
      .replace(/[^\}]*$/, "") // remove anything after last }
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("FAILED RAW:", data);
      console.error("FAILED CLEANED:", content);

      // fallback para di mag crash UI
      return res.status(200).json({
        success: true,
        data: [
          {
            pair: { hero, villain: "Junk Food" },
            script: {
              duration: "16s",
              dialogue: [
                { speaker: hero, line: "I fuel your body with real strength and lasting energy that actually builds your future." },
                { speaker: "Junk Food", line: "I may taste better for a moment, but I'm slowly destroying everything inside you." },
                { speaker: hero, line: "Short pleasure isn’t worth long-term damage—I'm the choice that actually makes you stronger." },
              ],
            },
            imagePrompts: ["healthy food cinematic", "junk food dark"],
            videoPrompts: ["food hero shot", "junk food closeup", "final domination"],
            seo: {
              title: `${hero} vs Junk Food`,
              description: "Healthy vs unhealthy battle",
              hashtags: ["#food", "#viral"],
            },
          },
        ],
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
      error: "Server crash",
    });
  }
}
