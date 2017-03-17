const app = getApp();

Page({
    data: {
        loading: true,
        emptyCartImg: 'http://static.xidibuy.com/miniapp/common/1.0.0/images/empty-cart.png',
        freeCondition: 98,
        settlementNumber: 0,
        settlementMoney: 0
    },

    onShow() {
        this.reloadTapEvent();
    },

    reloadTapEvent() {
        app.netWorkState(this.refreshCurrentPage, this, true);
    },

    onPullDownRefresh() {
        this.reloadTapEvent()
    },

    refreshCurrentPage() {
        app.showNoNetworkPage(this);
        wx.showToast({
            title: '加载中',
            mask: true,
            icon: 'loading',
            duration: 10 * 1000
        });

        let self = this;
        let url = app.globalData.dataRemote + 'cart/list';
        let uid = wx.getStorageSync('uid');
        let userInfo = wx.getStorageSync('userInfo');

        // 登录情况下 请求线上购物车列表
        if (uid && userInfo) {
            let cartLocalList = wx.getStorageSync('cartLocalList');
            if (cartLocalList && cartLocalList.length) {
                let mergeUrl = app.globalData.dataRemote + 'cart/mergeCartInfoByLogin';
                let mergeData = {
                    currentProducts: {

                    },
                    cartSelectId: {

                    }
                };
                cartLocalList.map((item, index) => {
                    let goodsId = item.goodsId;
                    let num = item.buyNum;
                    let addTime = item.addTime;
                    mergeData.currentProducts[goodsId] = {
                        num,
                        addTime,
                        goodsId
                    };
                    if (item.check == 1) {
                        mergeData.cartSelectId[goodsId] = num;
                    }
                });
                app.postApi(mergeUrl, mergeData, function (resp) {
                    wx.stopPullDownRefresh();
                    wx.hideToast();
                    if (resp.code == 0) {
                        wx.removeStorageSync('cartLocalList');
                        self.setData({
                            loading: false,
                            // 包邮金额
                            freeCondition: Number(resp.data.freeCondition),
                            // 包邮文案
                            freeDesc:resp.data.freeDesc,
                            // 城市id
                            cityId: resp.data.cityId,
                            //有效商品列表
                            list: resp.data.cart,
                            // 无效商品个数
                            unValidSkuNum: resp.data.unValidSkuNum
                        });

                        // 根据商品选中状态 设置全选按钮
                        self.setTotalBtnState(resp.data.cart);
                        // 设置金额
                        self.updateCurrentSum();
                    } else {
                        app.showTip(self, resp.msg);
                    }
                })
            } else {
                app.postApi(url, {}, function (resp) {
                    wx.stopPullDownRefresh();
                    wx.hideToast();
                    if (resp.code == 0) {
                        self.setData({
                            loading: false,
                            // 包邮金额
                            freeCondition: Number(resp.data.freeCondition),
                            // 包邮文案
                            freeDesc:resp.data.freeDesc,
                            // 城市id
                            cityId: resp.data.cityId,
                            //有效商品列表
                            list: resp.data.cart,
                            // 无效商品个数
                            unValidSkuNum: resp.data.unValidSkuNum
                        });

                        // 根据商品选中状态 设置全选按钮
                        self.setTotalBtnState(resp.data.cart);
                        // 设置金额
                        self.updateCurrentSum();
                    } else {
                        app.showTip(self, resp.msg);
                    }
                })
            }
        }
        // 未登录情况下 请求本地列表
        else {
            wx.stopPullDownRefresh();
            wx.hideToast();
            let list = wx.getStorageSync('cartLocalList') || [];
            self.setData({
                loading: false,
                list,
                unValidSkuNum: 0
            });
            // 根据商品选中状态 设置全选按钮
            self.setTotalBtnState(list);
            // 设置金额
            self.updateCurrentSum();

        }
    },

    // 勾选同步
    syncCheckStateOtO(obj) {
        let self = this;
        let uid = wx.getStorageSync('uid');
        let userInfo = wx.getStorageSync('userInfo');
        let list = self.data.list;
        if (uid && userInfo) {
            let url = app.globalData.dataRemote + 'cart/syncTickOffByCart';
            let data = {
                cartSelectId: obj
            };
            app.postApi(url, data, function (resp) {
                if (resp.code == 0) {
                    console.log('设置勾选状态成功！')
                } else {
                    app.showTip(self, resp.msg);
                }
            })
        } else {
            wx.setStorageSync('cartLocalList', list)
        }
    },

    // 全选按钮状态
    setTotalBtnState(list) {
        let self = this;
        list = list || self.data.list;
        let length = list.filter(item => {
            return item.check == 0
        }).length;
        self.setData({
            totalCheck: !length
        })
    },


    // 单个商品选中/取消选中
    singleGoodsToggleChecked(e) {
        let self = this;
        let currentId = e.currentTarget.dataset.id;
        let currentNum = e.currentTarget.dataset.num;
        let currentState = !!e.detail.value.length;
        let list = self.data.list;
        let obj = {};
        let key = '';
        let paramObj = {};


        list.map((item, index) => {
            if (item.goodsId == currentId) {
                key = `list[${index}].check`;
            }
        });
        obj[key] = currentState;
        self.setData(obj);


        list.map(item => {
            if (item.check) {
                paramObj[item.goodsId] = item.buyNum
            } else {
                paramObj[item.goodsId] = 0;
            }
        });

        self.syncCheckStateOtO(paramObj);

        // 更新全选按钮状态
        self.setTotalBtnState();
        // 更新当前金额
        self.updateCurrentSum();

    },


    //全选按钮
    totalToggleChecked(e) {
        let self = this;
        let currentId = e.currentTarget.dataset.id;
        let currentState = !!e.detail.value.length;
        let list = self.data.list;
        let paramObj = {};
        self.setData({
            list: list.filter((item) => {
                item.check = currentState;
                return true;
            }),
            totalCheck: currentState
        });

        list.map(item => {
            if (item.check) {
                paramObj[item.goodsId] = item.buyNum
            } else {
                paramObj[item.goodsId] = 0
            }
        });

        self.syncCheckStateOtO(paramObj);
        // 更新当前金额
        self.updateCurrentSum();
    },

    // 更新购买数量 方法
    updateNumFun(id, num) {
        let self = this;
        let uid = wx.getStorageSync('uid');
        let userInfo = wx.getStorageSync('userInfo');
        let list = self.data.list;
        if (uid && userInfo) {
            let url = app.globalData.dataRemote + 'cart/update';
            let data = {
                productIds: {}
            };
            data.productIds[id] = num;
            app.postApi(url, data, function (resp) {
                if (resp.code == 0) {
                    console.log('更新成功！')
                } else {
                    app.showTip(self, resp.msg);
                }
            })
        } else {
            wx.setStorageSync('cartLocalList', list)
        }

    },

    // 修改商品个数
    updateGoodsNum(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        let stock = e.currentTarget.dataset.stock;
        let index = '';
        let buyNum = '';
        let obj = {};


        self.data.list.map((item, idx) => {
            if (item.goodsId == id) {
                index = idx;
                buyNum = Number(item.buyNum);
            }
        });
        let key = `list[${index}].buyNum`;
        if (type == 'add') {
            if (buyNum == stock - 1) {
                app.showTip(self, '此商品最多可购买' + stock + '件');
            } else if (buyNum > stock - 1) {
                return false;
            }

            obj[key] = buyNum + 1;
            self.setData(obj)
            self.updateNumFun(id, buyNum + 1);


        } else if (type == 'minus') {
            if (buyNum > 1) {
                obj[key] = buyNum - 1;
                self.setData(obj)
                self.updateNumFun(id, buyNum - 1);
            }
        }
        self.updateCurrentSum();
    },

    // 输入框输入事件
    inputInputEvent(e) {
        let self = this;
        let list = self.data.list;
        let id = e.currentTarget.dataset.id;
        let stock = Number(e.currentTarget.dataset.stock);
        let value = Number(e.detail.value);


        if (value > stock) {
            list.map(item => {
                if (item.goodsId == id) {
                    item.buyNum = stock
                }
            })
            self.setData({
                list
            });
            self.updateNumFun(id, stock);
        } else if (value < 1) {
            list.map(item => {
                if (item.goodsId == id) {
                    item.buyNum = 1
                }
            })
            self.setData({
                list
            });
            self.updateNumFun(id, 1);
        } else {
            list.map(item => {
                if (item.goodsId == id) {
                    item.buyNum = value
                }
            })
            self.setData({
                list
            });
            self.updateNumFun(id, value);
        }
        self.updateCurrentSum();
    },

    // 当前金额
    updateCurrentSum() {
        let self = this;
        let list = self.data.list;
        let freeCondition = self.data.freeCondition;
        let checkedGoods = list.filter(item => {
            return item.check == 1
        });

        let settlementMoney = 0;
        let settlementNumber = 0;
        checkedGoods.map(item => {
            if (Number(item.lesPrice) < item.price * item.buyNum) {
                // 计算总价
                settlementMoney += item.price * item.buyNum;
                settlementMoney -= Number(item.lesPrice);
                // 计算总量
                settlementNumber += Number(item.buyNum)
            }
        });
        self.setData({
            settlementNumber,
            settlementMoney: settlementMoney.toFixed(2),
            gapMoney: (freeCondition - settlementMoney).toFixed(2)
        })
    },

    //结算
    settlementEvent() {
        let self = this;
        if (self.data.settlementNumber > 0) {
            let list = self.data.list;
            let url = app.globalData.dataRemote + 'order/check';
            let paramObj = {
                productIds: {}
            };
            list.map(item => {
                if (item.check) {
                    paramObj.productIds[item.goodsId] = item.buyNum
                }
            });
            wx.showToast({
                title: '加载中',
                mask: true,
                icon: 'loading',
                duration: 10 * 1000
            });
            app.postApi(url, paramObj, function (res) {
                wx.hideToast();
                if (res.code == 0) {
                    wx.setStorageSync('orderTemp', res.data);
                    wx.setStorageSync('cartGoodsTemp', paramObj);
                    wx.navigateTo({
                        url: '/pages/confirmOrder/index/index'
                    })
                }
                else {
                    wx.showModal({
                        title: '',
                        content: '商品信息发生变动，请重新确定后再提交订单',
                        showCancel: false,
                        confirmText: '知道了',
                        success() {
                            self.reloadTapEvent()
                        }
                    })
                }
            })
        }


    },

    // 删除
    deleteCart(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let uid = wx.getStorageSync('uid');
        let userInfo = wx.getStorageSync('userInfo');
        wx.showModal({
            title: '',
            content: '确定删除该商品吗？',
            success: function (res) {
                if (res.confirm) {
                    if (uid && userInfo) {
                        let url = app.globalData.dataRemote + 'cart/delete';
                        let num = e.currentTarget.dataset.num;
                        let obj = {
                            productIds: {}
                        };
                        let list = self.data.list;
                        obj.productIds[id] = num;
                        app.postApi(url, obj, function (resp) {
                            if (resp.code == 0) {
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1000
                                });

                                self.setData({
                                    list: list.filter(item => {
                                        return item.goodsId != id
                                    })
                                });
                                self.updateCurrentSum();
                            } else {
                                app.showTip(self, resp.msg);
                            }
                        })
                    } else {
                        let cartLocalList = wx.getStorageSync('cartLocalList');

                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1000
                        });

                        self.setData({
                            list: cartLocalList.filter(item => {
                                return item.goodsId != id
                            })
                        });
                        self.updateCurrentSum();
                        wx.setStorageSync('cartLocalList', self.data.list)
                    }
                }
            }
        })
    }
});