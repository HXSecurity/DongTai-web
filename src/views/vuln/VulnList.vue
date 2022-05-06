<template>
  <main class="container">
    <div class="fixed-warp">
      <div class="slider-warp">
        <div class="title flex-column-center" style="height: 54px">
          <div class="flex-row-space-between">
            <span style="font-size: 16px; font-weight: bold">{{
              $t('views.vulnList.filter')
            }}</span>
            <el-button
              type="text"
              style="height: 14px"
              class="resetAllBtn"
              @click="reset"
            >
              <span style="font-size: 12px">
                {{ $t('views.vulnList.resetAll') }}
              </span>
            </el-button>
          </div>
        </div>
        <div
          class="module-title flex-row-space-between"
          style="margin-top: 14px; margin-bottom: 0px"
        >
          <span style="font-size: 14px">{{
            $t('views.vulnList.project_name')
          }}</span>
          <div class="reset-btn" @click="projectNameChange('')">
            <span style="font-size: 14px">{{
              $t('views.vulnList.reset')
            }}</span>
          </div>
        </div>
        <div class="search-box">
          <el-autocomplete
            v-model="kw"
            size="small"
            style="margin: 12px 0 0 0"
            class="commonInput"
            clearable
            :placeholder="$t('views.vulnList.searchName')"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <div
          v-for="item in searchOptionsObj.projects"
          :key="item.id"
          class="flex-row-space-between module-line"
          :class="searchObj.project_id === item.id ? 'selectedLine' : ''"
          :style="
            item.count === 0
              ? { cursor: 'not-allowed', height: '30px', 'font-size': '14px' }
              : { height: '30px' }
          "
          @click="projectNameChange(item.id, item.count === 0)"
        >
          <div class="selectOption" :title="item.project_name">
            <span>
              {{ projectNameSplit(item.project_name, 12)
              }}{{ item.project_name.length > 12 ? '...' : '' }}
            </span>
          </div>
          <div class="num">
            <span>
              {{ item.count }}
            </span>
          </div>
        </div>
        <div
          class="module-title flex-row-space-between"
          style="margin-top: 14px; margin-bottom: 0px"
        >
          <span style="font-size: 14px">
            {{ $t('views.vulnList.type') }}
          </span>
          <div class="reset-btn" @click="typeChange('')">
            <span style="font-size: 14px">
              {{ $t('views.vulnList.reset') }}
            </span>
          </div>
        </div>
        <div
          v-for="item in searchOptionsObj.type"
          :key="item.type"
          class="flex-row-space-between module-line"
          :class="searchObj.type === item.type ? 'selectedLine' : ''"
          :style="
            item.count === 0
              ? { cursor: 'not-allowed', height: '30px', 'font-size': '14px' }
              : { height: '30px', 'font-size': '14px' }
          "
          @click="typeChange(item.type, item.count === 0)"
        >
          <div class="selectOption">
            {{ item.type }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
        <div
          class="module-title flex-row-space-between"
          style="margin-top: 14px; margin-bottom: 0px"
        >
          <span style="font-size: 14px">
            {{ $t('views.vulnList.level') }}
          </span>
          <div class="reset-btn" @click="levelChange('')">
            <span style="font-size: 14px">
              {{ $t('views.vulnList.reset') }}
            </span>
          </div>
        </div>
        <div
          v-for="item in searchOptionsObj.level"
          :key="item.level_id"
          class="flex-row-space-between module-line"
          :class="searchObj.level === item.level_id ? 'selectedLine' : ''"
          :style="
            item.count === 0
              ? { cursor: 'not-allowed', height: '30px', 'font-size': '14px' }
              : { height: '30px', 'font-size': '14px' }
          "
          @click="levelChange(item.level_id, item.count === 0)"
        >
          <div class="selectOption">
            {{ item.level }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
        <div
          class="module-title flex-row-space-between"
          style="margin-top: 14px; margin-bottom: 0px"
        >
          <span style="font-size: 14px">
            {{ $t('views.vulnList.language') }}
          </span>
          <div class="reset-btn" @click="languageChange('')">
            <span style="font-size: 14px">
              {{ $t('views.vulnList.reset') }}
            </span>
          </div>
        </div>
        <div
          v-for="item in searchOptionsObj.language"
          :key="item.language"
          class="flex-row-space-between module-line"
          :class="searchObj.language === item.language ? 'selectedLine' : ''"
          :style="
            item.count === 0
              ? { cursor: 'not-allowed', height: '30px', 'font-size': '14px' }
              : { height: '30px', 'font-size': '14px' }
          "
          @click="languageChange(item.language, item.count === 0)"
        >
          <div class="selectOption">
            {{ item.language }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>

    <div class="main-warp">
      <div class="tool-box">
        <div class="selectForm">
          <div class="sort-box">
            <el-select
              v-model="searchObj.order"
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
          <el-select
            v-model="searchObj.language"
            :placeholder="$t('views.vulnList.developLanguage')"
            size="small"
            style="margin-left: 10px; width: 150px; font-size: 14px"
            class="commonSelect"
            clearable
            @change="newSelectData"
          >
            <el-option label="JAVA" value="JAVA"></el-option>
            <el-option label="PYTHON" value="PYTHON"></el-option>
            <el-option label="PHP" value="PHP"></el-option>
            <el-option label="GO" value="GO"></el-option>
          </el-select>
          <el-select
            v-model="searchObj.status"
            size="small"
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
          </el-select>
          <div class="selectInput">
            <el-input
              v-model="searchObj.url"
              size="small"
              :placeholder="$t('views.vulnList.searchExample')"
              class="commonInput"
              style="width: 370px"
              @keyup.enter.native="newSelectData"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="newSelectData"
              />
            </el-input>
          </div>
        </div>
        <div class="checked-bar">
          <el-checkbox
            :value="
              tableData.length > 0 && tableData.every((item) => item.checked)
            "
            @change="selectAll"
            >{{ $t('views.vulnList.choose') }}
            <span style="color: #1a80f2">{{
              tableData.filter((item) => item.checked).length
            }}</span>
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
      </div>
      <div class="tool-box-placeholder"></div>
      <div v-for="item in tableData" :key="item.id">
        <VulnCard :item="item" :search-obj="searchObj"></VulnCard>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import { VulnListObj } from './types'
import VulnCard from './components/vulnCard.vue'

@Component({ name: 'VulnList', components: { VulnCard } })
export default class VulnList extends VueBase {
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
    project_id: '',
  }

  created() {
    this.getStatus()
    this.getTableData()
    this.vulnSummary()
  }

  private kw = ''
  private async querySearchAsync(queryString: string, cb: any) {
    console.log(queryString)
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

  private handleSelect(item: any) {
    this.projectNameChange(item.id, false)
  }

  private sortSelect(flag: any) {
    this.searchObj.sort = flag
    this.newSelectData()
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

  private reset() {
    this.searchObj.sort = null
    this.searchObj.language = ''
    this.searchObj.level = ''
    this.searchObj.type = ''
    this.searchObj.project_name = ''
    this.searchObj.status = ''
    this.searchObj.project_id = ''
    this.searchObj.url = ''
    this.searchObj.order = ''
    this.kw = ''
    this.newSelectData()
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
    if (!val) {
      this.kw = val
    }
    this.searchObj.project_id = val
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

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: `${
        this.searchObj.sort === false && this.searchObj.order ? '-' : ''
      }${this.searchObj.order}`,
      status_id: this.searchObj.status,
      project_id: this.searchObj.project_id,
    }
    this.loadingStart()
    const { status, data, msg } = await this.services.vuln.vulnList(params)
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
    this.tableData = [...this.tableData, ...tableData]
  }

  private async vulnSummary() {
    const params = {
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: `${
        this.searchObj.sort === false && this.searchObj.order ? '-' : ''
      }${this.searchObj.order}`,
      status_id: this.searchObj.status,
      project_id: this.searchObj.project_id,
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

  projectNameSplit(name: string, total: number) {
    if (name.length > total) {
      return name.substring(0, total)
    }
    return name
  }
}
</script>

<style scoped lang="scss">
.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 238px;
}

.sort-box {
  display: inline-flex;
  align-items: center;
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
}
.slider-warp {
  width: 234px;
  margin-top: 78px;
  background: #fff;
  overflow: auto;
  padding: 0 6px 20px 6px;
  height: calc(100vh - 103px);
  // padding-left: calc(234px - 100%);

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
    margin-top: 28px;
    margin-bottom: 24px;
    font-size: 16px;
    color: #38435a;
  }

  .reset-btn {
    color: #4a72ae;
    cursor: pointer;
  }

  .module-line {
    cursor: pointer;
    padding-left: 5px;
    height: 38px;
    line-height: 38px;

    &:hover {
      background: #f6f8fa;
    }

    .selectOption {
      display: inline-block;
      width: 80%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #4b99f1;
      font-size: 14px;
    }

    .num {
      color: #959ea9;
      font-size: 14px;
    }
  }

  .selectedLine {
    background: #f6f8fa;

    .selectOption {
      color: #0366d6;
    }
  }
}

.dot {
  display: inline-block;
  width: 90px;
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.main-warp {
  margin-left: 248px;
  background: #fff;
  padding: 16px 16px 10px 16px;
  .tool-box {
    position: fixed;
    width: 952px;
    padding: 16px 16px 0 16px;
    margin-left: -16px;
    top: 64px;
    z-index: 5;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .tool-box-placeholder {
    height: 80px;
  }
  .selectForm {
    width: 100%;
    .vulnSelect {
      /deep/.el-input__inner {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    .sort-btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .selectInput {
      float: right;
    }
  }
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
  .showDot {
    display: inline-block;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.search-box {
  text-align: center;
}
</style>
