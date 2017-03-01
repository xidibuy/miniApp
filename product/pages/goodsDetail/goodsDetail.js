const app = getApp();
const url = app.globalData.dataRemote;
// const url = app.globalData.data;
Page({
  data: {
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    amount: 1,
    show: [
      {
        showOne: true
      },
      {
        showTwo: false
      }
    ],
    scrollTop: 0,
    floorstatus: false,
    goodsDetail: {},
    // 颜色
    keyone: [],
    // 尺码
    keytwo: [],
    // 商品规格
    prodParams: [],
    // 推荐商品
    recommendList: [],
    // 当前颜色和尺码
    curColorAndsSize: []
  },
  onPullDownRefresh: function () {

  },

  changeSwiper: function (event) {
    this.setData({
      current: event.detail.current
    });
  },

  reduceNumber: function () {
    let amount = this.data.amount;
    amount > 1 && this.setData({ 'amount': amount - 1 });
  },

  addNumber: function () {
    let amount = this.data.amount + 1;
    this.setData({
      amount: amount
    });

  },

  onLoad: function (options) {
    const proUrl = url + "/detail?goodId=" + options.goodId + "&relateprodSn=" + options.relateprodSn;
    // const proUrl = url + "/goodsDetail.json"
    this.post(proUrl);
  },
  post: function (proUrl) {
    const _this = this;
    app.fetchApi(proUrl, function (res) {
      const resData = res.data;
      // 颜色
      const keyone = [];
      // 尺码
      const keytwo = [];
      // 商品规格
      const prodParams = [];
      // 推荐商品
      const recommendList = [];
      for (const a in resData.priceAttr[0].children) {
        keyone.push(a);
      };
      for (const a in resData.priceAttr[1].children) {
        keytwo.push(a);
      };
      for (const a in resData.prodParams) {
        prodParams.push(resData.prodParams[a]);
      };
      for (const a in resData.recommendList) {
        recommendList.push(resData.recommendList[a]);
      }
      // 设置库存数量
      // 取出当前的颜色和尺码
      const curCandS = resData.curColorAndsSize[0] + "_" + resData.curColorAndsSize[1];
      // 获取当前尺码颜色的综合信息
      console.log(resData.goodsList);
      for (const key in resData.goodsList) {
        if (curCandS == key) {
          console.log(resData.goodsList[curCandS]);
        }
      }
      _this.setData({
        goodsDetail: resData,
        keyone: keyone,
        keytwo: keytwo,
        prodParams: prodParams,
        recommendList: recommendList,
        curColorAndsSize: resData.curColorAndsSize
      });
    })
  },
  // 点击图片
  changeColor: function (event) {
    var _this = this;
    const color = event.target.dataset.color;
    const size = this.data.curColorAndsSize[1];
    const colorAndSize = color + "_" + size;
    for (const key in this.data.goodsDetail.map) {
      if (colorAndSize == key) {
        _this.changePro(_this.data.goodsDetail.map[colorAndSize]);
      }
    }
  },
  changeSize: function (event) {
    var _this = this;
    const size = event.target.dataset.size;
    const color = this.data.curColorAndsSize[0];
    const colorAndSize = color + "_" + size;
    for (const key in this.data.goodsDetail.map) {
      if (colorAndSize == key) {
        _this.changePro(_this.data.goodsDetail.map[colorAndSize]);
      }
    }
  },
  changePro: function (parme) {
    console.log(parme);
    var proUrl = url + "/detail?goodId=" + parme;
    this.post(proUrl);
  },














  // 分享单品页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/goodsDetail/goodsDetail'
    }
  },
  goTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 50) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  }
});