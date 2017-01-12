//app.js
import ft from './utils/util';
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    console.log('mini app onLaunch');
    this.debugPage('/pages/topic/topic?id=123123');
  },
  onShow: function() {
    console.log('mini app onShow');
  },
  debugPage: function(page) {
    if (page) {
      // 方便测试内页
      wx.navigateTo({
        url: page
      });
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
