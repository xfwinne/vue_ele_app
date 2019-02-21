<template>
<div>
  <div class="header">
    <div class="header-top clearfix">
      <div class="header-img">
        <img :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetial">      
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="header-buttom" @click="showDetial">
      <span class="title"></span><span class="text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>

    </div>
    <div class="header-bg">
      <img :src="seller.avatar">
    </div>
  <!-- 弹出层 -->
  <transition name="fade">
    <div v-show="detailShow" class="detail" >
      <div class="detail-content-wrap clearfix">
        <div class="detail-content">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrap">
            <v-star :size="48" :score="seller.score"></v-star> 
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="mark-supports supports">
            <li class="support-item clearfix" v-for="(item,index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>  
          <p class="seller-desc">
            {{seller.bulletin}}
          </p>
          
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close" @click="closeDetail"></i>
      </div>
    </div>
  </transition>
  </div>
</div>
</template>

<script>
import star from 'components/star/star';

export default {
  props:{  //接收元素上指令传过来的值seller(v-bind:seller 中的 seller就是传过来的数据名，下面要对应)
    seller:{
      type:Object //数据类型为obje
    }
  },
  created(){
    this.classMap = ['decrease','discount','special','invoice','guarantee'];
  },
  data(){
    return {
      detailShow:false
    }
  },
  methods:{
    showDetial(){
      // 点击后改变detailShow值来控制弹出层的显示和隐藏
      this.detailShow = true;
    },
    closeDetail(){
      this.detailShow = false;
    }
  },
  components:{
    'v-star':star
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.header{
  position: relative;
  overflow: hidden;
  color:#fff;
  background: rgba(7,17,27,0.3);
}
.header-top{
  position: relative;
  padding: 24px 12px 18px 24px;
  /*vertical-align: top; */
}
.header-img{
  float: left;
  height: 64px;
}
.header-img>img{
  height: 64px;
  width: 64px;
  border-radius: 2px;
}
.header .content{
  float: left;
  margin-left: 16px;
}
.header .content .title{
  margin:2px 0 8px 0;
}
.header .content .brand{
  display: inline-block;
  width: 30px;
  height: 18px;
  vertical-align: top;
  background: url(./brand@2x.png) no-repeat;
  background-size: 30px 18px;
}
.header .content .name{
  margin-left: 6px;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
}
.header .content .description{
  margin-bottom: 8px;
  line-height: 12px;
  font-size: 12px;
}


.header .content .support{

}
.header .content .icon{
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  vertical-align: bottom;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}

/*根据不同的类名来设置背景图片*/
.header .content .decrease{
  background-image: url('decrease_1@2x.png')
}
.header .content .discount{
  background-image: url('discount_1@2x.png')
}
.header .content .guarantee{
  background-image: url('guarantee_1@2x.png')
}
.header .content .invoice{
  background-image: url('invoice_1@2x.png')
}
.header .content .special{
  background-image: url('special_1@2x.png')
}
.header .content .text{
  line-height: 12px;
  font-size: 10px;
}
.header .support-count{
  position: absolute;
  right: 12px;
  bottom: 14px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 14px;
  font-size: 10px;
  text-align: center;
  background-color:rgba(0,0,0,0.2);
}
.icon-keyboard_arrow_right{
  margin-left: 2px;

}
.header .support-count .count{
  vertical-align: top;
}

.header-buttom {
  position: relative;
  height: 28px;
  line-height: 28px;
  padding: 0 22px 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color:rgba(7,17,27,0.2);
}
.header-buttom .title{
  display: inline-block;
  width: 22px;
  height: 12px;
  background: url(bulletin@2x.png) no-repeat;
  background-size: 22px 12px;
}
.header-buttom .text{
  margin:0 4px;
  vertical-align: 2px;
  font-size: 10px;
}
.header-buttom .icon-keyboard_arrow_right{
  position: absolute;
  font-size: 10px; 
  right: 12px;
  top: 10px;   
}
.header-bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  z-index: -1;
  filter: blur(10px);
}
.header-bg > img{
  width: 100%;
  height:100%;
}

.detail{
  position: fixed;
  top: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100%;
  z-index: 100;
  /*只有在ios系统下才支持这个模糊效果属性*/
  backdrop-filter:blur(3px);
  /*过渡的最终效果应用的样式*/
  opacity: 1;
  background: rgba(7,17,27,0.8);
}
/*过渡时间*/
.detail.fade-enter-active,.detail.fade-leave-active{
  transition: all 0.5s;
}
/*过渡一开始和过渡结束过程应用的样式*/
.detail.fade-enter,.detail.fade-leave-active{
  opacity: 0;
  background: rgba(7,17,27,0);
}
.detail .detail-content-wrap{
  min-height: 100%;
}
.detail .detail-content{
  padding-top: 64px;
  padding-bottom: 64px;
}
.detail-content .name{
  line-height: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.detail-content .star-wrap{
  margin-top: 18px;
  padding:2px 0;
  text-align: center;
}
.detail-content .title{
  display: flex;
  width: 80%;
  margin:28px auto 24px;
}
.detail-content  .title .line{
  flex: 1;
  position: relative;
  top: -6px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.detail-content  .title .text{
  padding: 0 12px;
  font-size: 14px;
  font-weight: 700;
}
.detail-content .mark-supports{
  width: 80%;
  margin:0 auto;
}
.detail-content .support-item{
  padding:0 12px;
  margin-bottom: 12px;
}
.detail-content .support-item:last-child{
  margin-bottom: 0;
}
.detail-content .support-item .icon{
  float: left;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: top;
  background-size: 16px 16px;
  background-repeat: no-repeat;

}

/*根据不同的类名来设置背景图片*/
.detail-content .support-item .decrease{
  background-image: url('decrease_2@2x.png')
}
.detail-content .support-item .discount{
  background-image: url('discount_2@2x.png')
}
.detail-content .support-item .guarantee{
  background-image: url('guarantee_2@2x.png')
}
.detail-content .support-item .invoice{
  background-image: url('invoice_2@2x.png')
}
.detail-content .support-item .special{
  background-image: url('special_2@2x.png')
}
.detail-content .support-item .text{
  float: left;
  line-height: 16px;
  font-size: 12px;
}
.detail .detail-close{
  position: relative;
  width: 32px;
  height: 32px;
  margin:-64px auto 0 auto;
  clear: both;
  font-size: 32px;
}
.detail-content .seller-desc{
  width: 80%;
  margin:0 auto;
  padding:0 12px;
  line-height: 24px;
  font-size: 12px;
}
.detail .icon-close{}




</style>
