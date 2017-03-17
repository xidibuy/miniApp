var app = getApp();
const url = app.globalData.dataRemote;
Page({
    data:
    {
        topic: {},
        imgBanner: '',
        share: true
    },

    onLoad: function (options) {
        this.setData({
            options
        })

    },
    onShow: function () {
        this.reloadTapEvent();
    },

    reloadTapEvent() {
        app.netWorkState(this.refreshCurrentPage, this, true);
    },
    refreshCurrentPage() {
        let _this = this;
        let options = _this.data.options;
        let id = options.id;
        let bannerimg = options.bannerimg;
        this.setData({
            id,
            bannerimg
        })
        
        wx.setStorageSync('isTopic', true);
        
        let cartUrl = url + 'special?id=' + _this.data.id + '&bannerimg=' + _this.data.bannerimg
        wx.showToast({
            title: '加载中',
            mask: true,
            icon: 'loading',
            duration: 3 * 1000
        });
        app.fetchApi(cartUrl, function (res) {
            if (wx.getStorageSync('isTopic')) {
                if (res.code == 0 && res.data) {
                    wx.stopPullDownRefresh();
                    _this.setData({
                        topic: res.data,
                        imgBanner: res.data.bannerimg
                    });
                    wx.setNavigationBarTitle({
                        title: res.data.subjectName
                    });
                } else {
                    app.showTip(_this, res.msg)
                }
            }

        });
        if (_this.data.options.shareId == 1) {
            _this.setData({
                share: false
            })
        };
    },
    goindex: function () {
        this.setData({
            share: true
        });
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    // 分享专题
    onShareAppMessage: function () {
        let _this = this;
        return {
            title: '分享',
            path: '/pages/topic/topic?shareId=1&id=' + _this.data.topic.id + '&bannerimg=' + _this.data.topic.bannerimg
        }
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        this.onShow();
    },
});