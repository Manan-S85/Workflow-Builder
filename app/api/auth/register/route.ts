import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user (password will be hashed by the pre-save hook)
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
}
