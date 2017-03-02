var app = getApp();
const url = app.globalData.dataRemote;
Page({
    data:
    {
        topic: {},
        imgBanner: ''
    },
    onLoad: function (options) {
        console.log(options.bannerimg + options.id);
        const _this = this;
        const cartUrl = url + 'special?id=' + options.id + '&bannerimg=' + options.bannerimg;
        app.fetchApi(cartUrl, function (res) {

            _this.setData({
                topic: res.data,
                imgBanner: options.bannerimg
            });
            wx.setNavigationBarTitle({
                title: res.data.subjectName
            });
console.log(res.data.moduleContent[3]);
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