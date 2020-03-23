<template>
    <div>
        <el-divider></el-divider><!--分割线-->
        <!--权限管理页面-->
        <div class="permissManaMain">
            <!--手风琴折叠面板-->
            <el-collapse v-model="activeName"   accordion @change="change"><!--v-model="activeName"-->
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card"><!--卡片-->
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <!--<el-button style="float: right; padding: 3px 0;color: #ff0000" icon="el-icon-delete" type="text"
                                       @click="deleteRole(r)"></el-button>-->
                        </div>
                        <div><!--菜单项-->
                            <el-tree
                                    ref="tree"
                                    show-checkbox
                                    node-key="id"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="allmenus" :props="defaultProps" >
                            </el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>

                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysAuth",
        data(){
            return{
                activeName:-1,//手风琴激活面板
                role:{
                    name:'',
                    nameZh:''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'//展示出来的文本
                },
                allmenus:[],//所有的菜单资源
                selectedMenus:[],/*默认选中的菜单资源*/
                roles:[],/*后端传来的角色*/
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            cancelUpdate(){
                this.activeName=-1;
            },
            doUpdate(rid,index){//更新资源列表
                let tree=this.$refs.tree[index]; // 获取选中的资源id
                let selectedKeys=tree.getCheckedKeys(true);
                // console.log(selectedKeys);
                let url='/system/basic/permiss/?rid='+rid;
                selectedKeys.forEach(key=>{
                    url+='&mids='+key;
                })
                this.putRequest(url).then(resp=>{
                    if(resp){
                        // this.initRoles();
                        this.activeName=-1;//收起面板
                    }
                })
            },
            change(rid){//点击面板展开时响应
                if(rid){
                    this.initAllMenus();//获取所有的资源
                    this.initSelectedMenus(rid);//获取选中的资源
                }
            },
            initSelectedMenus(rid){//获取初始化选中菜单资源
                this.getRequest("/system/basic/permiss/mids/"+rid).then(resp=>{/*返回值为mid数组*/
                    if(resp){
                        this.selectedMenus=resp;
                    }
                })
            },
            initAllMenus(){//初始化所有资源列表
                this.getRequest("/system/basic/permiss/menus").then(resp=>{
                    if(resp){
                        this.allmenus=resp;
                    }
                })
            },
            initRoles(){//初始化所有角色
                this.getRequest("/system/basic/permiss/").then(resp=>{
                    if(resp){
                        this.roles=resp;
                    }
                })

            }
        }
    }
</script>

<style >
    .permissManaMain{
        margin-top: 10px;
        width: 900px;

    }
    .permissManaTool{
        display: flex;

    }
    .permissManaTool .el-input{
        width: 300px;
        margin-right: 3px;
    }
</style>