<template>
    <div>
        <el-form
                v-loading="loading"
                element-loading-text="正在登录"
                element-loading-spinner="el-icon-loading"
                :rules="rules"
                ref="loginForm"
                :model="loginForm"
                class="loginContainer"><!--:等于v-model    :model为表单内的数据对象-->
            <h3 class="loginTitle">试卷分析系统登录</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off" placehoder="请输入用户名："></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off" placehoder="请输入密码：" @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-checkbox  v-model="checked" class="loginRemember"></el-checkbox>
            <el-button  size="normal"type="primary" style="width:100%;" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    import {postKeyValueRequest} from "../utils/api";

    export default {
        name: "Login",
        data(){
            return{
                loading:false,
                loginForm:{
                    username:'admin',
                    password:'123'
                },
                rules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
                    password:[{required:true,message:'请输入密码',trigger:'blur'}]
                },
                checked:true
            }
        },
        methods:{
            submitLogin(){
                this.$refs.loginForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        /*alert('submit!');*/
                        this.loading=true;//加载进度条
                        postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{//then里面的参数即是执行成功返回的数据（被封装后的方法处理过的）
                                if(resp){//这里只需要判断是否有值，即为不为空
                                   // alert(JSON.stringify(resp));
                                    //这里用户的数据保存在js的sessionStorage里面，sessionStorage打开页面关掉就没了
                                    this.loading=false;//加载进度条
                                    window.sessionStorage.setItem("user",JSON.stringify(resp.obj));//第二个参数只能保存字符串,所以这里把json对象转成字符串
                                    let path = this.$route.query.redirect;//获取登录之后是否有重定向的路由路径
                                    if(path=='/'||path==undefined){
                                        this.$router.replace('/home');//页面跳转有两种方法，一个push,一个replace
                                    }else {
                                        this.$router.replace(path);//如果有路径，则登录之后跳转到该页面
                                    }
                                }
                        })
                    } else {
                        console.log('error submit!!');
                        this.$message.error('请输入所有字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style >
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin:180px auto;
        width: 350px;
        padding: 35px 35px 35px 35px;
        background: #fff;
        boder:1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

    }
    .loginTitle{
        margin: 15px auto 40px auto;/*上右下左*/
        text-align: center;
        color: #505458;
    }
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>