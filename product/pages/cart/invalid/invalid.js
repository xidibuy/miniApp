const app = getApp();

Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data,
        list: []
    },

    onLoad: function () {
        const self = this;
        const listUrl = app.globalData.dataRemote + 'cart/unValidList';
        // 获取列表
        app.fetchApi(listUrl, function (resp) {
            if (resp.code == 0) {
                self.setData({
                    list: resp.data
                });
            }

        })
    }
});