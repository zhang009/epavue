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
            <div  style="border :1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px ;margin: 10px 0px;"><!--条件搜索-->
                    <el-row>
                        <el-col :span="15">
                            题型:
                            <el-select v-model="searchValue.queType" placeholder="请选择题型"  style="width: 180px;">
                                <el-option
                                        v-for="item in queTypes"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                            难度:
                            <el-select v-model="searchValue.qlevel" placeholder="请选择试题难度"  style="width: 180px;">
                                <el-option
                                        v-for="item in qlevel"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            所属课程：
                            <el-select v-model="searchValue.qcourse" placeholder="请选择课程" size="mini" style="width: 150px;">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            所属章节：
                            <el-select v-model="searchValue.qchapter" placeholder="请选择章节" size="mini" style="width: 150px;">
                                <el-option
                                        v-for="item in chapters"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="9">
                            <el-button size="mini" @click="emptySearchValue">重置</el-button>
                            <el-button size="mini" icon="el-icon-search" type="primary" @click="queryQuestionsByCondition">搜索</el-button>
                        </el-col>

                    </el-row>
                </div>
          <!--第二行，条件搜索div-----end-->
            <div style="margin-top: 20px;width: 80%;border:1px solid #f0f0f0;margin-left: auto;margin-right: auto" ><!--内容面板展示-->
                <div style="margin-bottom: 15px">
                    <el-card class="box-card" shadow="hover">
                        <div slot="header" class="clearfix"><!--1.标题-->
                           <!-- <span>题型:</span>单选题|<span>难度:</span>简单|<span>更新时间:</span>2020-4-10 18：01-->
                            <div>
                                <span>雨纷纷</span>
                                <el-divider direction="vertical"></el-divider>
                                <span>旧故里</span>
                                <el-divider direction="vertical"></el-divider>
                                <span>草木深</span>
                            </div>
                            <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                        </div>
                        <div @click="showQueDetailInfo=!showQueDetailInfo"><!--2.题干-->
                            C语言程序从main()函数开始执行，所以这个函数要可以写在______。
                        </div>
                        <div  class="text item" @click="showQueDetailInfo=!showQueDetailInfo"><!--3.选项-->
                            <div>A）程序文件的开始</div>
                            <div>B）程序文件的最后  </div>
                            <div>C）它所调用的函数的前面</div>
                            <div>D）程序文件的任何位置</div>
                        </div>

                        <div v-show="showQueDetailInfo" @click="showQueDetailInfo=!showQueDetailInfo"><!--4.隐藏详细信息-->
                            <hr style="border: 1px dashed #dedede"></hr><!--分割线-->
                            <div>
                                <el-tag>知识点</el-tag>
                                <div v-for="O in 2">知识点一</div>
                            </div>
                            <div>
                                <el-tag>答案</el-tag>
                                <span>A</span>
                            </div>
                              <div>
                                  <el-tag>解析</el-tag>
                              </div>
                              <div>
                                  <el-tag>上传者</el-tag>
                              </div>

                            <span>..................解析</span>
                        </div>
                       <div   style="border-top: 1px solid #f0f0f0 ;padding: 10px"><!--5.底部信息-->
                           <el-button style="float: right;" icon="el-icon-edit" size="medium " circle></el-button>
                           <el-button style="float: right; " icon="el-icon-delete" size="medium " circle></el-button>
                       </div>


                    </el-card>
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

            }

        },mounted() {
            this.initCourses();
        },



        methods:{
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

            },clickKeyQuery(){//关键词搜索

            },queryQuestionsByCondition(){//条件查询

            },
            emptySearchValue(){
                    this.searchValue.qcourse='';
                    this.searchValue.qchapter='';
                    this.searchValue.qlevel='';
                    this.searchValue.queType='';
            }
        }
    }
</script>

<style scoped>

</style>