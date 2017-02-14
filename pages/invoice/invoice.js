Page({
  data: {
    imageUrl:[
      '../../image/invoice_03.png',
      '../../image/invoice_07.png'
    ]
  },

  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },
  invoiceNo: function(){
      this.setData({
       imageUrl:[
         '../../image/invoice_03.png',
          '../../image/invoice_03.png'
       ]
      });
  },
   invoiceYes: function(){
    
  },
  checkRadio: function(e){

      console.log(this);
  },
 
});