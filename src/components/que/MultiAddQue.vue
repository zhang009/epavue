<template>
    <div><!--批量导入试题-->
        <div class="content" style="">

            <div>
                <h2>Excel批量导入试题</h2>
                <!--<router-link to="/que/input/importque">-->
                    <el-button type="primary" @click="clickUpload">上传文件</el-button>
             <!--   </router-link>-->

                <el-button type="primary" plain @click="exportQueTemplate">下载模板</el-button>
            </div>

            <el-dialog
                    title="上传试题"
                    :visible.sync="dialogVisible"
                    width="50%"

                    @close="emptyData"
                    :close-on-click-modal="false">
                <div style="display: flex;justify-content: flex-start;">
                    <el-steps :active="activeItemIndex" direction="vertical">
                        <el-step title="选择课程" ></el-step>
                        <el-step title="选择试题审核人"></el-step>
                        <el-step title="上传文件"></el-step>
                    </el-steps>
                    <div style="display: flex;justify-content: center;align-items: center;width: 80%;">
                        <el-form>
                        <div v-show="activeItemIndex==0">

                            <el-form-item  prop="courseId"  >

                                <el-select v-model="courseId"
                                           filterable
                                           placeholder="请选择课程(可搜索）"
                                           @change="selectCourseChanged"
                                           size="large"
                                           style="width: 250px;">
                                    <el-option
                                            v-for="item in courses"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div v-show="activeItemIndex==1">

                            <el-form-item  prop="checkTeacherId"  >
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
                                            :value="item.id"><!--这里knows.children为课程列表-->
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div v-show="activeItemIndex==2">

                            <el-upload
                                    v-loading.fullscreen.lock="loading"
                                    element-loading-text="拼命解析数据中..."
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.7)"
                                    :on-error="onError"
                                    :on-success="onSuccess"
                                    :show-file-list="false"
                                    :before-upload="beforeUpload"
                                    :disabled="importDataDisabled"
                                    style="display: inline-flex;margin-right: 8px"
                                    :data="importData"
                                    action="/question/input/import?courseId=">
                                <el-button :disabled="importDataDisabled" type="primary" :icon="importDataBtnIcon">
                                    <!-- <i class="fa fa-level-up" aria-hidden="true" icon="el-icon-download"/>-->
                                    {{importDataBtnText}}<!--导入数据-->
                                </el-button>
                            </el-upload>
                        </div>
                        </el-form>
                    </div>

                </div>
                <div style="display: flex;align-items: center;justify-content: center;padding: 0px;margin: 0px;">
                   <span slot="footer" class="dialog-footer">
                    <el-button @click="preStep">{{activeItemIndex==3?'取消':'上一步'}}</el-button>
                    <el-button type="primary" @click="nextStep">{{activeItemIndex==2?'完成':'下一步'}}</el-button>
                   </span>
                </div>

            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MultiAddQue",
        data(){
         return{
             dialogVisible:false,
             courseId:'',
             checkTeacherId:'',
             courses:[],
             checkTeachers:[],
             loading:false,
             importDataDisabled:false,
             importDataBtnText:'导入数据',
             importDataBtnIcon:'el-icon-upload2',
             activeItemIndex: 0,
             importData:{
                 courseId:'',
                 checkTeacherId:''
             }

         }
        },
        mounted() {
            this.initCourse();
            this.initCheckTeachers();
            console.log(this.$router.options);
        },methods:{
            clickUpload(){
                    this.dialogVisible=true;
            },
            exportQueTemplate(){//导出试题下载模板
                window.open('/question/input/export','_parent');
            },

            emptyData(){

            },selectCourseChanged(){

            },
            selectCheckTeacherChanged(){

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
            onError(response,file,fileList){
                this.loading=false;
                this.$message.error('数据导入失败！');

            },
            onSuccess(response,file,fileList){
                this.loading=false;
                this.dialogVisible=false;
                this.importDataBtnText='导入数据';
                this.importDataBtnIcon='el-icon-upload2';
                this.importDataDisabled=false;

                this.dialogVisible = false;
                this.checkTeacherId='',
                    this.courseId='',
                    this.activeItemIndex=0;
                this.$message({
                    message: '导入数据成功！',
                    type: 'success'
                });

             /*   this.initUsers();*/
            },
            beforeUpload(){//上传之前事件
                this.importData.checkTeacherId=this.checkTeacherId;
                this.importData.courseId=this.courseId;
                this.loading=true;
                this.importDataBtnText='正在导入';
                this.importDataBtnIcon='el-icon-loading';
                this.importDataDisabled=true;
            },
            preStep() {
                if (this.activeItemIndex == 0) {
                    return;
                } else if (this.activeItemIndex == 3) {
                    //关闭对话框
                    this.dialogVisible = false;
                    return;
                }
                this.activeItemIndex--;
            },
            nextStep() {
                if (this.activeItemIndex == 2) {
                    /*if (this.salary.id) {
                        this.putRequest("/salary/sob/", this.salary).then(resp=>{
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        })
                    } else {
                        this.postRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        });
                    }
                    return;*/

                    this.dialogVisible = false;
                    this.checkTeacherId='',
                        this.courseId='',
                        this.activeItemIndex=0;

                    this.importDataBtnText='导入数据';
                    this.importDataBtnIcon='el-icon-upload2';
                    this.importDataDisabled=false;
                    return;
                }
                this.activeItemIndex++;
            },
        }
    }
</script>

<style >

    .content{
     /*   background-color: #dedede;*/
        display: flex;
        align-items:center;
        justify-content:center;

        text-align: justify;
        width: 300px;
        height: 500px;
        margin:0 auto;

    }


</style>