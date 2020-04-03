<template>
    <div>

        <div style="border:1px solid #eee">
            <div style="padding-top: 10px;padding-left: 10px;display: flex;justify-content: space-between;">
                创建试题
                <div style="margin-right: 20px;margin-bottom: 10px">
                    <el-button plain>保存</el-button>
                    <el-button type="primary" plain>取消</el-button>
                </div>
            </div>

            <el-container style="border:1px solid #eee">
                <el-main >

                </el-main>
                <el-aside style="width: 38%;background-color: #dedede">

                </el-aside>

            </el-container>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SingleAddQue",
        data(){
            return{
                singleChoice:true,
                multiChoice:false,
                fillBlank:false,
                trueOrFalse:false,
                questionAnswer:false

            }

        }
    }
</script>

<style scoped>

</style>