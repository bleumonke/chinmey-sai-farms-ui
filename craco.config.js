const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const plugin = webpackConfig.plugins.find(
        (p) => p.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );

      if (plugin) {
        plugin.options.memoryLimit = 1024;
      }

      return webpackConfig;
    },
  },
};
