import React, { useEffect } from "react";

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
}) {
  useEffect(() => {
    // 1. Update Title
    const siteTitle = "BrandSutra | Autonomous AI Marketing & Website Intelligence Platform";
    document.title = title ? `${title} | BrandSutra` : siteTitle;

    // 2. Helper function to create or update meta tags dynamically
    const updateMetaTag = (attrName, attrVal, contentVal) => {
      if (!contentVal) return;
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentVal);
    };

    const defaultDesc =
      "BrandSutra orchestrates 10 specialized AI agents to automate multi-channel market research, competitive intelligence, content strategy, and website audits for B2B enterprises.";

    // Update standard meta tags
    updateMetaTag("name", "description", description || defaultDesc);
    if (keywords) {
      updateMetaTag("name", "keywords", keywords);
    }

    // OpenGraph
    updateMetaTag("property", "og:title", title ? `${title} | BrandSutra` : siteTitle);
    updateMetaTag("property", "og:description", description || defaultDesc);
    updateMetaTag("property", "og:type", ogType);
    if (ogImage) {
      updateMetaTag("property", "og:image", ogImage);
    }

    // Twitter Card
    updateMetaTag("name", "twitter:title", title ? `${title} | BrandSutra` : siteTitle);
    updateMetaTag("name", "twitter:description", description || defaultDesc);

    // Canonical link
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "canonical");
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute("href", canonical);
    }
  }, [title, description, keywords, canonical, ogImage, ogType]);

  return null;
}
