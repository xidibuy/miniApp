Page({
   data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  changeSwiper: function(event) {
    this.setData({
      current: event.detail.current
    });
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  }
});