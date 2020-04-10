<template>
    <div><!--添加多选组件-->
        <el-form
                ref="mcMainForm"
                :model="updateMainQueInfo"
                :rules="rules"
                label-position="top"
                label-width="120px"
                style="margin: 0px auto">
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="题干:" prop="stem"  >
                        <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.stem"
                                        @onClick="onClick">
                        </tinymce-editor>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="选项:"   prop="options">
                        <el-tag size="large" style="margin-left: 36px">选项个数</el-tag>
                        <el-select v-model="optionSelectNum"
                                   placeholder="请选择"
                                   @change="selectOptionNumChanged"
                                   style="width: 80px">

                            <el-option
                                    v-for="item in optionNum"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                         <div v-for="(item,index) in updateMainQueInfo.options">

                             <el-row style="margin-top: 10px">
                                 <el-col :span="1">
                                     <span>{{optionChar[index]}}</span>
                                 </el-col>
                                 <el-col :span="23">
                                     <el-form-item   :prop="'options.'+index+'.optionContent'" :rules="rules.option" >
                                     <el-input size="large" v-model="item.optionContent" style=""></el-input>
                                     </el-form-item>
                                 </el-col>
                                 <!--<el-col :span="3">
                                     <el-checkbox v-model="item.id" label="设为答案" border style="margin-left: 20px" prop="answer"></el-checkbox>
                                 </el-col>-->
                             </el-row>
                         </div>


                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="答案:"   :min="2" :prop="'answer'" >
                        <el-checkbox-group v-model="answer" size="small"  >
                            <el-checkbox-button v-for="(item,index) in answerChar3" :label="item" :key="item" @change="selectAnswerChange"  ></el-checkbox-button>

                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="margin-top: 0px">
                    <el-form-item label="解析:"   >
                        <tinymce-editor ref="editor"
                                        v-model="updateMainQueInfo.analysis"

                                        @onClick="onClick">
                        </tinymce-editor>

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
        name: "AddMC",
        components: {TinymceEditor,TinymceOptioneditor},
        props:{
            mcMainQueInfo:{
                stem:'',
                options:[],
                answer:'',//设为答案的序号
                analysis:'',
            },
        },
        mounted() {
            this.selectOptionNumChanged();
        },
        watch:{//监听父组件传入的值
            'mcMainQueInfo':function (val) {
                this.updateMainQueInfo=val;
            }
        },
        data(){
            const checkAnswer = (rule,value,callback) => {//自定义多选验证规则

                var s=value;
                var n=(s.split('')).length;

                if(n<1) {
                    return callback(new Error('请选择试题答案'));
                }else{

                    if(n>=2) {
                        callback();
                    }else{
                        return callback(new Error('多选答案至少选择两项！'));
                    }
                }
            };
            return{


                updateMainQueInfo:this.mcMainQueInfo,
                rules:{
                    stem: [{required: true, message: '请输入题干', trigger: 'blur'}],
                    option: [{required: true, message: '请输入选项内容', trigger: 'blur'}],
                    answer: [{validator:checkAnswer, required: true, trigger: 'blur'}],
                },
                optionSelectNum:4,//用户下拉框选择的选项数目
                optionNum:[2,3,4,5,6,7,8,9,10],//用户可选择的选项数
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//选项前的字母序号
                answerChar2:['A',"B", "C","D","E","F","G","H","I","J"],//答案的字母序号
                answerChar3:['A',"B", "C","D"],//答案选中的字母序号
                answer:[],
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
            selectOptionNumChanged(){
                this.updateMainQueInfo.options=[];//清空
                this.answerChar3=[];
                for(var i=0;i<this.optionSelectNum;i++){
                    this.updateMainQueInfo.options.push({optionNum:i+1,optionContent:''});
                    this.answerChar3.push(this.answerChar2[i]);
                }
            },
            selectAnswerChange(){
              /*  console.log('this.answer:'+this.answer);*/
                //当点击答案多选时，需要把数组答案转化为字符串,如何[A,B]转化为AB
                var arr=new Array();
               /* for(var i=0;i<this.answer.length;i++){
                    for(var j=0;j<this.answerChar2.length;j++){
                        if(this.answer[i]==this.answerChar2[j]){
                            arr.push(j+1);
                        }
                    }
                }*/
                this.updateMainQueInfo.answer=this.answer.join("");//数组转换为字符串

            },
            submit(){//试题保存点击事件
                this.$refs.mcMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        this.$emit('submitInfo',this.updateMainQueInfo);
                    }
                });
            },
            checkData(){
                var isContinue=false;
                this.$refs.mcMainForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                    if (valid) {
                        isContinue=true;
                    }
                });
                return isContinue;
            },
            emptyData(){
                this.mcMainQueInfo.stem='';
                this.mcMainQueInfo.answer='';
                this.mcMainQueInfo.analysis='';
                this.mcMainQueInfo.options=[];
            },

        }
    }
</script>

<style scoped>

</style>