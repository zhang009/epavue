<template>
    <div><!--学生管理-->
        <div><!--工具栏-->
            <el-divider></el-divider><!--分割线-->
            <div style="display: flex;justify-content: space-between">
                <div><!--第一行左侧搜索-->
                    <el-input placeholder="通过姓名搜索学生..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initStudents"
                              style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initStudents" :disabled="showAdvanceSearchView"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initStudents" :disabled="showAdvanceSearchView"> 搜索</el-button>
                    <el-button  type="primary" @click="showAdvanceSearchView=!showAdvanceSearchView">
                        <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"/>
                        条件搜索</el-button>
                </div>
                <div ><!--第一行右侧，批量导入，添加用户按钮-->
                    <el-button @click="showImportView" :icon="importDataBtnIcon" type="success"   style="display: inline-flex;margin-right: 8px">导入数据</el-button>

                    <!--导入数据提示框-->
                    <el-dialog
                            title="导入数据"
                            :visible.sync="importDialogVisible"
                            width="30%"
                            >
                        <p>导入数据前可以从这里<el-link type="primary" @click="exportData">下载模板</el-link>并将用户的信息整理到模板中，请使用模板给出的提示填写字段</p>

                        <el-upload
                                v-loading.fullscreen.lock="loading2"
                                element-loading-text="拼命解析数据中..."
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(0, 0, 0, 0.7)"
                                :on-error="onError"
                                :on-success="onSuccess"
                                :show-file-list="false"
                                :before-upload="beforeUpload"
                                :disabled="importDataDisabled"
                                style="display: inline-flex;margin-right: 8px"
                                class="upload-demo"
                                action="/baseinfo/stu/import">
                            <el-button :disabled="importDataDisabled" type="primary" :icon="importDataBtnIcon">
                                <!-- <i class="fa fa-level-up" aria-hidden="true" icon="el-icon-download"/>-->
                                {{importDataBtnText}}<!--导入数据-->
                            </el-button>
                        </el-upload>



                    </el-dialog>

                    <el-button type="primary" icon="el-icon-plus" @click="showAddStuView">
                        添加学生
                    </el-button>
                </div><!--第一行右侧，批量导入，添加用户按钮----end-->
            </div>
            <transition name="fade"><!--第二行，条件搜索div-->
                <div v-show="showAdvanceSearchView" style="border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;"><!--条件搜索-->
                    <el-row>
                        <el-col :span="13" style="margin-left: 10px;">
                            学院:
                            <el-select v-model="searchValue.schoolId"
                                       placeholder="请选择学院"
                                       @change="selectSchoolChanged"
                                       size="small"
                                       style="width: 220px;">
                                <el-option
                                        v-for="item in allSchools"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            专业：
                            <el-select v-model="searchValue.majorId"
                                       placeholder="请选择专业"
                                       @change="selectMajorChanged"
                                       size="small"
                                       style="width: 220px;">
                                <el-option
                                        v-for="item in allMajors"


                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            班级：
                            <el-select v-model="searchValue.classId"
                                       placeholder="请选择班级"

                                       size="small"
                                       style="width: 220px;"><!--   @change="selectClassChanged"-->
                                <el-option
                                        v-for="item in allClasses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6" style="margin-left: 15px">
                            <el-button size="small" @click="emptySearchValue">取消</el-button>
                            <el-button size="small" icon="el-icon-search" type="primary" @click="initStudents('advanced')">搜索</el-button>
                        </el-col>
                        <el-col :span="5" >
                        </el-col>

                    </el-row>
                </div>
            </transition><!--第二行，条件搜索div-----end-->
        </div>
        <!--中间表格内容-->
        <div style="margin-top: 10px">
            <el-table
                    :data="stus"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.7)"
                    @selection-change="handleSelectionChange"
                    style="width: 60%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
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
                        prop="name"
                        label="姓名"
                        fixed
                        align="left"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="studentNum"
                        label="学号"
                        width="180"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="50"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="clazz.name"
                        width="150"
                        label="班级">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditStuView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteStu(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button
                    size="small"
                    type="danger"
                    style="margin-top:8px "
                    @click="deleteMany" :disabled="multipleSelection.length==0">批量删除</el-button><!--批量删除-->
            <div style="text-align: center">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--添加和编辑用户对话框-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="35%">

            <div>
                <el-form
                        :model="updateStu"
                        :rules="rules"
                        ref="teaForm"
                        label-position="right"
                        label-width="100px"
                        style="margin: 0px auto">
                    <el-row  >
                        <el-col :span="20" :offset="4">
                            <el-form-item label="所在学院">
                                <el-select v-model="updateStu.schoolId"
                                           placeholder="请选择学院"
                                           @change="selectSchool2Changed"
                                           size="small"
                                           style="width: 220px;">
                                    <el-option
                                            v-for="item in allSchools"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20" :offset="4">
                            <el-form-item label="所在专业">
                                <el-select v-model="updateStu.majorId"
                                           placeholder="请选择专业"
                                           @change="selectMajor2Changed"
                                           size="small"
                                           style="width: 220px;">
                                    <el-option
                                            v-for="item in allMajors"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                            <el-col :span="20" :offset="4">
                                <el-form-item label="班级:" prop="classId">
                                    <el-select v-model="updateStu.classId"
                                               placeholder="请选择学生所在班级"

                                               size="small" style="width: 180px;"><!--  @change="selectAddClassChanged"-->
                                        <el-option
                                                v-for="item in allClasses2"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="6">
                                <div></div>&lt;!&ndash;填充&ndash;&gt;
                            </el-col>-->

                        <el-col :span="20" :offset="4">
                            <el-form-item label="姓名:" prop="name"  >
                                <el-input size="small" style="width: 180px" prefix-icon="el-icon-edit" v-model="updateStu.name"
                                          placeholder="请输入学生姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20" :offset="4">
                            <el-form-item label="学号" prop="studentNum">
                                <el-input size="small" style="width: 180px" prefix-icon="el-icon-edit"
                                          v-model="updateStu.studentNum" placeholder="请输入学生学号" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="20" :offset="4">
                            <el-form-item label="性别:" prop="gender">
                                <el-radio-group v-model="updateStu.gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddStu" >确 定</el-button>
             </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "BasStu",
        data(){
            var checkStudentNum=(rule,value,callback) => {
                if(!value) {
                    return callback(new Error('请输入学号'));
                }else{
                    const reg = /^\d{12}$/
                    if(reg.test(value)) {
                        //工号格式正确
                        // alert(value);
                        if(this.updateStu.id){//编辑用户信息的时候的时候不需要验证
                            callback();
                        }else{
                            this.postRequest("/baseinfo/stu/studentNum?studentNum="+value).then(resp=>{
                                if(resp){
                                    //  alert(resp.result);
                                    if(resp.result=='yes'){//数据库存在工号
                                        return callback(new Error('该学号已被使用，请重新输入'));
                                    }else{
                                        callback();
                                    }
                                }
                            })
                        }

                    }else{
                        return callback(new Error('请输入正确的学号'));
                    }
                }
            };
            return{
                loading:false,
                loading2:false,
                searchValue:{/*条件搜索*/
                    schoolId:'',
                    majorId:'',
                    classId:''
                },
                searchAddStudentValue:{//添加学生条件选择
                    schoolId:'',
                    majorId:'',

                },
                updateStu:{/*添加和更新学生信息*/
                    name:'',
                    studentNum:'',
                    gender:'男',
                    classId:''
                },
                importDataBtnIcon:'el-icon-upload2',
                searchClassName:"",
                stus:[],
                allSchools:[],
                allMajors:[],
                allClasses:[],/*条件搜索班级*/
                allClasses2:[],/*添加或者编辑班级*/
                title:'添加学生',
                showAdvanceSearchView:false,/*是否显示条件搜索栏*/
                importDialogVisible:false,/*导入数据对话框显示*/
                importDataDisabled:false,
                importDataBtnText:'导入数据',
                dialogVisible:false,
                total:0,
                page:1,
                size:10,
                keyword:'',/*搜索关键词*/
                rules:{
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
                    studentNum: [{validator:checkStudentNum,required: true,  trigger: 'blur'}],
                    classId: [{required: true, message: '请选择班级', trigger: 'blur'}],
                },
                multipleSelection:[],


            }
        }
        ,mounted(){
            this.initSchools();//初始化学院信息
            this.initStudents();//初始化学生信息
            this.initAllClasses2();//这里初始化主要解决，编辑学生信息的时候，班级选择框没有数据问题
        }
        ,methods:{
            showImportView(){
                // alert();
                this.importDialogVisible=true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initStudents(type){

                let url='/baseinfo/stu/?page='+this.page+'&size='+this.size;
                if(type&&type=='advanced'){
                    //如果是条件搜索

                    if(this.searchValue.classId&&this.searchValue.classId!=''){
                        url+='&classId='+this.searchValue.classId;
                    }else{
                        this.$message.error('请先选择班级！');

                        return;
                    }
                }else{
                    if(this.searchValue.classId&&this.searchValue.classId!=''){
                        url+='&classId='+this.searchValue.classId;
                    }
                    //普通搜索
                    url+="&name="+this.keyword;
                }
                this.loading=true;
                console.log("url:",url);
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                        console.log(resp.data);
                        this.stus=resp.data;
                        this.total=resp.total;
                    }
                })
            },
            initSchools(){
                if(!window.sessionStorage.getItem("schools")){
                    this.getRequest('/baseinfo/school/all').then(resp => {
                        if (resp) {
                            this.allSchools = resp;
                            window.sessionStorage.setItem("schools", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.allSchools=JSON.parse(window.sessionStorage.getItem("schools"));
                }
            },
            initAllClasses2(){
                if(!window.sessionStorage.getItem("classes")){
                    this.getRequest('/baseinfo/class/all2').then(resp => {
                        if (resp) {

                            this.allClasses2 = resp;
                           // alert(this.allClasses2.length);
                            window.sessionStorage.setItem("classes", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.allClasses2=JSON.parse(window.sessionStorage.getItem("classes"));
                }
            },
            selectSchoolChanged(){//条件搜索
                //学院下拉框改变
                this.initMajors();
            },
            selectSchool2Changed(){//添加学生学院选择
                this.initMajors2();
            },
            selectMajorChanged(){
                //专业下拉框改变
                this.initClassByMajorId();
            },
            selectMajor2Changed(){//添加学生专业下拉框改变
                this.initClassByMajorId2();
            },
            selectClassChanged(){
                //班级下拉框改变
               // this.initStudentsByClassId();
            },
            initStudentsByClassId(){
                this.getRequest("/baseinfo/stu/classId?classId="+this.searchValue.classId).then(resp=>{
                    if(resp){
                        this.stus=resp;
                    }
                })
            },
            initClassByMajorId(){/*根据专业id获取班级列表*/
                //  alert(this.searchValue.majorId);
                this.getRequest("/baseinfo/class/all?majorId="+this.searchValue.majorId).then(resp=>{
                    if(resp){
                        this.allClasses=resp;
                    }
                })
            },
            initClassByMajorId2(){/*根据专业id获取班级列表*/
                //  alert(this.searchValue.majorId);
                this.getRequest("/baseinfo/class/all?majorId="+this.updateStu.majorId).then(resp=>{
                    if(resp){
                        this.allClasses2=resp;
                    }
                })
            },
            initMajors(){/*根据学院id获取专业列表*/
                //
                this.getRequest("/baseinfo/major/?schoolId="+this.searchValue.schoolId).then(resp=>{
                    if(resp){
                        this.allMajors=resp;
                    }
                })
            },
            initMajors2(){/*根据学院id获取专业列表（添加学生）*/
                //
                this.getRequest("/baseinfo/major/?schoolId="+this.updateStu.schoolId).then(resp=>{
                    if(resp){
                        this.allMajors=resp;
                    }
                })
            },


            exportData(){
                window.open('/baseinfo/stu/export','_parent');
            },
            emptySearchValue(){
                this.searchValue.schoolId='';
                this.searchValue.majorId='';
                this.searchValue.classId='';
            },
            selectAddClassChanged(){
                //添加或编辑，班级选择事件
               // alert("selectAddClassChanged1");
                if(this.searchClassName!=""){
                    this.getRequest("/baseinfo/class/searchClassByName?name="+this.searchClassName).then(resp=>{
                        if(resp){
                          //  alert("selectAddClassChanged2");
                            this.allClasses2=resp;
                        }
                    })
                }
            },
            showAddStuView(){/*学生添加对话框展示*/
                    this.emptyUpdateStu();
                    this.title='添加学生';
                    this.dialogVisible=true;

            },
            showEditStuView(data){
                this.title='编辑学生信息';
                Object.assign(this.updateStu,data);
                this.initMajors2();
                this.initClassByMajorId2()
                console.log("updateStu:",this.updateStu);

                this.dialogVisible=true;
            },
            emptyUpdateStu(){
                this.updateStu={
                    name:'',
                    studentNum:'',
                    gender:'男',
                    classId:''
                }
            },
            deleteStu(data){
                this.$confirm('此操作将永久删除['+data.name+']学生, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/baseinfo/stu/"+data.id).then(resp=>{
                        if(resp){
                            this.initStudents();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteMany(){
                this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //点击确定批量删除
                    let ids='?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&'
                    })
                    this.deleteRequest("/baseinfo/stu/"+ids).then(resp=>{
                        if(resp){
                            //删除成功
                            this.initStudents();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            doAddStu(){
                //添加或则编辑学生
                if(this.updateStu.id){//更新
                    this.$refs.teaForm.validate(valid=>{
                        if(valid){//数据验证成功
                            this.putRequest("/baseinfo/stu/",this.updateStu).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;//关闭添加对话框
                                    this.initStudents();//刷新页面
                                }
                            })
                        }else{
                        }
                    })
                }else{//添加
                    this.$refs.teaForm.validate(valid=>{
                        if(valid){//数据验证成功
                            this.postRequest("/baseinfo/stu/",this.updateStu).then(resp=> {
                                if(resp){
                                    this.dialogVisible=false;
                                    this.initStudents();//初始化添加弹窗变量
                                }
                            })
                        }else{
                        }
                    })
                }
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initStudents();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initStudents();
            },
            onError(response,file,fileList){
                this.loading2=false;
                this.importDialogVisible=false;
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.$message.error('数据导入失败！');
                this.importDataDisabled=false;
            },
            onSuccess(response,file,fileList){
                this.loading2=false;
                this.importDialogVisible=false;
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.importDataDisabled=false;

                this.$message({
                    message: '导入数据成功！',
                    type: 'success'
                });

                this.initStudents();
            },
            beforeUpload(){//上传之前事件
                this.loading2=true;
                this.importDataBtnText='正在导入';
                this.importDataBtnIcon='el-icon-loading';
                this.importDataDisabled=true;
            },
        }
    }
</script>

<style >
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>