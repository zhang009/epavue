<template xmlns:el-col="http://www.w3.org/1999/html">
    <div>

        <div >
            <div style="padding-top: 10px;padding-left: 10px;">
                创建试题
            </div>
            <el-divider></el-divider>
            <div style="padding-top: 10px;padding-left: 10px;display: flex;justify-content: space-between;">
                <div>
                    试题类型
                    <el-select v-model="queType"
                               filterable
                               placeholder="请选择题型"
                               @change="selectQueTypeChanged"
                               size="mini"
                               style="width: 100px;">
                        <el-option
                                v-for="item in queTypes"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div style="margin-right: 20px;margin-bottom: 10px">
                    <el-button plain>保存</el-button>
                    <el-button type="primary" plain>取消</el-button>
                </div>
            </div>

            <el-container style="border:1px solid #eee;">
                <el-main >
                    <!--el-main这里放置试题信息-->
                    <AddSC v-if="isAddSC"></AddSC>
                    <AddMC v-if="isAddMC"></AddMC>
                    <AddTF v-if="isAddTF"></AddTF>
                    <AddFB v-if="isAddFB"></AddFB>
                    <AddQA v-if="isAddQA"> </AddQA>
                </el-main>
                <!--el-main这里放置试题的设置信息-->
                <el-aside style="width: 38%;background-color: #dedede">
                    <el-scrollbar style="width: 100%"><!--这里是为了解决底部出现的滚动条-->
                            <div>
                                <el-form
                                        :model="updateRightQueInfo"
                                        :rules="rules"
                                        label-position="right"
                                        label-width="120px"
                                        style="margin: 0px auto">
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 20px">

                                            <el-form-item label="所属课程:" prop="courseId"  >

                                                <el-select v-model="updateRightQueInfo.courseId"
                                                           filterable
                                                           placeholder="请选择课程(可搜索）"
                                                           @change="selectCourseChanged"
                                                           size="mini"
                                                           style="width: 250px;">
                                                    <el-option
                                                            v-for="item in courses"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 20px">
                                            <el-form-item label="所属章节:" prop="chapterId"  >
                                                <el-select v-model="updateRightQueInfo.chapterId"
                                                           placeholder="请选择章节"
                                                           @change="selectChapterChanged"
                                                           size="mini"
                                                           style="width: 250px;">
                                                    <el-option
                                                            v-for="item in chapters"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id"><!--这里knows.children为课程列表-->
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 20px">
                                            <el-form-item label="所属知识点:" prop=""  >
                                                <el-cascader
                                                        ref="knowsCascader"
                                                        placeholder="请选择知识点"
                                                        style="width: 250px;"
                                                        :options="knows"
                                                        v-model="selectKnowIds"
                                                        :props="defaultProps"
                                                        @change="selectKnowsChanged"
                                                        clearable>
                                                </el-cascader>
                                                <div style="color: #cac6c6">
                                                    (可选择多个)
                                                </div>

                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 0px">
                                            <el-form-item label="设置试题难度:" prop="dot"  >
                                                <el-select v-model="updateRightQueInfo.dot"
                                                           placeholder="请选择试题难度"
                                                           @change="selectChapterChanged"
                                                           size="mini"
                                                           style="width: 250px;">
                                                    <el-option
                                                            v-for="item in qlevel"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value"><!--这里knows.children为课程列表-->
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                </el-form>
                            </div>
                    </el-scrollbar>
                </el-aside>

            </el-container>
        </div>
    </div>
</template>

