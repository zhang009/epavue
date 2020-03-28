<template>
    <div><!--专业管理-->
        <div style="display: flex;justify-content: space-between"><!--第一行工具栏-->
            <div><!--第一行左侧搜索-->
                <el-select v-model="selectSchoolId" @change="selectChanged" placeholder="请选择专业" size="mini" style="width: 180px;">
                    <el-option
                            v-for="item in schools"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                        <el-button type="primary" icon="el-icon-plus" @click="showAddSchoolView">
                            添加专业
                        </el-button>
            </div>
            <div ><!--第一行右侧，批量导入，添加用户按钮-->
            </div><!--第一行右侧，批量导入，添加用户按钮----end-->
            <div style="margin-top: 10px"><!--第二行表格内容展示-->
                <el-table
                        :data="majors"
                        stripe
                        border
                        style="width: 40%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column

                            prop="id"
                            label="编号"
                            width="100"><!-- type="index"-->
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="专业名称"
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
                <!--        <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">批量删除</el-button>-->

                <el-dialog
                        :title="title"
                        :visible.sync="dialogVisible"
                        width="25%">
                    <div>
                        <table>
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
    </div>
</template>

<script>
    export default {
        name: "MajMana",
        data(){
            return{
                title:'添加专业信息',
                updateMajor:{
                    name:''
                },
                page:null,
                size:null,
                keyword:'',
                selectSchoolId:null,/*选择的学院id*/
                schools:[],/*学院*/
                majors:[],

            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
        },methods:{
            initSchools(){
                this.getRequest("/baseinfo/school/?page="+this.page+"&size="+this.size+"&keyword="+this.keyword).then(resp=>{
                    if(resp){
                        this.schools=resp.data;

                    }
                })
            },
            initMajors(){
                this.getRequest("/baseinfo/major/?schoolId="+this.selectSchoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                    }
                })
            },
            selectChanged(){/*当学院下拉框改变时，更新专业列表*/
               this.initMajors();
            },
            doAddMajor(){
                //判断是添加还是更新，有id则为更新，没有id则为更新
                if(this.updateSchool.id){//更新
                    this.putRequest("/baseinfo/major/",this.updateMajor).then(resp=>{
                        if(resp){
                            this.initMajors();
                            this.updateSchool.name='';
                            this.dialogVisible=false;
                        }
                    })
                }else {//添加
                    this.postRequest("/baseinfo/major/", this.updateMajor).then(resp => {
                        if (resp) {
                            this.initMajors();
                            this.updateSchool.name='';
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
            }
        }
    }
</script>

<style scoped>

</style>