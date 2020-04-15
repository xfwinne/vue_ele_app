import Vue from 'vue'
import Router from 'vue-router'
const goods = () => import('components/goods/goods')
const ratings = () => import('components/ratings/ratings')
const seller = () => import('components/seller/seller')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'goods'
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'
})
