//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
var goto_url = '';
var timer;
Page({
  data: {
    current: 0,
    index: []
  },
  onShow: function () {
    var _this = this;
    timer && clearTimeout(timer);
    timer = setTimeout(function() {
      _this.reloadTapEvent();
    }, 100);
  },

  reloadTapEvent() {
    app.netWorkState(this.refreshCurrentPage, this, true);
  },
  // 初始化
  refreshCurrentPage() {
    let _this = this;
    let indexUrl = url + 'index/home';
    app.fetchApi(indexUrl, function (res) {
      if (res.code == 0) {
        let newData = [];
        res.data.map(function (item, index) {
          if (item.type == 1) {
            if (!(Object.prototype.toString.call(item.product) === '[object Array]')) {
              item.current = 0;
              newData.push(item);
            }
          } else {
            newData.push(item);
          }
        });
        _this.setData({
          index: newData
        });
      } else {
        app.showTip(_this, res.msg);
      }
    });
    goto_url = '';
    wx.setStorageSync('isTopic', false);
  },


  // 刷新页面
  onPullDownRefresh: function () {
    this.reloadTapEvent();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 3000);
  },
  // 分享首页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/index/index?share=1'
    }
  },
  // currentPage: function (e) {
  //   let current = e.detail.current;
  //   this.setData({
  //     word: this.data.text[current]
  //   })
  // },
  changePro: function (e) {

    var item = this.data.index[e.currentTarget.dataset.idx];
    item.current = e.detail.current;
    this.setData({
      index: this.data.index
    })
  },
  sinRecom: function (e) {

    let id = e.currentTarget.dataset.id;
    let relateprodSn = e.currentTarget.dataset.relateprodsn;
    let sinUrl = '/pages/goodsDetail/goodsDetail?goodId=' + id + '&relateprodSn=' + relateprodSn;
    if (sinUrl == goto_url) {
      return false;
    } else {
      goto_url = sinUrl;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    wx.navigateTo({
      url: sinUrl,
      success: function () {
        wx.hideToast();
      }
    })
  },
  sinSpec: function (e) {

    let bannerlink = e.currentTarget.dataset.bannerlink;
    let bannerimg = e.currentTarget.dataset.bannerimg;
    let sinSpecUrl = '/pages/topic/topic?id=' + bannerlink + '&bannerimg=' + bannerimg;
    if (sinSpecUrl == goto_url) {
      return false;
    } else {
      goto_url = sinSpecUrl;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    })
    wx.navigateTo({
      url: sinSpecUrl,
      success: function () {
        wx.hideToast();
      }
    })
  },
  banner: function () {
    var banner_url = '/pages/about/about';
    if (banner_url == goto_url) {
      return false;
    } else {
      goto_url = banner_url;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    });
    wx.navigateTo({
      url: banner_url,
      success: function () {
        wx.hideToast();
      }
    })

  }
})
