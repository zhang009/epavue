import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postRequest=postRequest;//这里是引用，不是方法调用
Vue.prototype.postKeyValueRequest=postKeyValueRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;


Vue.config.productionTip = false

Vue.use(ElementUI,{size:'small'});

router.beforeEach((to,from,next)=>{//前置导航守卫
    /* console.log(to);
     console.log(from);
     next();//相当于过滤器链，让页面继续往下走*/
    if(to.path=="/"){//如果跳转的页面是login页面，则不用处理
      next();
    }else{
        if(window.sessionStorage.getItem("user")){
            initMenu(router,store); //如果store里面有数据，则是一次正常的跳转，不是用户按了F5的跳转
            next();
            //测试冲突
        }else {
            console.log("to:"+to);
            //next("/");//没有登陆，跳转到登录页面
            next('/?redirect='+to.path);//如果指定了路径，但没有登录，接下来到Login.vue中去判断是否登录之后跳转到指定页面
        }

    }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
