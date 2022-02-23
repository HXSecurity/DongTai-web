<template>
  <main class="flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        <div class="flex-row-space-between">
          <span style="font-size: 16px; font-weight: bold">{{
            $t('views.vulnList.filter')
          }}</span>
          <el-button type="text" class="resetAllBtn" @click="reset">
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
        <span style="font-size: 14px">{{ $t('views.vulnList.type') }}</span>
        <div class="reset-btn" @click="typeChange('')">
          <span style="font-size: 14px">{{ $t('views.vulnList.reset') }}</span>
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
        <span style="font-size: 14px">{{ $t('views.vulnList.level') }}</span>
        <div class="reset-btn" @click="levelChange('')">
          <span style="font-size: 14px">{{ $t('views.vulnList.reset') }}</span>
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
        <span style="font-size: 14px">{{ $t('views.vulnList.language') }}</span>
        <div class="reset-btn" @click="languageChange('')">
          <span style="font-size: 14px">{{ $t('views.vulnList.reset') }}</span>
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

    <div class="main-warp">
      <div class="selectForm">
        <div class="sort-box">
          <el-select
            v-model="searchObj.order"
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
        <el-select
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
        </el-select>
        <el-select
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
        </el-select>
        <div class="selectInput">
          <el-input
            v-model="searchObj.url"
            :placeholder="$t('views.vulnList.searchExample')"
            class="commonInput"
            style="width: 312px"
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
      <div v-for="item in tableData" :key="item.id" class="card">
        <div
          class="card-title flex-row-space-between"
          style="height: 33px; min-height: 32px"
        >
          <span
            class="title"
            style="font-size: 14px; font-weight: bold; height: 32px"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-right: 12px; margin-top: 2px"
            ></el-checkbox>
            <span v-if="$i18n.locale === 'zh_cn'" @click="goDetail(item.id)">
              {{
                `${item.uri}${$t('views.vulnList.is')}${item.http_method}${$t(
                  'views.vulnList.has'
                )}${item.type}${$t('views.vulnList.vule')}${
                  item.taint_position
                    ? `，${$t('views.vulnList.position')}：${
                        item.taint_position
                      }`
                    : ''
                }`
              }}
            </span>
            <span v-if="$i18n.locale === 'en'" @click="goDetail(item.id)">
              {{ `${item.type} on \"${item.uri}\" with ${item.http_method}` }}
              {{
                item.taint_position ? `, Positon:${item.taint_position}` : ''
              }}
            </span>
          </span>
          <span
            class="time flex-column-center"
            style="font-size: 12px; height: 32px"
          >
            {{ item.first_time }}
          </span>
        </div>
        <div class="card-content">
          <div class="top-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span>
              {{ item.top_stack }}
            </span>
          </div>
          <div class="bottom-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span>
              {{ item.bottom_stack }}
            </span>
          </div>
          <div class="infoLine flex-row-space-between">
            <div class="flex-row-space-between" style="width: 60%">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.project_name"
                placement="top-start"
              >
                <div class="info">
                  <i class="iconfont iconyingyong" style="color: #a3b0e2"></i>
                  {{ item.project_name }}
                </div>
              </el-tooltip>
              <span class="info" style="flex: 1.5">
                <i
                  class="iconfont"
                  :class="switchServerType(item.server_type)"
                ></i>
                {{ item.server_name }}
              </span>
              <span
                class="info"
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
                <i class="iconfont iconweixian"></i>
                {{ item.level }}
              </span>
              <span class="info">
                <i
                  class="iconfont iconshijian-2"
                  style="color: #a2a5ab; font-size: 14px"
                ></i>
                {{ item.latest_time }}
              </span>
            </div>
            <div>
              <!-- <div class="tag">
                {{ item.language }}
              </div>
              <div class="tag2" style="margin-left: 20px">
                {{ item.type }}
              </div> -->
              <div class="tageIcon" style="margin-left: 20px">
                <i
                  class="iconfont iconicon_yingyong_table"
                  style="color: #e7f5e4"
                ></i>
                <span style="background: #e7f5e4; color: #63974e">
                  {{ item.language }}
                </span>
              </div>

              <div class="tageIcon" style="margin-left: 20px">
                <i
                  class="iconfont iconicon_yingyong_table"
                  style="color: #fce9de"
                ></i>
                <span
                  style="background: #fce9de; color: #e07d43"
                  :title="item.type"
                  class="showDot"
                >
                  {{ item.type }}
                </span>
              </div>

              <div class="tageIcon" style="margin-left: 20px">
                <i
                  class="iconfont iconicon_yingyong_table"
                  style="color: #e5f3f3"
                ></i>
                <span style="background: #e5f3f3; color: #3c9aa2">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import { VulnListObj } from '@/views/vuln/types'

