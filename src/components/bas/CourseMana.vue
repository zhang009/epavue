<template>
    <div><!--课程管理-->
        <div style="display: flex;justify-content: space-between"><!--第一行工具栏-->
            <div><!--第一行左侧搜索-->
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
                <el-input placeholder="搜索课程..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initCourseByPage"
                          style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initCourseByPage" ></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initCourseByPage" > 搜索</el-button>

            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
                <el-button type="primary" icon="el-icon-plus" @click="showAddClassView">
                    添加课程
                </el-button>
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->
        </div>
        <div style="margin-top: 10px"><!--第二行表格内容展示-->
            <el-table
                    :data="courses"
                    stripe
                    border
                    style="width: 60%">
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
                        prop="term"
                        label="学年学期"
                        width="200"
                ></el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div  v-if="isPagVisiable">
                <el-pagination
                        style="text-align: center;margin-top: 10px"
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next"
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
                                           placeholder="请选择专业"
                                           size="small"
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
                                <el-input size="small"
                                          v-model.trim="updateCourse.term"
                                          placeholder="如：2019-2020学年第一学期"
                                          style="margin-left: 5px;width: 300px"></el-input>
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
                searchValue:{/*条件搜索值*/
                    schoolId:'',
                    majorId:'',
                    classId:''
                },
                updateCourse:{
                    name:'',
                    term:'',
                    classId:'',
                },
                schools:[],
                majors:[],
                classes:[],
                schools2:[],
                majors2:[],
                classes2:[],
                courses:[],
                total:0,
                page:1,
                size:10,
                dialogVisible:false,

            }
        }
        ,mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
            //this.initMajors();
            this.initCourseByPage();
        },methods:{
            doAddCourse(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateCourse.id){//更新
                    this.putRequest("/baseinfo/course/",this.updateCourse).then(resp=>{
                        if(resp){
                            this.initCourseByPage();
                            this.updateCourse.name='';
                            this.updateCourse.grade='';
                            this.dialogVisible=false;
                            if(this.updateCourse.id){
                                this.updateCourse.id='';
                            }
                        }
                    })
                }else {//添加
                    this.postRequest("/baseinfo/course/", this.updateCourse).then(resp => {
                        if (resp) {
                            this.initCourseByPage();
                            this.updateCourse.name='';
                            this.updateCourse.term='';
                            this.dialogVisible=false;
                        }
                    })
                }
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
                this.initCourseByClassIdId();
            },

            showAddClassView(){
                this.title='添加课程信息';
                this.dialogVisible=true;
               this.searchValue.schoolId='';
               this.searchValue.majorId='';
                this.updateCourse.classId='';
            },
            initClassByMajorId(){/*根据专业获取班级列表*/
              //  alert(this.searchValue.majorId);
                this.getRequest("/baseinfo/class/all?majorId="+this.searchValue.majorId).then(resp=>{
                    if(resp){
                        this.classes=resp;
                    }
                })
            },
            initCourseByPage(){/*根据条件初始化分页的课程*/
                this.loading = true;//展示数据加载图标
                let url = '/baseinfo/course/?page=' + this.page + '&size=' + this.size;
                if (this.searchValue.classId!='') {//条件搜索
                    if (this.searchValue.classId) {
                       // alert(this.searchValue.classId);
                        url += '&classId=' + this.searchValue.classId;
                    }
                }else if(this.keyword!=''){//普通搜索
                    url+="&name="+this.keyword;
                }
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
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.schools=resp;
                    }
                })
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
                Object.assign(this.updateCourse,data)
                this.title='编辑课程信息';
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