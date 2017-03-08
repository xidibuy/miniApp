//获取应用实例
var app = getApp();
const imgHead = app.globalData.imgRemote;
Page({
    onLoad: function () {
        this.setData({
            imgHead
        });
    },
    // 分享关于喜地
    onShareAppMessage: function () {
        return {
            title: '分享',
            path: '/pages/about/about'
        }
    }
});