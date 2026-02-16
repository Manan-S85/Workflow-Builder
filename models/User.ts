import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image?: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Simple password hashing using crypto
    const hash = crypto.createHash('sha256');
    hash.update(this.password);
    this.password = hash.digest('hex');

    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const hash = crypto.createHash('sha256');
    hash.update(candidatePassword);
    const hashedCandidate = hash.digest('hex');

    return hashedCandidate === this.password;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
