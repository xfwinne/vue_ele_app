<!-- 商品详情页 -->
<template>
<div>
<transition name="move">
  <div v-show="showFoodFlag" class="food-detail-wrap" ref="foodContent">
    <div class="food-content">
        <div class="img-header">
            <img :src="food.image">
            <i class="icon-arrow_lift back" @click="back"></i>
        </div>
        <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="food-detail clearfix">
                <span class="sell-count">月售{{food.sellCount}}</span>
                <span class="rating">好评率{{food.rating}}</span>
            </div>
            <div class="price">
                <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrap">
                <v-cartcontrol :food="food"></v-cartcontrol>
            </div>
            <transition>
            <div @click="addFirst($event)" class="buy" v-show="!food.count || food.count===0" >加入购物车</div>
            </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="food-info" v-show="food.info">
            <h2 class="title">商品信息</h2>
            <p class="text" >{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="rating-wrap">
            <h1 class="title">商品评价</h1>
            <v-ratingselect v-on:ratingtype-select="ratingtypeSelect" v-on:content-toggle="contentToggle" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
            <div class="rating-comment">
                <ul v-show="food.ratings && food.ratings.length">
                    <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key='index' class="rating-item border-1px">
                    <div class="user">
                        <span class="name">{{rating.username}}</span>
                        <img width="12" height="12" class="avatar" :src="rating.avatar">

                    </div>
                    <div class="time">{{rating.rateTime | formatdate}}</div>
                    <p class="text">
                        <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                    </p>
                     </li>
                </ul>
                <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
        </div>

    </div>

  </div>
</transition>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import Vue from 'vue'
// 引入时间处理模块，需要使用花括号，因为不是export.default;而是可以在公共js中export多个函数，引入多个时中间用逗号隔开即可
import {formatDate} from 'common/js/date.js'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'

// 默认全部评价为2
const ALL = 2

export default {
  props: {
    // 接收传过来的父组件food
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFoodFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  filters: {
    // 默认第一个参数就是竖线前面的值
    formatdate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }

  },
  components: {
    'v-cartcontrol': cartcontrol,
    'v-split': split,
    'v-ratingselect': ratingselect
  },
  methods: {
    // 父组件能调用子组件的方法，但是子组件不能调用父组件的方法
    show () {
      this.showFoodFlag = true
      // 因为有很多商品，所以数据上我们需要每个商品已进入局势初始化状态，所以需要在show方法中进行再次初始化
      this.selectType = ALL
      this.onlyContent = false

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodContent, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    // 回退返回按钮
    back () {
      this.showFoodFlag = false
    },
    // 第一次点击加入购物车
    addFirst (event) { // 如果在上面不传参数，那么默认的第一个参数就是事件
      if (!event._constructed) {
        return
      }
      // 派发事件，产生动画效果
      this.$emit('cart-add', event.target)
      // 第一次没有food.count属性，所以需要Vue.set()来添加
      Vue.set(this.food, 'count', 1)
    },
    needShow (type, text) {
      // 评价tab的显示选项，第一个参数关联积极的还是消极的评价选项，第二个参数关联是否只查看有内容的评价
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    contentToggle (onlycontent) {
      this.onlyContent = onlycontent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    ratingtypeSelect (type) {
      this.selectType = type
      // 内容变化会影响高度，所以要再重新刷新下better-scroll插件
      this.$nextTick(() => {
        this.scroll.refresh()
      })
      this.scroll.refresh()
    }

  }
  // 监听子组件传过来的派发事件
  // events:{
  //     "ratingtype-select"(type){
  //         this.selectType = type;
  //         // 内容变化会影响高度，所以要再重新刷新下better-scroll插件
  //         this.$nextTick(() => {
  //             this.scroll.refresh();
  //         });
  //         this.scroll.refresh();
  //     },
  //     "content-toggle"(onlycontent){
  //         this.onlyContent = onlycontent;
  //         this.$nextTick(() => {
  //             this.scroll.refresh();
  //         });
  //     }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.food-detail-wrap{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 7;
    width: 100%;
    background: #fff;
    transform: translate3d(0,0,0);
}
.food-detail-wrap.move-enter-active,.food-detail-wrap.move-leave-active{
    transition: all 0.2s linear;

}
.food-detail-wrap.move-enter,.food-detail-wrap.move-leave-active{
    transform: translate3d(100%,0,0);
}
.food-detail-wrap .food-content .img-header{
    position: relative;
    width: 100%;
    height: 0;
    /*padding单位为百分比时是根据当前盒子的width计算（因为我们事先不知道宽度，但是我们又需要高度和宽度一致），下面这样写，那么就是img的外层拥有了宽高相等的容器占位，为了防止抖动要事先设置宽高，不然图片加载慢了没有高度，那么会抖动*/
    padding-top:100%;

}
.food-detail-wrap .food-content .img-header>img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

}
.food-detail-wrap .food-content .icon-arrow_lift{
    position: absolute;
    top: 10px;
    left: 0;
    display: block;
    padding: 10px;
    font-size: 20px;
    color:#fff;
    background: rgba(0,0,0,0.2);

}
.food-detail-wrap .food-content .content{
    position: relative;
    padding: 18px;
}
.food-detail-wrap .cartcontrol-wrap{
    position: absolute;
    right:12px;
    bottom: 12px;
}
.food-detail-wrap .buy{
    position: absolute;
    right: 18px;
    bottom: 18px;
    height: 24px;
    line-height:24px;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 12px;
    font-size: 10px;
    text-align: center;
    color:#fff;
    background: rgb(0,160,220);
    z-index: 10;
    opacity: 1;
}
.food-detail-wrap .buy.delay-fade-enter-active,.food-detail-wrap .buy.delay-fade-leave-active{
    /*为了让小球的抛物线能获取到初始位置，所以延迟购物车元素的消失*/
    transition: all 0.2s;

}
.food-detail-wrap .buy.delay-fade-enter,.food-detail-wrap .buy.delay-fade-leave-active{
    opacity: 0;
}
.food-detail-wrap .food-content .title{
    margin-bottom: 8px;
    line-height: 14px;
    font-size: 14px;
    font-weight: 700;
    color:rgb(7,17,27);
}
.food-detail-wrap .food-content .food-detail{
    margin-bottom: 18px;
    line-height: 10px;
    height: 10px;
    font-size: 10px;
    color: rgb(147,153,159);

}

.food-detail-wrap .food-content .sell-count{
    margin-right: 12px;
}
.food-detail-wrap .food-content .price{
    font-weight: 700px;
    line-height: 24px;
}
.food-detail-wrap .food-content .now{
    margin-right: 8px;
    font-size: 14px;
    color:rgb(240,20,20);
}
.food-detail-wrap .food-content .old{
    text-decoration: line-through;
    font-size: 10px;
    color:rgb(147,153,159);
}

.food-detail-wrap .food-info{
    padding: 18px;
}
.food-detail-wrap .food-info .title{
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color:rgb(7,17,27);
}
.food-detail-wrap .food-info .text{
    padding: 0 8px;
    line-height: 24px;
    font-size: 12px;
    color:rgb(77,85,93);
}
.food-detail-wrap .rating-wrap{
    padding-top: 18px;
}
.food-detail-wrap .rating-wrap .title{
    line-height: 14px;
    margin-left: 18px;
    font-size: 14px;
    color:rgb(7,17,27);
}

.food-detail-wrap .rating-comment{
    padding: 0 18px;
}

.food-detail-wrap .rating-item{
    position: relative;
    padding: 16px 0;
}
.food-detail-wrap .rating-item.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.3);
}
.food-detail-wrap .rating-comment .user{
    position:absolute;
    right: 0;
    top: 16px;
    line-height: 12px;
    font-size: 0px;

}
.food-detail-wrap .rating-comment .name{
    display: inline-block;
    margin-right:6px;
    font-size: 10px;
    color: rgb(147,153,159);
}
.food-detail-wrap .rating-comment .avatar{
    border-radius: 50%;
    vertical-align: -2px;
}
.food-detail-wrap .rating-comment .time{
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147,153,159);
}
.food-detail-wrap .rating-comment .text{
    line-height: 16px;
    font-size: 12px;
    color:rgb(7,17,27);
}
.food-detail-wrap .rating-comment .icon{
    display: inline-block;
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
}
.food-detail-wrap .rating-comment .icon-thumb_up{
    color:rgb(0,160,220);
}
.food-detail-wrap .rating-comment .icon-thumb_down{
    color:rgb(147,153,159);
}
.food-detail-wrap .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color:rgb(147,153,159);
}

</style>
