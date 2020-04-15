<template>
<div>
    <div class="goods">
        <div class="left-menu-wrap" ref="menuWrap">
            <ul>
                <li class="menu-item" :class="{'current-index':currentIndex===index}" v-for="(item,index) in goods" :key="index" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="right-foods-wrap" ref="foodsWrap">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" :key="index" v-for="(food,index) in item.foods" class="food-item border-1px">
                            <div class="icon-img">
                                <img :src="food.icon">
                            </div>
                            <div class="food-content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">
                                    {{food.description}}
                                </p>
                                <div class="extra-info">
                                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>

                                </div>
                                <div class="price">
                                    <span class="now">
                                        ￥{{food.price}}
                                    </span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrap">
                                    <v-cartcontrol :food="food" v-on:cart-add="cartAdd"></v-cartcontrol>
                                </div>
                            </div>

                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-shopcart  v-on:cart-add="cartAdd"  ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></v-shopcart>
    </div>
    <!-- 商品详情 -->
    <v-food v-on:cart-add="cartAdd" ref="foodShow" :food="selectFoodView"></v-food>
</div>
</template>

<script>
// 引入滑动插件
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'
import axios from 'axios'

// const ERR_OK = 0
export default {
  props: { // 接收元素上指令传过来的值seller(v-bind:seller 中的 seller就是传过来的数据名，下面要对应)
    seller: {
      type: Object // 数据类型为obje
    }
  },
  data () {
    return {
      goods: [],
      // 每个区间的高度集合
      listHeight: [],
      // 跟踪y轴的滚动值
      scrollY: 0,
      // 选中哪个商品要查看详情的
      selectFoodView: {}
    }
  },
  components: {
    'v-shopcart': shopcart,
    'v-cartcontrol': cartcontrol,
    'v-food': food
  },
  // 接收(加减号)子组件通过$dispatch派发过来的事件(target是传过来的dom事件参数)
  // events:{
  //   'cart-add'(target){
  //       // 调用定义一个方法来处理小球下落的动作
  //       this._drop(target);
  //   }
  // },
  created () {
    // 请求商家数据
    // this.$http.get('/api/goods').then(response => {
    //   // response为请求后得到的数据
    //   // get body data  成功请求时执行的
    //   response = response.body
    //   // 判断errno是不是等于0，即取到正确数据（看你自己设置的json数据格式判断）
    //   if (response.errno === ERR_OK) {
    //     this.goods = response.data
    //     // 在nextTick中调用滑动实例化函数，就是异步请求完成了之后能够正确计算高度了
    //     this.$nextTick(() => {
    //       // 调用滑动实例化函数
    //       this._initScroll()

    //       // 计算商品的每个区间的高度(定义一个方法)
    //       this._calculateHeight()
    //     })

    //     console.log(this.goods)
    //   }
    // }, response => {
    //   // error callback 错误请求时执行的
    // })
    axios({
      method: 'get', // 请求方式
      url: '/api/data.json'
    }).then((res) => { // 成功请求的回调函数
      console.log(res)
      let data = res.data
      this.goods = data.goods
      // this.seller = data.seller
      console.log(this.goods)
      // 在nextTick中调用滑动实例化函数，就是异步请求完成了之后能够正确计算高度了
      this.$nextTick(() => {
        // 调用滑动实例化函数
        this._initScroll()

        // 计算商品的每个区间的高度(定义一个方法)
        this._calculateHeight()
      })
    }).catch((error) => { // 请求失败的回调函数
      console.log(error)
    })
    // icon对应的类名集合，其实多处都有用到，可以做成一个组件
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  computed: {
    // 定义左侧菜单的索引的当前位置
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let heightPrev = this.listHeight[i]
        let heightNext = this.listHeight[i + 1]
        // 如果在最后一个区间或者是在判断的区间内，则返回当前的索引
        if (!heightNext || (this.scrollY >= heightPrev && this.scrollY < heightNext)) {
          return i
        }
      }
      // 如果高度为0，则返回索引值0，表示第一个菜单元素高亮
      return 0
    },
    // 传给购物车组件的数据
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        // 第二层遍历就能拿到所以加入购物车的商品了
        good.foods.forEach((food) => {
          // 我们在点击加减号按钮时，用vue.set()动态增加了这个属性，如果存在这个属性说明已经选择了
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }

  },
  methods: {
    cartAdd (target) {
      // 调用定义一个方法来处理小球下落的动作
      this._drop(target)
    },
    // 初始化滑动插件(需要传入两个参数，一个是dom对象（给哪个加滑动效果），一个是json对象)
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrap, {
        // 传入click是为了使在滑动插件中click事件可以使用。因为在滑动插件初始化的时候事先已经禁用了默认事件
        click: true
      })
      // 在第二个参数中传入probeType:3 （滚动内置接口） 表示滚动时实时告诉我们滚动的位置
      this.foodScroll = new BScroll(this.$refs.foodsWrap, {
        click: true, // 这里是因为内部组件cartcontrol组件也用到了点击事件。
        probeType: 3
      })
      // 然后通过事件的监听，获取到y轴值
      this.foodScroll.on('scroll', (pos) => {
        // 在回调函数里面获取y值(取整后取绝对值)
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      // 获取到每个区间li元素
      let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook')
      let heightL = 0
      // 一开始第一个高亮
      this.listHeight.push(heightL)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        // 获取到每一个区间的高度(后面的-2是样式误差，减掉才能正常对应联动)
        heightL += item.clientHeight - 2

        this.listHeight.push(heightL)
      }
    },
    selectMenu (index, event) {
      // 判断如果是pc端，即没有这个属性时，就直接return,防止触发两次事件操作
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook')

      // 根据点击的是哪个元素来得到商品详情对应的哪个节点
      let element = foodList[index]
      // 调用better-scroll内置接口，让元素滚动到那个节点.（第一个参数是节点元素，第二个是动画时间）
      this.foodScroll.scrollToElement(element, 300)
    },
    // 定义小球下落函数
    _drop (target) {
      // 在这里面调用shopcart（购物车）组件的小球下落的方法
      // 通过vue的接口来使得父组件能够调用子组件的方法，在子组件上定义ref="shopcart"命令，然后调用如下：
      // this.$refs.shopcart.drop(target);
      // 优化动画，连续点击时不会卡顿，异步执行小球下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectFoodView = food
      // 调用子组件让选择商品后的商品详情显示
      this.$refs.foodShow.show()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.goods{
    display: flex;
    overflow: hidden;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
}
.left-menu-wrap{
    /*flex属性来同时设置flex-grow(取值为0时，表示不索取父元素的剩余空间)、flex-shrink(当取值为0时，表示子元素不缩小)、flex-basis(子元素的宽度)*/
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;
}
.menu-item{
    display: table;
    height: 54px;
    width: 56px;
    line-height: 14px;
    padding: 0 12px;
}

.menu-item .text{
    display: table-cell;
    width: 56px;
    vertical-align: middle;
    font-size: 12px;

}
.menu-item .text::after{
    border-top:1px solid rgba(7,17,27,0.1);
}
.menu-item.current-index{
    position: relative;
    margin-top: -1px;
    z-index: 2;
    font-weight: 700;
    background-color: #fff;
}
.menu-item.current-index .text{
    border-top: none;
}
.menu-item .icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
    vertical-align: top;
    background-size: 16px 16px;
    background-repeat: no-repeat;

}

/*根据不同的类名来设置背景图片*/
.menu-item .decrease{
  background-image: url('img/decrease_3@2x.png')
}
.menu-item .discount{
  background-image: url('img/discount_3@2x.png')
}
.menu-item .guarantee{
  background-image: url('img/guarantee_3@2x.png')
}
.menu-item .invoice{
  background-image: url('img/invoice_3@2x.png')
}
.menu-item .special{
  background-image: url('img/special_3@2x.png')
}

.right-foods-wrap{
    /*自适应屏幕的宽度设置*/
    flex: 1;
}
.food-list .title{
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left: 2px solid #d9dde1;
    font-size: 12px;
    color:rgb(147,153,159);
    background-color: #f3f5f7;
}
.food-list .food-item{
    display: flex;
    margin:18px;
    padding-bottom: 18px;
}
.food-list .food-item:last-child{
    margin-bottom: 0;
}
.food-list .food-item::after{
    border-top:1px solid rgba(7,17,27,0.1);
}
/*去掉1像素(还没测试对不对)*/
.food-list .food-item:last-child::after{
    border-top:0;
}
.food-list .food-item .icon-img{
    flex: 0 0 57px;
    width: 57px;
    margin-right: 10px;
}
.food-list .icon-img img{
    width: 57px;
    height: 57px;
}
.food-list .food-content{
    flex: 1;
}
.food-list .food-content .name{
    margin:2px 0 8px 0;
    line-height: 14px;
    height: 14px;
    font-size: 14px;
    color:rgb(7,17,27);
}
.food-list .food-content .desc,.food-list .food-content .extra-info{
    line-height: 10px;
    font-size: 10px;
    color:rgb(147,153,159);
}
.food-list .food-content .desc{
    margin-bottom: 8px;
    line-height: 12px;

}
.food-list .extra-info .count{
    margin-right: 12px;

}
.food-list .food-content .price{
    font-weight: 700;
    line-height: 24px;
}
.food-list .food-content .price .now{
    margin-right: 18px;
    font-size: 14px;
    color:rgb(240,20,20);
}
.food-list .food-content .price .old{
    text-decoration: line-through;
    font-size: 10px;
    color:rgb(147,153,159);
}
.food-list .cartcontrol-wrap{
    position: absolute;
    right: 0;
    bottom: 12px;
}

</style>
