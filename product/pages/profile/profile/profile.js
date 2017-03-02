const app = getApp();
// const dataUrl = app.globalData.data;
const url = app.globalData.dataRemote;
Page({
  data: {
    contentType: "more",

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
        active: false
      }, {
        name: "收货地址",
        value: "adress",
        active: false
      }, {
        name: "更多设置",
        value: "more",
        active: true
      }
    ]
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    const orderUrl = dataUrl + 'order/order.json';
    app.fetchApi(orderUrl, function (options) {


    })

  },
  bindMenu(e) {

    // this.getProfile();
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
    const _this = this;
    // 订单列表请求
    const orderUrl = url + '';
    // this.post(orderUrl, function (res) {

    // });
    // 收货地址请求https://wxapp.xidibuy.com/address/list
    const adressUrl = url + 'address/list';
    this.post(adressUrl, function (res) {
      _this.setData({
        adress: res
      });
    });
    // 更多设置请求
    const moreUrl = url + '';
    // this.post(moreUrl, function (res) {

    // });
    console.log(app.globalData);
    _this.setData({
      more: app.globalData.userInfo
    });
  },
  post: function (postUrl, callback) {
    const _this = this;
    app.fetchApi(postUrl, function (res) {
      callback.length && callback(res.data);
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