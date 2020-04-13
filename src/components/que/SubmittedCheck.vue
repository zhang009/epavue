<template>
    <div>
       <div class="submittedCheck">
           <el-table
                   :data="submittedChecklist"
                   border
                   stripe
                   @selection-change="handleSelectionChange"
                   size="small"
                   style="width: 75%">
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
                       prop="postTeacherId"
                       label="提交人"
                       width="100">
                   <template slot-scope="scope">
                       {{scope.row.postTeacher.name}}
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
                       label="提交时间">
               </el-table-column>
               <el-table-column
                       label="审核状态"
                       width="100"
               >
                   <template slot-scope="scope">
                       <el-tag type="warning" v-if="scope.row.checkStatus==0">未审核</el-tag>
                       <el-tag type="success" v-else-if="scope.row.checkStatus==1">已通过</el-tag>
                       <el-tag type="danger" v-else-if="scope.row.checkStatus==2">拒绝</el-tag>
                   </template>
               </el-table-column>
               <el-table-column label="操作" width="210px">
                   <template slot-scope="scope"><!--slot-scope的出现实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件-->
                       <el-button
                               size="mini"
                               type="primary"
                               @click="showDetailView( scope.row)" plain>查看</el-button><!--所有状态都显示-->
                       <el-button
                               v-if="scope.row.checkStatus==1"
                               size="mini"
                               type="danger"
                               @click="showDeleteView(scope.row)" plain>删除</el-button><!--审核通过后的才能删除-->
                       <el-button
                               v-if="scope.row.checkStatus==2"
                               size="mini"
                               type="primary"
                               @click="updateQuestion(scope.row)" plain>修改试题</el-button><!--审核通过后的才能删除-->
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
                   title="试题详情"
                   :visible.sync="dialogVisible2"

                   width="40%">
               <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>题型：</strong>
                   </el-col>
                   <el-col :span="20">

                       <span v-if="questionCheckInfo.questionType=='sc'">单选题</span>
                       <span v-else-if="questionCheckInfo.questionType=='mc'">多选题</span>
                       <span v-else-if="questionCheckInfo.questionType=='fb'">填空题</span>
                       <span v-else-if="questionCheckInfo.questionType=='tf'">判断题</span>
                       <span v-else-if="questionCheckInfo.questionType=='qa'">简答题</span>
                   </el-col>
               </el-row>
               <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>题干：</strong>
                   </el-col>
                   <el-col :span="20">
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
                   <el-col :span="4" style="text-align: right;">
                       <strong>选项：</strong>
                   </el-col>
                   <el-col :span="20">
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
                   <el-col :span="4" style="text-align: right;">
                       <strong>答案：</strong>
                   </el-col>
                   <el-col :span="20">
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
                   <el-col :span="4" style="text-align: right;">
                       <strong>解析：</strong>
                   </el-col>
                   <el-col :span="20">
                       <div class="stem"><!--这里的样式是为了显示题干中的换行符-->
                           <span  v-if="questionCheckInfo.questionType=='sc'">{{questionCheckInfo.scQuestion.analysis}}</span>
                           <span v-else-if="questionCheckInfo.questionType=='mc'">{{questionCheckInfo.mcQuestion.analysis}}</span>
                           <span v-else-if="questionCheckInfo.questionType=='fb'">{{questionCheckInfo.fbQuestion.analysis}}</span>
                           <span v-else-if="questionCheckInfo.questionType=='tf'">{{questionCheckInfo.tfQuestion.analysis}}</span>
                           <span v-else-if="questionCheckInfo.questionType=='qa'">{{questionCheckInfo.qaQuestion.analysis}}</span>
                       </div>
                   </el-col>
               </el-row>
               <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>提交审核时间：</strong>
                   </el-col>
                   <el-col :span="20">
                       <span >{{questionCheckInfo.postTime}}</span>
                   </el-col>
               </el-row>
               <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>审核人：</strong>
                   </el-col>
                   <el-col :span="20">
                       <span v-if="questionCheckInfo.checkTeacher!=null">{{questionCheckInfo.checkTeacher.name}}</span>
                   </el-col>
               </el-row>
               <el-row :gutter="5" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>审核状态：</strong>
                   </el-col>
                   <el-col :span="20">
                       <span v-if="questionCheckInfo.checkStatus==0">未审核</span>
                       <span v-else-if="questionCheckInfo.checkStatus==1">通过</span>
                       <span v-else-if="questionCheckInfo.checkStatus==2">拒绝</span>
                   </el-col>
               </el-row>
               <el-row :gutter="5" v-if="questionCheckInfo.checkStatus==2" style="margin-bottom: 8px"><!--带间隔的布局-->
                   <el-col :span="4" style="text-align: right;">
                       <strong>拒绝原因：</strong>
                   </el-col>
                   <el-col :span="20">
                       <span>{{questionCheckInfo.refuseReason}}</span>
                   </el-col>
               </el-row>
               <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
                  </span>
           </el-dialog>
       </div>
    </div>
