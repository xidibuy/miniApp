var app = getApp();
const url = app.globalData.data;
Page({
    data:
    {
        topic: {}
    },
    onLoad: function () {
        const _this = this;
        const cartUrl = url + 'topic.json';
        app.fetchApi(cartUrl, function (options) {

            _this.setData({
                topic: options.data
            });
            wx.setNavigationBarTitle({
                title: options.data.title
            });
        });

    },
    autoImageHeight: function (e) {
        console.log(e);
    }
});