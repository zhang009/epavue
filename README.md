菜单项数据加载成功之后，在前端有几个可以存放的地方

1.sessionStorage
2.localStorage
3.vuex状态管理
此项目存放在vuex中，因为菜单数据加载完之后需要在多处使用，也就是在许多个.vue文件中使用，所以这里要把它放到所有的vue文件都能够访问到的地方
vuex比较安全，不会被人轻易到的看到，便于数据共享