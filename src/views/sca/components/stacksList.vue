<template>
  <div class="stacks">
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
      <div class="v-title">
        <div
          class="v-title-before"
          :style="{ background: levelColor(vItem.level_id) }"
        ></div>
        <div class="v-title-dot"></div>
        <div class="left">{{ vItem.dependency_level }}层调用</div>
        <div class="center">
          <div class="center-left">
            <div>{{ vItem.package_name }}@{{ vItem.version }}</div>
          </div>
          <div class="center-right">
            <span :style="{ color: levelColor(vItem.level_id) }">{{
              vItem.level
            }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="vItem.dependency_asset && vItem.dependency_asset.length"
        class="children-card"
      >
        <StacksList :tree="vItem.dependency_asset"></StacksList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import qs from 'qs'
import { formatTimestamp } from '@/utils/utils'

@Component({
  name: 'StacksList',
})
export default class StacksList extends VueBase {
  @Prop() tree: any
  created() {
    this.tree.forEach((element: any) => {
      this.$set(element, 'open', false)
    })
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
.stacks {
  .v-title {
    padding: 8px 16px;
    margin-left: 12px;
    color: #38435a;
    position: relative;
    cursor: pointer;
    height: 82px;
    display: flex;
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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
      }
      .center-right {
        padding: 0 20px;
        width: 346px;
        height: 100%;
        align-items: center;
        display: flex;
        span {
          display: inline-block;
          width: 340px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
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
      height: 80px;
      position: absolute;
      left: 0;
      top: 0;
      border-top-right-radius: 40px;
      border-bottom-right-radius: 40px;
    }
    .v-title-dot {
      width: 14px;
      height: 1px;
      display: inline-block;
      position: absolute;
      border-radius: 50%;
      background: #b6bbc5;
      left: -14px;
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

  .v-box {
    border-left: 1px solid #b6bbc5;
    position: relative;
    padding-top: 8px;
    .v-title-top-line {
      position: absolute;
      background: #fff;
      height: 48px;
      top: 0px;
      left: -1px;
      width: 1px;
    }
    .v-title-top-line {
      position: absolute;
      background: #b6bbc5;
      height: 48px;
      top: 0px;
      left: -1px;
      width: 1px;
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

  .link-card {
    padding-left: 36px;
  }
  .next {
    padding-left: 40px;
  }

  .children-card {
    margin-left: 40px;
  }
}
</style>
