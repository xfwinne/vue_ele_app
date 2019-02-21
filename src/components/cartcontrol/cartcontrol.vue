<!-- 加减按钮组件 -->
<template>
  <div class="cartcontrol clearfix">
    <transition name="move">
        <div class="decrease" v-show="food.count>0" @click.stop="decreaseCart($event)">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script>
// 想要新增或者删除某个不存在的字段时，需要引用vue的一个接口。(比如下面的food.count,不能直接赋值数据。)
import Vue from 'vue';
export default { 
    
    props:{
        food:{
            type :Object
        }
    },    
    methods:{
        // 点击加号的时间函数
        addCart(event){
            // 阻止pc端触发两次
            if(!event._constructed){
                return;
            }
            console.log(111)
            if (!this.food.count) {
                // 如果还没有显示数目就设为1
                // this.food.count = 1;（本不存在的变量不能直接赋值给不存在的变量）
                // 而是通过vue的set接口来设置,这样才能监测到，就存在这个变量了
                Vue.set(this.food,'count',1);
            }else{
                this.food.count ++;
            }

            // 当我们在添加商品的时候，我们通过$emit派发一个自定义事件，为了把当前位置高度传出去给父级，然后做小球抛物线进入购物车效果（第一个参数是事件名，第二个参数是事件对象 ）
            
            this.$emit('cart-add',event.target);





        },
        decreaseCart(event){
            // 阻止pc端触发两次
            if(!event._constructed){
                return;
            }
            if (this.food.count) {
               this.food.count --;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cartcontrol{
    font-size: 24px;
    color:rgb(0,160,220);
}
.cartcontrol .decrease,.cartcontrol .add{
    float: left; 
    padding: 6px;
    line-height: 24px;
}
.cartcontrol .decrease{
    
    opacity: 1;
    /*开启硬件加速，让动画更流畅*/
    transform: translate3d(0,0,0);
}
.cartcontrol .decrease.move-enter-active,.cartcontrol .decrease.move-leave-active{
    
    transition: all 0.4s linear;
}
.cartcontrol .decrease.move-enter,.cartcontrol .decrease.move-leave-active{
    opacity: 0;
    transform: translate3d(24px,0,0);
}
.cartcontrol .decrease .inner{
    display: inline-block;    
    transform: rotate(0);    
}
.cartcontrol .decrease.move-enter-active .inner,.cartcontrol .decrease.move-leave-active .inner{
    transition: all 0.4s linear;
}
.cartcontrol .decrease.move-enter .inner,.cartcontrol .decrease.move-leave-active .inner{
    transform: rotate(180deg);
}
.cartcontrol .add{    
}
.cartcontrol .count{
    float: left;
    min-width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size:10px;
    color:rgb(147,153,159);
    
}

</style>
