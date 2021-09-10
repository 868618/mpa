<template>
    <div class="succ">
        <header class="header" :style="{ background: bgColor }">
            <i :class="['iconfont', isSuccess ? 'icon-a-chenggong2x': 'icon-a-shibai2x']"></i>
            <span>充值{{ rechargeText }}</span>
        </header>

        <main class="main" v-if="isSuccess">
            <nav class="nav">
                <div class="left">充值金额</div>
                <div class="right">¥9.00</div>
            </nav>

            <nav class="nav">
                <div class="left">备注</div>
            </nav>

            <section>
                <Input type="textarea" :placeholder="placeholder" style="background: #fafafa;" />
            </section>

            <nav class="nav">
                <div class="left">付款成功截图</div>
            </nav>
            <Uploader :after-read="afterRead" v-model="fileList" />

            <p class="warning">*付款完成后请务必将付款成功截图在此处提交或发送给专员，有助于加快充值速度</p>

        </main>
        <footer class="footer">
            <Button color="#F1270D" block round v-if="isSuccess">确认充值</Button>
            <Button color="#F1270D" block round v-else>重新充值</Button>
        </footer>
    </div>
</template>

<script>

import { Field, Uploader, Button } from 'vant'
import pub from '@/api/pub'

export default {
  name: 'refresh',
  components: {
    Input: Field,
    Uploader,
    Button,
  },
  data() {
    return {
      placeholder: '在此填写输入充值的账户手机号和顾问名称有助于加快充值速度',
      fileList: [],
      isSuccess: window.location.href.includes('success'),
    }
  },

  methods: {
    getFile(event) {
      console.log('event', event.target.files[0])
    },
    async afterRead(file) {
      console.log('file-----', file.file)
      file.status = 'uploading';
      file.message = '上传中...';

      const param = new FormData()
      param.append('uploadFile[]', file.file)

      const res = await pub.upLoadFile({
        key: 'c01a55aed70fd31a8560473e4c051a89',
        flag: 1,
        param,
      })
      console.log('res', res)

      file.status = 'done';
      file.message = '上传完成';
    },
  },

  computed: {
    bgColor() {
      return this.isSuccess ? '#0CB57C' : '#EA6060'
    },

    rechargeText() {
      return this.isSuccess ? '成功' : '失败'
    },
  },

}
</script>

<style>
    @import url('//at.alicdn.com/t/font_2792191_by2ug7w1no.css');
    * {
        box-sizing: border-box;
    }
</style>

<style lang="less" scoped>
    .succ {
        background: #eff1f2;
        min-height: 100vh;
        .header {
            height: 256px;
            background: #0CB57C;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >i {
                font-size: 90px;
                color: #fff;
            }
            >span {
                margin-top: 24px;
                font-size: 32px;
                font-weight: 700;
                color: #fff;
            }
        }

        .main {
            width: 702px;
            background: #FFF;
            margin: 24px;
            margin-top: 20px;
            border-radius: 8px;
            padding: 24px;

            .nav {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 400;
                margin: 24px 0;
                &:first-child {
                    margin-top: 0;
                }

                .left {
                    font-size: 26px;
                    color: #333333;
                }

                .right {
                    font-size: 24px;
                    color: #f1270d;
                }
            }

            .warning {
                font-size: 24px;
                font-weight: 400;
                color: #fa6400;
                line-height: 36px;
                margin-top: 22px;
            }
        }

        .footer {
            padding: 0 24px;
            margin-top: 24px;
        }
    }
</style>
