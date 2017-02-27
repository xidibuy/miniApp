var app = getApp();
const url = app.globalData.dataRemote;
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
    },
    // 分享专题
    onShareAppMessage: function () {
        return {
            title: '分享',
            path: '/pages/topic/topic'
        }
    }
});