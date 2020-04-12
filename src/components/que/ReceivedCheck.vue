<template>
    <div>
            <div class="receiveCheckMain">
                <el-table
                        :data="receivedChecklist"
                        border
                        stripe
                        @selection-change="handleSelectionChange"
                        size="small"
                        style="width: 70%">
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
                            prop="checkTeacherId"
                            label="审核人"
                            width="100">
                        <template slot-scope="scope">
                            {{scope.row.checkTeacher.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="postTeacherId"
                            label="提交人"
                            width="100">
                        <template slot-scope="scope">
                            {{scope.row.postTeacher.name}}
                        </template>
                    </el-table-column>
                    <el-table-column

                            width="100px"
                            label="题型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.questionType=='sc'">
                                单选题
                            </span>
                            <span v-else-if="scope.row.questionType=='mc'">
                               多选题
                            </span>
                            <span v-else-if="scope.row.questionType=='tf'">
                               判断题
                            </span>
                            <span v-else-if="scope.row.questionType=='fb'">
                               填空题
                            </span>
                            <span v-else-if="scope.row.questionType=='qa'">
                               简答题
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="queStem"
                            width="200px"
                            :show-overflow-tooltip='true'
                            label="题干">
                        <template slot-scope="scope">
                            <span v-if="scope.row.questionType=='sc'">
                               {{scope.row.scQuestion.stem}}
                            </span>
                            <span v-else-if="scope.row.questionType=='mc'">
                              {{scope.row.mcQuestion.stem}}
                            </span>
                            <span v-else-if="scope.row.questionType=='tf'">
                               {{scope.row.tfQuestion.stem}}
                            </span>
                            <span v-else-if="scope.row.questionType=='fb'">
                                 {{scope.row.fbQuestion.stem}}
                            </span>
                            <span v-else-if="scope.row.questionType=='qa'">
                                {{scope.row.qaQuestion.stem}}
                             </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="postTime"
                            width="120px"
                            label="提交时间">
                    </el-table-column>
                    <el-table-column
                            label="审核状态"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-tag type="warning" v-if="scope.row.checkStatus==0">未审核</el-tag>
                            <el-tag type="info" v-else-if="scope.row.checkStatus==1">已通过</el-tag>
                            <el-tag type="warning" v-else-if="scope.row.checkStatus==2">拒绝</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope"><!--slot-scope的出现实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件-->
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="showDetailView(scope.$index, scope.row)" plain>查看</el-button>
                            <el-button
                                    v-if="scope.row.checkStatus==1"
                                    size="mini"
                                    type="danger"
                                    @click="showDeleteView(scope.row)" plain>删除</el-button>
                            <el-button
                                    v-if="scope.row.checkStatus==0"
                                    size="mini"
                                    type="primary"
                                    @click="showPassView(scope.row)" plain>通过</el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.checkStatus==0"
                                    @click="showRefuseView( scope.row)" plain>拒绝</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                        size="mini"
                        type="danger"
                        style="margin-top:8px "
                        @click="checkMany" :disabled="multipleSelection.length==0">批量审核</el-button><!--批量删除-->
                <div style="text-align: center">
                    <el-pagination
                            background
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            layout="sizes, prev, pager, next, jumper, total, slot"
                            :total="total">
                    </el-pagination>
                </div>
                <el-dialog
                        title="拒绝该试题加入题库"
                        :visible.sync="dialogVisible"
                        width="30%"

                        >
                    <el-input type="textarea"
                              :rows="10"
                              v-model="refuseReason"
                              placeholder="请备注拒绝原因"

                    ></el-input>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitResuseReason">确 定</el-button>
                  </span>
                                </el-dialog>

            </div>
    </div>
</template>

<script>
    export default {
        name: "ReceivedCheck",
        data(){
            return{
                dialogVisible:false,
                receivedChecklist:[],//收到的审核列表数据
                total:0,
                page:1,
                size:10,
                multipleSelection:[],
                queType:'',
                refuseReason:'',
                updateQuestionCheck:{
                    id:'',
                }

                }
            },mounted() {
                this.initData();

            }, methods:{
                initData(){//获取收到的请求信息

                    let url = "/que/check/receive?page="+this.page+"&size="+this.size;
                    this.getRequest(url).then(resp=>{
                        if(resp){
                            this.receivedChecklist=resp.data;
                        }
                    })
                },
                showPassView(data){
                    this.$confirm('是否将该试题加入试题库, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       //改变审核状态为：通过审核
                        this.postRequest("/que/check/pass?id="+data.id).then(resp=>{
                            if(resp){
                                this.initData();//刷新页面
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                },
                showRefuseView(data){
                    this.dialogVisible=true;
                    console.log(data.id);
                    this.updateQuestionCheck.id=data.id;
                },
            submitResuseReason(data){
                    //提交拒绝原因
                this.postRequest("/que/check/refuse?id="+this.updateQuestionCheck.id+"&reason="+this.refuseReason).then(resp=>{
                    if(resp){
                        this.initData();//刷新页面
                        this.emptyRefuseViewData();
                        this.dialogVisible=false;
                    }
                })
            },
                handleSelectionChange(){

                },
                showDetailView(){

                },
                showDeleteView(data){
                    this.$confirm('此操作将永久删除该条审核记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/que/check/"+data.id).then(resp=>{
                            if(resp){
                                this.initData();
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                },
                checkMany(){

                },
            emptyRefuseViewData(){
                    this.updateQuestionCheck.id='';
                        this.refuseReason='';
            },
                sizeChange(currentSize){
                    this.size=currentSize;
                    this.initData();
                },
                currentChange(currentPage){//里面的参数为当前页
                    this.page=currentPage;
                    this.initData();
                }

        }

    }
</script>

<style scoped>

</style>