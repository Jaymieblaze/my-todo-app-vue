export default async function handler() {
  return new Response(
    'GROQ_API_KEY: ' + process.env.GROQ_API_KEY,
    { headers: { 'Content-Type': 'text/plain' } }
  );
}