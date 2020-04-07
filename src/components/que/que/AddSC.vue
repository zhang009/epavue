<template>
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
                    <el-form-item label="题干:" prop="term"  >
                        {{updateMainQueInfo.term}}
                        <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.term"

                                        @onClick="onClick">
                        </tinymce-editor>
                        <!--<button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="选项:" prop="options"  >

                        <div v-for="(item,index) in updateMainQueInfo.options">
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
                        </div>
                        <!--<button @click="clear">清空内容</button>
                        <button @click="disabled = true">禁用</button>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="解析:" prop="term"  >
                        <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.analysis"

                                        @onClick="onClick">
                        </tinymce-editor>
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
        mounted() {

        },
        data(){
            return{
                props:{
                    rules: [],

                },
                rules:{
                    term: [{required: true, message: '请输入题干', trigger: 'blur'}],
                    options: [{required: true, message: '请输入选项', trigger: 'blur'}],
                },
                updateMainQueInfo:{
                    term:'',
                    options:[{
                        id:1,
                        name:'测试选项1'
                    }, {
                        id:2,
                        name:'测试选项2'
                    },{
                        id:3,
                        name:'测试选项3'
                    },{
                        id:4,
                        name:'测试选项4'
                    }],
                    answerNum:1,//答案个数
                    analysis:'',
                    radio:1,//设为答案的序号

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


            }
        }
    }
</script>

<style scoped>

</style>