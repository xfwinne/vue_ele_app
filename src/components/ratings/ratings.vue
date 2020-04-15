<template>
  <div class="ratings-wrap" ref="ratingsWrap">
    <div class="ratings-content" >
        <div class="over-view">
            <div class="left">
                <div class="score">{{seller.score}}</div>
                <div class="title">综合评分</div>
                <div class="rank">高于周边商家{{seller.rankRate}}%</div>
            </div>
            <div class="right">
                <div class="score-wrap">
                    <span class="title">
                        服务态度
                    </span>
                    <v-star :size='36' :score="seller.serviceScore"></v-star>
                    <span class="score">{{seller.serviceScore}}</span>
                </div>
                <div class="score-wrap">
                    <span class="title">
                        商品评分
                    </span>
                    <v-star :size='36' :score="seller.foodScore"></v-star>
                    <span class="score">{{seller.foodScore}}</span>
                </div>
                <div class="delivery-time">
                    <span class="title">送达时间</span>
                    <span class="time">{{seller.deliveryTime}}分钟</span>
                </div>
            </div>
        </div>
        <v-split></v-split>
        <v-ratingselect v-on:ratingtype-select="ratingtypeSelect" v-on:content-toggle="contentToggle" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings">
        </v-ratingselect>
        <div class="rating-detail-wrap">
            <ul>
                <li v-for="(rating,index) in ratings" :key='index' class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)">
                    <div class="avatar">
                        <img width="28" height="28" :src="rating.avatar">
                    </div>
                    <div class="content">
                        <div class="name">{{rating.username}}</div>
                        <div class="star-wrap">
                            <v-star :size="24" :score="rating.score"></v-star><span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
                        </div>
                        <p class="text">{{rating.text}}</p>
                        <div class="recommend" v-show="rating.recommend.length">
                            <span class="icon-thumb_up" ></span>
                            <span class="text" v-for="(rec,index) in rating.recommend" :key='index'>{{rec}}</span>
                        </div>
                        <div class="time">
                            {{rating.rateTime | formatdate}}
                        </div>

                    </div>
                </li>
            </ul>
            <div class="on-rating" v-show="!ratings || !ratings.length">暂无评价</div>
        </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from 'components/star/star'
import {formatDate} from '../../common/js/date.js'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import axios from 'axios'

