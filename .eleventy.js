const htmlmin = require('html-minifier');
const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  // Watch CSS files for changes - being more explicit with the pattern
  eleventyConfig.addWatchTarget('./src/assets/css/**/*.css');

  // Better console output during development
  eleventyConfig.setQuietMode(false);

  eleventyConfig.addTransform('htmlmin', function (content) {
    // Only minify HTML in production
    if (process.env.NODE_ENV === 'production') {
      if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
        });
        return minified;
      }
    }
    return content;
  });

  eleventyConfig.addFilter('cssmin', function (code) {
    if (process.env.NODE_ENV === 'production') {
      return new CleanCSS({}).minify(code).styles;
    }
    return code;
  });

  // Add the css shortcode
  eleventyConfig.addPairedShortcode('css', function (content) {
    if (process.env.NODE_ENV === 'production') {
      return new CleanCSS({}).minify(content).styles;
    }
    return content;
  });

  // Process CSS for both inline and external use
  eleventyConfig.addTemplateFormats('css');

  // Process CSS files with this handler
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (inputContent, inputPath) => {
      // Ignore the bundle.css file - we'll handle it directly
      if (inputPath.includes('bundle.css')) {
        return;
      }

      return async () => {
        // Return the content as-is in development, minify in production
        if (process.env.NODE_ENV === 'production') {
          return new CleanCSS({}).minify(inputContent).styles;
        }
        return inputContent;
      };
    },
  });

  // Add a function to read CSS file for inline use if desired
  eleventyConfig.addGlobalData('inlineCss', function () {
    const cssPath = path.join(__dirname, 'src/assets/css/bundle.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Don't minify CSS in development mode to help with debugging
    if (process.env.NODE_ENV === 'production') {
      return new CleanCSS({}).minify(css).styles;
    }
    return css;
  });

  // Make external CSS available for separate loading
  // Make sure this bundle.css gets copied directly
  eleventyConfig.addPassthroughCopy({
    './src/assets/css/bundle.css': './assets/css/bundle.css',
  });

  // Copy other static files
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/apple-touch-icon.png');
  eleventyConfig.addPassthroughCopy('src/favicon-32x32.png');
  eleventyConfig.addPassthroughCopy('src/favicon-16x16.png');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');
  eleventyConfig.addPassthroughCopy('src/safari-pinned-tab.svg');

  // Enable Browsersync's live reload with specific CSS pattern
  eleventyConfig.setBrowserSyncConfig({
    files: ['./_site/assets/css/**/*.css', './_site/**/*.html'],
    open: true,
    notify: true,
    ui: false,
    ghostMode: false,
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Add 404 http status code in request header
          res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          // Provides the 404 content without redirect
          res.write(content_404);
          res.end();
        });
      },
    },
  });

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
    templateFormats: ['html', 'md', 'njk', 'css'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
};
