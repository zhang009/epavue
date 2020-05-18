<template>
    <div><!--收到的审核-->
        <div class="submittedCheck">
            <el-table
                    :data="submittedPaperChecklist"
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
                        width="200px"
                        label="试卷名称"
                        prop="name">
                    <template slot-scope="scope">
                        {{scope.row.testPaper.name}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="queStem"
                        width="120px"
                        :show-overflow-tooltip='true'
                        label="组卷方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.testPaperType==0">手工组卷</span>
                        <span v-else>自动组卷</span>
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
                    :visible.sync="paperInfoDialogVisible"
                    width="60%"><!--试卷审核和试卷详情展示对话框-->
                <div style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto" v-if="updateTestPaperInfo.testPaper!=null">
                    <div ><!--试卷标题展示-->
                        <div style="display: flex;justify-content: center">
                            <h3>{{updateTestPaperInfo.testPaper.semester}}</h3>
                        </div>
                        <div style="display: flex;justify-content: center" v-if="updateTestPaperInfo.testPaper.school&&updateTestPaperInfo.testPaper.major&&this.updateTestPaperInfo.testPaper.course">
                            <h4>{{updateTestPaperInfo.testPaper.school.name}}{{updateTestPaperInfo.testPaper.major.name}}{{updateTestPaperInfo.testPaper.course.name}}{{updateTestPaperInfo.testPaper.name}}</h4>
                        </div>

                    </div>
                    <!--单选题-->
                    <div v-show="updateTestPaperInfo.testPaper.sclist&&(updateTestPaperInfo.testPaper.sclist.length>0)">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>单选题</strong>
                            <div v-for="(scque,index) in updateTestPaperInfo.testPaper.sclist" style="margin-top: 20px">
                                <div>
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{scque.stem}}</span>
                                        </div>
                                    </div>
                                    <div ><!--选项-->
                                        <div>A. {{scque.option1}}</div>
                                        <div>B. {{scque.option2}} </div>
                                        <div>C. {{scque.option3}}</div>
                                        <div>D. {{scque.option4}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--多选题-->
                    <div v-show="updateTestPaperInfo.testPaper.mclist&&(updateTestPaperInfo.testPaper.mclist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>多选题</strong>
                            <div v-for="(mcque,index) in updateTestPaperInfo.testPaper.mclist" style="margin-top: 20px">
                                <div>
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{mcque.stem}}</span>
                                        </div>
                                    </div>
                                    <div ><!--选项-->
                                        <div v-for="(item,indexj) in mcque.options"><!--遍历多选题选项-->
                                            {{optionChar[indexj]}} {{item.optionContent}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--判断题-->
                    <div v-show="updateTestPaperInfo.testPaper.tflist&&(updateTestPaperInfo.testPaper.tflist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>判断题</strong>
                            <div v-for="(tfque,index) in updateTestPaperInfo.testPaper.tflist" style="margin-top: 20px">
                                <div>
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{tfque.stem}}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!--填空题-->
                    <div v-show="updateTestPaperInfo.testPaper.fblist&&(updateTestPaperInfo.testPaper.fblist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>填空题</strong>
                            <div v-for="(fbque,index) in updateTestPaperInfo.testPaper.fblist" style="margin-top: 20px">
                                <div>
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{fbque.stem}}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!--简答题-->
                    <div v-show="updateTestPaperInfo.testPaper.qalist&&(updateTestPaperInfo.testPaper.qalist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>简答题</strong>
                            <div v-for="(qaque,index) in updateTestPaperInfo.testPaper.qalist" style="margin-top: 20px">
                                <div>
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{qaque.stem}}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 20px;margin-bottom: 10px" >
                        <el-row v-if="updateTestPaperInfo.testPaper">
                            <el-col :span="5" :offset="13">
                                <strong>组卷教师：</strong>{{updateTestPaperInfo.testPaper.teacher.name}}
                            </el-col>
                            <el-col :span="6">
                                <strong>提交日期：</strong>{{updateTestPaperInfo.testPaper.createTime}}
                            </el-col>
                            <el-col :span="0">
                                <!--更新日期：{{updateTestPaperInfo.testPaper.updateTime}}-->
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-if="updateTestPaperInfo!=null" style="margin-top: 20px">
                    <el-row :gutter="5" style="margin-bottom: 8px" ><!--带间隔的布局-->
                        <el-col :span="5" style="text-align: right;">
                            <strong>审核状态：</strong>
                        </el-col>
                        <el-col :span="19">
                            <el-tag v-if="updateTestPaperInfo.checkStatus==0" type="warning">未审核</el-tag>
                            <el-tag v-else-if="updateTestPaperInfo.checkStatus==1" type="success">审核通过</el-tag>
                            <el-tag v-else-if="updateTestPaperInfo.checkStatus==2" type="danger">审核未通过</el-tag>
                        </el-col>
                    </el-row>
                    <el-row :gutter="5" v-if="updateTestPaperInfo.checkStatus==2" style="margin-bottom: 8px">
                        <el-col :span="5" style="text-align: right;">
                            <strong>拒绝原因：</strong>
                        </el-col>
                        <el-col :span="19">
                            <span>{{updateTestPaperInfo.refuseReason}}</span>
                        </el-col>
                    </el-row>

                </div>



            <div align="right" style="margin-top: 10px;margin-right: 20px">
                <el-button  type="primary" @click="paperInfoDialogVisible = false">确 定</el-button>
            </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubmmitedPaperCheck",
        data(){
            return{
                loading1:false,
                title1:'试卷详情',
                refuseDialogVisible:false,//拒绝对话框
                paperInfoDialogVisible:false,
                updateTestPaperInfo:{},//审核赋值时使用
                submittedPaperChecklist:[],
                multipleSelection:[],
                refuseReason:'',
                updatePaperCheck:{},//审核信息
                optionChar:['A.','B.','C.','D.','E.','F.','G.','H.','I.','J.','K.'],
                total:0,
                page:1,
                size:10,
                passPaper:1,//审核试题，是否通过单选按钮

            }
        },
        mounted() {
            this.initData();
        },methods:{
            initData() {//获取收到的请求信息，初始化试卷审核列表

                let url = "/pap/check/submit?page=" + this.page + "&size=" + this.size;
                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.submittedPaperChecklist = resp.data;
                       /* console.log(this.submittedChecklist.length);*/
                        this.total = resp.total;
                    }
                })
            },
            handleSelectionChange() {

            },
            showDetailView(data) {
                //这里利用updateTestPaperInfo把试卷信息进行展示，然后使用updateTestPaperCheck进行审核信息提交数据
                if(data.checkStatus==0){
                    this.title1='试卷审核';
                    this.passPaper=1;//审核状态标识为1，默认通过审核
                    this.refuseReason='';//拒绝原因置为空
                }
                let target = JSON.parse(JSON.stringify(data));/*对象的深拷贝*/
                this.updateTestPaperInfo = target;
                this.paperInfoDialogVisible = true;
                console.log("TestPaperInfo:",target);
                
            },
            showDeleteView(data) {
                this.$confirm('此操作将永久删除该条审核记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/pap/check/" + data.id).then(resp => {
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
                this.updateTestPaperInfo.id = '';
                this.refuseReason = '';
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initData();
            },
            currentChange(currentPage) {//里面的参数为当前页
                this.page = currentPage;
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