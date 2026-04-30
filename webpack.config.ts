// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from 'node:path';
import webpack from 'webpack';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isProduction = process.env.NODE_ENV === 'production';

const publicEnv = {
  'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL ?? ''),
  'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY ?? '')
};

const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

type Configuration = webpack.Configuration & { devServer?: Record<string, unknown> };

const config: Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },
  devServer: {
    static: 'dist',
    open: true,
    port: 3210,
    hot: true,
    historyApiFallback: true,
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: ['/node_modules/'],
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.html$/i,
        use: ['html-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.DefinePlugin(publicEnv)
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

if (isProduction) {
  config.mode = 'production';
  config.plugins = config.plugins ?? [];
  config.plugins.push(new MiniCssExtractPlugin());
  config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
} else {
  config.mode = 'development';
  console.info('Running process in development mode.');
}

export default config;