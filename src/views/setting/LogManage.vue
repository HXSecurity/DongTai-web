<template>
  <main>
    <div class="titleLine flex-row-space-between">
      日志管理
      <div class="btn-warp">
        <el-button type="text" class="btn">
          <i class="iconfont icondaochu-5"></i>
          导出
        </el-button>
        <el-button type="text" class="btn" @click="logDelete">
          <i class="iconfont iconshanchu-6"></i>
          删除
        </el-button>
        <el-button type="text" class="btn">
          <i class="iconfont icon7-7xiaochugeshi"></i>
          清空
        </el-button>
      </div>
    </div>
    <el-table class="logListTable" :data="tableData">
      <el-table-column width="40px">
        <template slot-scope="{ row }">
          <div @click.prevent="selectIdChange(row.log_id)">
            <el-checkbox
              :value="selectIdSet.some((item) => item === row.log_id)"
            ></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        width="200px"
      ></el-table-column>
      <el-table-column label="操作" prop="change_message"></el-table-column>
      <el-table-column
        label="操作时间"
        prop="action_time"
        width="170px"
      ></el-table-column>
    </el-table>
    <div class="flex-row-space-between">
      <el-checkbox
        v-model="selectAllPage"
        style="margin-top: 10px; margin-left: 10px"
        @change="selectAllChange"
        >本页全选</el-checkbox
      >
      <el-pagination
        style="text-align: right; margin-top: 10px"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { LogItem } from './types'

@Component({ name: 'LogManage' })
export default class LogManage extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private tableData: Array<LogItem> = []
  private selectIdSet: Array<number> = []
  private selectAllPage = false

  created() {
    this.getTableData()
  }

  private selectIdChange(id: number) {
    const curSet = new Set([...this.selectIdSet])
    if (curSet.has(id)) {
      curSet.delete(id)
    } else {
      curSet.add(id)
    }
    this.selectIdSet = [...curSet]
  }

  private selectAllChange() {
    if (this.selectAllPage) {
      this.selectIdSet = this.tableData.map((item: LogItem) => {
        return item.log_id
      })
    } else {
      this.selectIdSet = []
    }
  }

  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
    }

    const { status, msg, data, total } = await this.services.setting.logList(
      params
    )
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.selectIdSet = []
    this.tableData = data
    this.total = total
  }
  private async logDelete() {
    const params = {
      ids: this.selectIdSet.join(','),
    }
    const { status, msg } = await this.services.setting.logDelete(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.$message.success(msg)
    await this.getTableData()
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}

.titleLine {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #38435a;

  .btn-warp {
    .btn {
      width: 80px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid #4a72ae;
      line-height: 0;
      font-size: 14px;
      color: #4a72ae;

      i {
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }
}
</style>
