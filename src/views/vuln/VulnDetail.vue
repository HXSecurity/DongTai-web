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
            <strong style="color: #38435A;font-weight: 400;">{{ page }}</strong>/{{ Math.ceil(total / 20) }}
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
                <i class="iconfont iconweixian"
                   :style="item.level_type === 1 ? {color: '#EA7171'} :
                   item.level_type === 2 ? {color: '#F39D0A'}  :
                   item.level_type === 3 ? {color: '#2E8FE9'}  :
                   item.level_type === 4 ? {color: '#7BC1AB'}  : ''"
                ></i>
                {{ item.level }}
              </span>
          <span>
                <i class="iconfont iconshijian-2"></i>
                {{ item.latest_time }}
              </span>
        </div>
      </div>
    </div>
    <div class="vuln-warp" v-if="vulnObj.vul">
      <div class="vuln-title">
        {{ `${vulnObj.vul.url}的${vulnObj.vul.http_method}请求出现${vulnObj.vul.type}漏洞，位置：${vulnObj.vul.taint_position}` }}
      </div>
      <div class="module-title flex-row-space-between">
        {{ $t('views.vulnDetail.baseInfo') }}
        <el-button size="mini" type="primary">{{ $t('views.vulnDetail.export') }}</el-button>
      </div>
      <div class="baseInfo">
        <div class="base-line flex-row-space-between">
          <span>{{ $t('views.vulnDetail.url') }}:{{ vulnObj.vul.url }}</span>
          <span>{{ $t('views.vulnDetail.first_time') }}:{{ vulnObj.vul.first_time }}</span>
        </div>
        <div class="base-line">
          <span>{{ $t('views.vulnDetail.serverIp') }}:{{ vulnObj.server.ip }}</span>
        </div>
        <div class="base-line flex-row-space-between">
          <span>{{ $t('views.vulnDetail.language') }}:{{ vulnObj.vul.language }}</span>
          <span>{{ $t('views.vulnDetail.port') }}:{{ vulnObj.server.port }}</span>
          <span>{{ $t('views.vulnDetail.projectName') }}:{{ vulnObj.vul.project_name }}</span>
          <span>{{ $t('views.vulnDetail.level') }}:{{ vulnObj.vul.level }}</span>
          <span>{{ $t('views.vulnDetail.counts') }}:{{ vulnObj.vul.counts }}</span>
        </div>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.vulnDesc') }}
      </div>
      <div class="markdownContent">
        <MyMarkdownIt :content="vulnObj.strategy.desc"></MyMarkdownIt>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.httpRequest') }}
      </div>
      <div class="markdownContent">
        <MyMarkdownIt :content="vulnObj.vul.req_header"></MyMarkdownIt>
      </div>
      <div v-if="vulnObj.strategy.sample_code" class="module-title">
        {{ $t('views.vulnDetail.codeDemo') }}
      </div>
      <div v-if="vulnObj.strategy.sample_code" class="markdownContent">
        <MyMarkdownIt :content="vulnObj.strategy.sample_code"></MyMarkdownIt>
      </div>
      <!-- 污点流图-->
      <div class="module-title">
        {{ $t('views.vulnDetail.graphy') }}
      </div>
      <div class="graphyModule flex-row-space-between">
        <div class="left-warp">
          <div class="nodeLine flex-column-center" v-for="(item,index) in vulnObj.vul.graphy" :key="index">
            {{ item.node }}
            <i v-if="index < vulnObj.vul.graphy.length - 1" class="step el-icon-bottom"></i>
          </div>
        </div>
        <div class="right-warp">
          <el-table class="graphyTable" :data="vulnObj.vul.graphy" style="background: #F8F9FB;" :row-class-name="tableRowClassName">
            <el-table-column align="left" :label="$t('views.vulnDetail.type')" prop="type"></el-table-column>
            <el-table-column align="center" :label="$t('views.vulnDetail.fileAndNum')">
              <template slot-scope="{row}">
                <div>{{ row.file }}</div>
                <div v-if="row.line_number">{{ row.line_number }}</div>
              </template>
            </el-table-column>
            <el-table-column align="right" :label="$t('views.vulnDetail.wuDianZhi')" prop="target"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="vulnObj.strategy.repair_suggestion" class="module-title">
        {{ $t('views.vulnDetail.suggest') }}
      </div>
      <div v-if="vulnObj.strategy.repair_suggestion" class="markdownContent">
        <MyMarkdownIt :content="vulnObj.strategy.repair_suggestion"></MyMarkdownIt>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.appInfo') }}
      </div>
      <div class="baseInfo">
        <div class="base-line flex-row-space-between">
          <span style="flex: 1;">{{ $t('views.vulnDetail.serverIp') }}:{{ vulnObj.server.ip }}</span>
          <span style="flex: 1;">{{ $t('views.vulnDetail.port') }}:{{ vulnObj.server.port }}</span>
          <span style="flex: 1;">{{ $t('views.vulnDetail.clientIp') }}:{{ vulnObj.vul.client_ip }}</span>
        </div>
        <div class="base-line flex-row-space-between">
          <span style="flex: 1;">{{ $t('views.vulnDetail.projectName') }}:{{ vulnObj.vul.project_name }}</span>
          <span style="flex: 1;">{{ $t('views.vulnDetail.route') }}:{{ vulnObj.vul.context_path }}</span>
          <span style="flex: 1;"></span>
        </div>
        <div class="base-line flex-row-space-between">
          <span style="flex: 1;">{{ $t('views.vulnDetail.middleware') }}:{{ vulnObj.server.container }}</span>
          <span style="flex: 1;">{{ $t('views.vulnDetail.route') }}:{{ vulnObj.server.container_path }}</span>
          <span style="flex: 1;"></span>
        </div>
      </div>
      <!--运行时环境-->
      <div  v-if="vulnObj.server.runtime"  class="module-title">
        {{ $t('views.vulnDetail.devEnv') }}
      </div>
      <div v-if="vulnObj.server.runtime"  class="baseInfo">
        <div class="base-line">
          <span>{{ vulnObj.server.runtime }}</span>
        </div>
      </div>
      <!--      环境变量-->
      <div class="module-title">
        {{ $t('views.vulnDetail.path') }}
      </div>
      <div class="baseInfo">
        <div class="base-line">
          <span>{{ $t('views.vulnDetail.command') }}:{{ vulnObj.server.command }}</span>
        </div>
        <div v-if="vulnObj.server.environment" class="base-line">
          <span>{{ $t('views.vulnDetail.other') }}:{{ vulnObj.server.environment }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'

@Component({ name: 'VulnDetail' })
export default class VulnDetail extends VueBase {
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
    const { status, data, page, msg } = await this.services.vuln.vulnList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data.reduce((list, item) => {
      list.push({
        ...item,
        latest_time: formatTimestamp(item.latest_time)
      })
      return list
    }, [])
    this.total = page.alltotal
  }

  private idChange (id: number) {
    this.selectedId = id
    this.getVulnDetail()
  }

  private async getVulnDetail () {
    const { data, status, msg } = await this.services.vuln.getVulnDetail(this.selectedId)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.vulnObj = {
      vul: {
        ...data.vul,
        first_time: formatTimestamp(data.vul.first_time),
        latest_time: formatTimestamp(data.vul.latest_time),
        graphy: data.vul.graphy
      },
      server: {
        ...data.server
      },
      strategy: {
        ...data.strategy
      }
    }
  }

  tableRowClassName ({ row, rowIndex }) {
    return 'diy-row'
  }
}
</script>

