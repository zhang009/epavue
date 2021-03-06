import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import QueImport from "../views/que/QueImport";
import TeacherInfo from "../views/TeacherInfo";



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true //进行菜单渲染的时候跳过此路径
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden:true,
    meta:{
      roles:['admin','user']
    },
    children:[{
      path:'/teacherinfo',
      name:'教师用户个人中心',
      component:TeacherInfo,
      hidden:true
    }]
  }/*{
    path: '/que/input/importque',
    name: 'importque',
    component: QueImport
  }*/
  /*{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
  }*/
]

const router = new VueRouter({
  routes
})

export default router
