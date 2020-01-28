<template>
  <div id="app">   
    <router-view/>
  </div>
</template>

<style>
*{
  font-size: 12px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;  
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

table{
  border-collapse: collapse;
}
td,th{
  border:solid 1px #ddd;
  padding:2px 5px;
  text-align: center;
}
td.bold{font-weight: bold;}
.fs14{font-size: 14;}
table.china-data{
  margin-top:12px;
}
</style>
