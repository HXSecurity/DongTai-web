<template>
  <div class="search-card">
    <div class="title">
      <span
        :title="info.method_pools.url"
        class="title-url pointer"
        @click="$router.push(`/taint/poolDetail/${info.method_pools.id}`)"
      >
        <div
          v-if="info.method_pools.url_highlight"
          v-dompurify-html="
            info.method_pools.url_highlight
              .replace(new RegExp('\<em\>', 'gi'), '\<tt\>')
              .replace(new RegExp('\<\/em\>', 'gi'), '\</tt\>')
          "
        ></div>
        <div v-else>{{ info.method_pools.url }}</div>
      </span>
      <span
        v-if="!isApi"
        class="el-icon-link icon"
        @click="goPath(info.method_pools.url)"
      >
      </span>
      <el-tooltip
        class="item"
        effect="dark"
        :content="$t('views.search.copy')"
        placement="top"
      >
        <span
          v-clipboard:error="onError"
          v-clipboard:copy="info.method_pools.url"
          v-clipboard:success="onCopy"
          class="el-icon-document-copy icon"
        >
        </span>
      </el-tooltip>
      <div style="flex: 1; text-align: right; min-width: 140px">
        {{ formatTimestamp(info.method_pools.update_time) }}
      </div>
      <el-button
        v-if="showGraph === false || isApi"
        class="card-btn"
        :loading="buttonLoading"
        @click="send"
        >{{
          buttonLoading ? $t('views.search.sending') : $t('views.search.send')
        }}</el-button
      >
    </div>
    <div v-if="!isApi" class="summary">
      <div class="summary-item">
        <div class="label">
          <i class="iconfont icontanzhen"></i> {{ $t('views.search.agent') }}：
        </div>
        <div class="info">
          <el-tooltip
            class="item"
            effect="light"
            :content="
              info.relations.agent_is_running
                ? $t('views.search.running')
                : $t('views.search.stop')
            "
            placement="top"
          >
            <div
              class="dot"
              :class="info.relations.agent_is_running ? 'green' : 'red'"
            ></div>
          </el-tooltip>
          <span style="width: 320px" :title="info.relations.agent_name">
            {{ info.relations.agent_name }}
          </span>
        </div>
      </div>
      <div class="summary-item">
        <div class="label">
          <i class="iconfont iconyonghu"></i> {{ $t('views.search.user') }}：
        </div>
        <div class="info">
          <span style="width: 60px" :title="info.relations.agent_name">{{
            info.relations.user_name
          }}</span>
        </div>
      </div>
      <div v-if="info.relations.project_name" class="summary-item">
        <div class="label">
          <i class="iconfont iconxiangmu"></i>
          {{ $t('views.search.project') }}：
        </div>
        <div
          class="info"
          :class="info.relations.project_name && 'pointer blue'"
          @click="goProject(info.relations.project_id)"
        >
          <span style="width: 100px" :title="info.relations.project_name">
            {{
              info.relations.project_name || $t('views.search.no_project_name')
            }}
          </span>
        </div>
      </div>
      <div v-if="info.relations.vulnerablities[0]" class="summary-item">
        <div class="label">
          <i class="iconfont iconloudong1"></i>
          {{ $t('views.search.assignVuln') }}：
        </div>
        <div
          class="info"
          :class="info.relations.vulnerablities[0] && 'pointer'"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="
              levelClass(info.relations.vulnerablities[0].level_id).title
            "
            placement="top"
          >
            <div
              class="dot"
              :class="
                levelClass(info.relations.vulnerablities[0].level_id).level
              "
            ></div>
          </el-tooltip>
          <span
            :title="info.relations.vulnerablities[0].vulnerablity_type"
            style="max-width: 100px"
            @click="toVuln(info.relations.vulnerablities[0].vulnerablity_id)"
          >
            {{
              info.relations.vulnerablities[0]
                ? info.relations.vulnerablities[0].vulnerablity_type
                : $t('views.search.no')
            }}
          </span>
          <el-popover
            v-if="info.vulnerablities_count.count > 1"
            placement="bottom"
            trigger="click"
            :visible-arrow="false"
            :offset="-40"
          >
            <div
              v-for="item in info.relations.vulnerablities.slice(
                1,
                info.relations.vulnerablities.length
              )"
              :key="item.vulnerablity_id"
              class="vulnerablitie-item"
              @click="toVuln(item.vulnerablity_id)"
            >
              <el-tooltip
                class="item"
                effect="light"
                :content="levelClass(item.level_id).title"
                placement="top"
              >
                <div class="dot" :class="levelClass(item.level_id).level"></div>
              </el-tooltip>
              {{ item.vulnerablity_type }}
            </div>
            <span
              slot="reference"
              class="blue"
              style="margin-left: 6px; font-size: 12px; margin-top: 6px"
              >+{{ info.vulnerablities_count.count - 1 }}</span
            >
          </el-popover>
        </div>
      </div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeKey" @tab-click="changeActiveKey">
        <el-tab-pane
          :label="$t('views.search.http')"
          name="first"
        ></el-tab-pane>
        <el-tab-pane
          v-if="showGraph !== false"
          :label="$t('views.search.graph')"
          name="second"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div
      v-if="activeKey === 'first'"
      class="info"
      :style="{
        height: isApi && '323px',
      }"
    >
      <div class="info-box">
        <MyMarkdownIt
          v-if="!isEdit"
          :content="req"
          style="color: #747c8c"
        ></MyMarkdownIt>
        <div v-else>
          <el-input v-model="reqStr" type="textarea" autosize> </el-input>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('views.search.copy')"
          placement="top"
        >
          <span
            v-if="showGraph !== false && !isApi"
            v-clipboard:error="onError"
            v-clipboard:copy="reqStr"
            v-clipboard:success="onCopy"
            class="el-icon-document-copy copy-icon"
          ></span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('views.search.edit')"
          placement="top"
        >
          <span
            v-if="showGraph === false || isApi"
            class="el-icon-edit copy-icon"
            @click="isEdit = !isEdit"
          ></span>
        </el-tooltip>
      </div>
      <div class="info-box">
        <MyMarkdownIt :content="res" style="color: #747c8c"></MyMarkdownIt>
      </div>
    </div>
    <div v-if="activeKey === 'second'" class="func">
      <Dagre
        v-if="activeKey === 'second' && graphData.nodes[0]"
        :pool-id="info.method_pools.id"
        :init-data="graphData"
      ></Dagre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { GraphData } from '@/views/taint/types/search'
