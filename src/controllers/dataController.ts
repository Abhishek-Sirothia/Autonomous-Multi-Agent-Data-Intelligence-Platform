import { Request, Response } from 'express';
import SalesRecord from '../models/SalesRecord';
import AgentLog from '../models/AgentLog'; // Import our MLOps logger
import { AIService } from '../services/AIService'; // Import our AI brain

export const uploadSalesData = async (req: Request, res: Response) => {
    try {
        // 1. Save the raw business data to MongoDB
        const newRecord = new SalesRecord(req.body);
        const savedRecord = await newRecord.save();

        // 2. Trigger AI Analysis if customer feedback is provided
        let aiResult = null;
        if (req.body.customerFeedback) {
            console.log("🤖 AI is analyzing feedback...");
            aiResult = await AIService.analyzeFeedback(req.body.customerFeedback);
            
            // 3. MLOps: Log the AI activity for your resume's tracking feature
            if (aiResult) {
                const log = new AgentLog({
                    userQuery: req.body.customerFeedback,
                    agentAction: "Sentiment & Summary Analysis",
                    tokensUsed: aiResult.tokens,
                    latencyMs: aiResult.latency
                });
                await log.save();
                console.log(`✅ AI Logged: ${aiResult.latency}ms`);
            }
        }

        // 4. Send the combined response back to the user
        res.status(201).json({
            message: "✅ Data saved and AI analysis complete!",
            data: savedRecord,
            aiAnalysis: aiResult ? aiResult.analysis : "No feedback provided for analysis."
        });

    } catch (error) {
        console.error("Pipeline Error:", error);
        res.status(500).json({ message: "❌ Error in data pipeline", error });
    }
};