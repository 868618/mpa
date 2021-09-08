<template>
<div class="qyk" v-if="card_info">
  <header class="header">
    <div class="avatar">
      <div class="avatar_img">
        <img :src="member_info.member_avatar" >
      </div>
    </div>
    <div class="user" v-if="member_info">
      <div class="name"><span>{{ member_info.member_nickname }}</span> <img v-if="member_info.card_logo" :src="member_info.card_logo" ></div>
      <div class="balance"><span>当前余额：</span>{{ member_info.member_available_amount }}</div>
    </div>
  </header>

  <nav class="nav" v-if="isShowSwiper">
    <section v-swiper:mySwiper="swiperOptions">
      <section :class="['swiper-wrapper', isHasAuthCode ? 'swiper-no-swiping' : '']">
        <section class="swiper-slide slide" :class="{ active: clickedIndex == index }" v-for="(item, index) in card_info.card_list" :key="index">
          <div class="card">{{ item.card_name }}</div>
        </section>
      </section>
    </section>
  </nav>

  <section class="card_detail">
    <div class="card_img" :style="cardsBg">
      <div class="price">
        <span>{{ card_info.card_price }}</span>
        <span>{{ card_info.card_price == '无限额度' ? '' : '元' }}</span>
      </div>
    </div>

    <div class="tip_section">
      <div class="tip_top">{{ tipMap.get(card_info.button_type).tip }} <span>{{ card_info.middle_show_amount[0] }}</span> {{ tipMap.get(card_info.button_type).name }}</div>
      <div class="tip_bottom">{{ tipMap.get(card_info.button_type).desc }} <span>{{ card_info.middle_show_amount[1] }}</span></div>
    </div>
  </section>

  <footer class="footer">
    <div class="footer_box">
      <div class="top" @click="$toast('请返回小程序查看')">
        <img src="https://pre-1303873333.picbj.myqcloud.com/data/pre/images/open_meet.png" alt="">
      </div>
      <div class="top_title">
        <span>会员权益</span>
      </div>

      <div class="top_detail_box">
        <div
            class="topup_detail_box_item"
            v-for="(item, index) in card_info.gift_list"
            :key="index"
            @click="handleTapIcon(item)"
        >
            <div class="icon">
                <img :src="item.gift_image" />
            </div>
            {{ item.gift_name }}
        </div>
      </div>

      <div class="top_title">
          <span>使用须知</span>
      </div>

      <div class="tip">
          {{ card_info.card_intro }}
      </div>
    </div>

    <div class="sticky_bottom">
        <div class="agreement active" @click="handleTapAgree">
            点击{{card_info.button_text}}即代表您同意 <span>《碧生源储值卡用户须知》</span>
        </div>
        <div class="recharge">
            <div class="text">
                <div class="real_price">
                    {{ textMap.get(card_info.button_type).tip }} <span class="real_price_num">¥{{ card_info.bottom_show_amount[0] }}</span>
                </div>
                <div class="gift_price">
                    {{ textMap.get(card_info.button_type).desc }} <span class="gift_price_num">{{ card_info.bottom_show_amount[1] }}</span>
                </div>
            </div>
            <div @click="handleTapBtn" :class="['btn', { disable: !card_info.button_status }]">{{ card_info.button_text }}</div>
        </div>
        <div class="toWeChat" @click="toWeChat">
          <div>返回{{ !isInAliPay ? '微信' : '' }}小程序</div>
        </div>
    </div>
  </footer>

  <PubMask v-if="maskMenu.isShowToBrowser">
    <div class="mask">
      <div class="first">
        <img :src="require('@/assets/images/first_step.png')" >
      </div>
      <div class="second">
        <img :src="require('@/assets/images/second_step.png')" >
      </div>

      <div class="iknow" @click="maskMenu.isShowToBrowser = false">
        <img :src="require('@/assets/images/i_know.png')" >
      </div>
    </div>
  </PubMask>

  <PubMask v-if="maskMenu.isShowDetail">
      <div class="mask_box">
          <div class="mask_header">
              <div class="icon"  >
                  <img :src='maskInfo.gift_image' />
              </div>
              <span>{{ maskInfo.gift_name }}</span>
          </div>

          <div class="mask_desc">
              <div>
                  {{ maskInfo.gift_intro }}
              </div>
          </div>

          <div class="close_btn" @click="maskMenu.isShowDetail = false">关闭</div>

      </div>
  </PubMask>

