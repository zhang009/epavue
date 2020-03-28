<template>
    <!--班级管理-->
    <div>
       <br>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="班级管理" name="clamana"><ClaMana></ClaMana></el-tab-pane>

            <el-tab-pane label="专业管理" name="majmana"><MajMana></MajMana></el-tab-pane>
            <el-tab-pane label="学院管理" name="schmana"><SchMana></SchMana></el-tab-pane>

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
                activeName:'majmana'
            }
        },
        components:{
            SchMana,
            MajMana,
            ClaMana
        }
    }
</script>

<style >

</style>