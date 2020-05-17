<template>
    <div><!--修改试卷页面，修改页面只能删除试卷的试题-->

        <div style="margin-top: 20px">
            <el-button type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
        </div>
        <el-divider></el-divider>
       <div style="width: 50%;margin: 0 auto;"></div>
            <div style="border-radius: 4px;border: 1px solid #dedede;width: 80%;margin:0 auto;margin-bottom: 10px;padding-bottom: 20px" v-if="this.updateTestPaperInfo!=null">
                <div ><!--试卷标题展示-->
                    <div style="display: flex;justify-content: center">
                        <h3>{{updateTestPaperInfo.semester}}</h3>
                    </div>
                     <div style="display: flex;justify-content: center" v-if="updateTestPaperInfo.school&&updateTestPaperInfo.major&&updateTestPaperInfo.course">
                         <h4>{{updateTestPaperInfo.school.name}}{{updateTestPaperInfo.major.name}}{{updateTestPaperInfo.course.name}}{{updateTestPaperInfo.name}}</h4>
                     </div>

                </div>
                <!--单选题-->
                <div v-show="updateTestPaperInfo.sclist&&(updateTestPaperInfo.sclist.length>0)">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                        <div style="margin-bottom: 20px">
                            <strong>单选题 （共{{updateTestPaperInfo.sclist.length}}小题）</strong>
                        </div>
                        <div v-for="(scque,index) in updateTestPaperInfo.sclist" style="margin-top: 0px">
                            <div>
                                <el-card shadow="hover"  >
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{scque.stem}}</span>
                                        </div>
                                    </div>
                                    <div  class="text"><!--选项-->
                                        <div>A. {{scque.option1}}</div>
                                        <div>B. {{scque.option2}} </div>
                                        <div>C. {{scque.option3}}</div>
                                        <div>D. {{scque.option4}}</div>
                                        <div align="right">
                                            <el-button type="danger" size="mini" @click="deleteHandler(index,'sc')">删除</el-button>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </div>
                <!--多选题-->
                <div v-show="updateTestPaperInfo.mclist&&(updateTestPaperInfo.mclist.length>0)" style="margin-top: 20px">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                        <div style="margin-bottom: 20px">
                            <strong>多选题（共{{updateTestPaperInfo.mclist.length}}小题）</strong>
                        </div>
                        <div v-for="(mcque,index) in updateTestPaperInfo.mclist" >
                            <div>
                                <el-card shadow="hover"  >
                                    <div><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{mcque.stem}}</span>
                                        </div>
                                    </div>
                                    <div class="text"><!--选项-->
                                        <div v-for="(item,indexj) in mcque.options"><!--遍历多选题选项-->
                                            {{optionChar[indexj]}} {{item.optionContent}}
                                        </div>
                                    </div>
                                    <div align="right">
                                        <el-button type="danger" size="mini" @click="deleteHandler(index,'mc')">删除</el-button>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </div>
                <!--判断题-->
                <div v-show="updateTestPaperInfo.tflist&&(updateTestPaperInfo.tflist.length>0)" style="margin-top: 20px">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                        <div style="margin-bottom: 20px">
                         <strong>判断题（共{{updateTestPaperInfo.tflist.length}}小题）</strong>
                        </div>
                        <div v-for="(tfque,index) in updateTestPaperInfo.tflist" >
                            <div>
                                <el-card shadow="hover"  >

                                <div><!--题干-->
                                    <div class="stem text">
                                        {{index+1}}. <span>{{tfque.stem}}</span>
                                        <div align="right">
                                            <el-button type="danger" size="mini" @click="deleteHandler(index,'tf')">删除</el-button>
                                        </div>
                                    </div>
                                </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </div>
                <!--填空题-->
                <div v-show="updateTestPaperInfo.fblist&&(updateTestPaperInfo.fblist.length>0)" style="margin-top: 20px">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center" >
                        <div style="margin-bottom: 20px">
                             <strong>填空题（共{{updateTestPaperInfo.fblist.length}}小题）</strong>
                        </div>
                        <div v-for="(fbque,index) in updateTestPaperInfo.fblist" >
                            <div >
                                <el-card shadow="hover"  >
                                    <div class="text"><!--题干-->
                                        <div class="stem">
                                            {{index+1}}. <span>{{fbque.stem}}</span>
                                        </div>
                                        <div align="right">
                                            <el-button type="danger" size="mini" @click="deleteHandler(index,'fb')">删除</el-button>
                                        </div>
                                    </div>
                                </el-card>

                            </div>
                        </div>
                    </div>
                </div>
                <!--简答题-->
                <div v-show="updateTestPaperInfo.qalist&&(updateTestPaperInfo.qalist.length>0)" style="margin-top: 20px">
                    <div style="margin-left: 25px;margin-top: 15px;margin-right: 15px;align-content: center">
                        <div style="margin-bottom: 20px">
                         <strong>简答题（共{{updateTestPaperInfo.qalist.length}}小题）</strong>
                        </div>
                        <div v-for="(qaque,index) in updateTestPaperInfo.qalist" >
                            <div>
                                <el-card shadow="hover"  >
                                <div class="text"><!--题干-->
                                    <div class="stem">
                                        {{index+1}}. <span>{{qaque.stem}}</span>
                                    </div>
                                    <div align="right">
                                        <el-button type="danger" size="mini" @click="deleteHandler(index,'qa')">删除</el-button>
                                    </div>
                                </div>
                                </el-card>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div >

            </div>

          <div align="right" style="width: 80%;margin: 0 auto; ">
              <el-button type="primary" @click="submitTestPaperInfo" >保存修改</el-button>
          </div>



    </div>
