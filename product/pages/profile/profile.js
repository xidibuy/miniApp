const app = getApp()
let tab = 'order' // 菜单默认值
let flag = true // 用于判断是否加载的默认菜单
const img = app.globalData.img;
const dataUrl = app.globalData.data;
Page({
  data: {
    img: app.globalData.img,
    // 判断loading
    hidden: true,
    // 订单列表
    orders: [],
    //收货地址
    adress: [],
    //more
    more: [],
    contentType: tab,
    flag: 1,
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
  onPullDownRefresh: function () {

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
  onLoad: function (options) {
    this.getOrders(tab);
  },
  getOrders: function (name) {
    const _this = this;
    // 我的订单,不为空
    // const cartUrl = dataUrl + '/order/order.json';
       // 我的订单,为空
    const cartUrl = dataUrl + '/order/orderNone.json';
    app.fetchApi(cartUrl, function (options) {
      console.log(options.data.orders);
      _this.setData({
        orders: options.data.orders,
        menu: options.data.menu
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