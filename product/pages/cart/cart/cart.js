const app = getApp();

Page({
    data: {
        loading: true,
        emptyCartImg: 'http://static.xidibuy.com/miniapp/common/1.0.0/images/empty-cart.png'
    },

    onLoad() {
        const self = this;
        const listUrl = app.globalData.dataRemote + 'cart/list';
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10 * 1000,
            complete: function () {
                // 获取列表
                app.fetchApi(listUrl, function (resp) {
                    if (resp.code == 0) {
                        wx.hideToast();
                        
                            self.setData({
                                loading: false,
                                // 包邮金额
                                freeCondition: Number(resp.data.freeCondition),
                                // 包邮文案
                                // freeDesc:resp.data.freeDesc,
                                // 城市id
                                cityId: resp.data.cityId,
                                //有效商品列表
                                list: resp.data.cart.valid,
                                // 无效商品个数
                                unValidNum: resp.data.unValidNum
                            });

                            // 设置商品选中状态
                            self.setGoodsDefaultCheckedState(resp.data.cart.valid);
                            // 设置金额
                            self.updateCurrentSum();
                        

                    }
                })
            }
        })

    },

    // 商品选中状态
    setGoodsDefaultCheckedState(list) {
        let self = this;
        let obj = {};

        // 如果storage没有数据
        if (true) {
            // 所有商品设为选中
            list.map(item => obj[item.goodsId] = true);
            //全选按钮设为选中
            obj.total = true;

            self.setData({
                goodsCheckedStateObj: obj
            })
        } else {

        }

    },


    // 单个商品选中/取消选中
    singleGoodsToggleChecked(e) {
        let self = this;
        let currentId = e.currentTarget.dataset.id;
        let currentState = !!e.detail.value.length;
        let temp = self.data.goodsCheckedStateObj;
        temp[currentId] = currentState;
        self.setData({
            goodsCheckedStateObj: temp
        });

        // 关联全选按钮
        //当前状态为true
        if (currentState) {
            let state = true;
            Object.keys(temp).every(item => {
                if (!temp[item]) {
                    state = false;
                    return false;
                }
            });
            self.setData({
                'goodsCheckedStateObj.total': state
            });
        } else {
            //当前状态为false
            if (self.data.goodsCheckedStateObj.total) {
                self.setData({
                    'goodsCheckedStateObj.total': false
                });
            }
        }

        // 更新当前金额
        self.updateCurrentSum();

    },


    //全选按钮
    totalToggleChecked(e) {
        let self = this;
        let currentId = e.currentTarget.dataset.id;
        let currentState = !!e.detail.value.length;
        let temp = self.data.goodsCheckedStateObj;
        Object.keys(temp).map(item => temp[item] = currentState);
        self.setData({
            goodsCheckedStateObj: temp
        });
        // 更新当前金额
        self.updateCurrentSum();
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
                self.setData(obj)
            }

        } else if (type == 'minus') {
            if (buyNum > 1) {
                obj[key] = buyNum - 1;
                self.setData(obj)
            }
        }

        self.updateCurrentSum();
    },

    // 输入框输入事件
    inputInputEvent(e) {
        console.log(e);
        let stock = Number(e.currentTarget.dataset.stock);
        let value = Number(e.detail.value);
        if (value > stock) {
            return stock
        } else if (value < 1) {
            return 1
        }
        self.updateCurrentSum();
    },


    // 当前金额
    updateCurrentSum() {
        let self = this;
        let goodsCheckedStateObj = self.data.goodsCheckedStateObj;
        let checkedGoods = Object.keys(goodsCheckedStateObj).filter(item => {
            return item != 'total'
        }).filter(item => {
            return goodsCheckedStateObj[item]
        });
        let settlementMoney = 0;
        checkedGoods.map(item => {
            self.data.list.map(l => {
                if (item == l.goodsId) {
                    settlementMoney += l.price * l.buyNum;
                    if (self.data.goodsCheckedStateObj[item]) {
                        settlementMoney -= l.lesPrice;
                    }
                }
            })
        });
        self.setData({
            settlementNumber: checkedGoods.length,
            settlementMoney: settlementMoney.toFixed(2)
        })


    }

});