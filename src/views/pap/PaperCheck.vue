<template>
    <div><!--试卷审核-->
        <div><!--试题审核页面-->
            <br>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

                <el-tab-pane label="收到的试卷审核" name="receivedpapercheck" v-if="isCourseCourseManager">
                    <ReceivedPaperCheck v-if="isChildUpdate1"></ReceivedPaperCheck>
                </el-tab-pane>

                <el-tab-pane label="提交的试卷审核" name="submittedpapercheck" >
                    <SubmittedPaperCheck v-if="isChildUpdate2"></SubmittedPaperCheck>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<script>
    import ReceivedPaperCheck from "../../components/pap/ReceivedPaperCheck";
    import SubmittedPaperCheck from "../../components/pap/SubmmitedPaperCheck";

    export default {
        name: "PaperCheck",
        components:{
            ReceivedPaperCheck,
            SubmittedPaperCheck
        },
        data(){
            return{
                activeName:'submittedpapercheck',
                isChildUpdate1:true,
                isChildUpdate2:false,
                isCourseCourseManager:false,//是否是课程负责人
            }
        },mounted() {
            this.initCourseCourseManager();
        },methods:{
            initCourseCourseManager(){//判断是否是课程负责人
                let teacher=JSON.parse(window.sessionStorage.getItem("user"));

                let roles=teacher.roles;

                for (let i = 0; i < roles.length; i++) {
                    let role=roles[i];
                    if(role.name=='ROLE_coursemanager'){
                        this.isCourseCourseManager=true;//
                        return;
                    }
                }
            },
            handleClick(tab){
                if(tab.name=="receivedpapercheck"){
                    this.isChildUpdate1=true;
                    this.isChildUpdate2=false;
                }else if(tab.name=="submittedpapercheck"){
                    this.isChildUpdate1=false;
                    this.isChildUpdate2=true;
                }
            }
        }
    }
</script>

<style scoped>

</style>