/*
 * Copyright (C) 2024 brittni and the polar bear LLC.
 *
 * This file is a part of azurepolarbear's 365 algorithmic art project,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * The visual outputs of this source code are licensed under the
 * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
 * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
 * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
 * for full license details.
 */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');

module.exports = {
    entry: {
        fxhash_head: {
            import: './src/fxhash/fxhash.min.js',
            filename: 'fxhash.min.js'
        },
        p5: 'p5',
        genart: {
            import: '@batpb/genart',
            dependOn: ['p5']
        },
        sketch: {
            import: './src/main/sketch.ts',
            filename: 'index.js',
            dependOn: ['p5', 'genart']
        }
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '365',
            inject: 'body',
            favicon: './assets/icon/favicon.ico'
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackInjector()
    ],
    optimization: {
        // concatenateModules: true,
        emitOnErrors: false,
        // mangleExports: true,
        // mergeDuplicateChunks: true,
        minimize: true,
        // providedExports: true,
        // removeAvailableModules: true,
        // removeEmptyChunks: true,
        splitChunks: {
            chunks: 'all'
        },
        usedExports: true
    },
    output: {
        path: path.resolve(__dirname, 'out/dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[name].js',
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'out/dist')
        },
        client: {
            overlay: true
        },
        compress: true,
        host: '127.0.0.1',
        port: 8080,
        hot: false,
        watchFiles: ['./src/**/*.ts'],
        liveReload: true,
        open: true,
        webSocketServer: false
    }
};
