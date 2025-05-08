// .eleventy.js

const { DateTime } = require("luxon");
const slugify = require("slugify");

module.exports = function(eleventyConfig) {
  // --- Add Date Filters ---
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Ensure dateObj is a Date object before passing to Luxon
    const jsDate = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    // Default to UTC zone if not specified, and use "LLL dd, yyyy" format
    return DateTime.fromJSDate(jsDate, { zone: zone || "utc" }).toFormat(format || "LLL dd, yyyy");
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj, zone) => {
    // Ensure dateObj is a Date object before passing to Luxon
    const jsDate = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    // Default to UTC zone if not specified, and use "yyyy-LL-dd" format
    return DateTime.fromJSDate(jsDate, { zone: zone || 'utc' }).toFormat('yyyy-LL-dd');
  });

  // --- Add Slugify Filter ---
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str) {
      return "";
    }
    return slugify(str, {
      lower: true,      // convert to lower case
      strict: true,     // strip special characters except replacement
      remove: /[#,&,+()$~%.'":*?<>{}]/g // remove characters that slugify doesn't handle by default
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
        // Sort by date - newest first
        // 'a.date' and 'b.date' refer to the 'date' field in your posts' frontmatter.
        return b.date - a.date;
      });
  });

  // --- Configure Passthrough Copy for Assets ---
  // This tells Eleventy to copy the 'assets/' directory from the project root
  // and all its contents to the '_site/assets/' directory.
  eleventyConfig.addPassthroughCopy("assets"); 
  // If you had other static folders at the root, like a 'static' folder for favicons:
  // eleventyConfig.addPassthroughCopy("static");

  // This return block MUST come AFTER all eleventyConfig modifications.
  return {
    // Directory configuration: Tells Eleventy where to find specific files.
    dir: {
      // The main folder containing your content files (Markdown, Nunjucks pages, etc.).
      input: "content",

      // The folder (relative to the project root) where Eleventy looks for
      // reusable template parts (like headers, footers, layouts).
      // Note the '../' - this means it's outside the 'input' directory.
      includes: "../templates/_includes",

      // The folder (relative to the project root) where global data files
      // (like metadata.json) are stored.
      data: "../_data",

      // The folder where Eleventy will write the final built website files.
      output: "_site"
    },

    // Template formats Eleventy should process.
    // Files with these extensions in the 'input' directory will be processed.
    templateFormats: ["md", "njk", "html"],

    // Default template engine to use for Markdown files.
    // This means you can use Nunjucks templating inside your .md files.
    markdownTemplateEngine: "njk",

    // Default template engine to use for HTML files.
    // This means you can use Nunjucks templating inside your .html files.
    htmlTemplateEngine: "njk",

    // You can optionally specify a pathPrefix if your site will be hosted
    // in a subdirectory (e.g., "my-blog" if hosted at example.com/my-blog/).
    // pathPrefix: "/" // Default is root directory
  };
};
