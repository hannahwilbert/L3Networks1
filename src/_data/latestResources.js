const EleventyFetch = require("@11ty/eleventy-cache-assets");
const vm = require("vm");

const RESOURCES_URL = "https://l3networks.com/resources/";
const ABSOLUTE_BASE = "https://l3networks.com";

module.exports = async function () {
  try {
    const html = await EleventyFetch(RESOURCES_URL, {
      type: "text",
      duration: "1h",
    });

    const match = html.match(/window\.resources\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) {
      return [];
    }

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`result = ${match[1]}`, sandbox);
    const resources = sandbox.result || [];
    const sorted = resources
      .filter((item) => item && item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map((item) => {
        const dateObj = item.date ? new Date(item.date) : null;
        const displayDate = dateObj
          ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : null;
        return {
          title: item.title,
          description: item.description,
          type: item.type,
          url: new URL(item.url || "", ABSOLUTE_BASE).href,
          image: new URL(item.thumbnail || "/images/social/og_default.png", ABSOLUTE_BASE).href,
          tags: item.tags || [],
          date: item.date || null,
          dateDisplay: displayDate,
          readTime: item.readTime || null,
        };
      });

    return sorted;
  } catch (error) {
    console.error("Unable to load latest resources:", error);
    return [];
  }
};
