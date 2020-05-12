<template>
    <div><!--教师用户个人中心-->
        <el-divider></el-divider>
        <el-card class="box-card" style="width: 400px">
            <div slot="header" class="clearfix">
                <span>{{teacher.name}}</span>

            </div>

            <div>
                <div>
                  <img title="点击修改头像" :src="teacher.userface" style="width: 100px;height: 100px;border-radius: 50px" alt="头像">
                </div>
                <div>
                    电话号码：<el-tag>{{teacher.phone}}</el-tag>
                </div>
                <div>
                    邮箱：<el-tag>{{teacher.email}}</el-tag>
                </div>
                <div>
                    用户角色：<el-tag
                                v-for="(r,index) in teacher.roles"
                                type="success"
                                style="margin-right: 5px"
                                :key="index">
                                {{r.nameZh}}
                            </el-tag>
                </div>
                <div style="display: flex;justify-content: space-around;margin-top: 20px">
                    <el-button type="primary">修改信息</el-button>
                    <el-button type="primary">修改密码</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "TeacherInfo",
        data(){
            return{
                teacher:null,
            }
        },
        mounted() {
            this.initTeacher();
        },
        methods:{
            initTeacher(){
                this.getRequest('/teacher/info').then(resp=>{
                    if(resp){
                        this.teacher=resp;
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>