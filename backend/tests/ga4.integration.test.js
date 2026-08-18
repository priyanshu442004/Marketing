const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeGa4Row,
  buildOverviewSummary,
  calculatePeriodChange,
  buildMarketingInsightSummary,
} = require('../services/googleAnalyticsService');

test('normalizeGa4Row extracts supported metrics and trims values', () => {
  const row = normalizeGa4Row({
    dimensionValues: [{ value: 'Organic Search' }, { value: 'google' }, { value: 'spring_campaign' }],
    metricValues: [{ value: '42' }, { value: '31' }, { value: '8' }, { value: '0.56' }, { value: '12' }],
  }, {
    dimensions: ['sessionSource', 'sessionMedium', 'sessionCampaignName'],
    metrics: ['sessions', 'users', 'engagedSessions', 'engagementRate', 'keyEvents'],
  });

  assert.equal(row.source, 'Organic Search');
  assert.equal(row.medium, 'google');
  assert.equal(row.campaign, 'spring_campaign');
  assert.equal(row.sessions, 42);
  assert.equal(row.users, 31);
  assert.equal(row.engagedSessions, 8);
  assert.equal(row.engagementRate, 0.56);
  assert.equal(row.keyEvents, 12);
});

test('buildOverviewSummary calculates totals and period delta', () => {
  const summary = buildOverviewSummary([
    { sessions: 100, users: 90, engagedSessions: 60, engagementRate: 0.4, keyEvents: 10, totalRevenue: 120 },
    { sessions: 80, users: 70, engagedSessions: 50, engagementRate: 0.35, keyEvents: 8, totalRevenue: 90 },
  ]);

  assert.equal(summary.sessions, 180);
  assert.equal(summary.users, 160);
  assert.equal(summary.engagedSessions, 110);
  assert.ok(Math.abs(summary.engagementRate - 0.375) < 0.0001);
  assert.equal(summary.keyEvents, 18);
  assert.equal(summary.totalRevenue, 210);
  assert.equal(calculatePeriodChange(180, 120), 50);
});

test('buildMarketingInsightSummary generates normalized GA4 + GSC insight context', () => {
  const insight = buildMarketingInsightSummary({
    topLandingPages: [
      { landingPage: '/pricing', sessions: 1000, users: 700, keyEvents: 5, engagementRate: 0.35 },
    ],
    topTrafficSources: [
      { source: 'google', sessions: 2000, users: 1700, keyEvents: 25, engagementRate: 0.44 },
    ],
    highConversionPages: [
      { landingPage: '/pricing', conversionRate: 0.09 },
    ],
    lowConversionPages: [
      { landingPage: '/product', conversionRate: 0.02 },
    ],
    trafficTrends: [{ date: '2026-08-01', sessions: 100 }, { date: '2026-08-02', sessions: 140 }],
    conversionTrends: [{ date: '2026-08-01', keyEvents: 6 }, { date: '2026-08-02', keyEvents: 8 }],
  }, {
    lowCtr: [{ query: 'brand sutra', ctr: 0.02, impressions: 4000 }],
    highPerformers: [{ query: 'seo agency', clicks: 1000, impressions: 2500 }],
  });

  assert.ok(insight.summary.includes('SEO visibility is strong'));
  assert.equal(insight.topLandingPages.length, 1);
  assert.equal(insight.topTrafficSources.length, 1);
  assert.equal(insight.highConversionPages.length, 1);
  assert.equal(insight.lowConversionPages.length, 1);
});
