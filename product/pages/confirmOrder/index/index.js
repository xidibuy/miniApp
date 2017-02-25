const app = getApp();

Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data
    },

    onLoad: function () {
        const self = this;
        // 有收货地址
        // const listUrl = app.globalData.data + 'confirmOrder/normal1.json';
        // 无收货地址
        const listUrl = app.globalData.data + 'confirmOrder/normal2.json';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.state) {
                self.setData({
                    hasAddressInfo: resp.data.hasAddressInfo,
                    addressInfo: resp.data.addressInfo,
                    goodsList: resp.data.goodsList,
                    others: resp.data.others,
                    bill: resp.data.bill
                });
            }
            //处理收货人名字  超出5个汉字截断+...
            if(self.data.hasAddressInfo && self.data.addressInfo.name.length > 5){
                self.setData({
                    'addressInfo.name': self.data.addressInfo.name.split('').slice(0,5).join('') + '...'
                })
            }

        })
    },
    submitOrder: function(){

    }
});