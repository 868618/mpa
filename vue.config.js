const pxtorem = require('postcss-pxtorem')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')

const { ANALYZER, CONSOLE } = process.env

const VConsolePlugin = require('vconsole-webpack-plugin')

const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          /*
            最少引用两次的第三方库才抽离为公共文件
          */
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
            minChunks: 2,
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: './*.txt',
          },
        ],
      }),
    ],
  },

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
    // recharge: {
    //   entry: 'src/modules/recharge/main.js',
    //   template: 'src/modules/recharge/public/index.html',
    //   title: '充值',
    // },
    recharge: {
      entry: 'src/modules/recharge/main.js',
      template: 'src/modules/recharge/public/index.html',
      title: '充值',
    },
    refresh: {
      entry: 'src/modules/recharge/refresh.js',
      template: 'src/modules/recharge/public/index.html',
      title: '等待支付结果',
    },

    result: {
      entry: 'src/modules/recharge/result.js',
      template: 'src/modules/recharge/public/index.html',
      title: '充值结果',
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
    // config.plugin('copy-webpack-plugin').use(CopyPlugin, [{
    //   patterns: [
    //     {
    //       from: 'src/config/*.txt',
    //       to: 'dist',
    //       context: 'mpa/',
    //     },
    //   ],
    // }])

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
