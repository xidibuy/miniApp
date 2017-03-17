const app = getApp();
Page({
  data: {},

  onShow() {
    this.reloadTapEvent();
  },

  reloadTapEvent() {
    app.netWorkState(this.refreshCurrentPage, this, true);
  },

  refreshCurrentPage() {
    let self = this;
    let listUrl = app.globalData.dataRemote + 'address/list';
    // 获取列表
    wx.showToast({
      title: '加载中',
      mask: true,
      icon: 'loading',
      duration: 10 * 1000
    });
    app.postApi(listUrl, {}, function (resp) {
      wx.hideToast();
      if (resp.code == 0) {
        let choseArr = [];
        let list = resp.data;
        //处理收货人名过长
        list = app.cutOffName(list);
        // 渲染列表
        self.setData({
          list
        });
        // 缓存中是否有aid
        let aid = wx.getStorageSync('aidFor_Order_List_Edit_Add_Temp');
        if (aid) {
          wx.removeStorageSync('aidFor_Order_List_Edit_Add_Temp');
          // 设置默认选中
          list.map((item, index) => {
            if (item.aid == aid) {
              choseArr[index] = true
            } else {
              choseArr[index] = false
            }
          });
          self.setData({
            choseArr
          });
        } else {
          list.map((item, index) => {
            choseArr[index] = false
          });
          self.setData({
            choseArr
          });
        }

        // 如果列表只有一个 设置默认选中
        if (self.data.list.length == 1) {
          self.setData({
            choseArr: [true]
          });
        }


        let choseIdx = ''
        //如果有选择的 暂存到缓存里
        self.data.choseArr.map((item, index) => {
          if (item) {
            choseIdx = index
          }
        });
        if (String(choseIdx) != "") {
          wx.setStorageSync('addressListToConfirmOrder', self.data.list[choseIdx]);
        }
      } else {
        app.showTip(self, resp.msg);
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
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }, 200)

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
    if (String(choseIdx) != "") {
      let aid = self.data.list[choseIdx].aid;
      wx.setStorageSync('aidFor_Order_List_Edit_Add_Temp', aid);
    }


    // 跳转
    wx.navigateTo({
      url: '/pages/confirmOrder/address/edit/edit'
    })
  },
  goToAddAddressEvent() {
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
    wx.navigateTo({
      url: '/pages/confirmOrder/address/edit/edit'
    })
  }
});