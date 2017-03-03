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


        // 是否有默认地址
        pageData.hasDefaultAddress = Object.keys(pageData.addressInfos).length;
        // address link url
        let addressLinkUrl = '';
        if (pageData.hasDefaultAddress) {
            addressLinkUrl = '/pages/confirmOrder/address/list/list';
        } else if (pageData.addressList == 0) {
            addressLinkUrl = '/pages/confirmOrder/address/edit/edit';
        } else if (pageData.addressList == 1) {
            addressLinkUrl = '/pages/confirmOrder/address/list/list';
        }

        // 当前地址
        let currentArea = '';
        if (pageData.hasDefaultAddress) {
            currentArea = search(pageData.addressInfos.district)
        }


        self.setData({
            amount,
            pageData,
            addressLinkUrl,
            currentArea
        });
    },
    submitOrder: function () {
        let self = this;
        let productIds = wx.getStorageSync('cartGoodsTemp').productIds;
        let obj = {
            productIds,
            invoice: {
                head: 1,
                headContent: '世纪东方该数据库的股份接口'
            },
            order: {
                address: "1152",
                orderType: 1,
                paytype: '13'
            },
            mentioningAddress: 1,
            remark: 'sdfgsf上岛咖啡'
        };
        wx.request({
            url: app.globalData.dataRemote + 'order/save',
            data: obj,
            header: {
                'content-type': 'application/x-www-from-urlencoded'
            },
            method: 'POST',
            success: function (res) {
                // success
            }
        })
    },
    tail(num) {
        if (typeof num == "number") {
            if (/\./g.test(num)) {
                return num
            } else {
                return num + '.00'
            }
        }
    }

});