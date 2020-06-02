import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue' 
import Home from '../components/Home.vue' 

Vue.use(Router)



const router = new Router({
  routes:[
    {path:'/', redirect: '/login'},
    {path:'/login', component: Login},
    {path:'/home', component: Home}
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //from 来自 to 去往 next 目的地
  if(to.path ==='/login') return next()
  const token = window.sessionStorage.getItem("token")
  if(!token) return next('/login')
  next()
})

export default router