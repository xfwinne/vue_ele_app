import Vue from 'vue';
////// 导入vue路由
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

import './common/style/sell_icon.css';

// 下面这个路径的写法能够直接访问是因为webpack.base.conf.js里面配置了components的路径写法  'components': path.resolve(__dirname, '../src/components')
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';




////// 引用vue-router
Vue.use(VueRouter);
Vue.use(VueResource);
// vue-router1.0版本的需要这样扩展vue实例
let app = Vue.extend(App);

// 实例化路由
// let router = new VueRouter({
//     // 路由配置（可以配置一些相关的操作或者类名的改变）
//     // 如配置路由点击高亮是a标签添加的类名为active，而不是使用默认添加的类名
//     linkActiveClass:'active'
// });

// 路由跳转的模板文件

let router = new VueRouter({
    routes:[  //注意是routes而不是复制过来的代码routers，不然路由进不去，没效果
        {path:'/goods',component:goods},
        {path:'/ratings',component:ratings},
        {path:'/seller',component:seller},
    ],
    linkActiveClass:'active'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(app)
})
// 默认打开页面跳转到哪个路由下
// router.push('/goods');


