const HEIGHT_CART = 51;
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
    scrollViewHeight: '100%',
    showBottom: false,
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
    let amount = +this.data.amount + 1;
    this.setData({
      amount: amount
    });
  },

  inputHandle: function(e) {
    let val = e.detail.value.trim(),
        valSet;

    // val 只能为空或者正整数
    if (val == 0) val = '';
    if (val == '' || /^[1-9][0-9]*$/.test(val)) {
      valSet = val;
    } else {
      valSet = this.data.amount; 
    }
    this.setData({
      amount: valSet
    });
  },

  completeInput: function(e) {
    if (e.detail.value == '') {
      this.setData({
        amount: 1
      });
    }
  },

  toggleScrollTopButton: function(event) {
    console.log(event);
  },

  loadMoreDetail: function() {
    console.log('11');
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
      scrollViewHeight: res.windowHeight - HEIGHT_CART
    });
  }

});