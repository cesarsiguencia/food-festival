const path = require("path")
const webpack = require("webpack")
// this webpack package is for lazy loading JS files
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// for webpack pwa mobile pack to work
const WebpackPwaManifest = require("webpack-pwa-manifest");

// for webpack to work, you need the input which is the entry, output to where it is going, and the development stage
module.exports = {


    entry: {
        // files that are going through webpack
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    output: {
        // where are they going, make sure all HTML files use them 
        filename: "[name].bundle.js",
        // path: __dirname + "/dist",
        publicPath: 'production' ? '/food-festival-2/dist' : _dirname + "/dist"
    },
    plugins: [
        // we deleted initial jquery api, so now we have to install it in the terminal and use it here as a plugin
        // bootstrap needs to be installed, but not declared here as no syntax is used. 
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // the report output to an HTML file in the dist folder
        })
        ,
        new WebpackPwaManifest({
            name: "Food Event",
            short_name: "Foodies",
            description: "An app that allows you to view upcoming food events.",
            start_url: "../index.html",
            background_color: "#01579b",
            theme_color: "#ffffff",
            fingerprints: false,
            inject: false,
            icons: [{
              src: path.resolve("assets/img/icons/icon_512x512.png"),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join("assets", "icons")
            }]
          })
    ],
    mode: 'development',
    module: {
        rules: [
            //to get any sort of jpg files for images, installed as npm install -D file-loader
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
                    // image optimizer loader, to reduce size, installed as an npm as npm install image-webpack-loader
                    loader: 'image-webpack-loader'
                }
              ]
          }
        ]
    }
    ,
    devServer: {
        static: {
            directory: path.join(__dirname, '/')
        },
        compress: true,
        port: 9000
    }
}