<style>
.el-table .diy-row {
  background: #F8F9FB;
  color: #959FB4;
  font-size: 14px;
}
.graphyTable.el-table th{
  background: #F8F9FB;
  color: #959FB4;
}
</style>

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

    &:hover {
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

  .selected {
    background: #EFF6FF;
  }
}

.vuln-warp {
  margin-top: 14px;
  background: #fff;
  width: 952px;
  padding: 0 14px;

  .vuln-title {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    color: #38435A;
    font-weight: 600;
    border-bottom: 1px solid #E6E9EC;
  }

  .module-title {
    color: #38435A;
    font-size: 14px;
    font-weight: 600;
    margin-top: 24px;
  }

  .baseInfo {
    margin-top: 22px;
    width: 100%;
    background: #F8F9FB;
    border-radius: 4px;
    color: #959FB4;
    font-size: 14px;
    padding: 0 14px 26px 14px;

    .base-line {
      padding-top: 14px;

      &:first-child {
        padding-top: 18px;
      }
    }
  }

  .markdownContent {
    background: #F8F9FB;
    margin-top: 18px;
    border-radius: 4px;
  }

  .graphyModule {
    width: 100%;
    margin-top: 18px;

    .left-warp {
      width: 482px;

      .nodeLine {
        background: #F8F9FB;
        width: 100%;
        height: 48px;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        color: #959FB4;
        margin-top: 34px;
        position: relative;

        &:first-child {
          margin-top: 0;
        }

        .step {
          position: absolute;
          bottom: -26px;
          left: 49%;
          font-size: 20px;
        }
      }
    }

    .right-warp {
      width: 428px;
      background: #F8F9FB;
    }
  }
}
</style>
