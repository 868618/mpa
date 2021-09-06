<template>
    <div class="recharge">
        <header class="header">
            <p class="tip">输入充值金额（元）</p>
            <div class="money">
                <b>¥</b>
                <van-field v-model="value" placeholder="" label-width="0" />
            </div>
        </header>
    </div>
</template>

<script>
import Vue from 'vue'
import { Field } from 'vant'

Vue.use(Field)

export default {
  name: 'Recharge',

  data() {
    return {
      value: '12',
    }
  },
}
</script>

<style lang="less" scoped>
    .recharge{
        .header {
            margin: 0 24px;
            background: red;
            height: 300px;
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
                height: 100px;
                >b {
                    font-size: 40px;
                    font-family: PingFang, PingFang-Bold;
                    font-weight: 700;
                    color: #333;
                }

            }
        }
    }
</style>