</template>

<script>
    export default {
        name: "SubmittedCheck",
        data(){
            return{
                dialogVisible1:false,//拒绝申请对话框
                dialogVisible2:false,//试题信息详情显示
                submittedChecklist:[],//收到的审核列表数据
                total:0,
                page:1,
                size:10,
                multipleSelection:[],
                queType:'',
                refuseReason:'',
                updateQuestionCheck:{

                },
                optionChar:['A.','B.','C.','D.','E.','F.','G.','H.','I.','J.','K.'],
                questionCheckInfo:{
                }
            }
        },mounted() {
            this.initData();
        }, methods: {
            initData() {//获取收到的请求信息

                let url = "/que/check/submit?page=" + this.page + "&size=" + this.size;
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.submittedChecklist = resp.data;
                        console.log(this.submittedChecklist.length);
                        this.total = resp.total;
                    }
                })
            },



            handleSelectionChange() {

            },
            showDetailView(data) {
                let target = JSON.parse(JSON.stringify(data));/*对象的深拷贝*/
                this.questionCheckInfo = target;
                this.dialogVisible2 = true;
            },
            showDeleteView(data) {
                this.$confirm('此操作将永久删除该条审核记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/que/check/" + data.id).then(resp => {
                        if (resp) {
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
            checkMany() {

            },
            emptyRefuseViewData() {
                this.updateQuestionCheck.id = '';
                this.refuseReason = '';
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initData();
            },
            currentChange(currentPage) {//里面的参数为当前页
                this.page = currentPage;
                this.initData();
            },updateQuestion(data){
                if(data.questionType=='sc'){
                    this.$router.push({
                        path: '/que/input',
                        name:'试题录入',
                        params: {
                            queType:'sc',
                            scMainAllQueInfo: JSON.stringify(data.scQuestion),
                        }
                    })
                }else if(data.questionType=='mc'){
                    this.$router.push({
                        path: '/que/input',
                        name:'试题录入',
                        params: {
                            queType:'mc',
                            mcMainAllQueInfo: JSON.stringify(data.mcQuestion),
                        }
                    })
                }else if(data.questionType=='tf'){
                    this.$router.push({
                        path: '/que/input',
                        name:'试题录入',
                        params: {
                            queType:'tf',
                            tfMainAllQueInfo: JSON.stringify(data.tfQuestion),
                        }
                    })
                }else if(data.questionType=='fb'){
                    this.$router.push({
                        path: '/que/input',
                        name:'试题录入',
                        params: {
                            queType:'fb',
                            fbMainAllQueInfo: JSON.stringify(data.fbQuestion),
                        }
                    })
                }else if(data.questionType=='qa'){
                    this.$router.push({
                        path: '/que/input',
                        name:'试题录入',
                        params: {
                            queType:'qa',
                            qaMainAllQueInfo: JSON.stringify(data.qaQuestion),
                        }
                    })
                }
            }
        }
    }
</script>

<style >
    .stem span{
        white-space:pre-line
    }
</style>