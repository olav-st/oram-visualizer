let fs = require('fs');

module.exports = 
{
  mode: "development",
  entry: {
    main: './index.js',
  },
  output: {
    filename: '[name].js'
  }
}
