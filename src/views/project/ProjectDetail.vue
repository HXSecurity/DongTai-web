<template>
  <main class="container">
    <div v-if="projectObj" class="project-warp">
      <div class="back">
        <span @click="goProjectList">
          <i class="el-icon-arrow-left"></i>返回项目列表
        </span>
      </div>
      <div class="title-warp">
        <div class="title-top flex-row-space-between">
          <div class="name">
            {{ projectObj.name }}
            <el-tag
              v-for="(item, index) in projectObj.agent_language"
              :key="index"
              size="small"
              :type="getTagColoe(item)"
              style="margin-left: 12px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="operate">
            <el-button
              type="text"
              class="operateBtn"
              @click="$router.push(`/project/projectEdit/${$route.params.pid}`)"
            >
              <i class="iconfont iconshezhi-2"></i>
            </el-button>
          </div>
        </div>

        <div class="info-line flex-row-space-between">
          <div class="info">
            <i class="iconfont iconjiance-copy"></i>
            {{ $t('views.projectDetail.mode') }}
            <i class="mode">
              {{ projectObj.mode }}
            </i>
            <i class="iconfont icongerenzhongxin" style="font-size: 14px"></i>
            {{ $t('views.projectDetail.owner') }}
            <span style="margin-right: 40px"> {{ projectObj.owner }}</span>
            <i class="iconfont iconshijian00"></i>
            {{ $t('views.projectDetail.latest_time') }}
            <i style="margin-right: 40px">{{ projectObj.latest_time }}</i>

            <i class="iconfont iconicon_details_banben"></i>
            {{ $t('views.projectDetail.version') }}
            <el-select
              v-model="projectObj.versionData.version_id"
              size="mini"
              style="width: 210px"
              @change="changeVersion"
            >
              <el-option
                v-for="(item, index) in versionList"
                :key="index"
                :value="item.version_id"
                :label="item.version_name"
              >
                {{ item.version_name }}
              </el-option>
            </el-select>
            <i
              class="iconfont iconicon_details_edit"
              style="margin-left: 12px; cursor: pointer; color: #4fb794"
              @click="showVersion"
            ></i>
          </div>
        </div>
      </div>
      <div class="projectVul flex-row-space-between">
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'desc' ? 'selected' : ''"
          @click="changeActive('desc')"
        >
          <i class="iconfont iconshuju1"></i>
          {{ $t('views.projectDetail.projectDesc') }}
        </el-button>
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'vul' ? 'selected' : ''"
          @click="changeActive('vul')"
        >
          <i class="iconfont iconloudong"></i>
          {{ $t('views.projectDetail.projectVul') }}
        </el-button>
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'component' ? 'selected' : ''"
          @click="changeActive('component')"
        >
          <i class="el-icon-menu" style="line-height: 8px"></i>
          {{ $t('views.projectDetail.projectComponent') }}
        </el-button>
        <!-- <el-button
          v-if="showApiListFlag"
          type="text"
          class="pTab"
          :class="selectTab === 'apiList' ? 'selected' : ''"
          @click="changeActive('apiList')"
        >
          <i class="iconfont iconzhongjianjian" style="line-height: 8px"></i>
          {{ $t('views.projectDetail.apiList') }}
        </el-button> -->
      </div>
      <template v-if="projectObj.versionData.version_id">
        <div v-if="selectTab === 'desc'">
          <div
            id="type_summary_level_count"
            class="module flex-row-space-between"
          >
            <div class="module-content">
              <div class="module-title">
                {{ $t('views.projectDetail.vulNum') }}
              </div>

              <div>
                <Distribution
                  v-if="projectObj.level_count"
                  :height="312"
                  :data="projectObj.level_count"
                />
              </div>
            </div>
            <div class="module-content">
              <div class="module-title">
                {{ $t('views.projectDetail.type') }}
              </div>

              <Type
                v-if="projectObj.type_summary"
                :height="312"
                :data="projectObj.type_summary"
              />
            </div>
          </div>
          <div class="module">
            <div class="module-title">
              {{ $t('views.projectDetail.trend') }}
            </div>
            <Trend v-if="projectObj.day_num" :data="projectObj.day_num" />
          </div>
        </div>
        <div v-show="selectTab === 'vul'">
          <vul-list-component
            ref="vulListComponent"
            :project-id="$route.params.pid"
            :version="projectObj.versionData.version_id"
          ></vul-list-component>
        </div>
        <div v-if="selectTab === 'component'">
          <ScaList
            ref="componentList"
            :project-id="$route.params.pid"
            :version="projectObj.versionData.version_id"
          ></ScaList>
        </div>
        <div v-if="selectTab === 'apiList' && showApiListFlag">
          <ApiList
            ref="apiList"
            :project-id="$route.params.pid"
            :version-id="projectObj.versionData.version_id"
          >
          </ApiList>
        </div>
      </template>
    </div>

    <el-dialog
      :title="$t('views.projectDetail.version_dialog')"
      :visible.sync="versionFlag"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="version-dialog-btn-list">
        <el-tag style="cursor: pointer;" size="small" effect="plain" @click="addVersion">
          <i class="el-icon-plus"></i>
          {{ $t('views.projectDetail.add_version') }}
        </el-tag>
      </div>
      <el-table
        border
        :data="versionList"
        :header-cell-style="{ background: '#F1F8FF' }"
        height="350"
      >
        <el-table-column
          property="version_name"
          min-width="120px"
          :label="$t('views.projectDetail.version_name')"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.isEdit">
              <span>{{ scope.row.version_name }}</span>
              <el-tag
                v-if="scope.row.current_version === 1"
                style="margin-left: 22px"
                size="small"
                effect="plain"
              >
                {{ $t('views.projectDetail.current_version') }}
              </el-tag>
            </div>
            <el-input
              v-else
              v-model="scope.row.version_name"
              maxlength="20"
              size="small"
              :placeholder="$t('views.projectDetail.search_version_name')"
            />
          </template>
        </el-table-column>
        <el-table-column
          min-width="200px"
          property="description"
          :label="$t('views.projectDetail.description')"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit">{{ scope.row.description }}</span>
            <el-input
              v-else
              v-model="scope.row.description"
              size="small"
              :placeholder="$t('views.projectDetail.search_description')"
            />
          </template>
        </el-table-column>
        <el-table-column
          header-align="right"
          min-width="200px"
          :label="$t('views.projectDetail.handle')"
        >
          <template slot-scope="scope">
            <div class="btn-list">
              <el-button
                v-if="!scope.row.isEdit && scope.row.current_version !== 1"
                type="text"
                @click="versionCurrent(scope.row)"
                >{{ $t('views.projectDetail.versionCurrent') }}</el-button
              >
              <el-button
                v-if="!scope.row.isEdit"
                type="text"
                @click="editVersion(scope.row)"
                >{{ $t('views.projectDetail.editVersion') }}</el-button
              >
              <el-button
                v-if="scope.row.isEdit"
                type="text"
                @click="enterVersion(scope.row, scope.$index)"
                >{{ $t('views.projectDetail.enterVersion') }}</el-button
              >
              <el-button
                v-if="scope.row.isEdit"
                type="text"
                @click="cancelVersion(scope.row, scope.$index)"
                >{{ $t('views.projectDetail.cancelVersion') }}</el-button
              >
              <span style="color: #d8d8d8">|</span>
              <el-button
                type="text"
                style="color: #ea3838"
                :disabled="
                  !scope.row.version_id || scope.row.current_version === 1
                "
                @click="deleteVersion(scope.row, scope.$index)"
                >{{ $t('views.projectDetail.deleteVersion') }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enterVersionDialog">{{
          $t('views.projectDetail.dialogEnterVersion')
        }}</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component, Watch } from 'vue-property-decorator'
