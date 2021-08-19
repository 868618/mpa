<template>
  <div class="alipay" v-if="orderInfo">
    <div class="count_down" v-html="countDown" v-if="orderInfo.cut_off_time" />
    <div class="order_status">
      <template>
        <div class="cancel">
          <div class="l">订单号：{{ query.order_id }}</div>
          <div class="r">{{ orderInfo.order_state_name }}</div>
        </div>
      </template>
    </div>

    <div class="address">
      <div class="location_box">
        <img class="location" :src="location" />

        <div class="userinfo">
            <div class="name">{{ orderInfo.reciver_name }} <span>{{ orderInfo.reciver_phone }}</span></div>
            <div class="addr_detail">{{ orderInfo.reciver_addr }}</div>
        </div>
      </div>
    </div>

    <div class="order_list">
      <div class="shop_box">
        <div class="shop_title">
          <img :src="shop" class="shop_icon" />
          <p>{{ orderInfo.store_name }}</p>
        </div>

        <ul class="list">
          <li class="item" v-for="(item, index) in orderInfo.goods_list" :key="index" :class="[{ giftt: index == lineNum }, 'item']">
            <div class="good_img" :class="{ gift: Number(item.is_gift) }">
              <img :src="item.image_url" />
            </div>
            <div class="good_detail">
              <div class="name">
                {{ item.goods_name }}
              </div>
              <div class="amount">
                <p class="price"><span>￥</span>{{ item.goods_price }}</p>
                <p class="num">X{{ item.goods_num }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="order_detail">
      <ul class="order_detail_box">
        <li class="order_detail_item">
          <p class="left">下单时间</p>
          <p class="right">{{ orderInfo.add_time }}</p>
        </li>

        <li class="order_detail_item">
          <p class="left">支付方式</p>
          <p class="right">{{ orderInfo.payment_name }}</p>
        </li>

        <li class="order_detail_item">
          <p class="left">待支付：</p>
          <p class="right">{{ orderInfo.real_pay_amount }}</p>
        </li>
      </ul>

      <!-- <div class="amonut">
        <p class="tip">待支付：</p>
        <div class="price"><span>￥</span>{{ orderInfo.real_pay_amount }}</div>
      </div> -->

      <div class="tip">注：如有特殊发货需求请联系顾问</div>
    </div>

    <div class="btn">
      <div class="left" v-if="!isAlipay" @click="toWeChat"><p>返回微信小程序666</p></div>

      <div class="right ali" @click="toAliPay"><p>支付宝支付</p></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

import { location, shop } from '@/utils/imagesMap'
import api from '@/api'
import { isAliPayApp } from '@/utils/tool'

momentDurationFormatSetup(moment)

export default {
  name: 'AliPay',
  data() {
    return {
      // tmp: 'https://www.baidu.com/img/flexible/logo/pc/result@2.png',
      location,
      shop,
      orderInfo: null,
      lineNum: -1,
      query: null,
      remaining: null,
      openlink: null,
      isAlipay: false,
      isHasAuthCode: false,
    }
  },

  created() {
    const query = this.getQuery()
    this.query = query

    const isAlipay = isAliPayApp()
    this.isAlipay = isAlipay
    const isHasAuthCode = window.location.href.includes('auth_code')
    this.isHasAuthCode = isHasAuthCode
    if (isAlipay) {
      if (!isHasAuthCode) {
        const redirect = window.encodeURIComponent(window.location.href)
        window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021002170686138&scope=auth_base&redirect_uri=${redirect}`
        return
      }
    }

    this.getDetail()

    !isAlipay && this.getScheme()
  },

  computed: {
    countDown() {
      return this.orderInfo.cut_off_tips.replace('###', `<span style="color: #f1270d;min-width:60px;text-align: center;">${this.remaining}</span>`)
    },
  },

  mounted() {
    if (this.isHasAuthCode) {
      // this.getDetail()
      // eslint-disable-next-line camelcase
      const { auth_code } = this.query
      api.getAliPayUserId({ auth_code }).then((res) => {
        console.log('res******************', res)
        window.ap.tradePay(this.query.auth_code)
      }).catch(error => {
        console.log('error____________', error)
      })
    }
  },

  methods: {
    async getDetail() {
      const res = await api.getDetail(this.query)

      if (res.code === 200) {
        const lineNum = res.datas.order_info.goods_list.findIndex(i => Number(i.is_gift))
        this.lineNum = lineNum
        this.orderInfo = res.datas.order_info
        this.orderInfo.cut_off_time && this.loopRefreshTime(this.orderInfo.cut_off_time)
      }
    },

    toAliPay() {
      const url = `alipays://platformapi/startapp?appId=20000067&url=${window.encodeURIComponent(window.location.href)}`
      window.location.href = url
    },

    toWeChat() {
      window.location.href = this.openlink
    },

    loopRefreshTime(time) {
      const m = moment.duration(time, 's')
      const remaining = ['hours', 'minutes', 'seconds'].map((i) => this.format(m[i]())).join(':')
      console.log('-----------', remaining)
      this.remaining = remaining

      if (time) {
        setTimeout(this.loopRefreshTime, 1000, time - 1)
      } else {
        this.getDetail()
      }
    },

    format(num) {
      return num >= 10 ? num : `0${num}`
    },

    async getScheme() {
      console.log(`share_id=${this.query.share_id}`, '000000000000')
      const query = `share_id=${this.query.share_id}`
      const res = await api.getScheme({
        path: '/salesman/pages/usersCheck/index',
        query,
        is_expire: true,
        expire_type: 1,
        expire_interval: 1,
        expire_time: 1630132832,
      })

      console.log('res0000000000000', res)
      if (res.code === 200) {
        this.openlink = res.data.openlink
      }
    },

    getQuery() {
      const entries = window.location.search.replace(/^\?/ig, '').split('&').map(i => i.split('='))
      return Object.fromEntries(entries)
    },
  },
}
</script>

<style lang="less" scoped>
.alipay {
  height: 100px;
  min-height: 100vh;
  background: #eff1f2;
  padding-bottom: 180px;

  .count_down {
    opacity: 1;
    font-size: 28px;
    font-weight: 400;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    padding: 0 24px;
    background: #fff;
    margin-bottom: 20px;
    height: 80px;
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  .order_status {
    height: 100px;
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    margin-bottom: 24px;
    height: 80px;

    .left {
      font-size: 40px;
      font-weight: 700;
      color: #030303;
    }

    .right {
      font-size: 28px;
      font-weight: 400;
      color: #666666;
    }

    .cancel {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24px;
      font-weight: 400;
      width: 100%;

      .l {
        color: #666666;
      }

      .r {
        color: #f1270d;
      }
    }
  }

  .address {
    height: 150px;
    background: #fff;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 30px;
      height: 30px;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      background: url("./assets/images/right_arrow.png") no-repeat center;
      background-size: 100%;
    }
    .location_box {
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 30px;
      .location {
        width: 50px;
        height: 50px;
      }

      .userinfo {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 23px;
        font-weight: 400;
        font-size: 28px;

        .name {
          color: #999999;
          > span {
            margin-left: 30px;
          }
        }

        .addr_detail {
          color: #333333;
          margin-top: 10px;
        }
      }
    }
  }

  .order_list {
    margin-top: 20px;
    background: #fff;
    padding: 0 24px;

    .shop_box {
      padding-top: 30px;
      padding-bottom: 20px;
      // background: red;
      .shop_title {
        display: flex;
        align-items: center;
        // justify-content: center;
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        color: #333333;
        .shop_icon {
          width: 44px;
          height: 44px;
          display: inline-block;
          overflow: hidden;
        }
        > p {
          line-height: 1;
          margin-left: 20px;
        }
      }

      .list {
        margin-top: 50px;

        .giftt{
          border-top: 2px dashed #eeeff0;
          .price {
            opacity: 0;
          }
        }

        .item {
          height: 162px;
          overflow: hidden;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-top: 16px;

          .good_img {
            width: 162px;
            height: 162px;
            overflow: hidden;
            background: chartreuse;
            > img {
              width: 100%;
            }
          }

          .gift {
            position: relative;
            width: 140px;
            height: 140px;
            &::after {
              content: "";
              width: 140px;
              height: 22px;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              background: url("./assets/images/gift.png") no-repeat center;
              background-size: 100% 100%;
              z-index: 1;
            }
          }
          .good_detail {
            flex: 1;
            height: 100%;
            margin-left: 20px;

            .name {
              font-size: 26px;
              font-weight: 400;
              line-height: 38px;
              color: #333;
              min-height: 76px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }

            .amount {
              margin-top: 18px;
              display: flex;
              align-items: flex-end;
              justify-content: space-between;

              .price {
                font-size: 30px;
                font-weight: 700;
                line-height: 1;
                display: inline-flex;
                align-items: flex-end;
                > span {
                  font-size: 24px;
                }
              }

              .num {
                font-size: 28px;
                font-weight: 400;
                color: #999;
                line-height: 1;
              }
            }
          }
        }
      }
    }
  }

  .order_detail {
    padding: 30px 24px;
    background: #fff;
    margin-top: 20px;
    .order_detail_box {
      .order_detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        font-size: 24px;
        font-weight: 400;
        color: #333333;
        // &:last-child {
        //     margin-bottom: 0;
        // }
        .left {
        }

        .red {
          color: #f1270d;
        }
      }
    }
    .tip {
      color: #FA6400;
      font-size: 24px;
    }

    .amonut {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      font-size: 32px;
      font-weight: bold;

      .tip {
        font-size: 26px;
        font-weight: 400;
        color: #666;
      }
      .price {
        color: red;
        > span {
          font-size: 24px;
        }
      }
    }
  }
  .btn {
    height: 120px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    box-shadow: 0px -7px 8px 0px rgba(239, 239, 239, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: 30px;
    font-weight: 400;
    color: #ffffff;
    > div {
      width: 338px;
      height: 88px;
      opacity: 1;
      background: #08c161;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .ali {
      background: #3477ff;
    }
  }
}
</style>
