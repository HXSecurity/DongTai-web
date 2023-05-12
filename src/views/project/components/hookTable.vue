<template>
  <div class="table-body">
    <div class="btn-list-batch">
      <span style="color: #38435a">
        {{ $t('views.hookPage.selected') }}
        <span style="color: #4a72ae">{{ multipleSelection.length }} </span
        >{{ $t('views.hookPage.strip') }}
      </span>
      <div>
        <el-button
          size="small"
          class="resetAllBtn open"
          @click="hookDialog = true"
          >{{ $t('views.projectEdit.add') }}</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn delete"
          @click="changeStatusBatch('delete')"
          >{{ multipleSelection.length ? '' : $t('views.hookPage.all')
          }}{{ $t('views.hookPage.del') }}</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      class="hookTable"
      border
      :header-row-style="{
        color: '#000',
        fontWeight: 600,
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :fixed="tableData.length ? 'left' : false"
      >
      </el-table-column>
      <template slot="empty">
        <div class="empty-box">
          <span>{{ $t('views.hookPage.empty') }}</span>
        </div>
      </template>
      <el-table-column
        align="left"
        prop="rule_detail"
        :label="$t('views.projectEdit.prefix')"
        :fixed="tableData.length ? 'left' : false"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('views.hookPage.address')"
        align="center"
        width="200"
        :fixed="tableData.length ? 'right' : false"
      >
        <template slot-scope="scope">
          <div class="table-btn-box">
            <el-button
              type="text"
              size="small"
              style="color: #4a72ae"
              @click="editRow(scope.row)"
            >
              {{ $t('views.hookPage.edit') }}
            </el-button>
            <span class="l"> | </span>
            <el-popconfirm
              :title="$t('views.hookPage.delpop')"
              @confirm="changeStatus(scope.row, 'delete')"
            >
              <el-button
                slot="reference"
                style="color: #f56262"
                size="small"
                type="text"
                >{{ $t('views.hookPage.del') }}</el-button
              >
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout=" prev, pager, next, jumper,total, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="hookDialog">
      <el-form
        :model="recoForm"
        size="small"
        :label-width="$i18n.locale === 'en' ? '100px' : '60px'"
      >
        <el-form-item :label="$t('views.projectEdit.prefix')">
          <el-input
            v-model="recoForm.prefix"
            :placeholder="$t('views.projectEdit.ruleInfoPlaceholder')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="clearHook">{{
          $t('views.hookPage.clear')
        }}</el-button>
        <el-button size="small" type="primary" @click="enterHook">{{
          $t('views.hookPage.enter')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueBase from '../../../VueBase'
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
@Component({
  name: 'HookTable',
  filters: {
    formatTimestamp(date: number | any) {
      return formatTimestamp(date)
    },
  },
})
export default class HookTable extends VueBase {
  @Prop({ default: '0', type: String }) ruleType!: string
  @Prop({ default: '1', type: String }) projectId!: string
  hookDialog = false
  hookType = {
    type: '1',
    name: '',
    short_name: '',
    enable: 1,
  }
  title = '新增'

  types = []
  multipleSelection = []
  handleSelectionChange(val: any) {
    this.multipleSelection = val
    // console.log('this.multipleSelection', this.multipleSelection)
  }
  recoForm = {
    id: 0,
    type: 0,
    prefix: '',
  }
  tableData = []
  pageSize = 20
  currentPage = 1
  total = 0

  async editRow(row: any) {
    this.title = '编辑'
    this.recoForm.id = row.pk
    this.hookDialog = true
    this.recoForm.prefix = row.rule_detail
  }

  async changeStatusBatch(op: string) {
    let str = ''
    switch (op) {
      case 'delete':
        str = this.$t('views.hookPage.del') as string
        break
      case 'enable':
        str = this.$t('views.hookPage.on') as string
        break
      case 'disable':
        str = this.$t('views.hookPage.off') as string
        break
    }
    this.$confirm(
      `${this.$t('views.hookPage.changeOne')}${str}${this.$t(
        'views.hookPage.changeTwo'
      )}`,
      this.$t('views.hookPage.pop') as string,
      {
        confirmButtonText: this.$t('views.hookPage.enter') as string,
        cancelButtonText: this.$t('views.hookPage.clear') as string,
        type: 'warning',
      }
    )
      .then(async () => {
        let obj: any = {
          delete_type: 2,
          project_id: Number(this.projectId),
          rule_type: Number(this.ruleType),
        }
        const ids = this.multipleSelection.map((item: any) => item.pk)
        if (this.multipleSelection.length !== 0) {
          obj.delete_ids = ids
        } else {
          this.currentPage = 1
          obj.delete_type = 1
        }
        const { status, msg } = await this.services.project.deleteRecognizeRule(
          obj
        )
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
        await this.getTable()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async changeStatus(row: any, status = '') {
    this.loadingStart()
    const obj = await this.services.project.deleteRecognizeRule({
      delete_ids: [row.pk - 0],
      delete_type: 2,
      rule_type: Number(this.ruleType),
      project_id: Number(this.projectId),
    })
    this.loadingDone()
    if (obj.status !== 201) {
      this.$message({
        showClose: true,
        message: obj.msg,
        type: 'error',
      })
      return
    }
    await this.getTable()
  }

  clearHook() {
    this.recoForm = {
      id: 0,
      type: Number(this.ruleType),
      prefix: '',
    }
    this.hookDialog = false
  }
  fmtParams(arr: any) {
    let pStr = ''
    let str = ''
    arr.forEach((item: any) => {
      if (item.origin === 'P' && !pStr) {
        pStr += `${item.relation}${item.origin}${item.param}`
      } else if (item.origin === 'P' && pStr) {
        pStr += `,${item.param}`
      } else {
        str += `${item.relation}${item.origin}`
      }
    })
    return str + pStr
  }
  async enterHook() {
    if (this.recoForm.id) {
      this.loadingStart()
      console.log(this.recoForm)
      const { status, msg } = await this.services.project.putRecognizeRuleById({
        rule_id: this.recoForm.id,
        rule_type: Number(this.ruleType),
        project_id: Number(this.projectId),
        rule_detail: this.recoForm.prefix,
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
      await this.getTable()
      this.clearHook()
    } else {
      this.loadingStart()
      const { status, msg } = await this.services.project.postRecognizeRule({
        rule_type: Number(this.ruleType),
        project_id: Number(this.projectId),
        rule_detail: this.recoForm.prefix,
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
      await this.getTable()
      this.clearHook()
    }
  }
  async getTable() {
    this.loadingStart()
    const { status, msg, data, page } =
      await this.services.project.getRecognizeRule({
        page: this.currentPage,
        pageSize: this.pageSize,
        rule_type: Number(this.ruleType),
        project_id: Number(this.projectId),
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
    this.total = page.alltotal
    if (data.length === 0 && this.currentPage > 1) {
      this.currentPage--
      await this.getTable()
      return
    }
    this.tableData = data
  }
  handleSizeChange(val: number) {
    this.pageSize = val
    this.currentPage = 1
    this.getTable()
  }
  handleCurrentChange(val: number) {
    this.currentPage = val
    this.getTable()
  }
  created() {
    this.getTable()
  }
}
</script>

<style scoped lang="scss">
.table-body {
  // padding: 20px;
  .pagination-box {
    padding-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    .search-input {
      width: 140px;
      margin-right: 10px;
    }
  }
}
.resetAllBtn {
  border: 1px solid #4a72ae;
  border-radius: 2px;
  background: #fff;
  color: #4a72ae;
}
.btn-list-batch {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  .stop {
    background: #e6e9ec;
    border-radius: 2px;
    color: #38435a;
    border: 1px solid #e6e9ec;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .open {
    border-radius: 2px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .delete {
    border: 1px solid #f56262;
    box-sizing: border-box;
    border-radius: 2px;
    background: #fff;
    color: #f56262;
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
::v-deep.el-table th {
  background: #f8f9fb;
}
.hookTable {
  &.el-table {
    ::v-deepth {
      background: #f6f8fa;
    }
  }
}
.table-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .el-button {
    box-sizing: border-box;
    font-size: 14px;
  }
  .l {
    color: #38435a;
    line-height: 14px;
    padding: 4px 4px 8px 4px;
    display: inline-block;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
