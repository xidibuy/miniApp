const app = getApp();
const prov = require('../../../../utils/area.js').prov;

Page({
  data: {
    prov,
    areaPickerViewHidden: false,
    areaInitValue: [5, 2, 3]
  },

  onLoad: function () {
    let self = this;



    self.initArea();
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
    // 省
    areaValue += prov[area[0]].name;
    areaIds.prov = prov[area[0]].id;
    // 市
    areaValue += prov[area[0]].data[area[1]].name;
    areaIds.city = prov[area[0]].data[area[1]].id;
    //区
    areaValue += prov[area[0]].data[area[1]].data[area[2]].name;
    areaIds.dist = prov[area[0]].data[area[1]].data[area[2]].id;
    self.setData({
      areaValue,
      areaIds,
      areaPickerViewHidden: false
    });

  }
});