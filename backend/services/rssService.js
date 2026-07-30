const Parser = require('rss-parser');

const parser = new Parser({
  customFields: {
    item: ['media:group', 'media:content', 'content:encoded'],
  },
});

async function fetchFeed(url) {
  if (!url) {
    throw new Error('RSS feed URL is required');
  }

  const feed = await parser.parseURL(url);
  return feed;
}

async function parseFeed(url) {
  const feed = await fetchFeed(url);
  return {
    title: feed.title || 'Untitled Feed',
    link: feed.link || null,
    description: feed.description || null,
    items: extractArticles(feed),
  };
}

function extractArticles(feed) {
  if (!feed || !Array.isArray(feed.items)) {
    return [];
  }

  return feed.items.map((item) => ({
    title: item.title || 'Untitled Article',
    link: item.link || null,
    description: item.contentSnippet || item.content || item.summary || null,
    content: item.content || item['content:encoded'] || item.summary || null,
    pubDate: item.pubDate || item.isoDate || null,
    author: item.creator || item.author || null,
    categories: Array.isArray(item.categories) ? item.categories : [],
    image: item.enclosure?.url || item.image?.link || null,
    guid: item.guid || item.id || null,
  }));
}

module.exports = {
  fetchFeed,
  parseFeed,
  extractArticles,
};