const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxPlugin = require("workbox-webpack-plugin");
const webpack = require("webpack");
const workboxConfig = require("./workbox-config.js")

const path = require("path");

require("dotenv").config();

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    bundle: ["./src/main.js"]
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte", "browser", "import"]
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js",
    chunkFilename: "bundle.[name].js"
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true,
            compilerOptions: {
              dev: !prod
            },
            preprocess: require("svelte-preprocess")()
          }
        }
      },
      {
        // Required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]"
        }
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new workboxPlugin.GenerateSW(workboxConfig),
    new webpack.DefinePlugin({
      "process.env.APPWRITE_ENDPOINT": JSON.stringify(process.env.APPWRITE_ENDPOINT || "https://appwrite.datawarp.dev/v1"),
      "process.env.APPWRITE_PROJECT": JSON.stringify(process.env.APPWRITE_PROJECT || ""),
      "process.env.APPWRITE_BUCKET_ID": JSON.stringify(process.env.APPWRITE_BUCKET_ID || "backups")
    })
  ],
  devtool: prod ? false : "source-map"
};