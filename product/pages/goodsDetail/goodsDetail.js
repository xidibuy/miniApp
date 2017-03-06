const app = getApp();
const url = app.globalData.dataRemote;
// const url = app.globalData.data;
Page({
  data: {
    current: 0,
    amount: 1,
    scrollTop: 0,
    floorstatus: false,
    goodsDetail: {},
    // 颜色
    keyone: [],
    // 尺码
    keytwo: [],
    // 商品规格
    prodParams: [],
    // 推荐商品
    recommendList: [],
    // 当前颜色和尺码
    curColorAndsSize: [],
    // 当前颜色没有的尺码
    sizeNo: {},
    // 当前尺码没有的颜色
    colorNo: {},
    // 当前的颜色
    curC: '',
    // 当前的尺码
    curS: '',
    // 购物车数目
    cartNum: 0,
    show: {
      "showOne": true,
      "showTwo": false
    },
    startPoint: [0, 0]
  },
  // 下拉展示上一部分
  onPullDownRefresh: function () {
    this.setData({
      show: {
        "showOne": true,
        "showTwo": false
      }
    });
    wx.stopPullDownRefresh();
  },

  mytouchstart: function (e) {
    // 开始触摸,获取触摸点坐标并放入数组中
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY]
    })
  },

  // 触摸点移动
  mytouchmove: function (e) {
    let _this = this;
    // 当前触摸点坐标
    let curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    let startPoint = this.data.startPoint;
    // 比较pageX的值
    if ((startPoint[1] - curPoint[1]) >= 200) {
      _this.setData({
        show: {
          "showOne": false,
          "showTwo": true
        }
      });
    }
  },

  onLoad: function (options) {
    let _this = this;
    // const proUrl = url + "detail?goodId=" + options.goodId + "&relateprodSn=" + options.relateprodSn;
    const proUrl = url + "detail?goodId=" + 3510 + "&relateprodSn=" + options.relateprodSn;
    this.getGoodsNum();
    this.post(proUrl);

  },

  // 购物车数量获取
  getGoodsNum: function () {
    let _this = this;
    let uid = wx.getStorageSync('uid');
    let userInfo = wx.getStorageSync('userInfo');

    if (uid && userInfo) {
      let url = 'https://wxapp.xidibuy.com/cart/getGoodsNum';
      app.postApi(url, {}, function (res) {
        if (res.code == 0) {
          _this.setData({
            cartNum: res.data.num
          });
        }
      })
    } else {
      let list = wx.getStorageSync('cartLocalList');
      let cartNum = 0;
      if (list.length) {
        list.map(item => {
          cartNum += item.buyNum;
        })
      }
      _this.setData({
        cartNum
      })
    }
  },
  post: function (proUrl) {
    const _this = this;
    app.fetchApi(proUrl, function (res) {
      const resData = res.data;
      // 颜色
      const keyone = [];
      // 尺码
      const keytwo = [];
      // 商品规格
      const prodParams = [];
      // 推荐商品
      const recommendList = [];
      // 所有的组合搭配
      const group = [];
      // 取出当前颜色不存在的尺码
      const sizeNo = {};
      // 取出当前尺码不存在的颜色
      const colorNo = {};
      // 取出所有颜色的搭配
      // let arr = [];
      // resData.priceAttr.map(function (item, index) {
      //   let temp = Object.keys(item.children);
      //   arr.push(temp);
      // });
      if (resData.priceAttr[0]) {
        for (const a in resData.priceAttr[0].children) {
          keyone.push(a);
        };
      };
      // 取出所有尺码的搭配
      if (resData.priceAttr[1]) {
        for (const a in resData.priceAttr[1].children) {
          keytwo.push(a);
        };
      };
      //取出所有的产品规格的值
      for (const a in resData.prodParams) {
        prodParams.push(resData.prodParams[a]);
      };
      for (const a in resData.recommendList) {
        recommendList.push(resData.recommendList[a]);
      };
      // 取出所有搭配的 id
      for (const a in resData.goodsList) {
        group.push(a);
      };
      // 取出当前的颜色
      const curC = resData.curColorAndsSize[0];
      // 取出当前的尺码
      const curS = resData.curColorAndsSize[1];
      // 当前产品库存的数量>0
      if (resData.stock > 0) {

        for (let i = 0; i < keytwo.length; i++) {
          // 拼接当前颜色的尺码
          const tempC = curC + "_" + keytwo[i];
          // 库存的值小于0,放入
          if (resData.goodsList[tempC].stock <= 0) {
            // colorNo.push(keytwo[i]);
            let temp = keytwo[i];
            sizeNo[temp] = true;
          }
        };
        for (let i = 0; i < keyone.length; i++) {
          // 拼接当前尺码的颜色
          const tempS = keyone[i] + "_" + curS;
          // 库存的值小于0,放入
          if (resData.goodsList[tempS].stock <= 0) {
            // sizeNo.push(keyone[i]);
            let temp = keyone[i];
            colorNo[temp] = true;
          }
        };

      };
      _this.setData({
        goodsDetail: resData,
        keyone: keyone,
        keytwo: keytwo,
        prodParams: prodParams,
        recommendList: recommendList,
        curColorAndsSize: resData.curColorAndsSize,
        sizeNo: sizeNo,
        colorNo: colorNo,
        curC: curC,
        curS: curS
      });
    })
  },
  // 点击图片
  changeColor: function (event) {
    var _this = this;
    const color = event.target.dataset.color;
    const size = this.data.curColorAndsSize[1];
    const colorAndSize = color + "_" + size;

    for (let a in _this.data.colorNo) {
      for (const key in this.data.goodsDetail.map) {
        if (color != a && colorAndSize == key) {
          _this.changePro(_this.data.goodsDetail.map[colorAndSize]);
        }
      }
    }

  },
  // 点击尺寸
  changeSize: function (event) {
    var _this = this;
    const size = event.target.dataset.size;
    const color = this.data.curColorAndsSize[0];
    const colorAndSize = color + "_" + size;
    for (let a in _this.data.sizeNo) {
      for (const key in this.data.goodsDetail.map) {
        if (size != a && colorAndSize == key) {
          _this.changePro(_this.data.goodsDetail.map[colorAndSize]);
        }
      }
    }
  },
  changePro: function (parme) {
    var proUrl = url + "detail?goodId=" + parme;
    this.post(proUrl);
  },
  // 分享单品页
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/goodsDetail/goodsDetail'
    }
  },
  // 加入购物车
  addCart: function () {
    let _this = this;
    let uid = wx.getStorageSync('uid');
    let userInfo = wx.getStorageSync('userInfo');

    const num = _this.data.amount;
    if (uid && userInfo) {
      let obj = {};
      obj[_this.data.goodsDetail.goodId] = num;
      app.postApi(url + 'cart/add', {
        "productIds": obj
      }, function (res) {
        if (res.code == 0) {
          let cartNumNew = _this.data.cartNum + _this.data.amount;
          _this.setData({
            cartNum: cartNumNew
          });
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success'
          });
        }
      })
    } else {

      let curDetail = _this.data.goodsDetail;
      let curId = _this.data.curC + '_' + _this.data.curS;
      let curC = _this.data.curC;
      let curS = _this.data.curS;
      let curPro = curDetail.goodsList[curId];
      // curPro 取出 id name coverImg  price stock 
      // buynum 为 num
      // lesPrice 等研发
      let priceAttr = []
      curDetail.priceAttr.map(function (item, index) {
        priceAttr[index] = { "type": item.type };
        priceAttr[index] = { "pValue": curDetail.curColorAndsSize[index] };
      });
      let storageCar = {
        "goodsId": curPro.id,
        "name": curPro.name,
        "coverImg": curPro.attrImg[0],
        "buyNum": num,
        "price": curPro.price,
        "priceAttr": priceAttr,
        "stock": curPro.stock,
        "isShelved": curDetail.isShelved,
        "lesPrice": curDetail.couponAmount
      };
      let list = wx.getStorageSync('cartLocalList') || [];
      list.push(storageCar);
      wx.setStorageSync('cartLocalList', list);
      let cartNumNew = _this.data.cartNum + _this.data.amount;
      _this.setData({
        cartNum: cartNumNew
      });
      wx.showToast({
        title: '添加购物车成功',
        icon: 'success'
      });
    }

  },
  // swiper
  changeSwiper: function (event) {
    this.setData({
      current: event.detail.current
    });
  },
  // 减少购买数量
  reduceNumber: function () {
    let amount = this.data.amount;
    amount > 1 && this.setData({ 'amount': amount - 1 });
  },
  //增加购买数量
  addNumber: function () {
    if (this.data.amount < this.data.goodsDetail.stock) {
      let amount = this.data.amount + 1;
      this.setData({
        amount: amount
      });
    }
  },
  // 返回顶部
  goTop: function () {
    this.setData({
      show: {
        "showOne": true,
        "showTwo": false
      }
    });
  }
});