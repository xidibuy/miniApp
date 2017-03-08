const app = getApp();
const Prov = require('../../../../utils/area.js').prov;

Page({
  data: {
    Prov,
    areaPickerViewHidden: false,
    type: '',
    showTip: false,
    showTipWord: ''
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
  showTip(con) {
    let _this = this;
    this.setData({
      showTip: true,
      showTipWord: con
    }),
      setTimeout(function () {
        _this.setData({
          showTip: false,
          showTipWord: ''
        })
      }, 2000)
  },
  strLength(str) {
    if (str != '' && str != undefined) {
      let aMatch = str.match(/[^\x00-\x80]/g),
        strLen = (str.length + (!aMatch ? 0 : aMatch.length));
      return strLen;
    }
  },
  consigneeCheck(val) {
    let self = this;
    if (self.strLength(val)) {
      if (self.strLength(val) >= 21) {
        self.showTip('请填写正确的收货人姓名');
        return false;
      } else {
        return true;
      }
    } else {
      self.showTip('请填写收货人');
      return false;
    }
  },
  mobileCheck(val) {
    let self = this;
    if (val) {
      if (!(/^1[3|4|5|7|8]\d{9}$/.test(val))) {
        self.showTip('请填写正确的手机号码');
        return false
      } else {
        return true;
      }
    } else {
      self.showTip('请填写手机');
      return false;
    }
  },
  adressCheck(val) {
    let self = this;
    if (self.strLength(val)) {
      if (/^\d+$/.test(val)) {
        self.showTip('不能是纯数字');
        return false;
      } else if (/^([a-zA-Z]+)$/.test(val)) {
        self.showTip('不能是纯字母');
        return false;
      } else if (self.strLength(val) >= 201 || self.strLength(val) <= 7) {
        if (self.strLength(val) >= 201 || self.strLength(val) <= 7) {
          self.showTip('请填写正确的收货人详细地址');
          return false;
        } else {
          return true;
        }
      }
      return true;
    } else {
      self.showTip('请填写收货人详细地址');
      return false;
    }
  },
  zipcodeCheck(val) {
    let self = this;
    if (val) {
      if (!/^[0-9]{6}$/.test(val)) {
        self.showTip('请填写正确的邮政编码');
        return false
      } else {
        return true;
      }
    } else {
      return true;
    }
  },
  pnameCheck(val) {
    let self = this;
    if (val == undefined || val == '') {
      self.showTip('请填写省市区');
      return false;
    } else {
      return true;
    }
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
    if (self.consigneeCheck(consignee) && self.mobileCheck(mobile) && self.pnameCheck(pname) && self.adressCheck(address) && self.zipcodeCheck(zipcode)) {
      app.postApi(app.globalData.dataRemote + 'address/save', info, function (res) {
        if (res.code == 0) {
          wx.redirectTo({
            url: '/pages/confirmOrder/address/list/list'
          })
        }
      })
    }

  },

  // 清空input输入框
  clearInputValue(e) {
    let self = this;
    let content = e.currentTarget.dataset.index;
    switch (content) {
      case 'consignee':
        self.setData({
          'info.consignee': ''
        });
        break;
      case 'mobile':
        self.setData({
          'info.mobile': ''
        });
        break;
      case 'address':
        self.setData({
          'info.address': ''
        });
        break;
      case 'zipcode':
        self.setData({
          'info.zipcode': ''
        });
        break;
    }
  }
});
