<template>
    <div>
        <div class="receiveCheckMain">
            <el-table
                    :data="receivedPaperChecklist"
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
                        <span v-if="scope.row.paperType==0">手工组卷</span>
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
                        <el-tag type="info" v-else-if="scope.row.checkStatus==1">已通过</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.checkStatus==2">拒绝</el-tag>
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
                                v-if="scope.row.checkStatus==0"
                                size="mini"
                                type="primary"
                                @click="showPassView(scope.row)" plain>通过</el-button><!--未通过审核显示-->
                        <el-button
                                size="mini"
                                type="warning"
                                v-if="scope.row.checkStatus==0"
                                @click="showRefuseView( scope.row)" plain>拒绝</el-button><!--未通过审核显示-->

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
                    title="拒绝该试卷加入试卷库"
                    :visible.sync="paperRefuseDialogVisible"
                    width="30%"><!--审核拒绝对话框-->
                <el-input type="textarea"
                          :rows="10"
                          v-model="refuseReason"
                          placeholder="请备注拒绝原因"
                ></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="paperRefuseDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitResuseReason">确 定</el-button>
                  </span>
            </el-dialog>
            <el-dialog
                    title="试卷详情"
                    :visible.sync="paperDetailDialogVisible"
                    width="60%">

                <!--<el-row :gutter="5" style="margin-top: 20px;margin-bottom: 8px">&lt;!&ndash;带间隔的布局&ndash;&gt;
                    <el-col :span="5"  style="text-align: right;">
                        <strong>提交审核时间：</strong>
                    </el-col>
                    <el-col :span="6">
                        <span >{{updatePaperCheck.postTime}}</span>
                    </el-col>
                    <el-col :span="6" style="text-align: right;">
                        <strong>提交人：</strong>
                        <span v-if="updatePaperCheck.postTeacher!=null">{{updatePaperCheck.postTeacher.name}}</span>
                    </el-col>
                </el-row>-->
                <!--<el-row :gutter="5" style="margin-bottom: 8px">&lt;!&ndash;带间隔的布局&ndash;&gt;
                    <el-col :span="5" :offset="5"  style="text-align: right;">
                        <strong>审核状态：</strong>
                    </el-col>
                    <el-col :span="6">
                        <span v-if="updatePaperCheck.checkStatus==0">未审核</span>
                        <span v-else-if="updatePaperCheck.checkStatus==1">通过</span>
                        <span v-else-if="updatePaperCheck.checkStatus==2">拒绝</span>
                    </el-col>
                    <el-col :span="6" style="text-align: right;">
                        <strong>拒绝原因：</strong>
                        <span>{{updatePaperCheck.refuseReason}}</span>
                    </el-col>
                </el-row>-->

                <div style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto" v-if="updatePaperCheck.testPaper!=null">
                    <div ><!--试卷标题展示-->
                        <div style="display: flex;justify-content: center">
                            <h3>{{updatePaperCheck.testPaper.semester}}</h3>
                        </div>
                        <div style="display: flex;justify-content: center" v-if="updatePaperCheck.testPaper.school&&updatePaperCheck.testPaper.major&&this.updatePaperCheck.testPaper.course">
                            <h4>{{updatePaperCheck.testPaper.school.name}}{{updatePaperCheck.testPaper.major.name}}{{updatePaperCheck.testPaper.course.name}}{{updatePaperCheck.testPaper.name}}</h4>
                        </div>

                    </div>
                    <!--单选题-->
                    <div v-show="updatePaperCheck.testPaper.sclist&&(updatePaperCheck.testPaper.sclist.length>0)">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>单选题</strong>
                            <div v-for="(scque,index) in updatePaperCheck.testPaper.sclist" style="margin-top: 20px">
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
                    <div v-show="updatePaperCheck.testPaper.mclist&&(updatePaperCheck.testPaper.mclist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>多选题</strong>
                            <div v-for="(mcque,index) in updatePaperCheck.testPaper.mclist" style="margin-top: 20px">
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
                    <div v-show="updatePaperCheck.testPaper.tflist&&(updatePaperCheck.testPaper.tflist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>判断题</strong>
                            <div v-for="(tfque,index) in updatePaperCheck.testPaper.tflist" style="margin-top: 20px">
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
                    <div v-show="updatePaperCheck.testPaper.fblist&&(updatePaperCheck.testPaper.fblist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>填空题</strong>
                            <div v-for="(fbque,index) in updatePaperCheck.testPaper.fblist" style="margin-top: 20px">
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
                    <div v-show="updatePaperCheck.testPaper.qalist&&(updatePaperCheck.testPaper.qalist.length>0)" style="margin-top: 20px">
                        <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                            <strong>简答题</strong>
                            <div v-for="(qaque,index) in updatePaperCheck.testPaper.qalist" style="margin-top: 20px">
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
                </div>
                <div style="margin-top: 20px">
                    <el-row v-if="updatePaperCheck.testPaper">
                        <el-col :span="5" :offset="5">
                            组卷教师：{{updatePaperCheck.testPaper.teacher.name}}
                        </el-col>
                        <el-col :span="6">
                            创建日期：{{updatePaperCheck.testPaper.createTime}}
                        </el-col>
                        <el-col :span="6">
                            更新日期：{{updatePaperCheck.testPaper.updateTime}}
                        </el-col>
                    </el-row>
                </div>



                <span slot="footer" class="dialog-footer">
                   <!-- <el-button @click="dialogVisible2 = false">取 消</el-button>-->
                    <el-button type="primary" @click="paperDetailDialogVisible = false">确 定</el-button>
                  </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ReceivedPaperCheck",
        data(){
            return{
                loading1:false,//加载审核列表数据
                receivedPaperChecklist:[],//收到审核试题的列表
                paperCheckInfo:{},//试卷信息展示的详细信息
                paperDetailDialogVisible:false,//展示详细信息对话框
                paperRefuseDialogVisible:false,//展示拒绝审核信息对话框

                updatePaperCheck:{},//这里主要是为了放置对话框中试卷审核信息
                refuseReason:'',//审核拒绝原因
                multipleSelection:[],//批量操作
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
                total:0,
                page:1,
                size:10,




            }
        }
        ,mounted() {
            this.initData();

        },
        methods:{
            initData(){//获取收到的请求信息

                this.loading1=true;
                let url = "/pap/check/receive?page="+this.page+"&size="+this.size;
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading1=false;
                        this.receivedPaperChecklist=resp.data;
                        console.log(this.receivedPaperChecklist.length);
                        this.total=resp.total;
                    }
                })
            },
            handleSelectionChange(){

            },
            submitResuseReason(data){
                //提交拒绝原因
                this.postRequest("/pap/check/refuse?id="+this.updatePaperCheck.id+"&reason="+this.refuseReason).then(resp=>{
                    if(resp){
                        this.initData();//刷新页面
                        this.emptyRefuseViewData();
                        this.paperRefuseDialogVisible=false;
                    }
                })
            },
            showDetailView(data){
                let target=JSON.parse(JSON.stringify(data));/*对象的深拷贝*/
                this.updatePaperCheck=target;

                this.paperDetailDialogVisible=true;
            },
            showDeleteView(data){
                this.$confirm('此操作将永久删除该条审核记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/pap/check/"+data.id).then(resp=>{
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
            showRefuseView(data){//展示拒绝对话框
                this.paperRefuseDialogVisible=true;
                console.log(data.id);
                this.updateQuestionCheck.id=data.id;
            },
            checkMany(){//多选批量删除

            },
            emptyRefuseViewData(){
                this.updatePaperCheck.id='';
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