const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendors : ['jquery','backbone','underscore'],
        ueditor : ['/public/ueditor/ueditor.config.js','/public/ueditor/ueditor.all.min.js','/public/ueditor/lang/zh-cn/zh-cn.js'],
        bootstrap : [path.resolve(__dirname ,"./css/bootstrap/dist/css/bootstrap.min.css")],
        echart : [path.resolve(__dirname ,"./lib/echarts.common.min.js")]
    },
    output: {
        path: path.resolve(__dirname ,"./dist/static"),
        filename: "[name].js",
        library : "[name]_library"
    },

    module: {
        rules: [{
                test: /(\.css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
            { test: /\.(woff|woff2)$/, loader: "url-loader?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
            {
                test: /\.(png|jpg|jpeg|gif|woff)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
          
        ]
    },

    plugins: [
        new webpack.DllPlugin({
        // 指定路径
            path: path.resolve(__dirname, './dist', '[name]-manifest.json'),
         // 指定依赖库的名称
           name: '[name]_library'
            })
    ]
}