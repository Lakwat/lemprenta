// .eleventy.js
// Import Luxon for date formatting
const { DateTime } = require("luxon");
// Import the URL plugin for absolute URLs (if you installed it per Step 68)
// const pluginUrl = require("@11ty/eleventy-plugin-url"); // Uncomment if you completed Step 68

module.exports = function(eleventyConfig) {

    // Passthrough copy for static assets
    // This copies the 'templates/assets/' directory to '_site/assets/'
    eleventyConfig.addPassthroughCopy("templates/assets");
    // If you have other static directories, like an 'img' folder at the root:
    // eleventyConfig.addPassthroughCopy("img");

    // Date Formatting Filters using Luxon
    // For displaying readable dates, e.g., "15 May 2023"
    eleventyConfig.addFilter("readableDate", (dateObj, format = "dd LLL yyyy", locale = "ca") => {
        // Assuming dateObj is a JavaScript Date object (Eleventy typically provides this for frontmatter dates)
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).setLocale(locale).toFormat(format);
    });

    // For formatting dates for the <time> datetime attribute, e.g., "2023-05-15"
    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Year shortcode for footer
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Posts collection
    // Gathers all markdown files from 'content/posts/' and sorts them by date (newest first)
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/posts/**/*.md").sort(function(a, b) {
            return b.date - a.date; // Sort by date, newest first
        });
    });
    
    // Tags collection (from guide example, useful for creating tag pages)
    eleventyConfig.addCollection("tagList", function(collectionApi) {
        let tagSet = new Set();
        collectionApi.getAll().forEach(function(item) {
            if ("tags" in item.data) {
                let tags = item.data.tags;
                if (typeof tags === "string") {
                    tags = [tags];
                }
                tags = tags.filter(item => {
                    switch(item) {
                        // AllTags list are lowercase
                        case "all":
                        case "nav":
                        case "post":
                        case "posts":
                            return false;
                    }
                    return true;
                });
                for (const tag of tags) {
                    tagSet.add(tag);
                }
            }
        });
        return [...tagSet].sort();
    });


    // If you installed and want to use @11ty/eleventy-plugin-url (Step 68)
    // eleventyConfig.addPlugin(pluginUrl);

    // Eleventy configuration
    return {
        // Define input and output directories
        dir: {
            input: "content", // Where Eleventy looks for content files
            includes: "../templates/_includes", // Relative to input dir, so effectively `project_root/templates/_includes`
            layouts: "../templates/_includes/layouts", // Relative to input dir, so effectively `project_root/templates/_includes/layouts`
            data: "../_data", // Relative to input dir, so effectively `project_root/_data`
            output: "_site" // Where the generated site is placed
        },
        // Specify which template languages to process
        templateFormats: ["md", "njk", "html"],
        // Use Nunjucks for Markdown files, allowing Nunjucks templating within Markdown
        markdownTemplateEngine: "njk",
        // Use Nunjucks for HTML files, allowing Nunjucks templating within HTML
        htmlTemplateEngine: "njk",
        // Passthrough file extensions (these are copied as-is, useful if not handled by addPassthroughCopy)
        passthroughFileCopy: true
    };
};
