const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeSiteUrl, buildOverviewSummary, detectOpportunities, normalizeSearchAnalyticsResponse } = require('../services/googleSearchConsoleService');

test('normalizeSiteUrl trims trailing slash and host', () => {
  assert.equal(normalizeSiteUrl('https://example.com/'), 'https://example.com');
  assert.equal(normalizeSiteUrl('https://www.example.com/path'), 'https://www.example.com');
});

test('buildOverviewSummary calculates clicks, impressions, CTR and average position', () => {
  const summary = buildOverviewSummary([
    { clicks: 100, impressions: 2000, ctr: 0.05, position: 5.5 },
    { clicks: 90, impressions: 1800, ctr: 0.045, position: 6.4 },
  ]);

  assert.equal(summary.clicks, 190);
  assert.equal(summary.impressions, 3800);
  assert.ok(Math.abs(summary.ctr - 0.05) < 0.0001);
  assert.ok(Math.abs(summary.avgPosition - 5.95) < 0.0001);
});

test('normalizeSearchAnalyticsResponse strips unknown fields and computes derived values', () => {
  const normalized = normalizeSearchAnalyticsResponse([
    {
      date: '2026-08-01',
      query: 'brand sutra',
      page: 'https://example.com/blog',
      country: 'US',
      device: 'DESKTOP',
      searchType: 'Web',
      clicks: 10,
      impressions: 100,
      ctr: 0.1,
      position: 4.5,
    },
  ]);

  assert.equal(normalized[0].siteUrl, 'https://example.com');
  assert.equal(normalized[0].query, 'brand sutra');
  assert.equal(normalized[0].country, 'US');
  assert.equal(normalized[0].ctr, 0.1);
});

test('detectOpportunities identifies low CTR and ranking opportunities', () => {
  const opportunities = detectOpportunities([
    { query: 'seo tools', clicks: 20, impressions: 15000, ctr: 0.013, position: 8.4 },
    { query: 'marketing strategy', clicks: 30, impressions: 800, ctr: 0.04, position: 5.2 },
    { query: 'ai marketing', clicks: 10, impressions: 2000, ctr: 0.03, position: 11.5 },
  ]);

  assert.ok(opportunities.lowCtr.some((item) => item.query === 'seo tools'));
  assert.ok(opportunities.ranking.some((item) => item.query === 'ai marketing'));
  assert.ok(opportunities.highPerformers.some((item) => item.query === 'marketing strategy'));
});
