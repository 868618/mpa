<template>
  <div class="alipay">
    <div class="order_status">
      <div class="left">待审核</div>
      <div class="right">请在23:50:34内审核，逾期订单将自</div>
    </div>

    <div class="address">
      <div class="location_box">
        <img class="location" :src="location" />

        <div class="userinfo">
          <div class="name">展示干 <span>15239481297</span></div>
          <div class="addr_detail">爱上我的女老板</div>
        </div>
      </div>
    </div>

    <div class="order_list">
      <div class="shop_box">
        <div class="shop_title">
          <img :src="tmp" class="shop_icon" />
          <p>碧生源会员福利店</p>
        </div>

        <ul class="list">
          <li class="item" v-for="(item, index) in 3" :key="index" :class="[{ giftt: item == 2 }, 'item']">
            <div class="good_img" :class="{ gift: item>=2 }">
              <img :src="tmp" />
            </div>
            <div class="good_detail">
              <div class="name">
                这是一个商品名称这是一个商等哈就多喝水粉红色的品名称这是一个商这是一个商品名称这是一个商等哈就多喝水粉红色的品名称这是一个商
              </div>
              <div class="amount">
                <p class="price"><span>￥</span>28</p>
                <p class="num">X2</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="order_detail">
      <ul class="order_detail_box">
        <li class="order_detail_item">
          <p class="left">订单编号</p>
          <p class="right">2584959045984395</p>
        </li>

        <li class="order_detail_item">
          <p class="left">下单时间</p>
          <p class="right">2021-04-16 13:09:00</p>
        </li>

        <li class="order_detail_item">
          <p class="left">下单时间</p>
          <p class="right">2021-04-16 13:09:00</p>
        </li>

        <li class="order_detail_item">
          <p class="left">下单时间</p>
          <p class="right">2021-04-16 13:09:00</p>
        </li>
      </ul>

      <div class="amonut">
        <p class="tip">待支付：</p>
        <div class="price"><span>￥</span>28</div>
      </div>
    </div>

    <div class="btn">
      <div class="left"><p>返回微信小程序</p></div>

      <div class="right ali"><p>支付宝支付</p></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

import { location } from '@/utils/imagesMap'

momentDurationFormatSetup(moment)

export default {
  name: 'AliPay',
  data() {
    return {
      tmp: 'https://www.baidu.com/img/flexible/logo/pc/result@2.png',
      location,
    }
  },
  created() {
    const time = 1874
    this.loopRefreshTime(time)
  },

  methods: {
    test() {
      const a = 13
      console.log(a)
    },

    loopRefreshTime(time) {
      const m = moment.duration(time, 's')
      const remaining = ['hours', 'minutes', 'seconds'].map((i) => this.format(m[i]())).join(':')
      console.log('-----------', remaining)

      time && setTimeout(this.loopRefreshTime, 1000, time - 1)
    },

    format(num) {
      return num >= 10 ? num : `0${num}`
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
  .order_status {
    height: 100px;
    padding: 0 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
      background: url("../../assets/images/right_arrow.png") no-repeat center;
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
          background: chartreuse;
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
              background: url("../../assets/images/gift.png") no-repeat center;
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
