<template>
    <div>
        <el-divider></el-divider>
        <div style="margin-bottom: 5px">
            共查询到你的考试的课程有：<span style="color: red">{{myTestPapers.length}}</span>门
        </div>
        <div>
            <div style="height: 600px">
                <el-table
                        :data="myTestPapers"
                        stripe
                        border
                        v-loading="loading"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.7)"
                        style="width: 80%"
                >
                    <<el-table-column
                        type="index"
                        label="编号"
                        fixed
                        width="80">&lt;!&ndash;   prop="id"&ndash;&gt;
                    <template slot-scope="scope">
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                    <el-table-column
                            align="center"
                            label="课程"
                            prop="course"
                            width="200">
                        <template slot-scope="scope">
                            {{scope.row.course.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="学年学期"
                            prop="semester"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="试卷名称"
                            prop="name"
                            width="250">
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="总分"
                            prop="totalScore"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="成绩"
                            width="100">
                        <template slot-scope="scope">
                            {{scope.row.studentTotalGrade}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showMyAnalysisView(scope.row)">章节的得分率</el-button>
                            <el-button size="mini" @click="showClassAnalysisView(scope.row)">知识点得分率</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="text-align: right;width: 80%;margin-top: 10px">
                    <el-pagination
                            background
                            @size-change="sizeChange"
                            @current-change="currentChange"
                            layout="prev, pager, next, total, slot"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="知识点得分率" :visible.sync="knowledgePoints_value">
            <div align="center">
            <el-table
                    :data="tableData_KnowledgePoints"
                    border
                    style="font-size: 20px;margin: 0 auto;">

                <el-table-column
                        :width="350"
                        prop="knowledgePoints"
                        label="知识点名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        :width="350"
                        prop="scoringRate"
                        label="得分率"
                        width="180">
                </el-table-column>
            </el-table>
                </div>
        </el-dialog>
        <el-dialog title="章节得分率" :visible.sync="chapters_value">
            <div align="center">
            <el-table
                    :data="tableData_chapters"
                    border
                    style="font-size: 20px;margin: 0 auto;">

                <el-table-column
                        :width="350"
                        prop="chapters"
                        label="章节名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        :width="350"
                        prop="scoringRate"
                        label="得分率"
                        width="180">
                </el-table-column>
            </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "StuScoringRateOfChaptersAndKnowledgePoints",
        data(){
            return{
                loading:false,
                myTestPapers:[],
                total:0,
                page:1,
                size:10,
                //知识点得分率表格
                tableData_KnowledgePoints: [],
                //知识点得分率对话框显示标志
                knowledgePoints_value:false,
                //章节得分率对话框显示标志
                chapters_value:false,
                //章节得分率表格
                tableData_chapters: []

            }
        },mounted() {
            this.initMyTestPaper();
        },methods:{
            initMyTestPaper(){
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                this.loading = true;
                let url = '/stu/analysis/getAllMyTestPaper?page=' + this.page + '&size=' + this.size+'&studentNum='+userObj.studentNum;
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                        this.myTestPapers=resp.data;
                        this.total=resp.total;
                    }
                })

            },
            //章节得分率
            showMyAnalysisView(data){
                //清空表格数据
                this.tableData_chapters.splice(0,this.tableData_chapters.length)
                let user = window.sessionStorage.getItem("user")
                let useObj = JSON.parse(user)
                //这里的data为一条试卷的数据，通过data.id获取试卷的id
                let that = this
                let url = '/learningFeedbaek/getScoringRateOfIndividualChapters?testpaper_id='+data.id+"&student_id="+useObj.username
                this.getRequest(url).then(res=>{
                    if(res){
                        console.log("知识点得分率",res)
                        for(let i=0;i<res.rate.length;i++){
                            let Data_chapters = {
                                chapters:res.name[i],
                                scoringRate:res.rate[i]
                            }
                            that.tableData_chapters.push(Data_chapters)
                        }
                    }
                })
                this.chapters_value = true
            },
            //知识点得分率
            showClassAnalysisView(data){
                //清空表格数据
                this.tableData_KnowledgePoints.splice(0,this.tableData_KnowledgePoints.length)
                let user = window.sessionStorage.getItem("user")
                let useObj = JSON.parse(user)
                //这里的data为一条试卷的数据，通过data.id获取试卷的id
                let that = this
                let url = '/learningFeedbaek/getScoreRateOfPersonalKnowledgePoints?testpaper_id='+data.id+"&student_id="+useObj.username
                this.getRequest(url).then(res=>{
                    if(res){
                        console.log("知识点得分率",res)
                        for(let i=0;i<res.rate.length;i++){
                            let Data_KnowledgePoints = {
                                knowledgePoints:res.name[i],
                                scoringRate:res.rate[i]
                            }
                            that.tableData_KnowledgePoints.push(Data_KnowledgePoints)
                        }
                    }
                })
                this.knowledgePoints_value=true
            },
            sizeChange(currentSize){//试卷选择中页码改变触发事件
                this.size=currentSize;
                this.initMyTestPaper();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initMyTestPaper();
            },
        }
    }
</script>

<style scoped>

</style>