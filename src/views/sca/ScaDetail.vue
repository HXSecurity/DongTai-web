<template>
  <main class="container">
    <div
      class="vuln-warp"
      :class="
        sliderWarpContract ? 'slider-warp-contract' : 'slider-warp-spreadOut'
      "
    >
      <div class="go-back-title">
        <span @click="goBack">
          <i class="el-icon-arrow-left"></i> 返回列表
        </span>
      </div>
      <div class="vuln-title flex-row-space-between">
        <div
          style="
            flex: 1;
            max-width: 800px;
            word-break: break-all;
            line-height: 32px;
          "
        >
          {{ assetVulDetail.base_info && assetVulDetail.base_info.vul_title }}
        </div>
        <div class="btnWarp">
          <!-- <el-select
            v-model="assetVulDetail.base_info.status"
            size="small"
            placeholder="状态变更"
            style="width: 104px"
            clearable
            @change="changeStatus"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="漏洞验证"
            placement="top"
          >
            <div class="checkedAllBtn" @click="recheckVul('project')">
              <i class="icon iconfont">&#xe6b5;</i>
            </div>
          </el-tooltip> -->
          <Sync
            :item="syncInfo"
            :setting-inte="settingInte"
            :get-table-data="init"
            :source_type="2"
          ></Sync>
        </div>
      </div>
      <template v-if="assetVulDetail.base_info">
        <div class="module-title has-log">
          <span>基本信息</span>
          <span class="get-log" @click="vullogBtn">查看日志</span>
        </div>
        <div class="infoWarp">
          <div class="infoLine flex-row-space-between">
            <div v-dot class="info">
              <span class="label"> 危害级别： </span>
              <span
                class="dot"
                :style="{ color: levelColor(assetVulDetail.base_info.level) }"
                >{{ assetVulDetail.base_info.level }}</span
              >
            </div>
            <div v-dot class="info">
              <span class="label"> 首次出现： </span>
              <span>{{ fmtTime(assetVulDetail.base_info.first_time) }}</span>
            </div>
            <div v-dot class="info">
              <span class="label"> 最新活跃： </span>
              <span>
                <span>{{ fmtTime(assetVulDetail.base_info.last_time) }}</span>
              </span>
            </div>
          </div>
          <div class="infoLine flex-row-space-between">
            <div v-dot class="info">
              <span class="label"> 漏洞类型： </span>
              <span>{{
                assetVulDetail.base_info && assetVulDetail.base_info.vul_type
              }}</span>
            </div>
            <div v-dot class="info">
              <span class="label"> 编号： </span>
              <span v-for="(i, key) in CVENUMBERS" :key="'cve' + key">
                <span v-if="i.label" class="jump" @click="openWindow(i.link)"
                  >{{ i.label }} </span
                >{{ key != CVENUMBERS.length - 1 && i.label ? '|' : '' }}
              </span>
            </div>
            <div v-dot class="info">
              <span class="label"> 可利用性： </span>
              <span
                >{{
                  assetVulDetail.base_info.have_article === 1
                    ? '存在分析文章'
                    : ''
                }}
                {{
                  assetVulDetail.base_info.have_poc === 1
                    ? '存在可利用代码'
                    : ''
                }}
                {{
                  assetVulDetail.base_info.have_poc !== 1 &&
                  assetVulDetail.base_info.have_article !== 1
                    ? '不存在可利用代码'
                    : ''
                }}
              </span>
            </div>
          </div>
          <div class="infoLine flex-row-space-between">
            <div v-dot class="info">
              <span class="label"> 项目名称： </span>
              <el-tooltip
                effect="light"
                :content="
                  assetVulDetail.base_info.project_names &&
                  assetVulDetail.base_info.project_names.join(' | ')
                "
                placement="top"
              >
                <span>{{
                  assetVulDetail.base_info.project_names &&
                  assetVulDetail.base_info.project_names.join(' | ')
                }}</span>
              </el-tooltip>
            </div>
            <div v-dot class="info">
              <span class="label"> 语言： </span>
              <span class="dot">{{ assetVulDetail.base_info.language }}</span>
            </div>
          </div>
        </div>
        <div class="module-title">漏洞描述</div>
        <div class="vulnDesc">
          {{ assetVulDetail.base_info && assetVulDetail.base_info.vul_detail }}
        </div>

        <div
          v-for="(poc, index) in assetVulDetail.poc_info &&
          assetVulDetail.poc_info.poc_list"
          :key="index"
        >
          <div class="module-title">{{ poc.title }}</div>
          <div class="markdownContent httpRequest">
            <MyMarkdownIt
              :content="poc.poc_content"
              style="color: #747c8c"
            ></MyMarkdownIt>
          </div>
        </div>

        <div class="module-title">参考及分析文章</div>
        <div class="vulnDesc">
          <div
            v-for="i in assetVulDetail.poc_info &&
            assetVulDetail.poc_info.reference_link"
            :key="i.url"
            class="vulnUrl"
            @click="openUrl(i.url)"
          >
            {{ i.url }}
          </div>
        </div>
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
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import request from '@/utils/request'
import qs from 'qs'
import Sync from '../vuln/components/sync.vue'

