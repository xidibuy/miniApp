//app.js
let extend = require('./utils/util.js').extend;
let dataRemote = "https://wxapp.xidibuy.com/";
let imgRemote = "http://static.xidibuy.com/";
let getSessionUrl = dataRemote + 'weixin/session';
let getUidUrl = dataRemote + '/signup/register';

// 只有在发送请求是才校验session是否过期
// session 可能会过期 所以要注意 checkSession ，fail则重新请求
// 但是如果uid是固定的,不存在过期


App({
  onLaunch() {
    this.loginOnLaunch();
  },

  // 用户打开小程序
  loginOnLaunch() {
    let self = this;
    let actionFun = function () {
      let uid = wx.getStorageSync('uid');
      let userInfo = wx.getStorageSync('userInfo');
      //  如果uid 和userInfo 都在说明用户已登录
      if (uid && userInfo) {
        // 但是sessionKey可能已过期
        wx.login({
          success(res) {
            if (res.code) {
              let code = res.code;
              wx.showToast({
                title: '加载中',
                mask: true,
                icon: 'loading',
                duration: 10 * 1000
              });
              wx.request({
                url: getSessionUrl,
                data: {
                  code
                },
                method: 'POST',
                success(res) {
                  wx.hideToast();
                  if (res.data.code == 0) {
                    let sessionKey = res.data.data;
                    wx.setStorageSync('sessionKey', sessionKey);
                  } else {
                    console.log(res);
                  }
                }
              })
            }
          }
        })
      } else {
        // 未登录过，第一次登陆
        self.userLogin()
      }
    };
    self.netWorkState(actionFun)
  },

  globalData: {
    dataRemote,
    imgRemote
  },
  // 取数据 默认get
  // 如果检测到本地有uid 和 userInfo 就发送，没有就不
  fetchApi(url, callback) {
    let self = this;
    let actionFun = function () {
      let uid = wx.getStorageSync('uid');
      let userInfo = wx.getStorageSync('userInfo');
      let get = function (data) {
        wx.request({
          url,
          data: data,
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            if (res.statusCode == 200) {
              let obj = res.data;
              if (typeof res.data == "string") {
                obj = JSON.parse(obj.trim())
              }
              callback && callback(obj);
            }
          },
          fail(e) {
            console.error(url);
            console.error(e);
          }
        })
      };

      if (uid && userInfo) {
        // 发送之前检查session是否过期
        wx.checkSession({
          success() {
            let sessionKey = wx.getStorageSync('sessionKey');
            get({ uid, sessionKey });
          },
          fail() {
            // 过期了 重新登录 即重新获取session
            wx.login({
              success(res) {
                if (res.code) {
                  let code = res.code;
                  wx.request({
                    url: getSessionUrl,
                    data: {
                      code
                    },
                    method: 'POST',
                    success(res) {
                      if (res.data.code == 0) {
                        let sessionKey = res.data.data;
                        wx.setStorageSync('sessionKey', sessionKey);
                        get({ uid, sessionKey });
                      } else {
                        console.log(res);
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
    };
    self.netWorkState(actionFun, "", true)

  },

  // 传数据 默认post
  postApi(url, data, callback) {
    let self = this;
    let actionFun = function () {
      console.log(url, data);
      let uid = wx.getStorageSync('uid');
      let userInfo = wx.getStorageSync('userInfo');
      let userRejectTime = wx.getStorageSync('userRejectTime');
      let userRejectContent = function (t) {
        return '非常抱歉，暂时无法购买。请您' + t + '分钟后再次授权头像和昵称信息，然后进行购买操作。'
      };
      let reLoginContent = '提交订单需要获得您的公开信息（昵称、头像等）这些信息只用作本应用的用户信息，不会用于其他任何用途，谢谢。';
      let post = function () {
        let uid = wx.getStorageSync('uid');
        let sessionKey = wx.getStorageSync('sessionKey');
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
              let obj = res.data;
              if (typeof res.data == "string") {
                obj = JSON.parse(obj.trim())
              }
              callback && callback(obj);
            }
          },
          fail(e) {
            console.error(url);
            console.error(e);
          }
        })
      }

      // 先检查 uid userInfo是否存在
      if (uid && userInfo) {
        // 在检查session是否过期
        wx.checkSession({
          success() {
            post()
          },
          fail() {
            wx.login({
              success(res) {
                if (res.code) {
                  let code = res.code;
                  wx.request({
                    url: getSessionUrl,
                    data: {
                      code
                    },
                    method: 'POST',
                    success: function (res) {
                      if (res.data.code == 0) {
                        let sessionKey = res.data.data;
                        wx.setStorageSync('sessionKey', sessionKey);
                        post()
                      } else {
                        console.log(res);
                      }
                    }
                  })
                }
              }
            })
          }
        })

      } else {
        wx.hideToast()
        // 检查 userRejectTime是否存在
        if (userRejectTime) {
          let curTime = Date.now();
          let gapTime = curTime - userRejectTime;
          gapTime = gapTime / (1000 * 60);
          if (gapTime > 10) {
            wx.showModal({
              title: '',
              showCancel: false,
              content: reLoginContent,
              success(res) {
                if (res.confirm) {
                  wx.removeStorageSync('userRejectTime');
                  self.userLogin(post)
                }
              }
            });
          } else {
            wx.showModal({
              title: '',
              showCancel: false,
              content: userRejectContent(Math.ceil(10 - gapTime))
            });
          }
        } else {
          wx.showModal({
            title: '',
            showCancel: false,
            content: userRejectContent(10),
            success(res) {
              if (res.confirm) {
                wx.setStorageSync('userRejectTime', Date.now());
              }
            }
          });
        }
      }
    }
    self.netWorkState(actionFun, "", true)
  },

  // 用户登录
  userLogin(userLoginCallback) {
    let self = this;
    let actionFun = function () {
      let content = '如果未获取您的用户信息，可能会影响您接下来在小程序内的操作权限。这些信息只用作本应用的用户信息，不会用于其他任何用途，谢谢。';
      wx.login({
        success(res) {
          if (res.code) {
            let code = res.code;
            wx.request({
              url: getSessionUrl,
              data: {
                code
              },
              method: 'POST',
              success(res) {
                // get session success
                if (res.data.code == 0) {
                  let sessionKey = res.data.data;
                  wx.setStorageSync('sessionKey', sessionKey);
                  wx.getUserInfo({
                    // 用户允许
                    success(res) {
                      wx.setStorageSync('userInfo', res.userInfo);
                      wx.showToast({
                        title: '加载中',
                        icon: 'loading',
                        mask: true,
                        duration: 10 * 1000
                      });
                      // get uid
                      wx.request({
                        url: getUidUrl,
                        data: {
                          sessionKey,
                          encryptedData: res.encryptedData,
                          iv: res.iv
                        },
                        method: 'POST',
                        success(res) {
                          wx.hideToast();
                          if (typeof res.data == "string") {
                            if (res.data) {
                              console.log('用户注册成功！');
                              wx.setStorageSync('uid', res.data);
                              userLoginCallback && userLoginCallback();
                            } else {
                              console.log('注册失败')
                            }
                          } else {
                            if (res.data.code == 0) {
                              console.log('用户注册成功！');
                              wx.setStorageSync('uid', res.data.data.uid);
                              userLoginCallback && userLoginCallback();
                            } else {
                              console.log(res)
                            }
                          }
                        }
                      });
                    },
                    // 用户拒绝
                    fail(res) {
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
                  });
                } else {
                  console.log(res);
                }
              }
            })
          }
        }
      })
    };
    self.netWorkState(actionFun)
  },

  // onError(err) {
  //   console.log(err);
  //   wx.showModal({
  //     title: '错误提示',
  //     content: err,
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       }
  //     }
  //   })
  // },

  netWorkState(hasNetworkCallback, noNetworkCallback, showModal) {
    let self = this;
    wx.getNetworkType({
      success: function (res) {
        // 更改状态
        if (res.networkType === "none") {
          wx.hideToast();
          wx.setStorageSync('netWorkState', "none");
          // 无网络，是否弹窗
          if (showModal) {
            wx.showModal({
              title: '',
              content: '暂无可用网络',
              showCancel: false
            });
          }
        } else {
          wx.removeStorageSync('netWorkState');
          hasNetworkCallback && hasNetworkCallback()
        }

        // 设置当前页面
        noNetworkCallback && self.showNoNetworkPage(noNetworkCallback);
      }
    })
  },

  showNoNetworkPage(self) {
    let netWorkState = wx.getStorageSync('netWorkState');
    setTimeout(function () {
      self.setData({
        netWorkState
      })
    }, 100)
  },

  // 吸顶提示
  showTip(self, con) {
    self.setData({
      showTip: true,
      showTipWord: con
    });
    setTimeout(function () {
      self.setData({
        showTip: false,
        showTipWord: ''
      })
    }, 2000)
  },



  cutOffName(list) {
    let strLength = function (str) {
      if (str != '' && str != undefined) {
        let aMatch = str.match(/[^\x00-\x80]/g),
          strLen = (str.length + (!aMatch ? 0 : aMatch.length));
        return strLen;
      }
    };

    list.map(item => {
      let cur = item.consignee;
      let length = strLength(cur);
      let count = 0;
      let Index = 0;
      if (length <= 8) {
        item.consigneeCut = cur
      } else {
        let splitCur = cur.split('');
        splitCur.map((t, idx) => {
          count += strLength(t);
          if (count == 6 || count == 7) {
            Index = idx
          }
        });
        item.consigneeCut = splitCur.slice(0, Index + 1).join('') + "..."
      }
    })


    return list
  },

  // 把所有数字 转为 2.00格式
  tail(num) {
    num = String(Number(num));
    // 如果有小数点
    if (/\./g.test(num)) {
      // 3位以上小数
      if (num.length - num.indexOf('.') > 3) {
        let gap  = num.length - num.indexOf('.') - 3
        return num.slice(0, -gap)
      }
      // 2位以下小数
      else if (num.length - num.indexOf('.') < 3) {
        return String(num) + '0'
      }
      // 两位小数
      else if (num.length - num.indexOf('.') == 3) {
        return num
      }
    }
    // 如果没有小数点
    else {
      return num + '.00'
    }
  }
});



