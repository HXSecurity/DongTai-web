<template>
  <div class="content-warp">
    <el-table :data="tableData" class="agentManageTable">
      <el-table-column label="Agent" prop="token"></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.address')"
        prop="server"
        min-width="50px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.payload')"
        prop="system_load"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.status')"
        prop="running_status"
        width="90px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.owner')"
        prop="owner"
        width="120px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.agentManage.timestapm')"
        :prop="formatTimestamp(latest_time)"
      ></el-table-column>
      <el-table-column :label="$t('views.agentManage.manage')" width="100px">
        <template slot-scope="{ row }">
          <i
            class="iconfont iconshengji install"
            @click="agentInstall(row.id)"
          ></i>
          <i
            class="iconfont iconshanchu-4 uninstall"
            @click="agentUninstall(row.id)"
          ></i>
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
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { AgentListObj } from '@/views/setting/types'

@Component({ name: 'AgentManage' })
export default class AgentManage extends VueBase {
  private tableData: Array<AgentListObj> = []
  private total = 0
  private page = 1
  private pageSize = 20

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
    this.total = page.alltotal
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
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 38px 14px 40px 14px;
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