</div>
</template>

<script>
import { directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import qs from 'qs'
import Vue from 'vue';
import { Toast, Dialog } from 'vant';
import qyk from '@/api/qyk'
import api from '@/api'
import PubMask from '@/component/pub_mask'
import { isAliPayApp, isWeChat, stringify } from '@/utils/tool'

Vue.use(Toast)

export default {
  name: 'Qyk',
  components: {
    PubMask,
  },
  directives: {
    swiper: directive,
  },
  data() {
    const _this = this
    return {
      clickedIndex: 0,
      /*
        swiper配置
      */
      swiperOptions: {
        freeMode: true,
        slidesPerView: 'auto',
        observer: true,
        autoUpdate: true,
        // setWrapperSize: true,
        on: {
          /*
            点击时候自动居中
            this 为当前swiper实例
          */
          tap() {
            const { clickedIndex } = this
            if (clickedIndex === _this.clickedIndex) return
            _this.clickedIndex = clickedIndex
            _this.handleTapCard(_this.card_info.card_list[clickedIndex])
            const { slides, width } = this
            const { clientWidth } = slides[clickedIndex]
            const distance = Array.from(slides).slice(0, clickedIndex).reduce((pre, cur) => pre + cur.clientWidth, 0)
            this.translateTo(((width - clientWidth) * 0.5) - distance, 200, true, true)
          },
          init() {
            const clickedIndex = _this.card_info.card_list.findIndex(i => i.tag_sign)
            _this.clickedIndex = clickedIndex
            const { slides, width } = this
            const { clientWidth } = slides[clickedIndex]
            const distance = Array.from(slides).slice(0, clickedIndex).reduce((pre, cur) => pre + cur.clientWidth, 0)
            this.translateTo(((width - clientWidth) * 0.5) - distance, 0, true, true)
            console.log(this)
          },
        },
      },
      query: {},
      member_info: null,
      card_info: null,
      // isX: false,
      textMap: new Map([
        [0, { tip: '开通权益卡', desc: '立赠' }],
        [1, { tip: '开通权益卡', desc: '立赠' }],
        [2, { tip: '续充权益卡', desc: '立赠' }],
        [3, { tip: '特价升级仅需', desc: '原价' }],
      ]),
      tipMap: new Map([
        [0, { tip: '充值/购卡立赠', name: '权益金', desc: '实际到账' }],
        [1, { tip: '充值/购卡立赠', name: '权益金', desc: '实际到账' }],
        [2, { tip: '充值/续卡立赠', name: '权益金', desc: '实际到账' }],
        [3, { tip: '充值/特价充值/升级  仅需', name: '权益金', desc: '再赠' }],
      ]),
      isShowSwiper: false,
      openlink: null,
      isInWeChat: isWeChat(),
      isInAliPay: isAliPayApp(),
      app_id: null,
      // isShowMask: false,
      currentCardInfo: null,
      tradeNO: null,
      maskInfo: {},
      maskMenu: {
        isShowToBrowser: false,
        isShowDetail: false,
      },
      isHasAuthCode: false,
    }
  },

  async created() {
    /*
      页面从后台隐藏到展示时候执行的逻辑
      初次进入不执行此逻辑
    */
    this.onShow()

    /*
      获取url参数
    */
    this.getQuery()

    /*
      进入支付宝时候的逻辑
    */
    // await this.checkAndJump()
    if (this.isInAliPay) {
      /*
        没有拿到auth_code时候的逻辑
      */
      const { href } = window.location
      if (!href.includes('auth_code')) {
        this.jumpAndGetAuthCode()
        return
      }
      /*
        有auth_code的时候 直接去拿页面详情 同时也去唤起支付
      */
      this.isHasAuthCode = true
      this.handleTapCard(this.query)
      this.initPay()
      return
    }
    /*
      非支付宝环境的时候直接获取页面详情和唤起的微信小程序的短链
    */
    this.handleTapCard(this.query)
    // this.getWeChatScheme()
  },

  methods: {

    async handleTapAgree() {
      const doc_code = 'card_agreement'
      const { code, data: { doc_title: title, doc_content: message } } = await qyk.getAgree({ doc_code })
      if (code === 200) Dialog({ message, title, messageAlign: 'left' })
    },

    onShow() {
      document.addEventListener('visibilitychange', () => {
      // 用户打开或回到页面
        document.visibilityState === 'visible' && this.handleTapCard({ ...this.query, ...this.currentCardInfo })
      })
    },
    /*
      获取页面详情
    */
    async handleTapCard({ id, card_id }) {
      const { key: token, sale_id } = this.query
      await this.getDetail({ id, card_id, token })
      /*
        更新支付所需要的相关数据
      */
      this.$nextTick(() => {
        const { button_type: pdr_card_buy_type, id: _id, card_id: _card_id } = this.card_info
        this.currentCardInfo = { ...this.query, pdr_sales_user_id: sale_id, pdr_card_buy_type, id: _id, card_id: _card_id }
      })
    },
    /*
      打开弹窗
    */
    handleTapIcon(e) {
      const { gift_url } = e
      if (gift_url) {
        this.$toast('请返回小程序查看')
        return
      }
      this.maskInfo = e
      this.maskMenu.isShowDetail = true
    },

    handleTapBtn() {
      if (!this.card_info.button_status) return
      /*
        在腾讯的环境就去微信小程序
      */
      if (this.isInWeChat) {
        this.toWeChat()
        return
      }
      /*
        在支付宝的环境就去唤起支付
      */
      if (this.isInAliPay) {
        console.log("window.location.href.includes('auth_code')", window.location.href.includes('auth_code'))
        console.log('this.tradeNO', this.tradeNO)
        window.location.href.includes('auth_code') && this.tradeNO ? this.pay() : this.jumpAndGetAuthCode()
        return
      }
      /*
        不在支付宝环境和腾讯环境的时候 直接去唤起支付宝
      */
      const { origin, pathname } = window.location
      const { id, card_id } = this.currentCardInfo
      const href = origin + pathname + stringify({ ...this.query, id, card_id })
      window.location.href = `alipays://platformapi/startapp?appId=20000067&url=${window.encodeURIComponent(href)}`
    },

    async initPay() {
      window.ap.showLoading()
      const { auth_code, key: token, key } = this.query
      try {
        /*
          告诉后端一声，后端去初始化订单（猜的）
        */
        const result = await api.getAliPayUserId({ auth_code, token })
        if (result.code !== 200) return
        const { id: pdr_id, card_id: pdr_card_id } = this.currentCardInfo
        /*
          获取pay_sn
        */
        const { code, data: { pdr_sn: pay_sn } } = await qyk.recharge(qs.stringify({ ...this.currentCardInfo, key, type: 2, pdr_id, pdr_card_id }))
        if (code !== 200) return
        const { state, info } = await api.getAliPaySsn(qs.stringify({ key, pay_sn, payment_code: 'mini_alipay' }))
        if (state !== 200) return
        this.tradeNO = info.tradeNo
        this.$nextTick(this.pay)
      } catch (error) {
        console.log('error', error)
      } finally {
        window.ap.hideLoading()
      }
    },

    pay() {
      const _this = this
      const { tradeNO } = this
      window.ap.tradePay({ tradeNO }, ({ resultCode }) => {
        if (resultCode !== '9000') return
        _this.getDetail()
      })
    },

    async jumpAndGetAuthCode() {
      const { origin, pathname } = window.location
      const localQuery = JSON.parse(JSON.stringify(this.query))
      delete localQuery.auth_code
      delete localQuery.chInfo
      const transformUrl = origin + pathname + stringify(localQuery)
      const redirect = window.encodeURIComponent(transformUrl)

      const app_id = await this.getNewAppId()
      window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${app_id}&scope=auth_base&redirect_uri=${redirect}`
    },

    async getNewAppId() {
      const { code, data } = await api.getNewAppId()
      return code === 200 ? data.app_id : Promise.reject(data)
    },

    async getWeChatScheme() {
      if (this.openlink) return

      const loading = Toast.loading({
        loadingType: 'spinner',
        forbidClick: true,
        duration: 0,
      })
      console.log(this.query)
      const query = JSON.parse(JSON.stringify(this.query))
      delete query.key
      const res = await api.getScheme({
        // path: 'pages/user/user',
        // query: '',
        path: 'mermall/pages/topup/index',
        query: Object.entries(query).filter(([k]) => !['key', '_um_ssrc', '_um_sts'].includes(k)).map(([k, v]) => `${k}=${v}`).join('&'),
        is_expire: true,
        expire_type: 1,
        expire_interval: 1,
        expire_time: 1630132832,
      })
      loading.clear()
      if (res.code === 200) {
        this.openlink = res.data.openlink
      }
    },

    async toWeChat() {
      if (this.isInAliPay) {
        this.maskMenu.isShowToBrowser = true
        return
      }
      await this.getWeChatScheme()
      window.location.href = this.openlink
    },

    async getDetail(data = {}) {
      const { key: token } = this.query
      const res = await qyk.getDCardDetail({ ...data, token })
      // this.isShowSwiper = false
      if (res.code === 200) {
        const { member_info, card_info } = res.data
        this.member_info = member_info

        /*
          对比一下两次列表的内容是否一致，不一致的话就重新初始化swiper
        */
        const newList = card_info.card_list.map(({ tag_sign, ...i }) => i)
        const oldList = this.card_info?.card_list.map(({ tag_sign, ...i }) => i)
        this.card_info = card_info
        if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
          this.isShowSwiper = false
          this.$nextTick(() => {
            this.isShowSwiper = true
          })
        }
      }
    },

    getQuery() {
      const entries = window.location.search.replace(/^\?/ig, '').split('&').map(i => i.split('='))
      this.query = Object.fromEntries(entries)
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    cardsBg() {
      return `background-image: url("${this.card_info.card_image}");`
    },
  },
}
</script>

<style lang="less" scoped>
  .qyk {
    background: #fff;
    &,& > * {
      box-sizing: border-box;
    }
    .header{
      height: 160px;
      // background: red;
      display: flex;
      align-items: center;
      padding: 0 34px;
      .avatar {
        width: 114px;
        height: 114px;
        background: chartreuse;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(245,245,245,0.30);
        .avatar_img {
          width: 94px;
          height: 94px;
          background: #F5F5F5;
          border-radius: 50%;
          overflow: hidden;
          >img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .user {
        margin-left: 22px;
        display: flex;
        flex-direction: column;
        .name {
          font-size: 32px;
          font-weight: 500;
          color: #333;
          display: flex;
          height: 46px;
          align-items: center;
          >img {
            width: 96px;
            height: 46px;
            margin-left: 15px;
          }
        }
        .balance {
          margin-top: 18px;
          font-size: 24px;
          font-weight: 500;
          color: #333;
          >span {
            font-weight: 400;
            color: #333;
          }
        }
      }
    }

    .nav {
      height: 80px;
      margin-top: 34px;
      overflow: hidden;
      .slide {
        height: 80px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: PingFang SC, Ping;
        width: 200px;
        font-size: 28px;
        font-weight: 400;
        color: #666;
        &.active {
          color: #333;
          position: relative;
          &::after {
            position: absolute;
            content: '';
            left: 50%;
            transform: translateX(-50%);
            bottom: 0;
            width: 68px;
            height: 4px;
            opacity: 1;
            background: #f1270d;
            border-radius: 4px 4px 0px 0px;
          }
        }
      }

      .scroll_box {
        height: 80px;
        overflow-x: scroll;
        white-space: nowrap;
        &::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
        .scroll_item {
          height: 80px;
          display: inline-block;
          // padding: 0 63px;
          margin: 0 63px;
          font-size: 28px;
          font-weight: 400;
          color: #666;
          line-height: 80px;
          text-align: center;

          &.active {
            color: #333;
            position: relative;
            &::after {
              position: absolute;
              content: '';
              left: 50%;
              transform: translateX(-50%);
              bottom: 0;
              width: 68px;
              height: 4px;
              opacity: 1;
              background: #f1270d;
              border-radius: 4px 4px 0px 0px;
            }
          }
        }
      }
    }

    .card_detail {
      width: 682px;
      height: 400px;
      background: #f5f5f5;
      border-radius: 12px;
      margin: 20px auto 30px;
      overflow: hidden;
      // padding-bottom: 30px;
      .card_img {
        width: 682px;
        height: 280px;
        position: relative;
        overflow: hidden;
        background-position:top left;
        background-size: 100%;
        border-radius: 12px;
        .price {
          margin-top: 42px;
          text-align: right;
          padding-right: 34px;

          font-size: 24px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          color: #ffffff;
          >span {
            &:first-child {
              font-size: 48px;
              font-weight: 700;
            }
          }
        }
      }
      .tip_section {
        height: calc(100% - 280px);
        padding: 26px 0 0 60px;
        font-size: 24px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #999999;
        span {
            font-size: 32px;
            font-weight: 500;
            color: #f1270d;
            padding: 0 20px;
        }

        .tip_top {
          position: relative;
          &::before {
            position: absolute;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #999;
            left: -19px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .tip_bottom {
          margin-top: 20px;
        }
      }
    }

    .footer {
      background: #F5F5F5;
      padding-top: 20px;
      padding-bottom: 400px;

      .footer_box {
        width: 682px;
        // height: 1134px;
        opacity: 1;
        background: #ffffff;
        border-radius: 12px;
        margin: 0 auto;
        padding: 20px 10px;
        overflow: hidden;

        .top{
          width: 662px;
          height: 240px;
          >img {
            width: 662px;
            height: 240px;
            display: block;
          }
        }

        .top_title {
          text-align: center;
          margin-top: 75px;
          >span {
              position: relative;
              font-size: 32px;
              font-family: PingFang SC, PingFang SC-Medium;
              font-weight: 500;
              color: #333;
              &::before {
                  content: '';
                  position: absolute;
                  left: -90px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 77px;
                  height: 5px;
                  background: url('https://pre-1303873333.picbj.myqcloud.com/data/pre/images/quanyika/topup_detail_title_left.png') no-repeat center;
                  background-size: 100%;
              }

              &::after {
                  content: '';
                  position: absolute;
                  right: -90px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 77px;
                  height: 5px;
                  background: url('https://pre-1303873333.picbj.myqcloud.com/data/pre/images/quanyika//topup_detail_title_right.png') no-repeat center;
                  background-size: 100%;
              }
          }
        }

        .top_detail_box {
            display: flex;
            flex-wrap: wrap;
            margin-top: 40px;
            .topup_detail_box_item {
                width: 33.33333333%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                font-weight: 400;
                color: #333;
                &:nth-child(n+4) {
                    margin-top: 28px;
                }

                .icon {
                    width: 78px;
                    height: 78px;
                    overflow: hidden;
                    margin-bottom: 15px;
                    img {
                      width: 78px;
                      height: 78px;
                    }
                }
            }
        }

        .tip {
            color: red;
            padding: 0 30px;
            font-size: 24px;
            font-weight: 400;
            color: #666;
            line-height: 38px;
            letter-spacing: 1px;
            margin-top: 52px;
        }
      }

      .sticky_bottom{
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 6;
            box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(86, 86, 86, 0.1);
            background: #FFF;
            .agreement{
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 24px;
                font-weight: 400;
                color: #333;
                padding-left: 53px;
                >span{
                    color: #F1270D;
                }

                &.active {
                    position: relative;
                    &::before {
                        content: '';
                        position: absolute;
                        left: 32px;
                        top: 50%;
                        width: 8px;
                        height: 8px;
                        background: #F1270D;
                        border-radius: 4px;
                        transform: translateY(-50%);
                    }
                }
            }
            .recharge {
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 24px;
                font-weight: 400;
                color: #333;
                vertical-align: baseline;
                line-height: 1;
                padding: 0 34px;

                .text{
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    justify-content: flex-start;
                    font-size: 22px;
                    font-weight: 400;
                    color: #333;

                    .real_price {
                        >span {
                            font-size: 36px;
                            font-weight: 500;
                            color: #f1270d;
                            margin-left: 15px;
                        }
                    }

                    .gift_price{
                        margin-top: 13px;
                        >span {
                            font-size: 22px;
                            font-weight: 500;
                            color: #f1270d;
                            margin-left: 14px;
                        }
                    }
                }

                .btn {
                    width: 236px;
                    height: 88px;
                    background: linear-gradient(270deg, #FC1B1D, #FF9FA1);
                    border-radius: 44px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    font-weight: 400;
                    color: #FFF;
                    margin-left: 30px;
                    position: relative;
                    > div {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        opacity: 0;
                        z-index: 1;
                    }
                }
                .disable {
                    background: #D8D8D8;
                }
            }

            .toWeChat {
              height: 120px;
              background: #fff;
              box-shadow: 0px -7px 8px 0px rgba(239, 239, 239, 0.5);
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 30px;
              font-weight: 400;
              color: #ffffff;
              padding: 0 27px;
              > div {
                width: 338px;
                height: 88px;
                opacity: 1;
                background: #08c161;
                border-radius: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 1;
              }
            }
        }
    }

    .mask {
      text-align: right;
      padding-right: 63px;
      .first {
        >img {
          width: 312px;
          height: 220px;
        }
      }
      .second {
        // text-align: right;
        margin-top: 360px;
        >img {
          width: 408px;
          height: 271px;
        }
      }

      .iknow {
        text-align: center;
        margin-top: 70px;
        >img {
          width: 218px;
          height: 66px;
        }
      }
    }

    .mask_box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 580px;
        background: #fff;
        border-radius: 16px;
        padding-top: 30px;
        padding-bottom: 30px;
        box-sizing: border-box;

        .mask_header{
            text-align: center;
            .icon{
                width: 78px;
                height: 78px;
                margin: 0 auto;
                margin-bottom: 18px;
                >img {
                  width: 78px;
                  height: 78px;
                }
            }
            >span {
                font-size: 32px;
                font-weight: bold;
                color: #030303;
                letter-spacing: 1px;
            }
        }

        .mask_desc{
            box-sizing: border-box;
            border-radius: 8px;
            padding: 24px 12px;
            background: #f5f5f5;
            margin: 23px 20px 20px;
            font-size: 22px;
            font-weight: 400;
            color: #666666;
            line-height: 38px;
            >div {
                width: 100%;
                height: 220px;
                overflow-y: scroll;
            }
        }

        .close_btn {
            width: 180px;
            height: 72px;
            opacity: 1;
            background: linear-gradient(270deg,#fc1b1d 0%, #ff9fa1 100%);
            border-radius: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            font-weight: 400;
            color: #fff;
            margin: 0 auto;
        }
    }

  }
</style>
