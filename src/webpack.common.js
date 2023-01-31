const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
      path: __dirname + '/dist',
      filename: "bundle.js?v=[contenthash]",
      publicPath: "/" // This ensures dynamic client-side routing works for subpaths
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  devServer: {
    // Support dynamic client-side routing
    historyApiFallback: true
  },

  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        components: __dirname + "/src/components/",
        api: __dirname + "/src/api/",
        models: __dirname + "/src/models/",
        helpers: __dirname + "/src/helpers/",
        Router: __dirname + "/src/Router.tsx"
      }
  },

  module: {
      rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
          { test: /\.tsx?$/, loader: "ts-loader" },

          // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
          { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'typings-for-css-modules-loader',
                options: {
                  modules: true,
                  namedExport: true,
                  camelCase: true
                }
              }
            ]
          }
      ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  // },

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
        }
      ]
    }),
    new CopyPlugin([
      { from: 'public' }
    ]),
    new CopyPlugin([
      { from: 'staticwebapp.config.json' }
    ])
  ]
};