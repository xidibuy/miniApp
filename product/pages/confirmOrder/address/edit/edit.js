const app = getApp();
const prov = require('../../../../utils/area.js').prov;

Page({
  data: {
    prov,
    areaPickerViewHidden: false,
    status: 1,
    areaInitValue: [5, 2, 3],
    type: ''
  },

  onLoad: function () {
    let self = this;
    self.initArea();

    wx.getStorage({
      key: 'editAdressTemp',
      success: function (res) {
        let obj = res.data
        self.setData({
          type: 'edit',
          aid: res.data.aid,
          consignee: res.data.consignee,
          mobile: res.data.mobile,
          address: res.data.address,
          status: res.data.status,
          zipcode: res.data.zipcode,
          prov: res.data.prov,
          city: res.data.city,
          district: res.data.district,
          pname: res.data.pname,
          cname: res.data.cname,
          dname: res.data.dname,
          areaValue: res.data.area
        });

        console.log(res.data)
        wx.setNavigationBarTitle({
          title: '编辑地址'
        })
      },
      fail(res) {
        self.setData({
          type: 'add'
        });
        wx.setNavigationBarTitle({
          title: '新增地址'
        })
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
  initArea() {
    let self = this;
    let area = self.data.areaInitValue;

    self.setData({
      city: prov[area[0]].data,
      dist: prov[area[0]].data[area[1]].data
    });
    setTimeout(() => {
      self.setData({
        area: self.data.areaInitValue
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
        city: prov[area[0]].data,
        dist: prov[area[0]].data[0].data
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
        dist: prov[area[0]].data[area[1]].data
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
    let areaValue = '';
    let areaIds = {};
    let areaNames = {};
    // 省
    areaValue += prov[area[0]].name;
    areaIds.prov = prov[area[0]].id;
    areaNames.pname = prov[area[0]].name;
    // 市
    areaValue += prov[area[0]].data[area[1]].name;
    areaIds.city = prov[area[0]].data[area[1]].id;
    areaNames.cname = prov[area[0]].data[area[1]].name;
    //区
    areaValue += prov[area[0]].data[area[1]].data[area[2]].name;
    areaIds.district = prov[area[0]].data[area[1]].data[area[2]].id;
    areaNames.dname = prov[area[0]].data[area[1]].data[area[2]].name;
    self.setData({
      areaValue,
      areaIds,
      areaNames,
      areaPickerViewHidden: false
    });

  },
  consigneeInputEvent(e) {
    this.setData({
      consignee: e.detail.value
    })
  },
  mobileInputEvent(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressInputEvent(e) {
    this.setData({
      address: e.detail.value
    })
  },
  zipcodeInputEvent(e) {
    this.setData({
      zipcode: e.detail.value
    })
  },
  setDefaultEvent(e) {
    this.setData({
      status: Number(e.detail.value)
    })
  },
  saveFormEvent() {
    let self = this;
    let consignee = self.data.consignee;
    let mobile = self.data.mobile;
    let address = self.data.address;
    let areaValue = self.data.areaValue;
    let zipcode = self.data.zipcode;
    let status = self.data.status;


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
    else if (areaValue == undefined || areaValue == '') {
      wx.showModal({
        title: '',
        content: '请填写省市区',
        showCancel: false
      })
    } else {
      let prov = self.data.areaIds.prov;
      let city = self.data.areaIds.city;
      let district = self.data.areaIds.district;
      let pname = self.data.areaNames.pname;
      let cname = self.data.areaNames.cname;
      let dname = self.data.areaNames.dname;
      let obj = {
        data: {
          consignee,
          mobile,
          address,
          status,
          zipcode,
          prov,
          city,
          district,
          pname,
          cname,
          dname
        }
      }
      wx.request({
        url: app.globalData.dataRemote + 'address/save',
        data: obj,
        header: {
          'content-type': 'application/x-www-from-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.code == 0) {
            wx.removeStorageSync(editAdressTemp)
          }

        }
      })
    }
  },
  removeAddressEvent() {
    let self = this;
    let aid = self.data.aid;
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
              if (res.code == 0) {
                wx.removeStorageSync(editAdressTemp)
              }
            }
          })
        }
      }
    })
  }
});