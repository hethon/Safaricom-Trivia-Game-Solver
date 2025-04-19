import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

const system = `You are a helpful assistant that extracts structured data from raw multiple choice questions.

Your task is to return a JSON object containing:
- The question text (called the "stem")
- An array of choices, each with:
  - A single-letter label (e.g., "A", "B", "C")
  - The text of the choice
- The correct choice (text only)
- The correct letter (e.g., "C")

Return only the structured JSON object. Do not include explanations or extra text.

Example output format:
{
  "stem": "What is the capital of France?",
  "choices": [
    { "letter": "A", "text": "Berlin" },
    { "letter": "B", "text": "Madrid" },
    { "letter": "C", "text": "Paris" },
    { "letter": "D", "text": "Rome" }
  ],
  "correctChoice": "Paris",
  "correctLetter": "C"
}`;

const answerMyQuestion = async (prompt: string) => {
  const { text } = await generateText({
    model: groq('qwen-qwq-32b'),
    providerOptions: {
      groq: { reasoningFormat: 'parsed' },
    },
    prompt,
    system
  });

  return text;
};

import http from 'http';

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/question') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const question = data.question;

        if (!question) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Missing "question" field' }));
        }

        const answer = await answerMyQuestion(question);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(answer); // already in JSON format string
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process request', details: err.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `unknow route ${req.url}, or wrong HTTP method ${req.method}` }));
  }
});

server.listen(3000, () => {
  console.log('✅ Server is running on http://localhost:3000');
});
