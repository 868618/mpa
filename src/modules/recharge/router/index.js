import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../App.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "recharge_index" */ '../views/index.vue'),
  },
]

export default new VueRouter({
  routes,
})
