<template>
  <div class="search-card">
    <div class="title">
      <span
        class="title-url pointer"
        @click="$router.push(`/taint/poolDetail/${info.method_pools.id}`)"
      >
        <div
          v-if="info.method_pools.url_highlight"
          v-dompurify-html="info.method_pools.url_highlight"
        ></div>
        <div v-else>{{ info.method_pools.url }}</div>
      </span>
      <span class="el-icon-link icon"> </span>
      <span class="el-icon-document-copy icon"> </span>
    </div>
    <div class="summary">
      <div class="summary-item">
        <div class="label"><i class="iconfont icontanzhen"></i> 探针：</div>
        <div class="info">
          <div class="dot green"></div>
          {{ info.relations.agent_name }}
        </div>
      </div>
      <div class="summary-item">
        <div class="label"><i class="iconfont iconyonghu"></i> 用户：</div>
        <div class="info">{{ info.relations.user_name }}</div>
      </div>
      <div v-if="info.relations.project_name" class="summary-item">
        <div class="label"><i class="iconfont iconxiangmu"></i> 项目：</div>
        <div
          class="info"
          :class="info.relations.project_name && 'pointer blue'"
          @click="goProject(info.relations.project_id)"
        >
          {{ info.relations.project_name || '未绑定' }}
        </div>
      </div>
      <div v-if="info.relations.vulnerablities[0]" class="summary-item">
        <div class="label">
          <i class="iconfont iconloudong1"></i> 关联漏洞：
        </div>
        <div
          class="info"
          :class="info.relations.vulnerablities[0] && 'pointer'"
          @click="toVuln(info.relations.vulnerablities[0].vulnerablity_id)"
        >
          <div class="dot red"></div>
          {{
            info.relations.vulnerablities[0]
              ? info.relations.vulnerablities[0].vulnerablity_type
              : '无'
          }}

          <el-popover
            v-if="info.vulnerablities_count.count > 1"
            placement="bottom"
            trigger="hover"
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
              {{ item.vulnerablity_type }}
            </div>
            <span slot="reference" class="blue" style="margin-left: 6px"
              >+{{ info.vulnerablities_count.count - 1 }}</span
            >
          </el-popover>
        </div>
      </div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeKey" @tab-click="changeActiveKey">
        <el-tab-pane label="HTTP数据包" name="first"></el-tab-pane>
        <el-tab-pane
          v-if="showGraph !== false"
          label="方法调用链"
          name="second"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="activeKey === 'first'" class="info">
      <div class="info-box">
        <MyMarkdownIt :content="req" style="color: #747c8c"></MyMarkdownIt>
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
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { GraphData } from '@/views/taint/types/search'
import Dagre from '@/components/G6/Dagre.vue'
@Component({ name: 'SearchCard', components: { Dagre } })
export default class SearchCard extends VueBase {
  @Prop() info!: any
  @Prop() showGraph: boolean | undefined
  get req() {
    return (
      this.info.method_pools.req_header_fs +
      '<br/>' +
      this.info.method_pools.req_data
    )
  }

  get res() {
    return (
      this.info.method_pools.res_header +
      '<br/>' +
      this.info.method_pools.res_body
    )
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
  private async getMethodPool() {
    const res = await this.services.taint.graph({
      method_pool_id: this.info.method_pools.id,
      method_pool_type: 'normal',
    })
    this.graphData = res.data
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
}
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
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
      }
    }
  }
  .tabs {
    padding: 0 20px;
    border-bottom: 1px solid #c8e0ff;
    /deep/.el-tabs__nav-wrap::after {
      background-color: #fff;
    }
    /deep/.el-tabs__header {
      margin: 0 0 1px;
    }
    /deep/.el-tabs__item.is-active {
      color: #1a80f2;
    }
    /deep/.el-tabs__active-bar {
      color: #1a80f2;
    }
    /deep/.el-tabs__item {
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
      & + .info-box {
        border-left: 1px solid #c8e0ff;
      }
    }
  }
}
.blue {
  color: #1a80f2 !important;
}
.vulnerablitie-item {
  &:hover {
    color: #1a80f2;
  }
  cursor: pointer;
  width: 90px;
  text-align: center;
  padding: 6px 6px;
}
</style>
<style>
.el-popover {
  min-width: 60px;
}
</style>
