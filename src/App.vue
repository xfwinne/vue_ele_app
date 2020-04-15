<template>
  <div class="app">
    <v-header :seller='seller'></v-header>
    <!-- <v-header></v-header> -->
    <div class="tabs border-1px">
      <div class="tab-item active">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由外链，路由渲染的部分 -->
    <keep-alive>
    <router-view :seller="seller"></router-view>
    <!-- <router-view></router-view> -->
    </keep-alive>
   <!-- keep-alive是为了保持路由切换后能记住之前路由的状态而设置的 -->
  </div>
</template>

<script>
import header from 'components/header/header.vue'
// import {urlParse} from 'common/js/getUrlParam.js'
import axios from 'axios'
// 定义常量来存储一些数值
// const ERR_OK = 0
export default {
  // 组件中规定data为一个函数
  data () {
    return {
      seller: {}
    }
  },
  // vue实例化时都有一个生命周期，构建的时候就会调用created，所以数据一进入页面就展示的就可以在这里请求
  mounted () {
    // 请求商家数据
    axios({
      method: 'get', // 请求方式
      url: '/api/data.json'
    }).then((res) => { // 成功请求的回调函数
      console.log(res)
      let data = res.data
      this.seller = data.seller
    }).catch((error) => { // 请求失败的回调函数
      console.log(error)
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style>
.app > .tabs{
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  /*border-bottom: 1px solid rgba(7,17,27,0.1);*/
}
.app > .tabs::after{
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top:1px solid rgba(7,17,27,0.1);
  content: '';
}
.app > .tabs > .tab-item{
  flex: 1;
  text-align: center;
}
.app > .tabs > .tab-item >a{
  display: block;
  font-size: 14px;
  color:rgb(77,85,93);
}
.app > .tabs > .tab-item >.active{
  color:#f01414;
}
</style>
