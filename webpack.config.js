var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SriPlugin = require ('webpack-subresource-integrity');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "disco.[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

const config = {
    entry: {
        app: ["./src/disco.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/",
        filename: "disco.js",
        crossOriginLoading: "anonymous"
    },
    devServer: {
        contentBase: path.join(__dirname, "assets"),
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(glsl|frag|vert|html)$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({ template: 'assets/index.html' }),
        //new ExtractTextPlugin("disco.css"),
        extractSass
    ]
};

if (process.env.NODE_ENV === 'build') {
    config.plugins.push(
        new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: true
        })
    );
}

module.exports = config;
