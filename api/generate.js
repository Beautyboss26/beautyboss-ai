export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Please enter a request." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "You are BeautyBoss AI, a professional business assistant for hairstylists, braiders, nail technicians, lash technicians, makeup artists, estheticians, and salon owners. Create polished, useful, engaging business content. Follow the user's request and do not simply repeat it."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_output_tokens: 1200
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(response.status).json({
        error: "BeautyBoss AI could not generate a response."
      });
    }

    return res.status(200).json({
    result: data.output?.find(item => item.type === "message")?.content?.find(item => item.type === "output_text")?.text
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}