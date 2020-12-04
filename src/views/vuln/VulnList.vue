<template>
  <main class="container">
    <div class="fixed-warp">
      <div class="slider-warp">
        <div class="title flex-column-center">
          {{ $t('views.vulnList.filter') }}
        </div>
        <div class="module-title">
          {{ $t('views.vulnList.language') }}
        </div>
        <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.language" :key="item.language"
             @click="languageChange(item.language)">
          <div class="selectOption">
            {{ item.language }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
        <div class="module-title">
          {{ $t('views.vulnList.level') }}
        </div>
        <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.level" :key="item.level"
             @click="levelChange(item.level)">
          <div class="selectOption">
            {{ item.level }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
        <div class="module-title">
          {{ $t('views.vulnList.type') }}
        </div>
        <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.type" :key="item.type"
             @click="typeChange(item.type)">
          <div class="selectOption">
            {{ item.type }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
        <div class="module-title">
          {{ $t('views.vulnList.project_name') }}
        </div>
        <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.projects"
             :key="item.project_name" @click="projectNameChange(item.project_name)">
          <div class="selectOption">
            {{ item.project_name }}
          </div>
          <div class="num">
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>

    <div class="main-warp">
      <div class="selectForm">
        <el-select size="mini" v-model="searchObj.order" @change="newSelectData" clearable>
          <el-option v-for="item in searchOptionsObj.orderOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-select style="margin-left: 10px" size="mini" v-model="searchObj.language" @change="newSelectData" clearable>
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label=".NET" value=".NET"></el-option>
        </el-select>
        <div class="selectInput">
          <el-input v-if="keywordInput" v-model="searchObj.url" style="width: 462px" size="mini" @blur="inputHide" @keyup.enter.native="newSelectData">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="newSelectData"
            />
          </el-input>
          <i
            v-else
            class="el-icon-search"
            style="margin-top: 10px;margin-right: 10px"
            @click="keywordInput = !keywordInput"
          />
        </div>
      </div>
      <div class="card" v-for="item in tableData" :key="item.id" @click="goDetail(item.id)">
        <div class="card-title flex-row-space-between">
          <span class="title flex-column-center">
          {{ `${item.url}的${item.http_method}请求出现${item.type}漏洞，位置：${item.taint_position}` }}
          </span>
          <span class="time flex-column-center">
            {{ item.first_time }}
          </span>
        </div>
        <div class="card-content">
          <div class="top-stack">
            <i class="iconfont iconyuandianzhong"></i>
            {{ item.top_stack }}
          </div>
          <div class="bottom-stack">
            <i class="iconfont iconyuandianzhong"></i>
            {{ item.bottom_stack }}
          </div>
          <div class="infoLine flex-row-space-between">
            <div class="flex-row-space-between" style="width: 60%;">
              <span class="info">
                <i class="iconfont iconyingyong" style="color: #A3B0E2"></i>
                {{ item.project_name }}
              </span>
              <span class="info">
                <i class="iconfont" :class="switchServerType(item.server_type)"></i>
                {{ item.server_name }}
              </span>
              <span class="info">
                <i class="iconfont iconweixian"
                   :style="item.level_type === 1 ? {color: '#EA7171'} :
                   item.level_type === 2 ? {color: '#F39D0A'}  :
                   item.level_type === 3 ? {color: '#2E8FE9'}  :
                   item.level_type === 4 ? {color: '#7BC1AB'}  : ''"
                ></i>
                {{ item.level }}
              </span>
              <span class="info">
                <i class="iconfont iconshijian-2" style="color: #A2A5AB"></i>
                {{ item.latest_time }}
              </span>
            </div>
            <div>
              <div class="tag">
                {{ item.language }}
              </div>
              <div class="tag" style="margin-left: 20px">
                {{ item.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'

@Component({ name: 'VulnList' })
export default class VulnList extends VueBase {
  private page: number = 1;
  private pageSize: number = 20;
  private keywordInput: boolean = false
  private dataEnd: boolean = false
  private tableData: Array<object> = [];
  private searchOptionsObj = {
    language: [],
    level: [],
    type: [],
    projects: [],
    orderOptions: [
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
  }

  private searchObj = {
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: ''
  }

  created () {
    this.getTableData()
    this.vulnSummary()
  }

  private inputHide () {
    if (!this.searchObj.url) {
      this.keywordInput = false
    }
  }

  private languageChange (val: string) {
    this.searchObj.language = val
    this.newSelectData()
  }

  private levelChange (val: string) {
    this.searchObj.level = val
    this.newSelectData()
  }

  private typeChange (val: string) {
    this.searchObj.type = val
    this.newSelectData()
  }

  private projectNameChange (val: string) {
    this.searchObj.project_name = val
    this.newSelectData()
  }

  private newSelectData () {
    this.page = 1
    this.tableData = []
    this.getTableData()
    this.vulnSummary()
  }

  mounted () {
    window.addEventListener('scroll', this.myScroll)
  }

  beforeDestroy () {
    window.removeEventListener('scroll', this.myScroll)
  }

  private myScroll () {
    const bottomWindow = document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight - 1
    if (bottomWindow) {
      if (!this.dataEnd) {
        this.page += 1
        this.getTableData()
      }
    }
  }

  private async getTableData () {
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order
    }
    const { status, data, msg } = await this.services.vuln.vulnList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    const tableData = data.reduce((list, item) => {
      list.push({
        ...item,
        first_time: formatTimestamp(item.first_time),
        latest_time: formatTimestamp(item.latest_time)
      })
      return list
    }, [])
    if (tableData.length < 20) {
      this.dataEnd = true
    }
    this.tableData = [...this.tableData, ...tableData]
  }

  private async vulnSummary () {
    const params = {
      language: this.searchObj.language,
      level: this.searchObj.level,
      type: this.searchObj.type,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order
    }
    const { status, data, msg } = await this.services.vuln.vulnSummary(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.type = data.type
    this.searchOptionsObj.projects = data.projects
  }

  private goDetail (id: number) {
    this.$router.push(`/vuln/vulnDetail/${this.page}/${id}`)
  }

  private switchServerType (serverType: string) {
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

<style scoped lang='scss'>

.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.slider-warp {
  width: 234px;
  margin-top: 78px;
  background: #fff;
  overflow: auto;
  //top: 78px;
  padding: 0 6px 20px 6px;
  height: calc(100vh - 78px);

  .title {
    height: 54px;
    border-bottom: 1px solid #E6E9EC;
    font-size: 18px;
    font-weight: normal;
    color: #4A72AE;
  }

  .module-title {
    margin-top: 28px;
    font-size: 16px;
    color: #38435A;
  }

  .module-line {
    margin-top: 24px;
    cursor: pointer;
    padding-left: 5px;

    .selectOption {
      color: #4B99F1;
      font-size: 14px;
    }

    .num {
      color: #959EA9;
      font-size: 14px;
    }
  }
}

.main-warp {
  padding-top: 14px;
  margin-left: 248px;
  padding-bottom: 32px;

  .selectForm {
    width: 100%;

    .selectInput {
      float: right;
    }
  }

  .card {
    margin-top: 14px;
    width: 100%;
    padding-bottom: 20px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DEE4EA;
    cursor: pointer;

    .card-title {
      width: 952px;
      height: 48px;
      background: #F1F8FF;
      border-radius: 8px 8px 0px 0px;
      border: 1px solid #C8E0FF;
      padding: 0 12px;

      .title {
        color: #38435A;
        font-size: 16px;
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
          background: #DEE4EA;
          position: absolute;
          left: 5px;
          top: 14px;
        }

        i {
          color: #5491EF;
          font-size: 12px;
          vertical-align: bottom;
        }
      }

      .bottom-stack {
        margin-top: 24px;

        i {
          color: #6EC79F;
          font-size: 12px;
          vertical-align: bottom;
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
          background: #5495F3;
          padding-right: 10px;
          padding-left: 4px;
          position: relative;

          &:before {
            position: absolute;
            left: -17px;
            content: '';
            height: 20px;
            width: 18px;
            background-image: url("../../assets/img/tag.png");
          }
        }
      }
    }

    .icontomcat{
      color: #E6D088;
    }
    .iconJetty{
      color: #5CB896;
    }
    .iconresin{
      color: #86A0D5;
    }
    .iconwebLogic{
      color: #A4CBB9;
    }
    .iconwebSphere{
      color: #888DD1;
    }
    .iconJBoss{
      color: #41BAD5;
    }
    .iconyingyong{
      color: #DDCC9E;
    }
  }
}
</style>
