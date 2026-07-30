const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function createClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });
}

async function generate(prompt, options = {}) {
  const client = createClient();
  const model = options.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const response = await client.responses.create({
    model,
    input: prompt,
  });

  return response.output_text || response.choices?.[0]?.message?.content || '';
}

module.exports = {
  generate,
};