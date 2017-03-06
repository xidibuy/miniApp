//app.js
let extend = require('./utils/util.js').extend;

App({
  onLaunch() {
    // this.loginOnLaunch();
    // this.getUserInfo();
  },

  // 取数据 默认get
  fetchApi(url, callback) {
    wx.request({
      url,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode == 200) {
          callback(res.data);
        }
      },
      fail(e) {
        console.error(url);
        console.error(e);
      }
    })
  },

  // 传数据 默认post
  // postApi(url, data, callback) {
  //   let self = this;
  //   let content = '非常抱歉，暂时无法购买。请您10分钟后再次授权头像和昵称信息，然后进行购买操作。'
  //   let uid = wx.getStorageSync('uid');
  //   let userInfo = wx.getStorageSync('userInfo');
  //   if (uid && userInfo) {
  //     data = extend({}, { uid }, data);
  //     wx.request({
  //       url,
  //       data,
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       method: 'POST',
  //       success(res) {
  //         if (res.statusCode == 200) {
  //           callback(res.data);
  //         }
  //       },
  //       fail(e) {
  //         console.error(url);
  //         console.error(e);
  //       }
  //     })
  //   } else {
  //     self.login(content)
  //   }
  // },
  postApi(url, data, callback) {
    let self = this;
     wx.request({
        url,
        data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success(res) {
          if (res.statusCode == 200) {
            callback(res.data);
          }
        },
        fail(e) {
          console.error(url);
          console.error(e);
        }
      })
  },


  // 登录
  login(content) {
    let app = this;
    // get code
    wx.login({
      success: function (res) {
        // get code success
        if (res.code) {
          let code = res.code;
          let sessionKey = '';
          // get session
          wx.request({
            url: app.globalData.dataRemote + 'weixin/session',
            data: {
              code
            },
            method: 'POST',
            success: function (res) {
              // get session success
              if (res.data.code == 0) {
                sessionKey = res.data.data;
                // get userInfo
                wx.getUserInfo({
                  // 用户允许
                  success: function (res) {
                    console.log(res.userInfo);
                    wx.setStorageSync('userInfo', res.userInfo);
                    // get uid
                    wx.request({
                      url: app.globalData.dataRemote + 'signup/register',
                      data: {
                        sessionKey,
                        encryptedData: res.encryptedData,
                        iv: res.iv
                      },
                      method: 'POST',
                      // get uid success
                      success: function (res) {
                        // register
                        if (res.data.code == 0) {
                          console.log('用户注册成功！')
                          // wx.setStorageSync('uid', res.data.data)
                          wx.setStorageSync('uid', '111')
                        } else {
                          console.log(res.data.msg)
                        }
                      }
                    })
                  },
                  // 用户拒绝
                  fail: function (res) {
                    wx.showModal({
                      title: '',
                      showCancel: false,
                      content,
                      success(res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    });
                    wx.setStorageSync('userRejectTime', Date.now())
                  }
                })
              }
            }
          })
        }
      }
    })
  },


  // 用户打开小程序
  loginOnLaunch() {
    let self = this;
    let content = '如果未获取您的用户信息，可能会影响您接下来在小程序内的操作权限。这些信息只用作本应用的用户信息，不会用于其他任何用途，谢谢。';
    let uid = wx.getStorageSync('uid');
    let userInfo = wx.getStorageSync('userInfo');
    if (uid && userInfo) {

    } else {
      self.login(content)
    }
  },

  globalData: {
    dataRemote: "https://wxapp.xidibuy.com/"
  }
})
