import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStepOutput {
    stepName: string;
    output: string;
}

export interface IRun extends Document {
    userId: mongoose.Types.ObjectId;
    workflowId: mongoose.Types.ObjectId;
    workflowName: string;
    inputText: string;
    stepOutputs: IStepOutput[];
    executionTime: number; // in milliseconds
    createdAt: Date;
}

const StepOutputSchema = new Schema<IStepOutput>(
    {
        stepName: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const RunSchema = new Schema<IRun>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workflowId: {
            type: Schema.Types.ObjectId,
            ref: 'Workflow',
            required: true,
        },
        workflowName: {
            type: String,
            required: true,
        },
        inputText: {
            type: String,
            required: true,
        },
        stepOutputs: {
            type: [StepOutputSchema],
            required: true,
        },
        executionTime: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes for faster queries
RunSchema.index({ userId: 1, createdAt: -1 });
RunSchema.index({ workflowId: 1 });

const Run: Model<IRun> = mongoose.models.Run || mongoose.model<IRun>('Run', RunSchema);

export default Run;
