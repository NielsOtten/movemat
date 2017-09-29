// Base kyt config.
// Edit these properties to make changes.
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const jsYaml = require('js-yaml');
const fs = require('fs');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false,
  'process.env.CMS_BASE_URL': JSON.stringify(process.env.CMS_BASE_URL),
};

module.exports = {
  reactHotLoader: true,
  debug: false,
  hasServer: false,
  modifyWebpackConfig: (baseConfig) => {
    baseConfig.plugins.push(new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'src/favicon.ico',
    }));

    baseConfig.plugins.push(new webpack.DefinePlugin(GLOBALS));

    baseConfig.resolve.extensions.push('.jsx');

    const cssRule = baseConfig.module.rules.find(rule => rule.test.toString() === '/\\.css$/');

    // Support pcss.
    cssRule.test = /\.p?css$/;

    const globalCssRule = Object.assign({}, cssRule); // Watch out, not a deep clone!
    baseConfig.module.rules.push(globalCssRule);

    globalCssRule.include = /node_modules/;

    const globalCssLoaders = [...(globalCssRule.loader || globalCssRule.use)];

    const cssLoader = Object.assign({}, globalCssLoaders.find(l => l.loader && l.loader.includes('css-loader')));

    cssLoader.loader = cssLoader.loader.replace('modules&', '');

    if(cssLoader.options) cssLoader.options = Object.assign({}, cssLoader.options, { modules: false });

    globalCssLoaders[globalCssLoaders.findIndex(l => l.loader && l.loader.includes('css-loader'))] = cssLoader;

    if(globalCssRule.loader) {
      globalCssRule.loader = globalCssLoaders;
    } else {
      globalCssRule.use = globalCssLoaders;
    }

    baseConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: postcss([
            postcssImport,
            cssnext({
              features: {
                customProperties: {
                  variables: jsYaml.load(fs.readFileSync('./src/vars.yaml', 'utf8')),
                },
              },
            }),
          ]),
          context: '/',
        },
      })
    );

    return baseConfig;
  },
};
