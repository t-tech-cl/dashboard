const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config) {
  // Ensure fallback dependencies are properly resolved
  config.resolve.fallback = {
    process: require.resolve('process/browser.js'),
    stream: require.resolve('stream-browserify/index.js'),
    crypto: require.resolve('crypto-browserify/index.js'),
    util: require.resolve('util/util.js'),
    buffer: require.resolve('buffer/index.js')
  };

  // Workbox plugin fix for large cache sizes in service workers
  config.plugins.forEach((plugin) => {
    if (plugin instanceof WorkBoxPlugin.InjectManifest) {
      plugin.config.maximumFileSizeToCacheInBytes = 50 * 1024 * 1024; // 50MB
    }
  });

  // Ensure ProvidePlugin is correctly configured
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer/index.js', 'Buffer']
    })
  ];

  // Ensure Webpack properly handles images
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource'
  });

  return config;
};
