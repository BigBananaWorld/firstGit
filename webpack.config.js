const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    // watch:false,
    entry: {
        app: path.resolve(__dirname, "./app/main.js")
    },
    output: {
        path: path.resolve(__dirname , "./public"),
        publicPath:"./",
        // filename: "bundle.[chunkHash:5].js"
        filename : "bundle.js"
    },

    resolve: {
        alias: {
            Templates: path.resolve(__dirname, 'app/template'),
            Component: path.resolve(__dirname, 'app/component'),
            Utils: path.resolve(__dirname, 'app/utils'),
            JSfile: path.resolve(__dirname, 'lib'),
            CSSdir: path.resolve(__dirname, 'css')
        }
    },

    devServer:{
        contentBase : path.resolve(__dirname, './'),
        hot : true,
        inline : true
    },

    module: {
        rules: [{
                test: /(\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /(\.css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]

            },
            {
                test: /(\.html)$/,
                use: {
                    loader: "html-loader"
                }
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            { test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
            // { test: /\.(png|jpg|jpeg|gif|woff)$/, loader: 'url-loader?limit=4192&name=[path][name].[ext]' },
            {
                test: /\.(png|jpg|jpeg|gif|woff)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
            // {
            //     test: require.resolve("jquery"),
            //     use: [{
            //             loader: "expose-loader",
            //             options: "$"
            //         },
            //         {
            //             loader: "expose-loader",
            //             options: "jQuery"
            //         }
            //     ]
            // }
        ]
    },
    externals: {
        'AMap': 'AMap'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
            Backbone: "backbone"
        }),
        new HtmlWebpackPlugin({
            title : '康展爱车',
            template: 'public/tempindex.html',
            filename: 'index.html'
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/vendors-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/ueditor-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/bootstrap-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/echart-manifest.json')
        }),
        new webpack.HotModuleReplacementPlugin()
        /*
         部署在生产环境的时候使用
         */
        // new UglifyJSPlugin({
        //     sourceMap: false
        // })
    ]
}