const path = require("path");

const config = {
    target: "electron-main",
    devtool: "source-map",
    entry: "./src/main.ts",
    output: {
        filename: "main.js",
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
                        name: "./assets/[hash].[ext]",
                    },
                },
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css" }
                ]

            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    node: {
        __dirname: false,
        __filename: false
    }
};

module.exports = (env, argv) => {
    return config;
};