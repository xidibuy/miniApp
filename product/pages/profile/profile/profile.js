const app = getApp();
// const dataUrl = app.globalData.data;
const url = app.globalData.dataRemote;
// 订单列表请求
const orderUrl = url + 'order/list';
// 收货地址请求
const adressUrl = url + 'address/list';

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
    // 是否显示无数据提示语
    tipShow: false,
    // 请求返回无数据,显示提示语
    noOrder: true
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    let _this = this;
    _this.post(orderUrl, function (res) {
      _this.dealOrder(res);
    });
  },
  // 触底加载20条
  onReachBottom: function (options) {
    let _this = this;
    let page;
    if (_this.data.contentType == 'order') {
      // 200条的限制,请求无结果
      if (_this.data.orders.length <= 20 && _this.data.noOrder == true) {
        page = _this.data.page + 1;
        let addOrderUrl = orderUrl + '?page=' + page;
        _this.post(addOrderUrl, function (res) {
          _this.dealOrder(res);
          _this.setData({
            page: page
          });
        });
      } else {
        _this.setData({
          tipShow: true
        });
      }
    }


  },
  bindMenu(e) {
    name = e.target.dataset.name // 获取当前点击的menu值
    const newMenu = this.data.menu.map((arr, index) => {
      if (arr.value === name) {
        arr.active = true;
      } else {
        arr.active = false
      }
      return arr;
    })
    this.setData({
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
  // 处理订单数据
  dealOrder: function (gRes) {
    let _this = this;
    if (gRes.length > 0) {
      // 处理时间戳
      for (let i = 0; i < gRes.length; i++) {
        gRes[i].orderTime = _this.formatTime(gRes[i].orderTime);
      }
      this.setData({
        orders: _this.data.orders.concat(gRes)
      });
    } else {
      _this.setData({
        tipShow: true,
        noOrder: false
      });
    }
  },
  onLoad: function (options) {
    const _this = this;
    this.post(orderUrl + '?page=1', function (res) {
      _this.dealOrder(res);
    });

    this.post(adressUrl, function (res) {
      _this.setData({
        adress: res
      });
    });
    let userInfo = wx.getStorageSync('userInfo');
    _this.setData({
      more: userInfo
    });
  },
  post: function (postUrl, callback) {
    const _this = this;
    app.fetchApi(postUrl, function (res) {
      if (res.code == 0) {
        try {
          callback.length && callback(res.data);
        } catch (e) {
          console.log(e);
        }
      }
    })
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

            } else if (res.code == -10207) {
              wx.showModal({
                title: '提示',
                content: res.msg,
                success: function (res) {
                  if (res.confirm) {}
                }
              })
            }
          });
        }
      }
    })

  },
  // 再次购买
  buyAgain: function (e) {
    var _this = this;
    let orderParentId = e.currentTarget.dataset.orderparentid;
    app.fetchApi(url + 'order/buyAgain?orderId=' + orderParentId, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: '再次购买成功',
          icon: 'success',
          duration: 2000
        })
      } else if (res.code == -10207) {
        wx.showModal({
          title: '提示',
          content: res.msg,
          success: function (res) {
            if (res.confirm) {}
          }
        })
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

    // 跳转
    wx.navigateTo({
      url: '/pages/profile/address/edit/edit'
    })
  },
  // 新增地址
  goToAddAddressEvent() {

    // 跳转
    wx.navigateTo({
      url: '/pages/profile/address/edit/edit'
    })
  },
  orderSingle(e) {
    let orderparentid = e.currentTarget.dataset.orderparentid;
    // 跳转
    wx.navigateTo({
      url: '/pages/profile/order/orderDetail/orderDetail?orderId=' + orderparentid,
      success: function (res) {
        console.log("数据成功");
      },
      fail: function (res) {
        console.log("数据失败");
      }
    })
  }
})