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
  hasServer: true,
  modifyWebpackConfig: (baseConfig) => {
    baseConfig.plugins.push(new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'src/favicon.ico',
    }));

    baseConfig.plugins.push(new webpack.DefinePlugin(GLOBALS));

    baseConfig.resolve.extensions.push('.jsx');

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
