const app = getApp();

Page({
    data: {
        border: 'http://static.xidibuy.com/miniapp/common/1.0.0/images/colors-border.png',
        invoice: {
            head: 0,
            text: "无需发票",
            headContent: ""
        },
        way: {
            state: 0,
            text: '普通快递送货上门'
        },
        remark: '',
        showTip: false,
        showTipWord: '',
        remarkBlur: true
    },

    onShow() {
        let self = this;

        this.fromCartPage();
        this.fromAddressPage()
        this.fromSetInvoicePage()
        this.fromEditWayPage()
    },

    // 从购物车页面来 即初始化
    fromCartPage() {
        let self = this;
        let pageData = wx.getStorageSync('orderTemp');

        //计算得出应付金额 格式化所有数字
        let goodsPriceTotal = pageData.goodsPriceTotal;
        let goodsShippingFee = pageData.goodsShippingFee;
        let noGoodsAmount = pageData.noGoodsAmount;
        let amount = 0;

        pageData.goodsPriceTotal = app.tail(goodsPriceTotal);
        pageData.goodsShippingFee = app.tail(goodsShippingFee);
        pageData.noGoodsAmount = app.tail(noGoodsAmount);

        // 当前送货方式 如果是免运费 就不计算运费了
        if (self.data.way.state == 1) {
            amount = app.tail(Number(goodsPriceTotal) - Number(noGoodsAmount));
        } else {
            amount = app.tail(Number(goodsPriceTotal) + Number(goodsShippingFee) - Number(noGoodsAmount));
        }


        // 当前是否有地址
        pageData.hasDefaultAddress = Object.keys(pageData.addressInfos).length;

        if (pageData.hasDefaultAddress) {
            // 收货人姓名截断
            let arrTemp = [pageData.addressInfos];
            pageData.addressInfos = app.cutOffName(arrTemp)[0];
        }

        self.setData({
            amount,
            pageData
        });
        wx.setStorageSync('orderTemp', pageData);
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

    // 从地址页面回来
    fromAddressPage() {
        let self = this;

        // 取地址 from地址列表页
        let addressTemp = wx.getStorageSync('addressListToConfirmOrder');
        if (addressTemp) {
            self.setData({
                'pageData.addressInfos': addressTemp,
                'pageData.hasDefaultAddress': true
            });
            wx.setStorageSync('orderTemp', self.data.pageData);
            wx.removeStorageSync('addressListToConfirmOrder');
            //获取新地址的运费
            self.getFeeForPay(addressTemp);
        }


        if (!self.data.pageData.hasDefaultAddress) {
            wx.showModal({
                title: '',
                content: '暂无收货地址，快去添加',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/confirmOrder/address/edit/edit?from=confirmorderindex'
                        })
                    }
                }
            })
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

    // 从发票设置页面回来
    fromSetInvoicePage() {
        let self = this;

        // 取发票信息 from 发票信息设置页面
        let invoiceTemp = wx.getStorageSync('invoiceFor_Order_Invoice_Temp');
        if (invoiceTemp) {
            self.setData({
                invoice: invoiceTemp
            });
            wx.removeStorageSync('invoiceFor_Order_Invoice_Temp');
        }

    },


    // 跳转到送货方式编辑页面
    goToEditWayEvent(e) {
        let self = this;
        if (e.currentTarget.dataset.state) {
            let obj = {
                freeCondition: self.data.pageData.freeCondition,
                goodsShippingFee: self.data.pageData.goodsShippingFee,
                type: self.data.way.state
            };
            wx.setStorageSync('from_order_to_way_temp', obj);
            wx.navigateTo({
                url: '/pages/confirmOrder/way/way'
            })
        }
    },


    // 从送货方式编辑页面回来
    fromEditWayPage() {
        let self = this;
        // 送货方式
        let prov = self.data.pageData.addressInfos.prov;

        // 如果是上海市
        if (prov == 340000) {
            self.setData({
                isShangHai: true
            });

        } else {
            self.setData({
                isShangHai: false,
                way: {
                    state: 0,
                    text: '普通快递送货上门'
                },
            });
        }

        // 送货方式 类型
        let mentioningAddress = wx.getStorageSync('wayToOrderTemp');
        if (mentioningAddress !== "") {
            wx.removeStorageSync('wayToOrderTemp')
            if (mentioningAddress == 0) {
                self.setData({
                    way: {
                        state: 0,
                        text: '普通快递送货上门'
                    },
                    amount: app.tail(Number(self.data.pageData.goodsPriceTotal) + Number(self.data.pageData.goodsShippingFee) - Number(self.data.pageData.noGoodsAmount))
                });
            } else {
                self.setData({
                    way: {
                        state: 1,
                        text: '服务自提点（免运费）'
                    },
                    amount: app.tail(Number(self.data.pageData.goodsPriceTotal) - Number(self.data.pageData.noGoodsAmount))
                });
            }
        }

    },

    // 备注 输入事件
    remarkInputEvent(e) {
        this.setData({
            remarkBlur: e.detail.value == ""
        })
        this.setData({
            remark: e.detail.value
        })
    },
    // 备注 focus事件
    remarkFocusEvent(e) {
        if (e.detail.value != "") {
            this.setData({
                remarkBlur: false
            })
        }
    },
    // 备注 blur事件
    remarkBlurEvent(e) {
        this.setData({
            remarkBlur: true
        })
    },

    tapContainerEvent(e) {
        if (e.target.dataset.name != 'remark') {
            this.setData({
                remarkBlur: true
            })
        }
    },

    remarkConfirmEvent(e) {
        // console.log(e);
        this.setData({
            remarkBlur: true
        })
    },

    // 备注 清空
    clearRemarkEvent() {
        this.setData({
            remark: ""
        })
    },

    // 获取运费 并计算得出应付金额
    getFeeForPay(addressTemp) {
        wx.showToast({
            title: '加载中',
            mask: true,
            icon: 'loading',
            duration: 10 * 1000
        });

        let self = this;
        let url = app.globalData.dataRemote + 'cart/fee';
        let data = {
            prov: addressTemp.prov,
            selectWeight: self.data.pageData.goodsWeightTotal,
            price: Number(self.data.pageData.goodsPriceTotal) - Number(self.data.pageData.noGoodsAmount)
        };
        app.postApi(url, data, function (resp) {
            wx.hideToast();
            if (resp.code == 0) {
                let goodsShippingFee = Number(resp.data.fee) - Number(resp.data.freeShipping);
                goodsShippingFee = goodsShippingFee > 0 ? goodsShippingFee : 0;
                let amount = Number(self.data.pageData.goodsPriceTotal)  - Number(self.data.pageData.noGoodsAmount);

                // 当前送货方式 如果是免运费 就不计算运费了
                if (self.data.way.state == 0) {
                    amount = amount + goodsShippingFee
                }

                self.setData({
                    amount: app.tail(amount),
                    'pageData.goodsShippingFee': app.tail(goodsShippingFee)
                });
                wx.setStorageSync('orderTemp', self.data.pageData);
            } else {
                app.showTip(self, resp.msg)
            }
        })

    },

    //提交订单
    submitOrder: function () {
        let self = this;
        let hasDefaultAddress = self.data.pageData.hasDefaultAddress;
        if (!hasDefaultAddress) {
            wx.showModal({
                title: '',
                content: '暂无收货地址，快去添加',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/confirmOrder/address/edit/edit?from=confirmorderindex'
                        })
                    }
                }
            })
        } else {
            let productIds = wx.getStorageSync('cartGoodsTemp').productIds;
            let invoice = self.data.invoice;
            let mentioningAddress = self.data.way.state;
            let aid = self.data.pageData.addressInfos.aid;
            let remark = self.data.remark;
            let obj = {
                productIds,
                invoice,
                mentioningAddress,
                remark,
                order: {
                    address: aid,
                    orderType: 1,
                    paytype: 13
                }
            };
            let url = app.globalData.dataRemote + 'order/save';
            wx.showToast({
                title: '加载中',
                mask: true,
                icon: 'loading',
                duration: 10 * 1000
            });
            app.postApi(url, obj, function (res) {
                wx.hideToast();
                if (res.code == 0) {
                    let orderId = res.data.orderId;
                    app.postApi(app.globalData.dataRemote + 'weixin/orderinfo', {
                        orderId
                    }, function (resp) {
                        if (resp.code == 0) {
                            let payData = resp.data;
                            wx.requestPayment({
                                'timeStamp': payData.timeStamp,
                                'nonceStr': payData.nonceStr,
                                'package': payData.package,
                                'signType': payData.signType,
                                'paySign': payData.paySign,
                                'success': function (respon) {
                                    wx.redirectTo({
                                        url: '/pages/confirmOrder/success/success?orderId=' + orderId
                                    })
                                },
                                'fail': function (respon) {
                                    //取消支付 跳转到订单详情页
                                    if (respon.errMsg == "requestPayment:fail cancel") {
                                        wx.redirectTo({
                                            url: '/pages/profile/order/orderDetail/orderDetail?orderId=' + orderId
                                        })
                                    } else {
                                        app.showTip(self, respon.errMsg)
                                    }
                                }
                            })
                        } else {
                            app.showTip(self, resp.msg);
                        }
                    });
                } else {
                    app.showTip(self, res.msg);
                }
            })
        }




    }

});