const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./client/index.js",
  output: {
    publicPath: "/build/",
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    port: 8080,
    publicPath: "/build/",
    proxy: {
      "/": {
        target: "http://localhost:3000",
        // pathRewrite: { "^/api": "" },
      },
      //fixing the bug "failed: WebSocket is closed before the connection is established."
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: ["source-map-loader"],
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/, // |bower_components
        use: [
          // Creates style nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
