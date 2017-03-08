var app = getApp();
const url = app.globalData.dataRemote;
Page({
    data:
    {
        topic: {},
        imgBanner: '',
        share: false
    },
    onLoad: function (options) {
        const _this = this;
        const cartUrl = url + 'special?id=' + options.id + '&bannerimg=' + options.bannerimg;
        wx.showToast({
            title: '加载中',
            icon: 'loading'
        });
        app.fetchApi(cartUrl, function (res) {
            if (res.data) {
                _this.setData({
                    topic: res.data,
                    imgBanner: res.data.bannerimg
                });
                wx.setNavigationBarTitle({
                    title: res.data.subjectName
                });
            }
        });
        if (options.shareId == 1) {
            _this.setData({
                share: true
            })
        }
    },

    // 分享专题
    onShareAppMessage: function () {
        return {
            title: '分享',
            path: '/pages/topic/topic?shareId=1'
        }
    }
});