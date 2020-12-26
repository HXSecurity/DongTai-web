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
        <div
          v-for="item in searchOptionsObj.projects"
          :key="item.project_name"
          class="flex-row-space-between module-line"
          :class="
            searchObj.project_name === item.project_name ? 'selectedLine' : ''
          "
          :style="
            item.count === 0
              ? { cursor: 'not-allowed', height: '30px', 'font-size': '14px' }
              : { height: '30px' }
          "
          @click="projectNameChange(item.project_name, item.count === 0)"
        >
          <div class="selectOption">
            <span>
              {{ projectNameSplit(item.project_name, 12) }}
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
      <div class="selectForm">
        <el-select
          style="width: 160px; font-size: 14px"
          v-model="searchObj.order"
          class="commonSelect"
          placeholder="请选择排序条件"
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
        <el-select
          v-model="searchObj.language"
          placeholder="请选择开发语言"
          style="margin-left: 10px; width: 160px; font-size: 14px"
          class="commonSelect"
          clearable
          @change="newSelectData"
        >
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label=".NET" value=".NET"></el-option>
        </el-select>
        <div class="selectInput">
          <el-input
            v-model="searchObj.url"
            placeholder="请输入搜索条件，如：http://127.0.0.1:8080"
            class="commonInput"
            style="width: 412px"
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
      <div
        v-for="item in tableData"
        :key="item.id"
        class="card"
        @click="goDetail(item.id)"
      >
        <div
          class="card-title flex-row-space-between"
          style="height: 33px; min-height: 32px"
        >
          <span
            class="title flex-column-center"
            style="font-size: 14px; font-weight: bold; height: 32px"
          >
            {{
              `${item.url}的${item.http_method}请求出现${item.type}漏洞${
                item.taint_position ? `，位置：${item.taint_position}` : ''
              }`
            }}
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
            <div class="flex-row-space-between" style="width: 65%">
              <span class="info">
                <i class="iconfont iconyingyong" style="color: #a3b0e2"></i>
                {{ projectNameSplit(item.project_name, 6) }}
              </span>
              <span class="info" style="flex: 2">
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
              <div class="tag">
                {{ item.language }}
              </div>
              <div class="tag2" style="margin-left: 20px">
                {{ item.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import { VulnListObj } from './types'

@Component({ name: 'VulnList' })
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
  }

  private searchObj = {
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: '',
  }

  created() {
    this.getTableData()
    this.vulnSummary()
  }

  private reset() {
    this.searchObj.language = ''
    this.searchObj.level = ''
    this.searchObj.type = ''
    this.searchObj.project_name = ''
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
    this.searchObj.project_name = val
    this.newSelectData()
  }

  private newSelectData() {
    this.page = 1
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
      order: this.searchObj.order,
    }
    this.loadingStart()
    const { status, data, msg } = await this.services.vuln.vulnList(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
      order: this.searchObj.order,
    }
    this.loadingStart()
    const { status, data, msg } = await this.services.vuln.vulnSummary(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.type = data.type
    this.searchOptionsObj.projects = data.projects
  }

  private goDetail(id: number) {
    this.$router.push(`/vuln/vulnDetail/${this.page}/${id}`)
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

.main-warp {
  padding-top: 14px;
  margin-left: 248px;
  padding-bottom: 10px;

  .selectForm {
    width: 100%;

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

      .title {
        color: #38435a;
        font-size: 16px;
        max-width: 780px;
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
}
</style>
