import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

function localSentimentAnalysis(feedback: string): string {
    const text = feedback.toLowerCase();
    const positiveWords = ["great","good","excellent","amazing","love","fantastic","awesome","perfect","happy","best","wonderful","superb","outstanding"];
    const negativeWords = ["bad","poor","terrible","awful","hate","worst","horrible","disappointing","broken","slow","useless","refund","frustrated"];

    let positiveScore = 0;
    let negativeScore = 0;
    positiveWords.forEach(word => { if (text.includes(word)) positiveScore++; });
    negativeWords.forEach(word => { if (text.includes(word)) negativeScore++; });

    let sentiment: string;
    let summary: string;

    if (positiveScore > negativeScore) {
        sentiment = "Positive 😊";
        summary = "Customer expressed satisfaction with the product/service.";
    } else if (negativeScore > positiveScore) {
        sentiment = "Negative 😞";
        summary = "Customer expressed dissatisfaction and may need follow-up.";
    } else {
        sentiment = "Neutral 😐";
        summary = "Customer feedback is mixed or neutral in tone.";
    }

    return `Sentiment: ${sentiment}\nSummary: ${summary}\n(Local analysis — no AI key available)`;
}

export class AIService {
    public static async analyzeFeedback(feedback: string) {
        const startTime = Date.now();
        const groqKey = process.env.GROQ_API_KEY || "";

        if (!groqKey) {
            console.warn("⚠️ No Groq API key found. Using local analysis.");
            return {
                analysis: localSentimentAnalysis(feedback),
                latency: Date.now() - startTime,
                tokens: 0
            };
        }

        try {
            const groq = new Groq({ apiKey: groqKey });

            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant", // Free, fast model on Groq
                messages: [
                    {
                        role: "user",
                        content: `Provide a very brief sentiment analysis and 1-sentence summary for: "${feedback}"`
                    }
                ],
                max_tokens: 150
            });

            const text = completion.choices[0]?.message?.content || "No response";
            console.log("🤖 AI Response Received!");

            return {
                analysis: text,
                latency: Date.now() - startTime,
                tokens: completion.usage?.total_tokens || 50
            };

        } catch (error: any) {
            console.error("❌ AI Error:", error.message);
            console.warn("⚠️ AI unavailable. Using local sentiment analysis.");
            return {
                analysis: localSentimentAnalysis(feedback),
                latency: Date.now() - startTime,
                tokens: 0
            };
        }
    }
}