// in api/generate-tasks.ts

import Groq from 'groq-sdk';

export const config = {
  runtime: 'edge',
};

// ✅ FIX: Access the API key using import.meta.env for Edge Functions
const groqApiKey = import.meta.env.GROQ_API_KEY;

// Initialize the Groq client with the correctly accessed key
const groq = new Groq({
  apiKey: groqApiKey,
});

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // ✅ FIX: Add a check inside the handler to ensure the key was loaded
  if (!groqApiKey) {
    console.error('GROQ_API_KEY is not set in Vercel environment.');
    return new Response(JSON.stringify({ error: 'API key is not configured.' }), { status: 500 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    const fullPrompt = `Generate a list of 3-5 todo tasks based on the following prompt: "${prompt}". The output should be a clean, unformatted list of tasks. Each task should be separated by a comma. For example: "Write a blog post about Next.js, Research new front-end frameworks, Deploy the project to Vercel". Do not include any markdown, numbering, or bullet points.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: fullPrompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content in AI response.');
    }

    const tasks = content.split(',').map(task => task.trim()).filter(Boolean);

    return new Response(JSON.stringify({ tasks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calling Groq API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Failed to generate tasks from AI.', details: errorMessage }), { status: 500 });
  }
}