import { Request, Response } from 'express';
import SalesRecord from '../models/SalesRecord'; // Removed { }
import AgentLog from '../models/AgentLog';       // Removed { }
import { AIService } from '../services/AIService';

export const uploadData = async (req: Request, res: Response) => {
    try {
        const { region, revenue, customerFeedback } = req.body;
        const startTime = Date.now();

        // 1. Analyst Agent: Process Intelligence
        const analysis = await AIService.analyzeFeedback(customerFeedback);
        const latency = Date.now() - startTime;

        // 2. Clerk Agent: Save to MongoDB
        const newRecord = new SalesRecord({
            region,
            revenue,
            customerFeedback,
            aiAnalysis: analysis
        });
        await newRecord.save();

        // 3. Manager Agent: Log Performance
        const log = new AgentLog({
            agentName: 'Analyst-Gemini',
            action: 'Sentiment Analysis',
            latencyMs: latency,
            status: 'Success'
        });
        await log.save();

        res.status(201).json({ message: "Intelligence captured!", analysis, latency });
    } catch (error) {
        res.status(500).json({ error: "System failure in Intelligence Loop" });
    }
};

// NEW: Fetch past intelligence
export const getHistory = async (req: Request, res: Response) => {
    try {
        const history = await SalesRecord.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve memory" });
    }
};