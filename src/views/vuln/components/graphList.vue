<template>
  <div class="graphList">
    <div
      v-for="(vItem, vIndex) in tree"
      :key="vIndex"
      class="v-box"
      :class="[
        vIndex === tree.length - 1 ? 'last-no-border' : '',
        tree.length === 1 ? 'only-one' : '',
      ]"
    >
      <div class="v-title-line"></div>
      <div class="v-title-top-line"></div>
      <div class="v-title-bottom-line"></div>
      <div class="v-title" @click="vItem.open = !vItem.open">
        <div
          class="v-title-before"
          :style="{ background: levelColor(vItem.tag) }"
        ></div>
        <div
          class="v-title-dot"
          :style="{ background: levelColor(vItem.tag) }"
        ></div>
        <div class="left">{{ levelLabel(vItem.tag) }}</div>
        <div class="center">
          <div class="center-left">
            <div>{{ vItem.callerMethod }}</div>
            <div>{{ vItem.callerClass + ':' + vItem.callerLineNumber }}</div>
          </div>
          <div class="center-right">
            <span
              v-dompurify-html="
                vItem.type === '危险方法'
                  ? vItem.sourceValues
                  : vItem.targetValues
              "
            >
            </span>
          </div>
        </div>
        <i class="icon iconfont rightFont" :class="vItem.open ? 'active' : ''"
          >&#xe69c;</i
        >
      </div>
      <div v-if="vItem.open" class="info-card">
        <div class="info-card-title">{{ levelLabel(vItem.tag) }}</div>
        <div class="info-card-item">
          <div class="info-card-item-label">方法</div>
          <div class="info-card-item-value">{{ vItem.methodName }}</div>
        </div>
        <div class="info-card-item">
          <div class="info-card-item-label">对象</div>
          <div class="info-card-item-value">{{ vItem.className }}</div>
        </div>
        <div class="info-card-item">
          <div class="info-card-item-label">污点输入</div>
          <div class="info-card-item-value">{{ vItem.ori_sourceValues }}</div>
        </div>
        <div class="info-card-item">
          <div class="info-card-item-label">污点输出</div>
          <div class="info-card-item-value">{{ vItem.ori_targetValues }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import qs from 'qs'
import { formatTimestamp } from '@/utils/utils'
import ListVulnInfo from './listVulnInfo.vue'

@Component({
  name: 'LinkList',
  components: {
    LinkList,
    ListVulnInfo,
  },
})
export default class LinkList extends VueBase {
  @Prop() tree: any
  created() {
    this.tree.forEach((element: any) => {
      this.$set(element, 'open', false)
    })
  }
  private levelColor(level: any) {
    switch (level) {
      case 'sink':
        return '#E56363'
      case 'source':
        return '#F49E0B'
      case 'propagator':
        return '#DBDBDB'
    }
  }

  private levelLabel(level: any) {
    switch (level) {
      case 'sink':
        return '危险函数执行'
      case 'source':
        return '外部参数传入'
      case 'propagator':
        return '数据调用传播'
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
.graphList {
  .v-title {
    padding: 8px 16px;
    margin-left: 12px;
    color: #38435a;
    position: relative;
    cursor: pointer;
    display: flex;
    min-height: 82px;
    align-items: center;
    border: 1px solid #e6e9ec;
    border-radius: 2px;
    .left {
      padding-left: 16px;
      width: 346px;
    }
    .center {
      display: flex;
      padding-left: 16px;
      width: 692px;
      height: 100%;
      .center-left {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        div {
          padding: 0 20px;
          width: 346px;
          word-break: break-all;
        }
      }
      .center-right {
        padding: 0 20px;
        width: 346px;
        align-items: center;
        display: flex;
        span {
          display: inline-block;
          width: 340px;
          word-break: break-all;
        }
      }
    }
    &:hover {
      .v-title-tag {
        visibility: visible !important;
      }
    }
    .v-title-tag {
      visibility: hidden;
      background: rgba(255, 255, 255, 0);
      color: #1a80f2;
      padding: 2px 8px;
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border: 1px solid #1a80f2;
      border-radius: 4px;
      cursor: pointer;
      float: right;
      margin-top: -3px;
    }
    .v-title-before {
      display: inline-block;
      width: 8px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
    }
    .v-title-dot {
      width: 8px;
      height: 8px;
      display: inline-block;
      position: absolute;
      border-radius: 50%;
      left: -17px;
      top: 38px;
    }
  }
  .rightFont {
    transform: rotateZ(180deg);
    color: #acb4c4;
    position: absolute;
    right: 12px;
    top: 50%;
    line-height: 16px;
    margin-top: -8px;
    &.active {
      transform: rotateZ(0deg);
    }
  }
  .v-box + .v-box {
    .v-title-top-line {
      display: inline-block;
      width: 1px;
      height: 10px;
      position: absolute;
      background: #fff;
      left: -1px;
      top: 38px;
    }
  }

  .only-one {
    .v-title-top-line {
      background: #fff !important;
    }
  }

  .v-box {
    border-left: 1px solid #b6bbc5;
    position: relative;
    padding-top: 8px;
    &.last-no-border {
      .v-title-top-line {
        background: #b6bbc5;
        height: 40px;
        top: 0px;
        left: -1px;
        width: 1px;
      }
    }
    .v-title-top-line {
      display: inline-block;
      width: 1px;
      height: 47px;
      position: absolute;
      background: #fff;
      left: -1px;
      top: 0px;
    }
    .v-title-bottom-line {
      display: inline-block;
      width: 1px;
      height: 8px;
      position: absolute;
      background: #fff;
      left: -1px;
      top: 54px;
    }
  }
  .last-no-border {
    border-left: 1px solid #fff;
  }

  .info-card {
    background: #f6f8fa;
    border: 1px solid #e6e9ec;
    border-radius: 2px;
    margin-left: 12px;
    border-top: 0;
    padding: 16px;
    &-title {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #38435a;
    }
    &-item {
      display: flex;
      margin-top: 16px;
      &-label {
        width: 54px;
        color: #959fb4;
      }
      &-value {
        flex: 1;
        color: #38435a;
      }
    }
  }
}
</style>
