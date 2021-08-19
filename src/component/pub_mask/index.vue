<template>
    <div class="pub_mask">
        <div class="pub_mask_bg">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .pub_mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;

        .pub_mask_bg {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .3);
        }
    }
</style>
