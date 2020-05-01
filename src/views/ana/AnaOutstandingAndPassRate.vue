<template>
    <div>
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
                <el-button @click="click_select">查询</el-button>
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
        <el-dialog title="饼状图" :visible.sync="pie_value">
            <table>
                <tr>
                    <td><span id="dialog1" :style="{width: '400px', height: '300px'}" ></span></td>
                    <td><span id="dialog2" :style="{width: '400px', height: '300px'}" ></span></td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AnaOutstandingAndPassRate",
        mounted() {
            //初始化学院下拉框列表
            this.initSchools()
        },
        methods:{
            //点击查询按钮，根据班级id查询试卷列表
            click_select(){
                if(this.class_value != null){

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
                //显示对话框
                this.pie_value = true

                //渲染饼状图
                setTimeout(() => {
                    this.drawPie()
                },300)
            },
            // 在对话框里画两个饼状图
            drawPie(){
                let myPie1 = this.$echarts.init(document.getElementById("dialog1"))
                let myPie2 = this.$echarts.init(document.getElementById("dialog2"))
                myPie1.setOption(this.option1)
                myPie2.setOption(this.option2)
            }
        },
        data() {
            return {
                //控制显示对话框的标志
                pie_value:false,
                //饼状图
                option1 : {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
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