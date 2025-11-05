// Fix MaxListenersExceededWarning
require("events").defaultMaxListeners = 200;

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");
const markdownIt = require("markdown-it");
const { DateTime } = require("luxon");

// Import prior to `module.exports` within `.eleventy.js`
const slugify = require("slugify");

module.exports = (config) => {
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  if (!config._filtersRegistered) {
    config.addFilter("dateFilter", dateFilter);
    config.addFilter("w3DateFilter", w3DateFilter);
    config.addFilter("log", (value) => console.log(value));
    config._filtersRegistered = true;
  }

  // Browsersync configuration
  config.setBrowserSyncConfig({
    host: "192.168.86.90",
    port: 3000,
    open: true,
    notify: false,
    files: [
      "src/**/*", // Watch the output folder
      "dist/**/*", // Watch the output folder
      "!dist/images/**/*", // Ignore image changes in output
    ],
  });

  config.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  config.addGlobalData("rootURL", "https://www.l3networks.com");

  config.setLibrary("md", markdownIt(options));

  config.addFilter("sortByText", (array) => {
    if (!Array.isArray(array)) {
      console.warn("sortByText filter expects an array.");
      return array;
    }
    return array.sort((a, b) => a.text.localeCompare(b.text));
  });

  config.addShortcode("year", () => `${new Date().getFullYear()}`);

  config.addPassthroughCopy("./src/images/");
  // Copy videos to dist so <video> sources resolve
  config.addPassthroughCopy("./src/videos/");
  // Copy local JS assets used by layouts
  config.addPassthroughCopy("./src/js/");
  // Expose external Resources drop-in: anything placed in src/resources
  // is copied verbatim to /resources/ in the build output.
  config.addPassthroughCopy("./src/resources/");
  config.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.js": "./js/alpine.js",
  });
  // Ensure static CSS assets (e.g., swiper, kit.css) are available at /css/
  config.addPassthroughCopy("css");

  // Add filters
  config.addFilter("dateFilter", dateFilter);
  config.addFilter("w3DateFilter", w3DateFilter);
  config.addFilter("log", (value) => {
    console.log(value);
  });

  config.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Returns work items, sorted by display order
  config.addCollection("blogs", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/blogs/*.md"));
  });

  // Returns work items, sorted by display order then filtered by featured
  config.addCollection("featuredWork", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md")).filter((x) => x.data.featured);
  });

  // Returns a collection of blog posts in reverse date order
  config.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  // Returns a list of people ordered by filename
  config.addCollection("faqs", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/glossary/*.md"));
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
    pathPrefix: "",
  };
};