@Component({ name: 'VulListComponent' })
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

  private goDetail(id: number) {
    this.$router.push(
      `/vuln/vulnDetail/${this.page}/${id}?status=${this.searchObj.status}`
    )
  }

  switchServerType(serverType: string) {
    switch (serverType) {
      case 'tomcat':
        return 'icontomcat'
      case 'jetty':
        return 'iconJetty'
      case 'resin':
        return 'iconresin'
      case 'weblogic':
        return 'iconwebLogic'
      case 'websphere':
        return 'iconwebSphere'
      case 'jboss':
        return 'iconJBoss'

      default:
        return 'iconyingyong'
    }
  }
}
</script>

<style scoped lang="scss">
.tageIcon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 20px;
  }
  span {
    margin-left: -3px;
    display: inline-block;
    line-height: 150%;
    height: 20px;
    font-size: 14px;
    padding-right: 6px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    font-weight: 500;
  }
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
      color: #4b99f1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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
      width: 38px;
      height: 38px;
      border: 1px solid #dcdfe6;
      color: #606266;
      display: inline-block;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .selectInput {
      float: right;
    }
  }

  .card {
    margin-top: 14px;
    width: 100%;
    padding-bottom: 10px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #dee4ea;
    cursor: pointer;

    .card-title {
      width: 100%;
      min-height: 48px;
      background: #f1f8ff;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid #c8e0ff;
      padding: 0 12px;
      span {
        cursor: pointer;
      }
      .title {
        color: #38435a;
        font-size: 16px;
        max-width: 780px;
        display: flex;
        align-items: center;
      }

      .time {
        font-size: 14px;
        color: #586069;
      }
    }

    .card-content {
      padding: 0 12px;

      .top-stack {
        margin-top: 14px;
        position: relative;

        &:before {
          content: '';
          width: 1px;
          height: 30px;
          background: #dee4ea;
          position: absolute;
          left: 5px;
          top: 14px;
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
        margin-top: 24px;

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

      .infoLine {
        margin-top: 24px;

        .info {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .tag {
          display: inline-block;
          color: #fff;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          background: #5495f3;
          padding-right: 10px;
          padding-left: 4px;
          position: relative;

          &:before {
            position: absolute;
            left: -17px;
            content: '';
            height: 20px;
            width: 18px;
            background-image: url('../../assets/img/tag.png');
          }
        }

        .tag2 {
          display: inline-block;
          color: #fff;
          height: 20px;
          font-size: 14px;
          line-height: 20px;
          background: #e2ce94;
          padding-right: 10px;
          padding-left: 4px;
          position: relative;

          &:before {
            position: absolute;
            left: -17px;
            content: '';
            height: 20px;
            width: 18px;
            background-image: url('../../assets/img/tag2.png');
          }
        }
      }
    }

    .icontomcat {
      color: #e6d088;
    }

    .iconJetty {
      color: #5cb896;
    }

    .iconresin {
      color: #86a0d5;
    }

    .iconwebLogic {
      color: #a4cbb9;
    }

    .iconwebSphere {
      color: #888dd1;
    }

    .iconJBoss {
      color: #41bad5;
    }

    .iconyingyong {
      color: #ddcc9e;
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
</style>
