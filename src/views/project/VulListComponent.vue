<template>
  <main class="flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center" style="height: 54px">
        <div class="flex-row-space-between">
          <span class="filter-title">过滤器</span>
          <el-button type="text" class="reset-btn" @click="reset">
            <span>重置全部</span>
          </el-button>
        </div>
      </div>
      <div
        v-if="searchOptionsObj.level.length"
        class="module-title flex-row-space-between"
      >
        <span class="filter-box-title"> 危险等级 </span>
      </div>
      <el-checkbox
        v-for="(item, index) in searchOptionsObj.level"
        :key="'level' + item.id || item.vul_level_id + '-' + index"
        v-model="searchObj.level_str"
        :label="item.id || item.vul_level_id"
        class="flex-row-space-between module-line"
        @change="newSelectData"
      >
        <div class="check-label">
          <div class="selectOption">
            {{ item.name || item.vul_level__name }}
          </div>
          <div class="num">
            {{ item.num || item.total }}
          </div>
        </div>
      </el-checkbox>

        <div
          v-if="searchOptionsObj.status"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 漏洞状态 </span>
        </div>
        <el-checkbox
          v-for="(item, index) in searchOptionsObj.status"
          :key="'status' + item.id + '-' + index"
          v-model="searchObj.status_str"
          :label="item.id"
          class="flex-row-space-between module-line"
          @change="newSelectData"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.name }}
            </div>
            <div class="num">
              {{ item.num }}
            </div>
          </div>
        </el-checkbox>
      <template v-if="vulnType === 'sca'">
        <div
          v-if="searchOptionsObj.availability.length"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 可利用性 </span>
        </div>
        <el-checkbox
          v-for="(item, index) in searchOptionsObj.availability"
          :key="'availability' + item.id + '-' + index"
          v-model="searchObj.availability_str"
          :label="item.id"
          class="flex-row-space-between module-line"
          @change="newSelectData"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.name }}
            </div>
            <div class="num">
              {{ item.num }}
            </div>
          </div>
        </el-checkbox>
      </template>
      <template v-if="vulnType === 'scan'">
        <div
          v-if="searchOptionsObj.hook_type.length"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 漏洞类型 </span>
        </div>
        <el-checkbox
          v-for="(item, index) in searchOptionsObj.hook_type"
          :key="'hook_type' + item.vul_type + '-' + index"
          v-model="searchObj.hook_type_str"
          :label="item.vul_type"
          class="flex-row-space-between module-line"
          @change="newSelectData"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.vul_type }}
            </div>
            <div class="num">
              {{ item.total }}
            </div>
          </div>
        </el-checkbox>
      </template>

      <template v-if="vulnType === 'vuln'">
        <div
          v-if="searchOptionsObj.hook_type"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 漏洞类型 </span>
        </div>
        <el-checkbox
          v-for="(item, index) in searchOptionsObj.hook_type"
          :key="'hook_type' + item.id + '-' + index"
          v-model="searchObj.hook_type_str"
          :label="item.id"
          class="flex-row-space-between module-line"
          @change="newSelectData"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.name }}
            </div>
            <div class="num">
              {{ item.num }}
            </div>
          </div>
        </el-checkbox>
      </template>
    </div>
    <div class="main-warp">
      <div class="top-place-bar"></div>
      <div class="tool-box">
        <div class="selectForm">
          <div class="selectInput">
            <el-input
              v-model="searchObj.keywords"
              size="small"
              placeholder="输入漏洞名称搜索"
              @keyup.enter.native="newSelectData"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="newSelectData"
              />
            </el-input>
          </div>
          <div class="sort-box">
            <el-select
              v-model="searchObj.order_type"
              size="small"
              style="width: 150px; font-size: 14px"
              class="commonSelect vulnSelect"
              :placeholder="$t('views.vulnList.sort')"
              clearable
              @change="newSelectData"
            >
              <el-option
                v-for="item in searchOptionsObj.orderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <i
              v-if="searchObj.sort === null"
              class="el-icon-sort sort-btn"
              @click="sortSelect(true)"
            ></i>
            <i
              v-if="searchObj.sort === true"
              class="el-icon-sort-up sort-btn"
              @click="sortSelect(false)"
            ></i>
            <i
              v-if="searchObj.sort === false"
              class="el-icon-sort-down sort-btn"
              @click="sortSelect(null)"
            ></i>
          </div>
        </div>
        <div class="select">
          <div
            :class="vulnType === 'vuln' ? 'active' : ''"
            @click="changeVulnType('vuln')"
          >
            应用漏洞
          </div>
          <!-- <div
            :class="vulnType === 'sca' ? 'active' : ''"
            @click="changeVulnType('sca')"
          >
            组件漏洞
          </div> -->
          <!-- <div
            :class="vulnType === 'scan' ? 'active' : ''"
            @click="changeVulnType('scan')"
          >
            扫描漏洞
          </div> -->
        </div>
        <div class="checked-bar">
          <div>
            <el-checkbox
              style="margin-right: 8px"
              :value="
                tableData.length > 0 && tableData.every((item) => item.checked)
              "
              @change="selectAll"
              >已筛选
              <span style="color: #1a80f2">{{
                tableData.filter((item) => item.checked).length
              }}</span>
              项</el-checkbox
            >
          </div>

          <div class="top-tool-bar">
            <el-select
              v-if="vulnType === 'vuln'"
              v-model="statusSelect"
              size="small"
              placeholder="状态变更"
              style="width: 104px"
              clearable
              @change="changeStatus"
            >
              <el-option
                v-for="status in searchOptionsObj.statusOptions"
                :key="status.value"
                :value="status.value"
                :label="status.label"
              ></el-option>
            </el-select>
            <!-- <el-tooltip
              v-if="vulnType === 'vuln'"
              class="item"
              effect="dark"
              content="漏洞验证"
              placement="top"
            >
              <div class="checkedAllBtn" @click="recheck('project')">
                <i class="icon iconfont">&#xe6b5;</i>
              </div>
            </el-tooltip> -->
            <el-tooltip
              v-if="vulnType !== 'scan'"
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <div class="checkedAllBtn" @click="deleteVul()">
                <i class="icon iconfont">&#xe6ae;</i>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="tool-box-placeholder"></div>
      <div v-for="(item, index) in tableData" :key="'card' + item.id + index">
        <VulnCard
          v-if="vulnType === 'vuln'"
          :item="item"
          :search-obj="searchObj"
          :setting-inte="settingInte"
          :get-table-data="getTableData"
        ></VulnCard>
        <ScaCard
          v-if="vulnType === 'sca'"
          :item="item"
          :search-obj="searchObj"
          :setting-inte="settingInte"
          :get-table-data="getTableData"
        ></ScaCard>
        <ScanCard
          v-if="vulnType === 'scan'"
          :item="item"
          :search-obj="searchObj"
          :setting-inte="settingInte"
          :get-table-data="getTableData"
        ></ScanCard>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import { VulnListObj } from '@/views/vuln/types'
