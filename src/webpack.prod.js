const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // },

  // Note that this is duplicated across both dev.js and prod.js, make sure to update both!
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'google-roboto',
          entry: {
            path: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
            type: 'css',
          }
        },
        {
          module: 'google-material-icons',
          entry: {
            path: 'https://fonts.googleapis.com/icon?family=Material+Icons',
            type: 'css',
          }
        },
        {
          module: "react",
          entry: "umd/react.production.min.js",
          global: "React"
        },
        {
          module: "react-dom",
          entry: "umd/react-dom.production.min.js",
          global: "ReactDOM"
        }
      ]
    }),
    new CopyPlugin([
      { from: 'public' }
    ])
  ]
});