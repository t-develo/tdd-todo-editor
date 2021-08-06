const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                components: path.join(__dirname, 'src/components'),
                views: path.join(__dirname, 'src/views'),
            },
        },
        devtool: 'inline-cheap-module-source-map',
        output: {
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate:
                '[absolute-resource-path]?[hash]',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
            ],
        },
    },
};