import Dagre from '@/components/G6/Dagre.vue'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'SearchCard', components: { Dagre } })
export default class SearchCard extends VueBase {
  @Prop() info!: any
  @Prop() showGraph: boolean | undefined
  @Prop() isApi: boolean | undefined
  formatTimestamp(time: number) {
    if (time) {
      return formatTimestamp(time)
    } else {
      return ''
    }
  }
  private isEdit = false
  private reqStr = ''
  private resStr = ''
  private buttonLoading = false
  created() {
    this.reqStr =
      (this.info.method_pools.req_header_fs_highlight ||
        this.info.method_pools.req_header_fs ||
        '') +
      '\n\n' +
      (this.info.method_pools.req_data_highlight ||
        this.info.method_pools.req_data ||
        '')

    this.resStr =
      (this.info.method_pools.res_header_highlight ||
        this.info.method_pools.res_header ||
        '') +
      '\n\n' +
      (this.info.method_pools.res_body_highlight ||
        this.info.method_pools.res_body ||
        '')
  }
  get req() {
    return this.reqStr
      .split(`\n`)
      .join('<br/>')
      .split(`*`)
      .join('\\*')
      .replace(new RegExp('\<em\>', 'gi'), '\<tt\>')
      .replace(new RegExp('\<\/em\>', 'gi'), '\</tt\>')
  }

  private levelClass(i: number) {
    const levelArr = ['important', 'height', 'middle', 'low']
    const titleArr = [
      this.$t('views.search.important'),
      this.$t('views.search.height'),
      this.$t('views.search.middle'),
      this.$t('views.search.low'),
    ]
    return { level: levelArr[i - 1], title: titleArr[i - 1] }
  }

  private onCopy() {
    this.$message({
      showClose: true,
      message: this.$t('views.search.copySuccess') as string,
      type: 'success',
    })
  }

  private onError() {
    this.$message({
      showClose: true,
      message: this.$t('views.search.copyFail') as string,
      type: 'error',
    })
  }

  get res() {
    return this.resStr
      .split(`\n`)
      .join('<br/>')
      .split(`*`)
      .join('\\*')
      .replace(new RegExp('\<em\>', 'gi'), '\<tt\>')
      .replace(new RegExp('\<\/em\>', 'gi'), '\</tt\>')
  }

  get copyRes() {
    return this.info.method_pools.res_header + this.info.method_pools.res_body
  }

  private goProject(id: any) {
    if (id) {
      this.$router.push('/project/projectDetail/' + id)
    }
  }
  private toVuln(id: any) {
    if (id) {
      this.$router.push('/vuln/vulnDetail/1/' + id)
    }
  }
  private async getMethodPool(
    isReplay?: boolean,
    replay_id?: number,
    method_pool_replay_id?: number
  ) {
    const res = await this.services.taint.graph({
      replay_id: this.isApi ? replay_id : undefined,
      replay_type: this.isApi ? 3 : undefined,
      method_pool_replay_id: this.isApi ? method_pool_replay_id : undefined,
      method_pool_id: this.info.method_pools.id,
      method_pool_type: isReplay ? 'replay' : 'normal',
    })
    if (res.status === 201) {
      this.graphData = res.data
    }
  }
  private activeKey = 'first'
  private graphData: GraphData = {
    nodes: [],
    edges: [],
  }
  private changeActiveKey(e: any) {
    if (e.name === 'second' && !this.graphData.nodes[0]) {
      this.getMethodPool()
    }
  }
  private goPath(url: any) {
    window.open(url)
  }

