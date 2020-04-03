import {getRequest} from "./api";


//菜单初始化方法
export const initMenu=(router,store)=>{//第一个参数为router,因为一会儿格式化之后，需要把菜单放到router中去，第二个参数store，因为需要把数据在store保存
    if(store.state.routes.length>0){//也就是store中index.js中的routes的长度大于0，说明有菜单数据
        return;
    }
    getRequest("/system/config/menu").then(data=>{//请求服务端的菜单接口，data为返回过来的数据
        if(data){
            let fmtRoutes=formatRoutes(data);
            console.log(fmtRoutes);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);//调用刚才index.js定义的方法，第一个参数为方法的名字，第二个参数是传入的值
        }
    })
}
//格式化路径
export const formatRoutes=(routes)=>{
    let fmRoutes=[];//最终返回的数据

    routes.forEach(router=>{
        let{
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;//批量的变量定义，相当于let path=router.path ...
        if(children&& children instanceof Array){
            children=formatRoutes(children);//递归调用
        }
        let fmRouter={
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children:children,//这个时候children已经是格式化后的
            component(resolve){
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);//这里也就是相当于vue例子中的动态导入
                } else if (component.startsWith("Ana")) {
                    require(['../views/ana/' + component + '.vue'], resolve);
                } else if (component.startsWith("Gra")) {
                    require(['../views/gra/' + component + '.vue'], resolve);
                } else if (component.startsWith("Pap")) {
                    require(['../views/pap/' + component + '.vue'], resolve);
                } else if (component.startsWith("Que")) {
                    require(['../views/que/' + component + '.vue'], resolve);
                } else if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }else if (component.startsWith("Bas")) {
                    require(['../views/bas/' + component + '.vue'], resolve);
                }

            }
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}