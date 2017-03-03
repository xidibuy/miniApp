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
    page: 1,
    tipShow: false
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
    if (_this.data.page < 20) {
      page = _this.data.page + 1;
      let addOrderUrl = orderUrl + '?page=' + page;
      _this.post(orderUrl + addOrderUrl, function (res) {
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
    // 处理时间戳
    for (let i = 0; i < gRes.length; i++) {
      gRes[i].orderTime = _this.formatTime(gRes[i].orderTime);
    }
    this.setData({
      orders: gRes
    });
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
    _this.setData({
      more: app.globalData.userInfo
    });
  },
  post: function (postUrl, callback) {
    const _this = this;
    app.fetchApi(postUrl, function (res) {
      try {
        callback.length && callback(res.data);
      } catch (e) {
        console.log(e);
      }

    })
  },
  sureModal: function (e) {
    var _this = this;
    const id = _this.data.orders.map((arr, index) => {
      if (arr.id === e.target.dataset.id) {
        wx.showModal({
          content: arr.content,
          success: function (res) {
            if (res.confirm) {
              // 跳转
            }
          }
        });
      }
    })
  }
})