import VulnCard from '@/views/vuln/components/vulnCard.vue'
import ScaCard from '@/views/vuln/components/ScaCard.vue'
import ScanCard from '@/views/vuln/components/ScanCard.vue'

@Component({
  name: 'VulListComponent',
  components: { VulnCard, ScaCard, ScanCard },
})
export default class VulListComponent extends VueBase {
  @Prop() version: number | string | undefined
  @Prop() projectId!: string | number | undefined
  private inteRules = {
    obj: [{ required: true, message: '请选择项目', trigger: 'blur' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择缺陷类型', trigger: 'blur' }],
    level: [{ required: true, message: '请选择缺陷等级', trigger: 'blur' }],
  }
  private projectOtions: any = []
  private typeOptions: any = []
  private priorityOtions: any = []
  private settingInte: any = []
  private activeType: any = ''
  private pageInfo = {}
  private statusSelect: any = ''

  private vulnType = 'vuln'
  changeVulnType(type: any) {
    this.vulnType = type
    this.reset()
    this.vulnSummary()
  }

  async changeStatus(e: any) {
    this.$nextTick(() => {
      this.statusSelect = ''
    })
    if (!this.tableData.some((item: any) => item.checked)) {
      this.$message({
        type: 'warning',
        message: '请选择需要更改状态的漏洞',
        showClose: true,
      })
      return
    }
    const ids = this.tableData
      .map((item) => {
        if (item.checked) {
          return item.id
        }
      })
      .filter((item) => item)
    const res = await this.services.vuln.changeStatus({
      vul_ids: ids,
      status_id: e,
    })

    if (res.status === 201) {
      this.$message.success(res.msg)
      this.newSelectData()
      return
    }
    this.$message.error(res.msg)
  }

  private page = 1
  private pageSize = 20
  private dataEnd = false
  private tableData: Array<any> = []
  private searchOptionsObj: any = {
    level: [
      {
        name: '高危',
        num: 0,
        id: 1,
      },
      {
        name: '中危',
        num: 0,
        id: 2,
      },
      {
        name: '低危',
        num: 0,
        id: 3,
      },
      {
        name: '无风险',
        num: 0,
        id: 4,
      },
      {
        name: '提示',
        num: 0,
        id: 5,
      },
    ],
    status: [
      {
        name: '待验证',
        num: 0,
        id: 1,
      },
      {
        name: '验证中',
        num: 0,
        id: 2,
      },
      {
        name: '已确认',
        num: 0,
        id: 3,
      },
      {
        name: '已忽略',
        num: 0,
        id: 4,
      },
      {
        name: '已处理',
        num: 0,
        id: 5,
      },
    ],
    availability: [],
    hook_type: [],
    language: [
      {
        name: 'JAVA',
        num: 0,
        id: 1,
      },
      {
        name: 'PYTHON',
        num: 0,
        id: 2,
      },
      {
        name: 'PHP',
        num: 0,
        id: 3,
      },
      {
        name: 'GO',
        num: 0,
        id: 4,
      },
    ],
    orderOptions: [
      {
        label: '漏洞级别',
        value: 1,
      },
      {
        label: '发现时间',
        value: 2,
      },
      {
        label: '最新活跃',
        value: 3,
      },
      {
        label: '状态',
        value: 4,
      },
    ],
    statusOptions: [],
  }

  private async getStatus() {
    const res = await this.services.vuln.vulStatus()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.searchOptionsObj.statusOptions = res.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      }
    })
  }

  private reset() {
    this.searchObj = {
      level_str: [],
      project_str: [],
      order_type: '',
      keywords: '',
      status_str: [],
      source_type_str: [],
      availability_str: [],
      hook_type_str: [],
      language_str: [],
      sort: null,
    }
    this.newSelectData()
  }

  private searchObj: any = {
    level_str: [],
    project_str: [],
    order_type: '',
    keywords: '',
    status_str: [],
    source_type_str: [],
    availability_str: [],
    hook_type_str: [],
    language_str: [],
    sort: null,
  }

  created() {
    this.getStatus()
    this.getTableData()
    this.vulnSummary()
  }

  private async querySearchAsync(queryString: string, cb: any) {
    const res = await this.services.setting.searchProject({ name: queryString })
    if (res.status === 201) {
      const data = res.data.map((item: any) => {
        return {
          value: item.name,
          id: item.id,
        }
      })
      cb(data)
    }
  }

  private sortSelect(flag: any) {
    this.searchObj.sort = flag
    this.newSelectData()
  }

  private deleteVul(type: string) {
    this.$confirm(
      '该操作将会删除选中漏洞',
      this.$t('views.vulnList.recheckInfo') as string,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      let res: any = {}
      if (!this.tableData.some((item: any) => item.checked)) {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的漏洞',
          showClose: true,
        })
        return
      }
      const ids = this.tableData
        .map((item) => {
          if (item.checked) {
            return item.id
          }
        })
        .filter((item) => item)
      res = await this.services.vuln.vulListDelete({
        source_type: this.vulnType === 'vuln' ? 1 : 2,
        ids: String(ids),
      })

      if (res.status !== 201) {
        this.$message({
          type: 'error',
          message: res.msg,
          showClose: true,
        })
      } else {
        this.$message({
          type: 'success',
          message: res.msg,
          showClose: true,
        })
        if (type !== 'all') {
          await this.newSelectData()
        }
      }
    })
  }

  private recheck(type: string) {
    this.$confirm(
      `${this.$t('views.vulnList.will')}${
        type === 'all'
          ? this.$t('views.vulnList.all')
          : this.$t('views.vulnList.batch')
      }${this.$t('views.vulnList.recheckDesc')}`,
      this.$t('views.vulnList.recheckInfo') as string,
      {
        confirmButtonText: this.$t(
          'views.vulnList.confirmButtonText'
        ) as string,
        cancelButtonText: this.$t('views.vulnList.cancelButtonText') as string,
        type: 'warning',
      }
    ).then(async () => {
      let res: any = {}
      if (type === 'all') {
        res = await this.services.vuln.vulRecheckAll({ type })
      } else {
        if (!this.tableData.some((item: any) => item.checked)) {
          this.$message({
            type: 'warning',
            message: this.$t('views.vulnList.chooseWarning') as string,
            showClose: true,
          })
          return
        }
        const ids = this.tableData
          .map((item) => {
            if (item.checked) {
              return item.id
            }
          })
          .filter((item) => item)
        res = await this.services.vuln.recheck({
          ids: String(ids),
        })
      }

      if (res.status !== 201) {
        this.$message({
          type: 'error',
          message: res.msg,
          showClose: true,
        })
      } else {
        this.$message({
          type: 'success',
          message: res.msg,
          showClose: true,
        })
        if (type !== 'all') {
          await this.newSelectData()
        }
      }
    })
  }

  private selectAll(e: any) {
    const flag =
      this.tableData.length > 0 && this.tableData.every((item) => item.checked)
    if (flag) {
      this.tableData.forEach((item) => this.$set(item, 'checked', false))
    } else {
      this.tableData.forEach((item) => this.$set(item, 'checked', true))
    }
    console.log(e)
  }

  private newSelectData() {
    this.page = 1
    this.dataEnd = false
    this.tableData = []
    this.getTableData()
  }

  mounted() {
    window.addEventListener('scroll', this.myScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.myScroll)
  }

  private myScroll() {
    const bottomWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 1
    if (bottomWindow) {
      if (!this.dataEnd) {
        this.page += 1
        this.getTableData()
      }
    }
  }
  private async getTableData(reflash = false) {
    let sort = undefined
    if (this.searchObj.sort === true) {
      sort = 1
    }
    if (this.searchObj.sort === false) {
      sort = 0
    }
    let params
    if (this.vulnType === 'scan') {
      params = {
        page: this.page,
        page_size: this.pageSize,
        bind_project_id: Number(this.projectId),
        project_version_id: Number(this.version),
        keywords: this.searchObj.keywords || undefined,
        project_id: this.searchObj.project_str.length
          ? this.searchObj.project_str
          : undefined,
        vul_level_id: this.searchObj.level_str.length
          ? this.searchObj.level_str
          : undefined,
        vul_type: this.searchObj.hook_type_str.length
          ? this.searchObj.hook_type_str
          : undefined,
        order_type_desc: sort,
      }
    } else {
      params = {
        page: this.page,
        pageSize: this.pageSize,
        bind_project_id: this.projectId,
        project_version_id: String(this.version),
        level_id_str: this.searchObj.level_str.join(',') || undefined,
        project_id_str: this.searchObj.project_str.join(',') || undefined,
        order_type: this.searchObj.order_type || undefined,
        keywords: this.searchObj.keywords || undefined,
        status_id_str: this.searchObj.status_str.join(',') || undefined,
        source_type_str: this.searchObj.source_type_str.join(',') || undefined,
        availability_str:
          this.searchObj.availability_str.join(',') || undefined,
        hook_type_id_str: this.searchObj.hook_type_str.join(',') || undefined,
        language_str: this.searchObj.language_str.join(',') || undefined,
        order_type_desc: sort,
        type: this.vulnType,
      }
    }
    this.loadingStart()
    const { status, data, msg, page } = await this.services.vuln.vulListContent(
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
    const tableData = (data.messages || data).reduce(
      (list: Array<any>, item: any) => {
        let vul_number = ''
        if (item.vul_cve_nums) {
          vul_number = `${item.vul_cve_nums.cnnvd} | ${item.vul_cve_nums.cnvd} | ${item.vul_cve_nums.cve} | ${item.vul_cve_nums.cwe}`
        }
        list.push({
          ...item,
          first_time: formatTimestamp(item.first_time),
          latest_time: getPassedTime(item.latest_time),
          vul_number: vul_number,
          id: item.id,
          latest_time_nyr: formatTimestamp(item.latest_time),
        })
        return list
      },
      []
    )

    if (tableData.length < 20) {
      this.dataEnd = true
    }
    if (reflash) {
      this.tableData = []
    }
    this.pageInfo = page
    this.tableData = [...this.tableData, ...tableData]
  }

  private SummaryCatch: any = {}
  private async vulnSummary() {
    this.searchOptionsObj.level = []
    this.searchOptionsObj.availability = []
    this.searchOptionsObj.hook_type = []
    this.searchOptionsObj.language = []
    this.searchOptionsObj.status = []
    this.searchOptionsObj.projects = []

    if (this.vulnType === 'vuln') {
      this.searchOptionsObj.orderOptions = [
        {
          label: '漏洞级别',
          value: 1,
        },
        {
          label: '发现时间',
          value: 2,
        },
        {
          label: '最新活跃',
          value: 3,
        },
        {
          label: '状态',
          value: 4,
        },
      ]
    } else {
      this.searchOptionsObj.orderOptions = [
        {
          label: '漏洞级别',
          value: 1,
        },
        {
          label: '发现时间',
          value: 2,
        },
        {
          label: '最新活跃',
          value: 3,
        },
      ]
    }
    let params
    params = {
      bind_project_id: this.projectId,
      project_version_id: String(this.version),
      type: this.vulnType,
    }
    if (this.vulnType === 'scan') {
      params = {
        bind_project_id: Number(this.projectId),
        project_version_id: Number(this.version),
        type: this.vulnType,
      }
    }
    this.loadingStart()
    let res
    if (this.SummaryCatch[this.vulnType + 'version:' + this.version]) {
      res = this.SummaryCatch[this.vulnType + 'version:' + this.version]
    } else {
      res = await this.services.vuln.vulSummaryNum(params)
    }
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    if (this.vulnType === 'scan') {
      this.SummaryCatch[this.vulnType] = res
      this.searchOptionsObj.projects =
        res.data.project_info && res.data.project_info.length
          ? res.data.project_info
          : this.searchOptionsObj.projects
      this.searchOptionsObj.hook_type =
        res.data.vul_type && res.data.vul_type.length
          ? res.data.vul_type
          : this.searchOptionsObj.hook_type
      this.searchOptionsObj.level =
        res.data.vul_level && res.data.vul_level.length
          ? res.data.vul_level
          : [
              {
                name: '高危',
                num: 0,
                id: 1,
              },
              {
                name: '中危',
                num: 0,
                id: 2,
              },
              {
                name: '低危',
                num: 0,
                id: 3,
              },
              {
                name: '无风险',
                num: 0,
                id: 4,
              },
              {
                name: '提示',
                num: 0,
                id: 5,
              },
            ]
      return
    }
    this.SummaryCatch[this.vulnType] = res

    const availability = Object.values(res.data.messages.availability || {})
    this.searchOptionsObj.level =
      res.data.messages.level && res.data.messages.level.length
        ? res.data.messages.level
        : [
            {
              name: '高危',
              num: 0,
              id: 1,
            },
            {
              name: '中危',
              num: 0,
              id: 2,
            },
            {
              name: '低危',
              num: 0,
              id: 3,
            },
            {
              name: '无风险',
              num: 0,
              id: 4,
            },
            {
              name: '提示',
              num: 0,
              id: 5,
            },
          ]
    this.searchOptionsObj.status =
      res.data.messages.status && res.data.messages.status.length
        ? res.data.messages.status
        : [
            {
              name: '待验证',
              num: 0,
              id: 1,
            },
            {
              name: '验证中',
              num: 0,
              id: 2,
            },
            {
              name: '已确认',
              num: 0,
              id: 3,
            },
            {
              name: '已忽略',
              num: 0,
              id: 4,
            },
            {
              name: '已处理',
              num: 0,
              id: 5,
            },
          ]

    this.searchOptionsObj.availability =
      availability && availability.length
        ? availability
        : this.searchOptionsObj.availability
    this.searchOptionsObj.hook_type =
      res.data.messages.hook_type && res.data.messages.hook_type.length
        ? res.data.messages.hook_type
        : this.searchOptionsObj.hook_type
    this.searchOptionsObj.language =
      res.data.messages.language && res.data.messages.language.length
        ? res.data.messages.language
        : [
            {
              name: 'JAVA',
              num: 0,
              id: 1,
            },
            {
              name: 'PYTHON',
              num: 0,
              id: 2,
            },
            {
              name: 'PHP',
              num: 0,
              id: 3,
            },
            {
              name: 'GO',
              num: 0,
              id: 4,
            },
          ]
    this.searchOptionsObj.projects =
      res.data.messages.project && res.data.messages.project.length
        ? res.data.messages.project
        : this.searchOptionsObj.projects
  }
}
</script>

