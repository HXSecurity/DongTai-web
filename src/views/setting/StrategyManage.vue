<template>
  <div class="content-warp">
    <div class="total-bar">
      <el-button
        v-if="userInfo.role === 1 || userInfo.role === 2"
        size="small"
        class="btn-border"
        icon="el-icon-circle-plus-outline"
        @click="toPath(undefined, undefined)"
        >{{ $t('views.strategyManage.addTitle') }}</el-button
      >
      <div class="search-box">
        <el-input
          v-model="searchValue"
          size="small"
          :placeholder="$t('views.strategyManage.searchValue')"
          @keyup.enter.native="getTableData"
        ></el-input>
        <el-button class="btn search" @click="getTableData">
          {{ $t('views.sensitiveManage.search') }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" class="strategyManageTable" border>
      <el-table-column
        :label="$t('views.strategyManage.name')"
        prop="vul_name"
        min-width="260px"
      >
        <template slot-scope="{ row }">
          <div class="two-line vul_name" @click="toPath(1, row.id)">
            {{ row.vul_name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('views.strategyManage.level')"
        prop="level_id"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>
            {{ vul_levels_map[row.level_id] }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('views.strategyManage.status')"
        prop="state"
        min-width="140px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div @click="stateChange(row.id, row.state)">
            <el-switch
              :disabled="userInfo.role !== 1 && userInfo.role !== 2"
              :value="row.state === 'enable'"
              active-color="#1A80F2"
              inactive-color="#C1C9D3"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="userInfo.role === 1 || userInfo.role === 2"
        :label="$t('views.strategyManage.settings')"
        min-width="160px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div class="table-btn-box">
            <el-button
              v-if="!row.isEdit"
              type="text"
              size="small"
              style="color: #4a72ae"
              @click="toPath(undefined, row.id)"
              >{{ $t('views.strategyManage.edit') }}</el-button
            >
            <span class="l"> | </span>
            <el-button
              style="color: #f56262"
              size="small"
              type="text"
              @click="deleteManage(row)"
              >{{ $t('views.strategyManage.del') }}</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        background
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page_size"
        layout=" prev, pager, next, jumper, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { StrategyListObj } from '@/views/setting/types'

@Component({ name: 'StrategyManage' })
export default class StrategyManage extends VueBase {
  private tableData: Array<StrategyListObj> = []
  private showDialog = false
  private searchValue = ''
  private vul_levels = []
  private vul_levels_map = {}
  private page = 1
  private page_size = 20
  private total = 0
  private dialogForm: any = {
    vul_name: '',
    vul_type: '',
    state: '',
    vul_desc: '',
    level_id: undefined,
    vul_fix: '',
  }
  private toPath(view: any, id: any) {
    this.$router.push({
      name: 'strategy',
      query: {
        view,
        id,
      },
    })
  }
  async getVulLevels() {
    this.loadingStart()
    const res = await this.services.setting.vul_levels()
    this.loadingDone()
    if (res.status === 201) {
      this.vul_levels = res.data
      this.vul_levels.forEach((item: any) => {
        this.$set(this.vul_levels_map, item.id, item.name_value)
      })
    } else {
      this.$message.error(res.msg)
    }
  }
  async created() {
    await this.getVulLevels()
    await this.getTableData()
  }
  addStrategy() {
    this.showDialog = true
  }
  editStrategy(row: any) {
    this.dialogForm = JSON.parse(JSON.stringify(row))
    this.showDialog = true
  }
  dialogEnter() {
    if (this.dialogForm.id) {
      this.editStrategyApi()
    } else {
      this.addStrategyApi()
    }
  }
  async addStrategyApi() {
    const { status, msg } = await this.services.setting.addManage({
      vul_name: this.dialogForm.vul_name,
      vul_desc: this.dialogForm.vul_desc,
      vul_fix: this.dialogForm.vul_fix,
      vul_type: this.dialogForm.vul_name,
      level_id: this.dialogForm.level_id,
      state: this.dialogForm.state,
    })
    if (status === 201) {
      this.$message.success(msg)
      this.getTableData()
      this.dialogClose()
    } else {
      this.$message.error(msg)
    }
  }
  async editStrategyApi() {
    this.loadingStart()
    const { status, msg } = await this.services.setting.updateManage(
      this.dialogForm.id,
      {
        vul_name: this.dialogForm.vul_name,
        vul_desc: this.dialogForm.vul_desc,
        vul_fix: this.dialogForm.vul_fix,
        vul_type: this.dialogForm.vul_name,
        level_id: this.dialogForm.level_id,
        state: this.dialogForm.state,
      }
    )
    this.loadingDone()
    if (status === 201) {
      this.$message.success(msg)
      this.getTableData()
      this.dialogClose()
    } else {
      this.$message.error(msg)
    }
  }
  dialogClose() {
    this.showDialog = false
    this.dialogForm = {
      vul_name: '',
      vul_type: '',
      state: '',
      vul_desc: '',
      level_id: undefined,
      vul_fix: '',
    }
  }
  get userInfo(): { username: string; role: number } {
    return this.$store.getters.userInfo
  }

  private backItem = {}
  private editStart(item: any) {
    this.showDialog = true
    this.dialogForm = JSON.parse(JSON.stringify(item))
  }

  private async deleteManage(item: any) {
    if (this.tableData.some((i: any) => i.isEdit)) {
      this.$message({
        type: 'warning',
        message: this.$t('views.strategyManage.warning') as string,
        showClose: true,
      })
      return
    }
    this.$confirm(
      this.$t('views.strategyManage.deleteWarning') as string,
      this.$t('views.strategyManage.deletePop') as string,
      {
        confirmButtonText: this.$t('views.strategyManage.enter') as string,
        cancelButtonText: this.$t('views.strategyManage.clear') as string,
        type: 'warning',
      }
    ).then(async () => {
      const { status, msg } = await this.services.setting.deleteManage(item.id)
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
      } else {
        this.$message({ type: 'success', message: msg, showClose: true })
        await this.getTableData()
      }
    })
  }

  private async editEnd(item: any, flag: boolean) {
    if (flag) {
      const { status, msg } = await this.services.setting.updateManage(
        item.id,
        { name: item.vul_name, vul_desc: item.vul_desc, vul_fix: item.vul_fix }
      )
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
      } else {
        this.$message({ type: 'success', message: msg, showClose: true })
      }
    } else {
      for (const key in item) {
        item[key] = this.backItem[key]
      }
      this.backItem = {}
    }
    this.$set(item, 'isEdit', false)
  }

  private async handleCurrentChange(page: number) {
    this.page = page
    await this.getTableData()
  }

  private handleSizeChange(val: number) {
    this.page_size = val
    this.getTableData()
  }

  private async getTableData() {
    this.loadingStart()
    const { status, msg, data, page } =
      await this.services.setting.strategyList(false, {
        page: this.page,
        page_size: this.page_size,
        name: this.searchValue,
      })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    if (data.length === 0 && this.page > 1) {
      this.page--
      await this.getTableData()
      return
    }
    this.total = page.alltotal
    this.tableData = data
  }

  private async stateChange(id: number, state: string) {
    if (this.userInfo.role !== 1 && this.userInfo.role !== 2) {
      return
    }
    if (state === 'enable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyDisable(id)
      this.loadingDone()
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
        return
      }
      await this.getTableData()
    }
    if (state === 'disable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyEnable(id)
      this.loadingDone()
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
        return
      }
      await this.getTableData()
    }
  }
}
</script>

<style scoped lang="scss">
.vul_name {
  color: rgba(26, 128, 242, 1);
  cursor: pointer;
}
.content-warp {
  padding: 38px 14px 40px 14px;
}

.install {
  cursor: pointer;
  color: #a7afb9;
}
.search-box {
  display: flex;
  align-items: center;
  ::v-deep.el-input__inner {
    border-right: none;
    border-radius: 0;
  }
}

.uninstall {
  cursor: pointer;
  color: #a7afb9;
  margin-left: 18px;
}
.btn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  &.search {
    height: 34px;
    margin-left: -1px;
  }
}
.two-line {
  font-size: 14px;
}
.total-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.pagination-box {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.btn-border {
  border-radius: 2px;
  color: #4a72ae;
  border-color: #4a72ae;
}
.strategyManageTable {
  margin-top: 16px;
  &.el-table {
    ::v-deepth {
      background: #f6f8fa;
    }
  }
}
.table-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    font-size: 14px;
  }
  .l {
    color: #38435a;
    line-height: 14px;
    padding: 4px 4px 8px 4px;
    display: inline-block;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
