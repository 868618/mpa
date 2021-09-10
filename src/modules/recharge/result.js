import Vue from 'vue'
import Result from './result.vue'
import '@/assets/css/reset.css'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Result),
}).$mount('#app')
