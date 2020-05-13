<template>
    <div><!--专业管理-->
        <div style="display: flex;justify-content: space-between"><!--第一行工具栏-->
            <div><!--第一行左侧搜索-->
                <el-select v-model="selectSchoolId"
                           @change="selectChanged"
                           placeholder="请选择学院"
                           size="small"
                           style="width: 230px;">
                    <el-option
                            v-for="item in schools"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                        <el-button
                                style="margin-left: 5px"
                                size="small"
                                type="primary"
                                icon="el-icon-plus"
                                @click="showAddSchoolView">
                            添加专业
                        </el-button>
            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->
        </div>
        <div style="margin-top: 10px"><!--第二行表格内容展示-->
            <el-table
                    :data="majors"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.7)"
                    style="width: 45%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="编号"
                        width="100"><!-- prop="id" -->
                    <template slot-scope="scope">
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="专业名称"
                        width="260"
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
            <!--        <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>-->

            <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    width="25%">
                <div>
                    <table>
                        <tr>
                            <td> <el-tag>所选学院</el-tag></td>
                            <td>
                                <el-input size="small" disabled
                                  v-model="schoolName"
                                  style="margin-left: 5px;width: 300px">
                                </el-input>
                            </td>
                        </tr>
                        <tr>
                            <td> <el-tag>专业名称</el-tag></td>
                            <td>
                                <el-input size="small"
                                          v-model.trim="updateMajor.name"
                                          style="margin-left: 5px;width: 300px"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAddMajor">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MajMana",
        data(){
            return{
                dialogVisible:false,
                title:'添加专业信息',
                schoolName:'',//显示当前学院
                updateMajor:{
                    schoolId:null,
                    name:''
                },
                loading:false,
                page:1,
                size:10,
                keyword:'',
                selectSchoolId:null,/*选择的学院id*/
                schools:[],/*学院*/
                majors:[],

            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
        },methods:{
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.schools=resp;

                    }
                })
            },
            initMajors(){
                this.loading=true;
                this.getRequest("/baseinfo/major/?schoolId="+this.selectSchoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                        this.loading=false;
                    }
                })
            },
            selectChanged(){/*当学院下拉框改变时，更新专业列表*/
                for (let i = 0; i <this.schools.length ; i++) {
                    if(this.selectSchoolId==this.schools[i].id){
                        this.schoolName=this.schools[i].name;
                    }
                }
               this.initMajors();
            },
            doAddMajor(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateMajor.id){//更新
                    this.putRequest("/baseinfo/major/",this.updateMajor).then(resp=>{
                        if(resp){
                            this.initMajors();
                            this.updateMajor.name='';
                            this.dialogVisible=false;
                        }
                    })
                }else {//添加
                    this.updateMajor.schoolId=this.selectSchoolId;
                    this.postRequest("/baseinfo/major/", this.updateMajor).then(resp => {
                        if (resp) {
                            this.initMajors();
                            this.updateMajor.name='';
                            this.dialogVisible=false;
                        }
                    })
                }
            },deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.name+'】专业, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/baseinfo/major/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initMajors();//刷新表格
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },showAddSchoolView(){
                if(this.schoolName==''||this.schoolName==null||this.selectSchoolId==null){
                    this.$message.error('请先选择学院');
                }else{

                    this.title='添加专业信息'
                    this.dialogVisible=true;
                }


            },  showEditView(data){/*编辑专业点击事件，展示对话框*/
                Object.assign(this.updateMajor,data)
                this.title='编辑专业信息';
                this.dialogVisible=true;//显示编辑对话框
            },
        }
    }
</script>

<style scoped>

</style>