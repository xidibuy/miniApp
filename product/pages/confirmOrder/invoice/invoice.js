// pages/confirmOrder/invoice/invoice.js
Page({
  data: {
    person: true,
    organization: {
      state: false,
      content: ""
    }
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
    this.setData({
      'organization.content': e.detail.value
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
    wx.redirectTo({
      url: '/pages/confirmOrder/index/index'
    })
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
    }else{
      let content = self.data.organization.content;
      obj = {
        head: 2,
        text: content,
        headContent: content
      };
    }

    wx.setStorageSync('invoiceFor_Order_Invoice_Temp', obj);
    wx.redirectTo({
      url: '/pages/confirmOrder/index/index'
    })
  }


})