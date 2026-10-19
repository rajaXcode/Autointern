require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.LLM_API);

const run = async (questions = [], context = '') => {
    if (!Array.isArray(questions) || questions.length === 0) return [];

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `
           You are a highly qualified job candidate filling out an application form. Your goal is to pass the initial HR screening rounds by providing polished, professional, and enthusiastic answers.

            STRICT INSTRUCTIONS:
            1. RESPONSE FORMAT: Output *only* the direct plain-text answer. Do not include introductory phrases, pleasantries, explanations, quote marks, or markdown formatting (no bolding, no bullets).
            2. TONE & BIAS: Be highly positive, cooperative, and professional. Show a strong willingness to learn, adapt, and contribute to the company's success.
            3. CONTEXT INTEGRITY: Base all specific professional experience, technical skills, and background metrics *strictly* on the provided context. If the context mentions a specific duration, number of projects, or tool, do not exaggerate or invent new details.
            4. GENERAL & OPERATIONAL QUESTIONS: 
            - Relocation / Travel: Always answer positively (e.g., "Yes, I am fully open to relocation and travel as required by the role").
            - Work Hours / Schedule: Confirm total flexibility to support team requirements and project timelines.
            - Sponsorship: Answer directly based on the context, or provide a standard cooperative response if not specified.

            Background context to use for facts:
            ${context}
        `.trim()
    });

    try {

        const answers = await Promise.all(
            questions.map(async (question) => {
                const result = await model.generateContent(question);

                const rawText = result.response.text() || "No response";

                return rawText
                    .replace(/\*\*.*?\*\*/g, '')
                    .replace(/\n+/g, ' ')
                    .trim();
            })
        );
        return answers;
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return [];
    }
};

module.exports = run;