var app = getApp();
Page({
    data: {},
    onLoad: function (opt) {
        const self = this;
        let url = app.globalData.dataRemote + 'express/get';
        app.postApi(url, opt, function (resp) {
            if (resp.code == 0) {
                self.setData(resp.data);
            }
        })
    }
});