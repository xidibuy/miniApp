//获取应用实例
var app = getApp();
const img = app.globalData.img;
const url = app.globalData.data;
Page({
  data: {
    img: app.globalData.img,
    current: 0,
    imgUrls:
    [
      img + 'img-1.png',
      img + 'img-2.png'
    ],
    text: [
      '麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一',
      '贝意式烘焙,优质咖啡产地.百年品牌经典之作.'
    ],
    nums: 10,
    word: '麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一'
    // index:[]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
  },

  onLoad: function (options) {
    const _this = this;
    const indexUrl = url + '/index/home';
    // app.fetchApi(indexUrl, function (options) {
    //   _this.setData({
    //     index: options.data
    //   });
    //   console.log(index);
    // })
  },
  // 分享首页
  onShareAppMessage: function () {
    return {
      title: '分享',
      desc: "hellp",
      path: '/pages/index/index'
    }
  },
  currentPage: function (e) {
    let current = e.detail.current;
    this.setData({
      word: this.data.text[current]
    })
  },
  changePro: function (event) {
    this.setData({
      current: event.detail.current
    });
  }
})
