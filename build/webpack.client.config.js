const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const getMinimizerLoaders = require('./minimizerLoader')
const resolve = require('./resolve')

const base = require('./webpack.base.config')

const clientConfig = env => {
  const packageDirectory = resolve(`packages/${env.PACKAGE_NAME}`)
  console.info(`Processing PACKAGE_NAME ${env.PACKAGE_NAME} in package directory ${packageDirectory}.`)

  const outputPath = path.join(packageDirectory, 'dist')
  console.info('Output path: ' + outputPath)
  const config = {
    entry: {
      app: path.join(packageDirectory, 'src', 'client-entry.ts'),
    },
    output: {
      path: outputPath,
      publicPath: '/',
      filename: 'assets/js/[name].[chunkHash].js',
    },
    optimization: {
      minimizer: getMinimizerLoaders(),
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },

    plugins: [
      new VuetifyLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(packageDirectory, './index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/[name].[contentHash].css',
      }),
      new CopyWebpackPlugin([
        { from: path.join(packageDirectory, 'appInfo.json') },
        { from: path.join(packageDirectory, 'packaging/*.json') },
        { from: path.join(packageDirectory, 'web.config') },
      ]),
    ],
  }

  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
      new webpack.SourceMapDevToolPlugin({
        publicPath: 'http://localhost:9999/',
        filename: '[file].map',
      }),
    )
  }
  
  return config
}

module.exports = env => merge(base(env), clientConfig(env), {})
