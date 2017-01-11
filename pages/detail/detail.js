Page({
   data: {
    imgUrls: [
      'http://static.googleadsserving.cn/pagead/imgad?id=CICAgKDL7vug_QEQrAIY-gEyCMf9cboyr_yJ',
      'https://img.alicdn.com/tps/TB1CyNwPXXXXXXlXVXXXXXXXXXX-520-280.jpg_.webp',
      'http://gw.alicdn.com/imgextra/i2/90913538/TB25SCAXZgb61BjSspjXXbhRVXa_!!90913538.jpg_760x760q50s150.jpg_.webp'
    ],
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    amount: 1,
    scrollViewHeight: '100%'
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

  toggleScrollTopButton: function(event) {
    console.log(event);
  },

  previewContentImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.imgUrls
    });
  },

  onLoad: function(options) {
    var res = wx.getSystemInfoSync();
    this.setData({
      id: options.id,
      scrollViewHeight: res.windowHeight - 50
    });
   
  }
});