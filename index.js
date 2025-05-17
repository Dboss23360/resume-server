import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
    res.send('Resume AI backend is live!');
});

app.post('/api/refine', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { messages } = req.body;

        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                res.write(`data: ${content}\n\n`);
            }
        }

        res.write(`data: [DONE]\n\n`);
        res.end();
    } catch (err) {
        console.error('Stream error:', err);
        res.write(`data: [ERROR] ${err.message}\n\n`);
        res.end();
    }
});

app.listen(3001, () => {
    console.log('✅ Server running at http://localhost:3001');
});
