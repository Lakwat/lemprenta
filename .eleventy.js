// .eleventy.js
// Import Luxon for date formatting
const { DateTime } = require("luxon");
// Import the URL plugin for absolute URLs (if you installed it per Step 68)
// const pluginUrl = require("@11ty/eleventy-plugin-url"); // Uncomment if you completed Step 68

module.exports = function(eleventyConfig) {

    // IMPORTANT: Set the pathPrefix for GitHub Pages deployment
    // Replace "your-repo-name" with the actual name of your GitHub repository.
    // For example, if your repo is github.com/user/my-cool-blog, set it to "/my-cool-blog/"
    // If deploying to a custom domain or the root of username.github.io, you might not need this
    // or can set it to "/"
    eleventyConfig.setPathPrefix("/your-repo-name/"); // <--- ADD AND CONFIGURE THIS LINE

    // Passthrough copy for static assets
    // This copies your root 'assets/' directory and its contents to '_site/assets/'
    eleventyConfig.addPassthroughCopy("assets");

    // Date Formatting Filters using Luxon
    eleventyConfig.addFilter("readableDate", (dateObj, format = "dd LLLL yyyy", locale = "ca") => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).setLocale(locale).toFormat(format);
    });

    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Year shortcode for footer
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Posts collection
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/posts/**/*.md").sort(function(a, b) {
            return b.date - a.date; // Sort by date, newest first
        });
    });
    
    // Tags collection
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
        dir: {
            input: "content",
            includes: "../templates/_includes",
            layouts: "../templates/_includes/layouts",
            data: "../_data",
            output: "_site"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        passthroughFileCopy: true
    };
};
