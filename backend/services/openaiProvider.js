const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function createClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  return new OpenAI({ apiKey });
}

async function generate(prompt, options = {}) {
  const client = createClient();
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  const response = await client.responses.create({
    model,
    input: prompt,
  });

  return response.output_text || response.choices?.[0]?.message?.content || '';
}

module.exports = {
  generate,
};