// 默认全部评价为2
const ALL = 2
// const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: [],
      showFoodFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  created () {
    // 请求商家数据
    // this.$http.get('/api/ratings').then(response => {
    //   // response为请求后得到的数据
    //   // get body data  成功请求时执行的
    //   response = response.body
    //   // 判断errno是不是等于0，即取到正确数据（看你自己设置的json数据格式判断）
    //   if (response.errno === ERR_OK) {
    //     this.ratings = response.data
    //     // 在nextTick中调用滑动实例化函数，就是异步请求完成了之后能够正确计算高度了
    //     this.$nextTick(() => {
    //       this.scroll = new BScroll(this.$refs.ratingsWrap, {
    //         click: true
    //       })
    //     })
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
      this.ratings = data.ratings
      // this.seller = data.seller
      console.log(this.ratings)
      // 在nextTick中调用滑动实例化函数，就是异步请求完成了之后能够正确计算高度了
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratingsWrap, {
          click: true
        })
      })
    }).catch((error) => { // 请求失败的回调函数
      console.log(error)
    })
  },
  components: {
    'v-star': star,
    'v-split': split,
    'v-ratingselect': ratingselect

  },
  filters: {
    // 默认第一个参数就是竖线前面的值
    formatdate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }

  },
  methods: {
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

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ratings-wrap{
    position: absolute;
    top:174px;
    bottom: 0;
    left: 0;
    widows: 100%;
    overflow: hidden;
}
.ratings-wrap .over-view{
    display: flex;
    padding: 18px 0;
}
.ratings-wrap .over-view .left{
    flex: 0 0 137px;
    width: 137px;
    padding: 6px 0;
    border-right: 1px solid rgba(7,17,27,0.1);
    text-align: center;

}
/*iPhone5屏幕宽度比较小，所以用媒体查询来设置宽度，这样右边样式不会错乱*/
@media only screen and (max-width: 320px){
        .ratings-wrap .over-view .left{
            flex: 0 0 110px;
            width: 110px;
        }

    }
.ratings-wrap .over-view .score{
    margin-bottom: 6px;
    line-height: 28px;
    font-size: 24px;
    color:rgb(255,253,0);
}
.ratings-wrap .over-view .title{
    margin-bottom: 8px;
    line-height: 12px;
    font-size: 12px;
    color:rgb(7,17,27);
}
.ratings-wrap .over-view .rank{

    line-height: 10px;
    font-size: 10px;
    color:rgb(147,153,159);
}
.ratings-wrap .over-view .right{
    flex: 1;
    padding:6px 0 6px 24px;
}

@media only screen and (max-width: 320px){
        .ratings-wrap .over-view .right{
            padding-left: 6px;
        }

    }

.ratings-wrap .over-view .right .score-wrap{
    margin-bottom: 8px;

}
.ratings-wrap .over-view .right .title{
    line-height:18px;
    font-size: 12px;
    color:rgb(7,17,27);
}
.ratings-wrap .over-view .right .star{
    margin: 0 12px;
    vertical-align: -2px;
}
.ratings-wrap .over-view .right .score{
    line-height:18px;
    font-size: 12px;
    color:rgb(255,153,0);
    vertical-align: -1px;
}
.ratings-wrap .over-view .right .delivery-time .time{
    margin-left: 12px;
    font-size: 12px;
    color:rgb(147,153,159);
}

.ratings-wrap .rating-detail-wrap{
    padding: 0 18px;
}
.ratings-wrap .rating-detail-wrap .rating-item{
    display: flex;
    padding: 18px 0;
}
.ratings-wrap .rating-detail-wrap .rating-item.border-1px::after{
    border-top:1px solid rgba(7,17,27,0.2);
}
.ratings-wrap .rating-detail-wrap .avatar{
    flex: 0 0 28px;
    width: 28px;
    margin-right: 12px;

}
.ratings-wrap .rating-detail-wrap .avatar>img{
    border-radius: 50%;
}
.ratings-wrap .rating-detail-wrap .content{
    flex: 1;
    position: relative;
}
.ratings-wrap .rating-detail-wrap .name{
    margin-bottom: 4px;
    line-height: 12px;
    font-size: 10px;
    color:rgb(7,17,27);
}
.ratings-wrap .rating-detail-wrap .star-wrap{
    margin-bottom: 6px;
}
.ratings-wrap .rating-detail-wrap .star{
    margin-right: 6px;
}
.ratings-wrap .rating-detail-wrap .delivery-time{
    line-height: 12px;
    font-size: 10px;
    color: rgb(147,153,159);
}
.ratings-wrap .rating-detail-wrap .text{
    margin-bottom: 8px;
    line-height: 18px;
    font-size: 12px;
    color:rgb(7,17,27);
}
.ratings-wrap .rating-detail-wrap .recommend{
    line-height: 16px;
    font-size: 9px;
}
.ratings-wrap .rating-detail-wrap .recommend .icon-thumb_up{
    display: inline-block;
    margin:0 8px 4px 0;
    font-size: 9px;
    color:rgb(0,160,220);

}
.ratings-wrap .rating-detail-wrap .recommend .text{
    display: inline-block;
    margin:0 8px 4px 0;
    padding: 0 6px;
    border:1px solid rgba(7,17,27,0.1);
    border-radius: 1px;
    font-size: 9px;
    color:rgb(147,153,159);
}

.ratings-wrap .rating-detail-wrap .time{
    position: absolute;
    top: 0;
    right: 0;
    line-height: 12px;
    font-size: 10px;
    color:rgb(147,153,159);
}
</style>
