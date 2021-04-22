<template>
  <main class="container">
    <div v-if="!sliderWarpContract" class="fixed-warp">
      <div class="slider-warp">
        <div class="titleForm flex-row-space-between">
          <el-select v-model="searchObj.order" size="mini" style="width: 90px">
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-input v-model="searchObj.url" style="width: 106px" size="mini">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="newSelectData"
            />
          </el-input>
        </div>
        <div class="page-line flex-column-center">
          <div class="flex-row-space-between">
            <div class="flex-column-center">
              <el-pagination
                small
                layout="prev, next"
                :total="total"
                :current-page="page"
                :page-size="20"
                @current-change="currentChange"
              >
              </el-pagination>
            </div>
            <div class="flex-column-center">
              <span style="color: #969ba4; line-height: 25px">
                <strong style="color: #38435a; font-weight: 400">{{
                  page
                }}</strong
                >/{{ Math.ceil(total / 20) }}
              </span>
            </div>
            <div class="flex-column-center">
              <el-button
                type="text"
                style="color: #5782db"
                @click="getTableData"
              >
                刷新
              </el-button>
            </div>
          </div>
        </div>
        <div
          v-for="item in tableData"
          :key="item.id"
          track-by="$index"
          class="card"
          :class="
            item.id === selectedId
              ? cardRowClassName(true, item.index)
              : cardRowClassName(false, item.index)
          "
          @click="idChange(item.id)"
        >
          <div class="titleLine">
            {{ `${item.uri}存在${item.type}漏洞` }}
          </div>
          <div class="infoLine flex-row-space-between">
            <span
              :style="
                item.level_type === 1
                  ? { color: '#EA7171' }
                  : item.level_type === 2
                  ? { color: '#F39D0A' }
                  : item.level_type === 3
                  ? { color: '#2E8FE9' }
                  : item.level_type === 4
                  ? { color: '#7BC1AB' }
                  : ''
              "
            >
              <i class="iconfont iconweixian" style="font-size: 14px"></i>
              {{ item.level }}
            </span>
            <span>
              <i class="iconfont iconshijian-2" style="font-size: 14px"></i>
              {{ item.latest_time }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="operateCol"
      :style="sliderWarpContract ? {} : { 'margin-left': '228px' }"
    >
      <div style="height: 100%">
        <i
          class="iconfont operateIcon"
          :class="sliderWarpContract ? 'iconopen1-2' : 'iconopen11'"
          @click="sliderWarpContract = !sliderWarpContract"
        ></i>
      </div>
    </div>
    <div
      v-if="vulnObj.vul.url"
      class="vuln-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <div class="vuln-title flex-row-space-between">
        <div style="flex:1">
          {{
            `${vulnObj.vul.url}的${vulnObj.vul.http_method}请求出现${
              vulnObj.vul.type
            }漏洞${
              vulnObj.vul.taint_position
                ? `，位置：${vulnObj.vul.taint_position}`
                : ''
            }`
          }}
        </div>
        <div class="btnWarp">
          <el-button type="text" class="btn" @click="exportVul">
            <i class="iconfont icondaochu-5"></i>
            {{ $t('views.vulnDetail.export') }}
          </el-button>
          <el-button type="text" class="btn" @click="deleteDialogOpen = true">
            <i class="iconfont iconshanchu-6"></i>
            {{ $t('views.vulnDetail.delete') }}
          </el-button>
        </div>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.baseInfo') }}
      </div>
      <div class="infoWarp">
        <div class="infoLine flex-row-space-between">
          <div class="info">
            <span class="label">
              <i class="iconfont iconfuwuqi-3"></i>
              {{ $t('views.vulnDetail.serverIp') }}:
            </span>
            <el-tooltip class="item" effect="dark" :content="vulnObj.server.ip" placement="top-start">
              <span class="dot">{{ vulnObj.server.ip }}</span>
            </el-tooltip>
          </div>
          <div class="info">
            <span class="label">
              <i class="iconfont iconproject"></i>
              {{ $t('views.vulnDetail.projectName') }}:
            </span>
            <span>{{ vulnObj.vul.project_name }}</span>
          </div>
          <div class="info">
            <span class="label">
              <i class="iconfont iconzhongjianjian"></i>
              {{ $t('views.vulnDetail.middleware') }}:
            </span>
            <span style="width: 140px; overflow: hidden">
              <span>{{ vulnObj.server.container }}</span>
            </span>
          </div>
          <div class="info" style="flex:1.5">
            <span class="label">
              <i class="iconfont iconshijian-3"></i>
              {{ $t('views.vulnDetail.first_time') }}:
            </span>
              <span>{{ vulnObj.vul.first_time }}</span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div class="info">
            <span class="label">
              <i class="iconfont iconIp"></i>
              {{ $t('views.vulnDetail.clientIp') }}:
            </span>
            <span>{{ vulnObj.vul.client_ip }}</span>
          </div>
          <div class="info">
            <span class="label">
              <i class="iconfont iconyuyan-2"></i>
              {{ $t('views.vulnDetail.language') }}:
            </span>
            <span>{{ vulnObj.vul.language }}</span>
          </div>
          <div class="info">
            <span class="label">
              <i class="iconfont iconweixian-2"></i>
              {{ $t('views.vulnDetail.level') }}:
            </span>
            <span>{{ vulnObj.vul.level }}</span>
          </div>
          <div class="info" style="flex:1.5">
            <span class="label">
              <i class="iconfont iconcishu-2"></i>
              {{ $t('views.vulnDetail.counts') }}:
            </span>
            <span>{{ vulnObj.vul.counts }}</span>
          </div>
        </div>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.vulnDesc') }}
      </div>
      <div class="vulnDesc">
        {{ vulnObj.strategy.desc }}
      </div>

      <div class="module-title">
        {{ $t('views.vulnDetail.httpRequest') }}
      </div>
      <div class="markdownContent httpRequest">
        <MyMarkdownIt
          :content="vulnObj.vul.req_header"
          style="color: #747c8c"
        ></MyMarkdownIt>
      </div>
      <!-- 污点流图-->
      <div
        v-if="vulnObj.vul.graphy && vulnObj.vul.graphy.length > 0"
        class="module-title"
      >
        {{ $t('views.vulnDetail.graphy') }}
      </div>
      <div
        v-if="vulnObj.vul.graphy && vulnObj.vul.graphy.length > 0"
        class="graphyModule flex-row-space-between"
      >
        <div class="left-warp">
          <div class="flex-row-space-between">
            <div class="tip">
              <i
                class="iconfont iconyuandianzhong"
                style="font-size: 12px; color: #5491ef"
              ></i>
              污点来源
            </div>
            <div class="tip">
              <i
                class="iconfont iconyuandianzhong"
                style="font-size: 12px; color: #f3bc3f"
              ></i>
              传播方法
            </div>
            <div class="tip">
              <i
                class="iconfont iconyuandianzhong"
                style="font-size: 12px; color: #ec984f"
              ></i>
              危险方法
            </div>
          </div>
          <div
            v-for="(item, index) in vulnObj.vul.graphy"
            :key="index"
            class="nodeLine flex-row-space-between"
          >
            <div class="flex-column-center" style="padding: 0 5px">
              <i
                class="iconfont iconyuandianzhong"
                style="font-size: 12px; color: #ec984f"
                :style="
                  index === 0
                    ? { color: '#5491ef' }
                    : index === vulnObj.vul.graphy.length - 1
                    ? { color: '#ec984f' }
                    : { color: '#f3bc3f' }
                "
              ></i>
            </div>
            <div class="node">
              {{ item.node }}
            </div>
            <i
              v-if="index < vulnObj.vul.graphy.length - 1"
              class="step el-icon-bottom"
            ></i>
          </div>
        </div>
        <div class="right-warp">
          <el-table
            class="graphyTable"
            :data="vulnObj.vul.graphy"
            style="background: #f8f9fb"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="expand">
              <template slot-scope="{ row }">
                <div class="expand-form">
                  <div class="expand-item">
                    <div class="expand-label">
                      {{ $t('views.vulnDetail.type') }}
                    </div>
                    <div class="expand-info">
                      {{ row.type }}
                    </div>
                  </div>
                  <div class="expand-item">
                    <div class="expand-label">
                      {{ $t('views.vulnDetail.file') }}
                    </div>
                    <div class="expand-info">
                      {{ row.file }}
                    </div>
                  </div>
                  <div class="expand-item">
                    <div class="expand-label">
                      {{ $t('views.vulnDetail.caller') }}
                    </div>
                    <div class="expand-info">
                      {{ row.caller }}
                    </div>
                  </div>
                  <div class="expand-item">
                    <div class="expand-label">
                      {{ $t('views.vulnDetail.num') }}
                    </div>
                    <div class="expand-info">
                      {{ row.line_number }}
                    </div>
                  </div>
                  <div class="expand-item">
                    <div class="expand-label">
                      {{ $t('views.vulnDetail.wuDianZhi') }}
                    </div>
                    <div class="expand-info">
                      {{ row.target }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('views.vulnDetail.type')"
              prop="type"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$t('views.vulnDetail.fileAndNum')"
              min-width="100px"
            >
              <template slot-scope="{ row }">
                <div class="file_and_num">
                  <div>{{ row.file }}</div>
                  <div v-if="row.line_number">{{ row.line_number }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              :label="$t('views.vulnDetail.wuDianZhi')"
              prop="target"
            >
              <tamplate slot-scope="{ row }">
                <div class="stain">{{ row.target }}</div>
              </tamplate>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="vulnObj.strategy.repair_suggestion" class="module-title">
        {{ $t('views.vulnDetail.suggest') }}
      </div>
      <div v-if="vulnObj.strategy.repair_suggestion" class="markdownContent">
        <MyMarkdownIt
          :content="vulnObj.strategy.repair_suggestion"
        ></MyMarkdownIt>
      </div>
      <!--运行时环境-->
      <div v-if="vulnObj.server.runtime" class="module-title">
        {{ $t('views.vulnDetail.devEnv') }}
      </div>
      <div v-if="vulnObj.server.runtime" class="baseInfo">
        <div class="base-line" style="padding: 10px 0px; height: 10px">
          <span>{{ vulnObj.server.runtime }}</span>
        </div>
      </div>
      <!--      环境变量-->
      <div class="module-title">
        {{ $t('views.vulnDetail.path') }}
      </div>
      <div class="baseInfo">
        <div class="base-line">
          <span
            style="
              color: black;
              font-family: PingFangSC-Medium, PingFang SC;
              display: block;
            "
          >
            {{ $t('views.vulnDetail.command') }}
          </span>
          <span style="display: block; margin-top: 6px">{{
            vulnObj.server.command
          }}</span>
        </div>
        <div v-if="vulnObj.server.environment" class="base-line">
          <span
            style="color: black; font-family: PingFangSC-Medium, PingFang SC"
            >{{ $t('views.vulnDetail.other') }}</span
          >
        </div>
        <div
          v-if="vulnObj.server.environment"
          class="base-line"
          style="padding-top: 6px"
        >
          <span style="color: #849ed8">{{ vulnObj.server.environment }} </span>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="deleteDialogOpen" title="删除漏洞" width="25%">
      <div style="text-align: center">
        <p style="color: #959fb4">漏洞删除后，将不可恢复</p>
        <p style="color: #959fb4; margin-top: 14px">请确认是否删除？</p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="confirmDel" @click="vulnDelete">
          确认删除
        </el-button>
        <el-button
          type="text"
          class="cancelDel"
          @click="deleteDialogOpen = false"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import request from '@/utils/request'
import { VulnListObj, VulnObj } from './types'

@Component({ name: 'VulnDetail' })
export default class VulnDetail extends VueBase {
  private sliderWarpContract = false
  private deleteDialogOpen = false
  private vulnObj: VulnObj = {
    vul: {
      url: '',
      uri: '',
      http_method: '',
      type: '',
      taint_position: '',
      first_time: 0,
      latest_time: 0,
      project_name: '',
      language: '',
      level: '',
      counts: 0,
      req_header: '',
      graphy: [],
      context_path: '',
    },
    server: {
      name: '',
      hostname: '',
      ip: '',
      port: 0,
      container: '',
      container_path: '',
      runtime: '',
      environment: '',
      command: '',
    },
    strategy: {
      desc: '',
      sample_code: '',
      repair_suggestion: '',
    },
  }
  private tableData: Array<VulnListObj> = []
  private page = 1
  private selectedId = 0
  private total = 0
  private cardIndex = 0
  private searchObj = {
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: '',
  }

  private orderOptions = [
    {
      label: this.$t('views.vulnList.orderOptions.type'),
      value: 'type',
    },
    {
      label: this.$t('views.vulnList.orderOptions.level'),
      value: 'level',
    },
    {
      label: this.$t('views.vulnList.orderOptions.url'),
      value: 'url',
    },
    {
      label: this.$t('views.vulnList.orderOptions.latest_time'),
      value: 'latest_time',
    },
    {
      label: this.$t('views.vulnList.orderOptions.first_time'),
      value: 'first_time',
    },
  ]

  async created() {
    this.page = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    this.cardIndex = 0
    await this.getVulnDetail()
    await this.getTableData()
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }

  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: 10,
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order,
    }
    this.loadingStart()
    const { status, data, page, msg } = await this.services.vuln.vulnList(
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data.reduce(
      (list: Array<VulnListObj>, item: VulnListObj) => {
        list.push({
          ...item,
          latest_time: getPassedTime(item.latest_time),
        })
        return list
      },
      []
    )
    this.total = page.alltotal
  }

  private idChange(id: number) {
    this.selectedId = id
    this.getVulnDetail()
  }

  private async getVulnDetail() {
    this.loadingStart()
    const { data, status, msg } = await this.services.vuln.getVulnDetail(
      this.selectedId
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.$nextTick(() => {
      this.vulnObj = {
        vul: {
          ...data.vul,
          req_header: data.vul.req_header.replace(/\n/g, '<br/>'),
          first_time: formatTimestamp(data.vul.first_time),
          latest_time: formatTimestamp(data.vul.latest_time),
          graphy: data.vul.graphy,
        },
        server: {
          ...data.server,
        },
        strategy: {
          ...data.strategy,
        },
      }
    })
  }

  private async vulnDelete() {
    this.loadingStart()
    const { status, msg } = await this.services.vuln.vulnDelete(this.selectedId)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
    }
    this.$message.success(msg)
    this.$router.push('/vuln/vulnList')
  }

  tableRowClassName() {
    return 'diy-row'
  }

  cardRowClassName(select: boolean, index: number) {
    var className = ''
    if (select) {
      className = 'selected'
    } else {
      if (index % 2 === 0) {
        className = 'card-gap'
      }
    }
    return className
  }

  exportVul() {
    var projectName = this.vulnObj.vul.project_name
    request
      .get(`project/export?pname=${projectName}&vid=${this.selectedId}`, {
        responseType: 'blob', // 告诉服务器我们需要的响应格式
      })
      .then((res: any) => {
        if (res.hasOwnProperty('response')) {
          this.$message.error({ message: '报告导出失败', showClose: true })
        } else {
          const blob = new Blob([res], {
            type: 'application/octet-stream', // 将会被放入到blob中的数组内容的MIME类型
          })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = projectName + '.doc'
          link.click()
          this.$message.success({ message: '报告导出成功', showClose: true })
        }
      })
      .catch((error) => {
        this.$message.error({ message: '报告导出失败', showClose: true })
      })
  }
}
</script>

<style>
.el-table .diy-row {
  background: #fff;
  color: #959fb4;
  font-size: 14px;
}
</style>

<style scoped lang="scss">
.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.slider-warp {
  //margin-top: 14px;
  background: #fff;
  width: 234px;
  margin-top: 78px;
  overflow: auto;
  height: calc(100vh - 103px);
  padding-bottom: 40px;

  .titleForm {
    border-bottom: 1px solid #e6e9ec;
    padding: 14px 4px;
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
      background: #eff6ff;
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
      color: #a2a5ab;
      margin-top: 19px;
    }
  }

  .selected {
    background: #eff6ff;
  }

  .card-gap {
    background: #fbfcff;
  }
}

.operateCol {
  position: fixed;
  overflow: auto;
  height: calc(100vh - 64px);
  .operateIcon {
    font-size: 26px;
    color: #c5d6e2;
    cursor: pointer;
    line-height: 100vh;
  }
}

.slider-warp-contract {
  width: calc(100% - 24px);
  margin-left: 23px;
}

.slider-warp-spreadOut {
  width: 952px;
  margin-left: 248px;
}

.vuln-warp {
  margin-top: 14px;
  min-height: calc(100vh - 104px);
  margin-bottom: 26px;
  background: #fff;
  padding: 0 14px 41px 14px;

  .vuln-title {
    padding-top: 24px;
    padding-bottom: 10px;
    font-size: 16px;
    color: #38435a;
    font-weight: 600;
    border-bottom: 1px solid #e6e9ec;

    .btnWarp {
      width: 200px;
      margin-left: 20px;
      .btn {
        width: 80px;
        height: 32px;
        line-height: 0;
        border-radius: 2px;
        border: 1px solid #4a72ae;
        color: #4a72ae;
      }
    }
  }

  .module-title {
    color: #38435a;
    font-size: 14px;
    font-weight: 600;
    margin-top: 24px;
  }

  .infoWarp {
    margin-top: 8px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px #dde2e6;
    border-radius: 4px;
    padding: 22px;

    .infoLine {
      margin-top: 28px;

      &:first-child {
        margin-top: 0;
      }
      .info {
        flex: 1;
        color: #38435a;
        .dot{
          display: inline-block;
          width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: bottom;
        }
        .label {
          color: #5782db;
          font-size: 14px;

          i {
            font-size: 14px;
          }
        }
      }
    }
  }

  .vulnDesc {
    color: #959fb4;
    font-size: 14px;
    line-height: 22px;
    margin-top: 16px;
  }

  .httpRequest {
    height: 196px;
    overflow-y: auto;
  }

  .baseInfo {
    margin-top: 22px;
    width: 100%;
    background: #f8f9fb;
    border-radius: 4px;
    color: #959fb4;
    font-size: 14px;
    padding: 0 14px 26px 14px;
    max-height: 262px;
    overflow-y: auto;

    .base-line {
      padding-top: 14px;
      word-break: break-all;

      &:first-child {
        padding-top: 18px;
      }
    }
  }

  .markdownContent {
    background: #f8f9fb;
    margin-top: 18px;
    border-radius: 4px;
  }

  .graphyModule {
    width: 100%;
    margin-top: 18px;

    .left-warp {
      width: 49%;

      .tip {
        flex: 1;
        color: #38435a;
        font-size: 14px;
      }

      .nodeLine {
        border: 1px solid #e9edf5;
        background: #fff;
        width: 100%;
        font-size: 14px;
        color: #646e83;
        margin-top: 34px;
        position: relative;

        &:first-child {
          margin-top: 0;
        }

        .node {
          flex: 1;
          text-align: center;
          line-height: 20px;
          padding: 10px 10px;
          word-break: break-all;
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
      width: 49%;
      background: #f8f9fb;
    }
  }
}

.file_and_num {
  height: 51px;
  line-height: 51px;
  display: flex;
  div {
    flex: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div + div {
    flex: 1;
  }
}
.stain {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.confirmDel {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}

.cancelDel {
  width: 124px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}

.expand-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  .expand-item {
    margin-top: 20px;
    display: flex;
    .expand-label {
      min-width: 70px;
      color: #99a9bf;
    }
    .expand-info {
      word-wrap: break-word;
      white-space: normal;
      word-break: break-all;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}
</style>
