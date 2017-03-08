//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
Page({
  data: {
    current: 0,
    index: [],
    // 是否显示加载失败,默认不显示
    reload: false
  },

  onLoad: function (options) {
    const _this = this;
    const indexUrl = url + 'index/home';
    app.fetchApi(indexUrl, function (res) {
      if (res.code == 0) {
        _this.setData({
          index: res.data,
          reload: false
        });
      } else {
        _this.setData({
          reload: true
        });
      }
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
      path: '/pages/index/index?share=1'
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
