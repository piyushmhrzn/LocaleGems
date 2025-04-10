const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack"); // Import webpack module
require("dotenv").config({ path: "./.env" }); // Load .env file

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/"
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
            watch: true,
            serveIndex: false, // Disable directory listing
        },
        historyApiFallback: true, // Ensure React SPA routing works
        open: true,
        compress: true,
        hot: true,
        port: 4000,
    },
    resolve: {
        extensions: [".js", ".jsx"] // Add .jsx extension
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,    // Process both .js and .jsx files
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
                use: ["style-loader", "css-loader"]
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
        new webpack.DefinePlugin({
            "process.env.REACT_APP_API_URL": JSON.stringify(process.env.REACT_APP_API_URL),
        }),
    ]
};