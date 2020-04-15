<template>
  <div class="seller-wrap" ref="sellerWrap">
    <div class="seller-content">
        <div class="seller-view">
            <h1 class="title">{{seller.name}}</h1>
            <div class="desc border-1px">
                <v-star :size="36" :score="seller.score"></v-star><span class="rank">
                    （{{seller.ratingCount}}）
                </span><span class="text">月售{{seller.sellCount}}单</span>
            </div>
            <ul class="remark clearfix">
                <li class="block">
                    <div class="name">起送价</div>
                    <div class="content">
                        <span class="price">{{seller.minPrice}}</span>元
                    </div>
                </li>
                <li class="block">
                    <div class="name">商家配送</div>
                    <div class="content">
                        <span class="price">{{seller.deliveryPrice}}</span>元
                    </div>
                </li>
                <li class="block">
                    <div class="name">平均配送时间</div>
                    <div class="content">
                        <span class="price">{{seller.deliveryTime}}</span>分钟
                    </div>
                </li>
            </ul>
            <div class="favorite" @click="toggleFavorite($event)">
                <i class="icon-favorite" :class={active:favorite}></i>
                <span class="text">{{favoriteText}}</span>
            </div>
        </div>
        <v-split></v-split>
        <div class="bulletin">
            <div class="title">商家公告</div>
            <div class="content-wrap border-1px">
                <p class="content">
                    {{seller.bulletin}}
                </p>
            </div>
        </div>
        <ul v-if="seller.supports" class="mark-supports supports">
            <li class="support-item clearfix border-1px" v-for="(item,index) in seller.supports" :key='index'>
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
        </ul>
        <v-split></v-split>
        <div class="pics-wrap">
            <div class="title">商家实景</div>
            <div class="pic-content-wrap clearfix" ref="picContent">
                <ul class="pic-list" ref="picList">
                    <li v-for="(pic,index) in seller.pics" class="pic-item"  :key='index'>
                        <img :src="pic" width="120" height="90">
                    </li>
                </ul>
            </div>
        </div>
        <v-split></v-split>
        <div class="seller-info">
            <div class="title border-1px">商家信息</div>
            <ul class="ul-list">
                <li class="info-item border-1px" v-for="(info,index) in seller.infos"  :key='index'>{{info}}</li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from 'components/star/star'
