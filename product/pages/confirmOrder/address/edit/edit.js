const app = getApp();

Page({
  data: {
    img: app.globalData.img,
    dataUrl: app.globalData.data,
    area: [1,2,3]
  },

  onLoad: function () {
    const self = this;
    const listUrl = app.globalData.data + 'area.json';
    // 获取列表
    app.fetchApi(listUrl, function (resp) {
      if (resp.state) {
        //resp.data
        let shengFun = function(item){
          return item.parentId == 0
        }
        let sheng = resp.data.filter(shengFun);
        self.setData({
          sheng: sheng,
          shi: '',
          qu: ''
        });
      }

    })
  }
});