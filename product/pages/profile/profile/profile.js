const app = getApp();
// const dataUrl = app.globalData.data;
const url = app.globalData.dataRemote;
// 订单列表请求
const orderUrl = url + 'order/list';
// 收货地址请求
const adressUrl = url + 'address/list';
let timmer;
Page({
  data: {
    contentType: "order",

    //我的订单
    orders: [],

    //收货地址
    adress: [],

    //more
    more: {},
    menu: [
      {
        name: "我的订单",
        value: "order",
        active: true
      }, {
        name: "收货地址",
        value: "adress",
        active: false
      }, {
        name: "更多设置",
        value: "more",
        active: false
      }
    ],
    // 连续加载
    page: 1,
    tipShow: true,
  },
  onShow() {
    this.reloadTapEvent();
    this.setData({
      page: 1,
      freshNone: true,
      tipShow: true
    });
  },
  post: function (postUrl, callback) {
    const _this = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    })
    app.postApi(postUrl, {}, function (res) {
      if (res.code == 0) {
        wx.hideToast();
        callback.length && callback(res);
      } else {
        app.showTip(_this, res.msg);
      }
    })
  },
  reloadTapEvent() {
    app.netWorkState(this.refreshCurrentPage, this, true);
  },
  refreshCurrentPage: function () {
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    _this.setData({
      more: userInfo
    });
    // 初始化订单详情
    _this.post(orderUrl + '?page=1', function (res) {
      _this.dealOrder(res);
    });
    _this.post(adressUrl, function (res) {
      _this.dealAdress(res);
    });
  },

  bindMenu(e) {
    const _this = this;
    let name = e.target.dataset.name; // 获取当前点击的menu值
    const newMenu = _this.data.menu.map((arr, index) => {
      if (arr.value === name) {
        arr.active = true;
      } else {
        arr.active = false
      }
      return arr;
    });
    if (name == 'order') {
      _this.post(orderUrl + '?page=1', function (res) {
        _this.dealOrder(res);
      });
    };
    if (name == 'adress') {
      _this.post(adressUrl, function (res) {
        _this.dealAdress(res);
      });
    };
    if (name == 'more') {
      wx.hideToast();
    };
    _this.setData({
      menu: newMenu,
      contentType: name
    });
  },
  formatTime: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  dealAdress: function (gRes) {
    let _this = this;
    let adressList = gRes.data;
    //处理收货人名过长
    adressList = app.cutOffName(adressList);
    _this.setData({
      adress: adressList,
    });
    if (gRes.data.length > 0) {
      _this.setData({
        adressNull: true
      });
    } else {
      _this.setData({
        adressNull: false
      });
    }
  },

  // 处理订单数据
  dealOrder: function (gRes) {
    let _this = this;
    if (gRes.data.length > 0) {
      // 处理时间戳
      for (let i = 0; i < gRes.data.length; i++) {
        gRes.data[i].orderTime = _this.formatTime(gRes.data[i].orderTime);
      }
      _this.setData({
        orders: gRes.data,
        noOrder: true
      });
    } else {
      _this.setData({
        orders: gRes.data,
        noOrder: false
      });
    }
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
              _this.refreshCurrentPage();
            } else {
              wx.showModal({
                title: '提示',
                content: res.msg
              })
            }
          });
        }
      }
    })
  },
  // 立即支付
  pay: function (e) {
    let _this = this;
    let orderId = e.currentTarget.dataset.orderparentid;
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
              app.showTip(_this, respon.errMsg)
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
      } else {
        app.showTip(_this, res.msg);
      }
    });
  },
  // 编辑地址
  goToEditAdressEvent(e) {
    let self = this;

    // 存储要编辑的地址信息
    let idx = e.currentTarget.dataset.index;
    let editAdressTemp = self.data.adress[idx];
    wx.setStorageSync('editAdressTemp', editAdressTemp);
    wx.navigateTo({
      url: '/pages/profile/address/edit/edit'
    })
  },
  // 新增地址
  goToAddAddressEvent() {
    wx.navigateTo({
      url: '/pages/profile/address/edit/edit'
    })
  },
  // 进入详情页
  orderSingle(e) {
    let infolink = e.currentTarget.dataset.infolink;
    wx.navigateTo({
      url: '/pages/profile/order/orderDetail/orderDetail?' + infolink
    })
  },
  // 触底加载20条
  onReachBottom: function (options) {
    let _this = this;
    if (_this.data.contentType == 'order' && (_this.data.orders.length) > 0) {
      // 200条的限制,请求无结果
      if (_this.data.page < 10) {
        // freshNone 请求无数据之后怎不在请求
        if (_this.data.freshNone == true) {
          let pageNew = _this.data.page + 1;
          let addOrderUrl = orderUrl + '?page=' + pageNew;
          if (pageNew != _this.data.page) {
            timmer && clearInterval(timmer);
            timmer = setTimeout(function(){
            _this.post(addOrderUrl, function (res) {
              _this.setData({
                page: pageNew
              });
              if (res.data.length > 0) {
                // 处理时间戳
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].orderTime = _this.formatTime(res.data[i].orderTime);
                }
                _this.setData({
                  orders: _this.data.orders.concat(res.data),
                });
              } else {
                _this.setData({
                  noOrder: true,
                  freshNone: false
                });
              }
            });
            },1000)
          }
        }
      } else {
        _this.setData({
          tipShow: false
        });
      }
    }
  },
})