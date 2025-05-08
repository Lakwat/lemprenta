// .eleventy.js

const { DateTime } = require("luxon");
const slugify = require("slugify");

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
    // --- NEW: Add pathPrefix for GitHub Pages subdirectory deployment ---
    // IMPORTANT: Replace "/your-repository-name" with the actual name of your GitHub repository,
    // preceded by a slash. For example, if your repo is "my-automated-blog",
    // this should be "/my-automated-blog".
    // If your repository IS your-username.github.io, you can comment this line out or use "/".
    pathPrefix: "/lemprenta" // <--- !!! UPDATE THIS LINE !!!
  };
};
