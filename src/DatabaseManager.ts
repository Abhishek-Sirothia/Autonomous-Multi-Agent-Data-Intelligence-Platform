import mongoose from 'mongoose';

class DatabaseManager {
    private static instance: DatabaseManager;

    // Private constructor prevents external instantiation
    private constructor() {}

    // Method to get the single instance of the class
    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    // Method to connect to the database
    public async connect(uri: string): Promise<void> {
        try {
            await mongoose.connect(uri);
            console.log('✅ Successfully connected to MongoDB.');
        } catch (error) {
            console.error('❌ MongoDB Connection Error:', error);
            process.exit(1); 
        }
    }
}

export default DatabaseManager;