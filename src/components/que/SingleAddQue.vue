<template xmlns:el-col="http://www.w3.org/1999/html">
    <div><!--单个试题录入页面-->

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
                    <el-button plain @click="addQuestion">保存</el-button>
                    <el-button type="primary" plain >取消</el-button>
                </div>
            </div>

            <el-container style="border:1px solid #eee;">
                <el-main >
                    <!--el-main这里放置试题信息-->
                    <AddSC ref="AddSC" v-if="isAddSC" @submitInfo="submitSCData" :scMainQueInfo="scMainQueInfo"></AddSC>
                    <AddMC ref="AddMC" v-if="isAddMC" @submitInfo="submitMCData" :mcMainQueInfo="mcMainQueInfo"></AddMC>
                    <AddTF ref="AddTF" v-if="isAddTF"  @submitInfo="submitTFData" :tfMainQueInfo="tfMainQueInfo"></AddTF>
                    <AddFB  ref="AddFB" v-if="isAddFB"  @submitInfo="submitFBData" :fbMainQueInfo="fbMainQueInfo"></AddFB>
                    <AddQA  ref="AddQA" v-if="isAddQA"  @submitInfo="submitQAData" :qaMainQueInfo="qaMainQueInfo"> </AddQA>
                </el-main>
                <!--el-main这里放置试题的设置信息-->
                <el-aside style="width: 38%;border-left:1px dashed #dedede; ">
                    <el-scrollbar style="width: 100%"><!--这里是为了解决底部出现的滚动条-->
                            <div style="margin-left: 30px;margin-top: 20px">
                                <el-form
                                        ref="rightInfoForm"
                                        :model="updateRightQueInfo"
                                        :rules="rules"
                                        label-position="top"
                                        label-width="120px"
                                        style="margin: 0px auto">
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 20px">

                                            <el-form-item label="所属课程:" prop="courseId"  >

                                                <el-select v-model="updateRightQueInfo.courseId"
                                                           filterable
                                                           placeholder="请选择课程(可搜索）"
                                                           @change="selectCourseChanged"
                                                           size="large"
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
                                                           size="large"
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
                                                        size="large"
                                                        :options="knows"
                                                        v-model="knowIds"
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
                                                           size="large"
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
                                    <el-row>
                                        <el-col :span="24" style="margin-top: 0px">
                                            <el-form-item label="选择试题审核人:" prop="checkTeacherId"  >
                                                <el-select v-model="updateRightQueInfo.checkTeacherId"
                                                           placeholder="请选择审核人(课程负责人）"
                                                           @change="selectCheckTeacherChanged"
                                                           size="large"
                                                           filterable
                                                           style="width: 250px;">
                                                    <el-option
                                                            v-for="item in checkTeachers"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id"><!--这里knows.children为课程列表-->
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
            <div style="text-align: center;margin-top: 10px"><!--底部保存按钮-->
                <el-button type="primary" @click="addQuestion">保存</el-button>
                <el-button  >取消</el-button>
            </div>
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
        },
        data(){
            return{

                //
                courseKeyword:'',
                courses:[],/*存放右侧根据关键词查找的课程列表*/
                chapters:[],//存放右侧章节列表
                updateRightQueInfo:{/*右侧试题设置参数*/
                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                knowIds:[],//右侧知识点存放的数组，（提交的时候需要转化为字符串）
                //需要传递给单选组件中的信息
                scMainQueInfo:{
                    id:'',
                    stem:'',
                    option1:'',
                    option2:'',
                    option3:'',
                    option4:'',
                    answer:'A',//设为答案
                    analysis:'',
                },
                //把组件中的信息和右侧的信息合并到这里，也就是最后提交的数据信息
                scMainAllQueInfo:{
                    id:'',
                    stem:'',
                    option1:'',
                    option2:'',
                    option3:'',
                    option4:'',
                    answer:'',//设为答案
                    analysis:'',
                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                //需要传递给单选组件中的信息
                mcMainQueInfo:{
                    id:'',
                    stem:'',
                    options:[{
                        optionNum:1,
                        optionContent:'测试选项1'
                    }, ],
                    answer:'',//设为答案的序号
                    analysis:'',
                },
                //把组件中的信息和右侧的信息合并到这里，也就是最后提交的数据信息
                mcMainAllQueInfo:{
                    id:'',
                    stem:'',
                    options:[{
                        optionNum:1,
                        optionContent:'测试选项1'
                    }],
                    answer:'',//设为答案的序号
                    analysis:'',

                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                fbMainQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',
                    analysis:'',
                },
                fbMainAllQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',//设为答案的序号
                    analysis:'',

                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                tfMainQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',
                    analysis:'',
                },

                tfMainAllQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',//设为答案的序号
                    analysis:'',

                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                qaMainQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',
                    analysis:'',
                },

                qaMainAllQueInfo:{
                    id:'',
                    stem:'',
                    answer:'',//设为答案的序号
                    analysis:'',

                    courseId:'',//课程id
                    chapterId:'',//章节id
                    knowIds:'',//获取用户选中的知识点
                    dot:'',//试题难度
                    checkTeacherId:[],//审核教师id
                },
                qlevel:[//试题难度下拉框选择值
                    {value:1,label:'简单'},{value:2,label: '适中'},{value:3,label:'偏难'},{value:4,label: '难'}
                ],
                rules:{
                    courseId: [{required: true, message: '请选择课程', trigger: 'blur'}],
                    chapterId: [{required: true, message: '请选择章节', trigger: 'blur'}],
                    dot:[{required: true, message: '请选择试题难度', trigger: 'blur'}],
                    checkTeacherId:[{required: true, message: '请选择审核人', trigger: 'blur'}],
                },
                knows:[],//后端根据课程id传过来的章节列表（包含知识点）
                checkTeachers:[],
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
               /* scData:{},
                mcData:{},
                tfData:{},
                fbData:{},
                qaData:{}*/

            }

        },
        created() {

            if(this.$route.params.queType){//如果有参数，表示由试题页面跳转过来，进入编辑试题页面

                var queType=this.$route.params.queType;

                if(queType=='sc'){
                    this.queType="单选题";
                    this.scMainAllQueInfo=JSON.parse(this.$route.params.scMainAllQueInfo);
                    this.$set(this.scMainQueInfo,"id",this.scMainAllQueInfo.id);
                    this.$set(this.scMainQueInfo,"stem",this.scMainAllQueInfo.stem);
                    this.$set(this.scMainQueInfo,"option1",this.scMainAllQueInfo.option1);
                    this.$set(this.scMainQueInfo,"option2",this.scMainAllQueInfo.option2);
                    this.$set(this.scMainQueInfo,"option3",this.scMainAllQueInfo.option3);
                    this.$set(this.scMainQueInfo,"option4",this.scMainAllQueInfo.option4);
                    this.$set(this.scMainQueInfo,"analysis",this.scMainAllQueInfo.analysis);


                    this.$set(this.scMainQueInfo,"courseId",this.scMainAllQueInfo.courseId);
                    this.$set(this.updateRightQueInfo,"courseId",this.scMainAllQueInfo.courseId);
                    this.selectCourseChanged();
                    this.$set(this.scMainQueInfo,"chapterId",this.scMainAllQueInfo.chapterId);
                    this.$set(this.updateRightQueInfo,"chapterId",this.scMainAllQueInfo.chapterId);
                    this.selectChapterChanged();
                    this.$set(this.scMainQueInfo,"dot",this.scMainAllQueInfo.dot);
                    this.$set(this.updateRightQueInfo,"dot",this.scMainAllQueInfo.dot);
                    this.$set(this.scMainQueInfo,"knowIds",this.scMainAllQueInfo.knowIds);
                    this.$set(this.updateRightQueInfo,"knowIds",this.scMainAllQueInfo.knowIds);
                    this.$set(this.scMainQueInfo,"checkTeacherId",this.scMainAllQueInfo.checkTeacherId);
                    this.$set(this.updateRightQueInfo,"checkTeacherId",this.scMainAllQueInfo.checkTeacherId);
                    this.strToKnows();

                    this.$forceUpdate();
                }
                else if(queType=='mc'){
                    this.queType="多选题";
                    this.mcMainAllQueInfo=JSON.parse(this.$route.params.mcMainAllQueInfo);
                    this.$set(this.mcMainQueInfo,"id",this.mcMainAllQueInfo.id);
                    this.$set(this.mcMainQueInfo,"stem",this.mcMainAllQueInfo.stem);
                    this.$set(this.mcMainQueInfo,"options",this.mcMainAllQueInfo.options);
                    this.$set(this.mcMainQueInfo,"answer",this.mcMainAllQueInfo.answer);
                    this.$set(this.mcMainQueInfo,"analysis",this.mcMainAllQueInfo.analysis);


                    this.$set(this.mcMainQueInfo,"courseId",this.mcMainAllQueInfo.courseId);
                    this.$set(this.updateRightQueInfo,"courseId",this.mcMainAllQueInfo.courseId);
                    this.selectCourseChanged();
                    this.$set(this.mcMainQueInfo,"chapterId",this.mcMainAllQueInfo.chapterId);
                    this.$set(this.updateRightQueInfo,"chapterId",this.mcMainAllQueInfo.chapterId);
                    this.selectChapterChanged();
                    this.$set(this.mcMainQueInfo,"dot",this.mcMainAllQueInfo.dot);
                    this.$set(this.updateRightQueInfo,"dot",this.mcMainAllQueInfo.dot);
                    this.$set(this.mcMainQueInfo,"knowIds",this.mcMainAllQueInfo.knowIds);
                    this.$set(this.updateRightQueInfo,"knowIds",this.mcMainAllQueInfo.knowIds);
                    this.$set(this.mcMainQueInfo,"checkTeacherId",this.mcMainAllQueInfo.checkTeacherId);
                    this.$set(this.updateRightQueInfo,"checkTeacherId",this.mcMainAllQueInfo.checkTeacherId);
                    this.strToKnows();

                    this.$forceUpdate();
                }
                else if(queType=='tf'){
                    this.queType="判断题";
                    this.tfMainAllQueInfo=JSON.parse(this.$route.params.tfMainAllQueInfo);
                    this.$set(this.tfMainQueInfo,"id",this.tfMainAllQueInfo.id);
                    this.$set(this.tfMainQueInfo,"stem",this.tfMainAllQueInfo.stem);
                    this.$set(this.tfMainQueInfo,"answer",this.tfMainAllQueInfo.answer);
                    this.$set(this.tfMainQueInfo,"analysis",this.tfMainAllQueInfo.analysis);

                    this.$set(this.tfMainQueInfo,"courseId",this.tfMainAllQueInfo.courseId);
                    this.$set(this.updateRightQueInfo,"courseId",this.tfMainAllQueInfo.courseId);
                    this.selectCourseChanged();
                    this.$set(this.tfMainQueInfo,"chapterId",this.tfMainAllQueInfo.chapterId);
                    this.$set(this.updateRightQueInfo,"chapterId",this.tfMainAllQueInfo.chapterId);
                    this.selectChapterChanged();
                    this.$set(this.tfMainQueInfo,"dot",this.tfMainAllQueInfo.dot);
                    this.$set(this.updateRightQueInfo,"dot",this.tfMainAllQueInfo.dot);
                    this.$set(this.tfMainQueInfo,"knowIds",this.tfMainAllQueInfo.knowIds);
                    this.$set(this.updateRightQueInfo,"knowIds",this.tfMainAllQueInfo.knowIds);
                    this.$set(this.tfMainQueInfo,"checkTeacherId",this.tfMainAllQueInfo.checkTeacherId);
                    this.$set(this.updateRightQueInfo,"checkTeacherId",this.tfMainAllQueInfo.checkTeacherId);
                    this.strToKnows();

                    this.$forceUpdate();
                }
                else if(queType=='fb'){
                    this.queType="填空题";
                    this.fbMainAllQueInfo=JSON.parse(this.$route.params.fbMainAllQueInfo);
                    this.$set(this.fbMainQueInfo,"id",this.fbMainAllQueInfo.id);
                    this.$set(this.fbMainQueInfo,"stem",this.fbMainAllQueInfo.stem);
                    this.$set(this.fbMainQueInfo,"answer",this.fbMainAllQueInfo.answer);
                    this.$set(this.fbMainQueInfo,"analysis",this.fbMainAllQueInfo.analysis);

                    this.$set(this.fbMainQueInfo,"courseId",this.fbMainAllQueInfo.courseId);
                    this.$set(this.updateRightQueInfo,"courseId",this.fbMainAllQueInfo.courseId);
                    this.selectCourseChanged();
                    this.$set(this.fbMainQueInfo,"chapterId",this.fbMainAllQueInfo.chapterId);
                    this.$set(this.updateRightQueInfo,"chapterId",this.fbMainAllQueInfo.chapterId);
                    this.selectChapterChanged();
                    this.$set(this.fbMainQueInfo,"dot",this.fbMainAllQueInfo.dot);
                    this.$set(this.updateRightQueInfo,"dot",this.fbMainAllQueInfo.dot);
                    this.$set(this.fbMainQueInfo,"knowIds",this.fbMainAllQueInfo.knowIds);
                    this.$set(this.updateRightQueInfo,"knowIds",this.fbMainAllQueInfo.knowIds);
                    this.$set(this.fbMainQueInfo,"checkTeacherId",this.fbMainAllQueInfo.checkTeacherId);
                    this.$set(this.updateRightQueInfo,"checkTeacherId",this.fbMainAllQueInfo.checkTeacherId);
                    this.strToKnows();

                    this.$forceUpdate();
                }
                else if(queType=='qa'){
                    this.queType="简答题";
                    this.qaMainAllQueInfo=JSON.parse(this.$route.params.qaMainAllQueInfo);
                    this.$set(this.qaMainQueInfo,"id",this.qaMainAllQueInfo.id);
                    this.$set(this.qaMainQueInfo,"stem",this.qaMainAllQueInfo.stem);
                    this.$set(this.qaMainQueInfo,"answer",this.qaMainAllQueInfo.answer);
                    this.$set(this.qaMainQueInfo,"analysis",this.qaMainAllQueInfo.analysis);

                    this.$set(this.qaMainQueInfo,"courseId",this.qaMainAllQueInfo.courseId);
                    this.$set(this.updateRightQueInfo,"courseId",this.qaMainAllQueInfo.courseId);
                    this.selectCourseChanged();
                    this.$set(this.qaMainQueInfo,"chapterId",this.qaMainAllQueInfo.chapterId);
                    this.$set(this.updateRightQueInfo,"chapterId",this.qaMainAllQueInfo.chapterId);
                    this.selectChapterChanged();
                    this.$set(this.qaMainQueInfo,"dot",this.qaMainAllQueInfo.dot);
                    this.$set(this.updateRightQueInfo,"dot",this.qaMainAllQueInfo.dot);
                    this.$set(this.qaMainQueInfo,"knowIds",this.qaMainAllQueInfo.knowIds);
                    this.$set(this.updateRightQueInfo,"knowIds",this.qaMainAllQueInfo.knowIds);
                    this.$set(this.qaMainQueInfo,"checkTeacherId",this.qaMainAllQueInfo.checkTeacherId);
                    this.$set(this.updateRightQueInfo,"checkTeacherId",this.qaMainAllQueInfo.checkTeacherId);
                    this.strToKnows();

                    this.$forceUpdate();
                }
            }
        },
        mounted() {
            this.initQue();
            this.initCourse();
            this.initCheckTeachers();

        },
        methods:{
            initQue(){//初始化试题添加组件
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
            initCourse(){//
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
            initCheckTeachers(){//
                if(!window.sessionStorage.getItem("checkTeachers")){
                    this.getRequest('/system/user/addQue').then(resp => {
                        if (resp) {
                            this.checkTeachers = resp;
                            window.sessionStorage.setItem("checkTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.checkTeachers=JSON.parse(window.sessionStorage.getItem("checkTeachers"));
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
                //console.log('knowIds:'+this.knowIds);
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

                //这里将数组类型转化为字符串类型
                let ids=this.knowIds.join('@');
                this.updateRightQueInfo.knowIds=ids;

            },
            strToKnows(){//把知识转化为数组类型方便显示
                var idsArr=this.updateRightQueInfo.knowIds.split("|");
                this.knowIds=idsArr;
            },
            selectQueTypeChanged(){//当试题类型下拉框改变
                this.initQue();
                this.emptyRightInfo();
            },
            selectCheckTeacherChanged(){

            },
            submitSCData(data){
                this.scMainQueInfo=data;
            },
            submitMCData(data){
                this.mcMainQueInfo=data;
            },
            submitFBData(data){
                this.fbMainQueInfo=data;
            },
            submitTFData(data){
                this.tfMainQueInfo=data;
            },
            submitQAData(data){
                this.qaMainQueInfo=data;
            },
            addQuestion(data){
              //用户点击保存按钮
                if(this.queType=='单选题'){

                    if(this.$refs.AddSC.checkData()){ //这里还需要对组件中的值是否为空进行判断
                        this.$refs.AddSC.submit(); // 获取sc组件中的数据
                        this.$refs.rightInfoForm.validate((valid) => {//this.refs可以获取到当前页面所有的ref
                            if (valid) {

                                //数据通过验证，发送到后端进行保存操作
                                this.scMainAllQueInfo.stem=this.scMainQueInfo.stem;
                                this.scMainAllQueInfo.option1=this.scMainQueInfo.option1;
                                this.scMainAllQueInfo.option2=this.scMainQueInfo.option2;
                                this.scMainAllQueInfo.option3=this.scMainQueInfo.option3;
                                this.scMainAllQueInfo.option4=this.scMainQueInfo.option4;
                                this.scMainAllQueInfo.answer=this.scMainQueInfo.answer;
                                this.scMainAllQueInfo.analysis=this.scMainQueInfo.analysis;

                                this.scMainAllQueInfo.courseId=this.updateRightQueInfo.courseId;
                                this.scMainAllQueInfo.chapterId=this.updateRightQueInfo.chapterId;
                                this.scMainAllQueInfo.knowIds=this.updateRightQueInfo.knowIds;
                                this.scMainAllQueInfo.dot=this.updateRightQueInfo.dot;
                                this.scMainAllQueInfo.checkTeacherId=this.updateRightQueInfo.checkTeacherId;

                                if(this.scMainQueInfo.id){//不为空时为更新操作
                                    this.putRequest("/question/scinput/update",this.scMainAllQueInfo).then(resp=>{
                                        if(resp){
                                            this.emptyRightInfo();//刷新页面
                                            this.$refs.AddSC.emptyData();//调用组件中方法清空数据
                                            var that = this;
                                            setTimeout(function () {//跳转到试题查询页面
                                                that.$router.push({ path:'/que/query'  });
                                            },500);

                                        }
                                    })
                                }else {//否则，为添加操作
                                    this.postRequest("/question/scinput/add",this.scMainAllQueInfo).then(resp=>{
                                        if(resp){
                                            this.emptyRightInfo();//刷新页面
                                            this.$refs.AddSC.emptyData();//调用组件中方法清空数据
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
                else if(this.queType=='多选题'){
                    if(this.$refs.AddMC.checkData()){ //这里还需要对组件中的值是否为空进行判断
                        this.$refs.AddMC.submit(); // 获取mc组件中的数据
                        this.$refs.rightInfoForm.validate((valid) => {//验证右侧信息
                            if (valid) {

                                //数据通过验证，发送到后端进行保存操作
                                this.mcMainAllQueInfo.stem=this.mcMainQueInfo.stem;
                                this.mcMainAllQueInfo.options=this.mcMainQueInfo.options;
                                this.mcMainAllQueInfo.answer=this.mcMainQueInfo.answer;
                                this.mcMainAllQueInfo.analysis=this.mcMainQueInfo.analysis;
                                this.mcMainAllQueInfo.courseId=this.updateRightQueInfo.courseId;
                                this.mcMainAllQueInfo.chapterId=this.updateRightQueInfo.chapterId;
                                this.mcMainAllQueInfo.knowIds=this.updateRightQueInfo.knowIds;
                                this.mcMainAllQueInfo.dot=this.updateRightQueInfo.dot;
                                this.mcMainAllQueInfo.checkTeacherId=this.updateRightQueInfo.checkTeacherId;
                                this.postRequest("/question/mcinput/add",this.mcMainAllQueInfo).then(resp=>{
                                    if(resp){
                                        this.emptyRightInfo();//刷新页面
                                        this.$refs.AddMC.emptyData();//调用组件中方法清空数据
                                    }
                                })
                            }
                        });
                    }
                }else if(this.queType=='判断题'){
                    if(this.$refs.AddTF.checkData()){ //这里还需要对组件中的值是否为空进行判断
                        this.$refs.AddTF.submit(); // 获取mc组件中的数据
                        this.$refs.rightInfoForm.validate((valid) => {//验证右侧信息
                            if (valid) {
                                //数据通过验证，发送到后端进行保存操作
                                this.tfMainAllQueInfo.stem=this.tfMainQueInfo.stem;
                                this.tfMainAllQueInfo.answer=this.tfMainQueInfo.answer;
                                this.tfMainAllQueInfo.analysis=this.tfMainQueInfo.analysis;

                                this.tfMainAllQueInfo.courseId=this.updateRightQueInfo.courseId;
                                this.tfMainAllQueInfo.chapterId=this.updateRightQueInfo.chapterId;
                                this.tfMainAllQueInfo.knowIds=this.updateRightQueInfo.knowIds;
                                this.tfMainAllQueInfo.dot=this.updateRightQueInfo.dot;
                                this.tfMainAllQueInfo.checkTeacherId=this.updateRightQueInfo.checkTeacherId;
                                this.postRequest("/question/tfinput/add",this.tfMainAllQueInfo).then(resp=>{
                                    if(resp){
                                        this.emptyRightInfo();//刷新页面
                                        this.$refs.AddTF.emptyData();//调用组件中方法清空数据
                                    }
                                })
                            }
                        });
                    }

                }else if(this.queType=='填空题'){
                    if(this.$refs.AddFB.checkData()){ //这里还需要对组件中的值是否为空进行判断
                        this.$refs.AddFB.submit(); // 获取mc组件中的数据
                        this.$refs.rightInfoForm.validate((valid) => {//验证右侧信息
                            if (valid) {
                                //数据通过验证，发送到后端进行保存操作
                                this.fbMainAllQueInfo.stem=this.fbMainQueInfo.stem;
                                this.fbMainAllQueInfo.answer=this.fbMainQueInfo.answer;
                                this.fbMainAllQueInfo.analysis=this.fbMainQueInfo.analysis;

                                this.fbMainAllQueInfo.courseId=this.updateRightQueInfo.courseId;
                                this.fbMainAllQueInfo.chapterId=this.updateRightQueInfo.chapterId;
                                this.fbMainAllQueInfo.knowIds=this.updateRightQueInfo.knowIds;
                                this.fbMainAllQueInfo.dot=this.updateRightQueInfo.dot;
                                this.fbMainAllQueInfo.checkTeacherId=this.updateRightQueInfo.checkTeacherId;
                                this.postRequest("/question/fbinput/add",this.fbMainAllQueInfo).then(resp=>{
                                    if(resp){
                                        this.emptyRightInfo();//刷新页面
                                        this.$refs.AddFB.emptyData();//调用组件中方法清空数据
                                    }
                                })
                            }
                        });
                    }

                }else if(this.queType=='简答题'){
                    if(this.$refs.AddQA.checkData()) { //这里还需要对组件中的值是否为空进行判断
                        this.$refs.AddQA.submit(); // 获取mc组件中的数据
                        this.$refs.rightInfoForm.validate((valid) => {//验证右侧信息
                            if (valid) {
                                //数据通过验证，发送到后端进行保存操作
                                this.qaMainAllQueInfo.stem = this.qaMainQueInfo.stem;
                                this.qaMainAllQueInfo.answer = this.qaMainQueInfo.answer;
                                this.qaMainAllQueInfo.analysis = this.qaMainQueInfo.analysis;

                                this.qaMainAllQueInfo.courseId = this.updateRightQueInfo.courseId;
                                this.qaMainAllQueInfo.chapterId = this.updateRightQueInfo.chapterId;
                                this.qaMainAllQueInfo.knowIds = this.updateRightQueInfo.knowIds;
                                this.qaMainAllQueInfo.dot = this.updateRightQueInfo.dot;
                                this.qaMainAllQueInfo.checkTeacherId = this.updateRightQueInfo.checkTeacherId;
                                this.postRequest("/question/qainput/add", this.qaMainAllQueInfo).then(resp => {
                                    if (resp) {
                                        this.emptyRightInfo();//刷新页面
                                        this.$refs.AddQA.emptyData();//调用组件中方法清空数据
                                    }
                                })
                            }
                        });
                    }
                }
            },
            emptyRightInfo(){
                this.updateRightQueInfo.courseId='';
                this.updateRightQueInfo.chapterId='';
                this.updateRightQueInfo.dot='';
                this.updateRightQueInfo.knowIds='';
                this.updateRightQueInfo.checkTeacherId='';
                this.knowIds=[];
                this.knows=[];
            }
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