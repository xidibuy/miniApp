const app = getApp();

Page({
    data: {
        loading: true,
        emptyCartImg: 'http://static.xidibuy.com/miniapp/common/1.0.0/images/empty-cart.png'
    },

    onShow() {
        let self = this;
        let url = app.globalData.dataRemote + 'cart/list';
        app.postApi(url, {}, function (resp) {
            if (resp.code == 0) {
                self.setData({
                    loading: false,
                    // 包邮金额
                    freeCondition: Number(resp.data.freeCondition),
                    // 包邮文案
                    // freeDesc:resp.data.freeDesc,
                    // 城市id
                    cityId: resp.data.cityId,
                    //有效商品列表
                    list: resp.data.cart,
                    // 无效商品个数
                    unValidNum: resp.data.unValidNum
                });

                // 根据商品选中状态 设置全选按钮
                self.setTotalBtnState(resp.data.cart);
                // 设置金额
                self.updateCurrentSum();
            }
        })

    },



    // 勾选同步
    syncCheckStateOtO(obj) {
        let self = this;
        let url = app.globalData.dataRemote + 'cart/syncTickOffByCart';
        let data = {
            cartSelectId: obj
        };
        app.postApi(url, data, function (resp) {
            if (resp.code == 0) {
                console.log('设置勾选状态成功！')
            }
        })
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
            }
        });

        self.syncCheckStateOtO(paramObj);
        // 更新当前金额
        self.updateCurrentSum();
    },

    // 更新购买数量 方法
    updateNumFun(id, num) {
        let url = app.globalData.dataRemote + 'cart/update';
        let data = {
            productIds: {}
        };
        data.productIds[id] = num;
        app.postApi(url, data, function (resp) {
            if (resp.code == 0) {
                console.log('更新成功！')
            } else {
                console.log(resp.msg)
            }
        })
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
            if (buyNum < stock) {
                obj[key] = buyNum + 1;
                self.updateNumFun(id, buyNum + 1);
                self.setData(obj)
            }

        } else if (type == 'minus') {
            if (buyNum > 1) {
                obj[key] = buyNum - 1;
                self.updateNumFun(id, buyNum - 1);
                self.setData(obj)
            }
        }
        self.updateCurrentSum();
    },

    // 输入框输入事件
    inputInputEvent(e) {
        let self = this;
        let stock = Number(e.currentTarget.dataset.stock);
        let value = Number(e.detail.value);
        if (value > stock) {
            return stock
        } else if (value < 1) {
            return 1
        }
        self.updateCurrentSum();
    },

    //输入框 输入完成
    inputBlurEvent(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let value = Number(e.detail.value);
        self.updateNumFun(id, value);
        self.updateCurrentSum();
    },



    // 当前金额
    updateCurrentSum() {
        let self = this;
        let list = self.data.list;
        let checkedGoods = list.filter(item => {
            return item.check == 1
        });

        let settlementMoney = 0;
        checkedGoods.map(item => {
            settlementMoney += item.price * item.buyNum;
            settlementMoney -= Number(item.lesPrice)
        });
        self.setData({
            settlementNumber: checkedGoods.length,
            settlementMoney: settlementMoney.toFixed(2)
        })
    },

    //结算
    settlementEvent() {
        let self = this;
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
        app.postApi(url, paramObj, function (res) {
            if (res.code == 0) {
                wx.setStorageSync('orderTemp', res.data);
                wx.setStorageSync('cartGoodsTemp', paramObj);
                wx.navigateTo({
                    url: '/pages/confirmOrder/index/index'
                })
            } else {
                console.log(res)
                // wx.showModal({
                //     title: '提示',
                //     content: res
                // })
            }
        })
    },

    // 删除
    deleteCart(e) {
        let self = this;
        wx.showModal({
            title: '',
            content: '确定删除该商品吗？',
            success: function (res) {
                if (res.confirm) {
                    let url = app.globalData.dataRemote + 'cart/delete';
                    let id = e.currentTarget.dataset.id;
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
                        }
                    })
                }
            }
        })
    }

});