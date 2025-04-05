const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map', // Добавляет sourcemaps для отладки
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
};
