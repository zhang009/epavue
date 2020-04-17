<template>
    <div>
        试卷创建
        <router-link to="/pap/create/test1">
            <el-button  icon="el-icon-plus" type="primary">手工组卷</el-button>
        </router-link>
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: "PaperCre",
        data(){

            return{

            }
        },mounted(){

        },
        created() {


        },
            watch: {
                /* $route: {
                     handler: function(route) {
                         console.log(route)
                     },
                     immediate: true
                 }*/


        },mounted() {
            console.log(this.$route);
            console.log(  this.$router.options);
            console.log(this.$router.options.routes[0].children);
            console.log(this.$route.path);


        },methods:{

        }
    }
</script>

<style scoped>

</style>