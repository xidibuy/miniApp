//app.js
let extend = require('./utils/util.js').extend;

App({
  onLaunch() {
    this.loginOnLaunch();
  },

  // 取数据 默认get
  fetchApi(url, callback) {
    let self = this;
    let uid = wx.getStorageSync('uid');
    let userInfo = wx.getStorageSync('userInfo');
    let get = function (data) {
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
    };

    if (uid && userInfo) {
      wx.checkSession({
        success() {
          let sessionKey = wx.getStorageSync('sessionKey');
          get({ uid, sessionKey });
        },
        fail() {
          wx.login({
            success: function (res) {
              // get code success
              if (res.code) {
                let code = res.code;
                // get session
                wx.request({
                  url: self.globalData.dataRemote + 'weixin/session',
                  data: {
                    code
                  },
                  method: 'POST',
                  success(res) {
                    // get session success
                    if (res.data.code == 0) {
                      let sessionKey = res.data.data;
                      wx.setStorageSync('sessionKey', sessionKey);
                      get({ uid, sessionKey });
                    } else {
                      console.log(res.data.code, res.data.msg);
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      get({});
    }



  },

  // 传数据 默认post
  postApi(url, data, callback) {
    let self = this;
    let post = function (self) {
      let uid = wx.getStorageSync('uid');
      let userInfo = wx.getStorageSync('userInfo');
      let sessionKey = wx.getStorageSync('sessionKey');
      if (uid && userInfo) {
        data = extend({}, { uid, sessionKey }, data);
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
      } else {
        let content = function (time) {
          return '非常抱歉，暂时无法购买。请您' + time + '分钟后再次授权头像和昵称信息，然后进行购买操作。'
        };
        let userRejectTime = wx.getStorageSync('userRejectTime');
        if (userRejectTime) {
          let curTime = Date.now();
          let gapTime = curTime - userRejectTime;
          gapTime = gapTime / (1000 * 60);
          if (gapTime > 10) {
            wx.removeStorageSync('userRejectTime');
            self.login(content(10))
          } else {
            wx.showModal({
              title: '',
              showCancel: false,
              content: content(Math.ceil(gapTime))
            });
          }
        } else {
          wx.showModal({
            title: '',
            showCancel: false,
            content: content(10),
            success(res) {
              if (res.confirm) {
                wx.setStorageSync('userRejectTime', Date.now());
              }
            }
          });
        }
      }
    }
    wx.checkSession({
      success() {
        post(self)
      },
      fail() {
        wx.login({
          success: function (res) {
            // get code success
            if (res.code) {
              let code = res.code;
              // get session
              wx.request({
                url: self.globalData.dataRemote + 'weixin/session',
                data: {
                  code
                },
                method: 'POST',
                success: function (res) {
                  // get session success
                  if (res.data.code == 0) {
                    let sessionKey = res.data.data;
                    wx.setStorageSync('sessionKey', sessionKey);
                  } else {
                    console.log(res.data.code, res.data.msg);
                  }
                }
              })
            }
          }
        })
      }
    })



  },
  // postApi(url, data, callback) {
  //   let self = this;
  //    wx.request({
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
  // },


  // 登录
  login(content) {
    let app = this;
    // get code
    wx.login({
      success: function (res) {
        // get code success
        if (res.code) {
          let code = res.code;
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
                let sessionKey = res.data.data;
                wx.setStorageSync('sessionKey', sessionKey);
                app.getUserInfo(sessionKey);
              } else {
                console.log(res.data.code, res.data.msg);
              }
            }
          })
        }
      }
    })
  },

  getUserInfo(sessionKey) {
    wx.getUserInfo({
      // 用户允许
      success: function (res) {
        // console.log(res.userInfo);
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
            if (typeof res.data == "string") {
              if (res.data) {
                console.log('用户注册成功！');
                wx.setStorageSync('uid', res.data);
              } else {
                console.log('注册失败')
              }

            } else {
              if (res.data.code == 0) {
                console.log('用户注册成功！');
                wx.setStorageSync('uid', res.data.data.uid);
              } else {
                console.log(res.data.msg)
              }
            }


          }
        })
      },
      // 用户拒绝
      fail: function (res) {
        let userRejectTime = wx.getStorageSync('userRejectTime');
        if (userRejectTime) {
          // let nowContent = function (time) {
          //   return '非常抱歉，暂时无法购买。请您' + time + '分钟后再次授权头像和昵称信息，然后进行购买操作。'
          // };
          // let curTime = Date.now();
          // let gapTime = curTime - userRejectTime;
          // gapTime = gapTime / (1000 * 60);
          // content = nowContent(Math.ceil(gapTime))
        } else {
          wx.showModal({
            title: '',
            showCancel: false,
            content,
            success(res) {
              if (res.confirm) {
                wx.setStorageSync('userRejectTime', Date.now())
              }
            }
          });

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
    dataRemote: "https://wxapp.xidibuy.com/",
    imgRemote: "http://static.xidibuy.com/"
  }
})
