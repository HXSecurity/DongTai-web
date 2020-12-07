<template>
  <main class="container">
    <div class="select-warp flex-column-center">
      <div style="display: none">
        <el-select>
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label=".NET" value=".NET"></el-option>
        </el-select>
      </div>
      <div style="text-align: right">
        <el-input
          v-model="searchObj.name"
          style="width: 462px"
          size="mini"
          @keyup.enter.native="newSelectData"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
    </div>
    <div class="list-warp"></div>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { ProjectListParams } from './types'

@Component({ name: 'ProjectManage' })
export default class ProjectManage extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private tableData: Array<ProjectListParams> = []
  private searchObj = {
    name: '',
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      name: this.searchObj.name,
    }
    this.loadingStart()
    const { status, msg, data, page } = await this.services.project.projectList(
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
}
</script>

<style scoped lang="scss">
.select-warp {
  height: 70px;
  width: 100%;
}

.list-warp {
  width: 100%;
  background: #fff;
}
</style>
