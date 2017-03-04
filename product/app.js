//app.js

App({
  onLaunch() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    this.getUserInfo();
  },

  fetchApi(url, callback) {
    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      dataType: "json",
      success(res) {
        if (res.statusCode == 200) {
          callback(res.data);
        }
      },
      fail(e) {
        callback(e)
      }
    })
  },
  getUserInfo(cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      that.login();
    }
  },
  login: function () {
    var that = this;
    //调用登录接口
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        });
        if (res.code) {
          wx.request({
            url: that.globalData.dataRemote + 'weixin/session',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.code == 0) {
                console.log("微信登录态信息在喜地服务器的索引");
              } else {
                console.log(res.msg);
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    dataRemote: "https://wxapp.xidibuy.com/",
    img: "http://172.16.14.96:8888/image/",
    data: "http://172.16.14.96:8888/data/"
  }
})
