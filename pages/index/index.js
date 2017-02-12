//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
   imgUrls:
     [
    '/image/img-1.png',
     '/image/img-2.png'
     ],
     text:[
       '麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一',
       '贝意式烘焙,优质咖啡产地.百年品牌经典之作.'
     ],
     nums:10,
     word:'麦卢卡蜂蜜被誉为"新西兰的国宝", 是世界上最好的蜂蜜之一'
  },
  //事件处理函数
  bindViewTap: function() {
      wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    });
  },
  currentPage: function(e) {
    var current = e.detail.current;
     this.setData({
      word: this.data.text[current]
    })
  },
  onLoad: function () {
    console.log('index onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
