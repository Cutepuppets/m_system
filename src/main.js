import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'


Vue.prototype.$http = axios

axios.defaults.baseURL='http://api.jianbang.yang:10100/api/user/'
axios.defaults.withCredentials=true //不加此参数或导致跨域post请求后端接受不到数据
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
