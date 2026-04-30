import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import dataRoutes from './routes/dataRoutes';
import DatabaseManager from './DatabaseManager';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI!;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/data', dataRoutes);

// Start Server
const startServer = async () => {
    try {
        console.log("⏳ Connecting to database...");
        const dbManager = DatabaseManager.getInstance();
        await dbManager.connect(MONGO_URI);

        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();


