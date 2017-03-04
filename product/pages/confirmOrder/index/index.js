const app = getApp();

Page({
    data: {
        border: '//static.xidibuy.com/miniapp/common/1.0.0/images/colors-border.png',
        invoice: {
            head: 0,
            text: "无需发票",
            headContent: ""
        }
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


        // 当前是否有地址
        pageData.hasDefaultAddress = Object.keys(pageData.addressInfos).length;

        self.setData({
            amount,
            pageData
        });
    },
    onShow() {
        let self = this;

        // 取地址 from地址列表页
        wx.getStorage({
            key: 'addressListToConfirmOrder',
            success: function (res) {
                wx.removeStorageSync('addressListToConfirmOrder');
                self.setData({
                    'pageData.addressInfos': res.data
                })
            }
        });

        // 取发票信息 from 发票信息设置页面
        wx.getStorage({
            key: 'invoiceFor_Order_Invoice_Temp',
            success: function (res) {
                wx.removeStorageSync('invoiceFor_Order_Invoice_Temp');
                self.setData({
                    invoice: res.data
                })
            }
        });
    },
    // 跳转到地址页面： 地址列表 或者 新增地址
    goToAddressEvent() {
        let self = this;
        let pageData = self.data.pageData;
        let hasAddress = Object.keys(pageData.addressInfos).length;
        //有地址
        if (hasAddress) {
            wx.setStorage({
                key: 'aidFor_Order_List_Edit_Add_Temp',
                data: pageData.addressInfos.aid,
                success: function (res) {
                    wx.navigateTo({
                        url: '/pages/confirmOrder/address/list/list'
                    })
                }
            })
        } else {
            // 地址列表为空
            if (pageData.addressList == 0) {
                wx.navigateTo({
                    url: '/pages/confirmOrder/address/edit/edit'
                })
            }
            // 地址列表不为空，没有默认地址
            else {
                wx.navigateTo({
                    url: '/pages/confirmOrder/address/list/list'
                })
            }
        }
    },

    // 跳转到发票设置页面
    goToSetInvoiceEvent() {
        let self = this;
        wx.setStorage({
            key: 'invoiceFor_Order_Invoice_Temp',
            data: self.data.invoice,
            success: function (res) {
                wx.navigateTo({
                    url: '/pages/confirmOrder/invoice/invoice'
                })
            }
        });
    },

    // 备注
    remarkInputEvent(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    //提交订单
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