var app = getApp();
Page({
    data: {
        img: app.globalData.img,
        dataUrl: app.globalData.data,
        logisticsType: 0,
        logisticsInfo: {},
        logisticsDetails: []
    },
    onLoad: function () {
        const self = this;
        // 1条信息
        // const url = app.globalData.data + 'logistics/normal1.json';
        // 3条信息
        const url = app.globalData.data + 'logistics/normal3.json';
        // 6条信息
        // const url = app.globalData.data + 'logistics/normal6.json';
        // 无物流信息
        // const url = app.globalData.data + 'logistics/null.json';
        // 自提
        // const url = app.globalData.data + 'logistics/byself.json';
        app.fetchApi(url, function (resp) {
            if (resp.state) {
                self.setData({
                    logisticsType: resp.data.type,
                    logisticsInfo: resp.data.info,
                    logisticsDetails: resp.data.details && resp.data.details.reverse()
                });
            }
        })
    }
});