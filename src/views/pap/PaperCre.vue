<template xmlns="http://www.w3.org/1999/html">
    <div>
        <el-divider></el-divider>
        <div><h2>创建试卷</h2></div>
       <div class="content2">


            <!--<router-link to="/que/input/importque">-->
            <router-link to="/pap/create/hand">
                <el-button   type="primary" size="large" style="margin-right: 10px">手工组卷</el-button>
            </router-link>
            <router-link to="/pap/create/auto">
           <el-button   type="primary" size="large">自动组卷</el-button>
       </router-link>
        </div>
      <!--  <router-view/>-->
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

<style >
    .content2{
     /*   background-color: #dedede;*/
        display: flex;
        align-items:center;
        justify-content:center;


        text-align: justify;
        width: 300px;
        height: 400px;
        margin:0 auto;

    }

</style>