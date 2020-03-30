<template>
    <!--章节知识结构管理-->
    <div>
        <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="课程设置" name="coursemana">
                <CourseMana v-if="isChildUpdate1"></CourseMana>
            </el-tab-pane>
            <el-tab-pane label="知识结构设置" name="knowstrumana">
                <KnowStruMana v-if="isChildUpdate2"></KnowStruMana>
            </el-tab-pane>


        </el-tabs>
    </div>
</template>


<script>
    import CourseMana from "../../components/bas/CourseMana";
    import KnowStruMana from "../../components/bas/KnowStruMana";

    export default {
        name: "BasDataStru",
        data(){
            return{
                activeName:'knowstrumana',
                isChildUpdate1:false,
                isChildUpdate2:true,
            }
        },
        components:{
            CourseMana,
            KnowStruMana
        },
        methods:{
            handleClick(tab){
                if(tab.name=="coursemana"){
                    this.isChildUpdate1=true;
                    this.isChildUpdate2=false;
                }else if(tab.name=="knowstrumana") {
                    this.isChildUpdate1 = false;
                    this.isChildUpdate2 = true;
                }
            }
        }
    }
</script>

<style scoped>

</style>