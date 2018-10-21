import { join } from 'path';

module.exports = {
    target: 'node',
    mode: 'development',
    entry: join(__dirname, './src/sandwich-stream.ts'),
    node: {
        __dirname: false
    },
    output: {
        filename: 'sandwich-stream.js',
        path: join(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'sandwich-stream': join(__dirname, './src/sandwich-stream.ts')
        },
        extensions: [
            '.js',
            '.ts',
            '.tsx'
        ]
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /tests/
                ]
            }
        ]
    }
};
