module.exports = {
  isProd:
    process.env.ELEVENTY_ENV === 'production' ||
    process.env.NODE_ENV === 'production'
};

