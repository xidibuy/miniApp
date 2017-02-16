const app = getApp()
let name = 'top' // 菜单默认值
let flag = true // 用于判断是否加载的默认菜单
const img = app.globalData.img;
const dataUrl = app.globalData.data;
Page({
  data: {
    // 判断loading
    hidden: true,
    // 订单列表
    orders: [
      {
        time:"2017/02/19",
        state:"待发货",
        pros:[
          {
            imgUrl:img+"img-3_03.png",
            name:"丹麦的创意无褶皱垃圾桶宠爱酒鬼的",
            attr:"白色",
            price:"168.22",
            num:1
          },
          {
            imgUrl:img+"img-cup.png",
            name:"超级大的敖包束带结发开始干快递费",
            attr:"大红",
            price:"168.22",
            num:2
          }
        ],
        totalNum:10,
        totalMoney:1222,
        freight:10
      }
    ],
    //收货地址
    adress:[],
    //more
    more:[],
    
    flag: 1,
    menu: [
      {
        name: "我的订单",
        value: "order",
        active: true
      }, {
        name: "收货地址",
        value: "delivery",
        active: false
      }, {
        name: "更多设置",
        value: "more",
        active: false
      }
    ]
  },
  bindMenu (e) {
    name = e.target.dataset.name // 获取当前点击的menu值

    const newMenu = this.data.menu.map((arr, index) => {
      if (arr.value === name) {
        arr.active = true
      } else {
        arr.active = false
      }
      return arr
    })

    this.setData({menu: newMenu})
    this.getOrders(name)
  },
  onLoad: function (options) {
    this.getOrders(name)
  },
 
  getOrders(name) {
    const that = this

    that.setData({hidden: false}) //显示loading
    flag = name === 'top'
      ? 1
      : 0

    // 获取新闻列表
    wx.request({
      url: dataUrl/order.json,
      data: {
        type: name,
        key: app.globalData.appkey
      },
      success(res) {
        if (!res.data.error_code) {
          let data = res.data.result.data
          let title = flag
            ? data[0].type
            : data[0].category
          wx.setNavigationBarTitle({title: title})
          that.setData({orders: data, hidden: true, flag: flag})
          console.log(res.data)
        }
      }
    })
  }
})