const htmlmin = require('html-minifier');
const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform('htmlmin', function (content) {
    // Prior to Eleventy 2.0: use this.outputPath instead
    if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Add the css shortcode
  eleventyConfig.addPairedShortcode('css', function (content) {
    return new CleanCSS({}).minify(content).styles;
  });

  // Add a function to read and minify CSS files
  eleventyConfig.addGlobalData('css', function () {
    const cssPath = path.join(__dirname, 'src/assets/css/bundle.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    return new CleanCSS({}).minify(css).styles;
  });

  // Copy static files
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/apple-touch-icon.png');
  eleventyConfig.addPassthroughCopy('src/favicon-32x32.png');
  eleventyConfig.addPassthroughCopy('src/favicon-16x16.png');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/safari-pinned-tab.svg');

  // Date formatting
  eleventyConfig.addFilter('dateReadable', dateObj => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter('dateIso', dateObj => {
    return DateTime.fromJSDate(dateObj).toISO();
  });

  // Collections
  eleventyConfig.addCollection('post', function (collection) {
    return collection.getFilteredByTag('post');
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_includes',
    },
    templateFormats: ['html', 'md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
