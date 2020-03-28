<template>
    <div>
        <el-divider></el-divider><!--分割线-->

    <div style="width: 600px"> <!--部门管理页面-->

        <!--这里的搜索框也是elementUI种的组件-->

            <el-input
                    placeholder="请输入学校部门名称进行搜索"
                    v-model="filterText"
                    prefix-icon="el-icon-search">
            </el-input>

        <el-tree
                :data="deps"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                style="margin-top: 10px"
                ref="tree"><!--data为所有的部门，filterNode为过滤的方法-->
             <span class="custom-tree-node" style="display:flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }"><!--node为当前的元素，data为服务端返回的当前的jsonOjbect（node的数据）-->
                <span>{{ node.label }}</span><!--在这里node.label=data.name-->
                <span>
                  <el-button
                          type="primary"
                          size="mini"
                          class="depBtn"
                          @click="() => showAddDepView(data)">
                    添加部门
                  </el-button>
                  <el-button
                          size="mini"
                          type="danger"
                          class="depBtn"
                          @click="() => deleteDep( data)">
                    删除部门
                  </el-button>

                </span>
              </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>上级部门</el-tag></td>
                        <td>{{pname}}
                            <!--<el-select v-model="pname" style="width: 200px" placeholder="请选择" size="mini">
                                <el-option
                                        v-for="item in this.deps"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>-->
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
        </el-dialog>
    </div>
    </div>
</template>

<script>
    export default {
        name: "SysDep",
        data(){
            return{
                dialogVisible:false,/*对话框是否可见*/
                filterText:'',/*搜索输入的部门名称*/
                deps:[],/*所有部门的json数组*/
                dep:{/*所要添加部门的数据*/
                    name:'',
                    parentId:-1
                },
                pname:'',/*当前部门名字，相对与添加的部门为父部门*/
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        watch: {
            filterText(val) {//当搜索框（filterText）的值发生变化的时候会触发此方法，val即为filterText的最新值
                this.$refs.tree.filter(val);
                /*这里的filter即为过滤的方法，即filterNode(value, data)*/
            }
        },
        mounted() {
            this.initDeps();
        },
        methods:{
            initDep(){
                this.dep={
                    name:'',
                    parentId:-1
                },
                    this.pname=''
            },
            initDeps(){
                this.getRequest("/baseinfo/department/").then(resp=> {
                    if (resp) {
                        this.deps=resp;
                    }
                })
            },addDep2Deps(deps,dep){//解决添加部门之后，弹窗收起问题
                for(let i=0;i<deps.length;i++){
                    let d=deps[i];
                    if(d.id=dep.parentId){
                        d.children=d.children.concat(dep);
                        if(d.children.length>0){//解决添加完子部门的部门，可以删除的问题
                            d.parent=true;
                        }
                        return;
                    }else{
                        this.addDep2Deps(d.children,dep);
                    }
                }
            }
            ,filterNode(value, data) {//value为filterText的最新值，data为json数组的每一项
                if (!value) return true;/*这里的data即为每一行的json对象，如果有值的话给我留着，如果没有值则给去除掉*/
                return data.name.indexOf(value) !== -1;/*默认的label改为了name*/
            },
            showAddDepView(data){/*展示添加部门对话框*/
                console.log(data);
                this.pname=data.name;
                this.dep.parentId=data.id;
                this.dialogVisible=true;
            },
            doAddDep(){
                this.postRequest("/baseinfo/department/",this.dep).then(resp=> {
                    if(resp){
                        //this.initDeps();
                        this.addDep2Deps(this.deps,resp.obj);
                        this.dialogVisible=false;
                        this.initDep();//初始化添加弹窗变量

                    }
                })

            },
            deleteDep(data){
                console.log(data);
                if(data.parent){
                    this.$message.error("父部门删除失败");
                }else{
                    this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/baseinfo/department/"+data.id).then(resp=>{
                            if(resp){
                                //删除成功，动态的从数组里面移除一项
                                this.removeDepFromDeps(null,this.deps,data.id);

                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }

            }, removeDepFromDeps(p,deps,id){
                for(let i=0;i<deps.length;i++){
                    let d=deps[i];
                    if(d.id==id){
                        deps.splice(i,1);//从数组里面移除一项，deps也就是树里面的children
                        //如果parent的长度为0，就要修改父部门的属性
                        //获取父部门
                        if(deps.length==0){
                            p.parent=false;
                        }
                        return;
                    }else{
                        this.removeDepFromDeps(d,d.children,id);
                    }
                }
            },
        }
    }
</script>

<style >
    .depBtn{
        padding:2px;
    }
</style>