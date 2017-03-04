const app = getApp();
const Prov = require('../../../../utils/area.js').prov;

Page({
  data: {
    Prov,
    areaPickerViewHidden: false,
    type: ''
  },

  onLoad: function () {
    let self = this;
    wx.getStorage({
      key: 'editAdressTemp',
      // 编辑地址
      success: function (res) {
        wx.removeStorageSync('editAdressTemp');
        let info = res.data;
        self.setData({
          info,
          type: 'edit'
        });
        wx.setNavigationBarTitle({
          title: '编辑地址'
        });
        self.editInitArea(info);
      },
      // 新增地址
      fail(res) {
        self.setData({
          type: 'add',
          info: {}
        });
        wx.setNavigationBarTitle({
          title: '新增地址'
        });
        self.addInitArea([0, 0, 0]);
      }
    })
  },

  pickerFocusEvent() {
    this.setData({
      areaPickerViewHidden: true
    });
  },
  pickerCloseEvent() {
    this.setData({
      areaPickerViewHidden: false
    });
  },
  addInitArea(arr) {
    let self = this;
    let area = arr;

    self.setData({
      City: Prov[area[0]].data,
      Dist: Prov[area[0]].data[area[1]].data
    });
    setTimeout(() => {
      self.setData({
        area
      });
    }, 100)
  },
  editInitArea(info) {
    let self = this;
    let area = [0, 0, 0,];
    Prov.map((pt, pi) => {
      if (pt.id == info.prov) {
        area[0] = pi;
        pt.data.map((ct, ci) => {
          if (ct.id == info.city) {
            area[1] = ci;
            ct.data.map((dt, di) => {
              if (dt.id == info.dist) {
                area[2] = di;
              }
            })
          }
        })
      }
    });

    self.setData({
      City: Prov[area[0]].data,
      Dist: Prov[area[0]].data[area[1]].data
    });

    setTimeout(() => {
      self.setData({
        area
      });
    }, 100)

  },
  areaChangEvent(e) {
    let self = this;
    let old = self.data.area;
    let area = e.detail.value;


    // 省
    if (old[0] != area[0]) {
      self.setData({
        City: Prov[area[0]].data,
        Dist: Prov[area[0]].data[0].data
      });
      setTimeout(() => {
        self.setData({
          area: [area[0], 0, 0]
        });
      }, 100)
    }
    // 市
    else if (old[1] != area[1]) {
      self.setData({
        Dist: Prov[area[0]].data[area[1]].data
      });
      setTimeout(() => {
        self.setData({
          area: [area[0], area[1], 0]
        });
      }, 100)
    }
    // 区
    else if (old[2] != area[2]) {
      setTimeout(() => {
        self.setData({
          area
        });
      }, 100)
    }
  },
  pickerConfirmEvent() {
    let self = this;
    let area = self.data.area;

    let pname = Prov[area[0]].name;
    let cname = Prov[area[0]].data[area[1]].name;
    let dname = Prov[area[0]].data[area[1]].data[area[2]].name;
    let prov = Prov[area[0]].id;
    let city = Prov[area[0]].data[area[1]].id;
    let dist = Prov[area[0]].data[area[1]].data[area[2]].id;

    self.setData({
      'info.pname': pname,
      'info.cname': cname,
      'info.dname': dname,
      'info.prov': prov,
      'info.city': city,
      'info.dist': dist,
      areaPickerViewHidden: false
    });

  },
  consigneeInputEvent(e) {
    this.setData({
      'info.consignee': e.detail.value
    })
  },
  mobileInputEvent(e) {
    this.setData({
      'info.mobile': e.detail.value
    })
  },
  addressInputEvent(e) {
    this.setData({
      'info.address': e.detail.value
    })
  },
  zipcodeInputEvent(e) {
    this.setData({
      'info.zipcode': e.detail.value
    })
  },
  setDefaultEvent(e) {
    this.setData({
      'info.status': Number(e.detail.value)
    })
  },
  saveFormEvent() {
    let self = this;
    let info = self.data.info;
    let consignee = info.consignee;
    let mobile = info.mobile;
    let address = info.address;
    let zipcode = (typeof info.zipcode == 'undefined') ? '' : info.zipcode;
    let status = (typeof info.status == 'undefined') ? '' : info.status;
    let pname = info.pname;
    if (consignee == undefined || consignee == '') {
      wx.showModal({
        title: '',
        content: '请填写收货人',
        showCancel: false
      })
    }
    else if (mobile == undefined || mobile == '') {
      wx.showModal({
        title: '',
        content: '请填写手机',
        showCancel: false
      })
    }
    else if (address == undefined || address == '') {
      wx.showModal({
        title: '',
        content: '请填写详细地址',
        showCancel: false
      })
    }
    else if (pname == undefined || pname == '') {
      wx.showModal({
        title: '',
        content: '请填写省市区',
        showCancel: false
      })
    } else {
      wx.request({
        url: app.globalData.dataRemote + 'address/save',
        data: info,
        header: {
          'content-type': 'application/x-www-from-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            wx.redirectTo({
              url: '/pages/confirmOrder/address/list/list'
            })
          }
        }
      })
    }
  },
  removeAddressEvent() {
    let self = this;
    let aid = self.data.info.aid;
    wx.showModal({
      title: '',
      content: '确定删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.dataRemote + 'address/delete',
            data: {
              aid
            },
            header: {
              'content-type': 'application/x-www-from-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              if (res.data.code == 0) {
                wx.redirectTo({
                  url: '/pages/confirmOrder/address/list/list'
                })
              }
            }
          })
        }
      }
    })
  }
});