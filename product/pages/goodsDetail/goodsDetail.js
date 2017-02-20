const app = getApp();
const img = app.globalData.img;
Page({
   data: {
    img : app.globalData.img,
    imgUrls: [
      'http://static.googleadsserving.cn/pagead/imgad?id=CICAgKDL7vug_QEQrAIY-gEyCMf9cboyr_yJ',
      img+'/img-demo-1.png',
      img+'/img-demo-1.png'
    ],
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    amount: 1
  },
  changeSwiper: function(event) {
    this.setData({
      current: event.detail.current
    });
  },

  reduceNumber: function() {
    let amount = this.data.amount;
    amount > 1 && this.setData({'amount': amount-1});
  },

  addNumber: function() {
    let amount = this.data.amount + 1;
    this.setData({
      amount: amount
    });
  },

  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  }
});