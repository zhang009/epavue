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

            <el-tree
                    v-loading="loading"
                    element-loading-text="正在加载数据..."
                    element-loading-spinner="el-icon-loading"

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
                          class="depBtn"
                          @click="() => showAddDepView(data)">
                    添加章节
                  </el-button>
                  <el-button
                          size="mini"
                          type="danger"
                          class="depBtn"
                          @click="() => deleteDep( data)">
                    删除章节
                  </el-button>-->

                </span>
              </span>
            </el-tree>
           <!-- <el-dialog
                    title="添加部门"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag>上级部门</el-tag></td>
                            <td>{{pname}}
                                &lt;!&ndash;<el-select v-model="pname" style="width: 200px" placeholder="请选择" size="mini">
                                    <el-option
                                            v-for="item in this.deps"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>&ndash;&gt;
                            </td>
                        </tr>
                        <tr>
                            <td><el-tag>部门名称</el-tag></td>
                            <td><el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input></td>
                        </tr>
                    </table>

                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
            </el-dialog>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "KnowStruMana",
        data(){
            return{
                searchValue:{/*条件搜索值*/
                    schoolId:'',
                    majorId:'',
                    classId:'',
                    courseId:''
                },
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

        }
    }
</script>

<style scoped>

</style>