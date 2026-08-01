const path = require('path');
const dotenv = require('dotenv');
const openaiProvider = require('./openaiProvider');
const deepseekProvider = require('./deepseekProvider');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function getProviderName() {
  return process.env.AI_PROVIDER || 'deepseek';
}

async function generate(prompt, options = {}) {
  const primaryProvider = getProviderName();

  if (primaryProvider === 'deepseek') {
    try {
      return await deepseekProvider.generate(prompt, options);
    } catch (deepseekError) {
      console.warn(`[AI Provider Fallback] DeepSeek API encountered error: "${deepseekError.message}". Falling back to OpenAI (${process.env.OPENAI_MODEL || 'gpt-4o-mini'})...`);
      try {
        return await openaiProvider.generate(prompt, options);
      } catch (openaiError) {
        console.error('[AI Provider Error] Both DeepSeek and OpenAI providers failed.');
        throw openaiError;
      }
    }
  }

  // If primary provider is explicitly openai
  try {
    return await openaiProvider.generate(prompt, options);
  } catch (openaiError) {
    console.warn(`[AI Provider Fallback] OpenAI API encountered error: "${openaiError.message}". Falling back to DeepSeek...`);
    return await deepseekProvider.generate(prompt, options);
  }
}

module.exports = {
  generate,
  getProviderName,
};