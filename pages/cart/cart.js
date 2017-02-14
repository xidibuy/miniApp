const app = getApp();
const cartUrl = "http://localhost/testMiniAppApi/cart.json";
Page({
   data:{
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
       const _this = this;
       app.fetchApi(cartUrl,function(url,options){
           _this.setData({
                proCarts : options.data.proCarts
           });
       })
   },
   deleteCart: function(){
     
   },
   isChecked: function(e){
        console.log(e);
   }
});