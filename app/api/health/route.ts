import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const healthStatus = {
            backend: { status: 'healthy', responseTime: 0, message: 'API is operational' },
            database: { status: 'down', responseTime: 0, message: 'Not connected' },
            llm: { status: 'down', responseTime: 0, message: 'Not configured' },
            timestamp: new Date().toISOString(),
        };

        // Check Backend (always healthy if we reach here)
        const backendStart = performance.now();
        healthStatus.backend.responseTime = Math.round(performance.now() - backendStart);

        // Check Database
        const dbStart = performance.now();
        try {
            await dbConnect();
            const dbState = mongoose.connection.readyState;

            if (dbState === 1) {
                // Connected
                healthStatus.database.status = 'healthy';
                healthStatus.database.message = 'Connected to MongoDB';
            } else if (dbState === 2) {
                // Connecting
                healthStatus.database.status = 'degraded';
                healthStatus.database.message = 'Connecting to MongoDB...';
            } else {
                healthStatus.database.status = 'down';
                healthStatus.database.message = 'Database disconnected';
            }
            healthStatus.database.responseTime = Math.round(performance.now() - dbStart);
        } catch (error) {
            healthStatus.database.status = 'down';
            healthStatus.database.message = error instanceof Error ? error.message : 'Database error';
            healthStatus.database.responseTime = Math.round(performance.now() - dbStart);
        }

        // Check LLM (Gemini API)
        const llmStart = performance.now();
        try {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                healthStatus.llm.status = 'down';
                healthStatus.llm.message = 'API key not configured';
            } else {
                // Make a minimal test request
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

                // Just count tokens as a lightweight test
                await model.countTokens('test');

                healthStatus.llm.status = 'healthy';
                healthStatus.llm.message = 'Gemini API accessible';
            }
            healthStatus.llm.responseTime = Math.round(performance.now() - llmStart);
        } catch (error) {
            healthStatus.llm.status = 'down';
            healthStatus.llm.message = error instanceof Error ? error.message : 'LLM API error';
            healthStatus.llm.responseTime = Math.round(performance.now() - llmStart);
        }

        return NextResponse.json(healthStatus);
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            { error: 'Health check failed', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
