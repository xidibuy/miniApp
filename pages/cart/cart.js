const app = getApp();

Page({
   data:{
       img:app.globalData.img,
       dataUrl:app.globalData.data,
       freeFeright:true,
       proCarts:[
           {
               isChecked:true,
               imgUrl:"",
               proTitle:"新西兰Melita麦卢卡蜂蜜UMF5+ 340g",
               proAttr:["黑色","蓝色"],
               cartNum:10,
               lackNum:5,
               priceCart:149.50
           }
       ]
   },

   onLoad: function(){
        const self = this;
        const listUrl = app.globalData.data + 'cart.json';
        // 获取列表
        app.fetchApi(listUrl,function(url,options){
           self.setData({
                list : options.data.proCarts
           });
        })
   },
   deleteCart: function(){
     
   },
   isChecked: function(e){
        console.log(e);
   }
});