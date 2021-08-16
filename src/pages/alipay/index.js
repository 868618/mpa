import Vue from 'vue'
import Index from './index.vue'
import '@/assets/css/reset.css'
import 'lib-flexible/flexible.js'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Index),
}).$mount('#app')
