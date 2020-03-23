import axios from 'axios'
import { Message } from 'element-ui';

/*
* 常见的状态码：
* 401：未登录
* 403：token过期，登录过期对用户进行进行提示
* 404：请求不存在
*
* */

//封装响应拦截器
axios.interceptors.response.use(success=>{
    /*http响应码，是200的会进入到这里，如果是其他的则会进入到error里面
        但是我们要知道，即使，进入到这里，也不一定是成功的，如账户被锁定、密码过期、账户过期、账户被禁用，但相应码依然是200
        可以对照jQuery里面的ajax来理解*/
    if(success.status&&success.status==200&&success.data.status==500)//success.data.status这里status是返回后端json的状态码
    {
        //这里是业务上的错误
        Message.error({message:success.data.msg})//提示服务端respBean的msg属性内容
        return;//注意这里return为空，所以一会在处理时如果返回为空的话，则为请求失败
    }

    if(success.data.msg){//如果服务端返回msg,则前端提示，不返回则不提示
        Message.success({message:success.data.msg});
    }
    return success.data;
},error => {
    if(error.response.status==504||error.response.status==404){
        Message.error({message:'服务器不知道去哪了！！！( ╯□╰ )'})
    }else if(error.response.status==403){
        Message.error({message:'权限不足，请联系管理员'})
    }else if(error.response.status==401){
        Message.error({message:'尚未登录，，，，请登录'})
    }else {
        if(error.response.data.msg){//如果服务端返回的有错误信息,则展示服务端返回过来的错误信息
            Message.error({message:error.response.data.msg})
        }else{
            Message.error({message:'未知错误'});
        }
    }
    return;
})
//封装请求拦截器,该方法在登录Login.vue页面中使用
let base='';//以便后期需要时方便加前缀
//登录请求的话默认只支持keyvalue传参，不支持json（当然可以改后端代码让其支持，这里不再修改）
//请求的话这里封装有两个，登录的话用keyvalue形式传参，其他的请求使用json
export const postKeyValueRequest = (url, params) => {//请求地址，请求参数
    return axios({
        method: 'post',
        url: `${base}${url}`,//注意这里`不是单引号，是数字1前面的符号，在这里表示变量
        data: params,
        transformRequest: [function (data) {//这里是把json转换为keyvalue
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
//封装传递json的post
export const postRequest=(url,params)=>{
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的put
export const putRequest=(url,params)=>{
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的get
export const getRequest=(url,params)=>{
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    });
}
//封装传递json的delete
export const deleteRequest=(url,params)=>{
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    });
}