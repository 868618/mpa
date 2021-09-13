<template>
    <div class="recharge" v-if="isInitialized">
        <header class="header">
            <p class="header_tip">输入充值金额（元）</p>
            <div class="money">
                <b>¥</b>
                <input v-focus v-model="money" type="number">
            </div>
        </header>

        <div class="btn">
            <Button color="#F1270D" block round @click="handleTap" :disabled="environment == 'other'">确认充值</Button>
        </div>

        <section class="toalipay" v-if="environment == 'other'" @click="evokeAlipay">
            <p class="tip">如使用微信请使用微信扫码打开此页面</p>
            <div class="alipay_btn">跳转支付宝</div>
        </section>
        <!-- <NumberKeyboard :show="true" /> -->
    </div>
</template>

<script>
import Vue from 'vue'
import { Button, Toast } from 'vant'
import qs from 'qs'
// import qyk from '@/api/qyk'
import { isAliPayApp, isWeChat } from '@/utils/tool'
import pub from '@/api/pub'
// import api from '@/api'

import qyk from '@/api/qyk'

Vue.use(Toast)

export default {
  name: 'Recharge',
  components: {
    Button,
    // NumberKeyboard,
  },

  data() {
    return {
      money: '',
      isInitialized: false,
      identity: null,
      query: window.location.search ? Object.fromEntries(window.location.search.slice(1).split('&').map(i => i.split('='))) : {},
      user_key: null,
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
    await this.init()
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
          await this.addWechatOrAlipayJsSdk(environment)
          // this.isInitialized = true
          // return
        }

        if (environment === 'wechat') {
          if (!href.includes('code')) {
            this.getWechatAuthCode()
            return
          }
          this.getIdentity({ code: this.query.code, type: 'wechat' })
        }
      }
      this.isInitialized = true
    },

    async getIdentity(params) {
      console.log('去获取openid', params)
      const { code, data: { user_key } } = await pub.getOpenId(params)
      console.log('getIdentity______', user_key)
      if (code !== 200) return
      this.user_key = user_key
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

      const reg = /(^0(\.\d{0,2})?$)|(^[1-9]\d*(\.\d{0,2})?$)/ig
      if (!reg.test(pdr_amount)) {
        this.$toast('请输入正确的充值金额')
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
      const { code, data: { app_id: appid } } = await pub.getAppId({ type: 'ali' })
      if (code !== 200) return
      const redirect = window.encodeURIComponent(window.location.href)
      console.log('ali appid', appid)
      window.location.replace(`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appid}&scope=auth_base&redirect_uri=${redirect}`)
    },

    async getWechatAuthCode() {
      const { code, data: { app_id: appid } } = await pub.getAppId({ type: 'wechat' })
      if (code !== 200) return
      const redirect_uri = window.encodeURI(window.location.href)
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`;
      window.location.replace(url)
    },

    async evokeAlipay() {
      window.location.href = `alipays://platformapi/startapp?appId=20000067&url=${window.encodeURIComponent(window.location.href)}`
    },

    async payByWechat() {
      console.log('微信支付')
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
      })
      const { user_key, environment } = this
      const pay_mode = environment === 'wechat' ? 'wxpay' : 'alipay'

      const { code, msg, data } = await qyk.recharge(qs.stringify({
        type: 3,
        pdr_amount: this.money,
        user_key,
        pay_mode,
      }))
      Toast.clear()
      if (code === 200) {
        console.log('window.WeixinJSBridge', window.WeixinJSBridge)

        console.log('通过jsbridge方式去唤起支付', data)
        window.WeixinJSBridge.invoke('getBrandWCPayRequest', data, res => {
          console.log('WeixinJSBridge', res)
        })
      } else {
        Toast(msg)
      }

      console.log('微信支付 res', data)
    },

    async payByAlipay() {
      console.log('支付宝支付')
      window.ap.showLoading()
      const { user_key, environment } = this
      const pay_mode = environment === 'wechat' ? 'wxpay' : 'alipay'
      const res = await qyk.recharge(qs.stringify({
        type: 3,
        pdr_amount: this.money,
        user_key,
        pay_mode,
      }))
      window.ap.hideLoading()
      console.log('res', res)
      const { code, data } = res
      if (code !== 200) return
      console.log(data)
      window.ap.tradePay({ tradeNO: data.tradeNo }, ({ resultCode }) => {
        if (resultCode !== '9000') return
        console.log(window.location)
        const { origin } = window.location
        // window.location.href = `${origin}/refresh.html?pdr_id=${data.pdr_id}&money=${this.money}`
        window.location.href.replace(`${origin}/refresh.html?pdr_id=${data.pdr_id}&money=${this.money}`)
      })
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
