<template>
  <main>
    应用漏洞列表
  </main>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'VulnList' })
export default class VulnList extends Vue {
  page: number = 1;
  tableData: Array<object> = []

  create () {
    this.getTableData()
  }

  private async getTableData () {
    const params = {}
    const { status, data, msg } = await this.$services.vuln.vulnList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
  }
}
</script>

<style scoped lang='scss'>

</style>
