// pages/confirmOrder/way/way.js
Page({
  data:{
    mentioningAddress: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  chooseNormalEvent(){
    this.setData({
      mentioningAddress: 0
    })
  },
  chooseSelfEvent(){
    this.setData({
      mentioningAddress:1
    })
  },
  confirmEvent(){
    wx.setStorage({
      key: 'wayToOrderTemp',
      data: this.data.mentioningAddress,
      success: function(res){
        wx.navigateTo({
          url: '/pages/confirmOrder/index/index'
        })
      }
    })
  }
})