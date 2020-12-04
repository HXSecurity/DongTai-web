<template>
  <div class="content-warp">
    <el-table :data="tableData" class="strategyManageTable">
      <el-table-column label="Agent" prop="token"></el-table-column>
      <el-table-column :label="$t('views.strategyManage.name')" prop="vul_name"></el-table-column>
      <el-table-column :label="$t('views.strategyManage.detail')" prop="vul_desc"></el-table-column>
      <el-table-column :label="$t('views.strategyManage.status')" prop="state">
        <template slot-scope="{row}">
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <!--      <el-table-column :label="$t('views.strategyManage.operate')" width="100px">-->
      <!--        <template slot-scope="{row}">-->
      <!--          {{row}}-->
      <!--          <i class="iconfont iconxiazai-2 install" ></i>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
