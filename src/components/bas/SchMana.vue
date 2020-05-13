<template>
    <div>
        <!--学院管理-->
        <div style="display: flex;justify-content: space-between"><!--第一行工具栏-->
            <div><!--第一行左侧搜索-->
                <el-input placeholder="搜索学院..." prefix-icon="el-icon-search"
                          clearable
                          @clear="initSchool"
                          style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initSchool" ></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initSchool" > 搜索</el-button>

            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
                 <el-button type="primary" icon="el-icon-plus" @click="showAddSchoolView">
                    添加学院
                </el-button>
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->
        </div>
        <div style="margin-top: 10px"><!--第二行表格内容展示-->
            <el-table
                :data="schools"
                stripe
                border
                style="width: 40%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                        type="index"

                        label="编号"
                        width="100"><!--  prop="id"-->
                    <template slot-scope="scope" >
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="学院名称"
                    width="200"
                    >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
    <!--        <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>-->
            <div style="margin-top:18px;display: flex;justify-content: flex-start">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
            <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    width="25%">
                <div>
                    <table>
                        <tr>
                            <td> <el-tag>学院名称</el-tag></td>
                            <td>
                                <el-input size="small"

                                          v-model.trim="updateSchool.name"
                                          style="margin-left: 5px;width: 300px"></el-input>
                            </td>
                        </tr>


                    </table>


                </div>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAddSchool">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SchMana",
        data(){
            return{
                keyword:'',/*搜索关键词*/
                title:'添加学院信息',
                dialogVisible:false,
                multipleSelection:[],/*批量删除*/
                updateSchool:{/*更新学院信息实体*/
                    name:''
                },
                school:{
                  name:''
                },
                total:0,
                page:1,
                size:10,
                schools:[]

            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
             this.initSchool();//进入页面时候，初始化表格数据
        },
        methods:{
            initSchool(){
                this.getRequest("/baseinfo/school/?page="+this.page+"&size="+this.size+"&keyword="+this.keyword).then(resp=>{
                    if(resp){
                        this.schools=resp.data;
                        this.total=resp.total;
                        this.school={/*添加学院实体*/
                            name:''
                        }
                    }
                })
            },
            /*deleteMany(){
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
                    this.deleteRequest("/baseinfo/school/"+ids).then(resp=>{
                        if(resp){
                            //删除成功
                            this.initSchool();
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },*/

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showAddSchoolView(){/*添加学院点击事件，展示对话框*/
                this.title='添加学院信息';
                this.dialogVisible=true;
            },
            showEditView(data){/*编辑学院点击事件，展示对话框*/
                Object.assign(this.updateSchool,data)
                this.title='编辑学院信息';
                this.dialogVisible=true;//显示编辑对话框
            },
            deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.name+'】学院, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/baseinfo/school/"+data.id).then(resp=>{
                        if(resp){//删除成功
                            this.initSchool();//刷新表格
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
                this.initSchool();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initSchool();
            },
            doAddSchool(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateSchool.id){//更新
                    this.putRequest("/baseinfo/school/",this.updateSchool).then(resp=>{
                        if(resp){
                            this.initSchool();
                            this.updateSchool.name='';
                            this.dialogVisible=false;
                        }
                    })
                }else {//添加
                    this.postRequest("/baseinfo/school/", this.updateSchool).then(resp => {
                        if (resp) {
                            this.initSchool();
                            this.updateSchool.name='';
                            this.dialogVisible=false;
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>