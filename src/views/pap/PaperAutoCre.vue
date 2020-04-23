<template>
    <div><!--自动组卷页面-->
        <el-divider>

        </el-divider>
        <div>
            <div>
                <el-steps :active="activeItemIndex" finish-status="success" simple>
                    <el-step title="1.填写试卷信息" ></el-step>
                    <el-step title="2.选择题型及范围"></el-step>
                    <el-step title="3.设置试题难度分布"></el-step>
                    <el-step title="4.生成试卷"></el-step>
                </el-steps>
                <div style="width: 98%;margin: 0 auto;margin-top: 20px">
                    <el-form>
                        <div v-show="activeItemIndex==0" style="display: flex;justify-content:center;margin-top:60px;margin-bottom:50px;"><!--第一步.填写试卷信息-->
                            <el-form
                                    ref="paperBaseInfo"
                                label-position="right"
                                label-width="100px"
                                >
                                <el-form-item label="试卷名称">
                                    <el-input size="medium"
                                              style="width: 300px"
                                              placeholder="请输入试卷的名称"
                                              v-model="updatePaperInfo.name">
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="学院:">
                                    <el-select v-model="updatePaperInfo.schoolId"
                                               @change="selectSchoolChanged"
                                               placeholder="选择学院"
                                               size="medium"
                                               style="width: 300px;">
                                        <el-option
                                                v-for="item in schools"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item >

                                <el-form-item label="专业:">
                                    <el-select
                                            placeholder="选择专业"
                                            size="medium"
                                            @change="selectMajorChanged"
                                            v-model="updatePaperInfo.majorId"
                                            style="width: 300px">
                                        <el-option
                                                v-for="item in majors"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item >
                                <el-form-item label="选择考试课程">
                                    <el-select v-model="updatePaperInfo.courseId"
                                               filterable
                                               prop="courseId"
                                               placeholder="请选择考试课程"
                                               @change="selectCourseChanged"
                                               size="large"
                                               style="width: 300px;">
                                        <el-option
                                                v-for="item in courses"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="学期:">
                                    <el-select
                                            placeholder="选择学期"
                                            size="medium"
                                            v-model="updatePaperInfo.semester"
                                            style="width: 300px">
                                        <el-option
                                                v-for="item in semester"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="试卷总分:">
                                    <el-input size="medium"
                                              style="width: 150px"
                                              placeholder="请输入试卷的总分"
                                              v-model="updatePaperInfo.totalScore">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="备注信息:">
                                    <el-input size="medium"
                                              type="textarea"
                                              style="width: 300px"
                                              placeholder="试卷备注信息"
                                              v-model="updatePaperInfo.remark">
                                    </el-input>
                                </el-form-item>


                            </el-form>
                        </div>
                        <div v-show="activeItemIndex==1" style="display: flex;justify-content: center;width: 90%">
                            <el-container>
                                <el-aside width="35%" style="border-right:1px dashed #dedede;padding-left: 100px;margin-top: 20px">

                                    <span style="text-align: left">选择考试范围：</span>
                                    <el-tree
                                            v-loading="loading"
                                            element-loading-text="正在加载数据..."
                                            element-loading-spinner="el-icon-loading"
                                            :default-expanded-keys="[-1]"
                                            show-checkbox
                                            node-key="id"
                                            :data="knows"
                                            :props="defaultProps"
                                            :expand-on-click-node="false"
                                            style="margin-top: 15px"
                                            ref="tree"><!--default-expanded-keys默认展开id为-1的节点，id为-1即为课程的节点-->
                                        <span class="custom-tree-node" style="display:flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }"><!--node为当前的元素，data为服务端返回的当前的jsonOjbect（node的数据）-->
                                        <span>{{ node.label }}</span><!--在这里node.label=data.name-->
                                        <!--<span>
                                            <el-button  icon="el-icon-plus" type="text"
                                                        @click="() => showAddKnowsView(node,data)">
                                            </el-button>
                                            &lt;!&ndash; 根节点不需要删除和重命名 &ndash;&gt;
                                            <el-button v-if="data.id !== -1"  icon="el-icon-edit" type="text"
                                                       @click="() => showEditKnowsView(node,data)">
                                            </el-button>
                                            <el-button v-if="data.id !== -1" style="color: #ff0000" icon="el-icon-delete"  type="text"
                                                       @click="() => deleteKnows( data)">
                                            </el-button>

                                        </span>-->
                                      </span>
                                    </el-tree>
                                </el-aside>
                                <el-main style="">
                                    <div><!--设置题型和分数分布-->
                                        <div style="margin-bottom: 15px;">请选择题型分布</div>
                                        <div>
                                            <el-form>
                                                <el-row style="margin-top: 20px"><!--单选题-->
                                                    <el-col :span="8">
                                                        单选题&nbsp;
                                                            <el-input-number
                                                                    v-model="paperQueNums.scSelectNums"
                                                                    :min="0"
                                                                    :max="paperQueNums.scAvailableNums"
                                                                    controls-position="right">
                                                            </el-input-number>&nbsp;&nbsp;道 ,

                                                    </el-col>
                                                    <el-col :span="8">
                                                        每题
                                                        <el-input
                                                                style="width: 100px;"
                                                                v-model="paperQueScores.scScore">
                                                        </el-input>分,
                                                    </el-col>
                                                    <el-col :span="8">
                                                        共有 <el-link type="primary" style="width: 20px">{{paperQueNums.scAvailableNums}}</el-link>道题可用
                                                    </el-col>
                                                </el-row>
                                                <el-row style="margin-top: 20px"><!--多选题-->
                                                    <el-col :span="8">
                                                        多选题&nbsp;
                                                            <el-input-number
                                                                    v-model="paperQueNums.mcSelectNums"
                                                                    :min="0"
                                                                    :max="paperQueNums.mcAvailableNums"
                                                                    controls-position="right">
                                                            </el-input-number>&nbsp;&nbsp;道 ,

                                                    </el-col>
                                                    <el-col :span="8">
                                                        每题
                                                        <el-input
                                                                style="width: 100px;"
                                                                v-model="paperQueScores.mcScore">
                                                        </el-input>分,
                                                    </el-col>
                                                    <el-col :span="8">
                                                        共有 <el-link type="primary" style="width: 20px">{{paperQueNums.mcAvailableNums}}</el-link>道题可用
                                                    </el-col>
                                                </el-row>
                                                <el-row style="margin-top: 20px"><!--多选题-->
                                                    <el-col :span="8">
                                                        判断题&nbsp;
                                                            <el-input-number
                                                                    v-model="paperQueNums.tfSelectNums"
                                                                    :min="0"
                                                                    :max="paperQueNums.tfAvailableNums"
                                                                    controls-position="right">
                                                            </el-input-number>&nbsp;&nbsp;道 ,

                                                    </el-col>
                                                    <el-col :span="8">
                                                        每题
                                                        <el-input
                                                                style="width: 100px;"
                                                                v-model="paperQueScores.tfScore">
                                                        </el-input>分,
                                                    </el-col>
                                                    <el-col :span="8">
                                                        共有 <el-link type="primary" style="width: 20px">{{paperQueNums.tfAvailableNums}}</el-link>道题可用
                                                    </el-col>
                                                </el-row>
                                                <el-row style="margin-top: 20px"><!--单选题-->
                                                    <el-col :span="8">
                                                        填空题&nbsp;
                                                            <el-input-number
                                                                    v-model="paperQueNums.fbSelectNums"
                                                                    :min="0"
                                                                    :max="paperQueNums.fbAvailableNums"
                                                                    controls-position="right">
                                                            </el-input-number>&nbsp;&nbsp;道 ,

                                                    </el-col>
                                                    <el-col :span="8">
                                                        每题
                                                        <el-input
                                                                style="width: 100px;"
                                                                v-model="paperQueScores.fbScore">
                                                        </el-input>分,
                                                    </el-col>
                                                    <el-col :span="8">
                                                        共有 <el-link type="primary" style="width: 20px">{{paperQueNums.fbAvailableNums}}</el-link>道题可用
                                                    </el-col>
                                                </el-row>
                                                <el-row style="margin-top: 20px"><!--填空题-->
                                                    <el-col :span="8">
                                                        简答题&nbsp;
                                                            <el-input-number
                                                                    v-model="paperQueNums.qaSelectNums"
                                                                    :min="0"
                                                                    :max="paperQueNums.qaAvailableNums"
                                                                    controls-position="right">
                                                            </el-input-number>&nbsp;&nbsp;道,

                                                    </el-col>
                                                    <el-col :span="8">
                                                        每题
                                                        <el-input
                                                                style="width: 100px;"
                                                                v-model="paperQueScores.qaScore">
                                                        </el-input>分,
                                                    </el-col>
                                                    <el-col :span="8">
                                                        共有 <el-link type="primary" style="width: 20px">{{paperQueNums.qaAvailableNums}}</el-link>道题可用
                                                    </el-col>
                                                </el-row>
                                            </el-form>

                                            <div style="margin-top: 20px;">
                                                <span>试卷共：100分</span> <span style="margin-left: 20px">已选择20分</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-main>
                            </el-container>
                        </div>
                        <div v-show="activeItemIndex==2" style="margin: 0 auto;width: 80%;">
                            <div style="height: 600px;margin-top: 20px">
                                <div style="margin-left: 100px">请选择试题难度分布</div>

                                <div align="right" style="width: 90%"><el-button type="primary" @click="addListRow" round>添加</el-button></div>

                                <el-table
                                        :data="paperDotDis"
                                        border
                                        style="width: 80%;margin-top: 15px;margin: 0 auto">
                                    <el-table-column label="题型" >
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.queType"
                                                       placeholder="请选择题型"
                                                       @change="queTypeChange2(scope.row)"
                                                       style="width: 180px;">
                                                <el-option
                                                        v-for="item in queTypes"
                                                        :key="item"
                                                        :label="item"
                                                        :value="item">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="试题难度" >
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.dot"
                                                       placeholder="请选择试题难度"
                                                       style="width: 180px;">
                                                <el-option
                                                        v-for="item in qlevel"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="题型试题总数"  prop="totalNum" header-align="center" align="center">
                                    </el-table-column>
                                    <el-table-column label="分配数量" header-align="center">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.queNum" @change="checkQueNum(scope.$index,scope.row)"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="80" header-align="center">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger" @click="deletePaperDotDis(scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </div>


                        </div>
                        <div v-show="activeItemIndex==3"><!--生成展示试卷-->
                            <div style="display: flex;justify-content: space-between;margin-top: 20px">
                                <div>
                                  <!--  <el-button size="small" type="primary" @click="createTestPaper()">生成试卷</el-button>-->
                                </div>

                            </div>
                            <div v-show="showTestPaper"
                                 v-loading="loading2"
                                 element-loading-text="正在生成试卷..."
                                 element-loading-spinner="el-icon-loading"
                                 style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto;height: 600px"
                            ><!--试卷展示-->
                                <el-divider content-position="left">试卷预览</el-divider>
                                <div ><!--试卷标题展示-->
                                    <div style="display: flex;justify-content: center">
                                        <h3>{{updatePaperInfo.semester}}</h3>
                                    </div>
                                    <div style="display: flex;justify-content: center">
                                        <h4>{{schoolName}}{{majorName}}{{courseName}}{{updatePaperInfo.name}}</h4>
                                    </div>

                                </div>
                                <!--单选题-->
                                <div v-show="testPaper.sclist&&(testPaper.sclist.length>0)">
                                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                        <strong>单选题</strong>
                                        <div v-for="(scque,index) in testPaper.sclist" style="margin-top: 20px">
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
                                <div v-show="testPaper.mclist&&(testPaper.mclist.length>0)" style="margin-top: 20px">
                                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                        <strong>多选题</strong>
                                        <div v-for="(mcque,index) in testPaper.mclist">
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
                                <div v-show="testPaper.tflist&&(testPaper.tflist.length>0)" style="margin-top: 20px">
                                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                        <strong>判断题</strong>
                                        <div v-for="(tfque,index) in testPaper.tflist">
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
                                <div v-show="testPaper.fblist&&(testPaper.fblist.length>0)" style="margin-top: 20px">
                                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                        <strong>填空题</strong>
                                        <div v-for="(fbque,index) in testPaper.fblist">
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
                                <div v-show="testPaper.qalist&&(testPaper.qalist.length>0)" style="margin-top: 20px">
                                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                                        <strong>简答题</strong>
                                        <div v-for="(qaque,index) in testPaper.qalist">
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
                            <div><!--底部信息-->
                                <div style="display: flex;justify-content: space-between;width:80%; margin-top: 20px" ><!--审核人-->

                                    <div style="margin-left: 100px">
                                        <el-form label-position="right"
                                                 label-width="150px">
                                            <el-form-item label="选择试卷审核人：">
                                                <el-select v-model="updatePaperInfo.checkTeacherId"
                                                           placeholder="请选择审核人(课程负责人）"
                                                           size="small"
                                                           filterable
                                                           style="width: 200px;">
                                                    <el-option
                                                            v-for="item in checkTeachers"
                                                            :key="item.id"
                                                            :label="item.name"
                                                            :value="item.id"><!--这里knows.children为课程列表-->
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                    <div>
                                        <div> <el-button size="small" type="primary" @click="exportPapToWord">下载试卷</el-button>
                                            <el-button size="small" type="primary" @click="submitTestPaper">保存提交</el-button>
                                        </div></div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
            <el-divider></el-divider>
            <div style="display: flex;align-items: center;justify-content: center;padding: 0px;margin: 0px;">
                   <span slot="footer" class="dialog-footer">
                    <router-link to="/pap/create" v-if="activeItemIndex==0" style="margin-right: 10px">
                        <el-button   type="primary" >返回</el-button>
                    </router-link>
                    <el-button @click="preStep" v-if="activeItemIndex!=0">{{activeItemIndex==3?'上一步':'上一步'}}</el-button>
                    <el-button v-if="activeItemIndex!=3" type="primary" @click="nextStep">{{activeItemIndex==2?'下一步':'下一步'}}</el-button>
                    <el-button v-if="activeItemIndex==3" type="primary" @click="nextStep">完成</el-button>
                   </span>
            </div>
        </div>
        <div></div>

    </div>
