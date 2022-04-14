<template>
  <main class="container">
    <div v-if="!sliderWarpContract" class="fixed-warp">
      <div class="slider-warp">
        <div class="titleForm">
          <!-- <el-select v-model="searchObj.order" size="mini" style="width: 90px">
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
          </el-input> -->
          {{ $t('views.vulnDetail.vulnList') }}
        </div>
        <div class="page-line flex-column-center">
          <div class="flex-row-space-between">
            <div class="flex-column-center">
              <el-pagination
                small
                layout="prev, next"
                :total="total"
                :current-page="page"
                :page-size="10"
                @current-change="currentChange"
              >
              </el-pagination>
            </div>
            <div class="flex-column-center">
              <span style="color: #969ba4; line-height: 25px">
                <strong style="color: #38435a; font-weight: 400">{{
                  page
                }}</strong
                >/{{ Math.ceil(total / 10) }}
              </span>
            </div>
            <div class="flex-column-center">
              <el-button
                type="text"
                style="color: #5782db"
                @click="getTableData"
              >
                {{ $t('views.vulnDetail.reload') }}
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
            {{
              `${item.uri} ${$t('views.vulnDetail.has')} ${item.type} ${$t(
                'views.vulnDetail.vuln'
              )}`
            }}
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
      class="vuln-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <div class="vuln-title flex-row-space-between">
        <div style="flex: 1; max-width: 700px; word-break: break-all">
          {{
            `${vulnObj.vul.url} ${$t('views.vulnDetail.is')}${
              vulnObj.vul.http_method
            }${$t('views.vulnDetail.reqHas')}${vulnObj.vul.type}${$t(
              'views.vulnDetail.vuln'
            )}${
              vulnObj.vul.taint_position
                ? `,${$t('views.vulnDetail.position')}:${
                    vulnObj.vul.taint_position
                  }`
                : ''
            }`
          }}
        </div>
        <div class="btnWarp">
          <el-button type="text" class="btn" @click="recheckVul">
            <i class="iconfont iconjiance-copy"></i>
            {{ $t('views.vulnDetail.recheck') }}
          </el-button>
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
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconfuwuqi-3"></i>
              {{ $t('views.vulnDetail.serverIp') }}:
            </span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="vulnObj.server.ip"
              placement="top-start"
            >
              <span class="dot">{{ vulnObj.server.ip }}</span>
            </el-tooltip>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconIp"></i>
              {{ $t('views.vulnDetail.clientIp') }}:
            </span>
            <span>{{ vulnObj.vul.client_ip }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconzhongjianjian"></i>
              {{ $t('views.vulnDetail.middleware') }}:
            </span>
            <span style="width: 140px; overflow: hidden">
              <span>{{ vulnObj.server.container }}</span>
            </span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconyuyan-2"></i>
              {{ $t('views.vulnDetail.language') }}:
            </span>
            <span>{{ vulnObj.vul.language }}</span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconproject"></i>
              {{ $t('views.vulnDetail.projectName') }}:
            </span>
            <span
              :class="vulnObj.vul.project_id && 'project-name'"
              @click="
                vulnObj.vul.project_id &&
                  $router.push(
                    '/project/projectDetail/' + vulnObj.vul.project_id
                  )
              "
              >{{ vulnObj.vul.project_name }}</span
            >
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconicon_details_banben"></i>
              {{ $t('views.vulnDetail.version') }}:
            </span>
            <span>{{ vulnObj.vul.project_version }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconshuju1"></i>
              {{ $t('views.vulnDetail.taintParamName') }}:
            </span>
            <span>{{
              (vulnObj.vul.param_name &&
                Object.values(vulnObj.vul.param_name).join(',')) ||
              $t('views.vulnDetail.empty')
            }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconloudong"></i>
              {{ $t('views.vulnDetail.taintValue') }}:
            </span>
            <span>{{ vulnObj.vul.taint_value || 0 }}</span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconshijian-3"></i>
              {{ $t('views.vulnDetail.first_time') }}:
            </span>
            <span>{{ vulnObj.vul.first_time }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconcishu-2"></i>
              {{ $t('views.vulnDetail.counts') }}:
            </span>
            <span>{{ vulnObj.vul.counts }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconweixian-2"></i>
              {{ $t('views.vulnDetail.level') }}:
            </span>
            <span>{{ vulnObj.vul.level }}</span>
          </div>
          <div v-dot class="info">
            <span class="label">
              <i class="iconfont iconicon_yingyong_zhuagntai"></i>
              {{ $t('views.vulnDetail.state') }}:
            </span>
            <el-select
              v-model="vulnObj.vul.status"
              :placeholder="$t('views.vulnDetail.untreated')"
              size="mini"
              style="width: 40%"
              filterable
              allow-create
              @change="changeStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info" style="flex: 2.5">
            <span class="label">
              <i class="iconfont iconapp"></i>
              {{ $t('views.vulnDetail.agent') }}:
            </span>
            <span>{{ vulnObj.vul.agent_name }}</span>
          </div>
        </div>
      </div>
      <div class="module-title">
        {{ $t('views.vulnDetail.vulnDesc') }}
      </div>
      <div class="vulnDesc">
        {{ vulnObj.strategy.desc }}
      </div>
      <template v-if="vulnObj.vul.is_need_http_detail">
        <div class="module-title">
          {{ $t('views.vulnDetail.httpRequest') }}
          <el-button
            style="
              margin-left: 8px;
              padding: 6px;
              background: #4a72ae;
              color: #fff;
            "
            size="mini"
            @click="goToPoolDetail"
            ><i
              class="iconfont icongears"
              style="margin-right: 6px; font-size: 12px"
            ></i
            >{{ $t('views.vulnDetail.replay') }}</el-button
          >
        </div>
        <div class="selectForm">
          <div class="select-item"></div>
          <div
            v-for="item in httpOptions"
            :key="item.value"
            class="select-item"
            :class="item.value === state && 'active'"
            @click="state = item.value"
          >
            {{ item.label }}
          </div>
        </div>
        <div v-show="state === 1" class="markdownContent httpRequest">
          <MyMarkdownIt :content="req_md" style="color: #747c8c"></MyMarkdownIt>
        </div>
        <div v-show="state === 0" class="markdownContent httpRequest">
          <MyMarkdownIt :content="res_md" style="color: #747c8c"></MyMarkdownIt>
        </div>
      </template>

      <!-- Stain flow vul-->
      <div
        v-if="vulnObj.graphs && vulnObj.graphs.length > 0"
        class="module-title"
      >
        {{ $t('views.vulnDetail.graph') }}
      </div>

      <div v-if="vulnObj.graphs && vulnObj.graphs.length > 0">
        <LinkList :tree="vulnObj.graphs"></LinkList>
      </div>
      <!-- 
      <div
        v-if="vulnObj.vul.graph && vulnObj.vul.graph.length > 0"
        class="graphModule flex-row-space-between"
      >
        <div class="left-warp">
          <div class="flex-row-space-between dot-list">
            <div class="tip">
              <i class="iconfont iconyuandianzhong" style="color: #5491ef"></i>
              <span>{{ $t('views.vulnDetail.stainSource') }}</span>
            </div>
            <div class="tip">
              <i class="iconfont iconyuandianzhong" style="color: #f3bc3f"></i>
              <span>{{ $t('views.vulnDetail.communicationMethod') }}</span>
            </div>
            <div class="tip">
              <i class="iconfont iconyuandianzhong" style="color: #ec984f"></i>
              <span>{{ $t('views.vulnDetail.dangerMethod') }}</span>
            </div>
          </div>
          <div
            v-for="(item, index) in vulnObj.vul.graph"
            :key="index"
            class="vuln-pic"
          >
            <div class="flex-column-center" style="padding: 0 5px">
              <i
                class="iconfont iconyuandianzhong"
                style="color: #ec984f"
                :style="
                  index === 0
                    ? { color: '#5491ef' }
                    : index === vulnObj.vul.graph.length - 1
                    ? { color: '#ec984f' }
                    : { color: '#f3bc3f' }
                "
              ></i>
            </div>
            <div class="info">
              <div class="nodeLine">
                <div class="node">
                  {{ item.node }}
                </div>
              </div>
              <div class="nodeLine">
                <div class="code">
                  <div v-dompurify-html="item.code"></div>
                </div>
                <div class="tag-list">
                  <div v-if="item.tag" class="tag">
                    {{ item.tag }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="light"
                    :disabled="item.file.length < 30"
                    :content="item.file"
                    placement="top"
                  >
                    <div class="file">file: {{ item.file }}</div>
                  </el-tooltip>
                  <div class="line">line:{{ item.line_number }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div v-if="vulnObj.strategy.repair_suggestion" class="module-title">
        {{ $t('views.vulnDetail.suggest') }}
      </div>
      <div v-if="vulnObj.strategy.repair_suggestion" class="markdownContent">
        <MyMarkdownIt
          :content="vulnObj.strategy.repair_suggestion"
        ></MyMarkdownIt>
      </div>
      <!--Runtime environment-->
      <div v-if="vulnObj.server.runtime" class="module-title">
        {{ $t('views.vulnDetail.devEnv') }}
      </div>
      <div v-if="vulnObj.server.runtime" class="baseInfo">
        <div class="base-line" style="padding: 10px 0px; height: 10px">
          <span>{{ vulnObj.server.runtime }}</span>
        </div>
      </div>
      <!-- environment variable -->
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

    <el-dialog
      :visible.sync="deleteDialogOpen"
      :title="$t('views.vulnDetail.deleteVuln')"
      width="25%"
    >
      <div style="text-align: center">
        <p style="color: #959fb4">
          {{ $t('views.vulnDetail.deleteVulnInfo') }}
        </p>
        <p style="color: #959fb4; margin-top: 14px">
          {{ $t('views.vulnDetail.deleteVulnDesc') }}
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="confirmDel" @click="vulnDelete">
          {{ $t('views.vulnDetail.deleteVulnEnter') }}
        </el-button>
        <el-button
          type="text"
          class="cancelDel"
          @click="deleteDialogOpen = false"
        >
          {{ $t('views.vulnDetail.cancel') }}
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
import qs from 'qs'
import LinkList from './components/linkList.vue'

@Component({
  name: 'VulnDetail',
  components: {
    LinkList,
  },
})
export default class VulnDetail extends VueBase {
  private sliderWarpContract = false
  private deleteDialogOpen = false

  private async getStatus() {
    const res = await this.services.vuln.vulStatus()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.statusOptions = res.data.map((item: any) => {
      return {
        value: item.name,
        label: item.name,
      }
    })
  }

  private statusOptions: Array<any> = [
    {
      value: this.$t('views.vulnDetail.reported'),
      label: this.$t('views.vulnDetail.reported'),
    },
    {
      value: this.$t('views.vulnDetail.confirmed'),
      label: this.$t('views.vulnDetail.confirmed'),
    },
    {
      value: this.$t('views.vulnDetail.fixed'),
      label: this.$t('views.vulnDetail.fixed'),
    },
    {
      value: this.$t('views.vulnDetail.ignored'),
      label: this.$t('views.vulnDetail.ignored'),
    },
  ]
  private state = 1
  private httpOptions = [
    { value: 1, label: this.$t('views.vulnDetail.req') },
    { value: 0, label: this.$t('views.vulnDetail.res') },
  ]

  private vulnObj: VulnObj = {
    graphs: [],
    vul: {
      url: '',
      uri: '',
      http_method: '',
      type: '',
      taint_position: '',
      first_time: 0,
      latest_time: 0,
      project_name: '',
      project_id: 0,
      language: '',
      level: '',
      counts: 0,
      req_header: '',
      graph: [],
      context_path: '',
      taint_value: '',
      param_name: '',
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
    await this.getStatus()
    await this.getVulnDetail()
    await this.getTableData()
  }

  private goToPoolDetail() {
    if (this.vulnObj.vul.method_pool_id) {
      const { href } = this.$router.resolve({
        path: `/taint/poolDetail/${this.vulnObj.vul.method_pool_id}?activeName=flowDebug`,
      })
      window.open(href, '_blank')
    } else {
      this.$message({
        showClose: true,
        message: this.$t('views.vulnDetail.canNotReplay') as string,
        type: 'error',
      })
    }
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }

  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  private async changeStatus(val: any) {
    const res = await this.services.vuln.changeStatus({
      id: this.selectedId,
      status: val,
    })
    if (res.status === 201) {
      this.$message({
        type: 'success',
        message: res.msg,
        showClose: true,
      })
    } else {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
    }
  }
  private req_md = ''
  private res_md = ''
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
      status_id: this.$route.query.status,
    }
    this.loadingStart()
    const { status, data, page, msg } = await this.services.vuln.vulnList(
      params
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
  isJSON(str: string) {
    if (typeof str == 'string') {
      try {
        JSON.parse(str)
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
  private async getVulnDetail() {
    this.loadingStart()
    const { data, status, msg } = await this.services.vuln.getVulnDetail(
      this.selectedId
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
    this.$nextTick(() => {
      function toRed(str: any, red: any) {
        const pattern = new RegExp(red, 'gi')
        return str.replace(pattern, function (match: string) {
          return "<tt style='color:red'>" + match + '</tt>'
        })
      }
      const str = data.vul.req_header
        .split('<')
        .join('&lt;')
        .split(`*`)
        .join('\\*')
      const strArr = str.split(`\n`)
      try {
        for (const key in data.vul.param_name) {
          switch (key) {
            case 'GET':
              const strArrNoSpace = strArr[0].split(' ')
              const strG = strArrNoSpace[1].split('?')
              const getObj = qs.parse(strG[1])
              const getRedStr = toRed(strG[1], getObj[data.vul.param_name[key]])
              strG[1] = getRedStr
              strArrNoSpace[1] = strG.join('?')
              strArr[0] = strArrNoSpace.join(' ')
              break
            case 'POST':
              if (!this.isJSON(strArr[strArr.length - 1])) {
                const postObj = qs.parse(strArr[strArr.length - 1])
                const postRedStr = toRed(
                  strArr[strArr.length - 1],
                  postObj[data.vul.param_name[key]]
                )
                strArr[strArr.length - 1] = postRedStr
              } else {
                const obj = JSON.parse(strArr[strArr.length - 1])
                const postRedStr = toRed(
                  strArr[strArr.length - 1],
                  obj[data.vul.param_name[key]]
                )
                strArr[strArr.length - 1] = postRedStr
              }

              break
            case 'COOKIE':
              strArr.forEach((item: any, index: number) => {
                if (item.indexOf('cookie:') > -1) {
                  const cookieG = item.split(':')
                  const cookieObj = qs.parse(cookieG[1])
                  const cookieRedStr = toRed(
                    cookieG[1],
                    cookieObj[data.vul.param_name[key]]
                  )
                  cookieG[1] = cookieRedStr
                  strArr[index] = cookieG.join(':')
                }
              })
              break
            case 'PATH':
              const strP = strArr[0].split('?')
              const pathRedStr = toRed(strP[0], data.vul.param_name[key])
              strP[0] = pathRedStr
              strArr[0] = strP.join('?')
              break
            case 'HEADER':
              strArr.forEach((item: any, index: number) => {
                if (item.indexOf(data.vul.param_name[key]) > -1) {
                  strArr[index] = toRed(item, item.split(':')[1])
                }
              })
              break
          }
        }
      } catch (e) {
        console.log(e)
      }
      this.req_md = strArr.join('<br/>')
      this.res_md = data.vul.response.split(`\n`).join('<br/>')

      const graphs: any = []
      data.graphs.forEach((item: any) => {
        graphs.push({
          url: item.meta.url,
          level_type: data.vul.level_type,
          open: true,
          vulnInfo: {
            ...item.meta,
            graph: item.graph,
            level_type: data.vul.level_type,
          },
        })
      })
      this.vulnObj = {
        graphs: graphs,
        vul: {
          ...data.vul,
          first_time: formatTimestamp(data.vul.first_time),
          latest_time: formatTimestamp(data.vul.latest_time),
          graph: data.vul.graph,
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
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
    } else {
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
      this.$router.push('/vuln/vulnList')
    }
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
      .get(
        `project/export?vid=${this.selectedId}&pid=${this.vulnObj.vul.project_id}`,
        {
          responseType: 'blob',
        }
      )
      .then((res: any) => {
        if (res.type === 'application/json') {
          this.$message.error({
            message: this.$t('views.vulnDetail.exportFail') as string,
            showClose: true,
          })
        } else {
          const blob = new Blob([res], {
            type: 'application/octet-stream',
          })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = projectName + '.doc'
          link.click()
          this.$message.success({
            message: this.$t('views.vulnDetail.exportSuccess') as string,
            showClose: true,
          })
        }
      })
      .catch(() => {
        this.$message.error({
          message: this.$t('views.vulnDetail.exportFail') as string,
          showClose: true,
        })
      })
  }

  private async recheckVul() {
    const params = {
      ids: this.selectedId.toString(),
    }
    const { status, msg } = await this.services.vuln.vulRecheck(params)
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
    } else {
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
    }
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
  height: calc(100vh - 83px);
  padding-bottom: 40px;

  .titleForm {
    border-bottom: 1px solid #e6e9ec;
    padding: 14px 0;
    font-size: 16px;
    font-weight: 600;
    margin: 0 12px;
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
  overflow: hidden;
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
    word-wrap: break-word;
    .btnWarp {
      width: 260px;
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
      .project-name {
        color: #4a72ae;
        cursor: pointer;
      }
      &:first-child {
        margin-top: 0;
      }
      .info {
        flex: 1;
        color: #38435a;
        .dot {
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

  .markdownContent.httpRequest {
    height: 196px;
    overflow-y: auto;
    margin-top: 0;
    /deep/tt {
      color: red !important;
      font-style: normal !important;
    }
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

  .graphModule {
    width: 100%;
    margin-top: 18px;

    .left-warp {
      width: 100%;
      .dot-list {
        width: 350px;
      }
      .tip {
        flex: 1;
        color: #38435a;
        font-size: 14px;
        line-height: 0;
        align-items: center;
        display: flex;
        .iconyuandianzhong {
          font-size: 18px;
          margin-left: 6px;
          margin-right: 4px;
          line-height: 18px;
        }
      }
      .vuln-pic {
        display: flex;
        align-items: center;
        margin-top: 24px;
        & + .vuln-pic {
          margin-top: 32px;
          position: relative;
          &::after {
            position: absolute;
            left: 11px;
            top: -50px;
            width: 2px;
            height: 100%;
            content: '';
            background: #e9eef8;
          }
        }
        .info {
          display: flex;
          align-items: center;
          background: #f8f9fb;
          width: 100%;
        }
        .nodeLine {
          word-wrap: break-word;
          white-space: normal;
          word-break: break-all;
          width: 50%;
          padding: 16px;
          border-radius: 2px;
          &:first-child {
            margin-top: 0;
          }
          .code {
            font-size: 14px;
            line-height: 14px;
            color: #959fb4;
            /deep/em {
              color: red;
              font-style: normal;
            }
          }
          .tag-list {
            display: flex;
            margin-top: 12px;
            div + div {
              margin-left: 20px;
            }
            .tag {
              background: rgba(88, 142, 225, 0.1);
              border-radius: 2px;
              color: #588ee1;
              padding: 0 6px;
              font-size: 12px;
              line-height: 14px;
            }
            .file {
              color: #45b4a0;
              background: rgba(69, 180, 160, 0.1);
              border-radius: 2px;
              padding: 0 6px;
              font-size: 12px;
              line-height: 14px;
              max-width: 160px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .line {
              color: #e18c58;
              background: rgba(225, 140, 88, 0.1);
              border-radius: 2px;
              padding: 0 6px;
              font-size: 12px;
              line-height: 14px;
            }
          }
        }
      }
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
      min-width: 80px;
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

.selectForm {
  display: flex;
  padding: 10px 0 0 0;
  .select-item {
    font-size: 12px;
    font-weight: 500;
    color: #959fb4;
    text-align: center;
    line-height: 28px;
    cursor: context-menu;
  }
  .select-item + .select-item {
    cursor: pointer;
    width: 80px;
    height: 28px;
  }
  .select-item.active {
    color: #1a80f2;
    background: #f6f8fa;
  }
}
</style>
