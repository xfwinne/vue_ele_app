<template>
  <div class="app">    
    <v-header v-bind:seller='seller'></v-header>    
    <div class="tabs border-1px">
      <div class="tab-item">
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
    </keep-alive>
   <!-- keep-alive是为了保持路由切换后能记住之前路由的状态而设置的 -->
  </div>
</template>

<script>
import header from 'components/header/header.vue';
import {urlParse} from './common/js/getUrlParam.js';
// 定义常量来存储一些数值
const ERR_OK = 0;

export default {
  // 组件中规定data为一个函数
  data(){
    return {
      seller:{
        // 商家id(从url参数中拿)
        id:( () => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    }
  },
  // vue实例化时都有一个生命周期，构建的时候就会调用created，所以数据一进入页面就展示的就可以在这里请求
  created(){
    // 请求商家数据
    this.$http.get('/api/seller?id='+ this.seller.id).then(response => {
      // response为请求后得到的数据
    // get body data  成功请求时执行的    
      response = response.body;
      // 判断errno是不是等于0，即取到正确数据（看你自己设置的json数据格式判断）
      if(response.errno === ERR_OK){
             
        this.seller = response.data;
        // this.seller = Object.assign({},this.seller,response);   
        // console.log(this.seller.id);
      }


    }, response => {
      // error callback 错误请求时执行的
    });
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
