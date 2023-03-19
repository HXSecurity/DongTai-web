<template>
  <main class="container">
    <div class="vuln-warp">
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
          {{ assetVulDetail.vul_name }}
        </div>
        <div class="btnWarp"></div>
      </div>
      <div class="module-title has-log">
        <span>基本信息</span>
      </div>
      <div class="infoWarp">
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> 危害级别： </span>
            <span
              class="dot"
              :style="{
                color: levelColor(getlevel(assetVulDetail.vul_level_id)),
              }"
              >{{ getlevel(assetVulDetail.vul_level_id) }}</span
            >
          </div>
          <div v-dot class="info">
            <span class="label"> 首次出现： </span>
            <span>{{ fmtTime(assetVulDetail.create_time) }}</span>
          </div>
          <div v-dot class="info">
            <span class="label"> 漏洞类型： </span>
            <span>{{ assetVulDetail.vul_type }}</span>
          </div>
          <!-- <div v-dot class="info">
            <span class="label"> 最后出现： </span>
            <span>
              <span>{{ fmtTime(assetVulDetail.latest_time) }}</span>
            </span>
          </div> -->
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> 项目名称： </span>
            <el-tooltip
              effect="light"
              :content="assetVulDetail.project_name"
              placement="top"
            >
              <span>{{ assetVulDetail.project_name }}</span>
            </el-tooltip>
          </div>
          <div v-dot class="info">
            <span class="label"> 项目版本： </span>
            <el-tooltip
              effect="light"
              :content="assetVulDetail.project_version_name"
              placement="top"
            >
              <span>{{ assetVulDetail.project_version_name }}</span>
            </el-tooltip>
          </div>
          <div v-dot class="info">
            <span class="label"> 推送来源： </span>
            <span class="dot">{{ assetVulDetail.dast_tag }}</span>
          </div>
        </div>
        <div class="infoLine flex-row-space-between">
          <div v-dot class="info">
            <span class="label"> payload： </span>
            <el-tooltip
              effect="light"
              :content="assetVulDetail.payload"
              placement="top"
            >
              <span>{{ assetVulDetail.payload }}</span>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="module-title">漏洞描述</div>
      <div class="vulnDesc">
        {{ assetVulDetail.detail }}
      </div>
      <div class="module-title">数据流</div>
      <div
        v-for="(item, index) in assetVulDetail.request_messages"
        :key="index"
        class="dataShow"
      >
        <div class="Options_item_req">请求</div>
        <div class="markdownContent httpRequest">
          <MyMarkdownIt
            :content="getReq(item.request)"
            style="color: #747c8c"
          ></MyMarkdownIt>
        </div>
        <div class="Options_item_req">响应</div>
        <div class="markdownContent httpRequest">
          <MyMarkdownIt
            :content="getReq(item.response)"
            style="color: #747c8c"
          ></MyMarkdownIt>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import VueBase from '@/VueBase'
import request from '@/utils/request'

@Component({
  name: 'VulnDetail',
})
export default class VulnDetail extends VueBase {
  getReq(str: any) {
    return str
      .split('<')
      .join('&lt;')
      .split(`*`)
      .join('\\*')
      .split(`\n`)
      .join('<br/>')
  }
  fmtTime(time: any) {
    console.log('time', time)
    if (time) {
      const data = new Date(time).getTime()
      return formatTimestamp(data)
    }
    return ''
  }
  private settingInte: any = []
  private assetVulDetail: any = {}

  goBack = () => {
    this.$router.go(-1)
    // this.$router.push({
    //   name: 'vulnList',
    // })
  }
  private getlevel(leverid: any) {
    switch (leverid) {
      case 1:
        return '严重'
      case 2:
        return '高危'
      case 3:
        return '中危'
      case 4:
        return '低危'
      case 5:
        return '提示'
    }
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
  }
  async getAssetVulDetail() {
    const res = await this.services.vuln.getScanDetail(this.selectedId)
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.assetVulDetail = res.data
  }

  async created() {
    this.init()
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
  .Options_item_req {
    margin-top: 16px;
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
    height: 286px;
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
