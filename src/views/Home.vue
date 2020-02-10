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
    loadData(){
      let url=`/forum/home/v1/info/?activeWidget=1&city_code=610100&city_name=西安&tt_from=copy_link&utm_source=copy_link&utm_medium=toutiao_ios&utm_campaign=client_share&forum_id=1656784762444839`
      this.http.get(url).then(data=>{
        let moment = require("moment");
        let d=JSON.parse( data.data.forum.extra.ncov_string_list)
        d.provinces=d.provinces.map(it=>{
        it.showChild=false
        return it
      })
        this.baseData=d
        this.title = "最后更新时间：" + moment(d.updateTime*1000).format("YYYY-MM-DD HH:mm:ss");        
        window.console.log(d)
        this.loadCountryData()
        this.loadCityData()
        this.$refs.myChart.updateLineData(d.nationwide.map(it=>{
          return {
            date:it.date.replace("2020-",""),
            dead: it.deathsNum?it.deathsNum:0,
            heal: it.curesNum?it.curesNum:0,
            suspect:it.suspectedNum?it.suspectedNum:0,
            confirm: it.confirmedNum?it.confirmedNum:0
          }
        }).reverse())
      }).catch(e=>{})
    },
    loadCountryData(){
      let d=this.baseData
      let tmps=[]
      d.world.forEach(it=>{
        tmps.push({
          name: it.country,
            dead: '0',
            heal: it.curesNum?it.curesNum:'0',
            suspect: '0',
            confirm: it.confirmedNum
        })
      })
      this.countryData=tmps
    },
    loadCityData(){
      let d=this.baseData      
      this.chindData=d.provinces
    },
    loadBaseData() {
      let url =
        "https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts&callback=mydata&_=" +
        +new Date();
      this.$jsonp(url)
        .then(data => {})
        .catch(e => {});

      url=`/forum/home/v1/info/?activeWidget=1&city_code=610100&city_name=西安&tt_from=copy_link&utm_source=copy_link&utm_medium=toutiao_ios&utm_campaign=client_share&forum_id=1656784762444839`
      this.http.get(url).then(data=>{        
      }).catch(e=>{})
    },
    updateData() {
      this.loadData()
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
