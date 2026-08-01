const prisma = require('../utils/prismaClient');
const Parser = require('rss-parser');
const parser = new Parser();

const rssController = {
  // Get all user RSS feeds
  getSources: async (req, res, next) => {
    try {
      const sources = await prisma.userRssSource.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, count: sources.length, data: sources });
    } catch (error) {
      return next(error);
    }
  },

  // Add new RSS source
  addSource: async (req, res, next) => {
    try {
      const { url, title, userId } = req.body;
      const defaultUserId = userId || (await prisma.user.findFirst())?.id;

      if (!defaultUserId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      const source = await prisma.userRssSource.create({
        data: {
          userId: defaultUserId,
          url,
          title: title || url,
          isActive: true,
        },
      });

      return res.status(201).json({ success: true, data: source });
    } catch (error) {
      return next(error);
    }
  },

  // Test / Fetch latest items from RSS feed URL
  fetchFeedItems: async (req, res, next) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ success: false, message: 'Feed URL parameter is required' });
      }

      const feed = await parser.parseURL(url);
      const items = feed.items.slice(0, 10).map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        snippet: item.contentSnippet || item.content,
      }));

      return res.status(200).json({ success: true, feedTitle: feed.title, count: items.length, data: items });
    } catch (error) {
      return res.status(400).json({ success: false, message: `Failed to fetch RSS feed: ${error.message}` });
    }
  },
};

module.exports = rssController;