<template>
  <main class="container">
    <div class="fixed-warp">
      <div class="slider-warp">
        <div class="title flex-column-center">
          {{ $t('views.scaList.filter') }}
        </div>
        <div class="module-title">
          {{ $t('views.scaList.language') }}
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
          {{ $t('views.scaList.level') }}
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
          {{ $t('views.scaList.project_name') }}
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
          <el-option v-for="item in searchOptionsObj.language" :key="item.language" :label="item.language"
                     :value="item.language"></el-option>
        </el-select>
        <div class="selectInput">
          <el-input v-if="keywordInput" v-model="searchObj.url" style="width: 462px" size="mini" @blur="inputHide">
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
      <el-table class="sca-list" :data="tableData" style="width: 100%;margin-top: 18px;cursor: pointer;" @row-click="goDetail">
        <el-table-column :label="$t('views.scaList.tableHeaders.name')" prop="package_name"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.version')" prop="version"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.application')" prop="project_name"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.language')" prop="language"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.level')" prop="level"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.count')" prop="vul_count"></el-table-column>
        <el-table-column :label="$t('views.scaList.tableHeaders.time')" prop="dt"></el-table-column>
      </el-table>
    </div>
  </main>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'ScaList' })
export default class ScaList extends Vue {
  private page: number = 1;
  private pageSize: number = 20;
  private keywordInput: boolean = false
  private dataEnd: boolean = false
  private tableData: Array<object> = [];
  private searchOptionsObj = {
    language: [],
    level: [],
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
    project_name: '',
    url: '',
    order: ''
  }

  created () {
    this.getTableData()
    this.scaSummary()
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

  private projectNameChange (val: string) {
    this.searchObj.project_name = val
    this.newSelectData()
  }

  private newSelectData () {
    this.page = 1
    this.tableData = []
    this.getTableData()
    this.scaSummary()
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
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order
    }
    const { status, data, msg } = await this.$services.sca.scaList(params)
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

  private async scaSummary () {
    const params = {
      language: this.searchObj.language,
      level: this.searchObj.level,
      project_name: this.searchObj.project_name,
      url: this.searchObj.url,
      order: this.searchObj.order
    }
    const { status, data, msg } = await this.$services.sca.scaSummary(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.projects = data.projects
  }

  private goDetail (row: any) {
    this.$router.push(`/sca/scaDetail/${this.page}/${row.id}`)
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
}
</style>
