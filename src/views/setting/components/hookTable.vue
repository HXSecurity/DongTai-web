<template>
  <div class="table-body">
    <div class="flex-right">
      <el-button size="small" @click="hookTypeDialog = true" class="resetAllBtn"
        >添加规则类型</el-button
      >
      <el-button size="small" @click="hookDialog = true" class="resetAllBtn">添加规则</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="rule_type" label="规则类型" width="160">
      </el-table-column>
      <el-table-column align="center" prop="value" label="规则详情" width="340">
      </el-table-column>
      <el-table-column align="center" prop="source" label="污点输入" max-width="100">
      </el-table-column>
      <el-table-column prop="target" label="污点输出" max-width="100">
      </el-table-column>
      <el-table-column prop="inherit" label="HOOK深度" width="140">
        <template slot-scope="scope">
          {{ scope.row.inherit === 'true' ? '子类' : scope.row.inherit === 'all'?'当前类及子类':'当前类' }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" sortable="true" width="180">
        <template slot-scope="scope">
          {{ scope.row.update_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column prop="user" label="创建者" width="180">
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
          <el-button
            type="success"
            size="small"
            style="margin-left: 10px"
            @click="editRow(scope.row)"
          >
            编辑
          </el-button>
          <el-popover v-model="scope.row.visible" placement="top" width="160">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="scope.row.visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="deleteRule(scope.row)"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="danger"
              style="margin-left: 20px"
              size="small"
            >
              删除
            </el-button>
          </el-popover>
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
      <el-form :model="hookType" label-width="80px" size="small" >
        <el-form-item label="规则集">
          <span>{{ fmtType(hookType.type) }}</span>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input v-model="hookType.name"></el-input>
        </el-form-item>
        <el-form-item label="类型简称">
          <el-input v-model="hookType.short_name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="hookType.enable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="clearHookType">取消</el-button>
        <el-button size="small" type="primary" @click="enterHookType">确定</el-button>
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
          <el-input v-model="hook.rule_value"></el-input>
        </el-form-item>
        <template v-for="(item, key) in hook.source">
          <el-form-item
            :key="'source-' + key"
            :label="key === 0 ? '污点来源' : ' '"
          >
            <el-select
              v-if="key > 0"
              v-model="item.relation"
              placeholder="请选择逻辑关系"
              style="width: 18%;"
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
              style="width: 18%;"
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
              style="width: 18%; margin-left: 10px"
            ></el-input>
            <div style="float: right">
              <el-button type="text" @click="addSource(hook.source)"
                >增加</el-button
              >
              <el-button
                v-if="hook.source.length > 1"
                type="text"
                @click="deleteSource(hook.source, key)"
                >删除</el-button
              >
            </div>
          </el-form-item>
        </template>
        <template v-for="(item, key) in hook.target">
          <el-form-item
            :key="'target' + key"
            :label="key === 0 ? '污点去向' : ''"
          >
            <el-select
              v-if="key > 0"
              v-model="item.relation"
              placeholder="请选择逻辑关系"
              style="width: 18%;"
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
              style="width: 18%;"
              @change="changeOrigin(item)"
            >
              <el-option
                v-for="o in origins"
                :key="o.value"
                :label="o.label"
                :value="o.value"
                :disabled="
                  (o.value === 'O' &&
                    hook.target.some((i) => i.origin === 'O')) ||
                  (o.value === 'R' && hook.target.some((i) => i.origin === 'R'))
                "
              >
              </el-option>
            </el-select>
            <el-input
              v-if="item.origin === 'P'"
              v-model="item.param"
              style="width: 18%; margin-left: 10px"
            ></el-input>
            <div style="float: right">
              <el-button type="text" @click="addSource(hook.target)"
                >增加</el-button
              >
              <el-button
                v-if="hook.target.length > 1"
                type="text"
                @click="deleteSource(hook.target, key)"
                >删除</el-button
              >
            </div>
          </el-form-item>
        </template>
        <el-form-item label="继承深度">
          <el-radio v-model="hook.inherit" selected label="false">仅当前类</el-radio>
          <el-radio v-model="hook.inherit" label="true">仅子类</el-radio>
          <el-radio v-model="hook.inherit" label="all">当前类及其子类</el-radio>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="clearHook">取消</el-button>
        <el-button size="small" type="primary" @click="enterHook">确定</el-button>
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
  hookType = { type: '1', name: '', short_name: '', enable: 0 }
  types = []
  hook = {
    id: 0,
    type: '1',
    rule_type_id: '',
    rule_value: '',
    source: [{ relation: '', origin: '', param: '' }],
    target: [{ relation: '', origin: '', param: '' }],
    inherit: '',
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

    const targetArr = this.splitAndIn(row.target, '|')
    for (let i = 0; i < targetArr.length; i++) {
      if (targetArr[i].indexOf('&') > -1) {
        const arr2 = this.splitAndIn(targetArr[i], '&')
        sourceArr.splice(i, 1, ...arr2)
        i += arr2.length
      }
    }
    const target = this.makeParamsArr(targetArr)

    this.hook.rule_value = row.value
    this.hook.id = row.id
    this.hook.inherit = row.inherit
    this.hook.source = source
    this.hook.target = target
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
      this.$message.error(msg)
      return
    }
    this.types = data
  }

  async deleteRule(row: any) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.ruleDelete({
      rule_id: row.id,
    })
    this.loadingDone()
    row.visible = false
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    await this.getTable()
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

  async changeStatus(row: any) {
    this.loadingStart()
    let status, msg
    if (row.enable === 0) {
      const obj = await this.services.setting.ruleDisable({
        rule_id: row.id,
      })
      status = obj.status
      msg = obj.msg
    } else {
      const obj = await this.services.setting.ruleEnable({
        rule_id: row.id,
      })
      status = obj.status
      msg = obj.msg
    }
    this.loadingDone()

    if (status !== 201) {
      this.$message.error(msg)
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
      this.$message.error(msg)
      return
    }
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
      target: [{ relation: '', origin: '', param: '' }],
      inherit: '',
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
      const rule_target = this.fmtParams(this.hook.target)
      const { status, msg } = await this.services.setting.modifyAdd({
        rule_id: this.hook.id,
        rule_type_id: this.hook.rule_type_id,
        rule_value: this.hook.rule_value,
        rule_target: rule_target,
        rule_source: rule_source,
        inherit: this.hook.inherit,
        track: 'false',
      })

      this.loadingDone()
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      await this.getTable()
      this.clearHook()
    } else {
      this.loadingStart()
      const rule_source = this.fmtParams(this.hook.source)
      const rule_target = this.fmtParams(this.hook.target)
      const { status, msg } = await this.services.setting.ruleAdd({
        rule_type_id: this.hook.rule_type_id,
        rule_value: this.hook.rule_value,
        rule_target: rule_target,
        rule_source: rule_source,
        inherit: this.hook.inherit,
        track: 'false',
      })

      this.loadingDone()
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      await this.getTable()
      this.clearHook()
    }
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
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
  .flex-right {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 6px;
  }
  .resetAllBtn {
    height: 28px;
    line-height: 0;
    background: #4a72ae;
    border-radius: 2px;
    color: #fff;
  }
}
</style>
