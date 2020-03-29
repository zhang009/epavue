<template>
    <!--班级管理-->
    <div>
       <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="班级管理" name="clamana">
                <ClaMana v-if="isChildUpdate1"></ClaMana>
            </el-tab-pane>
            <el-tab-pane label="专业管理" name="majmana">
                <MajMana v-if="isChildUpdate2"></MajMana>
            </el-tab-pane>
            <el-tab-pane label="学院管理" name="schmana">
                <SchMana v-if="isChildUpdate3"></SchMana>
            </el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>

   import SchMana from "../../components/bas/SchMana";
   import MajMana from "../../components/bas/MajMana";
   import ClaMana from "../../components/bas/ClaMana";
    export default {
        name: "BasClass",
        data(){
            return{
                activeName:'clamana',
                isChildUpdate1:true,
                isChildUpdate2:false,
                isChildUpdate3:false,
            }
        },
        components:{
            SchMana,
            MajMana,
            ClaMana
        },
        methods:{
            handleClick(tab){
                if(tab.name=="clamana"){
                    this.isChildUpdate1=true;
                    this.isChildUpdate2=false;
                    this.isChildUpdate3=false;
                }else if(tab.name=="majmana"){
                    this.isChildUpdate1=false;
                    this.isChildUpdate2=true;
                    this.isChildUpdate3=false;
                }else if(tab.name=="schmana"){
                    this.isChildUpdate1=false;
                    this.isChildUpdate2=false;
                    this.isChildUpdate3=true;
                }
            }
        }
    }
</script>

<style >

</style>