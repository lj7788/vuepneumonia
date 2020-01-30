<template>
  <div class="home">
    <h3 style="text-align:center;font-size:18px;font-weight:bold;">
      {{ title }}
    </h3>
    <div class="main-left">
      <country-data :countryDatas="countryData" />
      <china-data :chinaDatas="chindData" />
    </div>
    <div class="main-right">
      <my-chart ref="myChart" />
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
import countryData from "./CountryData";
import chinaData from "./ChinaData";
import myChart from "./Chart";
export default {
  name: "home",
  components: {
    countryData,
    chinaData,
    myChart
  },
  data() {
    return {
      baseData: {},
      title: "",
      mainData: [],
      countryData: [],
      chindData: [],
      lineData:[],
    };
  },
  methods: {
    loadBaseData() {
      let url =
        "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts&callback=mydata&_=" +
        +new Date();
      this.$jsonp(url)
        .then(data => {})
        .catch(e => {});
    },
    loadLineData() {
      let url =
        "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_cn_day_counts&callback=myLineData&_=" +
        +new Date();
      this.$jsonp(url)
        .then(data => {})
        .catch(e => {});
    },
    setBaseData(data) {
      this.baseData = JSON.parse(data.data);
      let tmps = this.baseData;
      let country = {};
      let moment = require("moment");
      let title = "最后更新时间：" + moment().format("YYYY-MM-DD HH:mm:ss");
      let chinaData = {};
      tmps.forEach(it => {
        let name = it.country;
        let item = {};
        if (country[name]) {
          item = country[name];
        } else {
          item = {
            name: name,
            dead: 0,
            heal: 0,
            suspect: 0,
            confirm: 0
          };
          country[name] = item;
        }
        item.dead += it.dead;
        item.heal += it.heal;
        item.suspect += it.suspect;
        item.confirm += it.confirm;
        if (name == "中国") {
          let city = it.area;
          let cdata = {};
          if (chinaData[city]) {
            cdata = chinaData[city];
          } else {
            cdata = {
              name: name,
              dead: 0,
              heal: 0,
              suspect: 0,
              confirm: 0,
              child: [],
              showChild: false
            };
            chinaData[city] = cdata;
          }
          cdata.child.push(it);
          cdata.name = name;
          cdata.area = city;
          cdata.dead += it.dead;
          cdata.heal += it.heal;
          cdata.suspect += it.suspect;
          cdata.confirm += it.confirm;
        }
      });
      this.mainData = tmps;
      this.title = title;
      tmps = [];
      for (let k in country) {
        tmps.push(country[k]);
      }
      tmps = tmps.sort((a, b) => b.confirm - a.confirm);
      this.countryData = tmps;
      tmps = [];
      for (let k in chinaData) {
        let it = chinaData[k];
        it.child = it.child.sort((a, b) => b.confirm - a.confirm);
        tmps.push(it);
      }
      tmps = tmps.sort((a, b) => b.confirm - a.confirm);
      this.chindData = tmps;
      this.$refs.myChart.updateChinaData(tmps);
    },
    setLineData(data) {
      let tmps = JSON.parse(data.data);
      this.lineData=tmps
      tmps = tmps.sort((a, b) => a.date.localeCompare(b.date));
      this.$refs.myChart.updateLineData(tmps);
    },
    updateData() {
      this.loadBaseData();
      this.loadLineData();
    }
  },
  created() {
    window.myApp=this
    setInterval(() => {
      this.updateData();
    }, 1000 * 60);
    this.updateData();
    window.mydata = data => {
      this.setBaseData(data);
    };
    window.myLineData = data => {
      this.setLineData(data);
    };
  },
  destroyed(){
    delete window.mydata
    delete window.myLineData
  }
};
</script>
<style scoped>
@media (min-width: 720px){
  .main-left {
    width: 100%;
  }
  .main-right {
    width: 100%;
  }
}

@media screen and (min-width:1440px){ 
  .main-left {
    float: left;
    width: 400px;
  }
  .main-right {
    float: left;
    width: calc(100% - 405px);
  }
}
.clear {
  clear: both;
}
</style>
