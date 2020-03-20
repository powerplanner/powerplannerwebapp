module.exports = {
  entry: "./src/index.tsx",
  output: {
      path: __dirname + '/dist',
      filename: "bundle.js",
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
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

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
  }
};