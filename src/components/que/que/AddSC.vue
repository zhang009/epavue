<template xmlns:el-col="http://www.w3.org/1999/html">
    <div><!--添加单选-->

        <el-form
                ref="scMainForm"
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
                                placeholder="请输入内容"
                                v-model="updateMainQueInfo.stem">
                        </el-input>

                        <!--<tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.stem"

                                        @onClick="onClick">
                        </tinymce-editor>-->
                        <!--<button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="选项:"   >

                       <!-- <div v-for="(item,index) in updateMainQueInfo.options">
                            <el-row style="margin-top: 10px">
                                <el-col :span="1">
                                    <span>{{optionNum[index]}}</span>
                                </el-col>
                                <el-col :span="18">
                                    <el-input size="large" v-model="item.name" style=""></el-input>
                                </el-col>
                                <el-col :span="5">

                                    <el-radio v-model="updateMainQueInfo.radio" :label="index+1" border style="margin-left: 20px">设为答案</el-radio>
                                </el-col>
                            </el-row>
                        </div>-->
                        <div>
                            <el-row style="margin-top: 10px">
                                <el-col :span="1">
                                    <span>A.</span>
                                </el-col>
                                <el-col :span="18">
                                    <el-form-item   prop="option1" >
                                    <el-input size="large" v-model="updateMainQueInfo.option1" style=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">

                                    <el-radio v-model="updateMainQueInfo.answer" label="A" border style="margin-left: 20px" prop="answer" >设为答案</el-radio>

                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <el-row style="margin-top: 10px">
                                <el-col :span="1">
                                    <span>B.</span>
                                </el-col>
                                <el-col :span="18">
                                    <el-form-item   prop="option2" >
                                    <el-input size="large" v-model="updateMainQueInfo.option2" style="" prop="option2"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-radio v-model="updateMainQueInfo.answer" label="B" border style="margin-left: 20px" prop="answer" >设为答案</el-radio>
                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <el-row style="margin-top: 10px">
                                <el-col :span="1">
                                    <span>C.</span>
                                </el-col>
                                <el-col :span="18">
                                    <el-input size="large" v-model="updateMainQueInfo.option3" style="" prop="option3"></el-input>
                                </el-col>
                                <el-col :span="5">
                                    <el-radio v-model="updateMainQueInfo.answer" label="C" border style="margin-left: 20px" prop="answer" >设为答案</el-radio>
                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <el-row style="margin-top: 10px">
                                <el-col :span="1">
                                    <span>D.</span>
                                </el-col>
                                <el-col :span="18">
                                    <el-input size="large" v-model="updateMainQueInfo.option4" style="" prop="option4"></el-input>
                                </el-col>
                                <el-col :span="5">
                                    <el-radio v-model="updateMainQueInfo.answer" label="D" border style="margin-left: 20px" prop="answer" >设为答案</el-radio>
                                </el-col>
                            </el-row>
                        </div>

                        <!--<button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="解析:"   >
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入解析"
                                v-model="updateMainQueInfo.analysis">
                        </el-input>
                      <!--  <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.analysis"

                                        @onClick="onClick">
                        </tinymce-editor>-->
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
        name: "AddSC",
        components: {TinymceEditor,TinymceOptioneditor},
        props:{
            scMainQueInfo:{
                stem:'',
                option1:'',
                option2:'',
                option3:'',
                option4:'',
                answer:'A',//设为答案的序号
                analysis:'',
            },
        },
        mounted() {

        },
        watch:{//监听父组件传入的值
            'scMainQueInfo':function (val) {
                this.updateMainQueInfo=val;
            }
        },
        data(){
            return{
                updateMainQueInfo:this.scMainQueInfo,
                rules:{
                    stem: [{required: true, message: '请输入题干', trigger: 'blur'}],
                    option1: [{required: true, message: '请输入选项A', trigger: 'blur'}],
                    option2: [{required: true, message: '请输入选项B', trigger: 'blur'}],
                    answer: [{required: true, message: '请选择答案', trigger: 'blur'}],

                },


                msg: 'Welcome to Use Tinymce Editor',
                optionSelectNum:4,
                optionNum:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."]
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
                this.$refs.scMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        this.$emit('submitInfo',this.updateMainQueInfo);
                    }
                });
            },
            checkData(){
                var isContinue=false;
                this.$refs.scMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                       isContinue=true;
                    }
                });
                return isContinue;
            },
            emptyData(){
                this.scMainQueInfo.stem='';
                this.scMainQueInfo.answer='A';
                this.scMainQueInfo.analysis='';
                this.scMainQueInfo.option1='';
                this.scMainQueInfo.option2='';
                this.scMainQueInfo.option3='';
                this.scMainQueInfo.option4='';
            }
        }
    }
</script>

<style scoped>

</style>