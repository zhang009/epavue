<template>
    <div><!--用户（教师）管理页面-->
        <div><!--工具栏-->
            <el-divider></el-divider><!--分割线-->
            <div style="display: flex;justify-content: space-between">
                <div><!--第一行左侧搜索-->
                    <el-input placeholder="通过姓名搜索教师用户..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initUsers"
                              style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initUsers" :disabled="showAdvanceSearchView"></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initUsers" :disabled="showAdvanceSearchView"> 搜索</el-button>
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
                                 action="/system/user/import">
                            <el-button :disabled="importDataDisabled" type="primary" :icon="importDataBtnIcon">
                                <!-- <i class="fa fa-level-up" aria-hidden="true" icon="el-icon-download"/>-->
                                {{importDataBtnText}}<!--导入数据-->
                            </el-button>
                        </el-upload>



                    </el-dialog>

                    <el-button type="primary" icon="el-icon-plus" @click="showAddTeacherView">
                        添加用户
                    </el-button>
                </div><!--第一行右侧，批量导入，添加用户按钮----end-->
            </div>
            <transition name="slide-fade"><!--第二行，条件搜索div-->
                <div v-show="showAdvanceSearchView" style="border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;"><!--条件搜索-->
                    <el-row>
                        <el-col :span="13">
                            用户角色:
                            <el-select v-model="searchValue.teacherRoleId" placeholder="请选择角色" size="mini" style="width: 180px;">
                                <el-option
                                        v-for="item in allroles"
                                        :key="item.id"
                                        :label="item.nameZh"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            部门：
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="250"
                                    trigger="manual"
                                    v-model="popVisible2">
                                <div>
                                    <!--部门树-->
                                    <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="searchViewHandleNodeClick"></el-tree>
                                </div>
                                <div slot="reference" style="width: 180px;display: inline-flex;font-size: 13px;margin-left: 3px;
                                    border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;"  @click="showDepViews2">
                                    {{inputDepName}}
                                </div>
                            </el-popover>
                            职称：
                            <el-select v-model="searchValue.jobLevelId" placeholder="请选择职称" size="mini" style="width: 150px;">
                                <el-option
                                        v-for="item in joblevels"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="7" >
                            <div style="background-color: #409eff"></div>
                        </el-col>
                        <el-col :span="4">
                            <el-button size="mini" @click="emptySearchValue">取消</el-button>
                            <el-button size="mini" icon="el-icon-search" type="primary" @click="initUsers('advanced')">搜索</el-button>
                        </el-col>

                    </el-row>
                </div>
            </transition><!--第二行，条件搜索div-----end-->
        </div>
        <!--中间表格内容-->
        <div style="margin-top: 10px">
            <el-table
                    :data="teas"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.7)"
                    @selection-change="handleSelectionChange"
                    style="width: 85%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        fixed
                        align="left"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="workID"
                        label="工号"
                        width="90"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="50"
                        align="left">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        width="150"
                        label="手机号码">
                </el-table-column>

                <el-table-column
                        prop="email"
                        width="150"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        width="200"
                        label="所属部门">

                </el-table-column>

                <el-table-column
                        prop="jobLevel.name"
                        width="90"
                        label="职称">
                </el-table-column>

                <el-table-column
                        width="255"
                        label="用户角色">
                    <template slot-scope="scope">
                        <el-tag type="success" style="margin-right: 3px" v-for="(role,indexj) in scope.row.roles" :key="indexj">{{role.nameZh}}</el-tag>

                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        width="180px"
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                title="角色列表"
                                width="200"
                                @show="showPop(scope.row)"
                                @hide="hidePop(scope.row)"
                                trigger="click">
                            <el-select v-model="selectedRoles" placeholder="请选择" multiple >
                                <el-option
                                        v-for="(r,indexk) in allroles"
                                        :key="indexk"
                                        :label="r.nameZh"
                                        :value="r.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference"  style="padding:3px;margin-right: 3px" size="mini" type="primary" plain>修改角色</el-button>
                        </el-popover>
                        <el-button @click="showEditTeaView(scope.row)" style="padding:3px;" size="mini" > 编辑</el-button>
                        <el-button @click="deleteTea(scope.row)" style="padding:3px;" size="mini" type="danger"> 删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                    size="mini"
                    type="danger"
                    style="margin-top:8px "
                    @click="deleteMany" :disabled="multipleSelection.length==0">批量删除</el-button><!--批量删除-->
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--添加用户对话框-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="35%">

            <div>
                <el-form
                        :model="updateTea"
                        :rules="rules"
                        ref="teaForm"
                        label-position="right"
                        label-width="100px"
                        style="margin: 0px auto">
                    <el-row >
                        <el-col :span="24">
                            <el-form-item label="姓名:" prop="name"  >
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit" v-model="updateTea.name"
                                          placeholder="请输入教师姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="性别:" prop="gender">
                                <el-radio-group v-model="updateTea.gender">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="工号" prop="workID">
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                                          v-model="updateTea.workID" placeholder="工号" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="电子邮箱"  prop="email">
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                                          v-model="updateTea.email" placeholder="请输入电子邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-phone"
                                          v-model="updateTea.phone" placeholder="手机号码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="所属部门"  prop="departmentId">
                                <!-- <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                           v-model="tea.departmentId" placeholder="所属部门">
                                 </el-input>-->
                                <!--点击展开popover弹出框-->
                                <el-popover
                                        placement="right"
                                        title="请选择部门"
                                        width="220"
                                        trigger="manual"
                                        v-model="popVisible">
                                    <div>
                                        <!--部门树-->
                                        <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                    </div>
                                    <div slot="reference" style="width: 180px;display: inline-flex;font-size: 13px;
                                    border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box" @click="showDepViews">
                                        {{inputDepName}}
                                    </div>
                                </el-popover>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="职称:" prop="jobLevelId">
                                <el-select v-model="updateTea.jobLevelId" placeholder="请选择职称" size="mini" style="width: 180px;">
                                    <el-option
                                            v-for="item in joblevels"
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
                    </el-row>


                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddTea" >确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>




    var checkPhone = (rule,value,callback) => {
        if(!value) {//为空
           // return callback(new Error('请输入手机号码'));
            callback();
        }else{
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            if(reg.test(value)) {
                callback();
            }else{
                return callback(new Error('请输入正确的手机号'));
            }
        }
    };

    export default {
        name: "UserMan",
        data(){

            var checkWorkID=(rule,value,callback) => {
                if(!value) {
                    return callback(new Error('请输入工号'));
                }else{
                    const reg = /^\d{4}$/
                    if(reg.test(value)) {
                        //工号格式正确
                       // alert(value);
                        if(this.updateTea.id){//编辑用户信息的时候的时候不需要验证
                            callback();
                        }else{
                            this.getRequest("/system/user/workID/"+value).then(resp=>{
                                if(resp){
                                    //  alert(resp.result);
                                    if(resp.result=='yes'){//数据库存在工号
                                        return callback(new Error('该工号已被使用，请重新输入'));
                                    }else{
                                        callback();
                                    }
                                }
                            })
                        }

                    }else{
                        return callback(new Error('请输入正确的工号'));
                    }
                }
            };
            return{
                loading:false,
                loading2:false,
                searchValue:{/*条件搜索值*/
                    teacherRoleId:null,
                    jobLevelId:null,
                    departmentId:''

                },
                isUpdate:false,//是否更新标记
                tea: {/*添加用户*/
                    name: "testname",
                    gender: "男",
                    workID: "00000001",
                    email: "laowang@qq.com",
                    phone: "18565558897",
                    departmentId: '软件学院',
                    jobLevelId: null,
                },
                updateTea:{
                    name: "",
                    gender: "",
                    workID: "",
                    email: "",
                    phone: "",
                    departmentId: '',
                    jobLevelId: null,
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                teas:[],/*存放查询的所有教师用户*/
                inputDepName:'所属部门',/*点击所属部门后，在div显示点击的部门*/
                allDeps:[],/*所有部门*/
                allroles:[],/*所有角色*/
                title:'添加员工',/*添加和编辑对话框的标题*/
                showAdvanceSearchView:false,/*是否高级搜索按钮点击*/
                importDialogVisible:false,
                importDataDisabled:false,
                importDataBtnText:'导入数据',
                importDataBtnIcon:'el-icon-upload2',
                joblevels:[],
                popVisible:false,
                popVisible2:false,
                dialogVisible:false,/*添加修改对话框状态*/
                total:0,/*设置查询的总记录数*/
                page:1,//设置第几页
                size:10,//设置每页的数据
                keyword:"",/*搜索用户名*/
                rules:{
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
                    workID: [{validator:checkWorkID,required: true,  trigger: 'blur'}],
                    email: [{required: false, message: '请输入邮箱地址', trigger: 'blur'}, {
                        type: 'email',
                        message: '邮箱格式不正确',
                        trigger: 'blur'
                    }],
                    phone: [{validator:checkPhone, required: false, trigger: 'blur'}],
                    departmentId: [{required: true, message: '请选择部门', trigger: 'blur'}],
                    jobLevelId: [{required: true, message: '请选择职称', trigger: 'blur'}],
                },
                selectedRoles:[],//存放用户的角色
                multipleSelection: [],//批量操作勾选数组


            }
        },mounted() {
            this.initUsers();
            this.initData();
         },
        methods:{
            /*初始化用户数据*/
            initUsers(type){
                this.loading = true;
                let url = '/system/user/?page=' + this.page + '&size=' + this.size;
                if (type && type == 'advanced') {//条件搜索
                    if (this.searchValue.jobLevelId) {
                        url += '&jobLevelId=' + this.searchValue.jobLevelId;
                    }
                    if (this.searchValue.departmentId) {
                        url += '&departmentId=' + this.searchValue.departmentId;
                    }
                    if (this.searchValue.teacherRoleId) {
                        url += '&rId=' + this.searchValue.teacherRoleId;
                    }
                }else{//普通搜索
                    url+="&name="+this.keyword;
                }
                console.log("url:",url);
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                        console.log(resp.data);
                        this.teas=resp.data;
                        this.total=resp.total;
                    }
                })
            },
            /*初始化条件查询数据*/
            initData(){
                /*查询所有职称*/

                    this.getRequest('/system/user/joblevel').then(resp => {
                        if (resp) {
                            this.joblevels = resp;

                            window.sessionStorage.setItem("joblevel", JSON.stringify(resp));
                        }
                    })

               /*查询所有部门*/

                    this.getRequest('/system/user/deps').then(resp => {
                        if (resp) {
                            this.allDeps = resp;

                            window.sessionStorage.setItem("deps", JSON.stringify(resp));
                        }
                    })

               /*查询所有角色*/

                    this.getRequest('/system/user/roles').then(resp => {
                        if (resp) {
                            this.allroles = resp;
                            console.log(this.allroles);
                            window.sessionStorage.setItem("roles", JSON.stringify(resp));
                        }
                    })

            },
            exportData(){
                window.open('/system/user/export','_parent');
            },
            showImportView(){
                this.importDialogVisible=true;
            },
            showEditTeaView(data){

                this.title='编辑教师用户信息';
                Object.assign(this.updateTea,data);//拷贝数据
                this.inputDepName=data.department.name;//手动为部门数据赋值
                this.dialogVisible=true;//显示弹窗
                if(this.updateTea.workID!=""){
                    this.$refs['teaForm'].clearValidate();//清空表单验证
                }
            },
            //修改用户角色弹出框
            showPop(tea){//这里把用户的角色初始化到多选框
                //this.initAllRoles();
                let roles=tea.roles;
                /*console.log('roles.length>>>>>>>>>>'+roles.length);
                console.log('roles>>>>>>>>>>',roles);*/
                this.selectedRoles=[];//先清空数据
                roles.forEach(r=>{
                  /*  console.log('r.id>>>>>>>>>>'+r.id);*/
                    this.selectedRoles.push(r.id);
                })
              /*  console.log("this.selectedRoles",this.selectedRoles)*/
            },
            hidePop(tea){//关闭后，更新角色
                let roles=[];
                Object.assign(roles,tea.roles);//拷贝数据
                let flag=false;
                if(roles.length!=this.selectedRoles.length){
                    flag=true
                }else{
                    for(let i=0;i<roles.length;i++){
                        let role=roles[i];
                        for(let j=0;j<this.selectedRoles.length;j++){
                            let sr=this.selectedRoles[j];
                            if(role.rid==sr){
                                roles.splice(i,1);//移除相等的数据
                                i--;//防止跳过数据
                                break;
                            }
                        }
                    }
                    if(roles.length!=0){
                        flag=true;
                    }
                }
                if(flag){
                    let url='/system/user/role?tid='+tea.id;
                    this.selectedRoles.forEach(sr=>{
                        url+='&rids='+sr;
                    })
                    this.putRequest(url).then(resp=>{
                        if(resp){
                            this.initUsers();
                        }
                    })
                }
            },

            deleteTea(data){
                this.$confirm('此操作将永久删除['+data.name+']用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/user/"+data.id).then(resp=>{
                        if(resp){
                            this.initUsers();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            initAllRoles(){
                this.getRequest('/system/user/roles').then(resp => {
                    if (resp) {
                        this.allroles = resp;
                     /*   console.log(this.allroles);
                        window.sessionStorage.setItem("roles", JSON.stringify(resp));*/
                    }
                })
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
                    this.deleteRequest("/system/user/"+ids).then(resp=>{
                        if(resp){
                            //删除成功
                            this.initUsers();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initUsers();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initUsers();
            },
            emptySearchValue(){
                    this.searchValue.teacherRoleId=null;
                    this.searchValue.jobLevelId=null;
                    this.searchValue.departmentId='';
                    this.inputDepName='';
            },
            doAddTea(){

                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateTea.id){//更新
                    this.$refs.teaForm.validate(valid=>{
                        if(valid){//数据验证成功
                            this.putRequest("/system/user/",this.updateTea).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;//关闭添加对话框
                                    this.initUsers();//刷新页面
                                }
                            })
                        }else{
                        }
                    })
                }else{//添加

                    this.$refs.teaForm.validate(valid=>{
                       // alert(valid);
                        if(valid){//数据验证成功
                            this.postRequest("/system/user/",this.updateTea).then(resp=>{
                                if(resp){
                                    this.dialogVisible=false;//关闭添加对话框
                                    this.initUsers();//初始化刷新页面
                                }
                            })
                        }else{
                           // alert(valid);
                        }
                    })
                }
            },
            showDepViews(){/*添加部门时展示部门树*/
                this.popVisible=!this.popVisible;
            },
            showDepViews2(){/*条件搜索时展示部门树*/
                this.popVisible2=!this.popVisible2;
            },
            //条件搜索部门，点击部门树时触发该方法
            searchViewHandleNodeClick(data){
                this.inputDepName=data.name;
                this.searchValue.departmentId=data.id;
                this.popVisible2=!this.popVisible2;
            },
            handleNodeClick(data){//添加部门，点击部门树时触发该方法
                this.inputDepName=data.name;
                this.updateTea.departmentId=data.id;
                this.popVisible=!this.popVisible;
            },
            showAddTeacherView(){//添加用户按钮点击事件
                this.emptyTea();
                this.title='添加教师';
                this.dialogVisible=true;
                if(this.updateTea.workID!=""){
                    this.$refs['teaForm'].clearValidate();//清空表单验证
                }

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

                this.initUsers();
            },
            beforeUpload(){//上传之前事件
                this.loading2=true;
                this.importDataBtnText='正在导入';
                this.importDataBtnIcon='el-icon-loading';
                this.importDataDisabled=true;
            },
            emptyTea(){
                this.updateTea={
                    name: "",
                    gender: "",
                    workID: null,
                    email: "",
                    phone: "",
                    departmentId: '',
                    jobLevelId: null,
                }
                this.inputDepName='';
            }
        }
    }
</script>

<style >
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>