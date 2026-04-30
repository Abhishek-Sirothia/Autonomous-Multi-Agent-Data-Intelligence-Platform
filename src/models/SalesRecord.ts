import mongoose, { Schema, Document } from 'mongoose';

// 1. TypeScript Interface (Strict typing for your Node.js code)
export interface ISalesRecord extends Document {
    region: string;
    productCategory: string;
    revenue: number;
    quarter: string;
    customerFeedback: string;
}

// 2. Mongoose Schema (Strict structure for the MongoDB database)
const SalesRecordSchema: Schema = new Schema({
    region: { type: String, required: true },
    productCategory: { type: String, required: true },
    revenue: { type: Number, required: true },
    quarter: { type: String, required: true },
    customerFeedback: { type: String, required: false } // Not every sale has feedback
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt dates
});

export default mongoose.model<ISalesRecord>('SalesRecord', SalesRecordSchema);