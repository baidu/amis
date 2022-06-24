/**
 * @file webpack 配置文件。
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production', // development production
  entry: {
    index: ['./src/index.ts'],
    style: ['./scss/editor.scss']
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].min.js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: true,
            outDir: './lib'
          }
        }
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,

          // Creates `style` nodes from JS strings
          // 'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'), // `dart-sass` 是首选
              // webpackImporter: true, // 开启 / 关闭默认的 Webpack importer。默认为true，所以不需要额外配置这个
              sassOptions: {
                // 正常情况下不需要这个配置项，但有些情况下需要（比如导入的sass文件包含 media queries等）。
                includePaths: ['node_modules', '../../node_modules'],
              },
            },
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Creates `style` nodes from JS strings
          // 'style-loader',
          // Translates CSS into CommonJS
          'css-loader'
        ]
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // new BundleAnalyzerPlugin(),
    {
      apply(compiler) {
        compiler.hooks.shouldEmit.tap(
          'Remove styles from output',
          compilation => {
            delete compilation.assets['style.min.js']; // Remove asset. Name of file depends of your entries and
            return true;
          }
        );
      }
    }
  ],
  externals: [
    nodeExternals({
      importType: 'commonjs',
      allowlist: [/^amis\/schemas/],
      additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')]
    })
  ]
};
