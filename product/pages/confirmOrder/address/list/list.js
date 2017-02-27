const app = getApp();

Page({
  data: {
    img: app.globalData.img,
    dataUrl: app.globalData.data
  },

  onLoad: function () {
    const self = this;
    const listUrl = app.globalData.data + 'address.json';
    // 获取列表
    app.fetchApi(listUrl, function (resp) {
      if (resp.state) {
        self.setData({
          list: resp.data.list
        });
      }

    })
  }
});