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
    try {
        const { messages } = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages
        });

        res.json(response);
    } catch (err) {
        console.error('OpenAI Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log('✅ Server running at http://localhost:3001');
});