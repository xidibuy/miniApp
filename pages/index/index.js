//获取应用实例
var app = getApp();
const img = app.globalData.img;

Page({
  data: {
    img: app.globalData.img,
    imgUrls:
    [
      img + 'img-1.png',
      img + 'img-2.png'
    ],
    text: [
      '麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一',
      '贝意式烘焙,优质咖啡产地.百年品牌经典之作.'
    ],
    spot: [

    ],
    nums: 10,
    word: '麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
  },
  currentPage: function (e) {
    let current = e.detail.current;
    this.setData({
      word: this.data.text[current]
    })
  },
  onLoad: function (options) {
    let that = this;
    let i;
    let spotMake = [];
    const len = this.data.imgUrls.length;

    this.setData({
      
    })
  },
  // 分享首页
  onShareAppMessage: function () {
    return {
      title: '分享',
      desc: "hellp",
      path: '/pages/index/index'
    }
  },
  changePro: function (e) {
    console.log(e.detail);
  }
})
