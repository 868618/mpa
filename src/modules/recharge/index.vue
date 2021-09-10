<template>
    <div class="recharge" v-if="isInitialized">
        <header class="header">
            <p class="header_tip">输入充值金额（元）</p>
            <div class="money">
                <b>¥</b>
                <input type="text" v-focus v-model="money">
            </div>
        </header>

        <div class="btn">
            <Button color="#F1270D" block round @click="handleTap" :disabled="environment == 'other'">确认充值</Button>
        </div>

        <section class="toalipay" v-if="environment == 'other'" @click="evokeAlipay">
            <p class="tip">如使用微信请使用微信扫码打开此页面</p>
            <div class="alipay_btn">跳转支付宝</div>
        </section>

    </div>
</template>

<script>
import Vue from 'vue'
import { Button, Toast } from 'vant'
// import qs from 'qs'
// import qyk from '@/api/qyk'
import { isAliPayApp, isWeChat } from '@/utils/tool'
import pub from '@/api/pub'

Vue.use(Toast)

export default {
  name: 'Recharge',
  components: {
    Button,
  },

  data() {
    return {
      money: '',
      isInitialized: false,
      identity: null,
      query: window.location.search ? Object.fromEntries(window.location.search.slice(1).split('&').map(i => i.split('='))) : {},
    }
  },

  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },

  computed: {
    environment() {
      return isAliPayApp() ? 'alipay' : (isWeChat() ? 'wechat' : 'other')
    },
  },

  async created() {
    this.init()
  },

  methods: {

    async init() {
      const { environment } = this
      const { href } = window.location
      if (environment !== 'other') {
        if (environment === 'alipay') {
          if (!href.includes('auth_code')) {
            this.getAlipayAuthCode()
            return
          }
          this.getIdentity({ code: this.query.auth_code, type: 'ali' })
          return
        }

        if (environment === 'wechat') {
          if (!href.includes('code')) {
            this.getWechatAuthCode()
            return
          }
          this.getIdentity({ code: this.query.code, type: 'wechat' })
        }
        await this.addWechatOrAlipayJsSdk(environment)
        // console.log('window.wx', window.wx)
      }
      this.isInitialized = true
    },

    async getIdentity(data) {
      console.log('去获取openid', data)
      const res = await pub.getOpenId(data)
      console.log('getIdentity______', res)
    },

    addWechatOrAlipayJsSdk(name = 'wechat') {
      return new Promise(((resolve, reject) => {
        const script = document.createElement('script')
        document.head.appendChild(script)
        const alipay_sdk = 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js'
        const wechat_sdk = 'http://res.wx.qq.com/open/js/jweixin-1.6.0.js'
        script.onload = resolve
        script.onerror = reject
        script.setAttribute('src', name === 'wechat' ? wechat_sdk : alipay_sdk)
      }))
    },

    async handleTap() {
      const { money: pdr_amount } = this

      if (!pdr_amount) {
        this.$toast.fail('请输入充值金额')
        return
      }

      if (this.environment === 'wechat') {
        this.payByWechat()
        return
      }

      if (this.environment === 'alipay') {
        this.payByAlipay()
      }
    },
    async getAlipayAuthCode() {
      if (window.location.href.includes('auth_code')) return
      // const { code, data } = await pub.getNewAppId()
      const { app_id: appid } = await pub.getAppId({ type: 'ali' })
      const redirect = window.encodeURIComponent(window.location.href)

      console.log('ali appid', appid)
      window.location.replace(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appid}&scope=auth_base&redirect_uri=${redirect}`)
      // if (code === 200) {
      //   const redirect = window.encodeURIComponent(window.location.href)
      //   window.location.replace(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${data.app_id}&scope=auth_base&redirect_uri=${redirect}`)
      // }
    },

    async getWechatAuthCode() {
      const { app_id: appid } = await pub.getAppId({ type: 'wechat' })
      const redirect_uri = window.encodeURI(window.location.href)
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`;
      window.location.replace(url)
    },

    async evokeAlipay() {
      const { app_id: appid } = await pub.getAppId({ type: 'ali' })

      console.log('ali appid', appid)

      window.location.href = `alipays://platformapi/startapp?appId=${appid}&url=${window.encodeURIComponent(window.location.href)}`
    },

    async payByWechat() {
      console.log('微信支付')
    },

    async payByAlipay() {
      console.log('支付宝支付')
    },
  },
}
</script>

<style lang="less" scoped>
    .recharge{
        .header {
            margin: 0 24px;
            padding-top: 30px;
            .header_tip {
                font-size: 24px;
                font-family: PingFang, PingFang-Regular;
                font-weight: 400;
                color: #333;
                text-align: left;
            }

            .money {
                display: flex;
                align-items: center;
                padding-bottom: 10px;
                margin-top: 15px;
                // background: rgb(29, 23, 23);
                border-bottom: 2px solid #eeeff0;
                >b {
                    font-size: 40px;
                    font-family: PingFang, PingFang-Bold;
                    font-weight: 700;
                    color: #333;
                }
                >input {
                    border: none;
                    outline: none;
                    flex: 1;
                    margin-left: 10px;
                    font-size: 35px;
                }

            }
        }

        .btn {
            padding: 0 24px;
            margin-top: 32px;
        }

        .toalipay {
            margin-top: 212px;
            .tip {
                font-size: 26px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: center;
                color: #999999;
            }

            .alipay_btn {
                width: 226px;
                height: 68px;
                opacity: 1;
                border: 2px solid #f1270d;
                border-radius: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                color: #f1270d;
                margin: 0 auto;
                margin-top: 20px;
            }
        }
    }
</style>
