<template>
    <div>
        <div ><!--第一行左侧搜索-->
            <el-select v-model="searchValue.schoolId"
                       @change="selectSchoolChanged"
                       placeholder="请选择学院"
                       size="small"
                       style="width: 230px;margin-right: 5px">
                <el-option
                        v-for="item in schools"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchValue.majorId"
                       @change="selectMajorChanged"
                       placeholder="请选择专业"
                       size="small"
                       style="width: 230px;margin-right: 5px">
                <el-option
                        v-for="item in majors"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchValue.classId"
                       @change="selectClassChanged"
                       placeholder="请选择班级"
                       size="small"
                       style="width: 230px;margin-right: 5px">
                <el-option
                        v-for="item in classes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-select v-model="searchValue.courseId"
                       @change="selectCourseChanged"
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
        </div>
        <el-divider></el-divider><!--分割线-->
        <div style="width: 600px"> <!--章节管理树形组件-->

            <!--这里的搜索框也是elementUI种的组件-->

            <el-input
                    placeholder="请输入章节或知识点名称进行搜索"
                    v-model="filterText"
                    prefix-icon="el-icon-search">
            </el-input>
            <div style="color: #cac6c6">（为了方便后期的数据分析，请在每一个章节后面至少设置一个知识点）</div>
            <el-tree
                    v-loading="loading"
                    element-loading-text="正在加载数据..."
                    element-loading-spinner="el-icon-loading"
                    :default-expand-all="true"
                    :data="knows"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"

                    style="margin-top: 10px"
                    ref="tree"><!--data为所有的部门，filterNode为过滤的方法-->
                <span class="custom-tree-node" style="display:flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }"><!--node为当前的元素，data为服务端返回的当前的jsonOjbect（node的数据）-->
                <span>{{ node.label }}</span><!--在这里node.label=data.name-->
                <span>
                  <!--<el-button
                          type="primary"
                          size="mini"
                          class="knowsBtn"
                          @click="() => showAddDepView(node,data)">
                    添加章节
                  </el-button>
                  <el-button
                          size="mini"
                          type="danger"
                          class="knowsBtn"
                          @click="() => deleteDep( data)">
                    删除章节
                  </el-button>-->
                    <el-button  icon="el-icon-plus" type="text"
                                @click="() => showAddKnowsView(node,data)">
                    </el-button>
                    <!-- 根节点不需要删除和重命名 -->
                    <el-button v-if="data.id !== -1"  icon="el-icon-edit" type="text"
                                @click="() => showEditKnowsView(node,data)">
                    </el-button>
                    <el-button v-if="data.id !== -1" style="color: #ff0000" icon="el-icon-delete"  type="text"
                               @click="() => deleteKnows( data)">
                    </el-button>

                </span>
              </span>
            </el-tree>
            <!--添加章节对话框-->
           <el-dialog
                    :title="title1"
                    :visible.sync="dialogVisible1"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag>所属课程</el-tag></td>
                            <td>{{courseName}}
                            </td>
                        </tr>
                        <tr>
                            <td><el-tag>章节名称</el-tag></td>
                            <td><el-input v-model="know.name" placeholder="请输入章节名称..."></el-input></td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
               <el-button type="primary" @click="doAddKnows">确 定</el-button>
              </span>
            </el-dialog>
            <!--编辑章节对话框-->
           <el-dialog
                    :title="title1"
                    :visible.sync="dialogVisible3"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag>所属课程</el-tag></td>
                            <td>{{courseName}}
                            </td>
                        </tr>
                        <tr>
                            <td><el-tag>章节名称</el-tag></td>
                            <td><el-input v-model="know.name" placeholder="请输入章节名称..."></el-input></td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>

               <el-button type="primary" @click="doEditKnows">确 定</el-button>
              </span>
            </el-dialog>
            <!--添加知识点对话框-->
           <el-dialog
                    :title="title2"
                    :visible.sync="dialogVisible2"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag>所属章节</el-tag></td>
                            <td>{{knowsName}}</td>
                        </tr>
                        <tr>
                            <td><el-tag>知识点名称</el-tag></td>
                            <td><el-input v-model="know.name" placeholder="请输入知识点名称..."></el-input></td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
               <el-button type="primary" @click="doAddKnows2">确 定</el-button>
              </span>
            </el-dialog>
            <!--编辑知识点对话框-->
           <el-dialog
                    :title="title2"
                    :visible.sync="dialogVisible4"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag>所属章节</el-tag></td>
                            <td>{{knowsName}}
                            </td>
                        </tr>
                        <tr>
                            <td><el-tag>知识点名称</el-tag></td>
                            <td><el-input v-model="know.name" placeholder="请输入知识点名称..."></el-input></td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible4 = false">取 消</el-button>
               <el-button type="primary" @click="doEditKnows2">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "KnowStruMana",
        data(){
            return{
                know:{
                    id:'',
                    name:'',
                    parentId:'',
                },
                isEditBtn:false,
                title1:'添加章节',
                title2:'添加知识点',
                searchValue:{/*条件搜索值*/
                    schoolId:'',
                    majorId:'',
                    classId:'',
                    courseId:''
                },
                dialogVisible1:false,/*添加对话框是否可见*/
                dialogVisible2:false,/*编辑对话框是否可见*/
                dialogVisible3:false,/*添加对话框是否可见*/
                dialogVisible4:false,/*编辑对话框是否可见*/
                courseName:'',/*添加章节名称*/
                knowsName:'',/*添加知识点名称*/
                schools:[],
                majors:[],
                classes:[],
                courses:[],
                filterText:'',/*搜索输入的章节名称*/
                loading:false,
                knows:[],/*后端传递过来的章节列表*/
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }

        }, watch: {
            filterText(val) {//当搜索框（filterText）的值发生变化的时候会触发此方法，val即为filterText的最新值
                this.$refs.tree.filter(val);
                /*这里的filter即为过滤的方法，即filterNode(value, data)*/
            }
        },mounted() {   //注意这里，mounted是一个方法，methods是一个属性
            this.initSchools();//进入页面时候，初始化表格数据
        },methods:{
            initSchools(){
                this.getRequest("/baseinfo/school/all").then(resp=>{
                    if(resp){
                        this.schools=resp;
                    }
                })
            },
            initKnows(){
                this.loading=true;
                this.getRequest("/baseinfo/knows/all?courseId="+this.searchValue.courseId).then(resp=> {
                    if (resp) {
                        this.knows=resp;
                        this.loading = false;
                    }
                })
            },
            selectSchoolChanged(){
                //学院下拉框改变
                this.initMajors();
            },
            selectMajorChanged(){
                //专业下拉框改变
                this.initClassByMajorId();
            },
            selectClassChanged(){
               //班级下拉框改变
                this.initCourseByClassId();
            },
            selectCourseChanged(){
                this.initKnows();
            },
            filterNode(value, data) {//value为filterText的最新值，data为json数组的每一项
                if (!value) return true;/*这里的data即为每一行的json对象，如果有值的话给我留着，如果没有值则给去除掉*/
                return data.name.indexOf(value) !== -1;/*默认的label改为了name*/
            },
            initMajors(){/*根据学院id获取专业列表*/
                //
                this.getRequest("/baseinfo/major/?schoolId="+this.searchValue.schoolId).then(resp=>{
                    if(resp){
                        this.majors=resp;
                    }
                })
            },
            initClassByMajorId(){/*根据专业id获取班级列表*/
                //  alert(this.searchValue.majorId);
                this.getRequest("/baseinfo/class/all?majorId="+this.searchValue.majorId).then(resp=>{
                    if(resp){
                        this.classes=resp;
                    }
                })
            },
            initCourseByClassId(){/*根据班级id获取课程*/
                this.getRequest("/baseinfo/course/all?classId="+this.searchValue.classId).then(resp=>{
                    if(resp){
                        this.courses=resp;
                    }
                })
            },
            showAddKnowsView(node,data){/*展示添加章节或知识点对话框*/
                console.log(node);
                console.log(data);

                this.know.id=data.id;
                if(data.parentId==-1&&data.children!=null){
                    //添加章节
                   // alert("1"+data.parentId);
                    this.title1="添加章节"
                    this.know.parentId=this.searchValue.courseId;//这里添加章节设置的parentId不在是后端传过来的，
                    this.courseName=node.parent.label;//展示所属课程
                    this.dialogVisible1=true;//展示
                }else if(data.id==-1&&data.children==null){
                    //如果是新建的课程（没有章节和知识点），则需要新建章节
                    this.title1="添加章节"
                    this.know.parentId=this.searchValue.courseId;//这里添加章节设置的parentId不在是后端传过来的，
                    console.log("node:",node);
                    this.courseName=node.label;//展示所属课程
                    this.dialogVisible1=true;//展示
                }else if(data.parentId==-1&&data.children==null){
                    //添加知识点
                    //如果该章节下面没有知识点，则显示添加知识点
                   // alert("2"+data.parentId);
                    this.title2="添加知识点"
                    this.knowsName=node.label;

                    this.know.parentId=data.id;//设置知识点所属的章节id
                    this.dialogVisible2=true;
                }else if(data.parentId!=-1&&data.children==null) {
                    //添加知识点
                    //章节下面有知识点
                    //alert("3"+data.parentId);
                    this.title2="添加知识点"
                    this.knowsName=node.parent.label;
                    this.know.parentId=data.parentId;//设置知识点所属的章节id
                    this.dialogVisible2=true;
                }

            },
            showEditKnowsView(node,data){/*展示编辑章节或知识点对话框*/
                console.log(node);
                console.log(data);

                this.know.id=data.id;
                this.know.name=data.name;
                if(data.parentId==-1){
                    //编辑章节
                    this.title1="编辑章节"
                    this.know.parentId=this.searchValue.courseId;
                    this.courseName=node.parent.label;//展示所属课程
                    this.dialogVisible3=true;//展示
                }else{
                    //编辑知识点
                    this.title2="编辑知识点"
                    this.know.parentId=data.parentId;
                    this.knowsName=node.parent.label;
                    this.dialogVisible4=true;
                }
            },
            doAddKnows(node,data){
                //添加章节
                // 而是选择框中的，因为后端传过来的parentId=-1
                this.postRequest("/baseinfo/knows/chapter",this.know).then(resp=> {
                    if(resp){
                        //this.initDeps();
                       // this.addDep2Deps(this.deps,resp.obj);
                        this.dialogVisible1=false;
                        this.know.name='';//清空输入框
                        this.initKnows();//初始化添加弹窗变量
                    }
                })
            },
            doAddKnows2(node,data){
                //添加知识点
                this.postRequest("/baseinfo/knows/knows",this.know).then(resp=> {
                    if(resp){
                        //this.initDeps();
                        //this.addDep2Deps(this.deps,resp.obj);
                        this.dialogVisible2=false;
                        this.know.name='';//清空输入框
                        this.initKnows();//初始化添加弹窗变量
                    }
                })
            },
            doEditKnows(node,data){
                this.putRequest("/baseinfo/knows/chapter", this.know).then(resp => {
                    if (resp) {
                        this.dialogVisible3=false;
                        this.initKnows();//初始化添加弹窗变量
                    }
                })

            },
            doEditKnows2(node,data){
                this.putRequest("/baseinfo/knows/knows", this.know).then(resp => {
                    if (resp) {
                        this.dialogVisible4=false;
                        this.initKnows();//初始化添加弹窗变量
                    }
                })
            },
            deleteKnows(data){
                console.log(data);
                if(data.parentId==-1){
                    //删除章节
                    if(data.children!=null){
                        this.$message.error("删除失败,请先删除该章节下的知识点！");
                    }else{
                        this.$confirm('此操作将永久删除【'+data.name+'】章节, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.deleteRequest("/baseinfo/knows/chapter/"+data.id).then(resp=>{
                                if(resp){
                                    //删除成功，动态的从数组里面移除一项
                                   this.initKnows();
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    }
                }else{
                    //删除知识点
                    this.$confirm('此操作将永久删除【'+data.name+'】知识点, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/baseinfo/knows/knows/"+data.id).then(resp=>{
                            if(resp){
                                //删除成功，动态的从数组里面移除一项
                                this.initKnows();
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

        }
    }
</script>

<style >
    .knowsBtn{
        padding:2px;
    }
</style>