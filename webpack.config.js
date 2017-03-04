const webpack = require('webpack');
const path = require('path');
const host = 'localhost';
const port = 8001;
const prod = process.argv.indexOf('-p') !== -1;

const config = {
    context: path.join(__dirname, 'src'),
    entry: {
        main: './index.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '/dist')
    },
    module: {
        loaders: [
        {
        	test: /\.js$/,
        	exclude: /node_modules/,
        	loader: 'babel-loader',
        	query: {
        		presets: ['es2015']
        	}
        },
        {
        	test: /\.html$/,
        	exclude: /node_modules/,
        	loader: 'file?name=[name].[ext]'
        }
        ]
    }
};



module.exports = config;
