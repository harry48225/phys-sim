const path = require('path')

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'physics',
        libraryTarget: 'window'
    },
    optimization: {
        minimize: false
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        injectClient: false,
        
    },
}