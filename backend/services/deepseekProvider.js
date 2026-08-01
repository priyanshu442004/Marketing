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

/**
 * Generate text using DeepSeek model via OpenAI SDK.
 * @param {string|Array} prompt - String prompt or array of message objects [{role, content}]
 * @param {Object} options - Options (systemPrompt, json, temperature, model, max_tokens)
 */
async function generate(prompt, options = {}) {
  const client = createClient();
  const model = options.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';

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
    console.error('DeepSeek API Error:', err.message);
    throw err;
  }
}

module.exports = {
  generate,
};