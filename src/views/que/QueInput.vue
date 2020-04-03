<template>
    <!--试题录入页面-->
    <div>
        <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="手动录入" name="singleaddque">
                <SingleAddQue v-if="isChildUpdate1"></SingleAddQue>
            </el-tab-pane>
            <el-tab-pane label="批量导入" name="multiaddque">
                <MultiAddQue v-if="isChildUpdate2"></MultiAddQue>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
    import SingleAddQue from "../../components/que/SingleAddQue";
    import MultiAddQue from "../../components/que/MultiAddQue";
    export default {
        name: "QueInput",
        data(){
            return{
                activeName:'singleaddque',
                isChildUpdate1:true,
                isChildUpdate2:false,
            }
        },
        components:{
            SingleAddQue,
            MultiAddQue,
        },methods:{
            handleClick(tab){
                if(tab.name=="singleaddque"){
                    this.isChildUpdate1=true;
                    this.isChildUpdate2=false;
                }else if(tab.name=="multiaddque"){
                    this.isChildUpdate1=false;
                    this.isChildUpdate2=true;
                }
            }
        }
    }
</script>

<style scoped>

</style>