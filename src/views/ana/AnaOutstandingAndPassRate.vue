<template>
    <div><!--及格率和优秀率-->
        <el-row class="el-row_margin">
            <el-col :span="24">
                <el-select v-model="college_value"
                           class="dropdown_menu"
                           placeholder="请选择学院"
                           @change="changeDropdownMenu">
                    <el-option
                            v-for="item in college_options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="major_value"
                           class="dropdown_menu"
                           placeholder="请选择专业"
                           @change="changeDropdownMenu">
                    <el-option
                            v-for="item in major_options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="class_value"
                           class="dropdown_menu"
                           placeholder="请选择班级"
                           @change="changeDropdownMenu">
                    <el-option
                            v-for="item in classes_options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <el-button @click="click_select">选择</el-button>
            </el-col>
        </el-row>
        <el-row class="el-row_margin">
            <el-col :span="12">
                <el-input placeholder="请输入试卷名称（可以只输入部分关键字）" v-model="search_data" class="search_input" @keyup.enter.native="center_search">
                    <el-button slot="append" icon="el-icon-search" @click="click_search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="el-row_margin">
            <el-col :span="24">
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
            </el-col>
        </el-row>
        <el-row class="el-row_margin">
            <el-col :span="24">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="count_TestPaper"
                        :current-page.sync="currentPage"
                        @current-change="page_click">
                </el-pagination>
            </el-col>
        </el-row>
        <el-dialog title="饼状图" :visible.sync="pie_value">
            <table>
                <tr>
                    <td><span id="dialog1" :style="{width: '400px', height: '300px'}" ></span></td>
                    <td><span id="dialog2" :style="{width: '400px', height: '300px'}" ></span></td>
                </tr>
            </table>
            <div style="font-size: 20px">在试卷质量确定的情况下，及格率和优秀率越高，说明教学效果越好</div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AnaOutstandingAndPassRate",
        mounted() {
            //初始化学院下拉框列表
            this.initSchools()

            let that = this
            //挂载结束后立即向后台请求试卷列表的数据，然后将试卷列表显示在表格中
            this.$http.get('/analysis/getListOfTestPaper').then(function (res) {
                that.count_TestPaper = res.length       //将返回数据总数保存起来
                //将返回来的数组放到表格里
                that.list_oftestpaper = res
                that.setTableData()
                //setTimeout(() => {this.setTableData()},300)
            }).catch(function (err) {
                console.log(err)
            })
        },
        methods:{
            //页码点击事件
            page_click(){
                /*
                * 1,获取当前页码
                * 2,将当前页码所需要的数据绑定到表格当中（在此之前，先判断是不是最后一页）
                * */

                let table_data = []
                // console.log("当前页码2",this.currentPage)
                // console.log("总共有几页",parseInt(this.count_TestPaper/10)+1)
                // console.log("数据前下标",(this.currentPage-1)*10)
                if(this.currentPage != parseInt(this.count_TestPaper/10)+1){
                    for(let i=(this.currentPage-1)*10;i<this.currentPage*10;i++){
                        table_data.push(this.list_oftestpaper[i])
                    }
                    // console.log("表格数据1",table_data)
                    // console.log("数据1",this.list_oftestpaper)
                }else{
                    for(let i=(this.currentPage-1)*10;i<this.count_TestPaper;i++){
                        console.log("下标2",i)
                        table_data.push(this.list_oftestpaper[i])
                    }
                    // console.log("表格数据2",table_data)
                    // console.log("数据2",this.list_oftestpaper[1])
                }
                this.tableData = table_data
            },
            //将存储在试卷列表变量中的数据放到tableData（表格数据）中
            setTableData(){
                this.tableData = this.list_oftestpaper
            },
            //搜索框回车按钮监听
            center_search(){
                this.click_search()
            },
            //搜索按钮点击事件
            click_search() {
                console.log("点击了搜素按钮")
                //向后台发送请求
                // this.postRequest('/url?name='+this.search_data).then(res=>{
                //     if(res){
                //
                //     }
                // })
            },
            //点击查询按钮，根据班级id查询试卷列表
            click_select(){
                if(this.class_value != null){
                    alert("班级已经选好，请从下面的列表中选择试卷")
                }else{
                    alert("请先选择班级")
                }
            },
            // 复制了依方的方法 start
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.college_options=resp;
                    }
                })
            },
            /*根据学院id获取专业列表*/
            initMajors(){
                this.getRequest("/baseinfo/major/?schoolId="+this.college_value).then(resp=>{
                    if(resp){
                        this.major_options=resp;
                    }
                })
            },
            /*根据专业id获取班级列表*/
            initClassByMajorId(){
                this.getRequest("/baseinfo/class/all?majorId="+this.major_value).then(resp=>{
                    if(resp){
                        this.classes_options=resp;
                    }
                })
            },
            // 复制了依方的方法 end
            // 下拉框改变事件
            changeDropdownMenu(){
                if(this.college_value != null){
                    this.initMajors();   //根据学院id获取专业列表
                }
                if(this.major_value != null){
                    this.initClassByMajorId()    //根据专业id获取班级列表
                }


            },
            //列表点击事件
            list_click(row){
                if(this.class_value != null){
                    let that = this
                    //显示对话框
                    this.pie_value = true
                    this.postRequest('/teachingEffectiveness/getPassStudentNumAndOutstandingStudentNum?classId='+this.class_value+"&testpaperId="+row.id).then(res=>{
                        if(res){

                            that.option1.series[0].data[0].value = res.passStudentNum   //及格人数设置
                            that.option1.series[0].data[1].value = res.failStudentNum   //不及格人数设置
                            that.option2.series[0].data[0].value = res.outstandingStudentNum //优秀人数设置
                            that.option2.series[0].data[1].value = res.otherStudentNum  //其他人数设置
                        }
                    })
                    //渲染饼状图
                    setTimeout(() => {
                        this.drawPie()
                    },100)
                }else{
                    alert("请先选择班级")
                }

            },
            // 在对话框里画两个饼状图
            drawPie(){
                let myPie1 = this.$echarts.init(document.getElementById("dialog1"))
                let myPie2 = this.$echarts.init(document.getElementById("dialog2"))
                console.log("及格人数="+this.option1.series[0].data[0].value)
                console.log("不及格人数="+this.option1.series[0].data[1].value)
                console.log("优秀人数="+this.option2.series[0].data[0].value)
                console.log("其他人数="+this.option2.series[0].data[1].value)
                myPie1.clear()
                myPie2.clear()
                myPie1.setOption(this.option1)
                myPie2.setOption(this.option2)
            }
        },
        data() {
            return {
                //当前页码
                currentPage:1,
                //总共有多少条试卷数据被返回
                count_TestPaper:0,
                //发送请求后返回的试卷数组
                list_oftestpaper:null,
                //卷子名称搜索框数据
                search_data:"",
                //控制显示对话框的标志
                pie_value:false,
                //饼状图
                option1 : {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    toolbox: {//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                        show: true,
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // dataView: {readOnly: false},
                            // magicType: {type: ['line', 'bar']},
                            // restore: {},
                            saveAsImage: {}
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                        data: ['及格人数', '不及格人数']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: 335, name: '及格人数'},
                                {value: 60, name: '不及格人数'},
                            ]
                        }
                    ]
                },
                option2 : {
                    toolbox: {//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                        show: true,
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: 'none'
                            // },
                            // dataView: {readOnly: false},
                            // magicType: {type: ['line', 'bar']},
                            // restore: {},
                            saveAsImage: {}
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                        data: ['优秀人数', '其他人数']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: 335, name: '优秀人数'},
                                {value: 310, name: '其他人数'},
                            ]
                        }
                    ]
                },
                //下拉列表数据
                college_options: [{
                    value: '选项1',
                    label: '软件学院'
                }, {
                    value: '选项2',
                    label: '计算机学院'
                }, {
                    value: '选项3',
                    label: '美术学院'
                }, {
                    value: '选项4',
                    label: '外国语学院'
                }, {
                    value: '选项5',
                    label: '纺织学院'
                }],
                major_options:[{
                    value:'选项1',
                    label:'卓越'
                },{
                    value:'选项2',
                    label:'互联网'
                },{
                    value:'选项3',
                    label:'移动'
                },{
                    value:'选项4',
                    label:'金融'
                },{
                    value:'选项5',
                    label:'大数据'
                },],
                classes_options:[{
                    value:'选项1',
                    label:'移动161'
                },{
                    value:'选项2',
                    label:'移动162'
                },{
                    value:'选项3',
                    label:'移动163'
                },{
                    value:'选项4',
                    label:'移动164'
                },],
                college_value: null,
                major_value: null,
                class_value: null,
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
            };
        }
    }
</script>

<style scoped>
    /*下拉列表布局相关*/
    .dropdown_menu{
        margin-right: 10px;
    }
    /*布局相关*/
    .el-row_margin{
        margin-top: 10px;
    }
    /*下拉列表相关*/
    .el-dropdown {
        vertical-align: top;
    }
    .el-dropdown + .el-dropdown {
        margin-left: 15px;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }

</style>