const pxtorem = require('postcss-pxtorem')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// eslint-disable-next-line import/no-extraneous-dependencies
const { IgnorePlugin } = require('webpack')

const { ANALYZER, CHANNEL } = process.env

const pages = {
  alipay: {
    entry: 'src/pages/alipay',
    template: 'public/index.html',
    title: '订单详情',
  },
}

module.exports = {
  pages: {
    [CHANNEL]: pages[CHANNEL],
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
    /*
      别名配置
    */
    config.resolve.alias.set('@', '/src')

    /*
      打包分析
    */
    ANALYZER && config.plugin('analyzer').use(BundleAnalyzerPlugin)

    /*
      图片小于10k就自动转base64
    */
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 10240 }))

    /*
      优化moment库打包体积
    */
    config.plugin('moment').use(IgnorePlugin, [/^\.\/locale$/, /moment$/])
  },
};
