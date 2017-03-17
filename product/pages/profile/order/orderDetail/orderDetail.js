//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
let timeer;
Page({
  data: {
    second: 3 * 60 * 60,
    orderDetail: {},
    time: '',
    hide: false
  },
  onLoad: function (options) {
    let _this = this;
    if (wx.getStorageSync('optionsorder')) {
      wx.removeStorageSync('optionsorder');
    }
    let optionsorder = wx.setStorageSync('optionsorder', options);
  },
  onShow: function () {
    this.reloadTapEvent();
  },

  reloadTapEvent() {
    app.netWorkState(this.refreshCurrentPage, this, true);
  },
  refreshCurrentPage: function () {
    let _this = this;
    let optionsorder = wx.getStorageSync('optionsorder');
    let opt = Object.keys(optionsorder);
    let str = '';
    let strnow = '';
    opt.map(function (item, index) {
      if (index == (opt.length - 1)) {
        strnow = item + '=' + optionsorder[item];
      } else {
        strnow = item + '=' + optionsorder[item] + '&';
      }
      str += strnow;
    })

    const deUrl = url + 'order/info?' + str;
    this.post(deUrl, function (res) {
      _this.setData({
        hide: true,
      })
      // 处理时间戳
      if (res.basic.pinfo.orderStatus == 0 || res.basic.pinfo.orderStatus == 11) {
        _this.setData({
          orderDetail: res,
          status: res.basic.pinfo.orderStatus,
          orderId: optionsorder.orderId
        });
      } else {
        // 冻结状态下 status: 13表示冻结
        if (res.subOrderList[0].isFreeze == 2) {
          _this.setData({
            orderDetail: res,
            status: 13,
            orderId: res.subOrderList[0].orderSn
          });
        } else {
          _this.setData({
            orderDetail: res,
            status: res.subOrderList[0].orderStatus,
            orderId: res.subOrderList[0].orderSn
          });
        }

      }
      if (res.basic.pinfo.leftTime != 0) {
        _this.countTime(res.basic.pinfo.leftTime);
      }
    });
  },
  countTime: function (time) {
    let _this = this;
    timeer && clearInterval(timeer);
    timeer = setInterval(function () {
      if (time < 0) {
        if (timeer) {
          clearInterval(timeer);
        }
        return false;
      } else if (time == 0) {
        clearInterval(timeer);
        _this.onShow();
      } else {
        let hour = Math.floor(time / 3600)
        let minute = Math.floor((time - hour * 3600) / 60) < 10 ? ('0' + Math.floor((time - hour * 3600) / 60)) : (Math.floor((time - hour * 3600) / 60));
        let second = Math.floor(time - hour * 3600 - minute * 60) < 10 ? ('0' + Math.floor(time - hour * 3600 - minute * 60)) : (Math.floor(time - hour * 3600 - minute * 60));
        let nowTime;
        // 拼接字符创
        if (hour < 0) {
          if (Math.abs(minute) == 0) {
            if (Math.abs(second) == 0) {

            } else {
              nowTime = second + '秒';
            }
          } else {
            nowTime = minute + '分钟' + second + '秒';
          }
        } else {
          nowTime = hour + '小时' + minute + '分钟' + second + '秒';
        }
        // 设置time
        _this.setData({
          time: nowTime
        })
        time--;
      }
    }, 1000)
  },
  post: function (deUrl, callback) {
    app.postApi(deUrl, {}, function (res) {
      callback && callback(res.data);
    });
  },
  // 再次购买
  buyAgain: function (e) {
    var _this = this;
    let orderParentId = e.currentTarget.dataset.orderparentid;
    app.postApi(url + 'order/buyAgain?orderId=' + orderParentId, {}, function (res) {

      if (res.code == 0) {
        wx.showToast({
          title: '再次购买成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            wx.switchTab({
              url: '/pages/cart/cart/cart'
            })
          }
        })
      } else if (res.code == -10207) {
        _this.showTip(res.msg);
      }
    });
  },
  // 确认收货,先弹窗
  sureModal: function (e) {
    var _this = this;
    let orderSn = e.currentTarget.dataset.ordersn;
    wx.showModal({
      content: '确认已收到货吗?',
      success: function (res) {
        if (res.confirm) {
          app.fetchApi(url + 'order/received?orderId=' + orderSn, function (res) {
            if (res.code == 0) {
              _this.onShow();
            } else if (res.code == -10207) {
              wx.showModal({
                title: '提示',
                content: res.msg,
                success: function (res) {
                  if (res.confirm) { }
                }
              })
            }
          });
        }
      }
    })

  },
  // 立即支付
  pay: function () {
    let _this = this;
    let orderId = _this.data.orderId;
    app.postApi(app.globalData.dataRemote + 'weixin/orderinfo', {
      orderId
    }, function (resp) {
      wx.hideToast();
      if (resp.code == 0) {
        let payData = resp.data;
        wx.requestPayment({
          'timeStamp': payData.timeStamp,
          'nonceStr': payData.nonceStr,
          'package': payData.package,
          'signType': payData.signType,
          'paySign': payData.paySign,
          'success': function (respon) {
            wx.redirectTo({
              url: '/pages/confirmOrder/success/success?orderId=' + orderId
            })
          },
          'fail': function (respon) {
            //取消支付 跳转到订单详情页
            if (respon.errMsg != "requestPayment:fail cancel") {
              app.showTip(self, respon.errMsg)
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: resp.msg
        })
      }
    });
  }
})