const app = getApp();
Page({
  data: {},

  onLoad: function () {
    const self = this;
    const listUrl = app.globalData.dataRemote + 'address/list';
    // 获取列表
    app.fetchApi(listUrl, function (resp) {
      if (resp.code == 0) {
        let choseArr = [];
        let list = resp.data;
        // 渲染列表
        self.setData({
          list
        });
        // 缓存中是否有aid
        wx.getStorage({
          key: 'aidFor_Order_List_Edit_Add_Temp',
          success(res) {
            // 移除storage中的aid
            wx.removeStorageSync('aidFor_Order_List_Edit_Add_Temp');
            // 设置默认选中
            list.map((item, index) => {
              if (item.aid == res.data) {
                choseArr[index] = true
              } else {
                choseArr[index] = false
              }
            });
            self.setData({
              choseArr
            });
          },
          fail(){
            list.map((item, index) => {
                choseArr[index] = false
            });
            self.setData({
              choseArr
            });
          }
        })
      }
    })
  },
  chooseAddressEvent(e) {
    let self = this;
    let idx = e.currentTarget.dataset.index;
    let choseArr = self.data.choseArr;
    let cur = self.data.list[idx];
    // 设置被选中
    choseArr.map((item, index) => {
      if (index == idx) {
        choseArr[index] = true
      } else {
        choseArr[index] = false
      }
    })
    self.setData({
      choseArr
    });
    // 跳回订单页 并将选中地址数据存入storage
    setTimeout(() => {
      wx.setStorage({
        key: 'addressListToConfirmOrder',
        data: cur,
        success: function (res) {
          wx.redirectTo({
            url: '/pages/confirmOrder/index/index'
          })
        }
      })
    }, 300)

  },
  goToEditAdressEvent(e) {
    let self = this;

    // 存储要编辑的地址信息
    let idx = e.currentTarget.dataset.index;
    let editAdressTemp = self.data.list[idx];
    wx.setStorageSync('editAdressTemp', editAdressTemp);


    // 存储被选中的项的index
    let choseIdx = '';
    self.data.choseArr.map((item, index) => {
      if (item) {
        choseIdx = index;
      }
    });
    let aid = self.data.list[choseIdx].aid;
    wx.setStorageSync('aidFor_Order_List_Edit_Add_Temp', aid);

    // 跳转
    wx.redirectTo({
      url: '/pages/confirmOrder/address/edit/edit'
    })
  },
  goToAddAddressEvent(){
    // 存储被选中的项的index
    let self = this;
    let choseIdx = '';
    self.data.choseArr.map((item, index) => {
      if (item) {
        choseIdx = index;
      }
    });
    let aid = self.data.list[choseIdx].aid;
    wx.setStorageSync('aidFor_Order_List_Edit_Add_Temp', aid);

    // 跳转
    wx.redirectTo({
      url: '/pages/confirmOrder/address/edit/edit'
    })
  }
});