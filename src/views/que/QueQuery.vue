<template>
    <div><!--试卷查询-->
        <div><!--工具栏-->
            <el-divider></el-divider><!--分割线-->
            <div style="display: flex;justify-content: space-between">
                <div><!--第一行左侧搜索-->
                    <el-input placeholder="搜索试题内容..." prefix-icon="el-icon-search"
                              clearable
                              @clear="initQuestions"
                              style="width: 300px;margin-right: 10px" v-model="keyword" @keydown.enter.native="initQuestions" ></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="clickKeyQuery" > 搜索</el-button>
                </div>
                <div ><!--第一行右侧，批量导入，添加用户按钮-->
                    <router-link to="/que/input">
                        <el-button  icon="el-icon-plus" type="primary">添加试题</el-button>
                    </router-link>
                </div><!--第一行右侧，批量导入，添加用户按钮----end-->
            </div>
           <!--第二行，条件搜索div-->
            <div  style="border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin-top: 10px;"><!--条件搜索-->
                    <el-row>
                        <el-col :span="17" :offset="2" style="">
                            题型:
                            <el-select v-model="searchValue.queType"
                                       placeholder="请选择题型"
                                       @change="initQuestions"
                                       style="width: 180px;">
                                <el-option
                                        v-for="item in queTypes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                            难度:
                            <el-select v-model="searchValue.qlevel" placeholder="请选择试题难度"  style="width: 180px;margin-left: 3px;">
                                <el-option
                                        v-for="item in qlevel"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            所属课程：
                            <el-select v-model="searchValue.qcourse"
                                       placeholder="请选择课程"
                                       size="small"
                                       filterable
                                       style="width: 200px;"
                                       @change="selectCourseChanged"
                            >
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            所属章节：
                            <el-select v-model="searchValue.qchapter"
                                       placeholder="请选择章节"
                                       filterable
                                       size="small"
                                       style="width: 200px;">
                                <el-option
                                        v-for="item in chapters"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <el-button size="small" @click="emptySearchValue">重置</el-button>
                            <el-button size="small" icon="el-icon-search" type="primary" @click="queryQuestionsByCondition">搜索</el-button>
                        </el-col>

                    </el-row>
                </div>
          <!--第二行，条件搜索div-----end-->
            <div style="width: 80%;border:1px solid #f0f0f0;margin-left: auto;margin-right: auto" ><!--内容面板展示-->

                <div style="margin-bottom: 15px" v-show="searchValue.queType=='单选题'"><!--当选择题型框中为单选时，展示-->
                        <el-table
                                class="el-table"
                                :data="sclist">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div>
                                        <el-card class="box-card" shadow="hover">

                                        <div slot="header" class="clearfix"><!--1.标题-->
                                            <div>
                                                <span>题型：单选题</span>
                                                <el-divider direction="vertical"></el-divider>
                                                <span v-if="scope.row.dot">难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
                                                <span v-else>难度：</span><!--难度为空-->
                                               <!-- <el-divider direction="vertical"></el-divider>
                                                <span>草木深</span>-->
                                            </div>
                                        </div>
                                        <div @click="showSCHiddenView(scope.$index)"><!--2.题干-->
                                            <div class="stem">
                                                <span>{{scope.row.stem}}</span>
                                            </div>

                                            <!--C语言程序从main()函数开始执行，所以这个函数要可以写在______。-->
                                        </div>

                                        <div  class="text item" @click="showSCHiddenView(scope.$index)" ><!--3.选项-->
                                            <div>A. {{scope.row.option1}}</div>
                                            <div>B. {{scope.row.option2}} </div>
                                            <div>C. {{scope.row.option3}}</div>
                                            <div>D. {{scope.row.option4}}</div>
                                        </div>
                                        <div v-show="scViewStatus[scope.$index]" @click="showSCHiddenView(scope.$index)" ><!--4.隐藏详细信息-->
                                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                                            <div>
                                                <span>【知识点】</span>
                                                <el-tag v-for="(item,indexj) in scope.row.knows"  effect="plain">{{item.name}}</el-tag>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【答案】</span>
                                                <span>{{scope.row.answer}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【解析】</span>
                                                <span v-if="scope.row.analysis==null||scope.row.analysis==''">无</span>
                                                <span v-else>{{scope.row.analysis}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【录入者】</span><span>{{scope.row.teacher.name}}</span>
                                            </div>

                                        </div>
                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                            <el-button style="float: right; " icon="el-icon-delete" size="medium " @click="deleteSCQue(scope.row)" circle></el-button>
                                            <el-button style="float: right;margin-right: 5px" icon="el-icon-edit" size="medium " @click="editSCQuestionInfo(scope.row)" circle></el-button>
                                        </div>
                                        </el-card>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    <div style="display: flex;justify-content: flex-end">

                        <el-pagination
                                style="text-align: center;margin-top: 10px"
                                background
                                :hide-on-single-page="isShowPagination"
                                :total="total"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                >
                        </el-pagination>
                    </div>
                </div>
                <div style="margin-bottom: 15px" v-show="searchValue.queType=='多选题'"><!--当选择题型框中为单选时，展示-->


                        <el-table
                                class="el-table"
                                :data="mclist">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div>
                                        <el-card class="box-card" shadow="hover">

                                        <div slot="header" class="clearfix"><!--1.标题-->
                                            <div>
                                                <span>题型：多选题</span>
                                                <el-divider direction="vertical"></el-divider>

                                                <span v-if="scope.row.dot">难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
                                                <span v-else>难度：</span><!--根据dot的数值，对应到qlevel的label值-->
                                               <!-- <el-divider direction="vertical"></el-divider>
                                                <span>草木深</span>-->
                                            </div>
                                        </div>
                                        <div @click="showMCHiddenView(scope.$index)"><!--2.题干-->
                                            <div class="stem">
                                                <span>{{scope.row.stem}}</span>
                                            </div>

                                            <!--C语言程序从main()函数开始执行，所以这个函数要可以写在______。-->
                                        </div>

                                        <div  class="text item" @click="showMCHiddenView(scope.$index)" ><!--3.选项-->

                                            <div v-for="(item,indexj) in scope.row.options" :key="indexj">{{optionChar[indexj]}} {{item.optionContent}}</div><!--遍历多选题选项-->

                                        </div>
                                        <div v-show="mcViewStatus[scope.$index]" @click="showMCHiddenView(scope.$index)" ><!--4.隐藏详细信息-->
                                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                                            <div>
                                                <span>【知识点】</span>
                                                <el-tag v-for="(item,indexj) in scope.row.knows"  effect="plain">{{item.name}}</el-tag>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【答案】</span>
                                                <span>{{scope.row.answer}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【解析】</span>
                                                <span v-if="scope.row.analysis==null||scope.row.analysis==''">无</span>
                                                <span v-else>{{scope.row.analysis}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【录入者】</span><span>{{scope.row.teacher.name}}</span>
                                            </div>

                                        </div>
                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                            <el-button style="float: right; " icon="el-icon-delete" size="medium " @click="deleteMCQue(scope.row)" circle></el-button>
                                            <el-button style="float: right;margin-right: 5px" icon="el-icon-edit" size="medium " @click="editMCQuestionInfo(scope.row)" circle></el-button>
                                        </div>
                                        </el-card>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    <div style="display: flex;justify-content: flex-end">

                        <el-pagination
                                style="text-align: center;margin-top: 10px"
                                background
                                :hide-on-single-page="isShowPagination"
                                :total="total"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                >
                        </el-pagination>
                    </div>
                </div>
                <div style="margin-bottom: 15px" v-show="searchValue.queType=='判断题'"><!--当选择题型框中为单选时，展示-->
                        <el-table
                                class="el-table"
                                :data="tflist">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div>
                                        <el-card class="box-card" shadow="hover">

                                        <div slot="header" class="clearfix"><!--1.标题-->
                                            <div>
                                                <span>题型：判断题</span>
                                                <el-divider direction="vertical"></el-divider>

                                                <span v-if="scope.row.dot">难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
                                                <span v-else>难度：</span><!--根据dot的数值，对应到qlevel的label值-->
                                               <!-- <el-divider direction="vertical"></el-divider>
                                                <span>草木深</span>-->
                                            </div>
                                        </div>
                                        <div @click="showTFHiddenView(scope.$index)"><!--2.题干-->
                                            <div class="stem">
                                                <span>{{scope.row.stem}}</span>
                                            </div>

                                            <!--C语言程序从main()函数开始执行，所以这个函数要可以写在______。-->
                                        </div>

                                        <!--<div  class="text item" @click="showTFHiddenView(scope.$index)" >&lt;!&ndash;3.选项&ndash;&gt;

                                            <div v-for="(item,indexj) in scope.row.options">{{optionChar[indexj]}} {{item.optionNum}}</div>&lt;!&ndash;遍历多选题选项&ndash;&gt;

                                        </div>-->
                                        <div v-show="tfViewStatus[scope.$index]" @click="showTFHiddenView(scope.$index)" ><!--4.隐藏详细信息-->
                                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                                            <div>
                                                <span>【知识点】</span>
                                                <el-tag v-for="(item,indexj) in scope.row.knows"  effect="plain">{{item.name}}</el-tag>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【答案】</span>
                                                <span>{{scope.row.answer}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【解析】</span>
                                                <span v-if="scope.row.analysis==null||scope.row.analysis==''">无</span>
                                                <span v-else>{{scope.row.analysis}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【录入者】</span><span>{{scope.row.teacher.name}}</span>
                                            </div>

                                        </div>
                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                            <el-button style="float: right; " icon="el-icon-delete" size="medium " @click="deleteTFQue(scope.row)" circle></el-button>
                                            <el-button style="float: right;margin-right: 5px" icon="el-icon-edit" size="medium " @click="editTFQuestionInfo(scope.row)" circle></el-button>
                                        </div>
                                        </el-card>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    <div style="display: flex;justify-content: flex-end">

                        <el-pagination
                                style="text-align: center;margin-top: 10px"
                                background
                                :hide-on-single-page="isShowPagination"
                                :total="total"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                >
                        </el-pagination>
                    </div>
                </div>
                <div style="margin-bottom: 15px" v-show="searchValue.queType=='填空题'"><!--当选择题型框中为单选时，展示-->
                        <el-table
                                class="el-table"
                                :data="fblist">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div>
                                        <el-card class="box-card" shadow="hover">

                                        <div slot="header" class="clearfix"><!--1.标题-->
                                            <div>
                                                <span>题型：填空题</span>
                                                <el-divider direction="vertical"></el-divider>

                                                <span v-if="scope.row.dot">难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
                                                <span v-else>难度：</span>
                                               <!-- <el-divider direction="vertical"></el-divider>
                                                <span>草木深</span>-->
                                            </div>
                                        </div>
                                        <div @click="showFBHiddenView(scope.$index)"><!--2.题干-->
                                            <div class="stem">
                                                <span>{{scope.row.stem}}</span>
                                            </div>

                                            <!--C语言程序从main()函数开始执行，所以这个函数要可以写在______。-->
                                        </div>

                                       <!-- <div  class="text item" @click="showMCHiddenView(scope.$index)" >&lt;!&ndash;3.选项&ndash;&gt;

                                            <div v-for="(item,indexj) in scope.row.options">{{optionChar[indexj]}} {{item.optionNum}}</div>&lt;!&ndash;遍历多选题选项&ndash;&gt;

                                        </div>-->
                                        <div v-show="fbViewStatus[scope.$index]" @click="showFBHiddenView(scope.$index)" ><!--4.隐藏详细信息-->
                                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                                            <div>
                                                <span>【知识点】</span>
                                                <el-tag v-for="(item,indexj) in scope.row.knows"  effect="plain">{{item.name}}</el-tag>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【答案】</span>
                                                <span>{{scope.row.answer}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【解析】</span>
                                                <span v-if="scope.row.analysis==null||scope.row.analysis==''">无</span>
                                                <span v-else>{{scope.row.analysis}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【录入者】</span><span>{{scope.row.teacher.name}}</span>
                                            </div>

                                        </div>
                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                            <el-button style="float: right; " icon="el-icon-delete" size="medium " @click="deleteFBQue(scope.row)" circle></el-button>
                                            <el-button style="float: right;margin-right: 5px" icon="el-icon-edit" size="medium " @click="editFBQuestionInfo(scope.row)" circle></el-button>
                                        </div>
                                        </el-card>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    <div style="display: flex;justify-content: flex-end">

                        <el-pagination
                                style="text-align: center;margin-top: 10px"
                                background
                                :hide-on-single-page="isShowPagination"
                                :total="total"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                >
                        </el-pagination>
                    </div>
                </div>
                <div style="margin-bottom: 15px" v-show="searchValue.queType=='简答题'"><!--当选择题型框中为单选时，展示-->
                        <el-table
                                class="el-table"
                                :data="qalist">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div>
                                        <el-card class="box-card" shadow="hover">

                                        <div slot="header" class="clearfix"><!--1.标题-->
                                            <div>
                                                <span>题型：简答题</span>
                                                <el-divider direction="vertical"></el-divider>

                                                <span v-if="scope.row.dot">难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
                                                <span v-else>难度：</span><!--根据dot的数值，对应到qlevel的label值-->
                                               <!-- <el-divider direction="vertical"></el-divider>
                                                <span>草木深</span>-->
                                            </div>
                                        </div>
                                        <div @click="showQAHiddenView(scope.$index)"><!--2.题干-->
                                            <div class="stem">
                                                <span>{{scope.row.stem}}</span>
                                            </div>

                                            <!--C语言程序从main()函数开始执行，所以这个函数要可以写在______。-->
                                        </div>


                                        <div v-show="qaViewStatus[scope.$index]" @click="showQAHiddenView(scope.$index)" ><!--4.隐藏详细信息-->
                                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                                            <div>
                                                <span>【知识点】</span>
                                                <el-tag v-for="(item,indexj) in scope.row.knows"  effect="plain">{{item.name}}</el-tag>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【答案】</span>
                                                <span>{{scope.row.answer}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【解析】</span>
                                                <span v-if="scope.row.analysis==null||scope.row.analysis==''">无</span>
                                                <span v-else>{{scope.row.analysis}}</span>
                                            </div>
                                            <div style="margin-top: 5px">
                                                <span>【录入者】</span><span>{{scope.row.teacher.name}}</span>
                                            </div>

                                        </div>
                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                            <el-button style="float: right; " icon="el-icon-delete" size="medium " @click="deleteQAQue(scope.row)" circle></el-button>
                                            <el-button style="float: right;margin-right: 5px" icon="el-icon-edit" size="medium " @click="editQAQuestionInfo(scope.row)" circle></el-button>
                                        </div>
                                        </el-card>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    <div style="display: flex;justify-content: flex-end">

                        <el-pagination
                                style="text-align: center;margin-top: 10px"
                                background
                                :hide-on-single-page="isShowPagination"
                                :total="total"
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                                >
                        </el-pagination>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "QueQuery",
        data(){
            return{
                isShowPagination:false,
                showQueDetailInfo:false,
                keyword:'',
                queTypes:['单选题','多选题','判断题','填空题','简答题'],
                searchValue:{
                    queType:'单选题',
                    qlevel:'',//搜索条件试题难度
                    qcourse:'',//搜索条件试题课程
                    qchapter:''//搜索条件试题章节
                },
                qlevel:[//试题难度下拉框选择值
                    {value:1,label:'简单'},{value:2,label: '适中'},{value:3,label:'偏难'},{value:4,label: '难'}
                ],
                courses:[],/*存放根据关键词查找的课程列表*/
                chapters:[],/*存放根据关键词查找的课程列表*/
                sclist:[
                    {
                        id:1,
                        stem:'C语言程序的三种基本结构是______。',
                        option1:'顺序结构、嵌套结构、循环结构',
                        option2:'循环结构、递归结构、顺序结构',
                        option3:'选择结构、循环结构、顺序结构',
                        option4:'分支结构、顺序结构、构嵌套结构',
                        answer:'C',
                        analysis:'',
                        dot:1,
                        teacher:{
                            id:1,
                            name:'系统管理员'
                        },
                        knows:[{
                            id:1,
                            name:'循环结构'
                        },{
                            id:2,
                            name:'分支结构'
                        }]

                    },
                    {
                        id:1,
                        stem:'C语言程序的三种基本结构是______。',
                        option1:'顺序结构、嵌套结构、循环结构',
                        option2:'循环结构、递归结构、顺序结构',
                        option3:'选择结构、循环结构、顺序结构',
                        option4:'分支结构、顺序结构、构嵌套结构',
                        answer:'C',
                        analysis:'',
                        dot:1,
                        teacher:{
                            id:1,
                            name:'系统管理员'
                        },
                        knows:[{
                            id:1,
                            name:'循环结构'
                        }]

                    },

                ],
                mclist:[],//存放后台查询到的不同类型的试题列表
                tflist:[],
                fblist:[],
                qalist:[],
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],
                scViewStatus:[],//这里主要用来存放每个试题的隐藏div的标记
                mcViewStatus:[],
                tfViewStatus:[],
                fbViewStatus:[],
                qaViewStatus:[],
                total:0,/*设置查询的总记录数*/
                page:1,//设置第几页
                size:10,//设置每页的数据


            }

        },mounted() {
            this.initCourses();

            this.initShowCardHidden();

            this.initQuestions();

        },



        methods:{
            selectCourseChanged(){
                //获取章节列表
                this.getRequest("/baseinfo/chapter/?courseId="+this.searchValue.qcourse).then(resp=> {
                    if (resp) {
                        this.chapters=resp;
                    }
                })
            },
            sizeChange(currentSize){
                this.size=currentSize;
                this.initQuestions();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initQuestions();
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
            initQuestions(){//初始化试题列表
                //首先获取题型
                if(this.searchValue.queType=='单选题'){

                    let url = '/question/scinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qlevel) {//条件搜索
                        url += '&dot=' + this.searchValue.qlevel;
                    }else if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.searchValue.qchapter) {
                        url += '&chapterId=' + this.searchValue.qchapter;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){
                            this.loading = false;
                            this.sclist=resp.data;
                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='多选题'){
                    let url = '/question/mcinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qlevel) {//条件搜索
                        url += '&dot=' + this.searchValue.qlevel;
                    }else if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.searchValue.qchapter) {
                        url += '&chapterId=' + this.searchValue.qchapter;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.mclist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='判断题'){
                    let url = '/question/tfinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qlevel) {//条件搜索
                        url += '&dot=' + this.searchValue.qlevel;
                    }else if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.searchValue.qchapter) {
                        url += '&chapterId=' + this.searchValue.qchapter;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.tflist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='填空题'){
                    let url = '/question/fbinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qlevel) {//条件搜索
                        url += '&dot=' + this.searchValue.qlevel;
                    }else if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.searchValue.qchapter) {
                        url += '&chapterId=' + this.searchValue.qchapter;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.fblist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='简答题'){
                    let url = '/question/qainput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qlevel) {//条件搜索
                        url += '&dot=' + this.searchValue.qlevel;
                    }else if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.searchValue.qchapter) {
                        url += '&chapterId=' + this.searchValue.qchapter;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.qalist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }

            },
            initQuestions2(){//通过名称搜索试题
                //首先获取题型
                if(this.searchValue.queType=='单选题'){
                    if(this.searchValue.qcourse==null||this.searchValue.qcourse==''){
                        this.$message.error('请先选择课程！');
                        return;
                    }
                    let url = '/question/scinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.keyword!='') {
                        url += '&stem=' + this.keyword;
                    }

                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){
                            this.loading = false;
                            this.sclist=resp.data;
                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='多选题'){
                    if(this.searchValue.qcourse==null||this.searchValue.qcourse==''){
                        this.$message.error('请先选择课程！');
                        return;
                    }
                    let url = '/question/mcinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.keyword!='') {
                        url += '&stem=' + this.keyword;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.mclist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='判断题'){
                    if(this.searchValue.qcourse==null||this.searchValue.qcourse==''){
                        this.$message.error('请先选择课程！');
                        return;
                    }
                    let url = '/question/tfinput/?page=' + this.page + '&size=' + this.size;
                   if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.keyword!='') {
                        url += '&stem=' + this.keyword;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.tflist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='填空题'){
                    if(this.searchValue.qcourse==null||this.searchValue.qcourse==''){
                        this.$message.error('请先选择课程！');
                        return;
                    }
                    let url = '/question/fbinput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.keyword!='') {
                        url += '&stem=' + this.keyword;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.fblist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }else if(this.searchValue.queType=='简答题'){
                    if(this.searchValue.qcourse==null||this.searchValue.qcourse==''){
                        this.$message.error('请先选择课程！');
                        return;
                    }
                    let url = '/question/qainput/?page=' + this.page + '&size=' + this.size;
                    if (this.searchValue.qcourse) {
                        url += '&courseId=' + this.searchValue.qcourse;
                    }
                    if (this.keyword!='') {
                        url += '&stem=' + this.keyword;
                    }
                    console.log("url:",url);
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.qalist=resp.data;

                            this.total=resp.total;
                            if(this.total>10){
                                this.isShowPagination=true;
                            }
                        }
                    })
                }

            },clickKeyQuery(){//关键词搜索
                this.initQuestions2();
                this.initShowCardHidden();
            },queryQuestionsByCondition(){//条件查询
                this.initQuestions();
                this.initShowCardHidden();
            },
            initShowCardHidden(){//初始化试题隐藏标记数组，构造一个和list集合一样大的数组，里面都为false的boolean类型
                if(this.searchValue.queType=='单选题'){
                    var scViewStatus1=new Array(this.sclist.length);
                    for(var i=0;i<this.sclist.length;i++){
                        scViewStatus1[i]=false;
                    }
                    this.scViewStatus=scViewStatus1;
                }
                else if(this.searchValue.queType=='多选题'){
                    var mcViewStatus1=new Array(this.mclist.length);
                    for(var i=0;i<this.mclist.length;i++){
                        mcViewStatus1[i]=false;
                    }
                    this.mcViewStatus=mcViewStatus1;
                }
                else if(this.searchValue.queType=='判断题'){
                    var tfViewStatus1=new Array(this.tflist.length);
                    for(var i=0;i<this.tflist.length;i++){
                        tfViewStatus1[i]=false;
                    }
                    this.tfViewStatus=tfViewStatus1;
                }
                else if(this.searchValue.queType=='填空题'){
                    var fbViewStatus1=new Array(this.fblist.length);
                    for(var i=0;i<this.fblist.length;i++){
                        fbViewStatus1[i]=false;
                    }
                    this.fbViewStatus=fbViewStatus1;
                }
                else if(this.searchValue.queType=='简答题'){
                    var qaViewStatus1=new Array(this.qalist.length);
                    for(var i=0;i<this.qalist.length;i++){
                        qaViewStatus1[i]=false;
                    }
                    this.qaViewStatus=qaViewStatus1;
                }


            },
            showSCHiddenView(index){
                var status=!this.scViewStatus[index]
                this.$set(this.scViewStatus,index,status);
            },
            showMCHiddenView(index){
                var status=!this.mcViewStatus[index]
                this.$set(this.mcViewStatus,index,status);
            },
            showTFHiddenView(index){
                var status=!this.tfViewStatus[index]
                this.$set(this.tfViewStatus,index,status);
            },
            showFBHiddenView(index){
                var status=!this.fbViewStatus[index]
                this.$set(this.fbViewStatus,index,status);
            },
            showQAHiddenView(index){
                var status=!this.qaViewStatus[index]
                this.$set(this.qaViewStatus,index,status);
            },
            deleteSCQue(data){
                this.$confirm('此操作将永久删除该单选题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/question/scinput/"+data.id).then(resp=>{
                        if(resp){
                            this.initQuestions();
                            this.initShowCardHidden();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteMCQue(data){

                this.$confirm('此操作将永久删除该多选题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.deleteRequest("/question/mcinput/"+data.id).then(resp=>{
                        if(resp){
                            this.initQuestions();
                            this.initShowCardHidden();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteTFQue(data){
                this.$confirm('此操作将永久删除该判断题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/question/tfinput/"+data.id).then(resp=>{
                        if(resp){
                            this.initQuestions();
                            this.initShowCardHidden();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteFBQue(data){
                this.$confirm('此操作将永久删除该填空题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/question/fbinput/"+data.id).then(resp=>{
                        if(resp){
                            this.initQuestions();
                            this.initShowCardHidden();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteQAQue(data){
                this.$confirm('此操作将永久删除该简答题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/question/qainput/"+data.id).then(resp=>{
                        if(resp){
                            this.initQuestions();
                            this.initShowCardHidden();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            editSCQuestionInfo(data){//点击编辑按钮，跳转到编辑页面
                this.$router.push({
                    path: '/que/input',
                    name:'试题录入',
                    params: {
                        queType:'sc',
                        scMainAllQueInfo: JSON.stringify(data),
                    }
                })

            },
            editMCQuestionInfo(data){
                this.$router.push({
                    path: '/que/input',
                    name:'试题录入',
                    params: {
                        queType:'mc',
                        mcMainAllQueInfo: JSON.stringify(data),
                    }
                })
            },
            editTFQuestionInfo(data){
                this.$router.push({
                    path: '/que/input',
                    name:'试题录入',
                    params: {
                        queType:'tf',
                        tfMainAllQueInfo: JSON.stringify(data),
                    }
                })
            },
            editFBQuestionInfo(data){
                this.$router.push({
                    path: '/que/input',
                    name:'试题录入',
                    params: {
                        queType:'fb',
                        fbMainAllQueInfo: JSON.stringify(data),
                    }
                })
            },
            editQAQuestionInfo(data){
                this.$router.push({
                    path: '/que/input',
                    name:'试题录入',
                    params: {
                        queType:'qa',
                        qaMainAllQueInfo: JSON.stringify(data),
                    }
                })
            },

            emptySearchValue(){
                    this.searchValue.qcourse='';
                    this.searchValue.qchapter='';
                    this.searchValue.qlevel='';
                    this.searchValue.queType='单选题';
            }
        }
    }
</script>

<style >

    .stem span{
        white-space:pre
    }

</style>