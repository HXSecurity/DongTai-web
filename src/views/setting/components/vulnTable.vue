<template>
  <div class="table-body">
    <div class="flex-between">
      <div :style="{ display: 'flex', flex: 1 }">
        <el-select
          v-model="rule_type"
          class="search-input"
          size="small"
          :placeholder="$t('views.hookPage.selectType')"
          filterable
          clearable
          @change="handleCurrentChange(1)"
        >
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.vul_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          v-model="keyword"
          size="small"
          style="width: 260px"
          class="search-input"
          :placeholder="$t('views.hookPage.searchDesc')"
          @keyup.enter.native="handleCurrentChange(1)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleCurrentChange(1)"
          ></el-button>
        </el-input>
      </div>
      <div>
        <el-button
          size="small"
          style="visibility: hidden"
          class="resetAllBtn"
          @click="hookTypeDialog = true"
          ><i class="el-icon-plus"></i>
          {{ $t('views.hookPage.addHookType') }}</el-button
        >
        <el-button size="small" class="resetAllBtn" @click="hookDialog = true"
          ><i class="el-icon-plus"></i>
          {{ $t('views.hookPage.addHook') }}</el-button
        >
      </div>
    </div>
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
          @click="changeStatusBatch(1)"
          >{{ multipleSelection.length ? '' : $t('views.hookPage.all')
          }}{{ $t('views.hookPage.on') }}</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn stop"
          @click="changeStatusBatch(0)"
          >{{ multipleSelection.length ? '' : $t('views.hookPage.all')
          }}{{ $t('views.hookPage.off') }}</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn delete"
          @click="changeStatusBatch(-1)"
          >{{ multipleSelection.length ? '' : $t('views.hookPage.all')
          }}{{ $t('views.hookPage.del') }}</el-button
        >
      </div>
    </div>
    <el-table
      class="hookTable"
      :data="tableData"
      style="width: 100%"
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
        prop="strategy__vul_name"
        :label="$t('views.hookPage.hooksType')"
        width="180"
        :fixed="tableData.length ? 'left' : false"
      >
      </el-table-column>
      <el-table-column
        prop="value"
        :label="$t('views.hookPage.ruleInfo')"
        width="240"
      >
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.create_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column prop="user__username" label="创建者" width="100">
      </el-table-column>

      <el-table-column
        align="center"
        header-align="center"
        :label="$t('views.hookPage.status')"
        :fixed="tableData.length ? 'right' : false"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#37D7BB"
            inactive-color="#D9DDE1"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        :label="$t('views.hookPage.address')"
        width="200"
        align="center"
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
              @confirm="deleteVuln(scope.row)"
            >
              <el-button
                slot="reference"
                size="small"
                style="color: #f56262"
                type="text"
                >{{ $t('views.hookPage.del') }}</el-button
              >
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      background
      layout=" prev, pager, next, jumper,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog :visible.sync="hookTypeDialog">
      <el-form
        :model="hookType"
        :label-width="$i18n.locale === 'en' ? '140px' : '80px'"
        size="small"
      >
        <el-form-item :label="$t('views.hookPage.hookType')">
          <span>{{ fmtType(hookType.type) }}</span>
        </el-form-item>
        <el-form-item label="语言">
          <span>{{ activeLanguageName }}</span>
        </el-form-item>
        <el-form-item :label="$t('views.hookPage.typeName')">
          <el-input
            v-model="hookType.name"
            :placeholder="$t('views.hookPage.namePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.hookPage.typeShotName')">
          <el-input
            v-model="hookType.short_name"
            :placeholder="$t('views.hookPage.shotNamePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.hookPage.openOrNot')">
          <el-switch
            v-model="hookType.enable"
            active-color="#37D7BB"
            inactive-color="#D9DDE1"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="clearHookType">{{
          $t('views.hookPage.clear')
        }}</el-button>
        <el-button size="small" type="primary" @click="enterHookType">{{
          $t('views.hookPage.enter')
        }}</el-button>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="hookDialog">
      <el-form
        :model="hook"
        size="small"
        :label-width="$i18n.locale === 'en' ? '140px' : '80px'"
      >
        <el-form-item :label="$t('views.hookPage.hookType')">
          <span>{{ fmtType(hook.type) }}</span>
        </el-form-item>
        <el-form-item :label="$t('views.hookPage.hookType')">
          <el-select
            v-model="hook.strategy_id"
            size="small"
            placeholder="请选择规则类型"
            filterable
            clearab
          >
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.vul_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('views.hookPage.ruleInfo')">
          <el-input
            v-model="hook.value"
            type="textarea"
            placeholder="请输入规则详情，例：'and 1=1"
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
  @Prop({ default: 1, type: Number }) activeLanguage!: number
  @Prop({ default: '', type: String }) activeLanguageName!: string
  @Prop({
    default: function () {
      return true
    },
    type: Function,
  })
  getBase!: any

  keyword = ''
  hookTypeDialog = false
  hookDialog = false
  rule_type = ''
  hookType = {
    type: '1',
    name: '',
    short_name: '',
    enable: 1,
    language_id: this.activeLanguage,
  }
  types = []
  hook = {
    id: 0,
    strategy_id: '',
    language_id: this.activeLanguage,
    value: '',
    status: 1,
    type: '5',
  }
  relations = [
    { label: this.$t('views.hookPage.or'), value: '|' },
    { label: this.$t('views.hookPage.and'), value: '&' },
  ]
  origins = [
    { label: this.$t('views.hookPage.O'), value: 'O' },
    { label: this.$t('views.hookPage.R'), value: 'R' },
    { label: this.$t('views.hookPage.P'), value: 'P' },
  ]
  tableData = []
  pageSize = 20
  currentPage = 1
  total = 0

  multipleSelection = []
  handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  async changeStatusBatch(op: any) {
    let str = ''
    switch (op) {
      case 2:
        str = this.$t('views.hookPage.del') as string
        break
      case 1:
        str = this.$t('views.hookPage.on') as string
        break
      case 0:
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
        if (this.multipleSelection.length === 0) {
          this.changeStatusAll(op)
          return
        }
        const ids = this.multipleSelection.map((item: any) => item.id)
        const { status, msg } = await this.services.setting.changeVulStatus({
          ids: ids,
          mode: 1,
          status: op,
        })
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
        await this.getBase()
        await this.getTable()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  splitAndIn(str: string, key: string) {
    const arr = str.split(key)
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 != 0) {
        arr.splice(i, 0, key)
        i++
      }
    }
    return arr
  }

  makeParamsArr(arr: any) {
    function fmtParams(params: string, symb: string) {
      const objArr: { relation: string; origin: string; param: string }[] = []
      if (params[0] === 'P') {
        const paramsStr = params.substring(1, params.length)
        const paramsArr = paramsStr.split(',')
        paramsArr.forEach((item) => {
          if (objArr.some((i) => i.origin === 'P')) {
            objArr.push({ relation: '&', origin: 'P', param: item })
          } else {
            objArr.push({ relation: symb, origin: 'P', param: item })
          }
        })
      } else {
        objArr.push({ relation: symb, origin: params, param: '' })
      }
      return objArr
    }
    function fmtParamsArr(arr: any) {
      const source = []
      if (arr.length == 1) {
        source.push(...fmtParams(arr[0], ''))
      } else {
        source.push(...fmtParams(arr[1], arr[0]))
      }
      return source
    }
    const source = []
    const params = []
    let pre = 0
    for (let k = 0; k < arr.length; k++) {
      if (arr[k] == '|' || arr[k] == '&') {
        source.push(arr.slice(pre, k))
        pre = k
      }
      if (k == arr.length - 1) {
        source.push(arr.slice(pre, arr.length))
      }
    }
    for (let i = 0; i < source.length; i++) {
      params.push(...fmtParamsArr(source[i]))
    }
    return params
  }

  async editRow(row: any) {
    this.hook.strategy_id = row.strategy_id
    this.hook.id = row.id
    this.hook.language_id = row.language_id
    this.hook.value = row.value
    this.hook.type = '5'
    this.hook.status = row.status
    this.hookDialog = true
  }

  async getTypes() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyList(
      true,
      {}
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
    this.types = data
  }

  addSource(arr: any) {
    arr.push({ relation: '', origin: '', param: '' })
  }
  deleteSource(arr: any, key: number) {
    arr.splice(key, 1)
    arr[0].relation = ''
  }

  changeOrigin(obj: any) {
    if (obj.origin !== 'P') {
      obj.param = ''
    }
  }
  async deleteRule(row: any) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.ruleDelete({
      rule_id: row.id,
    })
    this.loadingDone()
    row.visible = false
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    await this.getTable()
  }

  async changeStatusAll(status: any) {
    this.loadingStart()
    const obj = await this.services.setting.changeVulStatus({
      mode: 2,
      status: status,
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
    this.$message({
      showClose: true,
      message: obj.msg,
      type: 'success',
    })
    this.currentPage = 1
    await this.getBase()
    await this.getTable()
  }

  async changeStatus(row: any) {
    this.loadingStart()
    const obj = await this.services.setting.changeVulStatus({
      mode: 1,
      ids: [row.id],
      status: row.status,
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
    await this.getBase()
    await this.getTable()
  }

  async deleteVuln(row: any) {
    this.loadingStart()
    const obj = await this.services.setting.delVulStatus({
      id: row.id,
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
    await this.getBase()
    await this.getTable()
  }

  clearHookType() {
    this.hookType = {
      type: this.ruleType,
      name: '',
      language_id: this.activeLanguage,
      short_name: '',
      enable: 0,
    }
    this.hookTypeDialog = false
  }
  async enterHookType() {
    this.loadingStart()
    const { status, msg } = await this.services.setting.ruleTypeAdd(
      this.hookType
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
    await this.getTypes()
    this.clearHookType()
  }
  fmtType(type: string) {
    switch (type) {
      case '1':
        return this.$t('views.hookPage.spreadType') as string
      case '2':
        return this.$t('views.hookPage.contaminatedType') as string
      case '3':
        return this.$t('views.hookPage.filterType') as string
      case '4':
        return this.$t('views.hookPage.dangerType') as string
      case '5':
        return '主动验证'
    }
  }
  clearHook() {
    this.hook = {
      id: 0,
      strategy_id: '',
      language_id: this.activeLanguage,
      value: '',
      status: 1,
      type: '5',
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
    if (this.hook.id) {
      this.loadingStart()
      const { status, msg } =
        await this.services.setting.edit_vul_recheck_payload({
          ...this.hook,
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
      const { status, msg } = await this.services.setting.vul_recheck_payload({
        ...this.hook,
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
      await this.getBase()
      await this.getTable()
      this.clearHook()
    }
  }
  async changeRuleType() {
    this.currentPage = 1
    await this.getTable()
  }
  async getTable() {
    this.loadingStart()
    const { status, msg, data, page } =
      await this.services.setting.vulRecheckPayload({
        page: this.currentPage,
        page_size: this.pageSize,
        strategy_id: this.rule_type,
        language_id: this.activeLanguage,
        keyword: this.keyword,
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
    this.hookType.type = this.ruleType
    this.hook.type = this.ruleType
    this.getTable()
    this.getTypes()
  }
}
</script>

<style scoped lang="scss">
.table-body {
  padding: 20px;
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
    background: #37d7bb;
    border-radius: 2px;
    color: #ffffff;
    border: 1px solid #37d7bb;
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
