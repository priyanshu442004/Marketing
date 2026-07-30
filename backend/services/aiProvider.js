const path = require('path');
const dotenv = require('dotenv');
const openaiProvider = require('./openaiProvider');
const deepseekProvider = require('./deepseekProvider');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function getProviderName() {
  return process.env.AI_PROVIDER || 'openai';
}

async function generate(prompt, options = {}) {
  const providerName = getProviderName();

  if (providerName === 'deepseek') {
    return deepseekProvider.generate(prompt, options);
  }

  return openaiProvider.generate(prompt, options);
}

module.exports = {
  generate,
  getProviderName,
};