<template>
    <div><!--试卷库管理-->
        <div>
            <!-- <h2 style="font-family:'黑体'">试卷模板管理</h2>-->
            <el-divider></el-divider>
            <div style="margin-left: auto;margin-right: auto">

                <div>
                    <el-input placeholder="输入名称搜索试卷..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initTestPaper"
                              style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initTestPaper" ></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="initTestPaper" > 搜索</el-button>
                </div>
                <div style="width:92%;border:1px solid #f0f0f0;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;" ><!--内容面板展示-->
                    <!-- <div style="margin-top: 20px">-->
                    <el-row>
                        <el-col :span="22">
                            课程：
                            <el-select v-model="searchValue.courseId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择考试课程"
                                       @change="selectCourseChanged"
                                       size="small"
                                       style="width: 240px;">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            组卷人：
                            <el-select v-model="searchValue.createTeacherId"
                                       filterable
                                       prop="courseId"
                                       placeholder="请选择组卷人"
                                       @change="selectTeacherChanged"
                                       size="small"
                                       style="width: 200px;">
                                <el-option
                                        v-for="item in postTeachers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            组卷方式：
                            <el-select v-model="searchValue.createPaperType"
                                       prop="courseId"
                                       placeholder="请选择组卷方式"
                                       size="small"
                                       style="width: 200px;"><!--0代表手动组卷，1代表自动组卷-->
                                <el-option
                                        v-for="item in createPaperTypes"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-button size="small" @click="emptySearchValue" style="margin-left: 5px">重置</el-button>
                            <el-button size="small"  type="primary" icon="el-icon-search" @click="initTestPaper('advanced')">
                                条件搜索</el-button>
                        </el-col>
                        <el-col :span="2">
                            <div align="right">
                                <router-link to="/pap/create">
                                    <el-button size="small" type="primary" icon="el-icon-plus" >
                                        题库组卷
                                    </el-button>
                                </router-link>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <!--添加试卷模板对话框---end-->

                <div style="margin-top: 20px">
                    <el-table
                            :data="testPapers"
                            stripe
                            border
                            v-loading="loading1"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(0, 0, 0, 0.7)"
                            style="width: 92%"
                            :default-sort = "{prop: 'createTime', order: 'descending'}"
                    >
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
                                label="试卷名称"
                                prop="name"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                label="组卷方式"
                                prop="paperType"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.paperType==0">手工组卷</span>
                                <span v-else>自动组卷</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="课程"
                                prop="course"
                                width="200">
                            <template slot-scope="scope">
                                {{scope.row.course.name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="学年学期"
                                prop="semester"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="teacher"
                                label="创建人"
                                width="100">
                            <template slot-scope="scope">
                                {{scope.row.teacher.name}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="日期"
                                prop="createTime"
                                sortable
                                width="180">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="showTestPaperInfoView(scope.row)">查看</el-button>
                                <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
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
                   <el-dialog
                            title="试卷详情"
                            :visible.sync="detailTestPaperDialogVisible"
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaperLib",
        data(){
            return{
                title:'添加试卷模板',
                loading1:false,
                dialogVisible:false,
                detailTestPaperDialogVisible:false,
                keyword:'',
                schools:[],
                courses:[],
                teachers:[],
                majors:[],
                semester:[],
                queTypes:[],
                chapters:[],
                postTeachers:[],
                knows:[],//后端根据课程id传过来的章节列表（包含知识点）
                testPapers:[],//后端传来的试卷列表（包含自动组卷和手动组卷）
                searchValue:{//条件搜索
                    courseId:'',
                    createTeacherId:'',
                    createPaperType:'',
                },
                updateTestPaperInfo:{},
                total:0,
                page:1,
                size:10,
                createPaperTypes:[{id:0,name:'手动组卷'},{id:1,name:'自动组卷'}],
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
                updateHandTestPaperInfo:{//当用户编辑的时候，传到修改页面的对象信息(手工组卷）
                    courseId:'',
                    name:'',//存储试卷名称
                    schoolId:'',
                    majorId:'',
                    semester:'',
                    checkTeacherId:'',
                    totalScore:'',
                    passScore:'',
                    queTypes:'',//试题类型
                    chapterIds:'',//所有章节
                    knowIds:'',//所有知识点
                    sclist:[],
                    mclist:[],
                    tflist:[],
                    fblist:[],
                    qalist:[],
                    scScore:'',
                    mcScore:'',
                    fbScore:[],
                    tfScore:'',
                    qaScore:[]
                }
            }
        },
        mounted() {
            this.initTestPaper();
            this.initCourses();
            this.initPostTeachers();
        },computed:{

        },methods:{
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
            initCourses(){
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
            initPostTeachers(){
                if(!window.sessionStorage.getItem("postTeachers")){
                    this.getRequest('/pap/testPaper/getPostTeachers').then(resp => {
                        if (resp) {
                            this.postTeachers = resp;
                            window.sessionStorage.setItem("postTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.postTeachers=JSON.parse(window.sessionStorage.getItem("postTeachers"));
                }
            },
            selectTestPaperCreateTypeChanged(){//选择完组卷人触发事件

            },
            selectCourseChanged(){//选择课程后触发

            },
            selectTeacherChanged(){

            },
            emptySearchValue(){//清空搜索条件
                this.searchValue.courseId='';
                this.searchValue.createTeacherId='';
                this.searchValue.createPaperType='';
            },
            showTestPaperInfoView(data){
                this.detailTestPaperDialogVisible=true;
                this.updateTestPaperInfo=data;
                console.log(this.updateTestPaperInfo);

                  /*  this.$router.push({//跳转到页面详情页面，把对象转为字符串
                        path: '/pap/library/info',
                        name:'试卷详情',
                        params: {
                            updateTestPaperInfo: JSON.stringify(data),
                        }
                    })*/

            },
            showEditView(data){//编辑试卷
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                if(userObj.id!=data.teacher.id){
                    this.$alert('您没有修改权限！试卷必须由创建者修改', '提示', {
                        confirmButtonText: '确定',

                        callback: action => {
                            /*  this.$message({
                                  type: 'warning',
                                  message: `action: ${ action }`
                              });*/
                        }
                    });
                    /* this.$notify({
                         title: '提示',
                         message: '您没有修改权限！模板必须由创建者修改',
                         type: 'warning'
                     });*/
                }else{
                    //这里需要跳转到修改页面，试卷分为手动组卷和自动组卷，所以这里需要进行判断

                        this.$router.push({//跳转到页面详情页面，把对象转为字符串
                            path: '/pap/library/update',
                            name: '试卷修改',
                            params: {
                                updateTestPaperInfo: JSON.stringify(data),
                            }
                        });


                }
            }
            ,deleteHandler(data){//删除试卷
                let user=window.sessionStorage.getItem("user");
                let userObj=JSON.parse(user);//这里把用户的json消息转为对象
                if(userObj.id!=data.teacher.id){
                    this.$alert('您没有删除权限！试卷必须由创建者进行修改', '提示', {
                        confirmButtonText: '确定',

                        callback: action => {
                            /*  this.$message({
                                  type: 'warning',
                                  message: `action: ${ action }`
                              });*/
                        }
                    });
                    /* this.$notify({
                         title: '提示',
                         message: '您没有修改权限！模板必须由创建者修改',
                         type: 'warning'
                     });*/
                }else{
                    this.$confirm('此操作将永久删除【'+data.name+'】试卷模板, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/pap/testPaper/"+data.id).then(resp=>{
                            if(resp){
                                this.initTestPaper();
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initTestPaper();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initTestPaper();
            }
        }
    }
</script>

<style scoped>

</style>