import { ProjectObj } from './types'
import { formatTimestamp } from '@/utils/utils'
import request from '@/utils/request'
import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'
import VulListComponent from './VulListComponent.vue'
import ApiList from './apiList.vue'
import ScaList from '../sca/ScaList.vue'
import merge from 'webpack-merge'

import Distribution from './components/distribution.vue'
import Trend from './components/trend.vue'
import Type from './components/type.vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])
@Component({
  name: 'ProjectDetail',
  components: {
    VulListComponent,
    ScaList,
    ApiList,
    Distribution,
    Trend,
    Type,
  },
})
export default class ProjectDetail extends VueBase {
  beforeRouteEnter(to: any, from: any, next: any) {
    next()
  }
  beforeRouteLeave(to: any, from: any, next: any) {
    if (to.meta.i18n === 'menu.vulnDetail') {
      this.$store.dispatch('setRouteInfo', [])
    } else {
      this.$store.dispatch('setRouteInfo', ['ProjectIndex', 'ProjectDetail'])
    }
    console.log('@store', this.$store.getters.vulnRouteInfo)
    next()
  }
  formatTimestamp(time: number) {
    return formatTimestamp(time)
  }
  private exp_page = 1
  private exp_total = 0
  private type = 'docx'
  private selectTab = 'desc'
  private projectObj: ProjectObj = {
    id: 0,
    mode: '',
    name: '',
    owner: '',
    latest_time: '',
    versionData: {},
    agent_languag: [],
  }
  private showApiListFlag = false
  private versionTemp: any = {}
  private versionList: any[] = []
  private versionFlag = false
  private enterVersionDialog() {
    if (this.versionList.some((item) => item.isEdit)) {
      this.$message.error(this.$t('views.projectDetail.beforeClose') as string)
      return
    }
    this.versionFlag = false
  }

