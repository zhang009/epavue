<template>
    <div><!--课程管理-->
        <div style="display: flex;justify-content: space-between"><!--第一行工具栏-->
            <div><!--第一行左侧搜索-->

                <el-input placeholder="输入课程名搜索课程..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initCourseByPage"
                          style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initCourseByPage" :disabled="showAdvanceSearchView"></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initCourseByPage" :disabled="showAdvanceSearchView"> 搜索</el-button>
                <el-button  type="primary" @click="showAdvanceSearchView=!showAdvanceSearchView">
                    <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"/>
                    条件搜索</el-button>
            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
                <el-button type="primary" icon="el-icon-plus" @click="showAddClassView">
                    添加课程
                </el-button>
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->

        </div>
        <div>
            <transition name="fade">
                <div v-show="showAdvanceSearchView" style="border: 1px solid #409eff ;border-radius:5px;box-sizing: border-box;padding:5px;margin: 10px 0px; ">
                    <div>
                        <el-select v-model="searchValue.schoolId"
                                   @change="selectSchoolChanged"
                                   placeholder="请选择学院"
                                   size="small"
                                   style="width: 230px;margin-right: 5px">
                            <el-option
                                    v-for="item in schools"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchValue.majorId"
                                   @change="selectMajorChanged"
                                   placeholder="请选择专业"
                                   size="small"
                                   style="width: 230px;margin-right: 5px">
                            <el-option
                                    v-for="item in majors"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="searchValue.classId"
                                   @change="selectClassChanged"
                                   placeholder="请选择班级"
                                   size="small"
                                   style="width: 230px;margin-right: 5px">
                            <el-option
                                    v-for="item in classes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-button size="small" @click="emptySearchValue">重置</el-button>
                        <el-button size="small" icon="el-icon-search" type="primary" @click="initCourseByPage('advanced')">搜索</el-button>
                    </div>
                </div>
            </transition>

        </div>
        <div style="margin-top: 10px"><!--第二行表格内容展示-->
            <el-table
                    :data="courses"
                    stripe
                    border
                    style="width: 70%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"

                        label="编号"
                        width="100"><!--   prop="id"-->
                    <template slot-scope="scope">
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="课程名"
                        width="200"
                ></el-table-column>
                <el-table-column
                        prop="className"
                        label="开设班级"
                        width="200">

                </el-table-column>
                <el-table-column
                        prop="term"
                        label="学年学期"
                        width="200"
                ></el-table-column>
                <el-table-column
                        label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div  v-if="isPagVisiable" style="width: 70%;" >
                <el-pagination
                        style="text-align: right;margin-top: 10px"
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next,->,total"
                        :total="total">
                </el-pagination>
            </div>
            <!--        <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>-->

            <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    width="25%">
                <div>
                    <table>

                        <tr>
                            <td> <el-tag>选择学院</el-tag></td>
                            <td>
                                <el-select v-model="updateCourse.schoolId"
                                           @change="selectSchool2Changed"
                                           placeholder="请选择学院"
                                           size="small"
                                           :disabled="schoolDisabled"
                                           style="margin-left: 5px;width: 300px">
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
                                <el-select v-model="updateCourse.majorId"
                                           @change="selectMajor2Changed"
                                           placeholder="请选择专业"
                                           :disabled="majorDisabled"
                                           size="small"
                                           style="margin-left: 5px;width: 300px">
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
                            <td> <el-tag>选择班级</el-tag></td>
                            <td>
                                <el-select v-model="updateCourse.classId"
                                           placeholder="请选择班级"
                                           size="small"
                                           :disabled="classDisabled"
                                           style="margin-left: 5px;width: 300px">
                                    <el-option
                                            v-for="item in classes2"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>学年学期</el-tag></td>
                            <td>

                                <el-select
                                        placeholder="选择学期"
                                        size="small"
                                        v-model="updateCourse.term"
                                        style="margin-left: 5px;width: 300px">
                                    <el-option
                                            v-for="item in semester"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>课程名称</el-tag></td>
                            <td>
                                <el-input size="small"
                                          v-model.trim="updateCourse.name"
                                          placeholder="如：数据结构"
                                          style="margin-left: 5px;width: 300px"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAddCourse">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    export default {
        name: "CourseMana",
        data(){
            return{
                loading:false,
                isPagVisiable:true,
                keyword:'',
                title:'',
                showAdvanceSearchView:false,
                searchValue:{/*条件搜索值*/
                    schoolId:'',
                    majorId:'',
                    classId:''
                },
                semester:[],/*学期*/
                updateCourse:{//添加或更新课程
                    schoolId:'',
                    name:'',
                    term:'',
                    classId:'',
                    majorId:'',
                },
                schools:[],
                majors:[],
                classes:[],

                majors2:[],
                classes2:[],
                courses:[],
                total:0,
                page:1,
                size:10,
                dialogVisible:false,
                schoolDisabled:false,//禁用标志，用来修改课程时使用
                majorDisabled:false,
                classDisabled:false,

            }
        }
        ,mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
            //this.initMajors();
            this.initCourseByPage();
            this.initSemester();//初始化学年学期
        },methods:{
            doAddCourse(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateCourse.id){//更新
                    this.putRequest("/baseinfo/course/",this.updateCourse).then(resp=>{
                        if(resp){
                            this.initCourseByPage();
                            this.emptyUpdateCourseInfo();//清空输入框
                            this.dialogVisible=false;
                            if(this.updateCourse.id){
                                this.updateCourse.id='';
                            }
                        }
                    })
                }else {//添加
                    //console.log("添加：",this.updateCourse);
                    this.postRequest("/baseinfo/course/", this.updateCourse).then(resp => {
                        if (resp) {
                            this.initCourseByPage();
                            this.emptyUpdateCourseInfo();//清空输入框
                            this.dialogVisible=false;
                        }
                    })
                }

            },
            initSemester(){
                if(!window.sessionStorage.getItem("semester")){
                    this.getRequest("/baseinfo/semester/").then(resp=>{
                        if(resp){
                            this.semester=resp;
                            window.sessionStorage.setItem("semester", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.semester=JSON.parse(window.sessionStorage.getItem("semester"));
                }


            },
            emptySearchValue(){//清空条件搜索条件
                this.searchValue.schoolId='';
                this.searchValue.majorId='';
                this.searchValue.classId='';

            },
            selectSchoolChanged(){/*下拉框选择学院*/
                this.initMajors();
            },
            selectSchool2Changed(){/*添加或更新下拉框选择事件*/
                this.initMajors2();
            }
            ,selectMajorChanged(){/*下拉框选择专业*/
                //选择完专业后，初始化表格中的课程数据
                this.initClassByMajorId()
            },

            selectMajor2Changed(){//更新班级信息,根据专业id
                this.getRequest("/baseinfo/class/all?majorId="+this.updateCourse.majorId).then(resp=>{
                    if(resp){
                        this.classes2=resp;
                    }
                })
            },
            selectClassChanged(){

            },

            showAddClassView(){
                this.title='添加课程信息';
                this.schoolDisabled=false;
                this.majorDisabled=false;
                this.classDisabled=false;
                this.dialogVisible=true;
              /* this.searchValue.schoolId='';
               this.searchValue.majorId='';//清空查询的*/


                this.emptyUpdateCourseInfo();//清空输入框
            },
            initClassByMajorId(){/*根据专业获取班级列表*/
              //  alert(this.searchValue.majorId);
                this.getRequest("/baseinfo/class/all?majorId="+this.searchValue.majorId).then(resp=>{
                    if(resp){
                        this.classes=resp;
                    }
                })
            },
            initCourseByPage(type){//根据条件初始化分页的课程数据
                this.loading = true;//展示数据加载图标
                let url = '/baseinfo/course/withClass?page=' + this.page + '&size=' + this.size;
                if(type&&type=='advanced'){//条件搜索
                    if(this.searchValue.schoolId!=''&&this.searchValue.majorId==''){
                        this.$message.error('请选择专业');
                        return ;
                    }
                    if (this.searchValue.schoolId) {

                        url += '&schoolId=' + this.searchValue.schoolId;
                    }
                    if (this.searchValue.majorId) {

                        url += '&majorId=' + this.searchValue.majorId;
                    }
                    if (this.searchValue.classId) {
                        url += '&classId=' + this.searchValue.classId;
                    }
                }
                else {//普通搜索
                    url+="&name="+this.keyword;
                }
               // console.log("url:",url);
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                        console.log(resp.data);
                        this.courses=resp.data;
                        this.total=resp.total;
                    }
                })
            }
           ,initSchools(){
                if(!window.sessionStorage.getItem("schools")){
                    this.getRequest("/baseinfo/school/all").then(resp=>{
                        if(resp){
                            this.schools=resp;
                            window.sessionStorage.setItem("schools", JSON.stringify(resp));
                        }

                    })
                }else{
                    this.schools=JSON.parse(window.sessionStorage.getItem("schools"));
                }
            },
            initMajors2(){/*添加或更新选择专业*/
                
                this.getRequest("/baseinfo/major/?schoolId="+this.updateCourse.schoolId).then(resp=>{
                    if(resp){
                        this.majors2=resp;
                    }
                })
            },
            initMajors(){
                //alert(this.searchValue.schoolId);
                this.getRequest("/baseinfo/major/?schoolId="+this.searchValue.schoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                    }
                })
            },showEditView(data){
                console.log("schools:",this.schools);
                console.log("majors2:",this.majors2);
                console.log("classes2:",this.classes2);

                Object.assign(this.updateCourse,data);
                console.log("updateCourse:",this.updateCourse);
                this.initMajors2();
               this.selectMajor2Changed();
                this.$forceUpdate();
                this.title='编辑课程信息';

                this.schoolDisabled=true;
                this.majorDisabled=true;
                this.classDisabled=true;

                this.dialogVisible=true;//显示编辑对话框

            }
            ,deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.name+'】课程, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/baseinfo/course/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initCourseByPage();//刷新表格
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            emptyUpdateCourseInfo(){//清空添加或编辑操作之后的输入框值
                this.updateCourse={};
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initCourseByPage();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initCourseByPage();
            },
        }
    }
</script>

<style scoped>

</style>