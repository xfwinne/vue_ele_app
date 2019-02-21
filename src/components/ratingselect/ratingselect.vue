<!-- 评价tab选择组件 -->
<template>
  <div class="ratingselect">
    <ul class="rating-type clearfix border-1px">
        <li @click="select(2,$event)" class="positive" :class="{'active':selectType===2}">{{desc.all}}<span class="num">{{ratings.length}}</span></li>
        <li @click="select(0,$event)" class="positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="num">{{positive.length}}</span></li>
        <li @click="select(1,$event)" class="negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="num">{{negative.length}}</span></li>
    </ul>
    <div @click="toggleContent($event)" class="view" :class="{'active':onlyContent}">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评价</span>
    </div>
    
  </div>
</template>

<script>
// 正向评价为0
const POSITIVE = 0;
// 负面评价为1
const NEGATIVE = 1;
// 全部评价为2
const ALL = 2;
export default { 
    // 父组件能够传进来的参数，在props中接收(组件中布局一样，只是数据不一样的话，就可以通过传参方式)
    props:{
        // 详细评论条目
        ratings:{
            type:Array,
            default(){
                return [];
            }
        },
        //选择类型
        selectType:{
            type:Number,
            default:ALL
            
        },
        onlyContent:{
            type:Boolean,
            // 默认不只显示有内容的评价
            default:false
        },
        // tab内容
        desc:{
            type:Object,
            default(){
                return {
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                };
            }
        }
    },
    data(){
        // vue2.0中不允许子组件修改父组件穿过来的值，所以这里只能备份
        return {
            myselectType : this.selectType,
            myonlyContent : this.onlyContent
        }
    },
    watch:{
        // 监听父组件传过来的值的变化,重新复制给子组件的data属性
        selectType(val){
            this.myselectType = val;
        },
        onlyContent(val){
            this.myonlyContent = val;
        }
    },
    computed:{
        positive(){
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            })
        },
        negative(){
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            })
        }
    },
    methods:{
        select(type,event){
            if(!event._constructed){
                return;
            }
            // 这里修改的 selectType影响不到父组件的selectType
            this.myselectType = type;
            // 派发事件，让父组件也能监听到selectType改变了
            this.$emit('ratingtype-select',type);
        },
        toggleContent(event){
            if(!event._constructed){
                return;
            }
            this.myonlyContent = !this.myonlyContent;
            // 通知父组件改变了onlyContent
            this.$emit('content-toggle',this.myonlyContent);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ratingselect{}
.ratingselect .rating-type{
    overflow: hidden;
    padding: 18px 0;
    margin: 0 18px;
}
.ratingselect .rating-type.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.3);
}
.ratingselect .rating-type>li{
    float: left;
    padding: 8px 12px;
    border-radius: 1px;
    margin-right: 8px;
    line-height: 16px;
    font-size: 12px;
    color:rgb(77,85,93);
}
.ratingselect .rating-type .num{
    margin-left: 2px;

    font-size: 8px;
}
/*.ratingselect .all{
    background: rgb(0,160,220,0.2);
}*/

.ratingselect .positive{
    background: rgba(0,160,220,0.2);
}
.ratingselect .positive.active{
    color:#fff;
    background: rgb(0,160,220);
}
.ratingselect .negative{
    background: rgba(77,85,93,0.2);
}
.ratingselect .negative.active{
    color:#fff;
    background: rgb(77,85,93);
}
.ratingselect .view{
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7,17,27,0.3);
    color:rgb(147,153,159);
}
.ratingselect .view .icon-check_circle{
    margin-right: 4px;
    font-size: 24px;
    vertical-align: -5px;

}
.ratingselect .view .text{
    font-size: 12px;
}
.ratingselect .view.active .icon-check_circle{
    color:#00c850;
}
</style>
