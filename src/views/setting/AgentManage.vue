<template>
  <div class="content-warp">
    <div class="tool-bar">
      <div class="selectForm">
        <div class="select-item">{{ $t('views.agentManage.state') }}：</div>
        <div
          v-for="item in stateOptions"
          :key="item.value"
          class="select-item"
          :class="item.value === state && 'active'"
          @click="changeState(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="tool-bar">
        <el-input
          v-model="searchValue"
          style="margin-left: 12px"
          size="small"
          :placeholder="$t('views.agentManage.searchValue')"
          @input="searchTable"
        ></el-input>
      </div>
    </div>
    <div class="button-bar">
      <div style="color: rgb(56, 67, 90)">
        {{ $t('views.agentManage.choose') }}
        <span style="color: rgb(74, 114, 174)">{{
          multipleSelection.length
        }}</span>
        {{ $t('views.agentManage.strip') }}
      </div>
      <div>
        <el-button
          size="small"
          class="resetAllBtn"
          :disabled="!state"
          @click="agentStart(0)"
        >
          {{ $t('views.agentManage.on') }}</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn"
          :disabled="!state"
          @click="agentStop(0)"
        >
          {{ $t('views.agentManage.off') }}</el-button
        >
        <el-button size="small" class="resetAllBtn" @click="deleteAgents">
          {{ $t('views.agentManage.del') }}</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      class="agentManageTable"
      header-align="center"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.projectName')"
        prop="project_name"
        width="120px"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.project_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.address')"
        prop="server"
        width="180px"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.server }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        width="150"
        :label="$t('views.agentManage.payload')"
        prop="system_load"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.system_load ? row.system_load.rate : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="
          $t('views.agentManage.flow') +
          ' (' +
          $t('views.agentManage.step') +
          ')'
        "
        prop="is_core_running"
        width="140px"
      >
        <template slot-scope="{ row }">
          <div>{{ row.flow || 0 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        :label="
          $t('views.agentManage.method_queue') +
          ' (' +
          $t('views.agentManage.item') +
          ')'
        "
        prop="server"
        width="170px"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.method_queue }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="
          $t('views.agentManage.replay_queue') +
          ' (' +
          $t('views.agentManage.item') +
          ')'
        "
        width="160px"
        prop="server"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.replay_queue }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="
          $t('views.agentManage.report_queue') +
          ' (' +
          $t('views.agentManage.item') +
          ')'
        "
        width="160px"
        prop="server"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.report_queue }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('views.agentManage.status')"
        prop="is_core_running"
        width="130px"
      >
        <template slot-scope="{ row }">
          <div>
            {{
              row.is_core_running == 1
                ? $t('views.agentManage.is_core_running')
                : $t('views.agentManage.is_core_not_running')
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.healthy')"
        prop="running_status"
        width="130px"
      >
        <template slot-scope="{ row }">
          <div>
            {{
              row.running_status == '未运行'
                ? $t('views.agentManage.offline')
                : $t('views.agentManage.normal')
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="170px" :label="$t('views.agentManage.timestapm')">
        <template slot-scope="scope">
          {{ scope.row.latest_time | formatTimestamp }}
          <el-popover placement="top-start" width="170" trigger="hover">
            <p style="font-size: 12px; color: #ccc; margin-bottom: 6px">
              Agent 注册时间:
            </p>
            <p>{{ scope.row.register_time | formatTimestamp }}</p>
            <i slot="reference" class="el-icon-info"></i>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        v-if="userInfo.role === 1 || userInfo.role === 2"
        :label="$t('views.agentManage.startupTime')"
        prop="startup_time"
        width="180px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.owner')"
        prop="owner"
        width="120px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.language')"
        prop="language"
        width="120px"
      >
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.language }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Agent" width="320" prop="alias">
        <template slot-scope="{ row }">
          <div v-if="!row.isEdit" style="display: flex; align-items: center">
            <div class="dot" style="width: 280px" :title="row.alias">
              {{ row.alias }}
            </div>
            <i class="edit-icon el-icon-edit" @click="openEdit(row)"></i>
          </div>
          <div
            v-else
            style="display: flex; align-items: center"
            class="edit-agent"
          >
            <el-input
              v-model="row.alias"
              maxlength="100"
              style="width: 280px"
            ></el-input>
            <span class="alias-num">{{ row.alias.length }}/100</span>
            <i class="edit-icon el-icon-check" @click="enterEdit(row)"></i>
            <i class="edit-icon el-icon-close" @click="closeEdit(row)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.manage')"
        width="140px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <div class="icon-box">
            <template v-if="row.is_control === 1">
              <i
                class="icon el-icon-loading"
                :class="!state && 'icon-disabled'"
              ></i>
            </template>
            <template v-else>
              <i
                v-if="row.is_core_running == 0"
                class="icon el-icon-video-play"
                :class="!state && 'icon-disabled'"
                @click="agentStart(row.id)"
              ></i>
              <i
                v-else
                class="icon el-icon-video-pause"
                :class="!state && 'icon-disabled'"
                @click="agentStop(row.id)"
              ></i>
            </template>

            <i class="icon el-icon-delete" @click="doDelete(row.id)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float: right"
      :total="total"
      :current-page="page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      @current-change="currentChange"
    ></el-pagination>
    <el-dialog
      :visible.sync="deleteDialogOpen"
      :title="$t('views.agentManage.delAgent')"
      width="25%"
    >
      <div style="text-align: center">
        <p style="color: #959fb4">{{ $t('views.agentManage.agentDelInfo') }}</p>
        <p style="color: #959fb4; margin-top: 14px">
          {{ $t('views.agentManage.agentDelPop') }}
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button class="confirmDel" @click="agentDelete">
          {{ $t('views.agentManage.enterDel') }}
        </el-button>
        <el-button class="cancelDel" @click="deleteDialogOpen = false">
          {{ $t('views.agentManage.clear') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { AgentListObj } from '@/views/setting/types'
import { formatTimestamp } from '@/utils/utils'

@Component({
  name: 'AgentManage',
  filters: {
    formatTimestamp(date: number | any) {
      return formatTimestamp(date)
    },
  },
})
export default class AgentManage extends VueBase {
  private tableData: Array<AgentListObj> = []
  private total = 0
  private page = 1
  private state = 1
  private pageSize = 10
  private currentPageSize = 0
  private currentPageDelete = 0
  private deleteDialogOpen = false
  private deleteSelectId = 0
  private stateOptions = [
    { value: 1, label: this.$t('views.agentManage.running') },
    { value: 0, label: this.$t('views.agentManage.not_running') },
  ]
  private searchValue = ''
  private multipleSelection = []
  created() {
    this.getTableData()
    this.timer = setInterval(() => {
      this.reflashTable()
    }, 5000)
  }
  private timer: any
  private timeOuter: any
  private searchTable() {
    if (this.timeOuter) {
      clearTimeout(this.timeOuter)
      this.timeOuter = null
    } else {
      setTimeout(() => {
        this.getTableData()
      }, 400)
    }
  }

  private openEdit(item: any) {
    item.isEdit = true
    item.backAlias = item.alias
  }

  private closeEdit(item: any) {
    item.isEdit = false
    item.alias = item.backAlias
  }

  get userInfo() {
    return this.$store.getters.userInfo
  }

  private async enterEdit(item: any) {
    const res = await this.services.setting.aliasModified({
      id: item.id,
      alias: item.alias,
    })
    if (res.status === 201) {
      this.$message.success(res.msg)
      item.isEdit = false
    } else {
      this.$message.error(res.msg)
    }
  }

  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  private beforeDestroy() {
    clearInterval(this.timer)
  }
  private changeState(item: any) {
    this.state = item.value
    this.page = 1
    this.getTableData()
    if (this.state == 1) {
      this.timer = setInterval(() => {
        this.getTableData()
      }, 5000)
    } else {
      clearInterval(this.timer)
      this.timer = null
    }
  }
  private currentChange(val: number | string) {
    this.page = parseInt(`${val}`)
    this.getTableData()
  }

  private async reflashTable() {
    if (this.tableData.some((item: any) => item.isEdit)) {
      return
    }
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      state: this.state,
    }
    const { status, msg, data } = await this.services.setting.agentList(params)
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    const dataMap = {}
    data &&
      data.forEach((item: any) => {
        return (dataMap[item.id] = item)
      })
    this.tableData.forEach((item: any) => {
      for (const key in item) {
        item[key] = dataMap[item.id][key]
      }
      try {
        item.system_load = JSON.parse(item.system_load)
      } catch (err) {
        item.system_load = { rate: 0 }
      }
    })
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      state: this.state,
      token: this.searchValue,
    }
    this.loadingStart()
    const { status, msg, data, page } = await this.services.setting.agentList(
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
    this.tableData = data
    this.tableData.forEach((item: any) => {
      this.$set(item, 'isEdit', false)
      this.$set(item, 'backAlias', '')
      try {
        item.system_load = JSON.parse(item.system_load)
      } catch (err) {
        item.system_load = { rate: 0 }
      }
    })
    this.currentPageSize = data.length
    this.total = page.alltotal
    console.log(this.total)
    this.currentPageDelete = 0
  }

  private async agentInstall(id: string | number) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentInstall({
      id: parseInt(`${id}`),
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
    await this.getTableData()
  }

  private async deleteAgents() {
    if (this.multipleSelection.length === 0) {
      this.$message.warning(
        this.$t('views.agentManage.selectWarning') as string
      )
      return
    }
    this.$confirm(
      this.$t('views.agentManage.delAgentInfo') as string,
      this.$t('views.agentManage.delAgentPop') as string,
      {
        confirmButtonText: this.$t(
          'views.agentManage.confirmButtonText'
        ) as string,
        cancelButtonText: this.$t(
          'views.agentManage.cancelButtonText'
        ) as string,
        type: 'warning',
      }
    ).then(async () => {
      this.loadingStart()
      const params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
      const { status, msg } = await this.services.setting.deleteAgents(params)
      this.loadingDone()
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
      await this.getTableData()
    })
  }

  private async agentStart(id: any) {
    if (!this.state) {
      return
    }
    if (id === 0) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('views.agentManage.selectWarning') as string
        )
        return
      }
    }
    this.loadingStart()
    let params = {}
    if (id) {
      params = { id: parseInt(id) }
    } else {
      params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
    }
    const { status, msg } = await this.services.setting.agentStart(params)
    this.loadingDone()
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
    await this.getTableData()
  }

  private async agentStop(id: any) {
    if (!this.state) {
      return
    }
    if (id === 0) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('views.agentManage.selectWarning') as string
        )
        return
      }
    }
    this.loadingStart()
    let params: any
    if (id) {
      params = { id: parseInt(id) }
    } else {
      params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
    }
    const { status, msg } = await this.services.setting.agentStop(params)
    this.loadingDone()
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
    await this.getTableData()
  }

  private async agentUninstall(id: string | number) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentUninstall({
      id: parseInt(`${id}`),
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
    await this.getTableData()
  }

  private async doDelete(id: string | number) {
    this.deleteDialogOpen = true
    this.deleteSelectId = parseInt(`${id}`)
  }

  private async agentDelete() {
    this.deleteDialogOpen = false
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentDelete({
      id: this.deleteSelectId,
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
    this.currentPageDelete = this.currentPageDelete + 1
    if (this.currentPageDelete === this.currentPageSize) {
      this.page = this.page - 1
    }
    await this.getTableData()
    this.deleteSelectId = 0
  }
}
</script>

<style scoped lang="scss">
.tool-bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  align-items: center;
}
.button-bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  align-items: center;
}
.selectForm {
  display: flex;
  padding: 0 10px 16px;
  .select-item {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-align: center;
    line-height: 28px;
    cursor: context-menu;
  }
  .select-item + .select-item {
    color: #959fb4;
    cursor: pointer;
    margin-left: 12px;
    width: 80px;
    height: 28px;
    border-radius: 28px;
  }
  .select-item.active {
    color: #4a72ae;
    background: aliceblue;
  }
}
.icon-box {
  cursor: pointer;
  display: flex;
  align-items: center;
  .icon {
    font-size: 18px;
    line-height: 100%;
    color: #888;
    + .icon {
      margin-left: 12px;
    }
  }
}

.content-warp {
  padding: 38px 14px 40px 14px;
}

.dot {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.install {
  cursor: pointer;
  color: #a7afb9;
}

.uninstall {
  cursor: pointer;
  color: #a7afb9;
  margin-left: 18px;
}
.resetAllBtn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  &:hover {
    background: #4a72ae;
    color: #fff;
    border-radius: 2px;
  }
}
.icon-disabled {
  cursor: not-allowed;
}

.edit-icon {
  margin-left: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #4a72ae;
  &.el-icon-close {
    color: red;
  }
}
.edit-agent {
  position: relative;
  .alias-num {
    position: absolute;
    display: inline-block;
    width: 60px;
    right: 42px;
    top: 9px;
    color: #959fb4;
  }
  /deep/.el-input__inner {
    background: #e6f8ea;
    border: none;
    padding: 0;
    padding-right: 60px;
  }
}
</style>
