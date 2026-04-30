import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentLog extends Document {
    userQuery: string;
    agentAction: string;
    tokensUsed: number;
    latencyMs: number;
}

const AgentLogSchema: Schema = new Schema({
    userQuery: { type: String, required: true },
    agentAction: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },
    latencyMs: { type: Number, default: 0 }
}, { 
    timestamps: true 
});

export default mongoose.model<IAgentLog>('AgentLog', AgentLogSchema);