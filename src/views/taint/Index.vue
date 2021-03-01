<template>
  <main class="container">
    <div class="policy-select">
      <el-select
        v-model="sysRule"
        size="small"
        clearable
        :placeholder="$t('views.search.defPolicy')"
        @change="sysRuleChange"
        @clear="resetRule"
      >
        <el-option
          v-for="item in sysRuleList"
          :key="item.id"
          :label="item.rule_name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-if="userInfo"
        v-model="userRule"
        size="small"
        clearable
        style="margin-left: 10px"
        :placeholder="$t('views.search.myPolicy')"
        @change="userRuleChange"
        @clear="resetRule"
      >
        <el-option
          v-for="item in userRuleList"
          :key="item.id"
          :label="item.rule_name"
          :value="item.id"
        />
      </el-select>
      <el-button v-if="this.$store.getters.enterDetail" size="small" @click="goBack">返回</el-button>
    </div>
    <div class="search-params">
      <div
        v-for="(form, index) in searchParams.paramsList"
        :key="index"
        class="search-params-item"
      >
        <el-form
          size="small"
          :inline="true"
          :model="form"
          class="demo-form-inline"
        >
          <el-form-item
            v-if="index === 0"
            label="查询条件"
            label-width="100px"
          ></el-form-item>
          <el-form-item v-else>
            <el-select
              v-model="form.criteria"
              placeholder="查询条件"
              style="width: 100px"
            >
              <el-option
                v-for="item in criteriaOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.key" placeholder="选择节点类型">
              <el-option
                v-for="item in keyOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.operate">
              <el-option
                v-for="item in operateOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              class="paramsBtn"
              @click="add"
              icon="el-icon-circle-plus-outline"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              class="paramsBtn"
              @click="del(form)"
              icon="el-icon-delete"
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-btn-list">
        <el-button type="primary" size="small" class="btn" @click="saveRule"
          >保存</el-button
        >
        <el-button size="small" class="btn" @click="emitParam">搜索</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="saveDialogOpen" width="600px">
      <el-form label-width="100px">
        <el-form-item label="策略名称">
          <el-input
            v-model="editSearchParams.name"
            size="small"
            placeholder="请输入策略名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="策略详情">
          <el-input
            v-model="editSearchParams.msg"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            size="small"
            placeholder="请输入策略名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            class="saveBtn"
            @click="saveDialogOpen = false"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="small"
            class="saveBtn"
            @click="vulRuleSave"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import {
  Params,
  SearchParams,
  ParamsOption,
  RuleObj,
  VulRuleObj,
  methodPoolSearchParams,
} from './types/search'
import Emitter from './Emitter'
import router from '@/router'

enum engineVulRuleType {
  user = 'user',
  system = 'system',
}

