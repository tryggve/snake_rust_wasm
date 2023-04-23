const path = require('path')
const copyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './bootstrap.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bootstrap.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                { from: './index.html', to: './' }
            ]
        })
    ]
}