<template>
  <div class="content-warp">
    <div class="tool-bar">
      <div class="selectForm">
        <div class="select-item">运行状态：</div>
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
          placeholder="请输入搜索条件"
          @input="searchTable"
        ></el-input>
      </div>
    </div>
    <div class="button-bar">
      <div style="color: rgb(56, 67, 90)">
        已选中
        <span style="color: rgb(74, 114, 174)">{{
          multipleSelection.length
        }}</span>
        条
      </div>
      <div>
        <el-button size="small" class="resetAllBtn" @click="agentStart(0)"
          >启用</el-button
        >
        <el-button size="small" class="resetAllBtn" @click="agentStop(0)"
          >禁用</el-button
        >
        <el-button size="small" class="resetAllBtn" @click="deleteAgents"
          >删除</el-button
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
            {{ row.system_load }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.flow')"
        prop="is_core_running"
        width="100px"
      >
        <template slot-scope="{ row }">
          <div>
            {{ (row.flow || 0) + ' 次' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.status')"
        prop="is_core_running"
        width="120px"
      >
        <template slot-scope="{ row }">
          <div>
            {{ row.is_core_running == 1 ? '核心组件运行中' : '核心组件未运行' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.healthy')"
        prop="running_status"
        width="90px"
      >
        <template slot-scope="{ row }">
          <div>
            {{ row.running_status == '未运行' ? '下线' : '正常' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="160px" :label="$t('views.agentManage.timestapm')">
        <template slot-scope="scope">
          {{ scope.row.latest_time | formatTimestamp }}
        </template>
      </el-table-column>
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
      <el-table-column
        :label="$t('views.agentManage.manage')"
        width="140px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <div class="icon-box">
            <template v-if="row.is_control === 1">
              <i class="icon el-icon-loading"></i>
            </template>
            <template v-else>
              <i
                v-if="row.is_core_running == 0"
                class="icon el-icon-video-play"
                @click="agentStart(row.id)"
              ></i>
              <i
                v-else
                class="icon el-icon-video-pause"
                @click="agentStop(row.id)"
              ></i>
            </template>

            <i class="icon el-icon-delete" @click="doDelete(row.id)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Agent" width="320" prop="token">
        <template slot-scope="{ row }">
          <div class="dot">
            {{ row.token }}
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
    <el-dialog :visible.sync="deleteDialogOpen" title="删除引擎" width="25%">
      <div style="text-align: center">
        <p style="color: #959fb4">引擎删除后，相关的数据将一并删除，不可恢复</p>
        <p style="color: #959fb4; margin-top: 14px">请确认是否删除？</p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button class="confirmDel" @click="agentDelete">
          确认删除
        </el-button>
        <el-button class="cancelDel" @click="deleteDialogOpen = false">
          取消
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
    { value: 1, label: '运行中' },
    { value: 0, label: '未运行' },
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
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      state: this.state,
    }
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.agentList(params)
    this.loadingDone()
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
    console.log(this.tableData, dataMap)
    this.tableData.forEach((item: any) => {
      for (const key in item) {
        item[key] = dataMap[item.id][key]
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
    this.currentPageSize = data.length
    this.total = page.alltotal
    this.currentPageDelete = 0
    console.log(this.currentPageSize)
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
    this.$confirm('此操作将永久删除该引擎, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
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
}
</style>
