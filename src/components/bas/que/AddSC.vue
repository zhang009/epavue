<template>
    <div><!--添加单选-->
        单选
        <el-form
                :model="updateMainQueInfo"

                label-position="top"
                label-width="120px"
                style="margin: 0px auto">
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="题干:" prop="term"  >
                        <vue-ueditor-wrap v-model="content" :config="myConfig"></vue-ueditor-wrap>
                    </el-form-item>
                </el-col>
            </el-row>


        </el-form>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'
    export default {
        name: "AddSC",
        components: {VueUeditorWrap},
        data(){
            return{

                updateMainQueInfo:{
                    courseId:''
                },
                myConfig: {
                    // 如果需要上传功能,找后端小伙伴要服务器接口地址
                    // serverUrl: this.$config.baseUrl + 'ueditor/ueditorConfig',
                    // serverUrl: 'http://localhost:8090/ueditor/ueditorConfig',
                    // 你的UEditor资源存放的路径,相对于打包后的index.html
                    UEDITOR_HOME_URL: '/ueditor/',
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 工具栏是否可以浮动
                    autoFloatEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 340,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 关闭自动保存
                    enableAutoSave: true
                },
                content: ''
            }
        }
    }
</script>

<style scoped>

</style>