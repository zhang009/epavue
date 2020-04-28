<template>
    <div>

        <div style="margin-top: 20px">
            <el-button type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <el-divider></el-divider>
       <div style="width: 50%;margin: 0 auto"></div>
            <div style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto" v-if="this.updateTestPaperInfo!=null">
                <div ><!--试卷标题展示-->
                    <div style="display: flex;justify-content: center">
                        <h3>{{updateTestPaperInfo.semester}}</h3>
                    </div>
                     <div style="display: flex;justify-content: center">
                         <h4>{{updateTestPaperInfo.school.name}}{{updateTestPaperInfo.major.name}}{{updateTestPaperInfo.course.name}}{{updateTestPaperInfo.name}}</h4>
                     </div>

                </div>
                <!--单选题-->
                <div v-show="updateTestPaperInfo.sclist&&(updateTestPaperInfo.sclist.length>0)">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                        <strong>一、单选题</strong>
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
                        <div v-for="(mcque,index) in updateTestPaperInfo.mclist">
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
                        <div v-for="(tfque,index) in updateTestPaperInfo.tflist">
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
                        <div v-for="(fbque,index) in updateTestPaperInfo.fblist">
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
                        <div v-for="(qaque,index) in updateTestPaperInfo.qalist">
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
            <div >
                <el-row >
                    <el-col :span="6" :offset="6">
                        创建教师：
                    </el-col>
                    <el-col :span="6">
                    </el-col>
                    <el-col :span="6">
                        更新日期：
                    </el-col>
                </el-row>
            </div>

            <span slot="footer" class="dialog-footer">
                            <el-button type="primary" >确 定</el-button>
                          </span>

    </div>
</template>

<script>
    export default {
        name: "PaperInfo",
        data(){
            return{
                updateTestPaperInfo:{},
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
            }
        },
        created() {
            if(this.$route.params.updateTestPaperInfo){
                this.updateTestPaperInfo=JSON.parse(this.$route.params.updateTestPaperInfo);
            }
        },methods:{
            goBack() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

</style>