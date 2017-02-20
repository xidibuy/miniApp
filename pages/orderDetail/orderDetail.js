// pages/orderDetail/orderDetail.js
Page({
  data:{
    second:3*60*60
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // countdown(this);
  },
  countdown: function(that){
    let second = that.data.second;
    if(second == 0){
      that.setData({
        second:"time out"
      });
      return
    }
    let time = setTimeout(function(){
      that.setData({
        second:second-1
      });
      countdown(that);
    },1000);
  }

})