<script>
    import AddSC from "./que/AddSC";
    import AddMC from "./que/AddMC";
    import AddQA from "./que/AddQA";
    import AddFB from "./que/AddFB";
    import AddTF from "./que/AddTF";
    export default {
        name: "SingleAddQue",
        components: {
            AddTF,
            AddFB,
            AddQA,
            AddMC,
            AddSC
        }, data(){
            return{
                singleChoice:true,
                multiChoice:false,
                fillBlank:false,
                trueOrFalse:false,
                questionAnswer:false,

                searchValue:{
                    chapterId:'',

                },
                courseKeyword:'',
                courses:[],/*存储根据关键词查找的课程列表*/
                chapters:[],
                updateRightQueInfo:{/*右侧试题设置参数*/
                    courseId:'',//课程id
                    chapterId:'',
                    dot:''
                },
                qlevel:[
                    {value:1,label:'简单'},{value:2,label: '适中'},{value:3,label:'偏难'},{value:4,label: '难'}
                ],
                rules:{
                    courseId: [{required: true, message: '请选择课程', trigger: 'blur'}],
                    chapterId: [{required: true, message: '请选择章节', trigger: 'blur'}],
                    dot:[{required: true, message: '请选择试题难度', trigger: 'blur'}],
                },
                knows:[],//后端根据课程id传过来的章节列表（包含知识点）
                selectKnowIds:[],//获取用户选中的知识点
                chapters:[],
                defaultProps: {
                    multiple:true,
                   /* expandTrigger: 'hover',*/
                    emitPath:false,
                    children: 'children',
                    label: 'name',
                    value:'id'
                },
                queType:'单选题',//选择的试题类型
                queTypes:[{value:'单选题',label:'单选题'},
                    {value:'多选题',label:'多选题'},
                    {value:'判断题',label:'判断题'},
                    {value:'填空题',label:'填空题'},
                    {value:'简答题',label:'简答题'},
                ],
                isAddSC:true,
                isAddMC:false,
                isAddTF:false,
                isAddFB:false,
                isAddQA:false,

            }

        },
        mounted() {
            this.initQue();
            this.initCourse();

        },
        methods:{
            initQue(){
                if(this.queType=='单选题'){
                    this.isAddSC=true;
                    this.isAddMC=false;
                    this.isAddTF=false;
                    this.isAddFB=false;
                    this.isAddQA=false;
                }else if(this.queType=='多选题'){
                    this.isAddSC=false;
                    this.isAddMC=true;
                    this.isAddTF=false;
                    this.isAddFB=false;
                    this.isAddQA=false;
                }else if(this.queType=='判断题'){
                    this.isAddSC=false;
                    this.isAddMC=false;
                    this.isAddTF=true;
                    this.isAddFB=false;
                    this.isAddQA=false;

                }else if(this.queType=='填空题'){
                    this.isAddSC=false;
                    this.isAddMC=false;
                    this.isAddTF=false;
                    this.isAddFB=true;
                    this.isAddQA=false;

                }else if(this.queType=='简答题'){
                    this.isAddSC=false;
                    this.isAddMC=false;
                    this.isAddTF=false;
                    this.isAddFB=false;
                    this.isAddQA=true;
                }
            },
            initCourse(){
                if(!window.sessionStorage.getItem("courses")){
                    this.getRequest('/baseinfo/course/all?classId='+'').then(resp => {
                        if (resp) {
                            this.courses = resp;
                            window.sessionStorage.setItem("courses", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.courses=JSON.parse(window.sessionStorage.getItem("courses"));
                }
            },
            selectCourseChanged(){//课程选中后，根据课程查找到所有的章节和知识点信息
                //获取章节列表
                this.getRequest("/baseinfo/chapter/?courseId="+this.updateRightQueInfo.courseId).then(resp=> {
                    if (resp) {
                        this.chapters=resp;
                    }
                })
                //获取知识点列表
                this.getRequest("/baseinfo/knows/all?courseId="+this.updateRightQueInfo.courseId).then(resp=> {
                    if (resp) {
                        //this.knows=JSON.parse(JSON.stringify(resp));
                        this.knows=resp[0].children;
                    }
                })
            },
            selectChapterChanged(){

            },
            selectKnowsChanged(){
                //console.log('selectKnowIds:'+this.selectKnowIds);
                //let knowIds=this.$refs['knowsCascader'].getCheckedNodes();
                /*for(var i=0;i<knowIds.length;i++){
                    let know1=knowIds[i];//获取到每个章节（包含知识点）
                    console.log(know1);
                    if(know1.children!=null&&know1.children.length!=0){
                        let know2=know1.children;//获取到章节中的知识点数组
                        console.log('知识点个数'+know2.length);
                        for(let j=0;j<know2.length;j++){
                                console.log("Id:"+know2[j].value+'name:'+know2[j].label);
                        }
                    }
                }*/
                //数据回显：app.selectedOptions=JSON.parse(result.data.userAddress);
                //console.log(this.$refs['knowsCascader'].getCheckedNodes());
            },
            selectQueTypeChanged(){
                this.initQue();
            },
        }
    }
</script>

<style >
/*
    .el-scrollbar__wrap
    {
        overflow-x: hidden;
    }
*/

</style>