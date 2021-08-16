const pxtorem = require('postcss-pxtorem');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack')

const { ANALYZER } = process.env;

module.exports = {
  pages: {
    alipay: {
      entry: 'src/pages/alipay',
      template: 'public/index.html',
      title: '订单详情',
    },
  },

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 75, // 换算的基数(设计图750的根字体为75)
            propList: ['*'],
          }),
        ],
      },
    },
  },

  chainWebpack(config) {
    config.resolve.alias.set('@', '/src')
    ANALYZER && config.plugin('analyzer').use(BundleAnalyzerPlugin)

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 10240 }))
    /*
      优化moment库体积
    */
    config.plugin('moment').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/])
  },
};
