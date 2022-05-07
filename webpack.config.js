const path = require("path")
const webpack = require("webpack")

// for webpack to work, you need the input which is the entry, output to where it is going, and the development stage
module.exports = {
    entry: './assets/js/script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    mode: 'development'
}