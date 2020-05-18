<template>
    <div>
        <el-row class="el-row_margin">
            <el-col :span="12">
                <el-input placeholder="请输入试卷名称（可以只输入部分关键字）" v-model="search_data" class="search_input" @keyup.enter.native="center_search">
                    <el-button slot="append" icon="el-icon-search" @click="click_search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="el-row_margin">
            <el-col :span="24">
                <el-button type="info">高数</el-button>
                <el-button type="info">c语言</el-button>
                <el-button type="info">英语</el-button>
                <el-button type="info">线性代数</el-button>
                <el-button type="info">概率论</el-button>
            </el-col>
        </el-row>

        <el-row class="el-row_margin">
            <el-col :span="24" class="bac1">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%" @row-click="list_click">
                    <el-table-column
                            prop="id"
                            label="试卷编号"
                            width="180"></el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="试卷创建时间"
                            width="180" >
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="试卷名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="teacher"
                            label="出卷人">
                    </el-table-column>
                </el-table>
                <el-dialog
                        title="试卷详情"
                        :visible.sync="column_value"
                        width="60%">
                    <div style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto" v-if="this.updateTestPaperInfo!=null">
                        <div ><!--试卷标题展示-->
                            <div style="display: flex;justify-content: center">
                                <h3>{{updateTestPaperInfo.semester}}</h3>
                            </div>
                            <div style="display: flex;justify-content: center" v-if="updateTestPaperInfo.school&&updateTestPaperInfo.major&&updateTestPaperInfo.course">
                                <h4>{{updateTestPaperInfo.school.name}}{{updateTestPaperInfo.major.name}}{{updateTestPaperInfo.course.name}}{{updateTestPaperInfo.name}}</h4>
                            </div>
                            <div align="right" style="margin-right: 100px">
                                <div>
                                    <h5>试卷整体难度：<span style="color:red">适中</span></h5>
                                </div>
                            </div>


                        </div>
                        <!--单选题-->
                        <div v-show="updateTestPaperInfo.sclist&&(updateTestPaperInfo.sclist.length>0)">
                            <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                <strong>单选题</strong>
                                <div v-for="(scque,index) in updateTestPaperInfo.sclist" style="margin-top: 20px">
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
                        <div v-show="updateTestPaperInfo.mclist&&(updateTestPaperInfo.mclist.length>0)" style="margin-top: 20px">
                            <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                <strong>多选题</strong>
                                <div v-for="(mcque,index) in updateTestPaperInfo.mclist" style="margin-top: 20px">
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
                        <div v-show="updateTestPaperInfo.tflist&&(updateTestPaperInfo.tflist.length>0)" style="margin-top: 20px">
                            <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                <strong>判断题</strong>
                                <div v-for="(tfque,index) in updateTestPaperInfo.tflist" style="margin-top: 20px">
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
                        <div v-show="updateTestPaperInfo.fblist&&(updateTestPaperInfo.fblist.length>0)" style="margin-top: 20px">
                            <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                <strong>填空题</strong>
                                <div v-for="(fbque,index) in updateTestPaperInfo.fblist" style="margin-top: 20px">
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
                        <div v-show="updateTestPaperInfo.qalist&&(updateTestPaperInfo.qalist.length>0)" style="margin-top: 20px">
                            <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                <strong>简答题</strong>
                                <div v-for="(qaque,index) in updateTestPaperInfo.qalist" style="margin-top: 20px">
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
                        <el-row v-if="updateTestPaperInfo.teacher">
                            <el-col :span="5" :offset="5">
                                组卷教师：{{updateTestPaperInfo.teacher.name}}
                            </el-col>
                            <el-col :span="6">
                                创建日期：{{updateTestPaperInfo.createTime}}
                            </el-col>
                            <el-col :span="6">
                                更新日期：{{updateTestPaperInfo.updateTime}}
                            </el-col>
                        </el-row>
                    </div>

                    <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="detailTestPaperDialogVisible = false">确 定</el-button>
                          </span>
                </el-dialog>
                <!--                <el-collapse v-model="activeNames" @change="handleChange($event)">-->
                <!--                    <el-collapse-item v-for="(item,index) in papers" :title="item" :name="index">-->
                <!--                        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>-->
                <!--                        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>-->
                <!--                    </el-collapse-item>-->
                <!--                </el-collapse>-->

            </el-col>
        </el-row>
        <el-row class="el-row_margin">
            <el-col :span="24">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="count_TestPaper">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "AnaTestDifficultyAndTestPaperDifficulty",
        data(){
            return{
                //向后台请求的试卷信息
                updateTestPaperInfo:{},
                total:0,        //总共有多少数据
                page:1,         //页码
                size:10,        //每页有多少条数据
                testPapers:[],//后端传来的试卷列表
                //总共有多少条数据被返回
                count_TestPaper:0,
                //分析图表格是否显示的，false为不显示，true为显示
                column_value:false,
                //表格数据
                tableData: [{
                    id:1,
                    createTime: '2017-05-02',
                    name: '卓越161Java期末测试',
                    teacher: '郭丽'
                }, {
                    id:2,
                    createTime: '2016-05-04',
                    name: '卓越151Java期末测试',
                    teacher: '郭丽'
                }, {
                    id:3,
                    createTime: '2018-05-01',
                    name: '卓越171Java期末测试',
                    teacher: '郭丽'
                }, {
                    id:4,
                    createTime: '2020-05-03',
                    name: '卓越181Java期末测试',
                    teacher: '郭丽'
                }],
                search_data:'',      //搜索输入框的数据
                papers:['15级JAVA期末测试','16级JAVA期末测试','17级JAVA期末测试','18级JAVA期末测试'],          //试卷
                activeNames: ['1'],


            }
        },

        methods:{

            //搜索框回车按钮监听
            center_search(){
                this.click_search()
            },
            //搜索按钮点击事件
            click_search() {
                let that = this
                //向后台发送请求
                this.getRequest('/analysis/getListOfTestPaperByName?name='+this.search_data).then(res=>{
                    if(res){
                        that.count_TestPaper = res.length
                        that.list_oftestpaper = res
                        that.setTableData()
                    }
                })
            },
            //上一页点击事件
            //下一页点击事件
            //页码点击事件
            //将存储在试卷列表变量中的数据放到tableData（表格数据）中
            setTableData(){
                this.tableData = this.list_oftestpaper
            },
            initTestPaper(type){
                this.loading1 = true;
                let url = '/pap/testPaper/?page=' + this.page + '&size=' + this.size;
                if (type && type == 'advanced') {//条件搜索
                    if (this.searchValue.courseId) {
                        url += '&courseId=' + this.searchValue.courseId;
                    }
                    if (this.searchValue.createTeacherId) {
                        url += '&postTeacherId=' + this.searchValue.createTeacherId;
                    }
                    if (this.searchValue.createPaperType) {
                        url += '&paperType=' + this.searchValue.createPaperType;
                    }
                }else{//普通搜索
                    url+="&name="+this.keyword;
                }
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading1 = false;
                        console.log(resp.data);
                        this.testPapers=resp.data;
                        this.total=resp.total;
                    }
                })
            },
            //列表点击事件
            list_click(row){
                console.log("row",row)
                //true表示显示弹出框
                this.column_value=true
                let that = this
                //向后台发送卷子id，获取该卷子分数区间和每个区间的人数
                this.getRequest('http://localhost:8080/pap/testPaper/?page='+this.page+'&size='+this.size).then(resp=>{
                    if(resp){
                        console.log("resp=",resp)
                        console.log("resp.data=",resp.data);
                        console.log("resp.total=",resp.total)
                        that.testPapers=resp.data;
                        that.total=resp.total;
                        that.updateTestPaperInfo=resp.data;
                    }
                })



            },
            //画柱状图和折线图的函数
            drawLine(){
                // document.getElementById("column").removeAttribute("_echarts_instance_");
                this.myChart = this.$echarts.init(document.getElementById("column"))
                this.line_chart = this.$echarts.init(document.getElementById("line_chart"))


                console.log(this.option.xAxis[0].data)
                console.log(this.option.series[0].data)
                this.line_chart.clear()
                this.myChart.clear()
                this.line_chart.setOption(this.line_chart_option,true)
                this.myChart.setOption(this.option,true)



            }
        },
        watch:{
            option:{
                handler(newVal,oldVal){
                    console.log("heihehiwheihiwhehiwheiwhie")

                },deep:true
            },

        },
        mounted() {
            let that = this
            //挂载结束后立即向后台请求试卷列表的数据，然后将试卷列表显示在表格中
            this.$http.get('http://localhost:8080/analysis/getListOfTestPaper').then(function (res) {
                that.count_TestPaper = res.length       //将返回数据总数保存起来
                //将返回来的数组放到表格里
                console.log(res)
                that.list_oftestpaper = res
                that.setTableData()
                //setTimeout(() => {this.setTableData()},300)
            }).catch(function (err) {
                console.log(err)
            })
        },
    }
</script>

<style scoped>
    /*布局相关*/
    .el-row_margin{
        margin-top: 10px;
    }
    /*搜索框相关*/
    >>> .el-input__inner{
        height: 50px;
        font-size: 20px;
    }
    /*试卷列表相关*/
    .papers_list{
        border-bottom: 5px;
    }
</style>