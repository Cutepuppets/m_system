import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'


Vue.prototype.$http = axios

axios.defaults.baseURL='http://api.jianbang.yang:10100/api/'
axios.defaults.withCredentials=true //不加此参数或导致跨域post请求后端接受不到数据
//设置拦截器,设置每次发送请求都必须带上token
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
