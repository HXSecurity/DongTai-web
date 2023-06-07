<template>
  <main>
    <div
      class="vuln-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <template>
        <div class="module-title has-log">
          <span>基本信息</span>
        </div>
        <div class="infoWarp">
          <div class="infoLine flex-row-space-between">
            <div v-dot class="info">
              <span class="label"> 危害级别： </span>
              <span
                class="dot"
                :style="{ color: levelColor(assetVulDetail.level) }"
                >{{ levelObj[assetVulDetail.level] }}</span
              >
            </div>
            <div v-dot class="info">
              <span class="label"> 首次出现： </span>
              <span>{{ fmtTime(assetVulDetail.published_time) }}</span>
            </div>
            <div v-dot class="info">
              <span class="label"> 最新活跃： </span>
              <span>
                <span>{{ fmtTime(assetVulDetail.create_time) }}</span>
              </span>
            </div>
          </div>
          <div class="infoLine flex-row-space-between">
            <div v-dot class="info">
              <span class="label"> 漏洞类型： </span>
              <span
                ><span v-for="type in assetVulDetail.vul_type" :key="type"
                  >{{ type }}
                </span></span
              >
            </div>
            <div v-dot class="info">
              <span class="label"> 语言： </span>
              <span>{{ language }}</span>
            </div>
            <div v-dot class="info"></div>
            <!-- <div v-dot class="info">
              <span class="label"> 编号： </span>
              <span v-for="(i, key) in CVENUMBERS" :key="'cve' + key">
                <span v-if="i.label" class="jump" @click="openWindow(i.link)"
                  >{{ i.label }} </span
                >{{ key != CVENUMBERS.length - 1 && i.label ? '|' : '' }}
              </span>
            </div> -->
          </div>
        </div>
        <div class="module-title">漏洞描述</div>
        <div class="vulnDesc markdownContent">
          <MyMarkdownIt
            :content="assetVulDetail.vul_detail"
            style="color: #38435a"
          ></MyMarkdownIt>
        </div>
        <div class="module-title">编号</div>
        <div v-if="assetVulDetail.vul_codes" class="vulnDesc">
          <span
            v-for="(i, key) in Object.values(assetVulDetail.vul_codes)"
            :key="'cve' + key"
          >
            <span v-if="i" class="jump">{{ i[0] }} </span>
            <span
              v-show="key != Object.values(assetVulDetail.vul_codes).length - 1"
              style="
                display: inline-block;
                width: 0px;
                height: 10px;
                border-left: 1px solid #b6bbc5;
                margin: 0 10px;
              "
            >
            </span>
          </span>
        </div>

        <div class="module-title" style="color: #e56363">影响版本</div>
        <div
          v-if="
            assetVulDetail.affected_versions &&
            assetVulDetail.affected_versions.length > 0
          "
          class="vulnDesc"
        >
          <span
            v-for="(i, key) in assetVulDetail.affected_versions"
            :key="'cve' + key"
          >
            <span v-if="i" class="jump">{{ i }} </span>
            <span
              v-show="key != assetVulDetail.affected_versions.length - 1"
              style="
                display: inline-block;
                width: 0px;
                height: 10px;
                border-left: 1px solid #b6bbc5;
                margin: 0 10px;
              "
            >
            </span>
          </span>
        </div>
        <div v-else class="vulnDesc">无</div>
        <div class="module-title" style="color: #51cb74">不影响版本</div>
        <div
          v-if="
            assetVulDetail.unaffected_versions &&
            assetVulDetail.unaffected_versions.length > 0
          "
          class="vulnDesc"
        >
          <span
            v-for="(i, key) in assetVulDetail.unaffected_versions"
            :key="'cve' + key"
          >
            <span v-if="i" class="jump">{{ i }} </span>
            <span
              v-show="key != assetVulDetail.unaffected_versions.length - 1"
              style="
                display: inline-block;
                width: 0px;
                height: 10px;
                border-left: 1px solid #b6bbc5;
                margin: 0 10px;
              "
            >
            </span>
          </span>
        </div>
        <div v-else class="vulnDesc">无</div>
      </template>
    </div>

    <el-dialog
      :visible.sync="deleteDialogOpen"
      :title="$t('views.vulnDetail.deleteVuln')"
      width="25%"
    >
      <div style="text-align: center">
        <p style="color: #959fb4">
          {{ $t('views.vulnDetail.deleteVulnInfo') }}
        </p>
        <p style="color: #959fb4; margin-top: 14px">
          {{ $t('views.vulnDetail.deleteVulnDesc') }}
        </p>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="confirmDel" @click="vulnDelete">
          {{ $t('views.vulnDetail.deleteVulnEnter') }}
        </el-button>
        <el-button
          type="text"
          class="cancelDel"
          @click="deleteDialogOpen = false"
        >
          {{ $t('views.vulnDetail.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="logDialogOpen"
      title="查看日志"
      width="700px"
      custom-class="sca-dialog"
    >
      <div class="log-list">
        <div v-for="log in logList" :key="log.id" class="log-item">
          <div class="log-item-name">{{ log.msg }}</div>
          <div class="log-item-time">
            {{ fmtTime(log.datetime * 1000 * 1000) }}
          </div>
        </div>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import request from '@/utils/request'
import qs from 'qs'
import Sync from '../vuln/components/sync.vue'
import LinkList from './components/linkList.vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])
@Component({
  name: 'VulnDetail',
  components: {
    Sync,
  },
})
export default class VulnDetail extends VueBase {
  @Prop() dialogInfo!: any
  @Prop() language: any
  beforeRouteLeave(to: any, from: any, next: any) {
    if (to.meta.i18n === 'menu.projectDetail') {
      this.$store.dispatch('setRouteInfo', [])
    } else {
      this.$store.dispatch('setRouteInfo', ['ProjectIndex', 'ProjectDetail'])
    }
    next()
  }
  private sliderWarpContract = false
  private deleteDialogOpen = false
  private logDialogOpen = false
  fmtTime(time: any) {
    if (time) {
      if (`${time}`.length === 10) {
        time = window.parseInt(time) * 1000
      } else {
        time = +time
      }
      const data = new Date(time).getTime() / 1000
      return formatTimestamp(data)
    }
    return ''
  }

  async openUrl(url: any) {
    window.open(url)
  }

  get CVENUMBERS() {
    const res = []
    for (let key in this.assetVulDetail.base_info) {
      switch (key) {
        case 'cnnvd':
          res.push({
            label: this.assetVulDetail.base_info[key],
            link: `http://www.cnnvd.org.cn/web/xxk/ldxqById.tag?CNNVD=${this.assetVulDetail.base_info[key]}`,
          })
          break
        case 'cnvd':
          res.push({
            label: this.assetVulDetail.base_info[key],
            link: `https://www.cnvd.org.cn/flaw/show/${this.assetVulDetail.base_info[key]}`,
          })
          break
        case 'cve':
          res.push({
            label: this.assetVulDetail.base_info[key],
            link: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${this.assetVulDetail.base_info[key]}`,
          })
          break
        case 'cwe':
          const cwe =
            this.assetVulDetail.base_info[key] &&
            this.assetVulDetail.base_info[key][0]
          res.push({
            label: cwe,
            link: `https://cwe.mitre.org/data/definitions/${cwe}.html`,
          })
          break
      }
    }
    return res
  }

  private openWindow(link: string) {
    window.open(link)
  }

  private settingInte: any = []
  private assetVulDetail: any = {}

  private async changePage(page: any) {
    this.page = page
    this.getAssetVulProjects()
  }

  private async summary() {
    // const res = await this.services.vuln.summary()
    // if (res.status === 201) {
    //   this.settingInte = res.data
    // }
  }

  goBack = () => {
    this.$router.go(-1)
    // this.$router.push({
    //   name: 'vulnList',
    // })
  }
  private levelObj = {
    0: '严重',
    1: '高危',
    2: '中危',
    3: '低危',
    4: '无风险',
  }

  private levelColor(level: any) {
    switch (level) {
      case 0:
        return '#E56363'
      case 1:
        return '#E56363'
      case 2:
        return '#F49E0B'
      case 3:
        return '#2F90EA'
      case 4:
        return '#ABB2C0'
      case 5:
        return '#DBDBDB'
    }
  }

  private statusOptions: Array<any> = [
    {
      value: this.$t('views.vulnDetail.reported'),
      label: this.$t('views.vulnDetail.reported'),
    },
    {
      value: this.$t('views.vulnDetail.confirmed'),
      label: this.$t('views.vulnDetail.confirmed'),
    },
    {
      value: this.$t('views.vulnDetail.fixed'),
      label: this.$t('views.vulnDetail.fixed'),
    },
    {
      value: this.$t('views.vulnDetail.ignored'),
      label: this.$t('views.vulnDetail.ignored'),
    },
  ]

  private tableData: Array<any> = []
  private page = 1
  private keyword = ''
  private selectedId = 0
  private total = 0

  private orderOptions = [
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
  ]

  private aggr_id: any = 0
  async init() {
    this.aggr_id = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    await this.getAssetVulDetail()
  }

  async getAssetVulDetail() {
    const res = await this.services.sca.vulPackId({
      vul_id: this.dialogInfo.vul_id, //组件漏洞id
    })
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.assetVulDetail = res.data
  }

  async created() {
    this.init()
  }

  private async vulnDelete() {
    this.loadingStart()
    const { status, msg } = await this.services.vuln.vulnDelete(this.selectedId)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
    } else {
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
      this.$router.push('/vuln/vulnList')
    }
  }

  private assetVulProjects = []
  private numberPages = 10
  private async getAssetVulProjects() {
    // const res = await this.services.sca.assetVulProjects(this.aggr_id, {
    //   page: this.page,
    //   keyword: this.keyword,
    // })
    // this.assetVulProjects = res.data
    // this.total = res.page.alltotal
    // this.numberPages = res.page.page_size
  }

  private logList: any = []
  async vullogBtn() {
    const res = await this.services.vuln.vullog(this.$route.query.id, '2')
    this.logList = res.status
    this.logDialogOpen = true
  }
  // exportVul() {
  //   var projectName = this.assetVulDetail.base_info.project_names[0]
  //   request
  //     .get(
  //       `project/export?vid=${this.selectedId}&pid=${this.vulnObj.vul.project_id}`,
  //       {
  //         responseType: 'blob',
  //       }
  //     )
  //     .then((res: any) => {
  //       if (res.type === 'application/json') {
  //         this.$message.error({
  //           message: this.$t('views.vulnDetail.exportFail') as string,
  //           showClose: true,
  //         })
  //       } else {
  //         const blob = new Blob([res], {
  //           type: 'application/octet-stream',
  //         })
  //         const link = document.createElement('a')
  //         link.href = window.URL.createObjectURL(blob)
  //         link.download = projectName + '.doc'
  //         link.click()
  //         this.$message.success({
  //           message: this.$t('views.vulnDetail.exportSuccess') as string,
  //           showClose: true,
  //         })
  //       }
  //     })
  //     .catch(() => {
  //       this.$message.error({
  //         message: this.$t('views.vulnDetail.exportFail') as string,
  //         showClose: true,
  //       })
  //     })
  // }

  private async recheckVul() {
    const params = {
      ids: this.selectedId.toString(),
    }
    const { status, msg } = await this.services.vuln.vulRecheck(params)
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
    } else {
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
    }
  }
}
</script>

<style>
.el-table .diy-row {
  background: #fff;
  color: #959fb4;
  font-size: 14px;
}
</style>

<style scoped lang="scss">
.go-back-title {
  padding-top: 16px;
  color: #0085ff;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.slider-warp-contract {
  width: calc(100% - 24px);
  margin-left: 23px;
}

.slider-warp-spreadOut {
  width: 100%;
}

.vuln-warp {
  margin-top: 14px;
  min-height: calc(100vh - 104px);
  margin-bottom: 26px;
  background: #fff;
  padding: 0 14px 41px 14px;

  .vuln-title {
    padding-top: 24px;
    padding-bottom: 10px;
    font-size: 16px;
    color: #38435a;
    font-weight: 600;
    border-bottom: 1px solid #e6e9ec;
    align-items: flex-start;
    .btnWarp {
      margin-left: 20px;
      display: flex;
      align-items: center;
      position: relative;
      padding-right: 86px;
      .checkedAllBtn {
        width: 32px;
        height: 32px;
        background: #f2f3f5;
        border-radius: 2px;
        border: none;
        color: #4a72ae;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 8px;
        &:hover {
          color: #1a80f2;
        }
        i {
          line-height: 16px;
        }
      }
    }
  }

  .module-title {
    color: #38435a;
    margin-top: 16px;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    &.link {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &.has-log {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .get-log {
      color: #1a80f2;
      font-size: 14px;
      cursor: pointer;
    }

    .linkNum {
      color: #1a80f2;
      cursor: pointer;
    }
  }

  .infoWarp {
    background: #ffffff;
    border-radius: 4px;
    padding: 16px 0;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    .infoLine {
      margin-top: 16px;
      .project-name {
        color: #4a72ae;
        cursor: pointer;
      }
      &:first-child {
        margin-top: 0;
      }
      .info {
        flex: 1;
        color: #38435a;
        .dot {
          display: inline-block;
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: bottom;
        }
        .label {
          color: #959fb4;
          font-size: 14px;
          i {
            font-size: 14px;
          }
        }
      }
    }
  }

  .vulnDesc {
    color: #38435a;
    font-size: 14px;
    line-height: 22px;
    margin-top: 16px;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding-bottom: 16px;
  }

  .markdownContent {
    height: 246px;
    overflow-y: auto;
    margin-top: 0;
    padding: 6px;
    /* 分隔线 */
    border: 1px solid #e6e9ec;
    border-radius: 2px;
    background: #fff;
    ::v-deeptt {
      color: red !important;
      font-style: normal !important;
    }
    &::-webkit-scrollbar {
      width: 4px;
    }
    background: #fff;
    margin-top: 16px;
    border-radius: 4px;
  }
}

.confirmDel {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}

.cancelDel {
  width: 124px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}

.warning-bar {
  background: rgba(244, 158, 11, 0.1);
  border-radius: 2px;
  color: #f49e0b;
  padding: 8px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vulnUrl {
  color: #1a80f2;
  margin-top: 16px;
  cursor: pointer;
}

.vulnProject {
  display: flex;
}

.pagination-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.log-item {
  display: flex;
  box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
  .log-item-name {
    color: #38435a;
  }
  .log-item-time {
    color: #959fb4;
  }
}
.jump {
  cursor: pointer;
}
</style>

<style lang="scss">
.log-dialog {
  .el-dialog__header {
    background: #fafafa;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 0px 24px 16px 24px;
  }
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    &:hover {
      color: #1a80f2;
    }
  }
}
</style>
