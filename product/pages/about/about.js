//获取应用实例
var app = getApp();
Page({

    onLoad: function () {
        this.reloadTapEvent();
    },
    reloadTapEvent() {
        app.netWorkState('', this, true);
    },
    // 分享关于喜地
    onShareAppMessage: function () {
        return {
            title: '分享',
            path: '/pages/about/about'
        }
    }
});