  private async versionCurrent(item: any) {
    const res: any = await this.services.project.versionCurrent({
      version_id: item.version_id,
      project_id: this.$route.params.pid,
    })
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
      this.versionList.forEach((i) => (i.current_version = 0))
      item.current_version = 1
      // await this.showApiList()
      await this.projectsSummary()
      await this.getVersionList()
    }
  }

  goProjectList() {
    this.$router.push({
      name: 'projectManage',
    })
  }

  private async changeActive(e: any) {
    this.selectTab = e
    this.$router.replace({
      query: merge(this.$route.query, { activeName: e }) as any,
    })
    // this.$set(this.$route.query, 'activeName', e)
    if (e === 'desc') {
      await this.projectsSummary(this.projectObj.versionData.version_id)
    }
  }

  private editVersion(item: any) {
    if (this.versionList.some((item) => item.isEdit)) {
      this.$message({
        type: 'error',
        message: this.$t('views.projectDetail.hasEdit') as string,
        showClose: true,
      })
      return
    }
    this.$set(item, 'isEdit', true)
    Object.assign(this.versionTemp, item)
  }
  private async enterVersion(item: any, index: number) {
    if (
      this.versionList.some(
        (i, k) => i.version_name === item.version_name && k !== index
      )
    ) {
      this.$message({
        type: 'warning',
        message: this.$t('views.projectDetail.hasSame') as string,
        showClose: true,
      })
      return
    }
    if (!item.version_id) {
      const res: any = await this.services.project.versionAdd({
        ...item,
        project_id: this.$route.params.pid,
      })
      if (res.status !== 201) {
        this.$message({
          type: 'error',
          message: res.msg,
          showClose: true,
        })
        return
      }
      this.$message({
        type: 'success',
        message: res.msg,
        showClose: true,
      })
      item.version_id = res.data.version_id
      this.versionTemp = {}
      this.$set(item, 'isEdit', false)
    } else {
      const res: any = await this.services.project.versionEdit({
        ...item,
        project_id: this.$route.params.pid,
      })
      if (res.status !== 201) {
        this.$message({
          type: 'error',
          message: res.msg,
          showClose: true,
        })
        return
      }
      this.$message({
        type: 'success',
        message: res.msg,
        showClose: true,
      })
      this.versionTemp = {}
      this.$set(item, 'isEdit', false)
    }
  }
  private cancelVersion(item: any, index: number) {
    if (!item.version_id) {
      this.versionList.splice(index, 1)
      return
    }
    Object.assign(item, this.versionTemp)
    this.$set(item, 'isEdit', false)
    this.versionTemp = {}
  }
  private deleteVersion(item: any, index: number) {
    this.$confirm(
      this.$t('views.projectDetail.warningInfo') as string,
      this.$t('views.projectDetail.warning') as string,
      {
        confirmButtonText: this.$t(
          'views.projectDetail.enterVersion'
        ) as string,
        cancelButtonText: this.$t(
          'views.projectDetail.cancelVersion'
        ) as string,
        type: 'warning',
      }
    ).then(async () => {
      const res: any = await this.services.project.versionDelete({
        version_id: item.version_id,
        project_id: this.$route.params.pid,
      })
      if (res.status != 201) {
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
        this.versionList.splice(index, 1)
      }
    })
  }

  private addVersion() {
    if (this.versionList.some((item) => item.isEdit)) {
      this.$message({
        showClose: true,
        message: this.$t('views.projectDetail.hasEdit') as string,
        type: 'error',
      })
      return
    }
    this.versionList.push({
      version_name: '',
      description: '',
      isEdit: true,
    })
  }
  private async changeVersion(value: any) {
    // await this.showApiList()
    // await this.projectsSummary()
    this.$nextTick(() => {
      if (this.selectTab === 'desc') {
        this.projectsSummary(value)
      } else if (this.selectTab === 'vul') {
        const v: any = this.$refs.vulListComponent
        v.getTableData(true)
        v.vulnSummary()
      } else if (this.selectTab === 'component') {
        const c: any = this.$refs.componentList
        c.getTableData(true)
        c.scaSummary()
      } else if (this.selectTab === 'apiList') {
        const a: any = this.$refs.apiList
        a.searchChange()
      }
    })
  }
  async showApiList() {
    const res = await this.services.project.searchApi({
      page_size: 1,
      project_id: this.$route.params.pid,
      version_id: this.projectObj.versionData.version_id,
    })
    if (res.status !== 201) {
      this.$message.error(res.msg)
    }
    if (res.data?.length > 0) {
      this.showApiListFlag = true
    } else {
      this.showApiListFlag = false
      if (this.selectTab === 'apiList') {
        this.selectTab = 'desc'
      }
    }
  }

  @Watch('$route.params.pid', { immediate: true })
  async init() {
    if (this.$route.query.activeName) {
      this.selectTab = this.$route.query.activeName as string
    } else {
      this.selectTab = 'desc'
    }
    if (!this.$route.params.pid) {
      return
    }
    // await this.showApiList()
    await this.projectsSummary()
    await this.getVersionList()
  }
  private offsetHeight = 0
  private async projectsSummary(id?: string) {
    const { status, msg, data } = await this.services.project.projectsSummary(
      this.$route.params.pid,
      id
    )
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }

    this.projectObj = {
      ...data,
      name: data.name,
      latest_time: formatTimestamp(data.latest_time),
    }
  }
  showVersion() {
    this.versionFlag = true
  }
  getVersionList() {
    this.services.project
      .versionList(this.$route.params.pid)
      .then((res: any) => {
        if (res.status === 201) {
          this.versionList = res.data
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            showClose: true,
          })
        }
      })
  }

  private getTagColoe(language: string) {
    switch (language) {
      case 'JAVA':
        return 'danger'
      case 'PYTHON':
        return ''
      default:
        return ''
    }
  }
}
</script>

