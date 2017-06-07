
// Base kyt config.
// Edit these properties to make changes.

module.exports = {
  reactHotLoader: true,
  debug: false,
  modifyWebpackConfig: (baseConfig) => {
    baseConfig.entry.main.push('whatwg-fetch');
    baseConfig.resolve.extensions.push('.jsx');
    // modify baseConfig based on the options
    return baseConfig;
  },
};
