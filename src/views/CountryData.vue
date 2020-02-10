<template>
  <table class="mydata" width="100%">
    <thead>
      <tr>
        <th>国家</th>
        <th>确诊</th>
        <th>死亡</th>
        <th>治愈</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, idx) in countryDatas" :key="idx">
        <td>{{it.name}}</td>
        <td :style="'color:'+text(it.confirm)">{{it.confirm}}</td>
       <td :style="'color:'+text(it.dead)">{{it.dead}}</td>
        <td :style="'color:'+text(it.heal)">{{it.heal}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {showText} from './tools'
export default {
  props: ["countryDatas"],
  methods:{
      text(d){
         return showText(d?d:0)
      }
  }
};
</script>

<style>
</style>
