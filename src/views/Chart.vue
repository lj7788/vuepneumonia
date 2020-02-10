<template>
  <div>
    <div class="top">
      <div class="map-top-left" style="height:300px;" id="main" v-show="1===2"></div>
      <div class="map-top-left" style="height:300px;" id="mainLine" v-show="1===2"></div>
      <div
        class="map-top-left"
        style="height:300px;"
        v-if="1 === 1"
        id="mainLine3"
      ></div>
      <div
        class="map-top-left"
        style="height:300px;"
        v-if="1 === 1"
        id="mainLine2"
      ></div>
      <div class="map-top-right" style="">
        <table class="mydata" width="100%" style="margin-top:12px;">
          <thead>
            <tr>
              <th>时间</th>
              <th>确诊<span class="red">(增加)</span></th>
              <th>死亡<span class="red">(增加)</span></th>
              <th>治愈<span class="red">(增加)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in lineData" :key="idx">
              <td>{{ it.date }}</td>
              <td>
                {{ it.confirm }}<span class="red">({{ it.sumConfirm }})</span>
              </td>
              <td>
                {{ it.dead }}<span class="red">({{ it.sumDead }})</span>
              </td>
              <td>
                {{ it.heal }}<span class="red">({{ it.sumHeal }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="clear"></div>
    </div>
    <i
      v-if="showSub"
      @click="doGoBack"
      class="el-icon-back back"
      style="cursor:point"
    ></i>
    <div id="mainMap" style="width:100%;height:600px;margin-top:-30px"></div>
  </div>
</template>

<script>
// // 引入 ECharts 主模块
// import echarts from "echarts/lib/echarts";
// // 引入柱状图
// import "echarts/lib/chart/bar";
// import "echarts/lib/chart/line";
// // 引入提示框和标题组件
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/title";
// import "echarts/lib/component/legend";
// import "echarts/lib/component/geo";
//import "echarts/map/js/china.js";
//import "echarts/map/js/province/shanxi1.js";
//import echartData from './mapData'
//import LineChart from './LineChart'

export default {
  data() {
    return {
      lineData: [],
      mapData: [],
      myChart: null,
      myMap: null,
      myLineChart: null,
      subData: [],
      showSub: false,
      chartData: null,
      g2Chart1: null,
      g2Chart2: null
    };
  },
  components: {
    //LineChart
  },
  methods: {
    initLineData() {
      let myChart = window.echarts.init(document.getElementById("main"));
      this.myChart = myChart;
      this.myLineChart = window.echarts.init(
        document.getElementById("mainLine")
      );
    },

    doGoBack() {
      this.showSub = false;
      this.updateChinaData(this.mapData);
    },
    updateChinaData(data) {
      this.mapData = data;
    },
    makeG2Chart2(datas) {
      if (!this.g2Chart2) {
        this.g2Chart2 = new window.G2.Chart({
          container: "mainLine3",
          padding: [ 80, 100, 100, 100],
          forceFit: true,
          height: 300
        });
      }
      const chart = this.g2Chart2;
      chart.source(datas);
      chart.legend({
        custom: true,
        items:[
        {value:'confirm', marker: { symbol: 'hyphen', stroke: 'red', radius: 5 }},
        {value:'dead', marker: { symbol: 'hyphen', stroke: '#000', radius: 5 }},
        {value:'heal', marker: { symbol: 'hyphen', stroke: 'green', radius: 5 }},
        ]
      });

      chart
        .line()
        .position("date*confirm")
        .color("red")
        .size(3)
        .shape("smooth");
      chart
        .point()
        .position("date*confirm")
        .color("red")
        .size(4)        
        .shape("circle")

      chart
        .line()
        .position("date*dead")
        .color("#000")
        
        chart
        .point()
        .position("date*dead")
        .color("#000")
        .size(4)
        .shape("circle")

      chart
        .line()
        .position("date*heal")
        .color("green")
       chart
        .point()
        .position("date*heal")
        .color("green")
        .size(4)
        .shape("circle")

      chart.repaint();
      chart.render();
    },
    makeG2Chart(datas) {
      if (!this.g2Chart1) {
        this.g2Chart1 = new window.G2.Chart({
          container: "mainLine2",
          forceFit: true,
          height: 300
        });
      }
      const chart = this.g2Chart1;
      chart.source(datas);
      chart.legend(false);
      chart
        .interval()
        .position("date*sumConfirm")
        .color("#3182bd");

      chart
        .line()
        .position("date*sumConfirm")
        .color("#fdae6b")
        .size(3)
        .tooltip(false)
        .shape("smooth");
      chart
        .point()
        .position("date*sumConfirm")
        .color("#fdae6b")
        .label("sumConfirm", {
          textStyle: {
            fontSize: 12,
            fill: "red"
          }
        })
        .size(3)
        .shape("circle");
      chart.repaint();
      chart.render();
    },
    updateLineData(data) {
      let myChart = this.myChart;
      for (let i = 0; i < data.length; i++) {
        let it = data[i];
        it.sumConfirm = i === 0 ? 0 : +data[i].confirm - data[i - 1].confirm;
        it.sumDead = i === 0 ? 0 : +data[i].dead - data[i - 1].dead;
        it.sumHeal = i === 0 ? 0 : +data[i].heal - data[i - 1].heal;
        it.sumSuspect = i === 0 ? 0 : +data[i].suspect - data[i - 1].suspect;
      }
      this.lineData = data;
      let myLineChart = this.myLineChart;
      this.chartData = {
        type: "bar",
        data: {
          labels: data.map(it => it.date),
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: data.map(it => it.sumConfirm)
            }
          ]
        }
      };
      // let ctx = document.getElementById("mainLine2");
      // new window.Chart(ctx.getContext("2d"), this.chartData);
      this.makeG2Chart(data);
      this.makeG2Chart2(data);
      if (myLineChart) {
        myLineChart.setOption({
          xAxis: {
            data: data.map(it => it.date)
          },

          yAxis: {
            type: "value"
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top"
              },
              data: data.map(it => it.sumConfirm)
            },
            {
              type: "line",
              data: data.map(it => it.sumConfirm)
            }
          ]
        });
      }
      if (myChart) {
        myChart.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>{c}"
          },
          yAxis: {
            type: "value"
          },
          legend: {
            data: ["疑似", "确诊", "死亡", "治愈", "累加确诊"]
          },
          xAxis: {
            data: data.map(it => it.date)
          },
          series: [
            {
              name: "确诊",
              type: "line",
              data: data.map(it => it.confirm)
            },
            {
              name: "死亡",
              type: "line",
              data: data.map(it => it.dead)
            },
            {
              name: "治愈",
              type: "line",
              data: data.map(it => it.heal)
            },
            {
              name: "疑似",
              type: "line",
              data: data.map(it => it.suspect)
            },
            {
              name: "累加确诊",
              type: "line",
              data: data.map(it => it.sumConfirm)
            }
          ]
        });
      }
    }
  },
  mounted() {
    this.initLineData();
  }
};
</script>

<style scoped>
.red {
  color: red;
}
.mydata {
  position: relative;
  z-index: 999999;
}
.back {
  font-size: 20px;
  margin-top: -30px;
  margin-left: 30px;
  cursor: pointer;
  position: relative;
  z-index: 8888;
}
@media (min-width: 720px) {
  .map-top-left {
    width: 100%;
  }
  .map-top-right {
    width: 100%;
  }
  .back {
    margin-top: 0px;
  }
}
@media screen and (min-width: 1440px) {
  .top {
    height: 300px;
  }
  .map-top-left {
    float: left;
    width: calc(100% - 305px);
    height: 300px;
  }
  .map-top-right {
    float: left;
    width: 300px;
  }
}
</style>
