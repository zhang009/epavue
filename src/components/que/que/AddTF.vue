<template>
    <div><!--判断-->
        <el-form
                ref="tfMainForm"
                :model="updateMainQueInfo"
                :rules="rules"
                label-position="top"
                label-width="120px"
                style="margin: 0px auto">
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="题干:" prop="stem"  >
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入题干"
                                v-model="updateMainQueInfo.stem">
                        </el-input>
                       <!-- <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.stem"

                                        @onClick="onClick">
                        </tinymce-editor>-->

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="答案:"   prop="answer">
                        <el-radio-group v-model="updateMainQueInfo.answer" size="small" @change="answerSelectChange">
                            <el-radio label="对" border>对</el-radio>
                            <el-radio label="错" border >错</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="解析:"  >
                       <!-- <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.analysis">
                        </tinymce-editor>-->
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入解析"
                                v-model="updateMainQueInfo.analysis">
                        </el-input>
                        <!--<button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>-->
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
        name: "AddTF",
        components: {TinymceEditor,TinymceOptioneditor},
        props:{
            tfMainQueInfo:{
                stem:'',
                answer:'',//设为答案的序号
                analysis:'',
            },
        },
        mounted() {

        },
        watch:{//监听父组件传入的值
            'tfMainQueInfo':function (val) {
                this.updateMainQueInfo=val;
            }
        },
        data(){
            return{
                updateMainQueInfo:this.tfMainQueInfo,
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
                this.$refs.tfMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        this.$emit('submitInfo',this.updateMainQueInfo);
                    }
                });
            },
            checkData(){
                var isContinue=false;
                this.$refs.tfMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        isContinue=true;
                    }
                });
                return isContinue;
            },
            emptyData(){
                this.tfMainQueInfo.stem='';
                this.tfMainQueInfo.answer='';
                this.tfMainQueInfo.analysis='';

            },
            answerSelectChange(){
               /* console.log('this.updateMainQueInfo.answer'+this.updateMainQueInfo.answer);*/
            }
        }
    }
</script>

<style scoped>

</style>