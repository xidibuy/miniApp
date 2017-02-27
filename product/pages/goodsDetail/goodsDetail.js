const app = getApp();
const img = app.globalData.img;
const url = app.globalData.dataRemote;
// const url = app.globalData.data;
Page({
  data: {

    img: app.globalData.img,
    imgUrls: [
      'http://static.googleadsserving.cn/pagead/imgad?id=CICAgKDL7vug_QEQrAIY-gEyCMf9cboyr_yJ',
      img + '/img-demo-1.png',
      img + '/img-demo-1.png'
    ],
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
    priceAttr: []
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
    var _this = this;
    var proUrl = url + "/detail?goodId=" + options.goodId + "&relateprodSn=" + options.relateprodSn;
    // const proUrl = url + "/goodsDetail.json"
    app.fetchApi(proUrl, function (res) {
      for(const a in res.data.priceAttr){
          console.log(a);
      }


      _this.setData({
        goodsDetail: res.data,
        priceAttr: res.data.priceAttr
      });
    })
  },

  // 分享单品页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/goodsDetail/goodsDetail'
    }
  },
  goTop: function () {
    console.log("2");
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