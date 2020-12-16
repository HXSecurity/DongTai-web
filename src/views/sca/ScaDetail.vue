<template>
  <main class="container">
    <div v-if="!sliderWarpContract" class="fixed-warp">
      <div class="slider-warp">
        <div class="titleForm flex-row-space-between">
          <el-select v-model="searchObj.order" size="mini" style="width: 90px">
            <el-option
              v-for="item in orderOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-input
            v-model="searchObj.keyword"
            style="width: 106px"
            size="mini"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="newSelectData"
            />
          </el-input>
        </div>
        <div class="page-line flex-column-center">
          <div class="flex-row-space-between">
            <div class="flex-column-center">
              <el-pagination
                small
                layout="prev, next"
                :total="total"
                :current-page="page"
                :page-size="20"
                @current-change="currentChange"
              >
              </el-pagination>
            </div>
            <div class="flex-column-center">
              <span style="color: #969ba4; line-height: 25px">
                <strong style="color: #38435a; font-weight: 400">{{
                  page
                }}</strong
                >/{{ Math.ceil(total / 20) }}
              </span>
            </div>
            <div class="flex-column-center">
              <el-button
                type="text"
                style="color: #5782db"
                @click="getTableData"
              >
                刷新
              </el-button>
            </div>
          </div>
        </div>
        <div
          v-for="item in tableData"
          :key="item.id"
          class="card"
          :class="item.id === selectedId ? 'selected' : ''"
          @click="idChange(item.id)"
        >
          <div class="titleLine">
            {{ item.package_name }}
          </div>
          <div class="infoLine flex-row-space-between">
            <span :style="
                  item.level_type === 1
                    ? { color: '#EA7171' }
                    : item.level_type === 2
                    ? { color: '#F39D0A' }
                    : item.level_type === 3
                    ? { color: '#2E8FE9' }
                    : item.level_type === 4
                    ? { color: '#7BC1AB' }
                    : ''
                ">
              <i class="iconfont iconweixian"></i>
              {{ item.level }}
            </span>
            <span>
              <i
                class="iconfont iconbanben-2"
                style="color: #a2a5ab; font-size: 14px"
              ></i>
              {{ item.version }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="operateCol"
      :style="sliderWarpContract ? {} : { 'margin-left': '228px' }"
    >
      <div style="height: 100%">
        <i
          class="iconfont operateIcon"
          :class="sliderWarpContract ? 'iconopen1-2' : 'iconopen11'"
          @click="sliderWarpContract = !sliderWarpContract"
        ></i>
      </div>
    </div>
    <div
      v-if="scaObj && scaObj.package_name"
      class="sca-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <div class="sca-title">
        {{ scaObj.package_name }}
      </div>
      <div class="sca-info">
        <div class="info-line">
          <span>
            <i class="iconfont iconbanben-3"></i>
            {{ $t('views.scaDetail.version') }}：
          </span>
          {{ scaObj.version }}
        </div>
        <div class="info-line">
          <span>
            <i class="iconfont iconweixian-2"></i>
            {{ $t('views.scaDetail.level') }}：
          </span>
          {{ scaObj.level }}
        </div>
        <div class="info-line">
          <span>
            <i class="iconfont iconapp"></i>
            {{ $t('views.scaDetail.project_name') }}：
          </span>
          {{ scaObj.project_name }}
        </div>
        <div class="info-line">
          <span>
            <i class="iconfont iconlishi"></i>
            {{ $t('views.scaDetail.vul_count') }}：
          </span>
          {{ `${scaObj.vul_count}${$t('views.scaDetail.unit')}` }}
        </div>
        <div class="info-line">
          <span>
            <i class="iconfont iconwendangzhongxin"></i>
            {{ $t('views.scaDetail.signature_value') }}：
          </span>
          {{ scaObj.signature_value }}
        </div>
      </div>
      <div class="module-title">
        {{ $t('views.scaDetail.vulList') }}
      </div>
      <el-table :data="scaObj.vuls" style="width: 100%">
        <el-table-column
          :label="$t('views.scaDetail.cveNumber')"
          prop="vulcve"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaDetail.cweNumber')"
          prop="vulcwe"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaDetail.vulName')"
          prop="vulname"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaDetail.vulLevel')"
          prop="level"
        ></el-table-column>
        <el-table-column
          :label="$t('views.scaDetail.safeVersion')"
          prop="safe_version"
        ></el-table-column>
        <el-table-column :label="$t('views.scaDetail.operate')" width="100px">
          <template slot-scope="{ row }">
            <i
              class="iconfont iconxiangqing detail"
              @click="detailShow(row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-if="vulDetailDialogShow"
      width="75%"
      :visible.sync="vulDetailDialogShow"
      :title="$t('views.scaDetail.vulDetail.title')"
    >
      <div class="detail-module-label">
        {{ $t('views.scaDetail.vulDetail.num') }}:
        <div class="detail-module-content" style="display: inline-block">
          {{ vulDetail.vulcve }}
        </div>
      </div>
      <div class="detail-module-label">
        {{ $t('views.scaDetail.vulDetail.name') }}:
        <div class="detail-module-content" style="display: inline-block">
          {{ vulDetail.vulname }}
        </div>
      </div>
      <div class="detail-module-label">
        {{ $t('views.scaDetail.vulDetail.desc') }}:
      </div>
      <div class="detail-module-content">
        <MyMarkdownIt :content="vulDetail.overview"></MyMarkdownIt>
      </div>
      <div class="detail-module-label">
        {{ $t('views.scaDetail.vulDetail.detail') }}:
      </div>
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

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { ScaListObj, ScaObj, VulObj } from '@/views/sca/types'

@Component({ name: 'ScaDetail' })
export default class ScaDetail extends VueBase {
  private sliderWarpContract = false
  private scaObj: ScaObj | undefined
  private tableData: Array<ScaListObj> = []
  private page = 1
  private selectedId = 0
  private total = 0
  private vulDetailDialogShow = false
  private vulDetail: VulObj | undefined
  private searchObj = {
    language: '',
    level: '',
    project_name: '',
    keyword: '',
    order: '',
  }

  private orderOptions = [
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
  ]

  async created() {
    this.page = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    await this.getScaDetail()
    await this.getTableData()
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }

  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  private async getTableData() {
    const params = {
      page: this.page,
      pageSize: 20,
      language: this.searchObj.language,
      level: this.searchObj.level,
      project_name: this.searchObj.project_name,
      keyword: this.searchObj.keyword,
      order: this.searchObj.order,
    }
    this.loadingStart()
    const { status, data, page, msg } = await this.services.sca.scaList(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  private idChange(id: number) {
    this.selectedId = id
    this.getScaDetail()
  }

  private async getScaDetail() {
    this.loadingStart()
    const { data, status, msg } = await this.services.sca.getScaDetail(
      this.selectedId
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.scaObj = data
  }

  private detailShow(row: any) {
    this.vulDetail = row
    this.vulDetailDialogShow = true
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
  background: #fff;
  width: 234px;
  margin-top: 78px;
  overflow: auto;
  height: calc(100vh - 103px);
  padding-bottom: 40px;

  .titleForm {
    border-bottom: 1px solid #e6e9ec;
    padding: 14px 4px;
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
      background: #eff6ff;
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
      color: #a2a5ab;
      margin-top: 19px;
    }
  }

  .selected {
    background: #eff6ff;
  }
}

.operateCol {
  position: fixed;
  overflow: auto;
  height: calc(100vh - 64px);
  .operateIcon {
    font-size: 26px;
    color: #c5d6e2;
    cursor: pointer;
    line-height: 100vh;
  }
}

.slider-warp-contract {
  width: calc(100% - 24px);
  margin-left: 23px;
}

.slider-warp-spreadOut {
  width: 952px;
  margin-left: 248px;
}

.sca-warp {
  margin-top: 14px;
  min-height: calc(100vh - 104px);
  margin-bottom: 26px;
  background: #fff;
  padding: 0 14px 41px 14px;

  .sca-title {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    color: #38435a;
    font-weight: 600;
    border-bottom: 1px solid #e6e9ec;
  }

  .sca-info {
    margin-top: 17px;

    .info-line {
      color: #959fb4;
      font-size: 14px;
      margin-top: 18px;

      &:first-child {
        margin-top: 0;
      }

      span {
        color: #5782db;
        display: inline-block;
        vertical-align: middle;

        i {
          font-size: 14px;
        }
      }
    }
  }

  .module-title {
    color: #38435a;
    font-size: 14px;
    font-weight: 600;
    margin-top: 58px;
  }
}

.detail {
  font-size: 14px;
  color: #a7afb9;
  cursor: pointer;
}

.detail-module-label {
  font-size: 14px;
  color: #959fb4;
  margin-top: 18px;
}
.detail-module-content {
  font-size: 14px;
  color: #38435a;
}
</style>