<style scoped lang="scss">
.flex-row-space-between.module-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-row-space-between.module-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-title {
  font-weight: 500;
  font-size: 16px;
  color: #38435a;
}

.slider-warp {
  width: 234px;
  margin-top: 14px;
  background: #fff;
  overflow: auto;
  padding: 0 6px 20px 6px;

  .title {
    height: 54px;
    border-bottom: 1px solid #e6e9ec;
    font-size: 18px;
    font-weight: normal;
    color: #4a72ae;

    .resetAllBtn {
      width: 72px;
      height: 28px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 2px;
      color: #fff;
    }
  }

  .module-title {
    font-size: 16px;
    color: #38435a;
    font-weight: 500;
    .filter-box-title {
      padding: 10px 0;
      color: #38435a;
    }
  }

  .reset-btn {
    color: #4a72ae;
    cursor: pointer;
  }

  .module-line {
    cursor: pointer;
    min-height: 32px;
    line-height: 32px;
    margin-right: 0;
    padding: 10px 0;
    ::v-deep.el-checkbox__label {
      flex: 1;
      .check-label {
        display: flex;
        justify-content: space-between;
      }
    }

    .selectOption {
      display: inline-block;
      min-width: 100px;
      flex: 1;
      margin-right: 10px;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      // overflow: hidden;
      white-space: normal;
      word-break: break-all;
      color: #38435a;
      font-size: 14px;
      font-weight: 400;
    }

    .num {
      color: #38435a;
      font-size: 14px;
      font-weight: 400;
    }
    &.is-checked {
      .selectOption {
        color: #1a80f2;
      }

      .num {
        color: #1a80f2;
      }
    }
  }

  .selectedLine {
    background: #f6f8fa;

    .selectOption {
      color: #0366d6;
    }
  }
}

.main-warp {
  padding-top: 14px;
  padding-bottom: 32px;
  width: 910px;
  .checked-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0 12px 12px;
    .top-tool-bar {
      display: flex;
      align-items: center;
    }
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
  .selectForm {
    width: 100%;
    display: flex;
    .sort-box {
      display: inline-flex;
      align-items: center;
      ::v-deep.el-input__inner {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .sort-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #dcdfe6;
      color: #606266;
      display: inline-block;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      line-height: 30px;
      font-size: 12px;
      cursor: pointer;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .selectInput {
      flex: 1;
      padding-right: 8px;
      // float: right;
    }
  }
  .select {
    display: flex;
    margin-top: 12px;
    div {
      cursor: pointer;
      margin-right: 8px;
      width: 80px;
      height: 30px;
      border: 2px solid #f0f8ff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #959fb4;
      &.active {
        color: #4a72ae;
        background: #f0f8ff;
      }
    }
  }
}

.obj-scroll {
  max-height: 200px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background-color: #ecf0f7;
    width: 4px;
    height: 4px;
    background-clip: padding-box;
  }
}
</style>
