var app = getApp();
const img = app.globalData.img;
Page({
  data: {
    img : app.globalData.img,
    imageUrl:[
      img+'invoice_03.png',
      img+'invoice_07.png'
    ]
  },

  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },
  invoiceNo: function(){
      this.setData({
      
      });
  },
   invoiceYes: function(){
    
  },
  checkRadio: function(e){

      console.log(this);
  },
 
});