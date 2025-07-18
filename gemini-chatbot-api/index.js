const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load .env file
dotenv.config();

// Inisialisasi Express
const app = express();
const port = process.env.PORT || 3000;

/* Middleware*/
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({model : 'gemini-2.5-flash'});


/* Routing*/
app.post('/api/chat', async (req, res) => {

    const userMessage =req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: 'User message is required' });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.log(error);
        res.status(500).json({reply: 'Something went wrong'});
    }
});

app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
    console.log('🔑 API Key loaded:', !!process.env.GEMINI_API_KEY);
});