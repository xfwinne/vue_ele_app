<!-- 购物车组件 -->
<template>
<div>
  <div class="shopcart">
      <div class="content" @click="toggleListShow">
          <div class="content-left">
              <div class="shop-logo-wrap clearfix">
                  <div class="logo" :class="{'highlight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                  </div>
                  <div class="good-num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highlight':totalPrice>0}">
                  ￥{{totalPrice}}
              </div>
              <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right">
              <div class="pay" :class="payClass" @click.stop.prevent="pay">
                  {{payDesc}}
              </div>
          </div>
          <!-- 定义一个小球落入的容器 -->
          <div class="ball-container">
              <transition-group
              name="drop"
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:after-enter="afterEnter"
              >
              <div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball.id">
                  <div class="inner inner-hook"></div>
              </div>
              </transition-group>
          </div>

      </div>
      <!-- 展开购物车内容 -->
      <transition name="up">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content"  ref="listContent">
                <ul>
                    <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrap">
                            <v-cartcontrol :food="food"></v-cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </transition>
  </div>
  <transition name="fade">
    <div @click="hideList" class="shopcart-mark" v-show="listShow"></div>
  </transition>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol'
export default {
  data () {
    return {
      // 里面定义五个小球
      balls: [
        {
          id: 1,
          show: false
        },
        {
          id: 2,
          show: false
        },
        {
          id: 3,
          show: false
        },
        {
          id: 4,
          show: false
        },
        {
          id: 5,
          show: false
        }
      ],
      // 存储下落的小球
      dropBalls: [],
      // 定义一个变量来标识购物车是否为展开状态(默认折叠状态)
      fold: true
    }
  },
  components: {
    'v-cartcontrol': cartcontrol
  },
  // 接收父级传过来的变量
  props: {
    // 接收父级传过来的商品数那些，选择了哪些商品
    selectFoods: {
      type: Array,
      default () {
        return [{
          price: 10,
          count: 1
        }]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 定义小球下落的方法（element参数是派发事件发生的dom对象）
    drop (element) {
      // 这样就能获取到点击了哪个加减号了
      console.log(element)

      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.element = element
          this.dropBalls.push(ball)
          return
        }
      }
    },
    toggleListShow () {
      if (!this.totalCount) {
        return
      }
      // 如果存在商品则对 fold取反
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    // 点击遮罩层也关掉购物车列表
    hideList () {
      this.fold = true
    },
    // 去结算函数
    pay () {
      // 如果选的总价小于起步价，则不做任何事情
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    },
    // 过渡效果钩子函数
    beforeEnter (element) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        // 获取到所有小球的show为true的小球
        if (ball.show) {
          // 获取到要运动小球的距离视口顶部和左边的距离
          let rect = ball.element.getBoundingClientRect()
          // 下面计算的x，y是小球到槽之间的水平和垂直的值
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          element.style.display = ''
          // 外层元素做纵向变化
          element.style.webkitTransform = `translate3d(0,${y}px,0)`
          element.style.transform = `translate3d(0,${y}px,0)`
          // 内层元素做水平变化
          let inner = element.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0 ,0)`
          inner.style.transform = `translate3d(${x}px,0 ,0)`
        }
      }
    },
    // 当动画完成进入的时候的状态
    enter (element) {
      // 主动触发浏览器重绘
      // let rf = element.offsetHeight
      this.$nextTick(() => {
        // 反引号里面没有使用到变量的时候就直接用引号，不要用反引号了，不然可能编译的时候哦会报错。
        element.style.webkitTransform = 'translate3d(0,0,0)'
        element.style.transform = 'translate3d(0,0,0)'
        // 内层元素做水平变化
        let inner = element.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter (element) {
      // 动画完成之后对小球进行状态重置
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
      }
      element.style.display = 'none'
    }

  },
  computed: {
    // 总价计算
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    // 商品个数总和
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 购物车右边结算的的状态变化描述
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 购物车结算高亮判断
    payClass () {
      if (this.totalPrice >= this.minPrice) {
        return 'enough'
      } else {
        return false
      }
    },
    /* eslint-disable */
    listShow () {
      // 如果没有选择商品，那么就为折叠状态
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      // 如果有选择商品，那么对值取反，即一开始购物车是隐藏的
      let show = !this.fold

      // 在展示列表的时候给列表添加滑动效果
      if (show) {
        this.$nextTick(() => {
          // 如果不需要滑动的时候，就不用初始化滑动插件
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            // 重新渲染高度差
            this.scroll.refresh()
          }
        })
        // this.$emit('cart-add',event.target);
      }

      return show
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shopcart{
    position:fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;
    z-index: 9;
}
.shopcart .content{
    display: flex;
    background-color: #141d27;
}
.shopcart .content-left{
    flex: 1;
}

.shopcart .shop-logo-wrap{
    float: left;
    position: relative;
    top:-10px;
    margin:0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #141d27;
}
.shopcart .shop-logo-wrap .logo{
    height: 100%;
    width: 100%;
    text-align: center;
    border-radius: 50%;
    background-color: #2b343c;
}
.shopcart .shop-logo-wrap .logo.highlight{
    background-color: rgb(0,160,282);
}
.shopcart .shop-logo-wrap .good-num{
     position: absolute;
     top: 0;
     right: 0;
     width: 24px;
     height: 16px;
     line-height: 16px;
     text-align: center;
     border-radius: 16px;
     font-size: 9px;
     font-weight: 700;
     color:#fff;
     background-color: rgb(240,20,20);
     box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
}
.shopcart .shop-logo-wrap .icon-shopping_cart{
    font-size: 24px;
    line-height: 44px;
    color:#80858a;
}
.shopcart .shop-logo-wrap .icon-shopping_cart.highlight{
    color: #fff;
}
.shopcart .content-left .price{
    float: left;
    margin-top: 12px;
    padding-right:  12px;
    line-height: 24px;
    box-sizing: border-box;
    border-right: 1px solid rgb(255,255,255,0.1);
    font-size: 16px;
    font-weight: 700;
    color:rgba(255,255,255,0.4);
}
.shopcart .content-left .price.highlight{
    color:#fff;
}
.shopcart .content-left .desc{
    float: left;
    line-height: 24px;
    margin: 12px 0 0 12px;
    font-size: 12px;
    color:rgba(255,255,255,0.4);
}

.shopcart .content-right{
    flex: 0 0 100px;
    width: 100px;
}
.shopcart .content-right .pay{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color:rgba(255,255,255,0.4);
    background-color: #2b333c;
}
.shopcart .content-right .pay.enough{
    color:#fff;
    background-color: #00b43c;
}
.ball-container .ball{
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 10;

}

.ball-container .ball.drop-enter-active,.ball-container .ball.drop-leave-active{
    /*贝塞尔曲线*/
    transition: all 0.4s cubic-bezier(.49,-0.29,.75,0.41);
}
.ball-container .ball.drop-enter-active .inner,.ball-container .ball.drop-leave-active .inner{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: rgb(0,160,220);
    transition: all 0.4s linear;
}

.shopcart-list{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: -1;
    /*动画执行的时候高度缓慢增加到原本高度*/
    transform: translate3d(0,-100%,0);
}
.shopcart-list.up-enter-active,.shopcart-list.up-leave-active{
    transition: all .5s ;

}
.shopcart-list.up-enter,.shopcart-list.up-leave-active{
    transform: translate3d(0,0,0);
}
.shopcart-list .list-header{
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom: 1px solid rgba(7,17,27,0.1);
}
.shopcart-list .list-header .title{
    float: left;
    font-size: 14px;
    color:rgb(7,17,27);
}
.shopcart-list .list-header .empty{
    float: right;
    font-size: 12px;
    color:rgb(0,160,220);
}
.shopcart-list .list-content{
    overflow: hidden;
    padding: 0 18px;
    max-height: 217px;
    background: #fff;
}
.shopcart-list .food{
    position: relative;
    padding: 12px 0;
    box-sizing: border-box;

}
.shopcart-list .food.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.1);
}
.shopcart-list .food .name{
    line-height: 24px;
    font-size: 14px;
    color:rgb(7,17,27);
}
.shopcart-list .food .price{
    position: absolute;
    right: 90px;
    bottom: 12px;
    line-height: 24px;
    font-weight: 700;
    font-size: 14px;
    color:rgb(240,20,20);
}
.shopcart-list .food .cartcontrol-wrap{
    position: absolute;
    right: 0;
    bottom: 5px;
}
.shopcart-mark{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
    backdrop-filter:blur(4px);
    opacity: 1;
    background: rgba(7,17,27,0.6);
}
.shopcart-mark.fade-enter-active,.shopcart-mark.fade-leave-active{
    transition: all 0.5s;

}
.shopcart-mark.fade-enter,.shopcart-mark.fade-leave-active{
    opacity: 0;
    background: rgba(7,17,27,0);
}

</style>
