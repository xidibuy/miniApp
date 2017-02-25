// pages/orderDetail/orderDetail.js
Page({
  data: {
    second: 3 * 60 * 60
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // countdown(this);
  },
  countdown: function (that) {
    let second = that.data.second;
    if (second == 0) {
      that.setData({
        second: "time out"
      });
      return
    }
    let time = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      countdown(that);
    }, 1000);
  },
  applyFun: function (e) {
    console.log(e);
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: '',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  }

})