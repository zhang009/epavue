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
                               <el-radio :label="scope.row.id" v-model="radioId" @change.native="getCurrentRow(scope.row)" ></el-radio>
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
                        <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <!--<el-button size="mini" @click="showTestPaperInfoView(scope.row)">查看</el-button>
                                <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>-->
                            </template>
                        </el-table-column>
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

    </div>
</template>

<script>
    export default {
        name: "GraInput",
        data(){
            return{
                loading1:false,
                selectTestPaperDialogVisible:false,
                schools:[],
                majors:[],
                classes:[],
                courses:[],
                postTeachers:[],
                searchValue:{/*条件搜索值*/
                    testPaperName:'',
                    createTeacherId:'',
                    courseId:'',
                    isTemplate:0,
                },
                testPaper:{},//存放选中的试卷信息
                testPapers:[],
                total:0,
                page:1,
                size:10,
                radioId:'',

            }
        },created() {

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
                this.testPaper=row;
                this.radioId=row.id;
            },
            selectTestPaperSubmit(){

            },
            getCurrentRow(data){
                this.testPaper=data;
                console.log(this.testPaper);
            },
            initTestPaper(){
                console.log(this.searchValue);
                this.loading1 = true;
                let url = '/pap/testPaper/?page=' + this.page + '&size=' + this.size;
                if (this.searchValue.courseId) {
                    url += '&courseId=' + this.searchValue.courseId;
                }
                if (this.searchValue.createTeacherId) {
                    url += '&postTeacherId=' + this.searchValue.createTeacherId;
                }
                if (this.searchValue.createPaperType) {
                    url += '&paperType=' + this.searchValue.createPaperType;
                }
                if (this.searchValue.isTemplate) {
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
            selectClassChanged(){
                //班级下拉框改变
                this.initCourseByClassId();
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
            }
        }
    }
</script>

<style scoped>

</style>