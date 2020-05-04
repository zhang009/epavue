<template>
    <div><!--成绩录入-->
        <el-dialog
            title="选择试卷"
            :center="true"
            :visible.sync="selectTestPaperDialogVisible"
            width="80%">
            <div style="padding-left: 100px;padding-right: 100px">
                <div ><!--搜索栏-->
                    <el-row :gutter="5">
                        <el-col :span="7">
                            试卷名称：
                            <el-input size="small"
                                      style="width: 200px"
                                      v-model="searchValue.testPaperName"
                            >
                            </el-input>
                        </el-col>
                        <el-col :span="7">
                            课程：
                            <el-select v-model="searchValue.courseId"
                                       @change="selectCourseChanged"
                                       placeholder="请选择课程"
                                       size="small"
                                       style="width: 230px;margin-right: 5px">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            创建人：
                            <el-select v-model="searchValue.createTeacherId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择创建人"
                                       size="small"
                                       style="width: 200px;">
                                <el-option
                                        v-for="item in postTeachers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 20px">
                        <el-col :span="8">
                            <div >
                                试卷类型：
                                <el-radio-group
                                        size="small"
                                        style="width: 240px;"
                                        v-model="searchValue.isTemplate">
                                    <el-radio :label='0' border>系统组卷</el-radio>
                                    <el-radio :label='1' border>试卷模板</el-radio>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                    <div align="center" style="margin-top: 20px">
                        <el-button size="small"  >重置</el-button>
                        <el-button size="small" type="primary" @click="initTestPaper">搜索</el-button>
                    </div>
                </div>
                <el-divider></el-divider>
                <div style="height: 600px">
                    <el-table
                            :data="testPapers"
                            stripe
                            v-loading="loading1"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.7)"
                            style="width: 100%"
                            @row-click="rowClick"
                            :default-sort = "{prop: 'createTime', order: 'descending'}">
                        <!--<el-table-column
                                type="index"
                                label="编号"
                                fixed
                                width="80">&lt;!&ndash;   prop="id"&ndash;&gt;
                            <template slot-scope="scope">
                                <span>{{(page - 1) * size + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>-->
                        <el-table-column
                            width="25">
                            <template slot-scope="scope">
                               <el-radio :label="scope.row.id" v-model="radioId" @change="getCurrentRow(scope.row)" ></el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="试卷名称"
                                prop="name"
                                width="250">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="试卷类型"
                                prop="paperType"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isTemplate==0">系统组卷</span>
                                <span v-else>试卷模板</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="总分"
                            prop="totalScore"
                            width="100">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="课程"
                                prop="course"
                                width="200">
                            <template slot-scope="scope">
                                {{scope.row.course.name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="学年学期"
                                prop="semester"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="teacher"
                                label="创建人"
                                width="100">
                            <template slot-scope="scope">
                                {{scope.row.teacher.name}}
                            </template>
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="创建时间"
                                prop="createTime"
                                sortable
                                width="180">
                        </el-table-column>
                       <!-- <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="showTestPaperInfoView(scope.row)">查看</el-button>
                                <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                    <div style="text-align: right;width: 92%;margin-top: 10px">
                        <el-pagination
                                background
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, total, slot"
                                :total="total">
                        </el-pagination>
                    </div>

                </div>
                <div align="center">
                     <span slot="footer" class="dialog-footer" >
                            <el-button  @click="selectTestPaperDialogVisible=false">关闭</el-button>
                            <el-button type="primary" @click="selectTestPaperSubmit">确 定</el-button>
                </span>
                </div>

            </div>

        </el-dialog>
        <div v-if="showGradeInputDiv"><!--添加成绩主页面-->
            <div >
                <el-divider></el-divider>
                <el-form>
                    <el-row :gutter="3">
                        <el-col :span="8">
                            <el-form-item label="专业信息：">{{testPaper.major.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label=" 课程信息：">{{testPaper.course.name}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="3">
                        <el-col :span="8">
                            <el-form-item label=" 试卷名称：">  {{testPaper.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="试卷总分：">{{testPaper.totalScore}}分</el-form-item>

                        </el-col>
                    </el-row>
                </el-form>

                <el-row style="margin-top: 20px">
                    <el-col :span="24">
                        选择班级：
                        <el-select v-model="searchValue2.classId"
                                   @change="selectClassChanged"
                                   placeholder="选择班级"
                                   size="small"
                                   style="width: 230px;margin-right: 5px">
                            <el-option
                                    v-for="item in classes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button size="small" type="primary" @click="initStudentGrades">确定</el-button>
                        <span style="color: #909399">（该试卷下共有{{classTotalNum}}个班级）</span>

                        <el-link  type="primary" @click="showAddClassView" :underline="false">新建班级</el-link>

                    </el-col>
                </el-row>
            </div>
            <!--成绩展示table-->
            <div style="margin-top: 20px">


                <div align="right" style="width: 80%">
                    <el-button size="small" type="primary" @click="showAddGradeView">添加成绩信息</el-button>
                    <el-button size="small" type="primary" @click="showMultiAddGradeView">批量添加</el-button>
                </div>

                <el-table
                        :data="studentGrades"
                        stripe
                        border
                        v-loading="loading2"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.7)"
                        style="width: 80%">
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
                            label="班级"
                            width="180">
                        <template slot-scope="scope">
                            {{scope.row.clazz.name}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="学生姓名"
                            prop="studentName"
                            width="130">
                    </el-table-column>
                    <el-table-column
                            label="学号"
                            prop="studentNum"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="课程"
                            width="220">
                        <template slot-scope="scope">
                            {{testPaper.course.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="成绩"
                            width="130">
                        <template slot-scope="scope">
                            {{scope.row.totalGrade}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" >详情</el-button>
                        </template>
                    </el-table-column>


                </el-table>
                <div style="text-align: right;width: 80%;margin-top: 10px">
                    <el-pagination
                            background
                            @size-change="sizeChange2"
                            @current-change="currentChange2"
                            layout="sizes, prev, pager, next, jumper, total, slot"
                            :total="total2">
                    </el-pagination>
                </div>
            </div>

            <!--添加成绩-->
            <el-dialog
                    title="添加学生成绩"
                    :center="true"
                    :visible.sync="showAddGradeVisible"
                    width="50%">
                <div style="padding-left: 80px;padding-right: 80px">
                    <div >
                        <el-divider content-position="left">学生基本信息</el-divider>
                        <el-row :gutter="2" style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    班级：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                {{className}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    学生姓名：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <el-select v-model="updateStudentGrade.studentName"
                                           placeholder="选择学生姓名"
                                           size="small"
                                           @change="selectStudentChange"
                                           style="width: 200px;margin-right: 5px">
                                    <el-option
                                            v-for="item in students"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select>
                               <!-- <el-input size="small"
                                          style="width: 200px"
                                          v-model="updateStudentGrade.studentName">
                                </el-input>-->
                            </el-col>
                        </el-row>
                        <el-row :gutter="2" style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    学号：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <el-input size="small"
                                          style="width: 200px"
                                          disabled
                                          v-model="updateStudentGrade.studentNum"
                                >
                                </el-input>
                            </el-col>
                        </el-row>

                         <el-row style="margin-bottom: 20px">
                             <el-col :span="5" :offset="5">
                                 <div align="right">
                                 总成绩：
                                 </div>
                             </el-col>
                             <el-col :span="14">
                                 <el-input size="small"
                                           style="width: 200px"
                                           v-model="updateStudentGrade.totalGrade">
                                 </el-input>
                             </el-col>
                         </el-row>
                        <el-divider content-position="left">填写小题得分信息</el-divider>
                        <div>
                            已分配得分：<span style="color: red">{{allocationGrade}}</span>
                        </div>
                        <div  style="margin-left: 100px;margin-top: 20px">
                            <div v-for="(largeQue,indexi) in updateStudentGrade.largeQues" :key="indexi" style="margin-top: 20px;">
                                <div v-if="largeQue.queType!=null&&largeQue.queType!=''" style="margin-bottom: 10px"><!--大题标题-->
                                    第{{largeQueTypeNum[indexi]}}大题、<strong>{{largeQue.queType}}</strong>
                                    （共{{largeQue.smallQueGrade.length}}小题，共{{largeQue.largeQueScore}}分）
                                </div>
                                <div v-for="(smallQue,indexj) in largeQue.smallQueGrade" :key="indexj">
                                    <el-row style="margin-top: 10px">
                                        <el-col :span="4" style="" align="center">
                                            <el-tag  effect="plain">试题{{indexj+1}}.</el-tag><!--小题序号-->
                                        </el-col>
                                        <el-col :span="5" style="padding-top: 5px">
                                            原分值:{{smallQue.initScore}} 分
                                        </el-col>
                                        <el-col :span="8" style="">
                                            得分:
                                            <el-input
                                                    v-model="smallQue.queGrade"
                                                    size="small"
                                                    style="width: 100px"
                                            >
                                            </el-input>
                                             分
                                        </el-col>
                                    </el-row>

                                </div>
                            </div>
                        </div>
                        <div align="center" style="margin-top: 20px">
                            <el-button size="small"  @click="showAddGradeVisible=false">取消</el-button>
                            <el-button size="small" type="primary" @click="doSaveStudentGrade">保存</el-button>
                        </div>
                    </div>



                </div>

            </el-dialog>
            <!--批量添加成绩对话框-->
            <el-dialog
                    title="批量添加学生成绩数据"
                    :visible.sync="mutiAddStuDialogVisible"
                    width="50%"

                    @close="emptyMutiStudentInfo"
                    :close-on-click-modal="false">
                <div style="margin: 0 auto">
                    <div style="display: flex;justify-content: center;align-items: center;width: 50%;">
                        <p>导入数据前可以从这里<el-link type="primary" @click="exportData">下载模板</el-link>并将用户的信息整理到模板中，请使用模板给出的提示填写字段</p>

                        <el-upload
                                v-loading.fullscreen.lock="loading3"
                                element-loading-text="拼命解析数据中..."
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(0, 0, 0, 0.7)"
                                :on-error="onError"
                                :on-success="onSuccess"
                                :show-file-list="false"
                                :before-upload="beforeUpload"
                                :disabled="importDataDisabled"
                                style="display: inline-flex;margin-right: 8px"
                                :data="importData"
                                action="/gra/input/import">
                            <el-button :disabled="importDataDisabled" type="primary" :icon="importDataBtnIcon">
                                <!-- <i class="fa fa-level-up" aria-hidden="true" icon="el-icon-download"/>-->
                                {{importDataBtnText}}<!--导入数据-->
                            </el-button>
                        </el-upload>
                    </div>

                </div>
                <div style="display: flex;align-items: center;justify-content: center;padding: 0px;margin: 0px;">
                   <span slot="footer" class="dialog-footer">
                   </span>
                </div>

            </el-dialog>
            <!--添加班级对话框-->
            <el-dialog
                    title="添加班级"
                    :visible.sync="showAddClassVisible"
                    width="25%">
                <div>
                    <table>

                        <tr>
                            <td> <el-tag>选择学院</el-tag></td>
                            <td>
                                <el-select v-model="searchValue3.schoolId"
                                           @change="selectSchool3Changed"
                                           placeholder="请选择学院"
                                           size="small"
                                           style="margin-left: 5px;width: 240px">
                                    <el-option
                                            v-for="item in schools"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>选择专业</el-tag></td>
                            <td>
                                <el-select v-model="searchValue3.majorId"
                                           @change="selectMajor3Changed"
                                           placeholder="请选择专业"
                                           size="small"
                                           style="margin-left: 5px;width: 240px">
                                    <el-option
                                            v-for="item in majors2"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>选择年级</el-tag></td>
                            <td>
                                <el-select v-model="addTestPaperClass.classId"
                                           @change="selectClassChanged"
                                           placeholder="请选择班级"
                                           size="small"
                                           style="width: 240px;margin-left: 5px">
                                    <el-option
                                            v-for="item in classes2"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>

                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAddClassVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addTestPaperClassInfo">确 定</el-button>
              </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "GraInput",
        data(){
            return{
                loading1:false,//加载试卷列表
                loading2:false,//选择班级，加载成绩列表
                loading3:false,//导入数据加载
                selectTestPaperDialogVisible:false,
                showGradeInputDiv:false,
                showAddClassVisible:false,//添加班级对话框
                showAddGradeVisible:false,//添加成绩对话框
                mutiAddStuDialogVisible:false,//批量添加成绩对话框
                importDataBtnIcon:'el-icon-upload2',
                importDataDisabled:false,
                importDataBtnText:'导入数据',
                schools:[],
                majors:[],
                classes:[],
                courses:[],

                majors2:[],//这里是添加班级存储的
                classes2:[],//这里是添加班级存储的
                postTeachers:[],
                studentGrades:[],//根据班级查询到的成绩列表
                searchValue:{/*选择试卷条件搜索值*/
                    testPaperName:'',
                    createTeacherId:'',
                    courseId:'',
                    isTemplate:0,
                },
                searchValue2:{
                    classId:'',
                    testPaperId:'',
                },
                searchValue3:{//添加班级
                    schoolId:'',
                    majorId:'',
                    classId:''
                },
                testPaper:{},//存放选中的试卷信息
                testPapers:[],
                students:[],//当用户选择完班级，获取到学生的集合
                className:'',//存储临时班级的名称（添加成绩对话框显示）
                total:0,
                page:1,
                size:10,
                page2:1,//学生成绩页码
                size2:10,
                total2:10,
                radioId:'',
                addTestPaperClass:{//在试卷下添加班级的信息
                    classId:'',
                    testPaperId:'',
                },
                updateStudentGrade:{
                    testPaperId:'',
                    courseId:'',
                    classId:'',
                    studentName:'',
                    studentNum:'',
                    totalGrade:'',
                    largeQues:[]
                },

                /*largeQues:[{
                        queType:'',
                        largeQueScore:0,
                        smallQueGrade:[{
                            initScore:'',//初始分值
                            queGrade:'',//实际得分
                            queGrade:'',
                            sortNum:'',
                        }]
                    }]*/
                largeQueTypeNum:["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],
                importData:{//批量导入时传递给后端的数据
                    testPaperId:'',
                    courseId:'',
                    classId:'',
                }

            }
        },created() {

        },
        computed:{
            classTotalNum:function () {//试卷有多少个班级
                return Number(this.classes.length);
            },
            allocationGrade:function () {//已分配的成绩

                let total=0;
                for (let i = 0; i < this.updateStudentGrade.largeQues.length; i++) {
                    for (let j = 0; j < this.updateStudentGrade.largeQues[i].smallQueGrade.length; j++) {
                        total += Number(this.updateStudentGrade.largeQues[i].smallQueGrade[j].queGrade);
                    }
                }
                return total;
            }
        },


        mounted() {
            this.initCourse();
            this.initPostTeachers();
            var that=this;
            setTimeout(function () {//跳转到试题查询页面
                that.selectTestPaperDialogVisible=true;
            },500);


        },methods:{
            rowClick(row){//选中试卷表格数据的某一行，触发该事件

                this.testPaper=JSON.parse(JSON.stringify(row));//对象的深拷贝
                this.radioId=row.id;
            },
            selectTestPaperSubmit(){//选择试卷后，点击确定后触发
                if(Object.keys(this.testPaper).length!=0){//这里是判断对象为空的方法
                    //根据试卷的id,查询出该试卷下有多少班级（），返回班级列表
                    this.initTestPaperClass();
                    this.selectTestPaperDialogVisible=false;
                    this.showGradeInputDiv=true;
                }else{
                    this.$message.error('请先选择试卷');
                }
            },
            showAddClassView(){
                //this.dialogQueTypeVisible=true;
                this.showAddClassVisible=true;
                this.initSchools();

            },
            selectStudentChange(){//选择完学生的姓名触发事件

                console.log(this.students!=null);
               /* console.log(this.updateStudentGrade.studentName);*/
                //显示学生的学号
                if(this.students!=null){

                    for (let i = 0; i < this.students.length; i++) {
                        if(this.updateStudentGrade.studentName==this.students[i].name){
                            console.log(this.students[i].studentName)
                            this.updateStudentGrade.studentNum=this.students[i].studentNum;
                            break;
                        }
                    }
                }
                //判断成绩是否存在
                if(this.studentGrades!=null){
                    for (let i = 0; i < this.studentGrades.length; i++) {
                        if(this.studentGrades[i].studentName==this.updateStudentGrade.studentName){
                            //提示信息
                            this.$message.error('该生成绩已存在，请检查');
                            break;
                        }
                    }
                }


            },
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.schools=resp;

                    }
                })
            },
            getCurrentRow(data){
                alert();
                this.testPaper=data;
                console.log(this.testPaper);
            },
            initTestPaperClass(){//初始化该试卷下有的班级
                this.getRequest('/gra/input/allTestPaperClass?testPaperId='+this.testPaper.id).then(resp => {
                    if (resp) {
                        this.classes = resp;
                        console.log(this.classes);
                    }
                })
                this.selectClassChanged();

            },
            initTestPaper(){

                this.loading1 = true;
                let url = '/gra/input/getAllTestPaper?page=' + this.page + '&size=' + this.size;
                if (this.searchValue.courseId) {
                    url += '&courseId=' + this.searchValue.courseId;
                }
                if (this.searchValue.createTeacherId) {
                    url += '&postTeacherId=' + this.searchValue.createTeacherId;
                }
                if (this.searchValue.isTemplate==0||this.searchValue.isTemplate==1) {
                    url += '&isTemplate=' + this.searchValue.isTemplate;
                }
                if (this.searchValue.testPaperName) {
                    url+="&name="+this.searchValue.testPaperName;
                }

                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading1 = false;
                        /*  console.log(resp.data);*/
                        this.testPapers=resp.data;
                        this.total=resp.total;
                    }
                })

            },
            initAllTeachers(){
                if(!window.sessionStorage.getItem("AllPostTeachers")){
                    this.getRequest('/pap/testPaper/getAllPostTeachers').then(resp => {
                        if (resp) {
                            this.postTeachers = resp;
                            window.sessionStorage.setItem("AllPostTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.postTeachers=JSON.parse(window.sessionStorage.getItem("AllPostTeachers"));
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
            initPostTeachers(){
                if(!window.sessionStorage.getItem("AllPostTeachers")){
                    this.getRequest('/pap/testPaper/getAllPostTeachers').then(resp => {
                        if (resp) {
                            this.postTeachers = resp;
                            window.sessionStorage.setItem("AllPostTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.postTeachers=JSON.parse(window.sessionStorage.getItem("AllPostTeachers"));
                }
            },

            selectSchoolChanged(){
                //学院下拉框改变
                this.initMajors();
            },
            selectMajorChanged(){
                //专业下拉框改变
                this.initClassByMajorId();
            },
            initStudentGrades(){
                this.loading2 = true;
                let url = '/gra/input/allStudentGradesByClassId?page=' + this.page2 + '&size=' + this.size2;
                if (this.searchValue2.classId) {
                    url += '&classId=' + this.searchValue2.classId;
                }
                if (this.testPaper.id) {
                    url += '&testPaperId=' + this.testPaper.id;
                }
                console.log(url)
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading2 = false;
                        this.studentGrades=resp.data;
                        this.total2=resp.total;
                        console.log(resp.data);
                    }
                })
            },
            selectClassChanged(){//选择完班级信息，查询出该班级下的所有学生的成绩表
               //this.initStudentGrades();
                //给临时班级名称赋值，用于下一步的显示

                for (let i = 0; i < this.classes.length; i++) {
                    if(this.classes[i].id==this.searchValue2.classId){
                        this.className=this.classes[i].name;
                        break;
                    }
                }


            },
            //添加该试卷下的班级
            addTestPaperClassInfo(){

                this.addTestPaperClass.testPaperId=this.testPaper.id;

                if(this.addTestPaperClass.classId!=''&&this.addTestPaperClass.testPaperId!=''){
                    this.postRequest('/gra/input/addTestPaperClass',this.addTestPaperClass).then(resp=>{
                        if(resp){

                            this.initTestPaperClass();
                            this.showAddClassVisible=false;
                        }
                    })
                }

            },
            selectCourseChanged(){

            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initTestPaper();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initTestPaper();
            },
            sizeChange2(currentSize){
                this.size2=currentSize;
                this.initStudentGrades();
            },
            currentChange2(currentPage){//里面的参数为当前页
                this.page2=currentPage;
                this.initStudentGrades();
            },
            selectSchool3Changed(){//添加班级，选择学院
                this.getRequest("/baseinfo/major/?schoolId="+this.searchValue3.schoolId).then(resp=>{
                    if(resp){
                        this.majors2=resp;
                    }
                })
            },
            selectMajor3Changed(){
                this.getRequest("/gra/input/getAllClassByMajorId?majorId="+this.searchValue3.majorId).then(resp=>{
                    if(resp){
                        this.classes2=resp;
                    }
                })
            },
            showAddGradeView(){//显示添加成绩对话框
                //获取学生信息
                this.getRequest('/baseinfo/stu/getAllStudentByClassId?classId='+this.searchValue2.classId).then(resp => {
                    if (resp) {
                        this.students = resp;
                    }
                })
                this.emptyStudentInfo();//清空学生数据
                //初始化试题得分
                if(this.searchValue2.classId!=''){
                    //把testPaper中的小题成绩初始化为updateStudentGrade中的结构
                    //需要把
                    if(this.testPaper.questionScores!=null&& this.testPaper.questionScores.length>0){
                        let queTypes=this.testPaper.queTypes.split('@');
                        let largeQues=[];
                        for (let i = 0; i <queTypes.length ; i++) {//初始化大题
                            this.updateStudentGrade.largeQues.push({
                                queType:queTypes[i],
                                largeQueScore:'',
                                smallQueGrade:[]
                            })
                        }
                        let questionScores=this.testPaper.questionScores;//获取试题数组
                        for (let i = 0; i < questionScores.length; i++) {
                            let smallQue=questionScores[i];//单个试题
                            for (let j = 0; j < this.updateStudentGrade.largeQues.length; j++) {
                                //把小题放入大题数组中
                                if(smallQue.queType==this.updateStudentGrade.largeQues[j].queType){
                                    this.updateStudentGrade.largeQues[j].smallQueGrade.push({
                                        initScore:smallQue.queScore,//初始分值
                                        queGrade:'',//实际得分
                                        questionScoreId:smallQue.id,//试卷小题分数id
                                        sortNum:smallQue.sortNum,//试卷小题分数排序号
                                    })
                                    this.updateStudentGrade.largeQues[j].largeQueScore=Number(this.updateStudentGrade.largeQues[j].largeQueScore)+Number(smallQue.queScore);//累计每小题的分值
                                }
                            }

                        }
                    }
                    this.showAddGradeVisible=true;
                }else{
                    this.$message.error('请先选择班级');
                }

            },
            showMultiAddGradeView(){//批量添加成绩

                if(this.searchValue2.classId!=''){
                    //把testPaper中的小题成绩初始化为updateStudentGrade中的结构
                    //需要把
                    if(this.testPaper.questionScores!=null&& this.testPaper.questionScores.length>0){
                        let queTypes=this.testPaper.queTypes.split('@');
                        let largeQues=[];
                        for (let i = 0; i <queTypes.length ; i++) {//初始化大题
                            this.updateStudentGrade.largeQues.push({
                                queType:queTypes[i],
                                largeQueScore:'',
                                smallQueGrade:[]
                            })
                        }
                        let questionScores=this.testPaper.questionScores;//获取试题数组
                        for (let i = 0; i < questionScores.length; i++) {
                            let smallQue=questionScores[i];//单个试题
                            for (let j = 0; j < this.updateStudentGrade.largeQues.length; j++) {
                                //把小题放入大题数组中
                                if(smallQue.queType==this.updateStudentGrade.largeQues[j].queType){
                                    this.updateStudentGrade.largeQues[j].smallQueGrade.push({
                                        initScore:smallQue.queScore,//初始分值
                                        queGrade:'',//实际得分
                                        questionScoreId:smallQue.id,//试卷小题分数id
                                        sortNum:smallQue.sortNum,//试卷小题分数排序号
                                    })
                                    this.updateStudentGrade.largeQues[j].largeQueScore=Number(this.updateStudentGrade.largeQues[j].largeQueScore)+Number(smallQue.queScore);//累计每小题的分值
                                }
                            }

                        }
                    }
                    this.showAddGradeVisible=true;
                }else{
                    this.$message.error('请先选择班级');
                }

            },
            doSaveStudentGrade(){//保存成绩信息
                this.updateStudentGrade.testPaperId=this.testPaper.id;
                this.updateStudentGrade.courseId=this.testPaper.courseId;
                this.updateStudentGrade.classId=this.searchValue2.classId;

                console.log(this.updateStudentGrade)
                //验证信息
                this.postRequest('/gra/input/addStudentGrade',this.updateStudentGrade).then(resp=>{
                    if(resp){
                        this.initStudentGrades();
                        this.showAddGradeVisible=false;
                        //清空试题得分信息
                        this.emptyStudentInfo();
                    }
                })
            },
            emptyStudentInfo(){
                this.updateStudentGrade.studentName='';
                this.updateStudentGrade.studentNum='';
                this.updateStudentGrade.totalGrade='';
                this.updateStudentGrade.largeQues=[];
            },
            emptyMutiStudentInfo(){

            },
            exportData(){
                if(this.testPaper.id!=''&&this.testPaper.courseId!=''&&this.searchValue2.classId){
                    window.open('/question/input/getTem?testPaperId='+
                        this.testPaper.id+'&courseId='+
                        this.testPaper.courseId+'&classId='+this.searchValue2.classId,'_parent');
                }
            },
            beforeUpload(){//上传成绩之前事件
                this.updateStudentGrade.testPaperId=this.testPaper.id;
                this.updateStudentGrade.courseId=this.testPaper.courseId;
                this.updateStudentGrade.classId=this.searchValue2.classId;

                this.importDataBtnText='正在导入';
                this.importDataBtnIcon='el-icon-loading';
                this.importDataDisabled=true;
            },
            onError(response,file,fileList){
                this.loading3=false;
                this.mutiAddStuDialogVisible=false;
                this.$message.error('数据导入失败！');

            },
            onSuccess(response,file,fileList){
                this.mutiAddStuDialogVisible=false;
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.importDataDisabled=false;
                this.loading3=false;
                this.mutiAddStuDialogVisible = false;
                this.checkTeacherId='',
                    this.courseId='',
                    this.activeItemIndex=0;
                this.$message({
                    message: '导入数据成功！',
                    type: 'success'
                });

                this.initStudentGrades();
            },
        }
    }
</script>

<style scoped>

</style>