@Component({
  name: 'VulnDetail',
  components: {
    Sync,
  },
})
export default class VulnDetail extends VueBase {
  private sliderWarpContract = false
  private deleteDialogOpen = false
  private logDialogOpen = false
  fmtTime(time: any) {
    if (time) {
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

  goBack = () => {
    this.$router.push({
      name: 'vulnList',
    })
  }

  private levelColor(level: any) {
    switch (level) {
      case '严重':
        return '#E56363'
      case '高危':
        return '#F49E0B'
      case '中危':
        return '#2F90EA'
      case '低危':
        return '#ABB2C0'
      case '提示':
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

  private syncInfo: any = {}
  private aggr_id: any = 0
  async init() {
    this.aggr_id = parseInt(this.$route.params.page)
    this.selectedId = parseInt(this.$route.params.id)
    await this.getAssetVulDetail()
    this.syncInfo = {
      source_type: 2,
      id: this.aggr_id,
      create_time: this.assetVulDetail.base_info.first_time,
      // last_time: this.assetVulDetail.base_info.last_time,
      type_name: this.assetVulDetail.base_info.vul_type,
      package_language: this.assetVulDetail.base_info.language,
      vul_number:
        (this.assetVulDetail.base_info.cnnvd
          ? this.assetVulDetail.base_info.cnnvd + ' | '
          : '') +
        (this.assetVulDetail.base_info.cnvd
          ? this.assetVulDetail.base_info.cnvd + ' | '
          : '') +
        (this.assetVulDetail.base_info.cve
          ? this.assetVulDetail.base_info.cve + ' | '
          : '') +
        (this.assetVulDetail.base_info.cwe
          ? this.assetVulDetail.base_info.cwe + ' | '
          : ''),
      level_id: this.assetVulDetail.base_info.level,
      vul_name: this.assetVulDetail.base_info.vul_title,
      pro_info: this.assetVulDetail.base_info.project_names,
    }
  }

  async getAssetVulDetail() {
    const res = await this.services.sca.assetVulDetail({
      aggr_id: this.aggr_id, //组件列表id
      vul_package_id: this.selectedId, //组件漏洞id
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

  // private async changeStatus(val: any) {
  //   const res = await this.services.vuln.changeStatus({
  //     id: this.selectedId,
  //     status_id: val,
  //   })
  //   if (res.status === 201) {
  //     this.$message({
  //       type: 'success',
  //       message: res.msg,
  //       showClose: true,
  //     })
  //   } else {
  //     this.$message({
  //       type: 'error',
  //       message: res.msg,
  //       showClose: true,
  //     })
  //   }
  // }

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
  width: 1200px;
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
          width: 300px;
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
