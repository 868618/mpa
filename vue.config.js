const pxtorem = require('postcss-pxtorem');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
    config.resolve.alias.set('@', '/src');
    ANALYZER && config.plugin('analyzer').use(BundleAnalyzerPlugin);
  },
};
