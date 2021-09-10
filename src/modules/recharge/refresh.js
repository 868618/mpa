import Vue from 'vue'
import Refresh from './refresh.vue'
import '@/assets/css/reset.css'
import 'lib-flexible/flexible.js'
// import router from './router'
// import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(Refresh),
}).$mount('#app')
