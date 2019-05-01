const path = require('path');
const nodeExternals = require('webpack-node-externals');

const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
    target: 'node',
    entry: { server: './server/server.js' },
    externals: [nodeExternals()],
    node: { __dirname: true, __filename: true },
    output: {
        path: path.resolve(CURRENT_WORKING_DIR, "public"),
        filename: '[name].js',
        publicPath: '/'
    }
}