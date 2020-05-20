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
                             <el-button size="mini" @click="showMyAnalysisView(scope.row)">个人成绩分析</el-button>
                             <el-button size="mini" @click="showClassAnalysisView(scope.row)">班级成绩分析</el-button>
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

                <!--成绩详情-->
                <el-drawer
                        title="成绩详情"
                        :visible.sync="drawer"
                        size='26%'
                        style="overflow: scroll"

                        :with-header="false"
                >
                    <h3 align="center">成绩详情</h3>
                    <div style="padding-left:30px;padding-right:20px">
                        <span style="font-weight:bold;font-size:14px;color:grey">{{testPaper.name}}</span><!--试卷名称-->
                        <el-divider></el-divider>
                        <div>
                            <el-form label-position="right" label-width="80px">
                                <el-form-item label="学生姓名:">
                                    {{studentGradeInfo.studentName}}
                                </el-form-item>
                                <el-form-item label="成绩:" >
                                    {{studentGradeInfo.totalGrade}}
                                </el-form-item>
                                <el-form-item label="是否及格:">
                                    <div v-if="isPass">
                                        <el-tag type="success"  effect="plain">及格</el-tag>
                                    </div>
                                    <div v-else>
                                        <el-tag type="danger"  effect="plain">不及格</el-tag>
                                    </div>
                                </el-form-item>
                                <el-form-item label="成绩排名:">
                                    第{{gradeRank}}名
                                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;(共{{allStudentGrades.length}}名学生)
                                </el-form-item>
                            </el-form>

                        </div>
                        <el-divider content-position="left">试题得分详情</el-divider>
                        <div  style="margin-left: 0px;margin-top: 20px">
                            <div v-for="(largeQue,indexi) in studentGradeInfo.largeQues" :key="indexi" style="margin-top: 20px;">
                                <div v-if="largeQue.queType!=null&&largeQue.queType!=''" style="margin-bottom: 10px"><!--大题标题-->
                                    第{{largeQueTypeNum[indexi]}}大题、<strong>{{largeQue.queType}}</strong>
                                    （共{{largeQue.smallQueGrade.length}}小题，累计得分{{largeQue.largeQueGrade}}分）
                                </div>
                                <div v-for="(smallQue,indexj) in largeQue.smallQueGrade" :key="indexj">
                                    <el-row style="margin-top: 10px">
                                        <el-col :span="4" style="" align="center">
                                            <el-tag  effect="plain">试题{{indexj+1}}.</el-tag><!--小题序号-->
                                        </el-col>
                                        <el-col :span="7" style="">
                                            原分值:{{smallQue.initScore}} 分
                                        </el-col>
                                        <el-col :span="8" style="">
                                            得分:{{smallQue.queGrade}} 分
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </div>

                </el-drawer>


            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StuAnalysis",
        data(){
            return{
                loading:false,
                myTestPapers:[],
                total:0,
                page:1,
                size:10,
                drawer:false,//抽屉组件展示
                studentGradeInfo:'',//存放当前点击选中学生成绩的数据
                testPaper:{},//存放当前点击选中的试卷信息
                allStudentGrades:[],//这里该班级的所有学生的成绩数据
                largeQueTypeNum:["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],
                gradeRank:'',//学生的成绩排名
            }
        },computed:{


            //是否及格
            isPass:function () {
                if(this.studentGradeInfo!=''){
                    if(this.studentGradeInfo.totalGrade>(this.testPaper.totalScore*0.6)){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        },mounted() {
            this.initMyTestPaper();
        },methods:{
            initMyTestPaper(){
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                this.loading = true;
                console.log(userObj);
                let url = '/stu/analysis/getAllMyTestPaper?page=' + this.page + '&size=' + this.size+'&studentNum='+userObj.studentNum;
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading = false;
                        console.log(resp.data);
                        this.myTestPapers=resp.data;
                        this.total=resp.total;
                    }
                })

            },
            showMyAnalysisView(data){
                    //这里的data为一条试卷的数据，通过data.id获取试卷的id
                this.drawer=true;
                this.testPaper=data;//赋值给试卷对象
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                //通过班级id和试卷id获取到该学生所有学生成绩数据
                let url2 = '/gra/input/allOnlyStudentGrades?&classId='+userObj.classId+'&testPaperId='+data.id;
                this.getRequest(url2).then(resp=>{
                    if(resp){
                        this.allStudentGrades=resp;
                        for (let i = 0; i < this.allStudentGrades.length; i++) {
                            this.grades.push(this.allStudentGrades[i].totalGrade);//这里把遍历成绩对象，把所有的成绩存放到this.grades数组，便于后面的排序
                        }

                        let grades=this.sort(this.grades);//排序
                        console.log("grades",grades);
                        let index=this.getArrayIndex(grades,data.studentTotalGrade);
                        this.gradeRank=Number(index)+1;
                      /*  window.sessionStorage.setItem("allStudentGrades", JSON.stringify(resp));*/
                    }
                })
                //请求获取该学生的成绩数据
                /*   this.studentGradeInfo=data;*/
                let url = '/gra/input/getStudentGradeByStudentNumAndTestPaperId?&studentNum='+userObj.studentNum+"&testPaperId="+data.id;
                console.log(url)
                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.studentGradeInfo=resp.obj;//学生成绩数据赋值
                       console.log("this.studentGradeInfo:",this.studentGradeInfo);

                    }
                })
                //计算成绩排名
                //需要注意的是，成绩排名的时候，需要获取该班级下面所有学生的成绩信息，所以这里还需要发送一次请求
                let grade=this.studentGradeInfo.totalGrade;//当前学生的成绩
                //先把排名数据清空
                this.gradeRank='';
                this.allStudentGrades=[];
                this. grades=[];


            },
            showClassAnalysisView(data){

            },
            sizeChange(currentSize){//试卷选择中页码改变触发事件
                this.size=currentSize;
                this.initMyTestPaper();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initMyTestPaper();
            },

            getArrayIndex(arr,val){//获取数组的下标,工具方法
                var i=arr.length;
                while(i--){
                    if(arr[i]===val){
                        return i;
                    }
                }
                return -1;

            },
            sort(arr){//数组排序,降序，,工具方法
                var len=arr.length;
                for (let i = 0; i < len; i++) {
                    for (let j = 0; j < len - 1; j++) {
                        if(arr[j]<arr[j+1]){
                            var temp=arr[j+1];//元素交换
                            arr[j+1]=arr[j];
                            arr[j]=temp;
                        }
                    }
                }
                return arr;
            },
        }
    }
</script>

<style >
    .el-drawer{

        overflow: scroll
    }
</style>