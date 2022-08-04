<template>
  <main class="container">
    <div class="main-warp">
      <el-table
        class="sca-list"
        :data="tableData"
        style="width: 100%; margin-top: 18px; cursor: pointer"
        @cell-click="showMethodPool"
      >
        <el-table-column
          :label="'url' /*$t('views.scaList.tableHeaders.name')*/"
          prop="url"
          min-width="240px"
        ></el-table-column>
        <el-table-column
          :label="'uri' /*$t('views.scaList.tableHeaders.version')*/"
          prop="uri"
          width="80px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.http_method')"
          prop="http_method"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.language')"
          prop="language"
          width="100px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.req_header')"
          prop="req_header"
          width="100px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.method_pool')"
          prop="method_pool"
          width="500px"
          @click="showMethodPool(method_pool)"
        >
        </el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.context_path')"
          prop="context_path"
          width="80px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.create_time')"
          prop="create_time"
          width="160px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.update_time')"
          prop="update_time"
          width="160px"
        ></el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="temp_title"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer">
        <p v-if="temp_header === null" v-html="temp_json"></p>
        <p v-if="temp_json === null" v-html="temp_header"></p>
        <el-button @click="dialogVisible = false">{{
          $t('views.scaList.tableHeaders.clear')
        }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          $t('views.scaList.tableHeaders.enter')
        }}</el-button>
      </span>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'

@Component({ name: 'TaintPool' })
export default class TaintPool extends VueBase {
  private page = 1
  private pageSize = 20
  private dataEnd = false
  private tableData: any = []
  private Base64 = require('js-base64').Base64

  private temp_title = ''
  private temp_header = null
  private temp_json = null
  private dialogVisible = false

  created() {
    this.getTableData()
  }
  private reset() {
    this.newSelectData()
  }

  private newSelectData() {
    this.page = 1
    this.tableData = []
    this.getTableData()
  }

  mounted() {
    window.addEventListener('scroll', this.myScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.myScroll)
  }

  private myScroll() {
    const bottomWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 1
    if (bottomWindow) {
      if (!this.dataEnd) {
        this.page += 1
        this.getTableData()
      }
    }
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
    }
    this.loadingStart()
    const { status, data, msg } = await this.services.taint.methodList(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    const tableData = data.reduce((list: any, item: any) => {
      list.push({
        ...item,
        create_time: formatTimestamp(item.create_time),
        update_time: formatTimestamp(item.update_time),
        req_header: this.Base64.decode(item.req_header),
      })
      return list
    }, [])
    if (tableData.length < 20) {
      this.dataEnd = true
    }
    this.tableData = [...this.tableData, ...tableData]
  }

  projectNameSplit(name: string, total: number) {
    if (name.length > total) {
      return name.substring(0, total)
    }
    return name
  }

  showMethodPool(row: any, column: any, cell: any, event: any) {
    this.temp_header = null
    this.temp_json = null
    if (column.label === this.$t('views.scaList.tableHeaders.method_pool')) {
      this.temp_title = column.label
      this.temp_json = row.method_pool
    } else if (
      column.label === this.$t('views.scaList.tableHeaders.req_header')
    ) {
      this.temp_title = column.label
      this.temp_header = row.req_header.replace(/\n/gm, '<br/>')
    }
    this.dialogVisible = true
  }

  handleClose(done: any) {
    this.$confirm(this.$t('views.scaList.tableHeaders.close') as string).then(
      (_) => {
        done()
      }
    )
  }
}
</script>

<style scoped lang="scss">
.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.slider-warp {
  width: 234px;
  margin-top: 78px;
  background: #fff;
  overflow: auto;
  padding: 0 6px 20px 6px;
  height: calc(100vh - 103px);

  .title {
    height: 54px;
    border-bottom: 1px solid #e6e9ec;
    font-size: 18px;
    font-weight: normal;
    color: #4a72ae;

    .resetAllBtn {
      width: 72px;
      height: 28px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 2px;
      color: #fff;
    }
  }

  .module-title {
    margin-top: 28px;
    margin-bottom: 24px;
    font-size: 16px;
    color: #38435a;
  }

  .reset-btn {
    color: #4a72ae;
    cursor: pointer;
  }

  .module-line {
    cursor: pointer;
    padding-left: 5px;
    height: 38px;
    line-height: 38px;

    &:hover {
      background: #f6f8fa;
    }

    .selectOption {
      color: #4b99f1;
      font-size: 14px;
    }

    .num {
      color: #959ea9;
      font-size: 14px;
    }
  }

  .selectedLine {
    background: #f6f8fa;

    .selectOption {
      color: #0366d6;
    }
  }
}

.main-warp {
  padding-top: 14px;
  //   margin-left: 248px;
  padding-bottom: 32px;

  .selectForm {
    width: 100%;

    .selectInput {
      float: right;
    }
  }
}
</style>