@Component({ name: 'TaintIndex' })
export default class Index extends VueBase {
  private sysRule: number | null = null
  private sysRuleList: Array<RuleObj> = []
  private userRule: number | null = null
  private userRuleList: Array<RuleObj> = []
  private criteriaOptionList: ParamsOption[] = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' },
  ]
  private keyOptionList: ParamsOption[] = []
  private operateOptionList: ParamsOption[] = [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
  ]
  private searchParams: SearchParams = {
    name: '',
    msg: '',
    level: '',
    paramsList: [{ key: '', value: '', operate: '=', criteria: '' }],
  }
  private editSearchParams: SearchParams = {
    name: '',
    msg: '',
    level: '',
    paramsList: [],
  }
  private saveDialogOpen: boolean = false

  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }

  async created() {
    this.userInfo && (await this.engineVulRule(engineVulRuleType.user))
    await this.engineVulRule(engineVulRuleType.system)
    await this.vulRuleType()

    const sessionItem =
      sessionStorage.getItem('searchParams') &&
      JSON.parse(sessionStorage.getItem('searchParams') as string)
    if (sessionItem) {
      this.userRule = sessionItem.userRule
      this.sysRule = sessionItem.sysRule
      this.searchParams = sessionItem.searchParams
    }
    this.emitParam()
  }

  beforeDestroy() {
    sessionStorage.removeItem('searchParams')
  }

  @Watch('$route')
  onRouteChanged(newVal: any) {
    if(newVal.fullPath!=='/taint/search'){
      this.$store.getters.enterDetail = true
    }else{
      this.$store.getters.enterDetail = false
    }
    this.$nextTick(() => {
      this.emitParam()
    })
  }

  add(): void {
    this.searchParams.paramsList.push({
      key: '',
      value: '',
      operate: '=',
      criteria: 'and',
    })
  }

  del(i: Params): void {
    this.searchParams.paramsList[0].criteria = ''
    this.searchParams.paramsList.some((item, index) => {
      if (item == i) {
        this.searchParams.paramsList.splice(index, 1)
        return false
      }
    })
    if (this.searchParams.paramsList.length === 0) {
      this.add()
    }
  }

  private async engineVulRule(type: string) {
    const { status, msg, data } = await this.services.taint.engineVulRule({
      type,
    })
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    if (type === engineVulRuleType.system) {
      this.sysRuleList = data
    }
    if (type === engineVulRuleType.user) {
      this.userRuleList = data
    }
  }

  private sysRuleChange() {
    this.userRule = null
    if (this.sysRule) {
      this.engineVulRuleDetail(this.sysRule)
    }
  }

  private userRuleChange() {
    this.sysRule = null
    if (this.userRule) {
      this.engineVulRuleDetail(this.userRule)
    }
  }

  private resetRule() {
    this.userRule = null
    this.sysRule = null
    this.searchParams = {
      name: '',
      msg: '',
      level: '',
      paramsList: [{ key: '', value: '', operate: '=', criteria: '' }],
    }
    this.emitParam()
  }

  private async engineVulRuleDetail(rule_id: number) {
    this.loadingStart()
    const {
      status,
      msg,
      data,
    } = await this.services.taint.engineVulRuleDetail({ rule_id })
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    const vulRuleObj: VulRuleObj = JSON.parse(data.rule_value)
    this.searchParams.name = vulRuleObj.name
    this.searchParams.msg = vulRuleObj.msg
    this.searchParams.level = vulRuleObj.level
    this.searchParams.paramsList = [];
    ['sinks', 'sources', 'propagators', 'filters'].forEach((key: string) => {
      if (vulRuleObj.hasOwnProperty(key)) {
        vulRuleObj[key]?.forEach((value:string) => {
          this.searchParams.paramsList.push({
            key,
            value,
            operate: '=',
            criteria: 'and',
          })
        })
      }
    })
    this.search()
  }

  private async vulRuleType() {
    // 策略类型
    this.loadingStart()
    const { status, msg, data } = await this.services.taint.vulRuleType()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.keyOptionList = data
  }

  private saveRule() {
    this.saveDialogOpen = true
    this.editSearchParams = { ...this.searchParams }
  }

  private emitParam() {
    Emitter.emit('searchParams', this.searchParams)
    sessionStorage.setItem(
      'searchParams',
      JSON.stringify({
        userRule: this.userRule,
        sysRule: this.sysRule,
        searchParams: this.searchParams,
      })
    )
  }

  private search() {
    if (this.$route.fullPath !== '/taint/search') {
      this.$router.push('/taint/search')
    }
    this.emitParam()
  }

  private async vulRuleSave() {
    const params: methodPoolSearchParams = {
      name: this.editSearchParams.name,
      msg: this.editSearchParams.msg,
      level: this.editSearchParams.level,
    }
    this.editSearchParams.paramsList.forEach((paramsObj) => {
      if (!paramsObj.key) {
        return
      }
      if (params.hasOwnProperty(paramsObj.key)) {
        params[paramsObj.key].push(paramsObj.value)
      } else {
        params[paramsObj.key] = [paramsObj.value]
      }
    })
    this.loadingStart()
    const { status, data, msg } = await this.services.taint.vulRuleSave(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.$message.success(msg)
    this.saveDialogOpen = false
    this.editSearchParams = {
      name: '',
      msg: '',
      level: '',
      paramsList: [],
    }
    this.userRule = null
    this.sysRule = null
    this.userInfo && (await this.engineVulRule(engineVulRuleType.user))
    await this.engineVulRule(engineVulRuleType.system)
  }

  private async goBack() {
    router.back()
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px 0 80px;
}

.policy-select {
  margin-bottom: 10px;

  > div {
    margin-left: 0;
  }
}

.search-params {
  border: 1px solid #d6ddec;
  border-radius: 4px;
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  max-height: 23vh;
  overflow-y: auto;

  .paramsBtn {
    width: 60px;
  }
}

.search-btn-list {
  display: flex;
  justify-content: center;

  .btn {
    width: 100px;
  }
}

.saveBtn {
  width: 200px;
}
</style>
