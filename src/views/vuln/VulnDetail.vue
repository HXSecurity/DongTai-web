<template>
  <main class="container">
    <div
      class="vuln-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <div class="go-back-title">
        <span @click="goBack">
          <i class="el-icon-arrow-left"></i> 返回漏洞列表
        </span>
      </div>
      <div class="vuln-title flex-row-space-between">
        <div
          style="
            flex: 1;
            max-width: 800px;
            word-break: break-all;
            line-height: 32px;
          "
        >
          {{
            `${vulnObj.vul.url} ${vulnObj.vul.http_method}出现${
              vulnObj.vul.type
            }漏洞${
              vulnObj.vul.taint_position
                ? `,位置:${vulnObj.vul.taint_position}`
                : ''
            }`
          }}
        </div>
        <div class="btnWarp">
          <el-select
            v-model="statusId"
            size="small"
            placeholder="状态变更"
            style="width: 104px"
            clearable
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
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="漏洞验证"
            placement="top"
          >
            <div class="checkedAllBtn" @click="recheckVul('project')">
              <i class="icon iconfont">&#xe6b5;</i>
            </div>
          </el-tooltip> -->
          <Sync
            :item="syncInfo"
            :setting-inte="settingInte"
            :get-table-data="init"
          ></Sync>

          <!-- <el-button type="text" class="btn" @click="recheckVul">
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
          </el-button> -->
        </div>
      </div>
      <div class="module-title has-log">
        <span>基本信息</span>
        <span class="get-log" @click="vullogBtn">查看日志</span>
      </div>
      <div class="infoWarp">
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> 危害级别： </span>
            <span
              class="dot"
              :style="{ color: levelColor(vulnObj.vul.level_type) }"
              >{{ vulnObj.vul.level }}</span
            >
          </div>
          <div v-dot class="info">
            <span class="label"> 首次出现： </span>
            <span>{{ vulnObj.vul.first_time }}</span>
          </div>
          <div v-dot class="info">
            <span class="label"> 最新活跃： </span>
            <span>
              <span>{{ vulnObj.vul.latest_time }}</span>
            </span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> 漏洞类型： </span>
            <el-tooltip
              effect="light"
              :content="vulnObj.vul.type"
              placement="top"
            >
              <span>{{ vulnObj.vul.type }}</span>
            </el-tooltip>
          </div>
          <div v-dot class="info">
            <span class="label"> 项目名称： </span>
            <el-tooltip
              effect="light"
              :content="vulnObj.vul.project_name"
              placement="top"
              :disabled="vulnObj.vul.project_name.length < 22"
            >
              <span>{{ vulnObj.vul.project_name }}</span>
            </el-tooltip>
          </div>
          <div v-dot class="info">
            <span class="label"> 中间件： </span>
            <span>{{ vulnObj.server.container }}</span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> 语言： </span>
            <span class="dot">{{ vulnObj.vul.language }}</span>
          </div>
          <div v-dot class="info">
            <span class="label"> 漏洞状态： </span>
            <span>{{ vulnObj.vul.status }}</span>
          </div>
          <div v-dot class="info" style="visibility: hidden">
            <span class="label"> 中间件： </span>
            <span>{{ vulnObj.server.container }}</span>
          </div>
        </div>
      </div>
      <div class="module-title">漏洞描述</div>
      <div class="vulnDesc">
        <!-- {{ vulnObj.strategy.desc }} -->
        <MyMarkdownIt
          :content="vulnObj.strategy.desc"
          style="color: #38435a"
        ></MyMarkdownIt>
        <div v-if="vulnObj.vul.type == '硬编码'" class="vulnDesc">
          <div class="top-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span> 字段：{{ vulnObj.vul.taint_position }} </span>
          </div>
          <div class="bottom-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span> 硬编码值：{{ vulnObj.vul.taint_value }} </span>
          </div>
        </div>
      </div>
      <template v-if="vulnObj.vul.is_need_http_detail">
        <div class="module-title">数据流</div>

        <div class="selectForm">
          <div
            v-for="item in httpOptions"
            :key="item.value"
            class="select-item"
            :class="item.value === state && 'active'"
            @click="state = item.value"
          >
            {{ item.label }}
          </div>
          <div class="replay-box">
            <div class="replay-btn" @click="goToPoolDetail">
              <i
                class="iconfont icon"
                style="margin-right: 4px; font-size: 12px"
                >&#xe6b3;</i
              >请求重放
            </div>
            <el-select
              v-model="requsetIndex"
              class="request-select"
              size="small"
              @change="changeRequest"
            >
              <el-option
                v-for="(request, key) in vulnObj.headers"
                :key="key"
                :value="key"
                :label="request.agent_name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-show="state === 1" class="markdownContent httpRequest">
          <MyMarkdownIt :content="req_md" style="color: #747c8c"></MyMarkdownIt>
        </div>
        <div v-show="state === 0" class="markdownContent httpRequest">
          <MyMarkdownIt :content="res_md" style="color: #747c8c"></MyMarkdownIt>
        </div>
        <div class="split-line"></div>
      </template>
      <div class="url-list">
        <UrlComponent
          v-for="(url, index) in urls"
          :key="index"
          :url="url"
        ></UrlComponent>
        <div class="pagination-box">
          <el-pagination
            :current-page="headerPage"
            background
            :page-sizes="[10, 20, 50, 100]"
            :page-size="headerPageSize"
            layout=" prev, pager, next, jumper, sizes, total"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
      <!-- Stain flow vul-->
      <div v-if="vulnObj.graphs.length" class="module-title">污点流图</div>
      <div v-if="vulnObj.graphs.length">
        <LinkList :tree="vulnObj.graphs"></LinkList>
      </div>
      <!-- <div
        v-if="
          vulnObj.graphs &&
          vulnObj.graphs.length === 1 &&
          vulnObj.stacks &&
          vulnObj.stacks.length
        "
      >
        <StacksList :tree="vulnObj.stacks"></StacksList>
      </div> -->
      <div class="split-line"></div>
      <div class="module-title">修复建议</div>
      <div class="markdownContent">
        <!-- :content="vulnObj.strategy.repair_suggestion" -->
        <MyMarkdownIt
          :content="vulnObj.strategy.repair_suggestion"
        ></MyMarkdownIt>
      </div>
      <div class="split-line"></div>
      <!--Runtime environment-->
      <div v-if="vulnObj.server.runtime" class="module-title">运行时环境</div>
      <div v-if="vulnObj.server.runtime" class="baseInfo">
        <div class="base-line">
          <span class="base-desc">{{ vulnObj.server.runtime }}</span>
        </div>
      </div>
      <!-- environment variable -->
      <div class="module-title">运行变量</div>
      <div class="baseInfo nopadding-top">
        <div class="base-line">
          <span class="base-title"> 启动命令 </span>
          <span class="base-desc">{{ vulnObj.server.command }}</span>
        </div>
        <div v-if="vulnObj.server.environment" class="base-line">
          <span class="base-title">其他</span>
        </div>
        <div v-if="vulnObj.server.environment" class="base-line">
          <span class="base-desc">{{ vulnObj.server.environment }} </span>
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

    <el-dialog
      :visible.sync="logDialogOpen"
      title="查看日志"
      width="700px"
      custom-class="log-dialog"
    >
      <div class="log-list">
        <div v-for="log in logList" :key="log.id" class="log-item">
          <div class="log-item-name">{{ log.msg }}</div>
          <div class="log-item-time">{{ fmtTime(log.datetime) }}</div>
        </div>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import request from '@/utils/request'