import split from 'components/split/split'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: false
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  components: {
    'v-star': star,
    'v-split': split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  watch: { // 监听到起其内部值的变化
    'seller' () {
      // 监听seller发生变化了就初始化better-scroll
      this._initScroll()
      this._initPic()
    }
  },
  mounted () { // 在vue的生命周期中，如果dom都被渲染了，那么这个方法会被调用。
    // better-scroll严格依赖dom高度

    // 为了防止切换到其他tab后又切换到商家这个不能滑动，所以这里还要初始化
    this.$nextTick(() => {
      this._initScroll()
      this._initPic()
    })
  },
  methods: {
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.sellerWrap, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPic () {
      // 判断是否存在商家实景图片，然后计算ul的宽度(因为better-scroll是在内层的宽度或者高度超过父级的宽高是才可以滑动的)
      if (this.seller.pics) {
        let picWidth = 120
        let liMargin = 6
        let ulWidth = (picWidth + liMargin) * this.seller.pics.length - liMargin
        this.$refs.picList.style.width = ulWidth + 'px'

        this.$nextTick(() => {
          if (!this.picScroll) {
            this.scroll = new BScroll(this.$refs.picContent, {
              click: true,
              // 设置横向滑动
              scrollX: true,
              // 在这个横向滚动中禁止纵向滚动
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.seller-wrap{
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}
.seller-wrap .seller-view{
    position: relative;
    padding: 18px;
}
.seller-wrap .seller-view .title{
    margin-bottom: 8px;
    line-height: 14px;
    font-size: 14px;
    color:rgb(7,17,27);
}
.seller-wrap .seller-view .desc{
    padding: 18px 0;
    font-size: 10px;
    color: rgb(77,85,93);
}
.seller-wrap .seller-view .desc.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.seller-wrap .seller-view .star{
    margin-right: 8px;
    vertical-align: -2px;
}
.seller-wrap .seller-view .rank{
    line-height: 18px;
    margin-right: 12px;
}
.seller-wrap .seller-view .text{

    line-height: 18px;
}
.seller-wrap .seller-view .remark{
    display: flex;
    padding-top: 18px;
}
.seller-wrap .seller-view .block{
    flex: 1;
    border-right: 1px solid rgba(7,17,27,0.2);
    text-align: center;
}
.seller-wrap .seller-view .block:last-child{
    border-right: none;
}
.seller-wrap .seller-view .name{
    margin-bottom: 4px;
    line-height: 10px;
    font-size: 10px;
    color:rgb(153,157,159);
}
.seller-wrap .seller-view .content{
    line-height: 24px;
    font-size: 10px;
    font-weight: 200px;
    color:rgb(7,17,27);
}
.seller-wrap .seller-view .price{
    font-size: 24px;
}
.seller-wrap .seller-view .favorite{
    position: absolute;
    right: 11px;
    top:18px;
    width: 50px;
    /*text-align: center;*/
}
.seller-wrap .seller-view .icon-favorite{
    display: block;
    line-height: 24px;
    margin-bottom: 4px;
    font-size: 24px;
    color:#d4d6d9;
}
.seller-wrap .seller-view .icon-favorite.active{
    color: rgb(240,20,20);
}
.seller-wrap .seller-view .favorite .text{
    line-height: 10px;
    font-size:12px;
    color: rgb(77,85,93);
}
.seller-wrap .bulletin{
    padding: 18px 18px 0 18px;
}
.seller-wrap .bulletin .title{
    margin-bottom: 8px;
    line-height: 14px;
    font-size: 14px;
    color:rgb(7,17,27);
}
.seller-wrap .bulletin .content-wrap{
    padding: 0 12px 16px 12px;
}
.seller-wrap .bulletin .content-wrap.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.seller-wrap .bulletin .content{
    line-height: 24px;
    font-size: 12px;
    color:rgb(240,20,20);
}

.seller-wrap .supports .support-item{
    padding: 16px 12px;
}
.seller-wrap .supports .support-item.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.seller-wrap .supports .support-item:last-child::after{
    border:none;
}
.seller-wrap .supports .icon{
    display: inline-block;
    height: 16px;
    width: 16px;
    margin-left: 12px;
    vertical-align: -4px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
}
/*根据不同的类名来设置背景图片*/
.seller-wrap .support-item .decrease{
  background-image: url('img/decrease_4@2x.png')
}
.seller-wrap .support-item .discount{
  background-image: url('img/discount_4@2x.png')
}
.seller-wrap .support-item .guarantee{
  background-image: url('img/guarantee_4@2x.png')
}
.seller-wrap .support-item .invoice{
  background-image: url('img/invoice_4@2x.png')
}
.seller-wrap .support-item .special{
  background-image: url('img/special_4@2x.png')
}
.seller-wrap .supports .text{
    line-height: 16px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(7,17,27);
}

.seller-wrap .pics-wrap{
    padding: 18px;
}
.seller-wrap .pics-wrap .title{
    margin-bottom: 12px;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7,17,27);
}
.seller-wrap .pics-wrap .pic-content-wrap{
    width: 100%;
    overflow: hidden;

}
.seller-wrap .pics-wrap .pic-list{
    font-size: 0;
    /*为了让里面的li超出宽度时不会折行*/
    white-space: nowrap;
}
.seller-wrap .pics-wrap .pic-item{
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
}
.seller-wrap .pics-wrap .pic-item:last-child{
    margin-right: 0;
}
.seller-wrap .seller-info{
    padding: 18px 18px 0 18px;
}
.seller-wrap .seller-info .title{
    padding-bottom: 12px;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7,17,27);
}
.seller-wrap .seller-info .title.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.seller-wrap .seller-info .info-item{
    padding: 16px 12px;
    line-height: 16px;
    font-size: 12px;
    color: rgb(7,17,27);

}
.seller-wrap .seller-info .info-item.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.seller-wrap .seller-info .info-item:last-child::after{
    border:none;
}

</style>
