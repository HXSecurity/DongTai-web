<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="titleForm">
        <el-select size="mini" v-model="searchObj.order" style="width: 90px;">
          <el-option v-for="item in orderOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input v-model="searchObj.url" style="width: 116px;margin-left: 4px;" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
      <div class="page-line flex-column-center">
        <div class="flex-row-space-between">
          <el-pagination
            small
            layout="prev, next"
            :total="total"
            :current-page="page"
            :page-size="20"
            @current-change="currentChange"
          >
          </el-pagination>
          <span style="color: #969BA4;line-height: 25px;">
            <strong style="color: #38435A;font-weight: 400;">{{ page }}</strong>/{{ Math.ceil(total / page) }}
          </span>
          <el-button size="mini" icon="el-icon-search"></el-button>
        </div>
      </div>
      <div class="card" v-for="item in tableData" :key="item.id"
           :class="item.id === selectedId ? 'selected' : ''" @click="idChange(item.id)">
        <div class="titleLine">
          {{ `${item.url}存在${item.type}漏洞` }}
        </div>
        <div class="infoLine flex-row-space-between">
          <span>
                <i class="iconfont iconweixian" style="color: #E6D088"></i>
                {{ item.level }}
              </span>
          <span>
                <i class="iconfont iconweixian" style="color: #A2A5AB"></i>
                {{ item.latest_time }}
              </span>
        </div>
      </div>
    </div>
    <div class="vuln-warp">
      <div class="vuln-title">
        {{ `${vulnObj.vul.url}的${vulnObj.vul.http_method}请求出现${vulnObj.vul.type}漏洞，位置：${vulnObj.vul.taint_position}` }}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.baseInfo')}}
      </div>
      <div class="baseInfo">
        <div class="flex-row-space-between">
          <span>url:{{vulnObj.vul.url}}</span>
          <span>url:{{vulnObj.vul.url}}</span>
        </div>
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.vulnDesc')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.httpRequest')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.codeDemo')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.graphy')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.suggest')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.appInfo')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.devEnv')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnDetail.path')}}
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'VulnDetail' })
export default class VulnDetail extends Vue {
  private vulnObj: object = {}
  private tableData: Array<object> = []
  private page: number = 1
  private selectedId: number = 0
  private total: number = 0
  private searchObj = {
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: ''
  }

  private orderOptions = [
    {
      label: this.$t('views.vulnList.orderOptions.app_name'),
      value: 'app_name'
    },
    {
      label: this.$t('views.vulnList.orderOptions.server_name'),
      value: 'server_name'
    },
    {
      label: this.$t('views.vulnList.orderOptions.type'),
      value: 'type'
    },
    {
      label: this.$t('views.vulnList.orderOptions.level'),
      value: 'level'
    },
    {
      label: this.$t('views.vulnList.orderOptions.url'),
      value: 'url'
    },
    {
      label: this.$t('views.vulnList.orderOptions.latest_time'),
      value: 'latest_time'
    },
    {
      label: this.$t('views.vulnList.orderOptions.first_time'),
      value: 'first_time'
    }
  ]

  async created () {
    this.page = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    await this.getVulnDetail()
    await this.getTableData()
  }

  private newSelectData () {
    this.page = 1
    this.getTableData()
  }

  private currentChange (val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData () {
    const params = {
      page: this.page,
      pageSize: 20,
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order
    }
    const { status, data, page, msg } = await this.$services.vuln.vulnList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  private idChange (id: number) {
    this.selectedId = id
    this.getVulnDetail()
  }

  private async getVulnDetail () {
    const { data, status, msg } = await this.$services.vuln.getVulnDetail(this.selectedId)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.vulnObj = data
  }
}
</script>

<style scoped lang='scss'>

.slider-warp {
  margin-top: 14px;
  background: #fff;
  width: 234px;

  .titleForm {
    border-bottom: 1px solid #E6E9EC;
    padding: 14px 12px;
  }

  .page-line {
    height: 41px;
    padding: 0 12px;
  }

  .card {
    width: 100%;
    height: 72px;
    padding: 0 12px;
    cursor: pointer;

    &:hover{
      background: #EFF6FF;
    }

    .titleLine {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 12px;
    }

    .infoLine {
      font-size: 14px;
      color: #A2A5AB;
      margin-top: 19px;
    }
  }

  .selected{
    background: #EFF6FF;
  }
}

.vuln-warp{
  margin-top: 14px;
  background: #fff;
  width: 952px;
  padding: 0 14px;

  .vuln-title{
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    color: #38435A;
    border-bottom: 1px solid #E6E9EC;
  }

  .module-title{
    color: #38435A;
    font-size: 14px;
    font-weight: 500;
    margin-top: 24px;
  }

  .baseInfo{
    margin-top: 22px;
    width: 100%;
    height: 114px;
    background: #F8F9FB;
    border-radius: 4px;
    color: #959FB4;
    font-size: 14px;
  }
}
</style>
