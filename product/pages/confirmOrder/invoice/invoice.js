const app = getApp();
Page({
  data: {
    person: true,
    organization: {
      state: false,
      content: ""
    },
    organizationContent: true,
    showTip: false,
    showTipWord: ''
  },
  onLoad: function (options) {
    let self = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'invoiceFor_Order_Invoice_Temp',
      success: function (res) {
        wx.removeStorageSync('invoiceFor_Order_Invoice_Temp')
        if (res.data.head == 2) {
          self.setData({
            organization: {
              state: true,
              content: res.data.headContent
            },
            person: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  clearInputValue() {
    this.setData({
      'organization.content': ''
    })
  },
  inputInputEvent(e) {
    let self = this;
    let val = e.detail.value;
    if (self.strLength(val.trim()) > 100) {
      self.setData({
        'organization.content': self.data.organization.content
      })
    } else {
      self.setData({
        'organization.content': e.detail.value
      })
    }
  },
  containerTapEvent(e) {
    if (e.target.dataset.name != 'input') {
      this.setData({
        organizationContent: true
      })
    }
  },
  // focus事件
  inputFocusEvent(e) {
    this.setData({
      organizationContent: false
    })

  },
  // blur事件
  inputBlurEvent(e) {
    this.setData({
      organizationContent: true
    })
  },
  chooseOrganizationEvent() {
    this.setData({
      'organization.state': true,
      person: false
    })
  },
  choosePersonEvent() {
    this.setData({
      'organization.state': false,
      person: true
    })
  },
  cancelEvent() {
    let obj = {
      head: 0,
      text: "无需发票",
      headContent: ""
    }
    wx.setStorageSync('invoiceFor_Order_Invoice_Temp', obj);
    wx.navigateBack({
      delta: 1
    })
  },
  strLength(str) {
    if (str != '' && str != undefined) {
      let aMatch = str.match(/[^\x00-\x80]/g),
        strLen = (str.length + (!aMatch ? 0 : aMatch.length));
      return strLen;
    }
  },
  confirmEvent() {
    let self = this;
    let obj = {
      head: 0,
      text: "",
      headContent: ""
    };
    let person = self.data.person;

    if (person) {
      obj = {
        head: 1,
        text: "个人",
        headContent: ""
      };
    } else {
      let content = self.data.organization.content;
      obj = {
        head: 2,
        text: content,
        headContent: content
      };
    }

    if (obj.head == 2 && obj.headContent.trim() == "") {
      app.showTip(self, '单位名称不能为空');
    } else {
      wx.setStorageSync('invoiceFor_Order_Invoice_Temp', obj);
      wx.navigateBack({
        delta: 1
      });
    }
  }
})