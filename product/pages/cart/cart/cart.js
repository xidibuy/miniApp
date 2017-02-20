const app = getApp();

Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data,
        list: [],
        invalidGoodsNum: 0
    },

    onLoad: function () {
        const self = this;
        // 1个商品
        const listUrl = app.globalData.data + 'cart/normal1.json';
        // 6个商品
        // const listUrl = app.globalData.data + 'cart/normal6.json';
        // 空购物车
        // const listUrl = app.globalData.data + 'cart/null.json';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.state) {
                self.setData({
                    list: resp.data.list,
                    invalidGoodsNum: resp.data.invalidGoodsNum
                });
            }

        })
    },
    deleteCart: function () {

    },
    isChecked: function (e) {
        console.log(e);
    }
});