<template>
    <div><!--班级管理-->
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
                <el-input placeholder="搜索班级..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initClassByPage"
                          style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initClassByPage" ></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initClassByPage" > 搜索</el-button>

            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
                <el-button type="primary" icon="el-icon-plus" @click="showAddClassView">
                    添加班级
                </el-button>
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->
        </div>
        <div style="margin-top: 10px"><!--第二行表格内容展示-->
            <el-table
                    :data="classes"
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
                        width="100"><!--  prop="id" -->
                    <template slot-scope="scope">
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="年级"
                        width="100"
                ></el-table-column>
                <el-table-column
                        prop="name"
                        label="班级名称"
                        width="200"
                ></el-table-column>
                <el-table-column
                        prop="major.name"
                        label="所在专业"
                        width="200"
                >
                </el-table-column>
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
                                <el-select v-model="updateClass.schoolId"
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
                                <el-select v-model="updateClass.majorId"
                                           @change="selectMajor2Changed"
                                           placeholder="请选择专业"
                                           size="small"
                                           style="margin-left: 5px;width: 300px">
                                    <el-option
                                            v-for="item in majors"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>所在年级</el-tag></td>
                            <td>
                                <el-input size="small"
                                          v-model.trim="updateClass.grade"
                                          placeholder="如：2019"
                                          style="margin-left: 5px;width: 300px"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>班级名称</el-tag></td>
                            <td>
                                <el-input size="small"
                                          v-model.trim="updateClass.name"
                                          placeholder="如：RB软工卓越161"
                                          style="margin-left: 5px;width: 300px"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAddClass">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ClaMana",
        data(){
            return{
                isPagVisiable:true,
                keyword:'',
                title:'',
                searchValue:{/*条件搜索值*/
                    schoolId:'',
                    majorId:''
                },
                updateClass:{
                    name:'',
                    grade:'',
                    schoolId:'',
                    majorId:''
                },
                schools:[],
                majors:[],
                classes:[],
                total:0,
                page:1,
                size:10,
                dialogVisible:false,

            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
            this.initMajors();
            this.initClassByPage();
        },methods:{
            doAddClass(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateClass.id){//更新
                    this.putRequest("/baseinfo/class/",this.updateClass).then(resp=>{
                        if(resp){
                            this.initClassByPage();
                            this.updateClass.name='';
                            this.updateClass.grade=''
                            this.dialogVisible=false;
                            if(this.updateClass.id){
                                this.updateClass.id='';
                            }
                        }
                    })
                }else {//添加
                   // this.updateClass.schoolId=this.searchValue.schoolId;
                   // this.updateClass.majorId=this.searchValue.majorId;
                    this.postRequest("/baseinfo/class/", this.updateClass).then(resp => {
                        if (resp) {
                            this.initClassByPage();
                            this.updateClass.name='';
                            this.updateClass.grade=''
                            this.dialogVisible=false;
                        }
                    })
                }
            },
            selectSchoolChanged(){/*下拉框选择学院*/
                this.initMajors();

            }
            ,selectMajorChanged(){/*下拉框选择专业*/
                //选择完专业后，初始化表格中的班级数据
                this.initClassByMajorId()

            },
            selectSchool2Changed(){/*添加或更新下拉框选择事件*/
                this.initMajors2();

            },
            selectMajor2Changed(){/*添加或更新下拉框选择事件*/

            }
            ,showAddClassView(){
                this.title='添加班级信息';
                this.dialogVisible=true;
                this.updateClass.schoolId='';
                this.updateClass.majorId='';


            }, initClassByPage(){/*初始化分页的班级*/
                this.getRequest("/baseinfo/class/?page="+this.page+"&size="+this.size+"&keyword="+this.keyword).then(resp=>{
                    if(resp){
                        this.classes=resp.data;
                        this.total=resp.total;
                    }
                })
            },
            initClassByMajorId(){/*初始化所有的班级*/
                this.getRequest("/baseinfo/class/all?majorId="+this.searchValue.majorId).then(resp=>{
                    if(resp){
                        this.classes=resp;

                    }
                })

            },initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.schools=resp;

                    }
                })
            },
            initMajors2(){/*添加或更新选择专业*/
                this.getRequest("/baseinfo/major/?schoolId="+this.updateClass.schoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
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
                Object.assign(this.updateClass,data)
                this.title='编辑班级信息';
                this.dialogVisible=true;//显示编辑对话框

            }
            ,deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.name+'】班级, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/baseinfo/class/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initClassByPage();//刷新表格
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
                this.initClassByPage();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initClassByPage();
            },
        }

    }
</script>

<style scoped>

</style>