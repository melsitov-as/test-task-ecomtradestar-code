const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'bundle.min.js',
    },
    devtool: isProduction ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.json$/,
          type: 'asset/resource',
          generator: {
            filename: '../locales/[name][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json'],
      modules: [path.resolve(__dirname, 'src/js'), 'node_modules'],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin()],
    },
  };
};
