const app = getApp();
const img = app.globalData.img;
const url = app.globalData.data;
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
    ]
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
    var proUrl = url + "proDetail.json"
    app.fetchApi(proUrl, function (res) {

    })
    this.setData({
      id: options.id
    })
    console.log(this);
  },

  // 分享单品页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/goodsDetail/goodsDetail'
    }
  }
});