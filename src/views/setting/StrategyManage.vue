<template>
  <div class="content-warp">
    <el-table :data="tableData" class="strategyManageTable">
      <el-table-column :label="$t('views.strategyManage.name')" prop="vul_name"></el-table-column>
      <el-table-column :label="$t('views.strategyManage.detail')" prop="vul_desc" min-width="200px"></el-table-column>
      <el-table-column :label="$t('views.strategyManage.status')" prop="state" width="100px">
        <template slot-scope="{row}">
          <div @click="stateChange(row.id, row.state)">
            <el-switch
              :value="row.state === 'enable'"
              active-color="#1A80F2"
              inactive-color="#C1C9D3"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'StrategyManage' })
export default class StrategyManage extends VueBase {
  private tableData: Array<object> = []

  created () {
    this.getTableData()
  }

  private async getTableData () {
    const { status, msg, data } = await this.services.setting.strategyList()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
  }

  private async stateChange (id: number, state: string) {
    if (state === 'enable') {
      const { status, msg } = await this.services.setting.strategyDisable(id)
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      this.$message.success(msg)
      await this.getTableData()
    }
    if (state === 'disable') {
      const { status, msg } = await this.services.setting.strategyEnable(id)
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      this.$message.success(msg)
      await this.getTableData()
    }
  }
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 38px 14px 40px 14px;
}

.install {
  cursor: pointer;
  color: #A7AFB9;
}

.uninstall {
  cursor: pointer;
  color: #A7AFB9;
  margin-left: 18px;
}
</style>
