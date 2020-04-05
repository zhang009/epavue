<template>
    <div><!--添加单选-->

        <el-form
                :model="updateMainQueInfo"

                label-position="top"
                label-width="120px"
                style="margin: 0px auto">
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="题干:" prop="term"  >
                        {{updateMainQueInfo.term}}
                        <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.term"
                                        :disabled="disabled"
                                        @onClick="onClick">
                        </tinymce-editor>
                        <button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    import TinymceEditor from '../tinymce-editor'
    export default {
        name: "AddSC",
        components: {TinymceEditor},
        mounted() {

        },
        data(){
            return{
                msg: 'Welcome to Use Tinymce Editor',
                disabled: false,
                updateMainQueInfo:{
                    term:''
                },
            }
        },
        methods: {
            // 鼠标单击的事件
            onClick (e, editor) {
                console.log('Element clicked')
                console.log(e)
                console.log(editor)
            },
            // 清空内容
            clear () {
                this.$refs.editor.clear()
            }
        }
    }
</script>

<style scoped>

</style>