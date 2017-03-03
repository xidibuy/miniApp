const app = getApp();
const search = require('../../../../utils/area.js').search;
Page({
  data: {},

  onLoad: function () {
    const self = this;
    const listUrl = app.globalData.dataRemote + 'address/list';
    // 获取列表
    app.fetchApi(listUrl, function (resp) {
      if (resp.code == 0) {
        resp.data.map(item => {
          item.area = search(item.dist);
        })
        self.setData({
          list: resp.data
        });
      }

    })
  },
  setDefaultAddressEvent(e) {
    let self = this;
    let aid = e.currentTarget.dataset.aid;
    let list = self.data.list;
    list.map(item => {
      if (item.aid == aid) {
        item.status = 1
      } else {
        item.status = 0
      }
    });
    self.setData({
      list
    });
    wx.request({
      url: app.globalData.dataRemote + 'address/default',
      header: {
        'content-type': 'application/x-www-from-urlencoded'
      },
      data: {
        aid
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '/pages/confirmOrder/index/index'
          })
        }
      }
    })
  },
  goToEditAdressEvent(e) {
    let self = this;
    let idx = e.currentTarget.dataset.index;
    let editAdressTemp = self.data.list[idx];
    wx.setStorageSync('editAdressTemp', editAdressTemp);
    wx.navigateTo({
      url: '/pages/confirmOrder/address/edit/edit'
    })
  }
});