<template>
    <div class="recharge">
        <header class="header">
            <p class="header_tip">输入充值金额（元）</p>
            <div class="money">
                <b>¥</b>
                <input type="text" v-focus v-model="money">
            </div>
        </header>

        <div class="btn">
            <Button color="#F1270D" block round @click="handleTap">确认充值</Button>
        </div>

        <section class="toalipay">
            <p class="tip">如使用微信请使用微信扫码打开此页面</p>
            <div class="alipay_btn">跳转支付宝</div>
            <!-- <Button color="#F1270D" plain round>跳转支付宝</Button> -->
        </section>

    </div>
</template>

<script>
import Vue from 'vue'
import { Button, Toast } from 'vant'
import qs from 'qs'
import qyk from '@/api/qyk'
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
      openLink: null,
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
      // eslint-disable-next-line no-nested-ternary
      return isAliPayApp() ? 'alipay' : (isWeChat() ? 'wechat' : 'other')
    },
  },

  async created() {
    console.log(this.environment)
    if (this.environment === 'wechat') {
      if (!this.openLink) {
        await this.getOpenLink()
      }
      window.location.href = this.openLink
    }
  },

  methods: {
    async handleTap() {
      const { money: pdr_amount } = this

      if (!pdr_amount) {
        Toast('请输入充值金额')
        return
      }
      const { key } = this.$route.query
      const { code, data } = await qyk.recharge(qs.stringify({
        type: 1,
        pdr_amount,
        key,
      }))

      if (code === 200) {
        console.log('data.pdr_sn', data.pdr_sn)
      }
    },

    async getOpenLink() {
      const { code, data } = await pub.getScheme({ path: 'pages/recharge/detail', query: `money=${this.money}` })
      if (code === 200) {
        this.openLink = data.openlink
      }
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
