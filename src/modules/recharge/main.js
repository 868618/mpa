import Vue from 'vue'
// import Index from './index.vue'
import '@/assets/css/reset.css'
import 'lib-flexible/flexible.js'
import router from './router'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  // el: '#app',
  router,
}).$mount('#app')