  private timer: any

  @Watch('$route', { deep: true })
  onRouteChange() {
    clearInterval(this.timer)
  }

  beforeDestroy() {
    clearInterval(this.timer)
  }

  private async send() {
    const str = this.reqStr.replaceAll('&lt;', '<')
    this.loadingStart()
    const res = await this.services.taint.replay({
      methodPoolId: this.isApi
        ? this.info.method_pools.id
        : this.$route.params.id,
      agent_id:
        this.info.method_pools.id > -1 ? undefined : this.info.relations.agent,
      replayRequest: str,
      replay_type: this.isApi ? 3 : undefined,
    })
    this.loadingDone()
    if (res.status !== 201) {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
      return
    }
    this.buttonLoading = true
    this.timer = setInterval(async () => {
      if (this.isApi) {
        res.data.replay_type = 3
      }
      const resT = await this.services.taint.getReplay(res.data)
      if (resT.status === 201) {
        this.resStr = resT.data.response
        this.graphData = {
          nodes: [],
          edges: [],
        }
        this.$nextTick(async () => {
          await this.getMethodPool(
            true,
            res.data.replayId,
            resT.data.method_pool_replay_id
          )
          this.info.method_pools.id = resT.data.method_pool_replay_id
          this.$forceUpdate()
        })
        clearInterval(this.timer)
        this.buttonLoading = false
      } else if (resT.status === 203) {
        clearInterval(this.timer)
        this.buttonLoading = false
      }
    }, 5000)
  }
}
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.title-url {
  max-width: 800px;
  word-break: break-all;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.search-card {
  width: 100%;
  height: 418px;
  border: 1px solid #c8e0ff;
  border-radius: 2px;
  .title {
    background: #f1f8ff;
    border-bottom: 1px solid #c8e0ff;
    padding: 0 16px;
    box-sizing: border-box;
    height: 50px;
    display: flex;
    align-items: center;
    .icon {
      margin-left: 12px;
      color: #1a80f2;
      cursor: pointer;
    }
  }
  .summary {
    display: flex;
    height: 34px;
    border-bottom: 1px solid #c8e0ff;
    padding: 0 16px;
    .summary-item {
      padding: 0 30px 0 4px;
      display: flex;
      align-items: center;
      .label {
        color: #959fb4;
      }
      .info {
        color: #38435a;
        display: flex;
        align-items: center;
        height: auto;
        span {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .red {
          background: #f56262;
        }
        .green {
          background: #37d7bb;
        }
        .low {
          background: #37d7bb;
        }
        .middle {
          background: #3892f8;
        }
        .height {
          background: #ff9657;
        }
        .important {
          background: #f56262;
        }
      }
    }
  }
  .tabs {
    padding: 0 20px;
    border-bottom: 1px solid #c8e0ff;
    ::v-deep.el-tabs__nav-wrap::after {
      background-color: #fff;
    }
    ::v-deep.el-tabs__header {
      margin: 0 0 1px;
    }
    ::v-deep.el-tabs__item.is-active {
      color: #1a80f2;
    }
    ::v-deep.el-tabs__active-bar {
      color: #1a80f2;
    }
    ::v-deep.el-tabs__item {
      color: #38435a;
    }
  }
  .info {
    display: flex;
    height: 292px;
    .info-box {
      overflow-y: auto;
      word-wrap: break-word;
      word-break: break-all;
      height: 100%;
      padding: 20px;
      width: 50%;
      font-size: 14px;
      line-height: 20px;
      color: #959fb4;
      position: relative;
      & + .info-box {
        border-left: 1px solid #c8e0ff;
      }
      .copy-icon {
        cursor: pointer;
        position: absolute;
        top: 32px;
        right: 18px;
        color: #1a80f2;
      }
    }
  }
}
.blue {
  color: #1a80f2 !important;
}
.vulnerablitie-item {
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: #1a80f2;
  }
  cursor: pointer;
  width: 90px;
  text-align: center;
  padding: 6px 6px;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .red {
    background: #f56262;
  }
  .green {
    background: #37d7bb;
  }
  .low {
    background: #37d7bb;
  }
  .middle {
    background: #3892f8;
  }
  .height {
    background: #ff9657;
  }
  .important {
    background: #f56262;
  }
}
::v-deeptt {
  color: red !important;
}
.card-btn {
  background: #4a72ae;
  border-radius: 2px;
  min-width: 76px;
  height: 32px;
  font-size: 14px;
  display: flex;
  padding-top: 0;
  padding-bottom: 0;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
::v-deep.el-textarea__inner {
  border: none;
  resize: none;
}
</style>
<style>
.el-popover {
  min-width: 60px;
}
</style>
