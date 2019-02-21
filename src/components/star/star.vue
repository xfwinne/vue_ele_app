<!-- 星星组件 -->
<template>
  <div class="star clearfix" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="start-item" :key="itemClass.index"></span>
    
  </div>
</template>

<script>
    // 定义常量来控制，方便修改
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';

    export default { 
        props:{
            // 定义星星的尺寸大小(需要传入)
            size:{
                type:Number
            },
            // 定义评价分数（需要传入）
            score:{
                type:Number
            }
        },
        computed:{
            // starType为通过计算得到类名
            starType(){
                return 'star-'+this.size;
            },
            itemClasses(){
                let resultArr = [];
                // 评分分数向下取整再除以2 (这样取值就为 .0 或 .5 而不会有其他小数了)
                let score = Math.floor(this.score * 2) / 2;
                // 判断是否有小数，控制半星
                let hasDecimal = score % 1 !== 0 ;
                // 取整，控制全星
                let integer = Math.floor(score);
                // 循环push进去全星的个数
                for(let i = 0 ; i<integer ; i++){
                    resultArr.push(CLS_ON);
                }
                // 如果有小数点那么就只有一个半星
                if(hasDecimal){
                    resultArr.push(CLS_HALF);
                }
                // 如果星数不够五个，那么就补全后面的灰星
                while(resultArr.length < LENGTH){
                    resultArr.push(CLS_OFF);
                }

                return resultArr;

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .star{
        display: inline-block;
    }
    .star .start-item{
        float: left;
        /*display: block;*/
        background-repeat: no-repeat;
    }

    .star-48{

    }
    .star-48 .start-item{
        width: 20px;
        height: 20px;
        margin-right: 22px;
        background-size: 20px 20px;
    }
    .star-48 .start-item:last-child{
        margin-right: 0;
    }
    /*全星状态*/
    .star-48 .start-item.on{
        background-image: url(star48_on@2x.png);
    }
    /*半星状态*/
    .star-48 .start-item.half{
        background-image: url(star48_half@2x.png)
    }
    /*灰色星星*/
    .star-48 .start-item.off{
        background-image: url(star48_off@2x.png)
    }
    .star-36{}
    .star-36 .start-item{
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px; 
    }
    .star-36 .start-item:last-child{
        margin-right: 0;
    }
    /*全星状态*/
    .star-36 .start-item.on{
        background-image: url(star36_on@2x.png)
    }
    /*半星状态*/
    .star-36 .start-item.half{
        background-image: url(star36_half@2x.png)
    }
    /*灰色星星*/
    .star-36 .start-item.off{
        background-image: url(star36_off@2x.png)
    }
    .star-24{}
    .star-24 .start-item{
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
    }
    .star-24 .start-item:last-child{
        margin-right: 0;
    }
    /*全星状态*/
    .star-24 .start-item.on{
        background-image: url(star24_on@2x.png)
    }
    /*半星状态*/
    .star-24 .start-item.half{
        background-image: url(star24_half@2x.png)
    }
    /*灰色星星*/
    .star-24 .start-item.off{
        background-image: url(star24_off@2x.png)
    }
    
</style>
