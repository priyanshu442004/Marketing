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
  // Default to gpt-4o-mini if env has gpt-4.1-mini or custom model
  const model = options.model || (process.env.OPENAI_MODEL === 'gpt-4.1-mini' ? 'gpt-4o-mini' : (process.env.OPENAI_MODEL || 'gpt-4o-mini'));

  let messages = [];
  if (Array.isArray(prompt)) {
    messages = prompt;
  } else {
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });
  }

  const payload = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
  };

  if (options.json) {
    payload.response_format = { type: 'json_object' };
  }

  if (options.max_tokens) {
    payload.max_tokens = options.max_tokens;
  }

  try {
    const response = await client.chat.completions.create(payload);
    return response.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('OpenAI API Error:', err.message);
    throw err;
  }
}

module.exports = {
  generate,
};