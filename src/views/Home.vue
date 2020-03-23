<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">
                    试卷分析系统
                </div>
                <el-dropdown class="userInfo" @command="commandHandler">
                      <span class="el-dropdown-link">
                          {{user.name}}<i ><img :src="user.userface"> </i><!--：为v-module的简写-->
                      </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--<el-menu @select="menuClick">-->
                    <el-menu router unique-opened><!--左侧菜单栏-->
                            <!--default-active="2"默认打开的菜单项，这里关闭-->
                            <!--class="el-menu-vertical-demo"菜单的样式-->
                           <!-- @open="handleOpen"
                            @close="handleClose">菜单打开和关闭时的回调，这里都不需要-->
                        <!--上面el-menu中的router属性是点击跳转属性，加了之后就不用加@select="menuClick",当点击的时候，会自动把index做为路径跳转-->
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
                            <!--this.$router.options.routes获得的是rounter数组，item.hidden就是route中的hidden属性，这里为false的时候，不渲染该路径，即跳过/和/Home-->
                            <template slot="title"><!--一级导航-->
                                <i style="color:#409eff; margin-right:5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                                <!--二级导航-->
                                <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <!--面包屑导航-->
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到试卷分析系统！
                    </div>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {//export default 表示只能导出一个默认模块，这个模块为匿名
        name: "Home",
        data(){
            return{
                user:JSON.parse(window.sessionStorage.getItem("user"))//获取user,并转成json对象
            }
         },
        computed:{
            routes(){
                return this.$store.state.routes;//拿到渲染后的菜单项
            }
        },
        methods:{
           /* menuClick(index,indexPath){这里是左侧菜单点击事件
               /!* console.log(index);
                console.log(indexPath);*!/
               this.$router.push(index);
            },*/
            commandHandler(cmd){//顶栏下拉框处理事件

                if(cmd=='logout'){
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       //注销
                        this.getRequest("/logout");//以前我们自定义的方法
                        window.sessionStorage.removeItem("user");
                        this.$router.replace("/");//回到登录页面
                        this.$store.commit('initRoutes', []);//清空存储的菜单数据
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style >
    .homeWelcome{
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #409eff;
        padding-top: 50px;
    }
    .homeHeader{
        background-color: cornflowerblue;
        display: flex;
        align-items: center;/*垂直方向居中*/
        justify-content: space-between;/*设置主轴上的对齐方式，为两端对齐，项目之间的间隔都相等*/
        padding: 0px 15px;/*上下0px,左右15px*/
        box-sizing: border-box;
    }
    .title{
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff;

    }
    .homeHeader.userInfo{
        cursor: pointer ;/*变为手指*/

    }
    .el-dropdown-link img{
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }
    .el-dropdown-link{
        display: flex;
        align-items: center;
    }

</style>