import { VulnListObj } from './types'
import qs from 'qs'
import LinkList from './components/linkList.vue'
import StacksList from './components/stacksList.vue'
import Sync from './components/sync.vue'
import UrlComponent from './components/urlComponent.vue'
import emitter from '../taint/Emitter'

@Component({
  name: 'VulnDetail',
  components: {
    LinkList,
    StacksList,
    Sync,
    UrlComponent,
  },
})
export default class VulnDetail extends VueBase {
  private sliderWarpContract = false
  private deleteDialogOpen = false
  private settingInte: any = []
  private logDialogOpen = false
  private statusId = ''
  private logList: any = []

  fmtTime(time: any) {
    return formatTimestamp(time)
  }
  async vullogBtn() {
    const res = await this.services.vuln.vullog(this.$route.query.id, '1')
    this.logList = res.status
    this.logDialogOpen = true
  }

  goBack = () => {
    // this.$router.push({
    //   name: 'vulnList',
    // })
    this.$router.go(-1)
  }

  private levelColor(level: any) {
    switch (level) {
      case 1:
        return '#E56363'
      case 2:
        return '#F49E0B'
      case 3:
        return '#2F90EA'
      case 4:
        return '#ABB2C0'
      case 5:
        return '#DBDBDB'
    }
  }

