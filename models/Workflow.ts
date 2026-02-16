import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkflow extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    steps: string[];
    isTemplate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WorkflowSchema = new Schema<IWorkflow>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a workflow name'],
            trim: true,
        },
        steps: {
            type: [String],
            required: true,
            validate: {
                validator: function (v: string[]) {
                    return v.length >= 2 && v.length <= 4;
                },
                message: 'Workflow must have between 2 and 4 steps',
            },
        },
        isTemplate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster user-specific queries
WorkflowSchema.index({ userId: 1 });
WorkflowSchema.index({ isTemplate: 1 });

const Workflow: Model<IWorkflow> =
    mongoose.models.Workflow || mongoose.model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;
