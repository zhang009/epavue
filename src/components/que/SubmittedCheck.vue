<template>
    <div>
        <!--<div class="submitCheckMain">
            <el-table
                    :data="receivedChecklist"
                    border
                    stripe
                    @selection-change="handleSelectionChange"
                    size="small"
                    style="width: 70%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        type="index"
                        label="编号"
                        fixed
                        width="80">&lt;!&ndash;   prop="id"&ndash;&gt;
                    <template slot-scope="scope">
                        <span>{{(page - 1) * size + scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="checkTeacherId"
                        label="审核人"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="postTeacherId"
                        label="提交人"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="queType"
                        width="120px"
                        label="题型">
                </el-table-column>
                <el-table-column
                        prop="queStem"
                        width="120px"
                        :show-overflow-tooltip='true'
                        label="题干">
                </el-table-column>
                <el-table-column
                        prop="postTime"
                        width="120px"
                        label="提交时间">
                </el-table-column>
                <el-table-column
                        label="审核状态">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status">未审核</el-tag>
                        <el-tag type="info" v-else>已审核</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">&lt;!&ndash;slot-scope的出现实现了父组件调用子组件内部的数据，子组件的数据通过slot-scope属性传递到了父组件&ndash;&gt;

                        <el-button
                                size="mini"
                                @click="showPassView(scope.row)">通过</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="showRefuseView(scope.$index, scope.row)">拒绝</el-button>
                        <el-button
                                size="mini"
                                @click="showDetailView(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                    size="mini"
                    type="danger"
                    style="margin-top:8px "
                    @click="checkMany" :disabled="multipleSelection.length==0">批量审核</el-button>&lt;!&ndash;批量删除&ndash;&gt;
            <div style="text-align: center">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="sizes, prev, pager, next, jumper, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>-->
    </div>
</template>

<script>
    export default {
        name: "SubmittedCheck",

    }
</script>

<style scoped>

</style>