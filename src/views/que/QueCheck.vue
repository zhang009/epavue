<template>
    <div><!--试题审核页面-->
        <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="收到的试题审核" name="receivedcheck">
                <ReceivedCheck v-if="isChildUpdate1"></ReceivedCheck>
            </el-tab-pane>
            <el-tab-pane label="提交的试题审核" name="submittedcheck">
                <SubmittedCheck v-if="isChildUpdate2"></SubmittedCheck>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ReceivedCheck from "../../components/que/ReceivedCheck";
    import SubmittedCheck from "../../components/que/SubmittedCheck";

    export default {
        name: "QueCheck",
        components:{
            ReceivedCheck,
            SubmittedCheck
        },
        data(){
            return{
                activeName:'receivedcheck',
                isChildUpdate1:true,
                isChildUpdate2:false,
            }
        },methods:{
            handleClick(tab){
                if(tab.name=="receivedcheck"){
                    this.isChildUpdate1=true;
                    this.isChildUpdate2=false;
                }else if(tab.name=="submittedcheck"){
                    this.isChildUpdate1=false;
                    this.isChildUpdate2=true;
                }
            }
        }
    }
</script>

<style scoped>

</style>