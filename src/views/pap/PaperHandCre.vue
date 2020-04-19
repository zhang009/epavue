<template>
    <div>
        <el-divider></el-divider>
        <!--<h2>手工组卷</h2>-->
        <div>
            <div >
                <el-steps :active="activeItemIndex" finish-status="success" simple>
                    <el-step title="选择考试课程" ></el-step>
                    <el-step title="手工选题"></el-step>
                    <el-step title="设置参数"></el-step>
                    <el-step title="生成试卷"></el-step>
                </el-steps>
                <div style="width: 80%;margin: 0 auto;">

                    <el-form>
                        <div v-show="activeItemIndex==0"><!--1.选择考试课程-->

                            <div class="divtable">
                                <div class="innerdivtable">
                                    <el-form-item  prop="courseId"  >
                                        <el-select v-model="searchValue.qcourse"
                                                   filterable
                                                   placeholder="请选择课程(可搜索）"
                                                   @change="selectCourseChanged"
                                                   size="large"
                                                   style="width: 350px;">
                                            <el-option
                                                    v-for="item in courses"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>

                        <div v-show="activeItemIndex==1" >

                          <!--  <el-form-item  prop="checkTeacherId"  >
                                <el-select v-model="checkTeacherId"
                                           placeholder="请选择审核人(课程负责人）"
                                           @change="selectCheckTeacherChanged"
                                           size="large"
                                           filterable
                                           style="width: 250px;">
                                    <el-option
                                            v-for="item in checkTeachers"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">&lt;!&ndash;这里knows.children为课程列表&ndash;&gt;
                                    </el-option>
                                </el-select>
                            </el-form-item>-->
                            <!--第二行，条件搜索div-->

                            <div style="display: flex;justify-content: space-between;margin-top: 20px;">
                                <span>课程：{{selectCourse.name}}</span>
                                <div>
                                    <el-popover
                                            placement="right"
                                            width="250"

                                            trigger="click">

                                        <el-form
                                                label-position="right"
                                                label-width="100px"
                                                style="margin: 0px auto">

                                            <el-form-item label="单选题:">
                                                已选<strong>{{selectPaper.scIds.length}}</strong>道
                                                <el-button @click="showDeleteSCQueListDialog" type="danger"  size="mini" style="padding:8px;margin-left: 20px" plain>清空</el-button>
                                            </el-form-item>
                                            <el-form-item label="多选题:">
                                                已选<strong>{{selectPaper.mcIds.length}}</strong>道
                                                <el-button @click="showDeleteMCQueListDialog" type="danger"  size="mini" style="padding:8px;margin-left: 20px" plain>清空</el-button>
                                            </el-form-item>
                                            <el-form-item label="判断题:">
                                                已选<strong>{{selectPaper.tfIds.length}}</strong>道
                                                <el-button @click="showDeleteTFQueListDialog" type="danger"  size="mini" style="padding:8px;margin-left: 20px" plain>清空</el-button>
                                            </el-form-item>
                                            <el-form-item label="填空题:">
                                                已选<strong>{{selectPaper.fbIds.length}}</strong>道
                                                <el-button @click="showDeleteFBQueListDialog" type="danger"  size="mini" style="padding:8px;margin-left: 20px" plain>清空</el-button>
                                            </el-form-item>
                                            <el-form-item label="简答题:">
                                                已选<strong>{{selectPaper.qaIds.length}}</strong>道
                                                <el-button @click="showDeleteQAQueListDialog" type="danger"  size="mini" style="padding:8px;margin-left: 20px" plain>清空</el-button>
                                            </el-form-item>
                                        </el-form>

                                        <el-badge :value="selectPaperQueNum" slot="reference"  class="item">
                                            <el-button   size="small" type="primary">已选试题总数</el-button>
                                       </el-badge>

                                    </el-popover>
                                    <el-dialog
                                            title="提示"
                                            :visible.sync="dialogdDeleteQueListVisible"
                                            width="30%"
                                            >
                                        <span>确定清空所有已选的【{{selectDeleteQueType}}】</span>
                                        <span slot="footer" class="dialog-footer">
                                            <el-button @click="dialogdDeleteQueListVisible = false">取 消</el-button>
                                            <el-button type="primary" @click="deleteQueList">确 定</el-button>
                                        </span>
                                    </el-dialog>
                                </div>

                            </div>
                            <div  style="border :1px solid #dedede;border-radius: 5px;box-sizing: border-box;padding: 5px ;width: 80%;margin-left: auto;margin-right: auto"><!--条件搜索-->

                                <el-row style="display: flex;justify-content: center">

                                   <!-- <el-col :span="2"><div></div></el-col>-->
                                    <el-col :span="20" style="margin-left: 20px">
                                        题型:
                                        <el-select v-model="searchValue.queType"
                                                   placeholder="请选择题型"
                                                   @change="initQuestions"
                                                   style="width: 120px;margin-right: 20px">
                                            <el-option
                                                    v-for="item in queTypes"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                        难度:
                                        <el-select v-model="searchValue.qlevel"
                                                   placeholder="请选择试题难度"
                                                   style="width: 150px;margin-right: 20px">
                                            <el-option
                                                    v-for="item in qlevel"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>

                                        所属章节：
                                        <el-select v-model="searchValue.qchapter" placeholder="请选择章节" size="mini" style="width: 200px;">
                                            <el-option
                                                    v-for="item in chapters"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button size="mini" @click="emptySearchValue">重置</el-button>
                                        <el-button size="mini" icon="el-icon-search" type="primary" @click="queryQuestionsByCondition">搜索</el-button>
                                    </el-col>

                                </el-row>
                            </div>
                            <!--第二行，条件搜索div-----end-->
                            <div style="width: 80%;margin-left: auto;margin-right: auto" ><!--试题内容面板展示-->

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

                                                                <span>难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
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
                                                                <div>{{scope.row.analysis}}</div>
                                                            </div>
                                                            <div style="margin-top: 5px">
                                                                <span>【上传者】</span><span>{{scope.row.teacher.name}}</span>
                                                            </div>

                                                        </div>

                                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;"><!--5.底部信息-->
                                                            <el-button v-if="scAddStatus[scope.$index]==false" type="primary" style="float: right; "  size="mini " @click="addSCQueToPap(scope.$index,scope.row)">加入试卷</el-button>
                                                            <el-button v-if="scAddStatus[scope.$index]==true" type="danger" style="float: right; " size="mini " @click="deleteSCQueFromPap(scope.$index,scope.row)">移出试卷</el-button>
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

                                                                <span>难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
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

                                                            <div v-for="(item,indexj) in scope.row.options">{{optionChar[indexj]}} {{item.optionContent}}</div><!--遍历多选题选项-->

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
                                                                <div>{{scope.row.analysis}}</div>
                                                            </div>
                                                            <div style="margin-top: 5px">
                                                                <span>【上传者】</span><span>{{scope.row.teacher.name}}</span>
                                                            </div>

                                                        </div>
                                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                                            <el-button v-if="mcAddStatus[scope.$index]==false" type="primary" style="float: right; " @click="addMCQueToPap(scope.$index,scope.row)">加入试卷</el-button>
                                                            <el-button v-if="mcAddStatus[scope.$index]==true" type="danger" style="float: right; " @click="deleteMCQueFromPap(scope.$index,scope.row)">移出试卷</el-button>
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

                                                                <span>难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
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
                                                                <div>{{scope.row.analysis}}</div>
                                                            </div>
                                                            <div style="margin-top: 5px">
                                                                <span>【上传者】</span><span>{{scope.row.teacher.name}}</span>
                                                            </div>

                                                        </div>
                                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                                            <el-button v-if="tfAddStatus[scope.$index]==false" type="primary" style="float: right; " @click="addTFQueToPap(scope.$index,scope.row)">加入试卷</el-button>
                                                            <el-button v-if="tfAddStatus[scope.$index]==true" type="danger" style="float: right; " @click="deleteTFQueFromPap(scope.$index,scope.row)">移出试卷</el-button>
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

                                                                <span>难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
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
                                                                <div>{{scope.row.analysis}}</div>
                                                            </div>
                                                            <div style="margin-top: 5px">
                                                                <span>【上传者】</span><span>{{scope.row.teacher.name}}</span>
                                                            </div>

                                                        </div>
                                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                                            <el-button v-if="fbAddStatus[scope.$index]==false" type="primary" style="float: right; " @click="addFBQueToPap(scope.$index,scope.row)">加入试卷</el-button>
                                                            <el-button v-if="fbAddStatus[scope.$index]==true" type="danger" style="float: right; " @click="deleteFBQueFromPap(scope.$index,scope.row)">移出试卷</el-button>
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

                                                                <span>难度：{{qlevel[scope.row.dot-1].label}}</span><!--根据dot的数值，对应到qlevel的label值-->
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
                                                                <div>{{scope.row.analysis}}</div>
                                                            </div>
                                                            <div style="margin-top: 5px">
                                                                <span>【上传者】</span><span>{{scope.row.teacher.name}}</span>
                                                            </div>

                                                        </div>
                                                        <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px;margin-top: 5px"><!--5.底部信息-->

                                                            <el-button v-if="qaAddStatus[scope.$index]==false" type="primary" style="float: right; " @click="addQAQueToPap(scope.$index,scope.row)">加入试卷</el-button>
                                                            <el-button v-if="qaAddStatus[scope.$index]==true" type="danger" style="float: right; " @click="deleteQAQueFromPap(scope.$index,scope.row)">移出试卷</el-button>
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
                        <div v-show="activeItemIndex==2"><!--设置试题参数-->

                            <div style="margin-top: 20px">
                                <el-form
                                    label-position="right"
                                    label-width="100px"
                                    style="margin: 0px auto"
                                    >
                                    <el-form-item label="试卷名称:">
                                        <el-input size="medium"
                                                  style="width: 300px"
                                                  placeholder="请输入试卷的名称"
                                                  v-model="paperName">

                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div><!--试题的分数设置-->
                                <el-row>
                                    <el-col :span="2" >
                                        分数设置
                                    </el-col>
                                    <el-col :span="22">
                                        <div  v-if="selectPaperInfo.sclist"><!--单选-->
                                            <el-table
                                                    :data="selectPaperInfo.sclist"
                                                    style="width: 80%">
                                                <el-table-column
                                                        type="index"
                                                        label="编号"
                                                        fixed
                                                        width="80"><!--   prop="id"-->
                                                    <!--<template slot-scope="scope">
                                                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                                                    </template>-->
                                                    <template slot-scope="scope">
                                                        <span>{{scope.$index+1}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                        label="题型"
                                                        fixed
                                                        align="left"
                                                        width="120">单选题
                                                </el-table-column>

                                                <el-table-column
                                                        prop="stem"
                                                        label="题干"
                                                        width="250"
                                                        :show-overflow-tooltip='true'
                                                        align="left">
                                                </el-table-column>
                                                <el-table-column
                                                        prop="gender"
                                                        label="试题难度"
                                                        width="100"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        {{qlevel[scope.row.dot-1].label}}
                                                    </template>
                                                </el-table-column>

                                                <el-table-column

                                                        label="分数设置"
                                                        width="200"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        <el-input style="width: 100px"
                                                                  placeholder="0"

                                                                  v-model.trim="selectQueScore.scScore">

                                                        </el-input>&nbsp;分
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                        label="操作">
                                                    <template slot-scope="scope">
                                                        <el-button size="small" :disabled="scope.$index===0"  @click="moveSCUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
                                                        <el-button size="small" :disabled="scope.$index===(selectPaperInfo.sclist.length-1)" @click="moveSCDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
                                                        <el-button size="small" type="danger" @click="deleteScQue(scope.row)"><i class="el-icon-delete"></i></el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                        <div  v-if="selectPaperInfo.mclist"><!--多选-->
                                            <!-- 多选题-->
                                            <el-table
                                                    :data="selectPaperInfo.mclist"
                                                    style="width: 80%">
                                                <el-table-column
                                                        type="index"

                                                        fixed
                                                        width="80"><!--   prop="id"-->
                                                    <!--<template slot-scope="scope">
                                                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                                                    </template>-->
                                                    <template slot-scope="scope">
                                                        <span>{{scope.$index+1}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column

                                                        fixed
                                                        align="left"
                                                        width="120">多选题
                                                </el-table-column>

                                                <el-table-column
                                                        prop="stem"

                                                        width="250"
                                                        :show-overflow-tooltip='true'
                                                        align="left">
                                                </el-table-column>
                                                <el-table-column

                                                        width="100"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        {{qlevel[scope.row.dot-1].label}}
                                                    </template>
                                                </el-table-column>

                                                <el-table-column

                                                        width="200"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        <el-input style="width: 100px"
                                                                  placeholder="0"

                                                                  v-model.trim="selectQueScore.mcScore">

                                                        </el-input>&nbsp;分
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                >
                                                    <template slot-scope="scope">
                                                        <el-button size="small" :disabled="scope.$index===0"  @click="moveSCUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
                                                        <el-button size="small" :disabled="scope.$index===(selectPaperInfo.mclist.length-1)" @click="moveSCDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
                                                        <el-button size="small" type="danger" @click="deleteScQue(scope.row)"><i class="el-icon-delete"></i></el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                        <div  v-if="selectPaperInfo.tflist"><!--判断-->
                                            <!--判断题-->
                                            <el-table
                                                    :data="selectPaperInfo.tflist"
                                                    style="width: 80%">
                                                <el-table-column
                                                        type="index"

                                                        fixed
                                                        width="80"><!--   prop="id"-->
                                                    <!--<template slot-scope="scope">
                                                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                                                    </template>-->
                                                    <template slot-scope="scope">
                                                        <span>{{scope.$index+1}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column

                                                        fixed
                                                        align="left"
                                                        width="120">判断题
                                                </el-table-column>

                                                <el-table-column
                                                        prop="stem"

                                                        width="250"
                                                        :show-overflow-tooltip='true'
                                                        align="left">
                                                </el-table-column>
                                                <el-table-column

                                                        width="100"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        {{qlevel[scope.row.dot-1].label}}
                                                    </template>
                                                </el-table-column>

                                                <el-table-column

                                                        width="200"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        <el-input style="width: 100px"
                                                                  placeholder="0"

                                                                  v-model.trim="selectQueScore.tfScore">

                                                        </el-input>&nbsp;分
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                >
                                                    <template slot-scope="scope">
                                                        <el-button size="small" :disabled="scope.$index===0"  @click="moveSCUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
                                                        <el-button size="small" :disabled="scope.$index===(selectPaperInfo.tflist.length-1)" @click="moveSCDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
                                                        <el-button size="small" type="danger" @click="deleteScQue(scope.row)"><i class="el-icon-delete"></i></el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                        <div  v-if="selectPaperInfo.fblist"><!--填空-->
                                            <!--   填空题-->
                                            <el-table
                                                    :data="selectPaperInfo.fblist"
                                                    style="width: 80%">
                                                <el-table-column
                                                        type="index"

                                                        fixed
                                                        width="80"><!--   prop="id"-->
                                                    <!--<template slot-scope="scope">
                                                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                                                    </template>-->
                                                    <template slot-scope="scope">
                                                        <span>{{scope.$index+1}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column

                                                        fixed
                                                        align="left"
                                                        width="120">填空题
                                                </el-table-column>

                                                <el-table-column
                                                        prop="stem"

                                                        width="250"
                                                        :show-overflow-tooltip='true'
                                                        align="left">
                                                </el-table-column>
                                                <el-table-column

                                                        width="100"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        {{qlevel[scope.row.dot-1].label}}
                                                    </template>
                                                </el-table-column>

                                                <el-table-column

                                                        width="200"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        <el-input style="width: 100px"
                                                                  placeholder="0"

                                                                  v-model.trim="selectQueScore.fbScore[scope.$index]">

                                                        </el-input>&nbsp;分
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                >
                                                    <template slot-scope="scope">
                                                        <el-button size="small" :disabled="scope.$index===0"  @click="moveSCUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
                                                        <el-button size="small" :disabled="scope.$index===(selectPaperInfo.fblist.length-1)" @click="moveSCDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
                                                        <el-button size="small" type="danger" @click="deleteScQue(scope.row)"><i class="el-icon-delete"></i></el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                        <div  v-if="selectPaperInfo.qalist"><!--简答-->
                                            <el-table
                                                    :data="selectPaperInfo.qalist"
                                                    style="width: 80%">
                                                <el-table-column
                                                        type="index"

                                                        fixed
                                                        width="80"><!--   prop="id"-->
                                                    <!--<template slot-scope="scope">
                                                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                                                    </template>-->
                                                    <template slot-scope="scope">
                                                        <span>{{scope.$index+1}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column

                                                        fixed
                                                        align="left"
                                                        width="120">简答题
                                                </el-table-column>

                                                <el-table-column
                                                        prop="stem"

                                                        width="250"
                                                        :show-overflow-tooltip='true'
                                                        align="left">
                                                </el-table-column>
                                                <el-table-column

                                                        width="100"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        {{qlevel[scope.row.dot-1].label}}
                                                    </template>
                                                </el-table-column>

                                                <el-table-column

                                                        width="200"
                                                        align="left">
                                                    <template slot-scope="scope">
                                                        <el-input style="width: 100px"
                                                                  placeholder="0"

                                                                  v-model.trim="selectQueScore.qaScore[scope.$index]">

                                                        </el-input>&nbsp;分
                                                    </template>
                                                </el-table-column>
                                                <el-table-column
                                                >
                                                    <template slot-scope="scope">
                                                        <el-button size="small" :disabled="scope.$index===0"  @click="moveSCUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
                                                        <el-button size="small" :disabled="scope.$index===(selectPaperInfo.qalist.length-1)" @click="moveSCDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
                                                        <el-button size="small" type="danger" @click="deleteScQue(scope.row)"><i class="el-icon-delete"></i></el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </el-col>
                                </el-row>
                                <div>
                                    总分：{{totalScore}}
                                </div>
                            </div>
                            <div><!--展示试题的章节分布柱状图-->
                                <div>
                                    <chart  :options="options" :auto-resize="true"></chart>
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
                    <el-button type="primary" @click="nextStep">{{activeItemIndex==3?'完成':'下一步'}}</el-button>
                   </span>
            </div>
        </div>
    </div>
</template>

<script>
    // 柱状图
    import 'echarts/lib/chart/bar'
    // 提示
    import 'echarts/lib/component/tooltip'
    // 图例
    import 'echarts/lib/component/legend'
    // 标题
    import 'echarts/lib/component/title'

    export default {
        name: "PaperHandCre",
        component() {
        },
        data(){
            return{
                courseId:'',
                courses:[],
                selectCourse:{},
                chapters:[],/*存放根据关键词查找的课程列表*/
                activeItemIndex: 0,
                queTypes:['单选题','多选题','判断题','填空题','简答题'],
                searchValue:{
                    qcourse:'',
                    queType:'单选题',
                    qlevel:'',//搜索条件试题难度
                    qchapter:''//搜索条件试题章节
                },
                qlevel:[//试题难度下拉框选择值
                    {value:1,label:'简单'},{value:2,label: '适中'},{value:3,label:'偏难'},{value:4,label: '难'}
                ],
                sclist:[],//第二个步骤，存放后台查询到的不同类型的试题列表，供手工选题
                mclist:[],
                tflist:[],
                fblist:[],
                qalist:[],
                selectPaper:{//存储第二步骤，挑选的试题的id数组
                    scIds:[],
                    mcIds:[],
                    tfIds:[],
                    fbIds:[],
                    qaIds:[],
                },
                selectPaperInfo:{//存放第三步，挑选的试题的详细信息

                },
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
                scViewStatus:[],//这里主要用来存放每个试题的隐藏div的标记
                scAddStatus:[],//这里用来存放试题添加到试卷的标记
                mcViewStatus:[],
                mcAddStatus:[],
                tfViewStatus:[],
                tfAddStatus:[],
                fbViewStatus:[],
                fbAddStatus:[],
                qaViewStatus:[],
                qaAddStatus:[],
                total:0,/*设置查询的总记录数*/
                page:1,//设置第几页
                size:10,//设置每页的数据
                isShowPagination:false,//是否显示分页

                dialogdDeleteQueListVisible:false,
                selectDeleteQueType:'',
                paperName:'',//存储试卷名称
                selectQueScore:{//存储试题的分数信息
                    scScore:'',
                    mcScore:'',
                    tfScore:'',
                    fbScore:[],
                    qaScore:[],
                },
                options:{
                    title: {
                        text: '基本信息',
                        subtext: '虚假数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['rgba(31,13,230,0.95)', '#ff475d', '#49ef18', '#efeb23'],
                    legend: [
                        {
                            data: ['学历层次', '职业技能'],
                        },
                        {
                            top: 20,
                            data: ['业绩成果', '专业经历'],
                        }

                    ],
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {
                                show: true, readOnly: true,
                                optionToContent: function (opt) {
                                    let axisData = opt.xAxis[0].data; //坐标数据
                                    let series = opt.series; //折线图数据
                                    let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                                    let tdBodys = ''; //数据
                                    series.forEach(function (item) {
                                        //组装表头
                                        tdHeads += `<td style="padding: 0 10px">${item.name}</td>`;
                                    });
                                    let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                                    for (let i = 0, l = axisData.length; i < l; i++) {
                                        for (let j = 0; j < series.length; j++) {
                                            //组装表数据
                                            tdBodys += `<td>${series[j].data[i]}</td>`;
                                        }
                                        table += `<tr><td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
                                        tdBodys = '';
                                    }
                                    table += '</tbody></table>';
                                    return table;
                                }
                            },
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '学历层次',
                            type: 'bar',
                            stack: '个人信息',
                            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name: '职业技能',
                            type: 'bar',
                            stack: '个人信息',
                            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                            markPoint: {
                                data: [
                                    {name: '年最高', value: 182.2, xAxis: 7, yAxis: 183},
                                    {name: '年最低', value: 2.3, xAxis: 11, yAxis: 3}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name: '业绩成果',
                            type: 'bar',
                            stack: '个人信息',
                            data: [2.0, 6.0, 7.0, 20.4, 21.7, 60.7, 135.6, 152.2, 56.7, 15.8, 7.0, 2.3],
                            markPoint: {
                                data: [
                                    {name: '年最高', value: 152.2, xAxis: 7, yAxis: 153},
                                    {name: '年最低', value: 2.0, xAxis: 1, yAxis: 2}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name: '专业经历',
                            type: 'bar',
                            stack: '个人信息',
                            data: [1.0, 6.9, 9.0, 36.4, 48.7, 90.7, 100.6, 122.2, 40.7, 8.8, 6.0, 2.3],
                            markPoint: {
                                data: [
                                    {name: '年最高', value: 122.2, xAxis: 7, yAxis: 123},
                                    {name: '年最低', value: 1.0, xAxis: 1, yAxis: 1}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                },


            }
        },
        computed:{
            selectPaperQueNum:function() {//试卷中试题的总数
                return this.selectPaper.scIds.length+
                        this.selectPaper.mcIds.length+
                        this.selectPaper.fbIds.length+
                        this.selectPaper.tfIds.length+
                        this.selectPaper.qaIds.length;
            },
            totalScore:function () {
                let total=0;
                let scListLen=0;
                let mcListLen=0;
                let tfListLen=0;
                if(this.selectPaperInfo.sclist){
                    scListLen=this.selectPaperInfo.sclist.length;
                }
                if(this.selectPaperInfo.mclist){
                    mcListLen=this.selectPaperInfo.mclist.length;
                }
                if(this.selectPaperInfo.tflist){
                    tfListLen=this.selectPaperInfo.tflist.length;
                }
                if(this.selectQueScore.fbScore.length>0){
                    for (let i = 0; i < this.selectQueScore.fbScore.length; i++) {
                        total+=Number(this.selectQueScore.fbScore[i]);
                    }
                }
                if(this.selectQueScore.qaScore.length>0){
                    for (let i = 0; i < this.selectQueScore.qaScore.length; i++) {
                        total+=Number(this.selectQueScore.qaScore[i]);
                    }
                }
                return Number(this.selectQueScore.scScore)*Number(scListLen)
                            +Number(this.selectQueScore.mcScore)*Number(mcListLen)
                            +Number(this.selectQueScore.tfScore)*Number(tfListLen)
                            +Number(total);
            }
        },
        mounted() {
            this.initCourse();
        },
        methods:{
            initCourse(){//初始化课程列表
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
                    this.getRequest(url).then(resp=>{
                        if(resp){

                            this.sclist=resp.data;
                           // alert(this.sclist.length);
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
                //3.初始化试题隐藏标记数组，初始化添加移出试卷标记数组
                var that = this;
                setTimeout(function () {//这里延迟1秒执行函数，因为需要用到sclist集合，所以得等后端传过来数据之后执行
                    that.initShowCardHidden();
                },1000);

            },
            preStep() {
                if (this.activeItemIndex == 0) {
                    return;

                } else if (this.activeItemIndex == 3) {

                }
                this.activeItemIndex--;
            },
            nextStep() {
                this.activeItemIndex++;
                if (this.activeItemIndex == 2) {//根据id数组获取试题详细信息
                    if(this.selectPaperQueNum==0){
                        this.$message.error('请先选择试题！');
                    }

                /*  if(Object.keys(this.selectPaperInfo).length==0){*/

                      this.getRequest('/question/input/getQueByIds?scIds='+this.selectPaper.scIds
                                            +'&mcIds='+this.selectPaper.mcIds
                                            +'&tfIds='+this.selectPaper.tfIds
                                            +'&fbIds='+this.selectPaper.fbIds
                                            +'&qaIds='+this.selectPaper.qaIds).then(resp => {
                          if (resp) {
                              this.selectPaperInfo = resp;
                          }else{
                              /*this.$message.error('数据初始化错误');*/
                          }
                      })

                 /* }*/
                }

            },
            initShowCardHidden(){//初始化试题隐藏标记数组，构造一个和list集合一样大的数组，里面都为false的boolean类型

                if(this.searchValue.queType=='单选题'){
                    var scViewStatus1=new Array(this.sclist.length);
                    var scAddStatus1=new Array(this.sclist.length);
                  /*  console.log('sclist.length:',this.sclist.length);*/
                    for(var i=0;i<this.sclist.length;i++){

                        scViewStatus1[i]=false;
                        scAddStatus1[i]=false;
                    }
                    this.scAddStatus=scAddStatus1;
                    this.scViewStatus=scViewStatus1;
                  /*  console.log('scAddStatus.length',this.scAddStatus.length);
                    console.log('scViewStatus.length',this.scViewStatus.length);*/

                }
                else if(this.searchValue.queType=='多选题'){
                    var mcViewStatus1=new Array(this.mclist.length);
                    var mcAddStatus1=new Array(this.mclist.length);
                    for(var i=0;i<this.mclist.length;i++){
                        mcViewStatus1[i]=false;
                        mcAddStatus1[i]=false;
                    }
                    this.mcViewStatus=mcViewStatus1;
                    this.mcAddStatus=mcAddStatus1;
                }
                else if(this.searchValue.queType=='判断题'){
                    var tfViewStatus1=new Array(this.tflist.length);
                    var tfAddStatus1=new Array(this.tflist.length);
                    for(var i=0;i<this.tflist.length;i++){
                        tfViewStatus1[i]=false;
                        tfAddStatus1[i]=false;
                    }
                    this.tfViewStatus=tfViewStatus1;
                    this.tfAddStatus=tfAddStatus1;
                }
                else if(this.searchValue.queType=='填空题'){
                    var fbViewStatus1=new Array(this.fblist.length);
                    var fbAddStatus1=new Array(this.fblist.length);
                    for(var i=0;i<this.fblist.length;i++){
                        fbViewStatus1[i]=false;
                        fbAddStatus1[i]=false;
                    }
                    this.fbViewStatus=fbViewStatus1;
                    this.fbAddStatus=fbAddStatus1;
                }
                else if(this.searchValue.queType=='简答题'){
                    var qaViewStatus1=new Array(this.qalist.length);
                    var qaAddStatus1=new Array(this.qalist.length);
                    for(var i=0;i<this.qalist.length;i++){
                        qaViewStatus1[i]=false;
                        qaAddStatus1[i]=false;
                    }
                    this.qaViewStatus=qaViewStatus1;
                    this.qaAddStatus=qaAddStatus1;
                }


            },
            selectCourseChanged(){
                //用户选择完课程后，系统根据课程id，查询出章节，并显示课程的名称

                //1.查询出课程id对应的课程名称，用于在顶栏显示
                for(var i=0;i<this.courses.length;i++){
                    if(this.searchValue.qcourse==this.courses[i].id){
                        let target=JSON.parse(JSON.stringify(this.courses[i]));//对象的深拷贝
                        this.selectCourse=target;
                    }
                }
                //2.初始化试题
                this.initQuestions();

                //3.初始化章节数组
                this.getRequest("/baseinfo/chapter/?courseId="+this.searchValue.qcourse).then(resp=> {
                    if (resp) {
                        this.chapters=resp;
                    }
                })



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


            emptySearchValue(){
                this.searchValue.qcourse='';
                this.searchValue.qchapter='';
                this.searchValue.qlevel='';
                this.searchValue.queType='单选题';
            }
            ,queryQuestionsByCondition(){//条件查询
                this.initQuestions();
                var that = this;
                setTimeout(function () {//这里延迟1秒执行函数，因为需要用到sclist集合，所以得等后端传过来数据之后执行
                    that.initShowCardHidden();
                },2000);

            },
            /////////////////////////////////////////////////添加试卷方法
            addSCQueToPap(index,data){//标记加入试卷的试题

                var status=!this.scAddStatus[index]
                this.$set(this.scAddStatus,index,status);
                //将试题的id,加入数组
                this.selectPaper.scIds.push(data.id);

            },
            deleteSCQueFromPap(index,data){
                var status=!this.scAddStatus[index]
                this.$set(this.scAddStatus,index,status);

                var sclist=this.selectPaper.scIds;
                for(var i=0;i<sclist.length;i++){
                    if(sclist[i]==data.id){
                        sclist.splice(i,1);
                        i--;
                    }
                }
            },
            addMCQueToPap(index,data){
                var status=!this.mcAddStatus[index]
                this.$set(this.mcAddStatus,index,status);

                this.selectPaper.mcIds.push(data.id);
            },
            deleteMCQueFromPap(index,data){
                var status=!this.mcAddStatus[index]
                this.$set(this.mcAddStatus,index,status);

                var mclist=this.selectPaper.mcIds;
                for(var i=0;i<mclist.length;i++){
                    if(mclist[i]==data.id){
                        mclist.splice(i,1);
                        i--;
                    }
                }
            },
            addTFQueToPap(index,data){
                var status=!this.tfAddStatus[index]
                this.$set(this.tfAddStatus,index,status);

                this.selectPaper.tfIds.push(data.id);
            },

            deleteTFQueFromPap(index,data){
                var status=!this.tfAddStatus[index]
                this.$set(this.tfAddStatus,index,status);

                var tflist=this.selectPaper.tfIds;
                for(var i=0;i<tflist.length;i++){
                    if(tflist[i]==data.id){
                        tflist.splice(i,1);
                        i--;
                    }
                }

            },
            addFBQueToPap(index,data){
                var status=!this.fbAddStatus[index]
                this.$set(this.fbAddStatus,index,status);
                this.selectPaper.fbIds.push(data.id);
            },

            deleteFBQueFromPap(index,data){
                var status=!this.fbAddStatus[index]
                this.$set(this.fbAddStatus,index,status);
                var fblist=this.selectPaper.fbIds;
                for(var i=0;i<fblist.length;i++){
                    if(fblist[i]==data.id){
                        fblist.splice(i,1);
                        i--;
                    }
                }
            },
            addQAQueToPap(index,data){
                var status=!this.qaAddStatus[index]
                this.$set(this.qaAddStatus,index,status);
                this.selectPaper.qaIds.push(data.id);
            },
            deleteQAQueFromPap(index,data){
                var status=!this.qaAddStatus[index]
                this.$set(this.qaAddStatus,index,status);

                var qalist=this.selectPaper.qaIds;
                for(var i=0;i<qalist.length;i++){
                    if(qalist[i]==data.id){
                        qalist.splice(i,1);
                        i--;
                    }
                }
            },
            /////////////////////////////////////////////////添加试卷方法
            sizeChange(currentSize){
                this.size=currentSize;
                this.initQuestions();
            },
            currentChange(currentPage){//里面的参数为当前页
                this.page=currentPage;
                this.initQuestions();
            },
            showDeleteSCQueListDialog(){//显示清空单选题对话框
                this.selectDeleteQueType='单选题';
                this.dialogdDeleteQueListVisible=true;
            },
            showDeleteMCQueListDialog(){//显示清空单选题对话框
                this.selectDeleteQueType='多选题';
                this.dialogdDeleteQueListVisible=true;
            },
            showDeleteTFQueListDialog(){//显示清空单选题对话框
                this.selectDeleteQueType='判断题';
                this.dialogdDeleteQueListVisible=true;
            },
            showDeleteFBQueListDialog(){//显示清空单选题对话框
                this.selectDeleteQueType='填空题';
                this.dialogdDeleteQueListVisible=true;
            },
            showDeleteQAQueListDialog(){//显示清空单选题对话框
                this.selectDeleteQueType='简答题';
                this.dialogdDeleteQueListVisible=true;
            },
            deleteSCQueList(){//清空选中的所有单选题
                this.selectPaper.scIds=[];
                this.dialogdDeleteQueListVisible=false;
            },
            deleteMCQueList(){//清空选中的所有多选题
                this.selectPaper.mcIds=[];
                this.dialogdDeleteQueListVisible=false;
            },
            deleteTFQueList(){//清空选中的所有判断题
                this.selectPaper.tfIds=[];
                this.dialogdDeleteQueListVisible=false;
            },
            deleteFBQueList(){//清空选中的所有填空题
                this.selectPaper.fbIds=[];
                this.dialogdDeleteQueListVisible=false;
            },
            deleteQAQueList(){//清空选中的所有简答题
                this.selectPaper.qaIds=[];
                this.dialogdDeleteQueListVisible=false;
            },
            deleteQueList(){
                if(this.selectDeleteQueType=='单选题'){
                    this.deleteSCQueList();
                }else if(this.selectDeleteQueType=='多选题'){
                    this.deleteMCQueList();
                }else if(this.selectDeleteQueType=='判断题'){
                    this.deleteTFQueList();
                }else if(this.selectDeleteQueType=='填空题'){
                    this.deleteFBQueList();
                }else if(this.selectDeleteQueType=='简答题'){
                    this.deleteQAQueList();
                }
                this.initShowCardHidden();
            },
            deleteScQue(index,data){//设置试题参数中，删除单选题

            },
            moveSCUp(index,data){
                var that = this;
                console.log('上移', index, data);
                if (index > 0) {
                    let upData = that.selectPaperInfo.sclist[index - 1];
                    that.selectPaperInfo.sclist.splice(index - 1, 1);
                    that.selectPaperInfo.sclist.splice(index, 0, upData);
                } else {
                    alert('已经是第一条，不可上移');
                }
            },
            moveSCDown(index,data){
                var that = this;
                console.log('下移', index, data);
                if ((index + 1) === that.selectPaperInfo.sclist.length) {
                    alert('已经是最后一条，不可下移');
                } else {
                    console.log(index);
                    // 保存下一条数据
                    let downData = that.selectPaperInfo.sclist[index + 1];
                    // 删除下一条数据
                    that.selectPaperInfo.sclist.splice(index + 1, 1);
                    // 增添被删除的那一条数据
                    that.selectPaperInfo.sclist.splice(index, 0, downData);
                }
            },

            change(e){
                this.$forceUpdate();
            }


        }
    }
</script>

<style >
    .divtable{
        display:table;
        width:100%;
        height:550px;
     /*   background-color:Blue;*/
    }
    .innerdivtable
    {
        display:table-cell;
        vertical-align:middle;
        text-align:center;
    }
    .stem span{
        white-space:pre-line
    }

</style>