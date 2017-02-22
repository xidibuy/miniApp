var app = getApp();
Page({
    data: {
        orderId: "0000000",
        fun: "圆通快递",
        logisName: "圆通快递",
        logisId: "123445232",
        logis: []
    },
    onLoad: function () {
        const _this = this;
        const indexUrl = 'https://172.16.14.96:8000/data/logis.json';
        app.fetchApi(indexUrl, function (options) {
            _this.setData({
                orderId:options.data.orderId,
                fun:options.data.fun,
                logisName:options.data.logisName,
                logisId:options.data.logisId,
                logis: options.data.flow
            });
        })
    }
});