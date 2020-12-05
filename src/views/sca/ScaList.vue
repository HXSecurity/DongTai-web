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
        <div
          v-for="item in searchOptionsObj.language"
          :key="item.language"
          class="flex-row-space-between module-line"
          @click="languageChange(item.language)"
        >
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
        <div
          v-for="item in searchOptionsObj.level"
          :key="item.level"
          class="flex-row-space-between module-line"
          @click="levelChange(item.level)"
        >
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
        <div
          v-for="item in searchOptionsObj.projects"
          :key="item.project_name"
          class="flex-row-space-between module-line"
          @click="projectNameChange(item.project_name)"
        >
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
        <el-select
          v-model="searchObj.order"
          size="mini"
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
          style="margin-left: 10px"
          size="mini"
          clearable
          @change="newSelectData"
        >
          <el-option label="JAVA" value="JAVA"></el-option>
          <el-option label=".NET" value=".NET"></el-option>
        </el-select>
        <div class="selectInput">
          <el-input
            v-if="keywordInput"
            v-model="searchObj.keyword"
            style="width: 462px"
            size="mini"
            @blur="inputHide"
            @keyup.enter.native="newSelectData"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="newSelectData"
            />
          </el-input>
          <i
            v-else
            class="el-icon-search"
            style="margin-top: 10px; margin-right: 10px"
            @click="keywordInput = !keywordInput"
          />
        </div>
      </div>
      <el-table
        class="sca-list"
        :data="tableData"
        style="width: 100%; margin-top: 18px; cursor: pointer"
        @row-click="goDetail"
      >
        <el-table-column
          :label="$t('views.scaList.tableHeaders.name')"
          prop="package_name"
          min-width="120px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.version')"
          prop="version"
          width="80px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.application')"
          prop="project_name"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.language')"
          prop="language"
          width="100px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.level')"
          prop="level"
          width="100px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.count')"
          prop="vul_count"
          width="80px"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaList.tableHeaders.time')"
          prop="dt"
          width="140px"
        ></el-table-column>
      </el-table>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'

@Component({ name: 'ScaList' })
export default class ScaList extends VueBase {
  private page = 1
  private pageSize = 20
  private keywordInput = false
  private dataEnd = false
  private tableData: Array<object> = []
  private searchOptionsObj = {
    language: [],
    level: [],
    projects: [],
    orderOptions: [
      {
        label: this.$t('views.scaList.orderOptions.project_name'),
        value: 'project_name',
      },
      {
        label: this.$t('views.scaList.orderOptions.level'),
        value: 'level',
      },
      {
        label: this.$t('views.scaList.orderOptions.package_name'),
        value: 'package_name',
      },
      {
        label: this.$t('views.scaList.orderOptions.version'),
        value: 'version',
      },
      {
        label: this.$t('views.scaList.orderOptions.language'),
        value: 'language',
      },
      {
        label: this.$t('views.scaList.orderOptions.vul_count'),
        value: 'vul_count',
      },
    ],
  }

  private searchObj = {
    language: '',
    level: '',
    project_name: '',
    keyword: '',
    order: '',
  }

  created() {
    this.getTableData()
    this.scaSummary()
  }

  private inputHide() {
    if (!this.searchObj.keyword) {
      this.keywordInput = false
    }
  }

  private languageChange(val: string) {
    this.searchObj.language = val
    this.newSelectData()
  }

  private levelChange(val: string) {
    this.searchObj.level = val
    this.newSelectData()
  }

  private projectNameChange(val: string) {
    this.searchObj.project_name = val
    this.newSelectData()
  }

  private newSelectData() {
    this.page = 1
    this.tableData = []
    this.getTableData()
    this.scaSummary()
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
      project_name: this.searchObj.project_name,
      keyword: this.searchObj.keyword,
      order: this.searchObj.order,
    }
    const { status, data, msg } = await this.services.sca.scaList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    const tableData = data.reduce((list: any[], item: { dt: any }) => {
      list.push({
        ...item,
        dt: formatTimestamp(item.dt),
      })
      return list
    }, [])
    if (tableData.length < 20) {
      this.dataEnd = true
    }
    this.tableData = [...this.tableData, ...tableData]
  }

  private async scaSummary() {
    const params = {
      language: this.searchObj.language,
      level: this.searchObj.level,
      project_name: this.searchObj.project_name,
      keyword: this.searchObj.keyword,
      order: this.searchObj.order,
    }
    const { status, data, msg } = await this.services.sca.scaSummary(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.projects = data.projects
  }

  private goDetail(row: any) {
    this.$router.push(`/sca/scaDetail/${this.page}/${row.id}`)
  }
}
</script>

<style scoped lang="scss">
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
    border-bottom: 1px solid #e6e9ec;
    font-size: 18px;
    font-weight: normal;
    color: #4a72ae;
  }

  .module-title {
    margin-top: 28px;
    font-size: 16px;
    color: #38435a;
  }

  .module-line {
    margin-top: 24px;
    cursor: pointer;
    padding-left: 5px;

    .selectOption {
      color: #4b99f1;
      font-size: 14px;
    }

    .num {
      color: #959ea9;
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
