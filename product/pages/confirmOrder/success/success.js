const app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    wx.setStorageSync('aaa', [1,2,3]);
    console.log(wx.getStorageSync('aaa'))
  }
})