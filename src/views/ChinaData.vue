<template>
  <table class="mydata" width="100%" style="margin-top:12px;">
    <thead>
      <tr>
        <th>地区</th>
        <th>确诊</th>
        <th>死亡</th>
        <th>治愈</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(it, idx) in chinaDatas">
        <tr :key="idx + it.id" style="background-color:#eee;">
          <td
            @click="toggleItem(it)"
            style="cursor:pointer;width:20%;font-weight: bold;"
          >
            {{ it.name }}
            <i class="el-icon-arrow-down" v-show="it.showChild"></i>
            <i class="el-icon-arrow-right" v-show="!it.showChild"></i>
          </td>
          <td :style="'color:' + text(it.confirmedNum)">
            {{ it.confirmedNum }}
          </td>
          <td :style="'color:' + text(it.deathsNum)">
            {{ it.deathsNum ? it.deathsNum : "0" }}
          </td>
          <td :style="'color:' + text(it.curesNum)">
            {{ it.curesNum ? it.curesNum : "0" }}
          </td>
        </tr>

        <tr
          v-for="(itt, idxx) in it.cities"
          :key="itt.name + (itt.id ? itt.id : it.id) + idxx"
          v-show="it.showChild"
        >
          <td align="right" style="text-align:right">{{ itt.name }}</td>
          <td :style="'color:' + text(itt.confirmedNum)">
            {{ itt.confirmedNum }}
          </td>
          <td :style="'color:' + text(itt.deathsNum)">
            {{ itt.deathsNum ? itt.deathsNum : "0" }}
          </td>
          <td :style="'color:' + text(itt.curesNum)">
            {{ itt.curesNum ? it.curesNum : 0 }}
          </td>
        </tr>

        <tr :key="'line-' + it.id" v-show="it.showChild">
          <td colspan="4">
            <div :id="'line' + it.id" style="width:100%;height:300px"></div>
            <div :id="'bar' + it.id" style="width:100%;height:300px"></div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import { showText } from "./tools";
export default {
  props: ["chinaDatas"],
  data() {
    return {
      lines: {}
    };
  },
  methods: {
    text(d) {
      return showText(d ? d : 0);
    },
    toggleItem(it) {
      it.showChild = !it.showChild;
      if (!it.showChild) {
        return;
      }
      setTimeout(() => {
        this.showLineChart(it);
        this.showBarChart(it);
      }, 200);
    },
    showBarChart2(it) {
      let key = "bar" + it.id;
      let chart = null;
      if (!this.lines[key]) {
        chart = window.echarts.init(document.getElementById(key));
        this.lines[key] = chart;
      }
      chart = this.lines[key];
      let data = it.series.map(it => it).reverse();
      data[0].total = 0;
      for (let i = 1; i < data.length; i++) {
        data[i].total = +data[i].confirmedNum - data[i - 1].confirmedNum;
      }
      chart.setOption({
        xAxis: {
          data: data.map(it => it.date.replace("2020-", ""))
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
            data: data.map(it => it.total)
          },
          {
            type: "line",
            data: data.map(it => it.total)
          }
        ]
      });
    },
    showBarChart(it) {
      let key = "bar" + it.id;
      let chart = null;
      if (!this.lines[key]) {
        chart = new window.G2.Chart({
          container: key,
          forceFit: true,
          height: 300
        });
        this.lines[key] = chart;
      }
      chart = this.lines[key];
      let data = it.series
        .map(it => {
          it.date = it.date.replace("2020-", "");
          return it;
        })
        .reverse();

      data[0].total = 0;
      for (let i = 1; i < data.length; i++) {
        data[i].total = +data[i].confirmedNum - data[i - 1].confirmedNum;
      }

      chart.source(data);
      chart.legend(false);

      chart
        .interval()
        .position("date*total")
        .color("#3182bd");

      chart
        .line()
        .position("date*total")
        .color("red")
        .tooltip(false);

      chart
        .point()
        .position("date*total")
        .color("#fdae6b")
        .label("total", {
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
    showLineChart(it) {
      let key = "line" + it.id;
      let chart = null;
      if (!this.lines[key]) {
        chart = new window.G2.Chart({
          container: key,
          forceFit: true,
          height: 300
        });
        this.lines[key] = chart;
      }
      chart = this.lines[key];
      let data = it.series
        .map(it => {
          it.date = it.date.replace("2020-", "");
          return it;
        })
        .reverse();
      chart.source(data);
      chart.legend(false);

      chart
        .line()
        .position("date*confirmedNum")
        .color("red")
        .tooltip(false);

      chart
        .line()
        .position("date*deathsNum")
        .color("#000")
        .tooltip(false);

      chart
        .line()
        .position("date*curesNum")
        .color("green")
        .tooltip(false);

      chart.repaint();
      chart.render();
    },
    showLineChart2(it) {
      let key = "line" + it.id;
      let chart = null;
      if (!this.lines[key]) {
        chart = window.echarts.init(document.getElementById(key));
        this.lines[key] = chart;
      }
      chart = this.lines[key];
      let data = it.series.map(it => it).reverse();
      chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c}"
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: ["确诊", "死亡", "治愈"]
        },
        xAxis: {
          data: data.map(it => it.date.replace("2020-", ""))
        },
        series: [
          {
            name: "确诊",
            type: "line",
            data: data.map(it => it.confirmedNum)
          },
          {
            name: "死亡",
            type: "line",
            data: data.map(it => it.deathsNum)
          },
          {
            name: "治愈",
            type: "line",
            data: data.map(it => it.curesNum)
          }
        ]
      });
    }
  }
};
</script>

<style></style>
