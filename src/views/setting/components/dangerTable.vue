<template>
  <div class="table-body">
    <div class="flex-between">
      <div style="flex: 1">
        <el-select
          v-model="rule_type"
          class="search-input"
          size="small"
          placeholder="请选择规则类型"
          filterable
          clearable
          @change="getTable"
        >
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-button
          size="small"
          class="resetAllBtn"
          @click="hookTypeDialog = true"
          ><i class="el-icon-plus"></i> 添加规则类型</el-button
        >
        <el-button size="small" class="resetAllBtn" @click="hookDialog = true"
          ><i class="el-icon-plus"></i>添加规则</el-button
        >
      </div>
    </div>
    <div class="btn-list-batch">
      <span style="color: #38435a">
        已选中
        <span style="color: #4a72ae">{{ multipleSelection.length }} </span>条
      </span>
      <div>
        <el-button
          size="small"
          class="resetAllBtn open"
          @click="changeStatusBatch('enable')"
          >启用</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn stop"
          @click="changeStatusBatch('disable')"
          >禁用</el-button
        >
        <el-button
          size="small"
          class="resetAllBtn delete"
          @click="changeStatusBatch('delete')"
          >删除</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
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
          <span>暂无数据</span>
        </div>
      </template>
      <el-table-column
        prop="rule_type"
        label="规则类型"
        width="180"
        :fixed="tableData.length ? 'left' : false"
      >
      </el-table-column>
      <el-table-column prop="value" label="规则详情" width="340">
      </el-table-column>
      <el-table-column prop="source" label="污点输入" width="180">
      </el-table-column>
      <el-table-column prop="inherit" label="HOOK深度" width="180">
        <template slot-scope="scope">
          {{
            scope.row.inherit === 'true'
              ? '子类'
              : scope.row.inherit === 'all'
              ? '当前类及子类'
              : '当前类'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="track" label="开启污点跟踪" width="180">
        <template slot-scope="scope">
          {{ scope.row.track === 'true' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.update_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="rolesCheck(['system_admin', 'talent_admin'], true)"
        prop="user"
        label="创建者"
        width="180"
      >
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="状态"
        :fixed="tableData.length ? 'right' : false"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
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
        prop="address"
        label="操作"
        width="100"
        align="center"
        :fixed="tableData.length ? 'right' : false"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            style="color: #4a72ae"
            @click="editRow(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="changeStatus(scope.row, 'delete')"
          >
            <el-button
              slot="reference"
              size="small"
              style="margin-left: 6px; color: #f56262"
              type="text"
              >删除</el-button
            >
          </el-popconfirm>
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
      <el-form :model="hookType" label-width="80px" size="small">
        <el-form-item label="规则集">
          <span>{{ fmtType(hookType.type) }}</span>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input
            v-model="hookType.name"
            placeholder="请输入类型名称，如：String、StringBuilder等，建议使用类名"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型简称">
          <el-input
            v-model="hookType.short_name"
            placeholder="请输入类型简称，如：字符串-01、字符串-02，方便自己查看"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
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
        <el-button size="small" @click="clearHookType">取消</el-button>
        <el-button size="small" type="primary" @click="enterHookType"
          >确定</el-button
        >
      </template>
    </el-dialog>

    <el-dialog :visible.sync="hookDialog">
      <el-form :model="hook" size="small" label-width="80px">
        <el-form-item label="规则集">
          <span>{{ fmtType(hook.type) }}</span>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="hook.rule_type_id" placeholder="请选择规则类型">
            <el-option
              v-for="t in types"
              :key="t.id"
              style="width: 100%"
              :label="t.name"
              :value="t.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则详情">
          <el-input
            v-model="hook.rule_value"
            placeholder="请输入HOOK规则，格式如：java.lang.String.<init>(java.lang.String)"
          ></el-input>
        </el-form-item>
        <template v-for="(item, key) in hook.source">
          <el-form-item
            :key="'source' + key"
            :label="key === 0 ? '污点来源' : ''"
          >
            <el-select
              v-if="key > 0"
              v-model="item.relation"
              placeholder="请选择逻辑关系"
              style="width: 18%"
            >
              <el-option
                v-for="r in relations"
                :key="r.value"
                :label="r.label"
                :value="r.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="item.origin"
              placeholder="请选择数据源"
              style="width: 18%"
              @change="changeOrigin(item)"
            >
              <el-option
                v-for="o in origins"
                :key="o.value"
                :label="o.label"
                :value="o.value"
                :disabled="
                  (o.value === 'O' &&
                    hook.source.some((i) => i.origin === 'O')) ||
                  (o.value === 'R' && hook.source.some((i) => i.origin === 'R'))
                "
              >
              </el-option>
            </el-select>
            <el-input
              v-if="item.origin === 'P'"
              v-model="item.param"
              placeholder="参数编号，从1开始"
              style="width: 10%; margin-left: 10px"
            ></el-input>
            <div style="float: right">
              <el-button
                type="text"
                size="small"
                @click="addSource(hook.source)"
                >增加</el-button
              >
              <el-button
                v-if="hook.source.length > 1"
                size="small"
                type="text"
                @click="deleteSource(hook.source, key)"
                >删除</el-button
              >
            </div>
          </el-form-item>
        </template>
        <el-form-item label="污点跟踪">
          <el-radio v-model="hook.track" label="true">启用</el-radio>
          <el-radio v-model="hook.track" label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="继承深度">
          <el-radio v-model="hook.inherit" label="false">仅当前类</el-radio>
          <el-radio v-model="hook.inherit" label="true">仅子类</el-radio>
          <el-radio v-model="hook.inherit" label="all">当前类及其子类</el-radio>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="clearHook">取消</el-button>
        <el-button size="small" type="primary" @click="enterHook"
          >确定</el-button
        >
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
  hookTypeDialog = false
  hookDialog = false
  rule_type = ''
  hookType = { type: '1', name: '', short_name: '', enable: 0 }
  types = []
  hook = {
    id: 0,
    type: '1',
    rule_type_id: '',
    rule_value: '',
    source: [{ relation: '', origin: '', param: '' }],
    inherit: '',
    track: '',
  }
  relations = [
    { label: '或', value: '|' },
    { label: '和', value: '&' },
  ]
  origins = [
    { label: '对象', value: 'O' },
    { label: '返回值', value: 'R' },
    { label: '参数', value: 'P' },
  ]
  tableData = []
  pageSize = 20
  currentPage = 1
  total = 0

  multipleSelection = []
  handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  async changeStatusBatch(op: string) {
    let str = ''
    switch (op) {
      case 'delete':
        str = '删除'
        break
      case 'enable':
        str = '启用'
        break
      case 'disable':
        str = '禁用'
        break
    }
    this.$confirm(`此操作将批量${str}数据, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择需要操作的数据',
          showClose: true,
        })
        return
      }
      const ids = this.multipleSelection.map((item: any) => item.id)
      const { status, msg } = await this.services.setting.changeStatusBatch({
        ids: String(ids),
        op,
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
      await this.getTable()
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
    const sourceArr = this.splitAndIn(row.source, '|')
    for (let i = 0; i < sourceArr.length; i++) {
      if (sourceArr[i].indexOf('&') > -1) {
        const arr2 = this.splitAndIn(sourceArr[i], '&')
        sourceArr.splice(i, 1, ...arr2)
        i += arr2.length
      }
    }
    const source = this.makeParamsArr(sourceArr)

    this.hook.rule_value = row.value
    this.hook.id = row.id
    this.hook.inherit = row.inherit
    this.hook.source = source
    this.hook.rule_type_id = row.rule_type_id
    this.hookDialog = true
  }

  async getTypes() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.ruleTypes({
      type: this.ruleType,
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

  async changeStatus(row: any, status = '') {
    this.loadingStart()
    const obj = await this.services.setting.changeStatus({
      rule_id: row.id,
      op: status || (row.enable === 0 ? 'disable' : 'enable'),
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

  clearHookType() {
    this.hookType = {
      type: this.ruleType,
      name: '',
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
        return '传播方法规则'
      case '2':
        return '污染源方法规则'
      case '3':
        return '过滤方法规则'
      case '4':
        return '危险方法规则'
      case '5':
        return '入口方法规则'
    }
  }
  clearHook() {
    this.hook = {
      id: 0,
      type: this.ruleType,
      rule_type_id: '',
      rule_value: '',
      source: [{ relation: '', origin: '', param: '' }],
      inherit: '',
      track: '',
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
      const rule_source = this.fmtParams(this.hook.source)
      const { status, msg } = await this.services.setting.modifyAdd({
        rule_id: this.hook.id,
        rule_type_id: this.hook.rule_type_id,
        rule_value: this.hook.rule_value,
        rule_source: rule_source,
        rule_target: '',
        inherit: this.hook.inherit,
        track: this.hook.track,
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
      const rule_source = this.fmtParams(this.hook.source)
      const { status, msg } = await this.services.setting.ruleAdd({
        rule_type_id: this.hook.rule_type_id,
        rule_value: this.hook.rule_value,
        rule_source: rule_source,
        rule_target: '',
        inherit: this.hook.inherit,
        track: this.hook.track,
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
  async changeRuleType() {
    this.currentPage = 1
    await this.getTable()
  }
  async getTable() {
    this.loadingStart()
    const {
      status,
      msg,
      data,
      page,
    } = await this.services.setting.hookRuleList({
      page: this.currentPage,
      pageSize: this.pageSize,
      type: this.ruleType,
      strategy_type: this.rule_type,
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
/deep/.el-table th {
  background: #f8f9fb;
}
</style>
