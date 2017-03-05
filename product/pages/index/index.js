//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
// const url = app.globalData.data;
Page({
  data: {
    current: 0,
    index: []
  },

  onLoad: function (options) {
    const _this = this;
    const indexUrl = url + 'index/home';
    app.fetchApi(indexUrl, function (options) {
      _this.setData({
        index: options.data
      });
    })
  },

  // 刷新页面
  onPullDownRefresh: function () {
    this.onLoad();
  },
  // 分享首页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/index/index'
    }
  },
  currentPage: function (e) {
    let current = e.detail.current;
    this.setData({
      word: this.data.text[current]
    })
  },
  changePro: function (event) {
    this.setData({
      current: event.detail.current
    });
  }
})
