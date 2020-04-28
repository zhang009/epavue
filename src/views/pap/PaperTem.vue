<template>
    <div><!--试卷模板管理-->
        <div>
           <!-- <h2 style="font-family:'黑体'">试卷模板管理</h2>-->
            <el-divider></el-divider>
            <div style="margin-left: auto;margin-right: auto">

                <div>
                    <el-input placeholder="输入名称搜索试卷模板..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initPaperTemplate"
                              style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initPaperTemplate" ></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initPaperTemplate" > 搜索</el-button>
                </div>
                <div style="width:90%;border:1px solid #f0f0f0;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;" ><!--内容面板展示-->
               <!-- <div style="margin-top: 20px">-->
                    <el-row>
                        <el-col :span="16">
                            课程：
                            <el-select v-model="searchValue.courseId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择考试课程"
                                       @change="selectCourseChanged"
                                       size="small"
                                       style="width: 240px;">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            教师：
                            <el-select v-model="searchValue.createTeacherId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择创建人"
                                       @change="selectTeacherChanged"
                                       size="small"
                                       style="width: 200px;">
                                <el-option
                                        v-for="item in teachers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button size="mini" @click="emptySearchValue">重置</el-button>
                            <el-button  type="primary" icon="el-icon-search" @click="initPaperTemplate('advanced')">
                                条件搜索</el-button>
                        </el-col>
                        <el-col :span="8">
                            <div align="right">
                                <el-button type="primary" icon="el-icon-plus" @click="showAddTemplateView">
                                    添加试卷模板
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!--添加试卷模板对话框-->
                <el-dialog
                        :title="title"
                        :visible.sync="dialogVisible"
                        width="80%">
                    <div>
                        <div>

                        </div>
                        <div style="margin-left: 40px">
                            <el-form
                                    :model="updateTemplate"
                                    :rules="rules"
                                    ref="templateForm"
                                    label-position="right"
                                    label-width="150px"
                                    style="margin: 0px auto">
                                <el-divider content-position="left">试卷基本信息</el-divider>
                                <el-row >
                                    <el-col :span="24">
                                        <el-form-item label="试卷名称:" prop="name"  >
                                            <el-input size="small" style="width: 280px" prefix-icon="el-icon-edit" v-model="updateTemplate.name"
                                                      placeholder="输入试卷名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="9">
                                        <el-form-item label="学院:" prop="schoolId">
                                            <el-select v-model="updateTemplate.schoolId"
                                                       @change="selectSchoolChanged"
                                                       placeholder="请选择学院"
                                                       size="small"
                                                       style="width: 280px;">
                                                <el-option
                                                        v-for="item in schools"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-form-item label="专业:">
                                            <el-select
                                                    placeholder="请选择专业"
                                                    size="medium"
                                                    v-model="updateTemplate.majorId"
                                                    style="width: 280px">
                                                <el-option
                                                        v-for="item in majors"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item >
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="9">
                                        <el-form-item label="选择考试课程" prop="courseId">
                                            <el-select v-model="updateTemplate.courseId"
                                                       filterable
                                                       @change="selectCourseChanged"
                                                       placeholder="请选择考试课程"
                                                       size="small"
                                                       style="width: 280px;">
                                                <el-option
                                                        v-for="item in courses"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-form-item label="学期:">
                                            <el-select
                                                    placeholder="请选择学期"
                                                    size="small"
                                                    v-model="updateTemplate.semester"
                                                    style="width: 300px">
                                                <el-option
                                                        v-for="item in semester"
                                                        :key="item.name"
                                                        :label="item.name"
                                                        :value="item.name">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="9">
                                        <el-form-item label="试卷总分:" prop="totalScore">
                                            <el-input size="small"
                                                      style="width: 280px"
                                                      prefix-icon="el-icon-edit"
                                                      placeholder="请输入试卷的总分"
                                                      v-model="updateTemplate.totalScore">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="15">
                                        <el-form-item label="备注:">
                                            <el-input size="small"
                                                      type="textarea"
                                                      style="width: 300px"
                                                      placeholder="试卷备注信息"
                                                      v-model="updateTemplate.remark">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-divider content-position="left">试卷题型分布</el-divider>
                                <div>（试卷由大题和大题下小题组成，如果系统中没有需要的题型，点击这里<el-link type="primary"  @click="showAddQueTypeView">添加</el-link> )</div>

                                <div><!--大题小题设置-->
                                    <div style="margin-top: 10px;margin-left: 10px">
                                        <el-button size="mini" icon="el-icon-plus" type="success" @click="addLargeQue">添加大题</el-button>
                                    </div>
                                    <div style="margin-top: 10px;margin-left: 10px"><!--大题列表-->
                                        <div v-for="(questions,indexi) in updateTemplate.questions" :key="indexi">
                                            <div>
                                                第{{largeQueTypeNum[indexi]}}大题、题型：
                                                <el-select v-model="questions.queType"
                                                           placeholder="请选择题型"
                                                           size="small"
                                                           style="width: 180px;">
                                                    <el-option
                                                            v-for="item in queTypes"
                                                            :key="item.name"
                                                            :label="item.name"
                                                            :value="item.name">
                                                    </el-option>
                                                </el-select>
                                                <el-button style="color: red;padding:0;margin-left: 5px" size="large" type="text" icon="el-icon-delete" @click="deleteLargeQue(indexi)"></el-button>
                                            </div>
                                            <div style="margin-left: 100px"><!--小题信息-->
                                                <div v-for="(queInfo,indexj) in questions.queInfo" style="margin-top: 10px;" :key="indexj">
                                                    <el-row>
                                                        <el-col :span="2" style="padding-top: 2px;" align="center">
                                                            <el-tag  effect="plain">试题{{indexj+1}}.</el-tag><!--小题序号-->
                                                        </el-col>
                                                        <el-col :span="4" style="">
                                                               分数:
                                                                    <el-input-number
                                                                            size="mini"

                                                                            v-model="queInfo.score"
                                                                            style="width: 100px">
                                                                    </el-input-number>

                                                        </el-col>
                                                        <el-col :span="7" style="">
                                                            考查章节:
                                                            <el-select v-model="queInfo.chapterId"
                                                                       placeholder="请选择章节"
                                                                       size="small"
                                                                       style="width: 240px;">
                                                                <el-option
                                                                        v-for="item in chapters"
                                                                        :key="item.id"
                                                                        :label="item.name"
                                                                        :value="item.id"><!--这里knows.children为课程列表-->
                                                                </el-option>
                                                            </el-select>
                                                        </el-col>
                                                        <el-col :span="8" style="">
                                                            考查知识点：
                                                            <el-cascader
                                                                    placeholder="请选择知识点"
                                                                    style="width: 275px;"
                                                                    size="small"
                                                                    :options="knows"
                                                                    v-model="queInfo.knowIds"
                                                                    :props="defaultProps"
                                                                    :show-all-levels="false"
                                                                    :collapse-tags="true"
                                                                    clearable>
                                                            </el-cascader>
                                                            <!--<span style="color: #cac6c6">
                                                                (可选择多个)
                                                            </span>-->
                                                        </el-col>
                                                        <el-col :span="3">
                                                            <div style="padding:3px">
                                                                <el-button style="padding:0;margin-left: 5px" size="large" type="text" icon="el-icon-plus" @click="addSmallQue(indexi)"></el-button>
                                                                <el-button style="color: red;padding:0;margin-left: 30px" size="large" type="text" icon="el-icon-delete" @click="deleteSmallQue(indexi)"></el-button>
                                                            </div>

                                                        </el-col>

                                                    </el-row>
                                                </div>
                                                <el-divider></el-divider>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex;justify-content: space-around"><!--分数分配统计-->
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div>  <strong>总分：</strong> {{updateTemplate.totalScore}}&nbsp;&nbsp;<strong>分</strong></div>
                                    <div> <strong>已分配：</strong>{{alreadyDisScore}}&nbsp;&nbsp;<strong>分</strong></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>

                                </div>

                            </el-form>

                        </div>

                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="doAddTestPaperTemplate" >保存</el-button>
                    </span>
                </el-dialog>
                <!--添加试卷模板对话框---end-->

                <div style="margin-top: 20px">
                    <el-table
                        :data="paperTemplates"
                        stripe
                        border
                        v-loading="loading1"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.7)"
                        style="width: 90%"
                        :default-sort = "{prop: 'createTime', order: 'descending'}"
                        >
                        <el-table-column
                                type="index"
                                label="编号"
                                fixed
                                width="80"><!--   prop="id"-->
                            <template slot-scope="scope">
                                <span>{{(page - 1) * size + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="试卷模板名称"
                            prop="name"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            label="课程"
                            prop="course"
                            width="200">
                            <template slot-scope="scope">
                                {{scope.row.course.name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="学年学期"
                            prop="semester"
                            width="200">
                        </el-table-column>
                        <el-table-column
                                prop="teacher"
                                label="创建者"
                                width="100">
                            <template slot-scope="scope">
                                {{scope.row.teacher.name}}
                            </template>
                        </el-table-column>

                        <el-table-column
                                label="日期"
                                prop="createTime"
                                sortable
                                width="200">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="showInfoView(scope.row)">查看</el-button>
                                <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="text-align: right;width: 90%">
                        <el-pagination
                                background
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, total, slot"
                                :total="total">
                        </el-pagination>
                    </div>
                    <el-dialog
                            title="试卷模板详情"
                            :visible.sync="detailTemplateDialogVisible"
                            width="60%"><!--试卷模板详情-->
                        <el-form label-position="right" inline class="demo-table-expand">
                            <el-divider content-position="left">基本信息</el-divider>
                            <el-form-item label="试卷名称:">
                                <span>{{ templateDetailInfo.name }}</span>
                            </el-form-item>
                            <el-form-item label="学  院:">
                                <span>{{ templateDetailInfo.schoolName }}</span>
                            </el-form-item>
                            <el-form-item label="专  业:">
                                <span>{{ templateDetailInfo.majorName }}</span>
                            </el-form-item>
                            <el-form-item label="学  期:">
                                <span>{{ templateDetailInfo.semester }}</span>
                            </el-form-item>
                            <el-form-item label="课  程:">
                                <span>{{ templateDetailInfo.courseName }}</span>
                            </el-form-item>
                        </el-form>
                        <el-divider content-position="left">题目信息</el-divider>
                        <el-row  style="margin-left: 120px">
                            <el-col :span="4">
                                大题数量：&nbsp;&nbsp;{{templateDetailInfo.largeQues.length}}
                            </el-col>
                           <!-- <el-col :span="6">
                                小题数量{{templateDetailInfo.queNum}}
                            </el-col>-->
                            <el-col :span="4">
                                总分：&nbsp;&nbsp;{{templateDetailInfo.totalScore}}&nbsp;&nbsp;分
                            </el-col>
                            <el-col :span="4">
                                及格分：{{templateDetailInfo.passScore}}&nbsp;&nbsp;分
                            </el-col>
                        </el-row>
                        <div  style="margin-left: 100px;margin-top: 20px">
                            <div v-for="(largeQue,indexi) in templateDetailInfo.largeQues" :key="indexi" style="margin-top: 20px;">
                                <div v-if="largeQue.queType!=null&&largeQue.queType!=''" style="margin-bottom: 10px"><!--大题标题-->
                                    第{{largeQueTypeNum[indexi]}}大题、<strong>{{largeQue.queType}}</strong>
                                    （共{{largeQue.smallQues.length}}小题，{{largeQue.queScores}}分）
                                </div>
                                <div v-for="(smallQue,indexj) in largeQue.smallQues" :key="indexj">
                                    <el-row>
                                        <el-col :span="4" style="padding-top: 2px;" align="center">
                                            <el-tag  effect="plain">试题{{indexj+1}}.</el-tag><!--小题序号-->
                                        </el-col>
                                        <el-col :span="3" style="">
                                            分数:{{smallQue.queScore}} 分
                                        </el-col>
                                        <el-col :span="17" style="">
                                            <span v-if="smallQue.chapter">
                                                考查章节：&nbsp;
                                                <el-tag type="info">{{smallQue.chapter.name}}</el-tag>
                                            </span>
                                        </el-col>

                                    </el-row>
                                    <el-row>
                                        <el-col :span="17" :offset="7">

                                                考查知识点：
                                                <span v-for="(know,indexk) in smallQue.knows" :key="indexk">
                                                    <el-tag>{{know.name}}</el-tag>
                                                </span>

                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                        <el-divider></el-divider>
                        <div >
                                <el-row >
                                    <el-col :span="6" :offset="6">
                                        创建教师：{{templateDetailInfo.postTeacherName}}
                                    </el-col>
                                    <el-col :span="6">
                                        创建日期：{{templateDetailInfo.createTime}}
                                    </el-col>
                                    <el-col :span="6">
                                        更新日期：{{templateDetailInfo.updateTime}}
                                    </el-col>
                                </el-row>
                        </div>

                        <span slot="footer" class="dialog-footer">
                           <!-- <el-button @click="dialogVisible2 = false">取 消</el-button>-->
                            <el-button type="primary" @click="detailTemplateDialogVisible = false">确 定</el-button>
                          </span>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaperTemplateMan",
        data(){
            return{
                title:'添加试卷模板',
                loading1:false,
                dialogVisible:false,
                dialogQueTypeVisible:false,
                detailTemplateDialogVisible:false,
                keyword:'',
                schools:[],
                courses:[],
                teachers:[],
                majors:[],
                semester:[],
                queTypes:[],
                chapters:[],
                /*knowIds:[],*/
                templateDetailInfo:{//查看模板详情信息
                    name:'',//试卷名称
                    schoolName:'',//学院名称
                    courseName:'',//课程名称
                    majorName:'',//专业名称
                    semester:'',//学期
                    totalScore:'',//总分
                    passScore:'',//及格分
                    postTeacherName:'',//创建教师
                    createTime:'',//创建时间
                    updateTime:'',//更新时间
                    queNum:'',//小题数量
                    largeQues:[{
                        queType:'',
                        queScores:0,//该道大题的总分值
                        smallQues:[{
                            queScore:'',//小题分数
                            chapter:null,
                            knows:[],
                        }]
                    }]
                },

                knows:[],//后端根据课程id传过来的章节列表（包含知识点）
                searchValue:{//条件搜索
                    courseId:'',
                    createTeacherId:'',
                },
                defaultProps: {
                    multiple:true,
                    /* expandTrigger: 'hover',*/
                    emitPath:false,
                    children: 'children',
                    label: 'name',
                    value:'id'
                },
                queTypeName:'',//添加新题型的名称
                updateTemplate:{
                    id:'',
                    name:'',
                    schoolId:'',
                    majorId:'',
                    semester:'',
                    courseId:'',
                    totalScore:0,
                    passScore:'',
                    remark:'',
                    questions:[{//大题
                        queType:'',
                        queInfo:[{//小题
                            score:'',
                            chapterId:'',
                            knowIds:[],
                        }]
                    }]

                },
                rules:{
                    name:[{required: true, message: '请输入试卷名称', trigger: 'blur' }],
                    courseId:[{required: true, message: '请选择课程', trigger: 'blur' }],
                    totalScore:[{required: true, message: '请输入试卷总分', trigger: 'blur' }],
                },
                queTypeRules:{
                    queTypeName: [{ required: true, message: '请输入题型名称', trigger: 'blur' }],
                },
                largeQueTypeNum:["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],
                paperTemplates:[],
                total:0,
                page:1,
                size:10,
            }
        }
        ,mounted() {
            this.initPaperTemplate();
            this.initCourses();
            this.initTeacher();
            this.initQueTypes();
            this.initSchools();
            this.initSemester();
        },
        computed:{
            alreadyDisScore:function () {//计算已经分配的分数
                let total=0;
                for (let i = 0; i < this.updateTemplate.questions.length; i++) {
                    for (let j = 0; j < this.updateTemplate.questions[i].queInfo.length; j++) {
                        total += Number(this.updateTemplate.questions[i].queInfo[j].score);
                    }
                }

                return total;
            },
            maxScore:function () {
                return (Number(this.updateTemplate.totalScore)-Number(this.alreadyDisScore))+1;
            }
        },
        methods:{
            initPaperTemplate(type){
                this.loading = true;
                let url = '/pap/template/?page=' + this.page + '&size=' + this.size;
                if (type && type == 'advanced') {//条件搜索
                    if (this.searchValue.courseId) {
                        url += '&courseId=' + this.searchValue.courseId;
                    }
                    if (this.searchValue.createTeacherId) {
                        url += '&createTeacherId=' + this.searchValue.createTeacherId;
                    }
                }else{//普通搜索
                    url+="&name="+this.keyword;
                }
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                      /*  console.log(resp.data);*/
                        this.paperTemplates=resp.data;
                        this.total=resp.total;
                    }
                })
            },
            initCourses(){
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
            initTeacher(){
                this.getRequest('/pap/template/getTeacher').then(resp => {
                    if (resp) {
                        this.teachers = resp;
                    }
                })
            },
            initQueTypes(){//初始化题型
                this.getRequest('/pap/template/getQueTypes').then(resp => {
                    if (resp) {
                        this.queTypes = resp;
                       /* console.log(this.queTypes)*/
                    }
                })
            },
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){

                        this.schools=resp;

                    }
                })
            },
            initMajors(){
                this.getRequest("/baseinfo/major/?schoolId="+this.updateTemplate.schoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                    }
                })
            },
            initSemester(){
                this.getRequest("/baseinfo/semester/").then(resp=>{
                    if(resp){
                        this.semester=resp;
                    }
                })
            },
            selectSchoolChanged(){
                this.initMajors();
            },
            clickKeyQuery(){

            },
            initChapterAndKnowsByCourseId(){
                //获取章节列表
                this.getRequest("/baseinfo/chapter/?courseId="+this.updateTemplate.courseId).then(resp=> {
                    if (resp) {
                        this.chapters=resp;
                    }
                })
                //获取知识点列表
                this.getRequest("/baseinfo/knows/all?courseId="+this.updateTemplate.courseId).then(resp=> {
                    if (resp) {
                        //this.knows=JSON.parse(JSON.stringify(resp));
                        this.knows=resp[0].children;
                    }
                })
            },
            selectCourseChanged(){
                //选择课程，初始化章节知识点
                this.initChapterAndKnowsByCourseId();
            },
            selectTeacherChanged(){

            },
            showInfoView(data){//查看试卷模板详情
                this.templateDetailInfo.largeQues=[];
                console.log(data);
                //这里需要把后端传来的TestPaper对象转为前端需要展示的templateDetailInfo对象
                this.templateDetailInfo.name=data.name;
                this.templateDetailInfo.schoolName=data.school.name;
                this.templateDetailInfo.courseName=data.course.name;
                this.templateDetailInfo.majorName=data.major.name;
                this.templateDetailInfo.semester=data.semester;
                this.templateDetailInfo.totalScore=data.totalScore;
                this.templateDetailInfo.passScore=data.passScore;
                this.templateDetailInfo.postTeacherName=data.teacher.name;
                this.templateDetailInfo.createTime=data.createTime;
                this.templateDetailInfo.updateTime=data.updateTime;

                if(data.questionScores!=null&& data.questionScores.length>0){
                    this.templateDetailInfo.queNum=data.questionScores.length;
                    let queTypes=data.queTypes.split('@');//取出题型数组
                    let largeQues=[];
                    for (let i = 0; i < queTypes.length; i++) {//首先根据题型的数量，新建大题
                        this.templateDetailInfo.largeQues.push({
                            queType:queTypes[i],
                            queScores:0,
                            smallQues:[]
                        })
                    }
                    let questionScores=data.questionScores;//获取试题数组

                    for (let i = 0; i < questionScores.length; i++) {
                        let qs=questionScores[i];//单个试题
                        for (let j = 0; j < this.templateDetailInfo.largeQues.length; j++) {//遍历大题，把小题放入大题
                            if(qs.queType==this.templateDetailInfo.largeQues[j].queType){
                                this.templateDetailInfo.largeQues[j].smallQues.push({
                                    queScore:qs.queScore,
                                    chapter:qs.chapter,
                                    knows:qs.knows
                                })
                                this.templateDetailInfo.largeQues[j].queScores+=Number(qs.queScore);//累计每小题的分值
                            }
                        }

                    }
                }
                this.detailTemplateDialogVisible=true;



            },
            showEditView(data){//编辑试题模板，首先验证是否是创建者进行编辑，否则没有权限操作
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                if(userObj.id!=data.teacher.id){
                    this.$alert('您没有修改权限！模板必须由创建者修改', '提示', {
                        confirmButtonText: '确定',

                        callback: action => {
                          /*  this.$message({
                                type: 'warning',
                                message: `action: ${ action }`
                            });*/
                        }
                    });
                   /* this.$notify({
                        title: '提示',
                        message: '您没有修改权限！模板必须由创建者修改',
                        type: 'warning'
                    });*/
                }else{
                    //展示修改对话框
                    this.title="修改试卷模板";
                    this.dialogVisible=true;
                    this.emptyUpdateInfo(data);
                    //这里需要将TestPaper对象转化为前端需要的updateTemplate对象
                    this.updateTemplate.id=data.id;
                    this.updateTemplate.name=data.name;
                    this.updateTemplate.schoolId=data.schoolId;
                    this.initMajors();
                    this.updateTemplate.majorId=data.majorId;
                    this.updateTemplate.semester=data.semester;
                    this.updateTemplate.courseId=data.courseId;

                    this.initChapterAndKnowsByCourseId();
                    this.updateTemplate.totalScore=data.totalScore;
                    this.updateTemplate.passScore=data.passScore;
                    this.updateTemplate.remark=data.remark;

                    if(data.questionScores!=null&& data.questionScores.length>0){
                        let queTypes=data.queTypes.split('@');//取出题型数组

                        for (let i = 0; i < queTypes.length; i++) {//首先根据题型的数量，新建大题

                            if(queTypes[i]!=null&&queTypes[i]!=''){
                                this.updateTemplate.questions.push({
                                    queType:queTypes[i],
                                    queInfo:[]
                                })
                            }

                        }

                        let questionScores=data.questionScores;//获取试题数组
                        for (let i = 0; i < questionScores.length; i++) {
                            let qs=questionScores[i];//单个试题
                            for (let j = 0; j < this.updateTemplate.questions.length; j++) {//遍历大题，把小题放入大题
                                if(qs.queType==this.updateTemplate.questions[j].queType){
                                    this.updateTemplate.questions[j].queInfo.push({
                                        score:qs.queScore,
                                        chapterId:qs.chapterId,
                                        knowIds:qs.knowIds.split('@'),
                                    })
                                }
                            }

                        }
                    }
                }

            },
            showAddQueTypeView(){//展示添加新题型对话框
                //this.dialogQueTypeVisible=true;
                this.$prompt('请输入题型名称', '提示', {//这里使用MessageBox 弹窗
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '题型名称为必填'
                }).then(({ value }) => {

                    this.postRequest("/pap/template/addQueType?name="+value).then(resp=>{
                        if(resp){

                            this.initQueTypes();//初始化刷新页面

                        }
                    })

                   /* this.$message({
                        type: 'success',
                        message: '你输入的是: ' + value
                    });*/
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            deleteHandler(data){
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                if(userObj.id!=data.teacher.id){
                    this.$alert('您没有删除权限！模板必须由创建者进行修改', '提示', {
                        confirmButtonText: '确定',

                        callback: action => {
                            /*  this.$message({
                                  type: 'warning',
                                  message: `action: ${ action }`
                              });*/
                        }
                    });
                    /* this.$notify({
                         title: '提示',
                         message: '您没有修改权限！模板必须由创建者修改',
                         type: 'warning'
                     });*/
                }else{
                    this.$confirm('此操作将永久删除【'+data.name+'】试卷模板, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/pap/template/"+data.id).then(resp=>{
                            if(resp){
                                this.initPaperTemplate();
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            showAddTemplateView(){
                this.dialogVisible=true;
                this.title="添加试卷模板"
            },
            emptySearchValue(){
                this.searchValue.courseId='';
                this.searchValue.createTeacherId='';
            },
            doAddTestPaperTemplate(){//添加试卷模板
                if(this.updateTemplate.id!=null){//编辑保存
                    this.updateTemplate.passScore=(Number(this.updateTemplate.totalScore)*0.6).toFixed(2);//及格分
                    this.$refs['templateForm'].validate((valid) => {
                        if (valid) {
                            this.putRequest("/pap/template/updateTemplate",this.updateTemplate).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;
                                    this.emptyUpdateInfo();
                                    this.initPaperTemplate();
                                }
                            })
                        } else {


                        }
                    });
                }else{//添加保存
                    this.updateTemplate.passScore=(Number(this.updateTemplate.totalScore)*0.6).toFixed(2);//及格分
                    this.$refs['templateForm'].validate((valid) => {
                        if (valid) {
                            this.postRequest("/pap/template/addTemplate",this.updateTemplate).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;
                                    this.emptyUpdateInfo();
                                    this.initPaperTemplate();
                                }
                            })
                        } else {


                        }
                    });
                }

            },

            deleteLargeQue(index){   //删除题型中的大题
                this.$confirm('此操作将删除该大题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.updateTemplate.questions.splice(index,1);//删除该下标的大题
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            addLargeQue(){ //添加题型中的大题
                this.updateTemplate.questions.push({
                    queType:'',
                    queInfo:[{
                        score:'',
                        chapterId:'',
                        knowIds:[],
                        dot:'',
                    }]
                })
            },
            addSmallQue(index){//添加小题，index为大题的下标
                if(this.alreadyDisScore>this.updateTemplate.totalScore){
                    this.$message.error('分数分配完毕，请重新检查！');
                }else{
                    this.updateTemplate.questions[index].queInfo.push({
                        score:'',
                        chapterId:'',
                        knowIds:[],
                        dot:'',
                    })
                }

            },
            deleteSmallQue(indexi,indexj){//删除小题，indexi为大题的下标,indexj为小题的下标
                this.updateTemplate.questions[indexi].queInfo.splice(indexj,1);
            },
            emptyUpdateInfo(data){
                this.updateTemplate.name='';
                this.updateTemplate.schoolId='';
                this.updateTemplate.majorId='';
                this.updateTemplate.semester='';
                this.updateTemplate.courseId='';
                this.updateTemplate.totalScore=0;
                this.updateTemplate.remark='';
                //这里清空数据，判断是否为添加时清空、编辑时清空

                if(data.id!=null){//编辑时清空
                    this.updateTemplate.questions=[]
                }else{//其他清空
                    this.updateTemplate.questions=[{
                        queType:'',
                        queInfo:[{
                            score:'',
                            chapterId:'',
                            knowIds: [],
                        }]
                    }]
                }
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initPaperTemplate();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initPaperTemplate();
            }


        }
    }
</script>

<style >
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 180px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>