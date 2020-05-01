<template>
    <div><!--试卷审核-->
        <div><!--试题审核页面-->
            <br>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="提交试卷审核" name="receivedpapercheck">
                    <SubmittedPaperCheck v-if="isChildUpdate1"></SubmittedPaperCheck>
                </el-tab-pane>
                <el-tab-pane label="收到试卷审核" name="submittedpapercheck">
                    <ReceivedPaperCheck v-if="isChildUpdate2"></ReceivedPaperCheck>
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
                activeName:'receivedpapercheck',
                isChildUpdate1:true,
                isChildUpdate2:false,
            }
        },methods:{
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