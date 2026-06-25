require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

if (!OPENAI_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. Create a .env file with OPENAI_API_KEY.');
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const systemPrompt = `You are the Design Cooperation AI Consultant. You are a professional creative agency assistant based in Kampala, Uganda. Answer questions about Branding, Printing, Packaging, Website Design, Graphic Design, and Digital Business Cards. Be concise, helpful, and provide practical next steps, pricing ranges when appropriate, and suggestions for packages. Ask clarifying questions when requirements are unclear.`;

    const payload = {
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 700,
      temperature: 0.2
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenAI error:', text);
      return res.status(500).json({ error: 'OpenAI API error', details: text });
    }

    const data = await response.json();
    const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
