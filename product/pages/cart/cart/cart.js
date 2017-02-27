const app = getApp();

Page({
    data: {
        emptyCartImg: 'http://static.xidibuy.com/miniapp/common/1.0.0/images/empty-cart.png'
    },

    onLoad: function () {
        const self = this;
        // 1个商品
        const listUrl = app.globalData.dataRemote + 'cart/list';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.code == 0) {
                self.setData({
                    // 包邮金额
                    freeCondition: resp.data.freeCondition,
                    // 包邮文案
                    // freeDesc:resp.data.freeDesc,
                    // 城市id
                    cityId: resp.data.cityId,
                    //有效商品列表
                    list: resp.data.cart.valid,
                    unValidNum: resp.data.unValidNum
                });

                // 设置商品选中状态
                self.goodsCheckedState(resp.data.cart.valid);
                // 设置金额
                self.dynamicSum();
                
            }

        })
    },

    // 商品选中状态
    goodsCheckedState: function (list) {
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
    singleGoodsToggleChecked: function (e) {
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
    },


    //全选按钮
    totalToggleChecked: function (e) {
        let self = this;
        let currentId = e.currentTarget.dataset.id;
        let currentState = !!e.detail.value.length;
        let temp = self.data.goodsCheckedStateObj;
        Object.keys(temp).map(item => temp[item] = currentState);
        self.setData({
            goodsCheckedStateObj: temp
        })
    },


    // 当前金额
    dynamicSum: function(){

    }

});