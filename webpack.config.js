const config = {
  mode: 'production', //режим раоботы
  entry: {  //какие файлы будет собирать

    // Добавлять новые 
    index: './src/js/index.js',
    contacts: './src/js/contacts.js',
    // about: './src/js/about.js'
  },
  output: { //[name] - будет попадать текущее имя файла
    filename: '[name].bundle.js',
    // filename: 'main.js',
    // path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
}

module.exports = config // export
