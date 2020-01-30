<template>
  <div>
    <div class="top" style="height:300px;">
      <div
        id="main"
        style="width:calc(100% - 305px);height:300px;float:left"
      ></div>
      <div style="float:left;width:300px">
        <table className="mydata" width="300px" style="margin-top:12px;">
          <thead>
            <tr>
              <th>时间</th>
              <th>确诊<span class="red">(增加)</span></th>
              <th>死亡<span class="red">(增加)</span></th>
              <th>治愈<span class="red">(增加)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it,idx) in lineData" :key="idx">
              <td>{{it.date}}</td>
              <td>{{it.confirm}}<span class="red">({{it.sumConfirm}})</span></td>
              <td>{{it.dead}}<span class="red">({{it.sumDead}})</span></td>
              <td>{{it.heal}}<span class="red">({{it.sumHeal}})</span></td>              
            </tr>
          </tbody>
        </table>
      </div>
      <div class="clear"></div>
    </div>
    <div id="mainMap" style="width:100%;height:600px"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/geo";
import "echarts/map/js/china.js";
export default {
  data() {
    return {
      lineData: [],
      myChart: null,
      myMap: null
    };
  },
  methods: {
    initLineData() {
      debugger;
      let myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },

        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
      this.myChart = myChart;
    },
    initMapData() {
      var myChart2 = echarts.init(document.getElementById("mainMap"));
      // 绘制图表
      myChart2.setOption({
        series: [
          {
            name: "iphoneX",
            type: "map",
            mapType: "china",
            roam: false,
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            },
            data: []
          }
        ]
      });
      this.myMap = myChart2;
    },
    updateChinaData(data) {
      let mapChart = this.myMap;

      if (mapChart) {
        mapChart.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>{c}"
          },
          dataRange: {
            x: "left",
            y: "middle",
            text: ["高", "低"],
            calculable: true
          },
          series: [
            {
              name: "confirm",
              type: "map",
              mapType: "china",
              roam: false,
              label: {
                show: true
              },
              itemStyle: {
                normal: { label: { show: true, formatter: "{b}\n{c}" } },
                emphasis: { label: { show: true, formatter: "{b}\n{c}" } }
              },
              data: data.map(it => {
                return {
                  name: it.area,
                  value: it.confirm
                };
              })
            }
          ]
        });
      }
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
    this.initMapData();
  }
};
</script>

<style scoped>
.red{
  color:red;
}
.mydata{
  position: relative;
  z-index: 999999;
}
</style>
