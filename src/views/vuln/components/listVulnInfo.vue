<template>
  <div class="list-vuln-info">
    <div class="top-card">
      <div class="item">
        <span class="label">服务器 IP</span>
        <span class="value">{{ vuln.server_ip }}</span>
      </div>
      <div class="item">
        <span class="label">客户端 IP</span>
        <span class="value">{{ vuln.client_ip }}</span>
      </div>
      <div class="item">
        <span class="label">中 间 件</span>
        <span class="value">{{ vuln.middreware }}</span>
      </div>
      <div class="item">
        <span class="label">语 言</span>
        <span class="value">{{ vuln.language }}</span>
      </div>
      <div class="item">
        <span class="label">项目名称</span>
        <span class="value">{{ vuln.project_name }}</span>
      </div>
      <div class="item">
        <span class="label">项目版本</span>
        <span class="value">{{ vuln.project_version }}</span>
      </div>
      <div class="item">
        <span class="label">攻击参数</span>
        <span class="value">{{
          (vuln.param_name && Object.values(vuln.param_name).join(',')) || '无'
        }}</span>
      </div>
      <div class="item">
        <span class="label">攻击向量</span>
        <span class="value">{{ vuln.taint_value }}</span>
      </div>
      <div class="item" style="width: 450px">
        <span class="label">Agent</span>
        <span class="value" style="width: 305px">{{ vuln.agent_name }}</span>
      </div>
    </div>
    <div
      v-if="vuln.graph && vuln.graph.length"
      class="flow"
      :style="`border-color:${levelColor(vuln.level_type)}`"
    >
      <div
        class="title"
        :style="`background-color:${bgColor(vuln.level_type)}`"
      >
        <span class="icon iconfont iconwudianliu"></span>
        <span class="label">污点流图</span>
        <span class="tag">
          <span
            class="w-dot"
            :style="`border-color:${typeColor('Source method')}`"
          ></span>
          污点来源
        </span>
        <span class="tag">
          <span
            class="w-dot"
            :style="`border-color:${typeColor('Propagation method')}`"
          ></span>
          传播方法
        </span>
        <span class="tag">
          <span
            class="w-dot"
            :style="`border-color:${typeColor('Hazardous method')}`"
          ></span>
          危险方法
        </span>
      </div>
      <div class="info">
        <div
          v-for="(item, index) in vuln.graph"
          :key="index"
          class="info-item"
          :class="index === vuln.graph.length - 1 ? 'no-border' : ''"
        >
          <span
            class="w-dot"
            :style="`border-color:${typeColor(item.type)}`"
          ></span>
          <span class="info-item-top-line"></span>
          <span class="info-item-bottom-line"></span>
          <div class="method">
            {{ item.node }}
          </div>
          <div class="params"><div v-dompurify-html="item.code"></div></div>
          <div class="tag-box">
            <div class="tag-list">
              <div v-if="item.tag" class="tag">{{ item.tag }}</div>
              <el-tooltip
                class="item"
                effect="light"
                :disabled="item.file.length < 30"
                :content="item.file"
                placement="top"
              >
                <div class="file">file: {{ item.file }}</div>
              </el-tooltip>
              <div class="line">line:{{ item.line_number }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { formatTimestamp } from '@/utils/utils'

@Component({
  name: 'ListVulnInfo',
})
export default class Index extends VueBase {
  @Prop() vuln!: any
  private formatTimestamp(timestamp: number) {
    return formatTimestamp(timestamp)
  }

  private typeColor(type: string) {
    switch (type) {
      case 'Source method':
        return '#1a80f2'
      case '污点来源方法':
        return '#1a80f2'
      case 'Propagation method':
        return '#ff9657'
      case '传播方法':
        return '#ff9657'
      case 'Hazardous method':
        return '#f56262'
      case '危险方法':
        return '#f56262'
      default:
        return '#000'
    }
  }

  private hasNode(tree: any) {
    return (
      tree.vul_level_high ||
      tree.vul_level_info ||
      tree.vul_level_low ||
      tree.vul_level_medium ||
      tree.vul_level_note
    )
  }

  private nodeColor(tree: any) {
    if (tree.vul_level_high) return '#E56363'
    if (tree.vul_level_medium) return '#F49E0B'
    if (tree.vul_level_low) return '#2F90EA'
    if (tree.vul_level_note) return '#ABB2C0'
    if (tree.vul_level_info) return '#DBDBDB'
  }

  private levelColor(level: any) {
    switch (level) {
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

  private linkColor(level: any) {
    switch (level) {
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

  private bgColor(level_type: number) {
    switch (level_type) {
      case 1:
        return 'rgba(229, 99, 99, 0.1)'
      case 2:
        return 'rgba(244, 158, 11, 0.1)'
      case 3:
        return 'rgba(47, 144, 234, 0.1)'
      case 4:
        return 'rgba(172, 180, 196, 0.1)'
      case 5:
        return 'rgba(219, 219, 219, 0.1)'
    }
  }
}
</script>

<style scoped lang="scss">
.list-vuln-info {
  margin-left: 12px;
  padding: 8px 16px 16px 16px;
  .top-card {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 25%;
      display: flex;
      margin-top: 8px;
      .label {
        font-size: 12px;
        color: #acb4c4;
        width: 62px;
        display: inline-block;
        text-align: justify;
        text-align-last: justify;
        margin-right: 8px;
        margin-left: 8px;
      }
      .value {
        display: inline-block;
        width: 161px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        color: #38435a;
        font-size: 12px;
      }
    }
  }
  .flow {
    margin-top: 12px;
    border-radius: 4px;
    border: 1px solid #e56363;
    .title {
      padding: 8px;
      background: rgba(229, 99, 99, 0.1);
      font-weight: 500;
      font-size: 12px;
      color: #38435a;
      display: flex;
      align-items: center;
      .iconwudianliu {
        margin-top: -4px;
        height: 14px;
        font-size: 12px;
        margin-right: 6px;
      }
      .label {
        margin-right: 30px;
      }
      .tag {
        display: inline-flex;
        align-items: center;
        margin-right: 16px;
        margin-left: 2px;
        .w-dot {
          margin-right: 2px;
        }
      }
    }

    .w-dot {
      display: inline-block;
      box-sizing: border-box;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: 2px solid #1a80f2;
      background: #fff;
    }

    .info {
      padding: 12px 16px;
      .info-item {
        display: flex;
        padding-left: 20px;
        border-left: 1px solid #b6bbc5;
        position: relative;
        margin-top: 10px;
        .method {
          width: 340px;
          word-break: break-all;
          margin-right: 20px;
          font-size: 12px;
          padding-top: 2px;
        }
        .params {
          width: 520px;
          word-break: break-all;
          margin-right: 20px;
          font-size: 12px;
          padding-top: 2px;
        }
        .tag-box {
          display: flex;
          justify-content: flex-end;
          flex: 1;
        }
        .info-item-top-line {
          display: inline-block;
          width: 1px;
          height: 8px;
          background: #fff;
          position: absolute;
          left: -1px;
        }
        .info-item-bottom-line {
          display: inline-block;
          width: 1px;
          height: 8px;
          background: #fff;
          position: absolute;
          left: -1px;
          top: 14px;
        }
        .w-dot {
          position: absolute;
          left: -4px;
          top: 8px;
        }
        &.no-border {
          border-left: 1px solid #fff;
          .info-item-top-line {
            background: #b6bbc5;
            height: 6px;
            top: -10px;
            left: -1.1px;
            width: 1px;
          }
        }

        .tag-list {
          display: flex;
          margin-top: 12px;
          width: 250px;
          div + div {
            margin-left: 8px;
          }
          .tag {
            display: inline-flex;
            align-items: center;
            background: rgba(88, 142, 225, 0.1);
            border-radius: 2px;
            color: #588ee1;
            padding: 2px 6px;
            font-size: 12px;
            line-height: 14px;
            height: 24px;
          }
          .file {
            color: #45b4a0;
            background: rgba(69, 180, 160, 0.1);
            border-radius: 2px;
            padding: 0 6px;
            font-size: 12px;
            line-height: 14px;
            max-width: 160px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-flex;
            align-items: center;
            height: 24px;
          }
          .line {
            color: #e18c58;
            background: rgba(225, 140, 88, 0.1);
            border-radius: 2px;
            padding: 0 6px;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            line-height: 14px;
            height: 24px;
          }
        }
      }
    }
  }
}
::v-deepem {
  color: red !important;
}
</style>
