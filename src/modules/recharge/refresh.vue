<template>
    <div class="refresh">
        <header class="header">
            <div class="top">倒计时</div>
            <div class="bottom">
                {{ timeOut }}<span>s</span>
            </div>
        </header>

        <nav class="nav">等待返回支付结果</nav>

        <footer class="refresh_btn" @click="resetTimer">刷新</footer>
    </div>
</template>

<script>
// import qs from 'qs'
import pub from '@/api/pub'

export default {
  name: 'Refresh',
  data() {
    return {
      query: window.location.search ? Object.fromEntries(window.location.search.slice(1).split('&').map(i => i.split('='))) : {},
      timeOut: 10,
      status: null,
      timer: null,
    }
  },

  created() {
    this.resetTimer()
    this.loopRefresh()
  },

  methods: {
    resetTimer() {
      clearInterval(this.timer)
      this.timeOut = 10
      this.startInterval()
    },

    startInterval() {
      this.timer = setInterval(() => {
        if (this.timeOut) {
          this.timeOut--
        } else {
          this.toResultPage(this.status)
          clearInterval(this.timer)
        }
      }, 1000)
    },

    async refresh() {
      console.log('this.query', this.query)
      const { code, data: { status } } = await pub.refreshPayStatus(this.query)
      return code === 200 ? Promise.resolve(Number(status)) : Promise.reject(code)
    },

    async loopRefresh() {
      if (this.timeOut) {
        const status = await this.refresh()
        this.status = status
        status === 1 ? this.toResultPage(this.status) : this.loopRefresh()
      } else {
        this.toResultPage()
      }
    },

    toResultPage(status) {
      const { origin } = window.location
      window.location.href = `${origin}/result.html?status=${Number(status) === 1 ? 'success' : 'error'}&pdr_id=${this.query.pdr_id}&money=${this.query.money}`
    },
  },
}
</script>

<style lang="less" scoped>
    .refresh {
        padding-top: 64px;
        .header {
            width: 216px;
            height: 216px;
            margin: 0 auto;
            background: url('../../assets/images/recharge_light.png') no-repeat center;
            background-size: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: PingFangSC, PingFangSC-Regular;
            color: #fff;

            .top {
                font-size: 26px;
                font-weight: 400;
            }

            .bottom {
                font-size: 40px;
                font-weight: 500;
                margin-top: 20px;
                >span {
                    font-size: 20px;
                    margin-left: 8px;
                }
            }
        }

        .nav {
            font-size: 28px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #333333;
            margin-top: 67px;
        }

        .refresh_btn {
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
            margin-top: 32px;
        }
    }
</style>
