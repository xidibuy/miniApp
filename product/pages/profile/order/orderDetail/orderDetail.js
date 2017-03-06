//获取应用实例
var app = getApp();
const url = app.globalData.dataRemote;
Page({
  data: {
    second: 3 * 60 * 60,
    orderDetail: {},
    status: 0,
    time: ''
  },
  onLoad: function (options) {
    const _this = this;
    const deUrl = url + 'order/info?orderId=' + options.orderId
    this.post(deUrl, function (res) {
      // 处理时间戳
      res.basic.pinfo.orderTime = _this.formatTime(res.basic.pinfo.orderTime);
      _this.setData({
        orderDetail: res,
        status: res.basic.pinfo.orderStatus
      });
      _this.countTime(res.basic.pinfo.leftTime);
    });
  },
  formatTime: function (number) {
    let n = number * 1000;
    let date = new Date(n);
    let Y = date.getFullYear() + '/';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
    let MI = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
    let S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (Y + M + D + " " + H + MI + S);
  },
  countTime: function (time) {
    let _this = this;
    setInterval(function () {

      if (time < 0) {
        return false;
      } else {
        let hour = Math.floor(time / 3600)
        let minute = Math.floor((time - hour * 3600) / 60) < 10 ? ('0' + Math.floor((time - hour * 3600) / 60)) : (Math.floor((time - hour * 3600) / 60));
        let second = Math.floor(time - hour * 3600 - minute * 60) < 10 ? ('0' + Math.floor(time - hour * 3600 - minute * 60)) : (Math.floor(time - hour * 3600 - minute * 60));
        let nowTime;
        // 拼接字符创
        if (hour < 0) {
          if (Math.abs(minute) == 0) {
            if (Math.abs(second) == 0) {

            } else {
              nowTime = second + '秒';
            }
          } else {
            nowTime = minute + '分钟' + second + '秒';
          }
        } else {
          nowTime = hour + '小时' + minute + '分钟' + second + '秒';
        }
        // 设置time
        _this.setData({
          time: nowTime
        })
        time--;
      }

    }, 1000)

  },
  post: function (deUrl, callback) {
    app.postApi(deUrl, {},function (res) {
      callback && callback(res.data);
    });
  },
})