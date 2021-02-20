<template>
  <main class="container">
    <div class="policy-select">
      <el-select
        v-model="sysRule"
        :placeholder="$t('views.search.defPolicy')"
        @change="sysRuleChange"
      >
        <el-option
          v-for="item in sysRuleList"
          :key="item.id"
          :label="item.rule_name"
          :value="item"
        />
      </el-select>
      <el-select
        v-if="userInfo"
        v-model="userRule"
        style="margin-left: 10px"
        :placeholder="$t('views.search.myPolicy')"
        @change="userRuleChange"
      >
        <el-option
          v-for="item in userRuleList"
          :key="item.id"
          :label="item.rule_name"
          :value="item"
        />
      </el-select>
    </div>
    <div class="search-params">
      <div
        v-for="(form, index) in searchParams.paramsList"
        :key="index"
        class="search-params-item"
      >
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item v-if="index === 0" label="查询条件" label-width="100px"></el-form-item>
          <el-form-item v-else>
            <el-select v-model="form.criteria" placeholder="查询条件" style="width: 100px">
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
            <el-button type="primary" size="small" class="paramsBtn" @click="add" icon="el-icon-circle-plus-outline"></el-button>
            <el-button type="danger" size="small" class="paramsBtn" @click="del(form)" icon="el-icon-delete"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-btn-list">
        <el-button type="primary" class="btn">保存</el-button>
        <el-button @click="search" class="btn">搜索</el-button>
      </div>
    </div>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { Component,Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { Params, SearchParams, ParamsOption, RuleObj, VulRuleObj } from './types/search'
import Emitter from './Emitter'

enum engineVulRuleType {
  user = 'user',
  system = 'system'
}

@Component({ name: 'TaintIndex' })
export default class Index extends VueBase {
  private sysRule: RuleObj | null = null
  private sysRuleList: Array<RuleObj> = []
  private userRule: RuleObj | null = null
  private userRuleList: Array<RuleObj> = []
  private criteriaOptionList: ParamsOption[] = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ]
  private keyOptionList: ParamsOption[] = []
  private operateOptionList: ParamsOption[] = [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' }
  ]
  private searchParams: SearchParams = {
    name: '',
    msg: '',
    level: '',
    paramsList: [{ key: '', value: '', operate: '=', criteria: '' }]
  }


  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }

  created() {
    this.userInfo && this.engineVulRule(engineVulRuleType.user)
    this.engineVulRule(engineVulRuleType.system)
    this.vulRuleType()
  }

  mounted() {
    this.search()
  }

  @Watch('$route', { immediate: true, deep: true })
  onPersonChanged() {
    this.search()
  }

  add(): void {
    this.searchParams.paramsList.push({ key: '', value: '', operate: '=', criteria: 'and' })
  }

  del(i: Params): void {
    this.searchParams.paramsList[0].criteria = ''
    this.searchParams.paramsList.some((item, index) => {
      if (item == i) {
        this.searchParams.paramsList.splice(index, 1)
        return false
      }
    })
  }

  private async engineVulRule(type: string) {
    const { status, msg, data } = await this.services.taint.engineVulRule({ type })
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
    this.engineVulRuleDetail((this.sysRule as RuleObj).id)
  }

  private userRuleChange() {
    this.sysRule = null
    this.engineVulRuleDetail((this.userRule as RuleObj).id)
  }

  private async engineVulRuleDetail(rule_id: number) {
    this.loadingStart()
    const { status, msg, data } = await this.services.taint.engineVulRuleDetail({ rule_id })
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
    ['sinks', 'sources', 'propagators', 'filters'].forEach(key => {
      if (vulRuleObj.hasOwnProperty(key)) {
        vulRuleObj.sinks?.forEach(value => {
          this.searchParams.paramsList.push({
            key, value, operate: '=', criteria: 'and'
          })
        })
      }
    })
    this.search()
  }

  private async vulRuleType() {    // 策略类型
    this.loadingStart()
    const { status, msg, data } = await this.services.taint.vulRuleType()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.keyOptionList = data
  }

  search() {
    if(this.$route.fullPath === '/taint/search'){
      return
    }
    Emitter.emit('searchParams', this.searchParams)
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

  .paramsBtn{
    width: 60px;
    font-size: 18px;
  }
}


.search-btn-list {
  display: flex;
  justify-content: center;

  .btn{
    width: 100px;
  }
}
</style>
