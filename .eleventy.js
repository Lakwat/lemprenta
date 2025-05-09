// .eleventy.js
const { DateTime } = require("luxon");
const slugify = require("slugify");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  const sitePathPrefix = "/lemprenta"; // Define it once

  // Make pathPrefix available in templates
  eleventyConfig.addGlobalData("sitePathPrefix", sitePathPrefix);

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

  // --- Add the Eleventy RSS plugin ---
  eleventyConfig.addPlugin(pluginRss);

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
    pathPrefix: sitePathPrefix // Use the variable here
  };
};