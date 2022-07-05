<template>
  <main>
    <div class="titleLine flex-row-space-between">
      {{ $t('log.title') }}
      <div class="btn-warp">
        <el-button type="text" class="btn" @click="logExport">
          <i class="iconfont icondaochu-5"></i>
          {{ $t('log.exportBtn') }}
        </el-button>
        <el-button type="text" class="btn" @click="deleteDialogShow">
          <i class="iconfont iconshanchu-6"></i>
          {{ $t('log.deleteBtn') }}
        </el-button>
        <el-button type="text" class="btn" @click="clearDialogOpen = true">
          <i class="iconfont icon7-7xiaochugeshi"></i>
          {{ $t('log.clearBtn') }}
        </el-button>
      </div>
    </div>
    <el-table class="logListTable" :data="tableData" border>
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
        :label="$t('log.username')"
        prop="username"
        width="200px"
      ></el-table-column>
      <el-table-column
        :label="$t('log.handle')"
        prop="change_message"
      ></el-table-column>
      <el-table-column
        :label="$t('log.handleTime')"
        prop="action_time"
        width="170px"
      ></el-table-column>
    </el-table>
    <div class="flex-row-space-between">
      <el-checkbox
        v-model="selectAllPage"
        style="margin-top: 10px; margin-left: 10px"
        @change="selectAllChange"
        >{{ $t('log.selectAllPage') }}</el-checkbox
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
    <el-dialog
      :visible.sync="deleteDialogOpen"
      :title="$t('log.deleteTitle')"
      width="25%"
    >
      <div style="text-align: center">
        <p style="color: #959fb4">{{ $t('log.deleteInfo') }}</p>
        <p style="color: #959fb4; margin-top: 14px">
          {{ $t('log.deleteDesc') }}
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="confirmDel" @click="logDelete">
          {{ $t('log.deleteEnter') }}
        </el-button>
        <el-button
          type="text"
          class="cancelDel"
          @click="deleteDialogOpen = false"
        >
          {{ $t('log.deleteClear') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="clearDialogOpen"
      :title="$t('log.clearTitle')"
      width="25%"
    >
      <div style="text-align: center">
        <p style="color: #959fb4">{{ $t('log.deleteInfo') }}</p>
        <p style="color: #959fb4; margin-top: 14px">
          {{ $t('log.clearDesc') }}
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="confirmDel" @click="logClear">
          {{ $t('log.clearEnter') }}
        </el-button>
        <el-button
          type="text"
          class="cancelDel"
          @click="clearDialogOpen = false"
        >
          {{ $t('log.clearClear') }}
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { LogItem } from './types'

@Component({ name: 'LogManage' })
export default class LogManage extends VueBase {
  private deleteDialogOpen = false
  private clearDialogOpen = false
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
    this.loadingStart()
    const { status, msg, data, total } = await this.services.setting.logList(
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.selectIdSet = []
    this.tableData = data
    this.total = total
  }

  private deleteDialogShow() {
    if (this.selectIdSet.length <= 0) {
      this.$message({
        showClose: true,
        message: this.$t('log.choseLog') as string,
        type: 'error',
      })
      return
    }
    this.deleteDialogOpen = true
  }
  private async logDelete() {
    const params = {
      ids: this.selectIdSet.join(','),
    }
    const { status, msg } = await this.services.setting.logDelete(params)
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
    this.deleteDialogOpen = false
    this.selectAllPage = false
    await this.getTableData()
  }
  private async logClear() {
    const { status, msg } = await this.services.setting.logClear()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
    this.clearDialogOpen = false
    await this.getTableData()
  }
  private async logExport() {
    if (this.selectIdSet.length <= 0) {
      this.$message({
        showClose: true,
        message: this.$t('log.choseLog') as string,
        type: 'error',
      })
      return
    }
    window.open(`/api/v1/log/export?ids=${this.selectIdSet.join(',')}`)
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

.confirmDel {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}

.cancelDel {
  width: 124px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}

.logListTable {
  &.el-table {
    ::v-deepth {
      background: #f6f8fa;
    }
  }
}
</style>
