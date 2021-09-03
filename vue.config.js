const pxtorem = require('postcss-pxtorem')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')

const { ANALYZER, CONSOLE } = process.env

const VConsolePlugin = require('vconsole-webpack-plugin')

module.exports = {
  // configureWebpack: {
  //   plugins: [
  //     ['import', {
  //       libraryName: 'vant',
  //       libraryDirectory: 'es',
  //       style: true,
  //     }, 'vant'],
  //   ],
  // },

  pages: {
    index: {
      entry: 'src/modules/alipay/main.js',
      template: 'public/index.html',
      title: '订单详情',
    },
    qyk: {
      entry: 'src/modules/qyk/main.js',
      template: 'public/index.html',
      title: '权益卡',
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 75, // 换算的基数(设计图750的根字体为75)
            propList: ['*'],
            exclude: /node_modules/i, // 禁止转换安装包下的任何组件
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

    CONSOLE && config.plugin('console').use(VConsolePlugin, [{ enable: true }])

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
    // config.plugin('moment').use(IgnorePlugin, [/^\.\/locale$/, /moment$/])
  },

  devServer: {
    // 'http://local.sldshop.com',
    // proxy: {
    //   '/': {
    //     target: 'http://mall-bsy.vxwei.com/',
    //     changeOrigin: true,
    //     pathRewrite: { '^/': '' },
    //   },
    // },
    contentBase: path.resolve(__dirname, 'dist'),
    proxy: 'http://mall-bsy.vxwei.com/',
  },
};
