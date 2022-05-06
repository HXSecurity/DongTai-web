<template>
  <main class="flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        <div class="flex-row-space-between module-title">
          <span class="filter-title">过滤器</span>
          <el-button type="text" class="reset-btn" @click="reset">
            <span>重置全部</span>
          </el-button>
        </div>
      </div>
      <div class="module-title flex-row-space-between">
        <span class="filter-box-title"> 项目名 </span>
      </div>
      <el-checkbox
        v-for="item in searchOptionsObj.type"
        :key="item.type"
        class="flex-row-space-between module-line"
      >
        <div class="check-label">
          <div class="selectOption">
            {{ item.type }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
      </el-checkbox>
      <div class="module-title flex-row-space-between">
        <span class="filter-box-title"> 等级 </span>
      </div>
      <el-checkbox
        v-for="item in searchOptionsObj.level"
        :key="item.level_id"
        class="flex-row-space-between module-line"
      >
        <div class="check-label">
          <div class="selectOption">
            {{ item.level }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
      </el-checkbox>
      <div class="module-title flex-row-space-between">
        <span class="filter-box-title"> 语言 </span>
      </div>
      <el-checkbox
        v-for="item in searchOptionsObj.language"
        :key="item.language"
        class="flex-row-space-between module-line"
      >
        <div class="check-label">
          <div class="selectOption">
            {{ item.language }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
      </el-checkbox>
    </div>

    <div class="main-warp">
      <div class="selectForm">
        <div class="selectInput">
          <el-input
            v-model="searchObj.url"
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
            v-model="searchObj.order"
            size="small"
            style="width: 160px; font-size: 14px"
            class="commonSelect"
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
        <!-- <el-select
          v-model="searchObj.language"
          :placeholder="$t('views.vulnList.developLanguage')"
          style="margin-left: 10px; width: 160px; font-size: 14px"
          class="commonSelect"
          clearable
          @change="newSelectData"
        >
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label="PYTHON" value="PYTHON"></el-option>
          <el-option label="PHP" value="PHP"></el-option>
          <el-option label="GO" value="GO"></el-option>
        </el-select> -->
        <!-- <el-select
          v-model="searchObj.status"
          :placeholder="$t('views.vulnList.vulnStatus')"
          style="margin-left: 10px; width: 160px; font-size: 14px"
          class="commonSelect"
          clearable
          @change="newSelectData"
        >
          <el-option
            v-for="item in searchOptionsObj.statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
      </div>
      <div class="checked-bar">
        <el-checkbox
          :value="
            tableData.length > 0 && tableData.every((item) => item.checked)
          "
          @change="selectAll"
          >{{ $t('views.vulnList.choose') }}
          {{ tableData.filter((item) => item.checked).length }}
          {{ $t('views.vulnList.strip') }}</el-checkbox
        >
        <div>
          <el-button class="checkedAllBtn" @click="recheck('project')">
            {{ $t('views.vulnList.verificationBatch') }}
          </el-button>
          <el-button class="checkedAllBtn" @click="recheck('all')">
            {{ $t('views.vulnList.verificationAll') }}
          </el-button>
        </div>
      </div>
      <div v-for="item in tableData" :key="item.id">
        <VulnCard :item="item" :search-obj="searchObj"></VulnCard>
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

@Component({ name: 'VulListComponent', components: { VulnCard } })
export default class VulListComponent extends VueBase {
  @Prop() version: number | undefined
  @Prop(String) projectId!: string
  private page = 1
  private pageSize = 20
  private dataEnd = false
  private tableData: Array<VulnListObj> = []
  private searchOptionsObj = {
    language: [],
    level: [],
    type: [],
    projects: [],
    orderOptions: [
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

  private searchObj = {
    sort: null,
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: '',
    status: '',
  }

  created() {
    this.getStatus()
    this.getTableData()
    this.vulnSummary()
  }

  private reset() {
    this.searchObj.sort = null
    this.searchObj.language = ''
    this.searchObj.level = ''
    this.searchObj.type = ''
    this.searchObj.project_name = ''
    this.searchObj.status = ''
    this.searchObj.order = ''
    this.searchObj.url = ''
    this.newSelectData()
  }

  private selectAll(e: any) {
    const flag =
      this.tableData.length > 0 && this.tableData.every((item) => item.checked)
    if (flag) {
      this.tableData.forEach((item) => this.$set(item, 'checked', false))
    } else {
      this.tableData.forEach((item) => this.$set(item, 'checked', true))
    }
  }

  private recheck(type: string) {
    this.$confirm(
      `${this.$t('views.vulnList.will')}${
        type === 'all'
          ? this.$t('views.vulnList.all')
          : this.$t('views.vulnList.batch')
      }${this.$t('views.vulnList.recheckDesc')}`,
      this.$t('views.vulnList.recheckDesc') as string,
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
        res = await this.services.vuln.vulRecheckAll({
          type: 'project',
          projectId: this.projectId,
        })
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
        res = await this.services.vuln.vulRecheck({
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

  private languageChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.language = val
    this.newSelectData()
  }

  private levelChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.level = val
    this.newSelectData()
  }

  private typeChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.type = val
    this.newSelectData()
  }

  private projectNameChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.project_name = val
    this.newSelectData()
  }

  private sortSelect(flag: any) {
    this.searchObj.sort = flag
    this.newSelectData()
  }

  private newSelectData() {
    this.page = 1
    this.dataEnd = false
    this.tableData = []
    this.vulnSummary()
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

  public async getTableData(flag?: undefined | boolean) {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      version_id: this.version,
      order: `${
        this.searchObj.sort === false && this.searchObj.order ? '-' : ''
      }${this.searchObj.order}`,
      status_id: this.searchObj.status,
      project_id: this.projectId,
    }
    this.loadingStart()
    const { status, data, msg, page } = await this.services.vuln.vulnList(
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
    const tableData = data.reduce(
      (list: Array<VulnListObj>, item: VulnListObj) => {
        list.push({
          ...item,
          first_time: formatTimestamp(item.first_time),
          latest_time: getPassedTime(item.latest_time),
        })
        return list
      },
      []
    )
    if (tableData.length < 20) {
      this.dataEnd = true
    }
    if (flag === true) {
      this.tableData = tableData
    } else {
      this.tableData = [...this.tableData, ...tableData]
    }
  }

  public async vulnSummary() {
    const params = {
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      version_id: this.version,
      order: `${
        this.searchObj.sort === false && this.searchObj.order ? '-' : ''
      }${this.searchObj.order}`,
      status_id: this.searchObj.status,
      project_id: this.projectId,
    }
    this.loadingStart()
    // const { status, data, msg } = await this.services.vuln.vulnSummary(params)
    const res1 = await this.services.vuln.vulnSummary_project(params)
    const res2 = await this.services.vuln.vulnSummary_type(params)
    this.loadingDone()
    if (res1.status !== 201) {
      this.$message({
        type: 'error',
        message: res1.msg,
        showClose: true,
      })
      return
    }
    if (res2.status !== 201) {
      this.$message({
        type: 'error',
        message: res2.msg,
        showClose: true,
      })
      return
    }
    this.searchOptionsObj.language = res1.data.language
    this.searchOptionsObj.level = res2.data.level
    this.searchOptionsObj.type = res2.data.type
    this.searchOptionsObj.projects = res1.data.projects
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
    height: 32px;
    line-height: 32px;
    margin-right: 0;
    /deep/.el-checkbox__label {
      flex: 1;
      .check-label {
        display: flex;
        justify-content: space-between;
      }
    }

    .selectOption {
      display: inline-block;
      max-width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #38435a;
      font-size: 14px;
    }

    .num {
      color: #38435a;
      font-size: 14px;
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
    .checkedAllBtn {
      height: 28px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 2px;
      color: #fff;
      & + .checkedAllBtn {
        margin-left: 12px;
      }
    }
  }
  .selectForm {
    width: 100%;
    display: flex;
    .sort-box {
      display: inline-flex;
      align-items: center;
      /deep/.el-input__inner {
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
}
</style>