  private async getStatus() {
    const res = await this.services.vuln.vulStatus()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.statusOptions = res.data.map((item: any) => {
      return {
        value: item.id,
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
    { value: 1, label: '请求' },
    { value: 0, label: '响应' },
  ]

  private vulnObj: any = {
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
    headers: {},
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

  private syncInfo: any = {}
  async init() {
    this.page = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    this.cardIndex = 0
    await this.getStatus()
    await this.getVulnDetail()
    await this.getUrls()
    this.syncInfo = {
      id: this.$route.params.id,
    }
  }
  async created() {
    emitter.on('getUrls', this.getUrls)
    this.init()
  }

  async beforeDestroy() {
    emitter.off('getUrls', this.getUrls)
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
    if (!val) {
      return
    }
    this.$nextTick(() => {
      this.statusOptions.forEach((item: any) => {
        if (item.value === val) {
          this.vulnObj.vul.status = item.label
        }
      })
    })
    const res = await this.services.vuln.changeStatus({
      vul_id: this.selectedId,
      status_id: val,
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

  private requsetIndex = '0'
  private changeRequest(e: any) {
    this.requsetIndex = e
    this.req_md = this.vulnObj.headers[e].req_header
    this.res_md = this.vulnObj.headers[e].response
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
          return '<tt>' + match + '</tt>'
        })
      }
      for (let key in data.headers) {
        const str = data.headers[key].req_header
          .split('<')
          .join('&lt;')
          .split(`*`)
          .join('\\*')
        const strArr = str.split(`\n`)
        try {
          for (const key in data.vul.param_name) {
            console.log(key)
            switch (key) {
              case 'GET':
                const strArrNoSpace = strArr[0].split(' ')
                const strG = strArrNoSpace[1].split('?')
                const getObj = qs.parse(strG[1])
                const getRedStr = toRed(
                  strG[1],
                  getObj[data.vul.param_name[key]]
                )
                strG[1] = getRedStr
                strArrNoSpace[1] = strG.join('?')
                strArr[0] = strArrNoSpace.join(' ')
                console.log(getRedStr)
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
        data.headers[key].req_header = strArr.join('<br/>')
        data.headers[key].response = data.headers[key].response
          .split(`\n`)
          .join('<br/>')
      }

      this.requsetIndex = Object.keys(data.headers)[0]
      this.req_md = data.headers[this.requsetIndex]?.req_header
      this.res_md = data.headers[this.requsetIndex]?.response
      data.graphsv2 = []
      data.graphsv2.forEach((item: any) => {
        item.meta.stack[1].graph = item.graph
      })
      const newGraph: any = []
      if (data.graphs && data.graphs[0] && data.graphs[0].graph) {
        const graph = data.graphs[0].graph
        const meta = data.graphs[0].meta
        graph.forEach((item: any, index: any) => {
          if (item.uuid) {
            data.graphsv2.some((i: any) => {
              if (i.meta.uuid == item.uuid) {
                if (index == 0) {
                  i.graph.forEach((iitem: any, iindex: any) => {
                    if (iindex > 0) {
                      iitem.type = '传播方法'
                      iitem.tag = 'propagator'
                    }
                  })
                }
                if (index == graph.length - 1 && index > 1) {
                  i.graph.forEach((iitem: any, iindex: any) => {
                    iitem.type = '传播方法'
                    iitem.tag = 'propagator'
                  })
                }

                if (index < graph.length - 1 && index > 0) {
                  i.graph.forEach((iitem: any, iindex: any) => {
                    if (iindex < i.graph.length - 1) {
                      iitem.type = '传播方法'
                      iitem.tag = 'propagator'
                    }
                  })
                }
                item.graphv2 = i.graph
                item.metav2 = i.meta
                return true
              }
            })
          }
        })

        const transmit = graph.slice(0, graph.length - 1)
        const moreServer = transmit.some((item: any) => {
          if (item.uuid) {
            return true
          }
        })

        if (moreServer) {
          let g: any = {
            uuid: 'self',
            graphv2: [],
            metav2: {},
            type: '',
            code: '',
            targetValues: '',
            sourceValues: '',
            callerClass: '',
            callerLineNumber: 0,
          }
          graph.forEach((item: any, index: any) => {
            // 当第一个为服务时直接把第一个加入待渲染数组
            if (item.uuid && index === 0) {
              newGraph.push(item)
              return
            }
            // 当不是服务时 且不是最后一个的时候 先组装调用链服务
            if (!item.uuid && index !== graph.length - 1) {
              g.graphv2.push(item)
              item.isUsed = true
              if (!g.type) {
                g.type = item.type
                g.code = item.code
                g.targetValues = item.targetValues
                g.sourceValues = item.sourceValues
                g.callerClass = item.callerClass
                g.callerLineNumber = item.callerLineNumber
              }
              g.metav2 = {
                agent_language: meta.language,
                project_name: meta.project_name,
                project_version: meta.project_version,
                type: meta.language,
                uuid: 'self',
              }
            }

            // 当倒数第二个不是服务时候 把积攒起来的调用链组合为服务添加进入
            if (!item.uuid && index === graph.length - 2) {
              if (!item.isUsed) {
                g.graphv2.push(item)
              }
              if (!g.type) {
                g.type = item.type
                g.code = item.code
                g.targetValues = item.targetValues
                g.sourceValues = item.sourceValues
                g.callerClass = item.callerClass
                g.callerLineNumber = item.callerLineNumber
              }
              g.metav2 = {
                agent_language: meta.language,
                project_name: meta.project_name,
                project_version: meta.project_version,
                type: meta.language,
                uuid: 'self',
              }
              newGraph.push(JSON.parse(JSON.stringify(g)))
              return
            }

            // 当最后一个不是服务时候 直接把最后一个组装为服务并且加入链中
            if (!item.uuid && index === graph.length - 1) {
              g = {
                uuid: 'self',
                graphv2: [],
                metav2: {},
              }
              if (!g.type) {
                g.type = item.type
                g.code = item.code
                g.targetValues = item.targetValues
                g.sourceValues = item.sourceValues
                g.callerClass = item.callerClass
                g.callerLineNumber = item.callerLineNumber
              }
              g.graphv2.push(item)
              g.metav2 = {
                agent_language: meta.language,
                project_name: meta.project_name,
                project_version: meta.project_version,
                type: meta.language,
                uuid: 'self',
              }
              newGraph.push(JSON.parse(JSON.stringify(g)))
              return
            }

            // 当最后一个是服务时候 先把前面的加入链 再直接把最后一个服务加入链
            if (item.uuid && index !== graph.length - 1) {
              newGraph.push(JSON.parse(JSON.stringify(g)))
              newGraph.push(item)
              g = {
                uuid: 'self',
                graphv2: [],
                metav2: {},
              }
              return
            }
            if (!item.uuid && index == graph.length - 1) {
              newGraph.push(JSON.parse(JSON.stringify(g)))
              return
            }
          })
        } else {
          data.graphs[0].graph.forEach((item: any) => {
            item.onlyCard = true
          })
          if (data.graphs[0].graph.length > 3) {
            const middle = JSON.parse(JSON.stringify(data.graphs[0].graph[1]))
            const graphsv22 = graph.splice(1, graph.length - 1 - 1)
            middle.graphv2 = graphsv22
            graph.splice(1, 0, middle)
          }
          newGraph.push(...data.graphs[0].graph)
        }
      }

      this.vulnObj = {
        graphs: newGraph,
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
        headers: { ...data.headers },
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

  private urls: any = []
  private headerPage = 1
  private headerPageSize = 10
  async getUrls() {
    const res = await this.services.vuln.getHeaderVul({
      page: this.headerPage,
      page_size: this.headerPageSize,
      vul_id: this.selectedId,
    })
    if (res.status === 201) {
      this.urls = res.data
      this.total = res.page.alltotal
    } else {
      this.$message.error(res.msg)
    }
  }

  handleSizeChange(val: number) {
    this.headerPageSize = val
    this.getUrls()
  }

  handleCurrentChange(val: number) {
    this.headerPage = val
    this.getUrls()
  }

  // exportVul() {
  //   var projectName = this.vulnObj.vul.project_name
  //   request
  //     .get(
  //       `project/export?vid=${this.selectedId}&pid=${this.vulnObj.vul.project_id}`,
  //       {
  //         responseType: 'blob',
  //       }
  //     )
  //     .then((res: any) => {
  //       if (res.type === 'application/json') {
  //         this.$message.error({
  //           message: this.$t('views.vulnDetail.exportFail') as string,
  //           showClose: true,
  //         })
  //       } else {
  //         const blob = new Blob([res], {
  //           type: 'application/octet-stream',
  //         })
  //         const link = document.createElement('a')
  //         link.href = window.URL.createObjectURL(blob)
  //         link.download = projectName + '.doc'
  //         link.click()
  //         this.$message.success({
  //           message: this.$t('views.vulnDetail.exportSuccess') as string,
  //           showClose: true,
  //         })
  //       }
  //     })
  //     .catch(() => {
  //       this.$message.error({
  //         message: this.$t('views.vulnDetail.exportFail') as string,
  //         showClose: true,
  //       })
  //     })
  // }

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
tt {
  color: red !important;
  font-style: normal !important;
}
</style>

<style scoped lang="scss">
.go-back-title {
  padding-top: 16px;
  color: #0085ff;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.pagination-box {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.slider-warp-contract {
  width: calc(100% - 24px);
  margin-left: 23px;
}

.slider-warp-spreadOut {
  width: 1200px;
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
    align-items: flex-start;
    .btnWarp {
      margin-left: 20px;
      display: flex;
      align-items: center;
      position: relative;
      padding-right: 46px;
      .checkedAllBtn {
        width: 32px;
        height: 32px;
        background: #f2f3f5;
        border-radius: 2px;
        border: none;
        color: #4a72ae;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 8px;
        &:hover {
          color: #1a80f2;
        }
        i {
          line-height: 16px;
        }
      }
    }
  }

  .module-title {
    color: #38435a;
    margin-top: 16px;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    &.has-log {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .get-log {
      color: #1a80f2;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .infoWarp {
    background: #ffffff;
    border-radius: 4px;
    padding: 16px 0;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    .infoLine {
      margin-top: 16px;
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
          width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: bottom;
        }
        .label {
          color: #959fb4;
          font-size: 14px;
          i {
            font-size: 14px;
          }
        }
      }
    }
  }

  .vulnDesc {
    color: #38435a;
    font-size: 14px;
    line-height: 22px;
    margin-top: 16px;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding-bottom: 16px;
  }

  .markdownContent {
    height: 196px;
    overflow-y: auto;
    margin-top: 0;
    padding: 6px;
    /* 分隔线 */
    border: 1px solid #e6e9ec;
    border-radius: 2px;
    background: #fff;
  }

  .baseInfo {
    &.nopadding-top {
      padding: 0px 0px 16px 0px;
    }
    width: 100%;
    background: #fff;
    border-radius: 4px;
    color: #959fb4;
    font-size: 14px;
    padding: 16px 0px 16px 0px;
    max-height: 262px;
    overflow-y: auto;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    .base-line {
      .base-title {
        color: #38435a;
        font-weight: 600;
        font-family: 'PingFang SC';
        margin-top: 16px;
        margin-bottom: 8px;
        display: block;
      }
      .base-desc {
        font-weight: 400;
        font-family: 'PingFang SC';
        color: #38435a;
      }
    }
  }

  .markdownContent {
    background: #fff;
    margin-top: 16px;
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
            ::v-deepem {
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
  padding: 16px 0 0 0;
  .select-item {
    font-size: 14px;
    font-weight: 500;
    color: #959fb4;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    width: 60px;
    height: 32px;
    border-radius: 32px;
  }
  .select-item.active {
    color: #1a80f2;
    background: #f6f8fa;
  }
}

.replay-box {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  .replay-btn {
    cursor: pointer;
    margin-right: 8px;
    width: 108px;
    height: 32px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: #f2f3f5;
    border-radius: 2px;
    i {
      line-height: 14px;
    }
    &:hover {
      color: #1a80f2;
    }
  }

  .request-select {
    width: 364px;
  }
}

.split-line {
  padding-top: 16px;
  box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
}

.log-item {
  display: flex;
  box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  .log-item-name {
    color: #38435a;
  }
  .log-item-time {
    color: #959fb4;
  }
}

.top-stack {
  margin-top: 18px;
  position: relative;
  color: #9199a2;
  &:before {
    content: '';
    width: 1px;
    height: 20px;
    background: #dee4ea;
    position: absolute;
    left: 5px;
    top: 18px;
  }

  i {
    color: #5491ef;
    font-size: 12px;
    vertical-align: top;
    margin-right: 5px;
  }

  span {
    width: calc(100% - 18px);
    word-break: break-all;
    display: inline-block;
    vertical-align: top;
  }
}

.bottom-stack {
  margin-top: 18px;
  color: #9199a2;
  i {
    color: #6ec79f;
    font-size: 12px;
    vertical-align: top;
    margin-right: 5px;
  }

  span {
    width: calc(100% - 18px);
    word-break: break-all;
    display: inline-block;
    vertical-align: top;
  }
}
</style>

<style lang="scss">
.log-dialog {
  .el-dialog__header {
    background: #fafafa;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 0px 24px 16px 24px;
  }
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    &:hover {
      color: #1a80f2;
    }
  }
}
</style>
