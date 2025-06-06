const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack"); // Import webpack module
require("dotenv").config({ path: "./.env" }); // Load environment variables from .env file

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.[contenthash].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"] // ✅ Add .jsx extension
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // ✅ Process both .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            "process.env.REACT_APP_API_URL": JSON.stringify(process.env.REACT_APP_API_URL),
        }),
    ]
};