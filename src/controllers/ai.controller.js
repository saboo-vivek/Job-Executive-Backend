const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.boostResume = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "Text is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

const prompt = `
You are an expert resume writer.

TASK:
Rewrite the text below into a strong professional resume summary.

REQUIREMENTS:
- 80 to 120 words (IMPORTANT)
- ATS-friendly keywords included naturally
- Professional, confident tone
- Single cohesive paragraph
- No bullet points
- No headings
- No explanations or commentary
- Plain text only

TEXT:
"${text}"
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ boostedText: response });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ msg: "AI processing failed" });
  }
};


