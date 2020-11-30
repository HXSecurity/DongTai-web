<template>
  <main class="container">
    <div class="slider-warp">
      <div class="title flex-column-center">
        {{$t('views.vulnList.filter')}}
      </div>
      <div class="module-title">
        {{$t('views.vulnList.language')}}
      </div>
      <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.language" :key="item.language">
        <div class="selectOption">
          {{item.language}}
        </div>
        <div class="num">
          {{item.count}}
        </div>
      </div>
      <div class="module-title">
        {{$t('views.vulnList.level')}}
      </div>
      <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.level" :key="item.level">
        <div class="selectOption">
          {{item.level}}
        </div>
        <div class="num">
          {{item.count}}
        </div>
      </div>
      <div class="module-title">
        {{$t('views.vulnList.type')}}
      </div>
      <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.type" :key="item.type">
        <div class="selectOption">
          {{item.type}}
        </div>
        <div class="num">
          {{item.count}}
        </div>
      </div>
      <div class="module-title">
        {{$t('views.vulnList.project_name')}}
      </div>
      <div class="flex-row-space-between module-line" v-for="item in searchOptionsObj.projects" :key="item.project_name">
        <div class="selectOption">
          {{item.project_name}}
        </div>
        <div class="num">
          {{item.count}}
        </div>
      </div>
    </div>
    <div class="main-warp">
      <div class="selectForm">
        <el-select size="mini" v-model="searchObj.order" @change="newSelectData">
          <el-option v-for="item in searchOptionsObj.orderOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select size="mini" v-model="searchObj.language" @change="newSelectData">
          <el-option v-for="item in searchOptionsObj.language" :key="item.language" :label="item.language" :value="item.language"></el-option>
        </el-select>

        <div class="selectInput">
          <el-input style="width: 462px" size="mini">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="newSelectData"
            />
          </el-input>
        </div>
      </div>
      <div class="card" v-for="item in tableData" :key="item.id">
        <div class="cart-title flex-row-space-between">
          <span class="title flex-column-center">
          {{`${item.url}的${item.http_method}请求出现${item.type}漏洞，位置：${item.taint_position}`}}
          </span>
          <span class="time flex-column-center">
            {{item.first_time}}
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'VulnList' })
export default class VulnList extends Vue {
  private page: number = 1;
  private pageSize: number = 20;
  private searchObj = {
    language: '',
    level: '',
    type: '',
    project_name: '',
    url: '',
    order: ''
  }

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

  created () {
    this.getTableData()
    this.vulnSummary()
  }

  private newSelectData () {
    this.page = 1
    this.getTableData()
    this.vulnSummary()
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
    const { status, data, msg } = await this.$services.vuln.vulnList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
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
    const { status, data, msg } = await this.$services.vuln.vulnSummary(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.type = data.type
    this.searchOptionsObj.projects = data.projects
  }
}
</script>

<style scoped lang='scss'>

.slider-warp {
  width: 234px;
  position: fixed;
  background: #fff;
  overflow: auto;
  top: 78px;
  padding: 0 6px;

  .title{
    height: 54px;
    border-bottom: 1px solid #E6E9EC;
    font-size: 18px;
    font-weight: normal;
    color: #4A72AE;
  }

  .module-title{
    margin-top: 28px;
    font-size: 16px;
    color: #38435A;
  }

  .module-line{
    margin-top: 24px;
    cursor: pointer;
    padding-left: 5px;

    .selectOption{
      color: #4B99F1;
      font-size: 14px;
    }

    .num{
      color: #959EA9;
      font-size: 14px;
    }
  }
}

.main-warp {
  padding-top: 14px;
  margin-left: 248px;

  .selectForm{
    width: 100%;

    .selectInput{
      float: right;
    }
  }

  .card{
    margin-top: 14px;
    width: 100%;
    height: 172px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DEE4EA;

    .cart-title{
      width: 952px;
      height: 48px;
      background: #F1F8FF;
      border-radius: 8px 8px 0px 0px;
      border: 1px solid #C8E0FF;
      padding: 0 12px;

      .title{
        color: #38435A;
        font-size: 16px;
      }

      .time{
        font-size: 14px;
        color: #586069;
      }
    }
  }
}
</style>
