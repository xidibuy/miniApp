var app = getApp();
const url = app.globalData.dataRemote;
Page({
    data:
    {
        topic: {},
        imgBanner: ''
    },
    onLoad: function (options) {
        const _this = this;
        const cartUrl = url + 'special?id=' + options.id + '&bannerimg=' + options.bannerimg;
        app.fetchApi(cartUrl, function (res) {
            if (res.data.length) {
                _this.setData({
                    topic: res.data,
                    imgBanner: options.bannerimg
                });
                wx.setNavigationBarTitle({
                    title: res.data.subjectName
                });
            }
        });
    },

    // 分享专题
    onShareAppMessage: function () {
        return {
            title: '分享',
            path: '/pages/topic/topic'
        }
    }
});