</template>

<script>
    export default {
        name: "PaperAutoCre",
        data(){
            return{
                loading:false,
                loading2:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                qlevel:[//试题难度下拉框选择值
                    {value:1,label:'简单'},{value:2,label: '适中'},{value:3,label:'偏难'},{value:4,label: '难'}
                ],
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
                knows:[],/*后端传递过来的章节列表*/
                activeItemIndex:1,
                courses:[],
                schools:[],
                majors:[],
                schoolName:'',//因为传到后端的是id,所以为了展示，这里设置临时的名称
                majorName:'',//因为传到后端的是id,所以为了展示，这里设置临时的名称
                courseName:'',//因为传到后端的是id,所以为了展示，这里设置临时的名称
                semester:[],/*学期*/
                checkTeachers:[],
                chapters:[],/*存放根据关键词查找的课程列表*/
                queTypes:['单选题','多选题','判断题','填空题','简答题'],
                updatePaperInfo:{//提交的试卷
                    courseId:'',
                    name:'',//存储试卷名称
                    remark:'',
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
                },
                paperQueNums:{//第三步，选择试卷题型的数量和可用的试题数
                    scSelectNums:0,
                    scAvailableNums:0,
                    mcSelectNums:0,
                    mcAvailableNums:0,
                    tfSelectNums:0,
                    tfAvailableNums:0,
                    fbSelectNums:0,
                    fbAvailableNums:0,
                    qaSelectNums:0,
                    qaAvailableNums:0,
                },
                paperQueScores:{//选择的试卷的数量
                    scScore:0,
                    mcScore:0,
                    tfScore:0,
                    fbScore:0,
                    qaScore:0,
                },
                paperDotDis:[{
                    queType:'',
                    dot:1,
                    queNum:0,
                    totalNum:''
                }],
                rules:{
                    courseId: [{required: true, message: '请选择课程', trigger: 'blur'}],
                    chapterId: [{required: true, message: '请选择章节', trigger: 'blur'}],
                    checkTeacherId:[{required: true, message: '请选择审核人', trigger: 'blur'}],
                },
                testPaper:{},//试卷对象，用于接收后端传来的数据
                showTestPaper:false,
            }
        },
        mounted() {
            this.initCourse();
            this.initSchools();
            this.initSemester();//学年学期
            this.initCheckTeachers();
        },
        methods:{
            createTestPaper(){//生成试卷
                this.showTestPaper=true;
                this.loading2=true;

            },
            initQueNums(){//根据课程获取题目类型和数量
                this.getRequest("/pap/create/getTypesNum?courseId="+this.updatePaperInfo.courseId).then(resp=> {
                    if (resp) {
                        this.testPaper=resp;
                        if(this.testPaper.sclist!=null){//初始化
                            this.paperQueNums.scAvailableNums=this.testPaper.sclist.length;
                        }
                        if(this.testPaper.mclist!=null){
                            this.paperQueNums.mcAvailableNums=this.testPaper.mclist.length;
                        }
                        if(this.testPaper.tflist!=null){
                            this.paperQueNums.tfAvailableNums=this.testPaper.tflist.length;
                        }
                        if(this.testPaper.fblist!=null){
                            this.paperQueNums.fbAvailableNums=this.testPaper.fblist.length;
                        }
                        if(this.testPaper.qalist!=null){
                            this.paperQueNums.qaAvailableNums=this.testPaper.qalist.length;
                        }
                    }
                })
            },
            checkQueNum(index,data){//第三步中，检查用户数输入的试题的分配数量是否超出上一步规定的试题类型数量
                if(this.paperDotDis){
                    if(this.paperDotDis.length>0&&this.paperDotDis[0].queType!=''){

                        let total=0;
                        var queType=this.paperDotDis[index].queType;
                        for (let i = 0; i < this.paperDotDis.length; i++) {
                            if(queType==this.paperDotDis[i].queType){
                                total+=Number(this.paperDotDis[i].queNum);
                            }
                        }
                        console.log(total);
                        if(queType=="单选题"&&total>Number(this.paperDotDis[index].totalNum)){
                            this.$message.error('超出范围，请重新计算后输入！');
                            this.$set(data,"queNum",0);
                        }
                        if(queType=="多选题"&&total>Number(this.paperDotDis[index].totalNum)){
                            this.$message.error('超出范围，请重新计算后输入！');
                            this.$set(data,"queNum",0);
                        }
                        if(queType=="填空题"&&total>Number(this.paperDotDis[index].totalNum)){
                            this.$message.error('超出范围，请重新计算后输入！');
                            this.$set(data,"queNum",0);
                        }
                        if(queType=="判断题"&&total>Number(this.paperDotDis[index].totalNum)){
                            this.$message.error('超出范围，请重新计算后输入！');
                            this.$set(data,"queNum",0);
                        }
                        if(queType=="简答题"&&total>Number(this.paperDotDis[index].totalNum)){
                            this.$message.error('超出范围，请重新计算后输入！');
                            this.$set(data,"queNum",0);
                        }
                    }
                }
            },
            queTypeChange2(data){

                if(data.queType=="单选题"){
                    data.totalNum=this.paperQueNums.scSelectNums;
                }
                if(data.queType=="多选题"){
                    data.totalNum=this.paperQueNums.mcSelectNums;
                }
                if(data.queType=="判断题"){
                    data.totalNum=this.paperQueNums.tfSelectNums;
                }
                if(data.queType=="填空题"){
                    data.totalNum=this.paperQueNums.fbSelectNums;
                }
                if(data.queType=="简答题"){
                    data.totalNum=this.paperQueNums.qaSelectNums;
                }
            },
            addListRow(){//添加试题难度分布表格行
                this.paperDotDis.push({
                    queType:'',
                    dot:'',
                    queNum:'',
                    totalNum:''
                })
            },
            deletePaperDotDis(index){//删除试题难度分布表格行
                this.paperDotDis.splice(index,1);
            },
            preStep() {
                this.activeItemIndex--;
            },
            nextStep() {

                this.activeItemIndex++;
                if (this.activeItemIndex == 1) {//根据课程获取章节和知识点信息
                    this.initKnows();
                    this.initQueNums();
                    this.$refs.paperBaseInfo.validate((valid) => {
                        if (valid) {

                        }else{
                            this.activeItemIndex--;
                        }
                    });

                    /* var that = this;
                     setTimeout(function () {//这里延迟1秒执行函数，因为需要用到sclist集合，所以得等后端传过来数据之后执行
                         that.drawBar();
                     },2000);*/

                    /* }*/

                }
                if(this.activeItemIndex==2){

                }
                if(this.activeItemIndex==3){
                    this.$confirm('是否生成试卷？, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                       this.createTestPaper();

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }


            },
            selectMajorChanged(){
                for (let i = 0; i < this.majors.length; i++) {
                    if(this.updatePaperInfo.majorId==this.majors[i].id){
                        this.majorName=this.majors[i].name;
                    }
                }
            },
            initCourse(){//初始化课程列表
                if(!window.sessionStorage.getItem("courses")){
                    this.getRequest('/baseinfo/course/all?classId='+this.updatePaperInfo.courseId).then(resp => {
                        if (resp) {
                            this.courses = resp;
                            window.sessionStorage.setItem("courses", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.courses=JSON.parse(window.sessionStorage.getItem("courses"));
                }
            },
            selectSchoolChanged(){//选择完学院后，触发
                this.initMajors();
                //为临时展示的学院名称赋值
                for (let i = 0; i < this.schools.length; i++) {
                    if(this.updatePaperInfo.schoolId==this.schools[i].id){
                        this.schoolName=this.schools[i].name;
                    }
                }
            },
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){

                        this.schools=resp;

                    }
                })
            },
            initCheckTeachers(){//
                if(!window.sessionStorage.getItem("checkTeachers")){
                    this.getRequest('/system/user/addQue').then(resp => {
                        if (resp) {
                            this.checkTeachers = resp;
                            window.sessionStorage.setItem("checkTeachers", JSON.stringify(resp));
                        }
                    })
                }else{
                    this.checkTeachers=JSON.parse(window.sessionStorage.getItem("checkTeachers"));
                }
            },
            initMajors(){
                this.getRequest("/baseinfo/major/?schoolId="+this.updatePaperInfo.schoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                    }
                })
            },
            initSemester(){
                this.getRequest("/baseinfo/semester/").then(resp=>{
                    if(resp){
                        this.semester=resp;
                    }
                })
            },
            initKnows(){
                this.loading=true;
                this.getRequest("/baseinfo/knows/all?courseId="+this.updatePaperInfo.courseId).then(resp=> {
                    if (resp) {
                        this.knows=resp;
                        this.loading = false;
                    }
                })
            },
            selectCourseChanged(){
                //用户选择完课程后，系统根据课程id，查询出章节，并显示课程的名称


                //2.初始化试题
                /*this.initQuestions();*/
                //3.初始化章节数组
               /* this.getRequest("/baseinfo/chapter/?courseId="+this.updatePaperInfo.courseId).then(resp=> {
                    if (resp) {
                        this.chapters=resp;
                    }
                })*/
                for (let i = 0; i < this.courses.length; i++) {
                    if(this.updatePaperInfo.courseId==this.courses[i].id){
                        this.courseName=this.courses[i].name;
                    }
                }
            },
        }
    }
</script>

<style >
    .el-aside {




    }
</style>