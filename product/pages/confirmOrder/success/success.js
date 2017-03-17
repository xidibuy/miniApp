const app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    let self = this;
    let orderId = options.orderId;

    let url = app.globalData.dataRemote + 'order/payDone?orderId=' + orderId;
    wx.showToast({
      title: '加载中',
      mask: true,
      icon: 'loading',
      duration: 10 * 1000
    });
    app.fetchApi(url, function (res) {
      wx.hideToast();
      if (res.code == 0) {
        self.setData(res.data);
      } else {
        app.showTip(self, res.msg)
      }
    })
  }
})