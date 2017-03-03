const app = getApp();
const search = require('../../../utils/area.js').search;

Page({
    data: {
        border: '//static.xidibuy.com/miniapp/common/1.0.0/images/colors-border.png'
    },

    onLoad: function () {
        let self = this;
        let pageData = wx.getStorageSync('orderTemp');

        //计算得出应付金额 格式化所有数字
        let goodsPriceTotal = pageData.goodsPriceTotal;
        let goodsShippingFee = pageData.goodsShippingFee;
        let noGoodsAmount = pageData.noGoodsAmount;
        let amount = self.tail(goodsPriceTotal + goodsShippingFee - noGoodsAmount);
        pageData.goodsPriceTotal = self.tail(goodsPriceTotal);
        pageData.goodsShippingFee = self.tail(goodsShippingFee);
        pageData.noGoodsAmount = self.tail(noGoodsAmount);


        // address link url
        let addressLinkUrl = '';
        if(pageData.addressInfos.length){
            addressLinkUrl = '/pages/confirmOrder/address/list/list';
        }else if(pageData.addressList == 0){
            addressLinkUrl = '/pages/confirmOrder/address/add/add';
        }else if(pageData.addressList == 1){
            addressLinkUrl = '/pages/confirmOrder/address/list/list';
        }

        // 当前地址
        let currentArea = '';
        // if(pageData.addressInfos.length){
            currentArea =  search(pageData.addressInfos.district)
        // }


        self.setData({
            amount,
            pageData,
            addressLinkUrl,
            currentArea
        });

        

        


        // 有收货地址
        // const listUrl = app.globalData.data + 'confirmOrder/normal1.json';
        // 无收货地址
        // const listUrl = app.globalData.data + 'confirmOrder/normal2.json';
        // 获取列表
        // app.fetchApi(listUrl, function (resp) {
        //     if (resp.state) {
        //         self.setData({
        //             hasAddressInfo: resp.data.hasAddressInfo,
        //             addressInfo: resp.data.addressInfo,
        //             goodsList: resp.data.goodsList,
        //             others: resp.data.others,
        //             bill: resp.data.bill
        //         });
        //     }
        //     //处理收货人名字  超出5个汉字截断+...
        //     if(self.data.hasAddressInfo && self.data.addressInfo.name.length > 5){
        //         self.setData({
        //             'addressInfo.name': self.data.addressInfo.name.split('').slice(0,5).join('') + '...'
        //         })
        //     }
        // })
    },
    submitOrder: function(){

    },
    tail(num){
        if(typeof num == "number"){
            if(/\./g.test(num)){
                return num
            }else{
                return num + '.00'
            }
        }
    }

});