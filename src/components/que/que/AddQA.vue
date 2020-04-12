<template>
    <div><!--添加问答题组件-->
        <el-form
                ref="qaMainForm"
                :model="updateMainQueInfo"
                :rules="rules"
                label-position="top"
                label-width="120px"
                style="margin: 0px auto">
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="题干:" prop="stem"  >

                        <!--<tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.stem"

                                        @onClick="onClick">
                        </tinymce-editor>-->
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入题干"
                                v-model="updateMainQueInfo.stem">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="答案:"   prop="answer">
                        <!--<tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.answer">
                        </tinymce-editor>-->
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入答案"
                                v-model="updateMainQueInfo.answer">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="解析:"   >
                        <!--<tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.analysis">
                        </tinymce-editor>-->
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入解析"
                                v-model="updateMainQueInfo.analysis">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>

<script>
    import TinymceEditor from '../tinymce-editor'
    import TinymceOptioneditor from '../tinymce-optioneditor'
    export default {
        name: "AddQA",
        components: {TinymceEditor,TinymceOptioneditor},
        props:{
            qaMainQueInfo:{
                id:'',
                stem:'',
                answer:'',//设为答案的序号
                analysis:'',
            },
        },
        mounted() {

        },
        watch:{//监听父组件传入的值
            'qaMainQueInfo':function (val) {
                this.updateMainQueInfo=val;
            }
        },
        data(){
            return{
                updateMainQueInfo:this.qaMainQueInfo,
                rules:{
                    stem: [{required: true, message: '请输入题干', trigger: 'blur'}],
                    answer: [{required: true, message: '请填入答案', trigger: 'blur'}],
                    analysis: [{required: true, message: '请填写解析', trigger: 'blur'}],
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
            },

            submit(){//试题保存点击事件
                this.$refs.qaMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        this.$emit('submitInfo',this.updateMainQueInfo);
                    }
                });
            },
            checkData(){
                var isContinue=false;
                this.$refs.qaMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        isContinue=true;
                    }
                });
                return isContinue;
            },
            emptyData(){
                this.qaMainQueInfo.stem='';
                this.qaMainQueInfo.answer='';
                this.qaMainQueInfo.analysis='';

            }
        }
    }
</script>

<style scoped>

</style>