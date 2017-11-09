const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const uglifySaveLicense = require('uglify-save-license');
const electronVersion = require('./package.json').devDependencies.electron.slice(1);

const isProduction = process.env.NODE_ENV === 'production';

const common = {
  devtool: isProduction ? false : 'inline-source-map',
  node: { __filename: true, __dirname: false },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  watchOptions: { ignored: /node_modules|lib/ },
};

const tsLoader = {
  rules: [{
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: { compilerOptions: { sourceMap: !isProduction } }
      }
    ]
  }]
};

const clientSide = {
  entry: {
    index: './src/public/js/index.ts'
  },
  externals: /^electron$/,
  module: tsLoader,
  output: { filename: 'lib/public/js/[name].js', libraryTarget: 'commonjs2' },
  plugins: [
    new CopyWebpackPlugin(
      [{ from: 'src/', to: 'lib/' }],
      { ignore: ['test/', '*.ts', '*.tsx'] },
    ),
    ...(
      !isProduction ? [] : [
        new webpack.optimize.UglifyJsPlugin({
          output: { comments: uglifySaveLicense }
        })
      ]
    )
  ],
  target: 'electron-renderer',
};

const remote = {
  entry: {
    index: './src/remote/js/index.tsx'
  },
  module: tsLoader,
  output: { filename: 'lib/remote/js/[name].js' },
  plugins: [
    new CopyWebpackPlugin(
      [{ from: 'src/', to: 'lib/' }],
      { ignore: ['test/', '*.ts', '*.tsx'] },
    ),
    ...(
      !isProduction ? [] : [
        new webpack.optimize.UglifyJsPlugin({
          output: { comments: uglifySaveLicense }
        })
      ]
    )
  ],
  target: 'web',
};

const serverSide = {
  entry: {
    index: './src/index.ts'
  },
  externals: /^(?!\.)/,
  module: tsLoader,
  output: { filename: 'lib/[name].js', libraryTarget: 'commonjs2' },
  target: 'electron-main',
};

module.exports = [
  { ...common, ...clientSide },
  { ...common, ...remote },
  { ...common, ...serverSide },
];
