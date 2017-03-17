var app = getApp();
Page({
    data: {
        hide: false
    },
    onLoad: function (opt) {
        const self = this;
        self.setData({
            opt
        })
    },
    onShow: function () {
        this.reloadTapEvent();
    },

    reloadTapEvent() {
        app.netWorkState(this.refreshCurrentPage, this, true);
    },
    refreshCurrentPage() {
        const self = this;
        let url = app.globalData.dataRemote + 'express/get';
        app.postApi(url, self.data.opt, function (resp) {
            self.setData({
                hide: true,
            })
            if (resp.code == 0) {
                self.setData(resp.data);
            }
        })
    }
});