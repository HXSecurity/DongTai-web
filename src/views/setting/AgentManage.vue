<template>
  <div class="content-warp">
    <el-table :data="tableData" class="agentManageTable" header-align="center">
      <el-table-column
        :label="$t('views.agentManage.projectName')"
        prop="project_name"
        width="120px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.project_name"
            placement="top-start"
            :disabled="row.project_name.length < 14"
          >
            <div class="dot">
              <span>{{ row.project_name }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.agentManage.address')"
        prop="server"
        width="180px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.server"
            placement="top-start"
            :disabled="row.server.length < 20"
          >
            <div class="dot">
              <span>{{ row.server }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        width="400"
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
        :label="$t('views.agentManage.status')"
        prop="running_status"
        width="90px"
      >
        <template slot-scope="{ row }">
          <div>
            {{ row.running_status }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="160px" :label="$t('views.agentManage.timestapm')">
        <template slot-scope="scope">
          {{ scope.row.latest_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="rolesCheck(['system_admin', 'talent_admin'], true)"
        :label="$t('views.agentManage.owner')"
        prop="owner"
        width="120px"
      ></el-table-column>

      <el-table-column
        :label="$t('views.agentManage.manage')"
        width="140px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <div class="icon-box">
            <i
              v-if="row.running_status == '未运行'"
              class="icon el-icon-video-play"
              @click="agentInstall(row.id)"
            ></i>
            <i
              v-else
              class="icon el-icon-video-pause"
              @click="agentUninstall(row.id)"
            ></i>
            <i class="icon el-icon-delete" @click="doDelete(row.id)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Agent" width="320" prop="token">
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.token"
            placement="top-start"
            :disabled="row.token.length < 45"
          >
            <div class="dot">
              <span>{{ row.token }}</span>
            </div>
          </el-tooltip>
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
  private pageSize = 10
  private currentPageSize = 0
  private currentPageDelete = 0
  private deleteDialogOpen = false
  private deleteSelectId = 0

  created() {
    this.getTableData()
  }

  private currentChange(val: number | string) {
    this.page = parseInt(`${val}`)
    this.getTableData()
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
    }
    this.loadingStart()
    const { status, msg, data, page } = await this.services.setting.agentList(
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
      this.$message.error(msg)
      return
    }
    await this.getTableData()
  }

  private async agentUninstall(id: string | number) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentUninstall({
      id: parseInt(`${id}`),
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
      this.$message.error(msg)
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
</style>
