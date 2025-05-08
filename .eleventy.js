// .eleventy.js

const { DateTime } = require("luxon");
const slugify = require("slugify");
// --- CORRECTED: Require the Eleventy RSS plugin ---
// This plugin also provides the |url and |absoluteUrl filters.
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // --- Add Date Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    const jsDate = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return DateTime.fromJSDate(jsDate, { zone: zone || "utc" }).toFormat(format || "LLL dd, yyyy");
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj, zone) => {
    const jsDate = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    return DateTime.fromJSDate(jsDate, { zone: zone || 'utc' }).toFormat('yyyy-LL-dd');
  });

  // --- Add Slugify Filter ---
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str) {
      return "";
    }
    return slugify(str, {
      lower: true,
      strict: true,
      remove: /[#,&,+()$~%.'":*?<>{}]/g
    });
  });

  // --- Add Year Shortcode ---
  eleventyConfig.addShortcode("year", function() {
    return new Date().getFullYear().toString();
  });

  // --- Add Posts Collection ---
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/posts/**/*.md")
      .sort(function(a, b) {
        return b.date - a.date; // Sort by date - newest first
      });
  });

  // --- Configure Passthrough Copy for Assets ---
  eleventyConfig.addPassthroughCopy("assets");

  // --- CORRECTED: Add the Eleventy RSS plugin ---
  // This provides the necessary URL filters along with RSS feed generation capabilities.
  eleventyConfig.addPlugin(pluginRss);
  // --- END CORRECTED ---

  // This return block MUST come AFTER all eleventyConfig modifications.
  return {
    dir: {
      input: "content",
      includes: "../templates/_includes",
      data: "../_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Path prefix for GitHub Pages deployment
    pathPrefix: "/lemprenta"
  };
};