<style scoped lang="scss">
.project-warp {
  margin-top: 28px;
  padding: 14px 14px 80px 14px;
  background: #fff;
  .title-warp {
    padding-bottom: 13px;
    border-bottom: 1px solid #e6e9ec;

    .name {
      font-size: 16px;
      color: #38435a;
      font-weight: 600;
    }

    .info-line {
      margin-top: 19px;

      .info {
        font-size: 14px;
        color: #a3a8b3;
        i {
          font-size: 14px;
        }

        .mode {
          color: #4fb794;
          margin-right: 45px;
          font-style: inherit;
        }
      }
    }
    .operate {
      // color: #b1b9c4;
      .operateBtn {
        width: 32px;
        height: 32px;
        background: #f2f3f5;
        border-radius: 2px;
        line-height: 0;
        font-size: 14px;
        color: #4a72ae;
      }

      // i {
      //   cursor: pointer;
      //   margin-left: 24px;

      //   &:first-child {
      //     margin-left: 0;
      //   }
      // }
    }
  }

  .projectVul {
    cursor: pointer;
    font-size: 14px;
    color: #2e7def;
    margin-top: 13px;

    .pTab {
      width: 49%;
      height: 32px;
      line-height: 0;
      border-radius: 2px;
      border: 1px solid #2e7def;
    }

    .selected {
      background: #2e7def;
      color: #fff;
    }

    // i {
    //   font-size: 14px;
    //   color: #b1b9c4;
    // }
  }

  .module {
    margin-top: 14px;

    .module-title {
      font-size: 14px;
      font-weight: 400;
      color: #38435a;
    }

    .module-card {
      margin-top: 18px;
      width: 100%;
      height: 342px;
      background: #ffffff;
      box-shadow: 0 0 16px 0 #eff2f6;
    }

    .module-content {
      width: 580px;
      height: 330px;

      .module-card {
        height: 298px;
      }
    }
  }
}
.btn-list {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .el-button {
    padding: 0 16px;
  }
}
.version-dialog-btn-list {
  display: flex;
  justify-content: flex-end;
  padding: 0 0 18px 0;
  .version-dialog-btn {
    cursor: pointer;
  }
}

::v-deep.el-dialog__body {
  padding: 0 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.export-table-title {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #38435a;
  padding-bottom: 20px;
}
.export-table {
  border: 1px solid #e6e9ec;
  border-bottom: none;
}
.dialog-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.exp_btn {
  background-color: #4a72ae;
  border-color: #4a72ae;
  border-radius: 2px;
  color: #fff;
  padding-top: 8px;
  padding-bottom: 8px;
}
.exp_radio {
  margin-top: 10px;
  ::v-deep.el-radio__input.is-checked .el-radio__inner {
    background: #4a72ae;
    border-color: #4a72ae;
  }
  ::v-deep.el-radio__input.is-checked + .el-radio__label {
    color: #606266;
  }
}

.back {
  color: #0085ff;
  cursor: pointer;
  margin-bottom: 12px;
  i {
    font-size: 16px;
    margin-right: 8px;
  }
}
</style>
