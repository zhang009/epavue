<template>
    <div>
            <div class="receiveCheckMain">
                <el-table
                        :data="receivedChecklist"
                        border
                        stripe
                        @selection-change="handleSelectionChange"
                        size="small"
                        style="width: 80%">
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
                            width="130px"
                            sortable
                            label="提交时间">
                    </el-table-column>
                    <el-table-column
                            label="审核状态"
                            width="100"
                    >
                        <template slot-scope="scope">
                            <el-tag type="warning" v-if="scope.row.checkStatus==0">未审核</el-tag>
                            <el-tag type="success" v-else-if="scope.row.checkStatus==1">已通过</el-tag>
                            <el-tag type="danger" v-else-if="scope.row.checkStatus==2">未通过</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="210px" align="center">
                        <template slot-scope="scope"><!--slot-scope的出现实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件-->
                            <el-button
                                    size="mini"
                                    type="primary"
                                    v-if="scope.row.checkStatus==1||scope.row.checkStatus==2"
                                    @click="showDetailView( scope.row)" plain>查看</el-button><!--通过审核或拒绝-->
                            <el-button
                                    size="mini"
                                    type="primary"
                                    v-else-if="scope.row.checkStatus==0"
                                    @click="showDetailView( scope.row)" plain>审核</el-button><!--未审核-->
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="showDeleteView(scope.row)" plain>删除</el-button><!--审核通过后的才能删除-->


                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                        size="mini"
                        type="danger"
                        style="margin-top:8px "
                        @click="checkMany" :disabled="multipleSelection.length==0">批量删除</el-button><!--批量删除-->
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
                        :title="title1"
                        :visible.sync="dialogVisible2"
                        width="45%"

                >
                    <div style="border: 1px solid #dedede;margin-left: 20px;margin-right: 20px;padding-top: 20px;background-color: #F8F8F8">
                        <el-row :gutter="5" style="margin-bottom: 8px;"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>题型：</strong>
                            </el-col>
                            <el-col :span="19">

                                <span v-if="questionCheckInfo.questionType=='sc'">单选题</span>
                                <span v-else-if="questionCheckInfo.questionType=='mc'">多选题</span>
                                <span v-else-if="questionCheckInfo.questionType=='fb'">填空题</span>
                                <span v-else-if="questionCheckInfo.questionType=='tf'">判断题</span>
                                <span v-else-if="questionCheckInfo.questionType=='qa'">简答题</span>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px;"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>题干：</strong>
                            </el-col>
                            <el-col :span="19">
                                <div class="stem"><!--这里的样式是为了显示题干中的换行符-->
                                    <span  v-if="questionCheckInfo.questionType=='sc'">{{questionCheckInfo.scQuestion.stem}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='mc'">{{questionCheckInfo.mcQuestion.stem}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='fb'">{{questionCheckInfo.fbQuestion.stem}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='tf'">{{questionCheckInfo.tfQuestion.stem}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='qa'">{{questionCheckInfo.qaQuestion.stem}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" v-if="questionCheckInfo.questionType=='sc'||questionCheckInfo.questionType=='mc'" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>选项：</strong>
                            </el-col>
                            <el-col :span="19">
                                <div class="stem"><!--这里的样式是为了显示题干中的换行符-->
                                    <div v-if="questionCheckInfo.questionType=='sc'"><!--单选选项-->
                                        <div>A.{{questionCheckInfo.scQuestion.option1}}</div>
                                        <div>B.{{questionCheckInfo.scQuestion.option2}}</div>
                                        <div>C.{{questionCheckInfo.scQuestion.option3}}</div>
                                        <div>D.{{questionCheckInfo.scQuestion.option4}}</div>
                                    </div>
                                    <div v-if="questionCheckInfo.questionType=='mc'"><!--多选选项-->
                                        <div v-for="(item,indexj) in questionCheckInfo.mcQuestion.options">
                                            {{optionChar[indexj]}}
                                            <span>{{item.optionContent}}</span>
                                        </div>
                                    </div>

                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>答案：</strong>
                            </el-col>
                            <el-col :span="19">
                                <div class="stem"><!--这里的样式是为了显示题干中的换行符-->
                                    <span  v-if="questionCheckInfo.questionType=='sc'">{{questionCheckInfo.scQuestion.answer}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='mc'">{{questionCheckInfo.mcQuestion.answer}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='fb'">{{questionCheckInfo.fbQuestion.answer}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='tf'">{{questionCheckInfo.tfQuestion.answer}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='qa'">{{questionCheckInfo.qaQuestion.answer}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>解析：</strong>
                            </el-col>
                            <el-col :span="19">
                                <div class="stem"><!--这里的样式是为了显示题干中的换行符-->
                                    <span  v-if="questionCheckInfo.questionType=='sc'">
                                        <span v-if="questionCheckInfo.scQuestion.analysis==''||questionCheckInfo.scQuestion.analysis==null">无</span>
                                        <span v-else> {{questionCheckInfo.scQuestion.analysis}}</span>

                                    </span>
                                    <span v-else-if="questionCheckInfo.questionType=='mc'">{{questionCheckInfo.mcQuestion.analysis}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='fb'">{{questionCheckInfo.fbQuestion.analysis}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='tf'">{{questionCheckInfo.tfQuestion.analysis}}</span>
                                    <span v-else-if="questionCheckInfo.questionType=='qa'">{{questionCheckInfo.qaQuestion.analysis}}</span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>提交审核时间：</strong>
                            </el-col>
                            <el-col :span="19">
                                <span >{{questionCheckInfo.postTime}}</span>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>提交人：</strong>
                            </el-col>
                            <el-col :span="19">
                                <span v-if="questionCheckInfo.postTeacher!=null">{{questionCheckInfo.postTeacher.name}}</span>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>审核状态：</strong>
                            </el-col>
                            <el-col :span="19">
                                <el-tag v-if="questionCheckInfo.checkStatus==0" type="warning">未审核</el-tag>
                                <el-tag v-else-if="questionCheckInfo.checkStatus==1" type="success">审核通过</el-tag>
                                <el-tag v-else-if="questionCheckInfo.checkStatus==2" type="danger">审核未通过</el-tag>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5" v-if="questionCheckInfo.checkStatus==2" style="margin-bottom: 8px"><!--带间隔的布局-->
                            <el-col :span="5" style="text-align: right;">
                                <strong>拒绝原因：</strong>
                            </el-col>
                            <el-col :span="19">
                                <span>{{questionCheckInfo.refuseReason}}</span>
                            </el-col>
                        </el-row>
                        <span slot="footer" class="dialog-footer">
                            <div v-if="questionCheckInfo.checkStatus==0" align="center"><!--审核按钮-->
                                 <el-radio-group
                                         size="small"
                                         v-model="passQuestion">
                                    <el-radio :label='1' border>通过</el-radio>
                                    <el-radio :label='2' border>拒绝</el-radio>
                                </el-radio-group>
                                <div style="padding-left: 20px;padding-right: 20px;margin-bottom: 10px;margin-top: 5px">
                                     <el-input type="textarea"
                                               :rows="7"

                                               v-if="passQuestion==2"
                                               v-model="refuseReason"
                                               placeholder="请备注拒绝原因"

                                     ></el-input>
                                </div>


                            </div>
                         </span>
                    </div>
                    <div align="right" style="margin-top: 10px;margin-right: 20px">

                        <el-button v-if="questionCheckInfo.checkStatus==0" type="primary" @click="submitCheckResult">提交</el-button>
                        <el-button v-else type="primary" @click="dialogVisible2 = false">确 定</el-button>
                    </div>


                </el-dialog>
            </div>
    </div>
</template>

<script>
    export default {
        name: "ReceivedCheck",
        data(){
            return{
                    dialogVisible1:false,//拒绝申请对话框
                    dialogVisible2:false,//试题信息详情显示
                    receivedChecklist:[],//收到的审核列表数据
                    total:0,
                    page:1,
                    size:10,
                    title1:'试题详情',//收到的试题审核，对话框标题
                    passQuestion:1,//审核试题，是否通过单选按钮
                    multipleSelection:[],
                    queType:'',
                    refuseReason:'',
                    updateQuestionCheck:{

                    },
                    optionChar:['A.','B.','C.','D.','E.','F.','G.','H.','I.','J.','K.'],
                    questionCheckInfo:{
                        stem:'',
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
                            console.log(this.receivedChecklist.length);
                            this.total=resp.total;
                        }
                    })
                },

            submitCheckResult(){

                   if(this.passQuestion==2){
                       this.updateQuestionCheck.checkStatus=this.passQuestion;//审核状态
                       this.updateQuestionCheck.refuseReason=this.refuseReason;//审核未通过原因
                   }else{
                       this.updateQuestionCheck.checkStatus=this.passQuestion;//审核状态
                   }

                    this.postRequest("/que/check/",this.updateQuestionCheck).then(resp=>{
                        if(resp){
                            this.initData();//刷新页面
                            this.emptyRefuseViewData();
                            this.dialogVisible2=false;
                        }
                    })


            },
            handleSelectionChange(){

            },
                showDetailView(data){
                    if(data.checkStatus==0){//未审核，将标题改为
                        this.title1='试题审核';
                        this.passQuestion=1;//
                        this.refuseReason='';
                        this.updateQuestionCheck=data;//试题的信息
                    }
                    let target=JSON.parse(JSON.stringify(data));/*对象的深拷贝*/
                    this.questionCheckInfo=target;
                    this.dialogVisible2=true;
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

<style >
    .stem span{
        white-space:pre
    }

</style>