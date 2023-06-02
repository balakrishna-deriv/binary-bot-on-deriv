const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BlocklyConcatPlugin = require('./customPlugins/blockly-concat-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src', 'botPage', 'view', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'index.js',
        sourceMapFilename: 'index.js.map',
    },
    devtool: 'source-map',
    watch: true,
    target: 'web',
    externals: {
        CIQ: 'CIQ',
        blockly: 'Blockly',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: path.resolve(__dirname, 'www', 'public', 'image'),
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: path.resolve(__dirname, 'www', 'public', 'font'),
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['www']),
        new Dotenv(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/@deriv/deriv-charts/dist/*.smartcharts.*',
                to: path.resolve(__dirname, 'www/js'),
                flatten: true,
            },
            {
                from: 'node_modules/binary-style/src/images/favicons',
                to: path.resolve(__dirname, 'www/image/favicons'),
            },
            {
                from: 'public',
                to: path.resolve(__dirname, 'www/public'),
            },
            {
                from: 'public/localstorage-sync.html',
                to: path.resolve(__dirname, 'www'),
            },
            {
                from: 'templates/index.html',
                to: path.resolve(__dirname, 'www'),
            },
        ]),
        new BlocklyConcatPlugin({
            outputPath: path.resolve(__dirname, 'www'),
            fileName: 'blockly.js',
            filesToConcat: [
                './node_modules/blockly/blockly_compressed.js',
                './node_modules/blockly/blocks_compressed.js',
                './node_modules/blockly/javascript_compressed.js',
                './node_modules/blockly/msg/messages.js',
            ],
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'www'),
        port: 8081,
        open: true,
    },
};
