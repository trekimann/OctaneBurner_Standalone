const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const config = {
    target: "electron-renderer",
    devtool: "source-map",
    entry: "./src/CORE/app/renderer.tsx",
    output: {
        filename: "renderer.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [{
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "./assets/[name].[ext]",
                    },
                },
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]

            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [htmlPlugin],
    stats: {
        children: false
    }
};

module.exports = (env, argv) => {
    return config;
};