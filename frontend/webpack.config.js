const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginDjango = require("html-webpack-plugin-django");

module.exports = (env, argv) => {
    return {
        mode: 'development',
        entry: "./src/index.js",
        devtool: 'inline-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Development',
            }),
            new HtmlWebpackPluginDjango({ bundlePath: "dist" }),
        ],
        output: {
            // filename: 'bundle.js',
            path: path.resolve(__dirname, 'static/frontend'),
            publicPath: '/static/',
            assetModuleFilename: "[name][ext]",
        },
        module: {
            rules: [
                { test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                        },
                    },
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        // output: {
        // 	filename: "[name].js",
        // 	path: path.resolve(__dirname, 'static/frontend'),
        // 	publicPath: '/static/',
        // 	chunkFilename: '[id].[chunkhash].js',
        // 	clean: true,
        // },
        // optimization: {
        // 	runtimeChunk: 'single',
        // },
    };
};
