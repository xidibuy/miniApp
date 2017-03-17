// pages/confirmOrder/way/way.js
Page({
  data: {
    mentioningAddress: 0
  },
  onLoad: function (options) {
    let self = this;
    let obj = wx.getStorageSync('from_order_to_way_temp');
    wx.removeStorageSync('from_order_to_way_temp');
    self.setData({
      freeCondition: obj.freeCondition,
      goodsShippingFee: obj.goodsShippingFee,
      mentioningAddress: obj.type
    })
  },
  chooseNormalEvent() {
    this.setData({
      mentioningAddress: 0
    })
  },
  chooseSelfEvent() {
    this.setData({
      mentioningAddress: 1
    })
  },
  confirmEvent() {
    wx.setStorage({
      key: 'wayToOrderTemp',
      data: this.data.mentioningAddress,
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})