var webpack = require('webpack');
var path = require('path'); //在win和linux系下文件路径可能存在左斜杠与右斜杠的问题，因此require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: path.join(__dirname, "js/app/index.js"), //准确定位
    output: {
        path: path.join(__dirname, "../public"),
        filename: "js/index.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader", "postcss-loader"]
                }) //将css打包成一个文件
        }]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, "js/lib/jquery-2.0.3.min.js"),
            mod: path.join(__dirname, "js/mod"),
            less: path.join(__dirname, "less")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new ExtractTextPlugin("css/index.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer(),
                ]
            }
        })
    ]
}