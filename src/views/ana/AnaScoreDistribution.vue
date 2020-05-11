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
                <el-dialog title="成绩区间人数分布" :visible.sync="column_value" :destroy-on-close="true">
                    <div id="column" :style="{width: '600px', height: '300px'}" ></div>
                    <div id="line_chart" :style="{width: '600px', height: '300px'}" ></div>
                    <div style="font-size: 20px">成绩区间人数分布越接近正态分布曲线右半部分的形状，则试卷质量就越好。</div>
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

<script >
    export default {
        name: "score_distribution",
        data(){
            return{
                //柱状图数据
                option : {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ["60以下", "60-69", "70-79", "80-89", "90-100"],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390],
                        }
                    ]
                },
                option_series_data:[10, 52, 200, 334, 390],
                //柱状图div和折线图div
                myChart:null,
                line_chart:null,
                //折线图数据
                line_chart_option : {
                    xAxis: {
                        type: 'category',
                        data: ['60以下', '60-69', '70-79', '80-89', '90-100']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [10, 52, 200, 334, 390],
                        type: 'line'
                    }]
                },
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

                //true表示显示弹出框
                this.column_value=true
                let that = this
                //向后台发送卷子id，获取该卷子分数区间和每个区间的人数
                this.postRequest('http://localhost:8080/analysis/getTestPaperScoreById?id='+row.id).then(res=>{
                    if(res){

                        let arr = res.section;
                        let people_num = res.people_num;

                      /*  that.$set(that.option.xAxis[0],'data',arr)
                        that.$set(that.option.series[0],'data',people_num)*/
                      for(let i =0;i<res.length;i++){
                          that.option.xAxis[0].data[i]=arr[i];
                          that.option.series[0].data[i]=people_num[i];
                          that.line_chart_option.xAxis.data[i] = arr[i]
                          that.line_chart_option.series[0].data[i] = people_num[i]
                      }

                    }
                })

                //300毫秒后执行画图函数

                console.log(row.id)
                setTimeout(() => {
                    this.drawLine()
                },300)

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