<template>
    <div class="refresh">
        <header class="header">
            <div class="top">倒计时</div>
            <div class="bottom">
                10<span>s</span>
            </div>
        </header>

        <nav class="nav">等待返回支付结果</nav>

        <footer class="refresh_btn">刷新</footer>
    </div>
</template>

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
