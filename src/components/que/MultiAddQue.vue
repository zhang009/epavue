<template>
    <div><!--批量导入试题-->
        <div class="content" style="">

            <div>
                <h2>Excel批量导入试题</h2>
                <el-button type="primary">上传文件</el-button>
                <el-button type="primary" plain>下载模板</el-button>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "MultiAddQue"
    }
</script>

<style >

    .content{
     /*   background-color: #dedede;*/
        display: flex;
        align-items:center;
        justify-content:center;

        text-align: justify;
        width: 300px;
        height: 500px;
        margin:0 auto;

    }


</style>