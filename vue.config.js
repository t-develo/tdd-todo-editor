module.exports = {
    configureWebpack: {
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
