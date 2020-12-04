<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="titleForm">
        <el-select size="mini" v-model="searchObj.order" style="width: 90px;">
          <el-option v-for="item in orderOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input v-model="searchObj.keyword" style="width: 116px;margin-left: 4px;" size="mini">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
      <div class="page-line flex-column-center">
        <div class="flex-row-space-between">
          <el-pagination
            small
            layout="prev, next"
            :total="total"
            :current-page="page"
            :page-size="20"
            @current-change="currentChange"
          >
          </el-pagination>
          <span style="color: #969BA4;line-height: 25px;">
            <strong style="color: #38435A;font-weight: 400;">{{ page }}</strong>/{{ Math.ceil(total / 20) }}
          </span>
          <el-button size="mini" icon="el-icon-search"></el-button>
        </div>
      </div>
      <div class="card" v-for="item in tableData" :key="item.id"
           :class="item.id === selectedId ? 'selected' : ''" @click="idChange(item.id)">
        <div class="titleLine">
          {{ item.package_name }}
        </div>
        <div class="infoLine flex-row-space-between">
          <span>
               <i class="iconfont iconweixian"
                  :style="item.level_type === 1 ? {color: '#EA7171'} :
                   item.level_type === 2 ? {color: '#F39D0A'}  :
                   item.level_type === 3 ? {color: '#2E8FE9'}  :
                   item.level_type === 4 ? {color: '#7BC1AB'}  : ''"
               ></i>
                {{ item.level }}
              </span>
          <span>
                <i class="iconfont iconbanben-2" style="color: #A2A5AB;font-size: 14px;"></i>
                {{ item.version }}
              </span>
        </div>
      </div>
    </div>
    <div class="sca-warp">
      <div class="sca-title">
        {{scaObj.package_name}}
      </div>
      <div class="sca-info">
        <div class="info-line">{{`${$t('views.scaDetail.version')}：${scaObj.version}`}}</div>
        <div class="info-line">{{`${$t('views.scaDetail.level')}：${scaObj.level}`}}</div>
        <div class="info-line">{{`${$t('views.scaDetail.project_name')}：${scaObj.project_name}`}}</div>
        <div class="info-line">{{`${$t('views.scaDetail.vul_count')}：${scaObj.vul_count}${$t('views.scaDetail.unit')}`}}</div>
        <div class="info-line">{{`${$t('views.scaDetail.signature_value')}：${scaObj.signature_value}`}}</div>
      </div>
      <div class="module-title">
        {{$t('views.scaDetail.vulList')}}
      </div>
      <el-table :data="scaObj.vuls" style="width: 100%;">
        <el-table-column :label="$t('views.scaDetail.cveNumber')" prop="vulcve"></el-table-column>
        <el-table-column :label="$t('views.scaDetail.cweNumber')" prop="vulcwe"></el-table-column>
        <el-table-column :label="$t('views.scaDetail.vulName')" prop="vulname"></el-table-column>
        <el-table-column :label="$t('views.scaDetail.vulLevel')" prop="level"></el-table-column>
        <el-table-column :label="$t('views.scaDetail.safeVersion')" prop="safe_version"></el-table-column>
        <el-table-column :label="$t('views.scaDetail.operate')" width="100px">
          <template slot-scope="{row}">
            <i class="iconfont iconxiangqing detail" @click="detailShow(row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="75%" v-if="vulDetailDialogShow" :visible.sync="vulDetailDialogShow" :title="$t('views.scaDetail.vulDetail.title')">
      <div class="detail-module-label">{{$t('views.scaDetail.vulDetail.num')}}:
        <div class="detail-module-content" style="display: inline-block">
          {{vulDetail.vulcve}}
        </div>
      </div>
      <div class="detail-module-label">{{$t('views.scaDetail.vulDetail.name')}}:
        <div class="detail-module-content" style="display: inline-block">
          {{vulDetail.vulname}}
        </div></div>
      <div class="detail-module-label">{{$t('views.scaDetail.vulDetail.desc')}}:</div>
      <div class="detail-module-content">
        <MyMarkdownIt :content="vulDetail.overview"></MyMarkdownIt>
      </div>
      <div class="detail-module-label">{{$t('views.scaDetail.vulDetail.detail')}}:</div>
      <div class="detail-module-content">
        <MyMarkdownIt :content="vulDetail.teardown"></MyMarkdownIt>
      </div>
      <!--      <div class="detail-module-label">References:</div>-->
      <!--      <div v-if="vulDetail.reference !== '[]'" class="detail-module-content">-->
      <!--        <MyMarkdownIt :content="vulDetail.reference"></MyMarkdownIt>-->
      <!--      </div>-->
    </el-dialog>
  </main>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'

