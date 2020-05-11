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
                <el-dialog title="知识点分值分布" :visible.sync="column_value">
                    <div id="column" :style="{width: '700px', height: '500px'}" ></div>
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
                                label="分值占比"
                                width="180">
                        </el-table-column>
                    </el-table>
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
        name: "AnaScoreOfTestpaperKnowledgePoints",
        data(){
            return{
                //知识点表格
                tableData_KnowledgePoints: [{
                    knowledgePoints:"c语言符合表达式",
                    scoringRate:0.2
                },{
                    knowledgePoints:"宏常量",
                    scoringRate:0.05
                },{
                    knowledgePoints:"自动类型转换",
                    scoringRate:0.2
                },{
                    knowledgePoints:"强制类型转换",
                    scoringRate:0.02
                },{
                    knowledgePoints:"格式化输入输出",
                    scoringRate:0.02
                },{
                    knowledgePoints:"条件循环",
                    scoringRate:0.01
                },{
                    knowledgePoints:"字符串常量",
                    scoringRate:0.2
                },{
                    knowledgePoints:"字符指针",
                    scoringRate:0.1
                },{
                    knowledgePoints:"一维数组",
                    scoringRate:0.15
                },{
                    knowledgePoints:"二维数组",
                    scoringRate:0.05
                },],
                //发送请求后返回的试卷数组
                list_oftestpaper:null,
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
                //横向柱状图数据
                option : {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['2011年']
                    },
                    grid: {
                        height:450,
                        left: '3%',
                        right: '11%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        name : '百分比',
                        nameTextStyle:{fontSize:20},
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        name:'知识点名称',
                        nameTextStyle:{fontSize:20},
                        type: 'category',
                        data: ['c语言符合表达式', '宏常量', '自动类型转换', '强制类型转换', '格式化输入输出', '条件循环', '字符串常量', '字符指针', '一维数组', '二维数组']
                    },
                    series: [
                        {
                            name: '百分比',
                            type: 'bar',
                            data: [0.2,0.05,0.2,0.02,0.02,0.01,0.2,0.1,0.15,0.05,]
                        },

                    ]
                }
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
            //列表点击事件
            list_click(row){
                let that = this
                //true表示显示弹出框
                this.column_value=true
                //向后台发送请求获取数据
                this.getRequest('http://localhost:8080/analysis/getScoreDistributionOfKnowledgePointsInTestPaper?id='+row.id).then(res=>{
                    if(res){
                        console.log(res)
                        // names
                        // scoreDistribution
                        that.option.yAxis.data = res.names
                        that.option.series[0].data = res.scoreDistribution
                        for(let i=0;i<res.scoreDistribution.length;i++){
                            let Data_KnowledgePoints = {
                                knowledgePoints:res.names[i],
                                scoringRate:res.scoreDistribution[i]
                            }

                            that.tableData_KnowledgePoints.push(Data_KnowledgePoints)
                        }
                    }
                })

                //300毫秒后执行画图函数
                // console.log(row.id)
                setTimeout(() => {
                    this.drawLine()
                },300)
            },
            //画柱状图的函数
            drawLine(){
                var myChart = this.$echarts.init(document.getElementById("column"))
                myChart.setOption(this.option)
            }
        },
        mounted() {
            let that = this
            //挂载结束后立即向后台请求试卷列表的数据，然后将试卷列表显示在表格中
            this.$http.get('http://localhost:8080/analysis/getListOfTestPaper').then(function (res) {
                console.log(res)
                that.count_TestPaper = res.length       //将返回数据总数保存起来
                //将返回来的数组放到表格里
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
    /*知识点得分率表格字体设置*/
    .scoringRateTableFont{
        font-size: 20px;
    }
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