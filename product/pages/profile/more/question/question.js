//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
Page({
  onShow: function () {
    this.reloadTapEvent();
  },

  reloadTapEvent() {
    app.netWorkState(this.refreshCurrentPage, this, true);
  },

  refreshCurrentPage() {
    let _this = this;
    let queUrl = url + 'index/getFreeCondition';
    app.fetchApi(queUrl, function (res) {
      if (res.code == 0 && res.data) {
        _this.setData({
          money: res.data
        });
      }
    })
  }
})