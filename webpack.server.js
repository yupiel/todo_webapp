const path = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: 'production',
    target: 'node',
    externals: nodeExternals(),
    entry: './src/server.js',
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'dist', 'prod'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/img/[name].[ext]'
                        }
                    }
                ],
            }
        ]
    }
}