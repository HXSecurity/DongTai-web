<template>
  <div class="content-warp">
    <el-table :data="tableData" class="strategyManageTable">
      <el-table-column
        :label="$t('views.strategyManage.name')"
        prop="vul_name"
      ></el-table-column>
      <el-table-column
        :label="$t('views.strategyManage.detail')"
        prop="vul_desc"
        min-width="200px"
      ></el-table-column>
      <el-table-column
        :label="$t('views.strategyManage.status')"
        prop="state"
        width="100px"
      >
        <template slot-scope="{ row }">
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
import { StrategyListObj } from '@/views/setting/types'

@Component({ name: 'StrategyManage' })
export default class StrategyManage extends VueBase {
  private tableData: Array<StrategyListObj> = []

  created() {
    this.getTableData()
  }

  private async getTableData() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyList()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
  }

  private async stateChange(id: number, state: string) {
    if (state === 'enable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyDisable(id)
      this.loadingDone()
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      await this.getTableData()
    }
    if (state === 'disable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyEnable(id)
      this.loadingDone()
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
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
  color: #a7afb9;
}

.uninstall {
  cursor: pointer;
  color: #a7afb9;
  margin-left: 18px;
}
</style>
