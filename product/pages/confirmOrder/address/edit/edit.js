const app = getApp();
const Area = require('../../../../utils/area.js');
const prov = Area.prov;
const city = Area.city;
const dist = Area.dist;

Page({
  data: {
    prov,
    city: [],
    dist: [],
    area: [5,5,3]
  },

  onLoad: function () {
    let self = this;



    self.initArea();
  },
  initArea(){
    let self = this;
    let area = self.data.area;
    let pid = prov[area[0]].id;
    // let tempCity = prov.data[area[0]];
    let tempDist = [];

    console.log(prov[area[0]].data[area[1]]);



    self.setData({
      city: [],
      dist: tempDist
    })
    console.log();
  },
  areaChangEvent(e){
    console.log(e)
  }
});