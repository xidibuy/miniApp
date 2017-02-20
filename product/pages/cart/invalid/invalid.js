const app = getApp();

Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data,
        list: []
    },

    onLoad: function () {
        const self = this;
        // 1个商品
        const listUrl = app.globalData.data + 'cart/invalid1.json';
        // 6个商品
        // const listUrl = app.globalData.data + 'cart/invalid6.json';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.state) {
                self.setData({
                    list: resp.data.list,
                    invalidGoodsNum: resp.data.invalidGoodsNum
                });
            }

        })
    }
});