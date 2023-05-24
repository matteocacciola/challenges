const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js')
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: 'public/css', name: '[name].min.css' },
                    },
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    }
};