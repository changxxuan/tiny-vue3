const path = require("path");
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./main.js"),
    output: {
        filename: "build.js",
        path: path.resolve(__dirname, "./dist"),
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist")
    },
};