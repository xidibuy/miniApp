const app = getApp();
const dataUrl = app.globalData.data;
Page({
  data: {
    contentType: "order",

    //我的订单
    orders: [],

    //收货地址
    adress: [],

    //more
    more: [],

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
    ]
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    const orderUrl = dataUrl + '/order/order.json';
    app.fetchApi(orderUrl, function (options) {


    })

  },
  bindMenu(e) {

    this.getProfile();
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
  onLoad: function (options) {
    this.getProfile();
  },
  getProfile: function () {
    const _this = this;
    // profile,不为空
    const cartUrl = dataUrl + '/profile/profile.json';
    // profile,为空
    // const cartUrl = dataUrl + '/profile/profileNone.json';

    app.fetchApi(cartUrl, function (options) {

      _this.setData({
        orders: options.data.orders,
        adress: options.data.adress
      });
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