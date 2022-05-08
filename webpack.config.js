const path = require("path")
const webpack = require("webpack")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// for webpack to work, you need the input which is the entry, output to where it is going, and the development stage
module.exports = {
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: __dirname + "/dist",
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // the report output to an HTML file in the dist folder
        })
    ],
    mode: 'development',
    module: {
        rules: [
          {
            test: /\.jpg$/i,
            use: [
                {
                    loader: 'file-loader',
                    // this is so the names of the files is what we wrote intially and not some random file name
                    options: {
                        esModule: false,
                        name (file) {
                        return "[path][name].[ext]"
                        },
                        publicPath: function(url) {
                        return url.replace("../", "/assets/")
                        }
                    }
                },
                {
                    // image optimizer loader, to reduce size
                    loader: 'image-webpack-loader'
                }
              ]
          }
        ]
    },
}