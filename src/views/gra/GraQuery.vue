<template>
    <div><!--成绩查询页面-->
            <!--选择试卷对话框-->
        <el-dialog
                title="选择试卷"
                :center="true"
                :visible.sync="selectTestPaperDialogVisible"
                width="80%">
            <div style="padding-left: 100px;padding-right: 100px">
                <div ><!--搜索栏-->
                    <el-row :gutter="5">
                        <el-col :span="7">
                            试卷名称：
                            <el-input size="small"
                                      style="width: 200px"
                                      v-model="searchValue.testPaperName"
                            >
                            </el-input>
                        </el-col>
                        <el-col :span="7">
                            课程：
                            <el-select v-model="searchValue.courseId"
                                       placeholder="请选择课程"
                                       size="small"
                                       style="width: 230px;margin-right: 5px">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            创建人：
                            <el-select v-model="searchValue.createTeacherId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择创建人"
                                       size="small"
                                       style="width: 200px;">
                                <el-option
                                        v-for="item in postTeachers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 20px">
                        <el-col :span="8">
                            <div >
                                试卷类型：
                                <el-radio-group
                                        size="small"
                                        style="width: 240px;"
                                        v-model="searchValue.isTemplate">
                                    <el-radio :label='0' border>系统组卷</el-radio>
                                    <el-radio :label='1' border>试卷模板</el-radio>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                    <div align="center" style="margin-top: 20px">
                        <el-button size="small"  >重置</el-button>
                        <el-button size="small" type="primary" @click="initTestPaper">搜索</el-button>
                    </div>
                </div>
                <el-divider></el-divider>
                <div style="height: 600px">
                    <el-table
                            :data="testPapers"
                            stripe
                            v-loading="loading1"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.7)"
                            style="width: 100%"
                            @row-click="rowClick"
                            :default-sort = "{prop: 'createTime', order: 'descending'}">
                        <!--<el-table-column
                                type="index"
                                label="编号"
                                fixed
                                width="80">&lt;!&ndash;   prop="id"&ndash;&gt;
                            <template slot-scope="scope">
                                <span>{{(page - 1) * size + scope.$index + 1}}</span>
                            </template>
                        </el-table-column>-->
                        <el-table-column
                                width="25">
                            <template slot-scope="scope">
                                <el-radio :label="scope.row.id" v-model="radioId" @change="getCurrentRow(scope.row)" ></el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="试卷名称"
                                prop="name"
                                width="250">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="试卷类型"
                                prop="paperType"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.isTemplate==0">系统组卷</span>
                                <span v-else>试卷模板</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="总分"
                                prop="totalScore"
                                width="100">
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
                                prop="teacher"
                                label="创建人"
                                width="100">
                            <template slot-scope="scope">
                                {{scope.row.teacher.name}}
                            </template>
                        </el-table-column>

                        <el-table-column
                                align="center"
                                label="创建时间"
                                prop="createTime"
                                sortable
                                width="180">
                        </el-table-column>
                        <!-- <el-table-column
                                 align="center"
                                 label="操作">
                             <template slot-scope="scope">
                                 <el-button size="mini" @click="showTestPaperInfoView(scope.row)">查看</el-button>
                                 <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                                 <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                             </template>
                         </el-table-column>-->
                    </el-table>
                    <div style="text-align: right;width: 92%;margin-top: 10px">
                        <el-pagination
                                background
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, total, slot"
                                :total="total">
                        </el-pagination>
                    </div>

                </div>
                <div align="center">
                     <span slot="footer" class="dialog-footer" >
                            <el-button  @click="selectTestPaperDialogVisible=false">关闭</el-button>
                            <el-button type="primary" @click="selectTestPaperSubmit">确 定</el-button>
                </span>
                </div>

            </div>

        </el-dialog>
        <div v-if="showGradeQueryDiv"><!--添加成绩主页面-->
            <div >
                <el-divider></el-divider>
                <el-form>
                    <el-row :gutter="3">
                        <el-col :span="8">
                            <el-form-item label="专业信息：">{{testPaper.major.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label=" 课程信息：">{{testPaper.course.name}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="3">
                        <el-col :span="8">
                            <el-form-item label=" 试卷名称：">  {{testPaper.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="试卷总分：">{{testPaper.totalScore}}分</el-form-item>

                        </el-col>
                    </el-row>
                </el-form>

                <el-row style="margin-top: 20px">
                    <el-col :span="24">
                        <div style="display: flex;justify-content: space-between;width: 80%">
                            <div>
                                选择班级：
                                <el-select v-model="searchValue2.classId"
                                           @change="selectClassChanged"
                                           placeholder="选择班级"
                                           size="small"
                                           style="width: 230px;margin-right: 5px">
                                    <el-option
                                            v-for="item in classes"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-button size="small" type="primary" @click="initStudentGrades">确定</el-button>
                                <span style="color: #909399">（该试卷下共有{{classTotalNum}}个班级）</span>
                            </div>
                            <div>
                                <el-input placeholder="输入学生姓名搜索..." prefix-icon="el-icon-search"
                                          clearable
                                          @clear="initStudentGrades"
                                          style="width: 200px;margin-right: 10px" v-model="searchValue2.name" @keydown.enter.native="initStudentGrades" ></el-input>
                                <el-button icon="el-icon-search" type="primary" @click="initStudentGrades" > 搜索</el-button>
                            </div>
                        </div>



                    </el-col>
                </el-row>
            </div>
            <!--成绩展示table-->
            <div style="margin-top: 20px">


                <div align="right" style="width: 80%">

                </div>

                <el-table
                        :data="studentGrades"
                        stripe
                        border
                        v-loading="loading2"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.7)"
                        :default-sort = "{prop: 'grade', order: 'descending'}"
                        style="width: 80%">
                    <el-table-column
                            type="index"
                            label="编号"
                            fixed
                            width="80"><!--   prop="id"-->
                        <template slot-scope="scope">
                            <span>{{(page2 - 1) * size2 + scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="班级"
                            width="180">
                        <template slot-scope="scope">
                            {{scope.row.clazz.name}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="学生姓名"
                            prop="studentName"
                            width="130">
                    </el-table-column>
                    <el-table-column
                            label="学号"
                            prop="studentNum"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="课程"
                            width="220">
                        <template slot-scope="scope">
                            {{testPaper.course.name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="成绩"
                            prop="grade"
                            width="100"
                            sortable>
                        <template slot-scope="scope">
                            {{scope.row.totalGrade}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showDetailGrade(scope.row)">详情</el-button>
                            <el-button size="mini" @click="showUpdateGrade(scope.row)">编辑</el-button>
                            <el-button size="mini" @click="deleteGrade">删除</el-button>
                        </template>
                    </el-table-column>


                </el-table>
                <div style="text-align: right;width: 80%;margin-top: 10px">
                    <el-pagination
                            background
                            @size-change="sizeChange2"
                            @current-change="currentChange2"
                            layout="sizes, prev, pager, next, jumper, total, slot"
                            :total="total2">
                    </el-pagination>
                </div>
            </div>

            <!--编辑成绩-->
            <el-dialog
                    title="修改学生成绩"
                    :center="true"
                    :visible.sync="showUpdateGradeVisible"
                    width="50%">
                <div style="padding-left: 80px;padding-right: 80px">
                    <div >
                        <el-divider content-position="left">学生基本信息</el-divider>
                        <el-row :gutter="2" style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    班级：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                {{className}}
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    学生姓名：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <el-select v-model="updateStudentGrade.studentName"
                                           placeholder="选择学生姓名"
                                           size="small"
                                           @change="selectStudentChange"
                                           style="width: 200px;margin-right: 5px">
                                    <el-option
                                            v-for="item in students"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                    </el-option>
                                </el-select>
                                <!-- <el-input size="small"
                                           style="width: 200px"
                                           v-model="updateStudentGrade.studentName">
                                 </el-input>-->
                            </el-col>
                        </el-row>
                        <el-row :gutter="2" style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    学号：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <el-input size="small"
                                          style="width: 200px"
                                          disabled
                                          v-model="updateStudentGrade.studentNum"
                                >
                                </el-input>
                            </el-col>
                        </el-row>

                        <el-row style="margin-bottom: 20px">
                            <el-col :span="5" :offset="5">
                                <div align="right">
                                    总成绩：
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <el-input size="small"
                                          style="width: 200px"
                                          v-model="updateStudentGrade.totalGrade">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-divider content-position="left">填写小题得分信息</el-divider>
                        <div>
                            已分配得分：<span style="color: red">{{allocationGrade}}</span>
                        </div>
                        <div  style="margin-left: 100px;margin-top: 20px">
                            <div v-for="(largeQue,indexi) in updateStudentGrade.largeQues" :key="indexi" style="margin-top: 20px;">
                                <div v-if="largeQue.queType!=null&&largeQue.queType!=''" style="margin-bottom: 10px"><!--大题标题-->
                                    第{{largeQueTypeNum[indexi]}}大题、<strong>{{largeQue.queType}}</strong>
                                    （共{{largeQue.smallQueGrade.length}}小题，共{{largeQue.largeQueScore}}分）
                                </div>
                                <div v-for="(smallQue,indexj) in largeQue.smallQueGrade" :key="indexj">
                                    <el-row style="margin-top: 10px">
                                        <el-col :span="4" style="" align="center">
                                            <el-tag  effect="plain">试题{{indexj+1}}.</el-tag><!--小题序号-->
                                        </el-col>
                                        <el-col :span="5" style="padding-top: 5px">
                                            原分值:{{smallQue.initScore}} 分
                                        </el-col>
                                        <el-col :span="8" style="">
                                            得分:
                                            <el-input
                                                    v-model="smallQue.queGrade"
                                                    size="small"
                                                    style="width: 100px"
                                            >
                                            </el-input>
                                            分
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                        <div align="center" style="margin-top: 20px">
                            <el-button size="small"  @click="showUpdateGradeVisible=false">取消</el-button>
                            <el-button size="small" type="primary" @click="doUpdateStudentGrade">保存</el-button>
                        </div>
                    </div>



                </div>

            </el-dialog>
            <!--成绩详情-->
            <el-drawer
                    title="成绩详情"
                    :visible.sync="drawer"
                    size='26%'
                    style="overflow: scroll"
                    :before-close="handleClose"
                    :with-header="false">
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
</template>

<script>
    export default {
        name: "GraQuery",
        data(){
            return{
                loading1:false,//试卷加载
                loading2:false,//学生成绩加载
                selectTestPaperDialogVisible:false,//选择试卷对话框
                showGradeQueryDiv:false,//显示成绩div
                showUpdateGradeVisible:false,//修改学生信息
                drawer: false,//成绩详情抽屉组件

                searchValue:{/*选择试卷条件搜索值*/
                    testPaperName:'',
                    createTeacherId:'',
                    courseId:'',
                    isTemplate:0,
                },
                courses:[],//选择课程
                classes:[],//班级列表
                postTeachers:[],
                studentGrades:[],//根据班级查询到的成绩列表
                testPaper:{},//存放选中的试卷信息
                testPapers:[],//存放表格中的试卷
                students:[],//当用户选择完班级，获取到学生的集合
                className:'',//存储临时班级的名称（添加成绩对话框显示）
                searchValue2:{//成绩查询条件选择
                    classId:'',
                    testPaperId:'',
                    name:'',
                },
                largeQueTypeNum:["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],
                updateStudentGrade:{//学生成绩信息修改
                    testPaperId:'',
                    courseId:'',
                    classId:'',
                    studentName:'',
                    studentNum:'',
                    totalGrade:'',
                    largeQues:[]
                },
                studentGradeInfo:'',//显示学生成绩详情
                gradeRank:'',//成绩排名
                grades:[],
                allStudentGrades:[],//这里存储所有学生的成绩
                total:0,
                page:1,
                size:10,
                radioId:'',//选中试卷行的id
                page2:1,//学生成绩页码
                size2:10,
                total2:10,


            }

        },mounted() {
            this.initCourse();
            this.initPostTeachers();
            var that=this;
            setTimeout(function () {//跳转到试题查询页面
                that.selectTestPaperDialogVisible=true;
            },500);


        },
        computed:{
            classTotalNum:function () {//试卷有多少个班级
                return Number(this.classes.length);
            },
            allocationGrade:function () {//已分配的成绩

                let total=0;
                for (let i = 0; i < this.updateStudentGrade.largeQues.length; i++) {
                    for (let j = 0; j < this.updateStudentGrade.largeQues[i].smallQueGrade.length; j++) {
                        total += Number(this.updateStudentGrade.largeQues[i].smallQueGrade[j].queGrade);
                    }
                }
                return total;
            },
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
        }
        ,methods:{
            handleClose(){//关闭成绩详情
                this.gradeRank='';
                this.allStudentGrades=[];
            },
            deleteGrade(){

            },
            clickQueryStudengGrade(){//输入姓名搜索学生信息

            },
            rowClick(row){//选中试卷表格数据的某一行，触发该事件

                this.testPaper=JSON.parse(JSON.stringify(row));//对象的深拷贝
                this.radioId=row.id;
            },
            getCurrentRow(data){
                alert();
                this.testPaper=data;
                //console.log(this.testPaper);
            },
            showDetailGrade(data){//成绩详情
               // alert();
                this.drawer=true;
                this.studentGradeInfo=data;
                //计算成绩排名
                //需要注意的是，成绩排名的时候，需要获取该班级下面所有学生的成绩信息，所以这里还需要发送一次请求
                let grade=this.studentGradeInfo.totalGrade;

                if(!window.sessionStorage.getItem("allStudentGrades")){//获取该班级下所有学生的成绩
                    let url = '/gra/input/allOnlyStudentGrades?';
                    if (this.searchValue2.classId) {
                        url += '&classId=' + this.searchValue2.classId;
                    }
                    if (this.testPaper.id) {
                        url += '&testPaperId=' + this.testPaper.id;
                    }
                    if (this.searchValue2.name!='') {
                        url += '&studentName=' + this.searchValue2.name;
                    }
                    this.getRequest(url).then(resp=>{

                        if(resp){
                            this.allStudentGrades=resp;
                            window.sessionStorage.setItem("allStudentGrades", JSON.stringify(resp));
                        }
                    })


                }else{
                    this.allStudentGrades=JSON.parse(window.sessionStorage.getItem("allStudentGrades"));
                }
                console.log(this.grades);
                for (let i = 0; i < this.allStudentGrades.length; i++) {
                   this.grades.push(this.allStudentGrades[i].totalGrade);
                }
                console.log(this.grades);

                let grades=this.sort(this.grades);//排序
                console.log(grades);
                let index=this.getArrayIndex(grades,grade);
                this.gradeRank=Number(index)+1;



            },
            getArrayIndex(arr,val){//获取数组的下标
              var i=arr.length;
              while(i--){
                  if(arr[i]===val){
                      return i;
                  }
              }
              return -1;

            },
            sort(arr){//数组排序
                var len=arr.length;
                for (let i = 0; i < len; i++) {
                    for (let j = 0; j < len - 1; j++) {
                        if(arr[j]>arr[j+1]){
                            var temp=arr[j+1];//元素交换
                            arr[j+1]=arr[j];
                            arr[j]=temp;
                        }
                    }
                }
                return arr;
            },
            showUpdateGrade(data){//成绩修改
                this.showUpdateGradeVisible=true;
               /* this.updateStudentGrade.studentName=data.studentName;
                this.updateStudentGrade.studentNum=data.studentNum;*/
               console.log(data);
               this.updateStudentGrade.studentNum=data.studentNum;
               this.updateStudentGrade.studentName=data.studentName;
               this.updateStudentGrade.totalGrade=data.totalGrade;
               this.updateStudentGrade.largeQues=data.largeQues;
            },
            initStudentGrades(){
                if(this.searchValue2.classId!=''){
                    this.loading2 = true;
                    let url = '/gra/input/allStudentGradesByClassId?page=' + this.page2 + '&size=' + this.size2;
                    if (this.searchValue2.classId) {
                        url += '&classId=' + this.searchValue2.classId;
                    }
                    if (this.testPaper.id) {
                        url += '&testPaperId=' + this.testPaper.id;
                    }
                    if (this.searchValue2.name!='') {
                        url += '&studentName=' + this.searchValue2.name;
                    }
                    // console.log(url)
                    this.getRequest(url).then(resp=>{
                        if(resp){
                            this.loading2 = false;
                            this.studentGrades=resp.data;
                            this.total2=resp.total;
                            //console.log(resp.data);
                        }
                    })
                }else{
                    this.$message.error('请先选择班级');
                }

            },
            initPostTeachers(){
                if(!window.sessionStorage.getItem("AllPostTeachers")){
                    this.getRequest('/pap/testPaper/getAllPostTeachers').then(resp => {
                        if (resp) {
                            this.postTeachers = resp;
                            window.sessionStorage.setItem("AllPostTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.postTeachers=JSON.parse(window.sessionStorage.getItem("AllPostTeachers"));
                }
            },
            initCourse(){//
                if(!window.sessionStorage.getItem("courses")){
                    this.getRequest('/baseinfo/course/all?classId='+'').then(resp => {
                        if (resp) {
                            this.courses = resp;
                            window.sessionStorage.setItem("courses", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.courses=JSON.parse(window.sessionStorage.getItem("courses"));
                }
            },
            initTestPaper(){

                this.loading1 = true;
                let url = '/gra/input/getAllTestPaper?page=' + this.page + '&size=' + this.size;
                if (this.searchValue.courseId) {
                    url += '&courseId=' + this.searchValue.courseId;
                }
                if (this.searchValue.createTeacherId) {
                    url += '&postTeacherId=' + this.searchValue.createTeacherId;
                }
                if (this.searchValue.isTemplate==0||this.searchValue.isTemplate==1) {
                    url += '&isTemplate=' + this.searchValue.isTemplate;
                }
                if (this.searchValue.testPaperName) {
                    url+="&name="+this.searchValue.testPaperName;
                }

                this.getRequest(url).then(resp=>{
                    if(resp){
                        this.loading1 = false;
                        /*  console.log(resp.data);*/
                        this.testPapers=resp.data;
                        this.total=resp.total;
                    }
                })

            },
            doUpdateStudentGrade(){//保存成绩信息
                // console.log(this.updateStudentGrade)
                //验证信息
                this.postRequest('/gra/input/updateStudentGrade',this.updateStudentGrade).then(resp=>{
                    if(resp){
                        this.initStudentGrades();
                        this.showUpdateGradeVisible=false;
                        //清空试题得分信息
                        this.emptyStudentInfo();
                    }
                })
            },
            emptyStudentInfo(){
                this.updateStudentGrade.studentName='';
                this.updateStudentGrade.studentNum='';
                this.updateStudentGrade.totalGrade='';
                this.updateStudentGrade.largeQues=[];
            },
            sizeChange(currentSize){//试卷选择中页码改变触发事件
                this.size=currentSize;
                this.initTestPaper();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initTestPaper();
            },
            sizeChange2(currentSize){//成绩表格页面
                this.size2=currentSize;
                this.initStudentGrades();
            },
            currentChange2(currentPage){//里面的参数为当前页
                this.page2=currentPage;
                this.initStudentGrades();
            },
            selectTestPaperSubmit(){//选择试卷后，点击确定后触发
                if(Object.keys(this.testPaper).length!=0){//这里是判断对象为空的方法
                    //根据试卷的id,查询出该试卷下有多少班级（），返回班级列表
                    this.initTestPaperClass();
                    this.selectTestPaperDialogVisible=false;
                    this.showGradeQueryDiv=true;
                }else{
                    this.$message.error('请先选择试卷');
                }
            },

            initTestPaperClass(){//初始化该试卷下有的班级
                this.getRequest('/gra/input/allTestPaperClass?testPaperId='+this.testPaper.id).then(resp => {
                    if (resp) {
                        this.classes = resp;
                       // console.log(this.classes);
                    }
                })
                this.selectClassChanged();
            },
            selectClassChanged(){//选择完班级信息，查询出该班级下的所有学生的成绩表
                //this.initStudentGrades();
                //给临时班级名称赋值，用于下一步的显示

                for (let i = 0; i < this.classes.length; i++) {
                    if(this.classes[i].id==this.searchValue2.classId){
                        this.className=this.classes[i].name;
                        break;
                    }
                }


            },
            selectStudentChange(){//选择完学生的姓名触发事件
               // console.log(this.students!=null);
                /* console.log(this.updateStudentGrade.studentName);*/
                //显示学生的学号
                if(this.students!=null){

                    for (let i = 0; i < this.students.length; i++) {
                        if(this.updateStudentGrade.studentName==this.students[i].name){
                           // console.log(this.students[i].studentName)
                            this.updateStudentGrade.studentNum=this.students[i].studentNum;
                            break;
                        }
                    }
                }



            },
            deleteHandler(data){
                this.$confirm('此操作将永久删除【'+data.studentName+'】成绩, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/gra/input/"+data.id).then(resp=>{
                        if(resp){
                            this.initStudentGrades();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        }
    }
</script>

<style >
    .el-drawer{

        overflow: scroll
    }
</style>