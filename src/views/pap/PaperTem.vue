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
                    <el-button icon="el-icon-search" type="primary" @click="clickKeyQuery" > 搜索</el-button>
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
                loading1:false,
                keyword:'',
                courses:[],
                teachers:[],
                searchValue:{
                    courseId:'',
                    createTeacherId:'',

                },
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
                        console.log(resp.data);
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
            clickKeyQuery(){

            },
            selectCourseChanged(){

            },
            selectTeacherChanged(){

            },
            showInfoView(data){

            },
            showEditView(data){

            },
            deleteHandler(data){

            },
            showAddTemplateView(){

            },
            emptySearchValue(){
                this.searchValue.courseId='';
                this.searchValue.createTeacherId='';
            }

        }
    }
</script>

<style scoped>

</style>