@Component({ name: 'ScaDetail' })
export default class ScaDetail extends VueBase {
  private scaObj: object = {}
  private tableData: Array<object> = []
  private page: number = 1
  private selectedId: number = 0
  private total: number = 0
  private vulDetailDialogShow: boolean = false
  private vulDetail: object = {}
  private searchObj = {
    language: '',
    level: '',
    project_name: '',
    keyword: '',
    order: ''
  }

  private orderOptions= [
    {
      label: this.$t('views.scaList.orderOptions.project_name'),
      value: 'project_name'
    },
    {
      label: this.$t('views.scaList.orderOptions.level'),
      value: 'level'
    },
    {
      label: this.$t('views.scaList.orderOptions.package_name'),
      value: 'package_name'
    },
    {
      label: this.$t('views.scaList.orderOptions.version'),
      value: 'version'
    },
    {
      label: this.$t('views.scaList.orderOptions.language'),
      value: 'language'
    },
    {
      label: this.$t('views.scaList.orderOptions.vul_count'),
      value: 'vul_count'
    }
  ]

  async created () {
    this.page = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    await this.getScaDetail()
    await this.getTableData()
  }

  private newSelectData () {
    this.page = 1
    this.getTableData()
  }

  private currentChange (val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData () {
    const params = {
      page: this.page,
      pageSize: 20,
      language: this.searchObj.language,
      level: this.searchObj.level,
      project_name: this.searchObj.project_name,
      keyword: this.searchObj.keyword,
      order: this.searchObj.order
    }
    const { status, data, page, msg } = await this.services.sca.scaList(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  private idChange (id: number) {
    this.selectedId = id
    this.getScaDetail()
  }

  private async getScaDetail () {
    const { data, status, msg } = await this.services.sca.getScaDetail(this.selectedId)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.scaObj = data
  }

  private detailShow (row: any) {
    this.vulDetail = row
    this.vulDetailDialogShow = true
  }
}
</script>

<style>
.el-table .diy-row {
  background: #F8F9FB;
  color: #959FB4;
  font-size: 14px;
}
</style>

<style scoped lang='scss'>

.slider-warp {
  margin-top: 14px;
  background: #fff;
  width: 234px;

  .titleForm {
    border-bottom: 1px solid #E6E9EC;
    padding: 14px 12px;
  }

  .page-line {
    height: 41px;
    padding: 0 12px;
  }

  .card {
    width: 100%;
    height: 72px;
    padding: 0 12px;
    cursor: pointer;

    &:hover {
      background: #EFF6FF;
    }

    .titleLine {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 12px;
    }

    .infoLine {
      font-size: 14px;
      color: #A2A5AB;
      margin-top: 19px;
    }
  }

  .selected {
    background: #EFF6FF;
  }
}

.sca-warp {
  margin-top: 14px;
  background: #fff;
  width: 952px;
  padding: 0 14px;

  .sca-title {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    color: #38435A;
    font-weight: 600;
    border-bottom: 1px solid #E6E9EC;
  }

  .sca-info{
    margin-top: 17px;

    .info-line{
      color: #959FB4;
      font-size: 14px;
      margin-top: 18px;

      &:first-child{
        margin-top: 0;
      }
    }
  }

  .module-title {
    color: #38435A;
    font-size: 14px;
    font-weight: 600;
    margin-top: 58px;
  }
}

.detail{
  font-size: 14px;
  color: #A7AFB9;
  cursor: pointer;
}

.detail-module-label{
  font-size: 14px;
  color: #959FB4;
  margin-top: 18px;
}
.detail-module-content{
  font-size: 14px;
  color: #38435A;
}
</style>
