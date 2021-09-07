<template>
    <div class="recharge">
        <header class="header">
            <p class="tip">输入充值金额（元）</p>
            <div class="money">
                <b>¥</b>
                <input type="text" v-focus>
            </div>
        </header>

        <div class="btn">
            <Button color="#F1270D" block round>确认充值</Button>
        </div>

        <section class="toalipay">
            <p class="tip">如使用微信请使用微信扫码打开此页面</p>
            <div class="alipay_btn">跳转支付宝</div>
            <!-- <Button color="#F1270D" plain round>跳转支付宝</Button> -->
        </section>

    </div>
</template>

<script>
import { Button } from 'vant'

export default {
  name: 'Recharge',
  components: {
    Button,
  },

  data() {
    return {
      value: '12',
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },
}
</script>

<style lang="less" scoped>
    .recharge{
        .header {
            margin: 0 24px;
            // background: pink;
            // height: 300px;
            padding-top: 30px;
            .tip {
                font-size: 24px;
                font-family: PingFang, PingFang-Regular;
                font-weight: 400;
                color: #333333;
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
