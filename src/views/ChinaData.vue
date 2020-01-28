<template>
  <table className="mydata" width="400px" style="margin-top:12px;">
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
        <tr :key="idx">
          <td @click="it.showChild = !it.showChild" style="cursor:pointer;">
            {{ it.area }}
            <i class="el-icon-arrow-down" v-show="it.showChild"></i>
            <i class="el-icon-arrow-right" v-show="!it.showChild"></i>
          </td>
          <td :style="'color:' + text(it.confirm)">{{ it.confirm }}</td>
          <td :style="'color:' + text(it.confirm)">{{ it.dead }}</td>
          <td :style="'color:' + text(it.confirm)">{{ it.heal }}</td>
        </tr>
        <template v-if="it.showChild">
          <tr
            v-for="(itt, idxx) in it.child"
            :key="itt.name + itt.city + itt.area + idxx"
          >
            <td align="right">{{ itt.city }}</td>
            <td :style="'color:' + text(itt.confirm)">{{ itt.confirm }}</td>
            <td :style="'color:' + text(itt.confirm)">{{ itt.dead }}</td>
            <td :style="'color:' + text(itt.confirm)">{{ itt.heal }}</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
import { showText } from "./tools";
export default {
  props: ["chinaDatas"],
  methods: {
    text(d) {
      return showText(d);
    }
  }
};
</script>

<style></style>
