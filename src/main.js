import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueJsonp from 'vue-jsonp'
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(VueJsonp)
Vue.prototype.http=axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
