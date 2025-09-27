console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

import Groq from 'groq-sdk';

// Vercel automatically makes this an edge function for speed
export const config = {
  runtime: 'edge',
};

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(request: Request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    // Use the same prompt engineering as your Next.js project
    const fullPrompt = `Generate a list of 3-5 todo tasks based on the following prompt: "${prompt}". The output should be a clean, unformatted list of tasks. Each task should be separated by a comma. For example: "Write a blog post about Next.js, Research new front-end frameworks, Deploy the project to Vercel". Do not include any markdown, numbering, or bullet points.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant', // Matching the model from your Next.js project
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content in AI response.');
    }

    // Use the same response parsing as your Next.js project
    const tasks = content.split(',').map(task => task.trim()).filter(Boolean);

    // Return the data in the format the frontend expects
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