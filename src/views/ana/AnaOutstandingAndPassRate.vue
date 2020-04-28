<template>
    <div>
        <el-button type="text" @click="list_click">打开嵌套表格的 Dialog</el-button>

        <el-dialog title="柱状图" :visible.sync="column_value">
            <div id="haha" :style="{width: '600px', height: '300px'}" class="haha"></div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AnaScoreDistribution_column",
        value(newVal, oldVal){
            this.showMask = newVal;
        },
        mounted() {
            console.log("挂载结束"+this.column_value)

        },
        showMask(val) {
            this.$emit('input', val);
        },
        methods:{

            //表格点击事件
            list_click(){
                //true表示显示对话框
                this.dialogTableVisible=true
                setTimeout(() => {
                    //画图
                    this.drawLine()
                },300)

            },
            //画柱状图的函数
            drawLine(){
                var myChart = this.$echarts.init(document.getElementById("haha"))
                myChart.setOption(this.option)
            }
        },
        props:['column_value'],
        data() {
            return {
                gridData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                //对话框是否显示的布尔标志
                dialogTableVisible: false,


            };
        }
    }
</script>

<style scoped>

</style>