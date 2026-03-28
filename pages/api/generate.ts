import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const hero = "Avocado";
  const villain = "Burger";

  const results = Array.from({ length: 3 }).map(() => ({
    pair: { hero, villain },

    script: {
      duration: "12-16s",
      dialogue: [
        { speaker: hero, line: "I give real energy." },
        { speaker: villain, line: "I give fake satisfaction." },
        { speaker: hero, line: "You destroy health." },
      ],
    },

    imagePrompts: [
      "Avocado cinematic lighting",
      "Burger greasy dramatic shot",
    ],

    videoPrompts: [
      "Avocado vs burger intense battle",
      "slow motion food clash",
    ],

    seo: {
      title: "Avocado vs Burger",
      description: "Healthy vs junk food",
      tags: ["food", "battle"],
      hashtags: ["#food", "#viral"],
    },
  }));

  return res.status(200).json({
    success: true,
    data: results,
  });
}