</template>

<script>
    export default {
        name: "PaperUpdate",
        data(){
            return{
                updateTestPaperInfo:{},
                optionChar:['A.',"B.", "C.","D.","E.","F.","G.","H.","I.","J."],//这是为了对应多选题的选项序号
            }
        },
        created() {
            var that=this;
           /* if(this.$route.params.updateTestPaperInfo){
                this.updateTestPaperInfo=JSON.parse(this.$route.params.updateTestPaperInfo);
                console.log(this.updateTestPaperInfo)
            }*/
           /* setTimeout(function () {//这里延迟1秒执行函数，因为需要用到sclist集合，所以得等后端传过来数据之后执行
                if(that.$route.params.updateTestPaperInfo){
                    that.updateTestPaperInfo=JSON.parse(that.$route.params.updateTestPaperInfo);
                }
            },1000);*/

            //判断是否由编辑跳转过来，把传来的信息进行赋值。
             if(this.$route.params.updateTestPaperInfo){
                 let data=JSON.parse(this.$route.params.updateTestPaperInfo);
                 console.log(data);
                 this.updateTestPaperInfo.courseId=data.courseId;
                 this.updateTestPaperInfo.name=data.name;
                 this.updateTestPaperInfo.schoolId=data.schoolId;
                 this.updateTestPaperInfo.majorId=data.majorId;
                 this.updateTestPaperInfo.semester=data.semester;
                 this.updateTestPaperInfo.checkTeacherId=data.checkTeacherId;
                 this.updateTestPaperInfo.queTypes=data.queTypes;
                 this.updateTestPaperInfo.chapterId=data.chapterId;
                 this.updateTestPaperInfo.knowIds=data.knowIds;

                 this.updateTestPaperInfo.totalScore=data.totalScore;
                 this.updateTestPaperInfo.passScore=data.passScore;
                 this.updateTestPaperInfo.school=data.school;
                 this.updateTestPaperInfo.major=data.major;
                 this.updateTestPaperInfo.course=data.course;
                 this.updateTestPaperInfo.id=data.id;

                 //这里需要把试题的序号和list集合的试题对应，这里新建存储试题分数和序号的对象
                 let  testPaperDetailInfo={//详情信息
                     largeQues:[]
                 };
                 //遍历大题数，放入对象
                 if(data.questionScores!=null&&data.questionScores.length>0){
                     let queTypes=data.queTypes.split('@');//取出题型数组

                     for (let i = 0; i < queTypes.length; i++) {//首先根据题型的数量，新建大题
                         if(queTypes[i]!=null&&queTypes[i]!=''){
                             testPaperDetailInfo.largeQues.push({
                                 queType:queTypes[i],
                                 smallQues:[]
                             })
                         }

                     }
                 }

                 let questionScores=data.questionScores;//获取试题数组
                 //遍历小题数，放入对象
                 for (let i = 0; i < questionScores.length; i++) {
                     let qs=questionScores[i];//单个试题
                     for (let j = 0; j < testPaperDetailInfo.largeQues.length; j++) {//遍历大题，把小题放入大题
                         if(qs.queType==testPaperDetailInfo.largeQues[j].queType){
                                 testPaperDetailInfo.largeQues[j].smallQues.push({
                                 queScore:qs.queScore,
                                 questionId:qs.questionId,
                                 sortNum:qs.sortNum
                             })
                         }
                     }
                 }
                 console.log(testPaperDetailInfo)
                 //以上处理过后，testPaperDetailInfo就存储了大题和小题的信息
                 //这里还需要做两件事：1.把试题list集合按照testPaperDetailInfo里面小题的sortNum进行排序，2.并且获取试题的分数信息

                 //定义新的数组存储排序后的试题集合
                 let sclist1=[];
                 let mclist1=[];
                 let tflist1=[];
                 let fblist1=[];
                 let qalist1=[];
                 let scScore='';
                 let mcScore='';
                 let tfScore='';
                 let fbScore=[];
                 let qaScore=[];

                 for (let i = 0; i <testPaperDetailInfo.largeQues.length ; i++) {
                     let largeQue=testPaperDetailInfo.largeQues[i];
                     if(largeQue.queType=="单选题"){
                         scScore=largeQue.smallQues[0].queScore;
                         for (let j = 0; j < largeQue.smallQues.length; j++) {
                             let smallQue=largeQue.smallQues[j];

                             for (let k = 0; k < data.sclist.length; k++) {//这里遍历无序的集合，放入到新集合中
                                 if(data.sclist[k].id==smallQue.questionId){
                                     sclist1.push(data.sclist[k]);
                                 }
                             }
                         }
                        // console.log(sclist1)
                     }else if(largeQue.queType=="多选题"){
                         mcScore=largeQue.smallQues[0].queScore;

                         for (let j = 0; j < largeQue.smallQues.length; j++) {
                             let smallQue=largeQue.smallQues[j];

                             for (let k = 0; k < data.mclist.length; k++) {//这里遍历无序的集合，放入到新集合中
                                 if(data.mclist[k].id==smallQue.questionId){
                                     mclist1.push(data.mclist[k]);
                                 }
                             }
                         }
                     }else if(largeQue.queType=="判断题"){
                         tfScore=largeQue.smallQues[0].queScore;
                         for (let j = 0; j < largeQue.smallQues.length; j++) {
                             let smallQue=largeQue.smallQues[j];

                             for (let k = 0; k < data.tflist.length; k++) {//这里遍历无序的集合，放入到新集合中
                                 if(data.tflist[k].id==smallQue.questionId){
                                     tflist1.push(data.tflist[k]);
                                 }
                             }
                         }
                     }else if(largeQue.queType=="填空题"){
                         for (let j = 0; j < largeQue.smallQues.length; j++) {
                             let smallQue=largeQue.smallQues[j];
                             fbScore.push(smallQue.queScore);
                             for (let k = 0; k < data.fblist.length; k++) {//这里遍历无序的集合，放入到新集合中
                                 if(data.fblist[k].id==smallQue.questionId){
                                     fblist1.push(data.fblist[k]);
                                 }
                             }
                         }
                     }else if(largeQue.queType=="简答题"){
                         for (let j = 0; j < largeQue.smallQues.length; j++) {
                             let smallQue=largeQue.smallQues[j];
                             qaScore.push(smallQue.queScore);
                             for (let k = 0; k < data.qalist.length; k++) {//这里遍历无序的集合，放入到新集合中
                                 if(data.qalist[k].id==smallQue.questionId){
                                     qalist1.push(data.qalist[k]);
                                 }
                             }
                         }
                     }
                 }

                 this.updateTestPaperInfo.sclist=sclist1;
                 this.updateTestPaperInfo.mclist=mclist1;
                 this.updateTestPaperInfo.tflist=tflist1;
                 this.updateTestPaperInfo.fblist=fblist1;
                 this.updateTestPaperInfo.qalist=qalist1;

                 this.updateTestPaperInfo.scScore=scScore;
                 this.updateTestPaperInfo.mcScore=mcScore;
                 this.updateTestPaperInfo.tfScore=tfScore;
                 this.updateTestPaperInfo.qaScore=qaScore;
                 this.updateTestPaperInfo.fbScore=fbScore;
                console.log(this.updateTestPaperInfo);


             }


        },watch:{

        },
        mounted() {


        },
        methods:{
            goBack() {
                this.$router.go(-1);
            },
            deleteHandler(index,type){



                if(type=='sc'){
                    this.$confirm('此操作将删除该单选题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateTestPaperInfo.sclist.splice(index,1);
                        this.$forceUpdate();//强制刷新
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }else if(type=='mc'){
                    this.$confirm('此操作将删除该多选题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateTestPaperInfo.mclist.splice(index,1);
                        this.$forceUpdate();//强制刷新
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }else if(type=='tf'){
                    this.$confirm('此操作将删除该判断题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateTestPaperInfo.tflist.splice(index,1);
                        this.$forceUpdate();//强制刷新
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }else if(type=='fb'){
                    this.$confirm('此操作将删除该填空题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateTestPaperInfo.fblist.splice(index,1);
                        this.$forceUpdate();//强制刷新
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }else if(type=='qa'){
                    this.$confirm('此操作将删除该简答题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.updateTestPaperInfo.qalist.splice(index,1);
                        this.$forceUpdate();//强制刷新
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }
                this.$forceUpdate();//强制刷新
            },
            submitTestPaperInfo(){
                //获取完试卷的信息，提交到后端添加试卷
                this.putRequest("/pap/create/handAddUpdate",this.updateTestPaperInfo).then(resp=> {
                    if(resp){
                        //这里不需要刷新页面，因为啥心y
                      /* var that=this;
                        setTimeout(function () {//这里延迟1秒执行函数，因为需要用到sclist集合，所以得等后端传过来数据之后执行
                            location.reload();//刷新页面
                        },1000);*/
                    }
                })
            },
           /* initData(){
                this.updateTestPaperInfo=JSON.parse(this.$route.params.updateTestPaperInfo);
            }*/
        }
    }
</script>

<style >
    .text{
        line-height:1.7;
        margin-top: 5px;
        margin-left: 20px;

    }
    .stem span{
        white-space:pre
    }

</style>