<template>
  <div class="links">
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
      <div class="v-title" @click="openRow(vItem)">
        <div
          class="v-title-before"
          :style="{ background: levelColor(vItem.level) }"
        ></div>
        <div class="v-title-dot"></div>
        <div class="left">{{ vItem.dependency_level }}层依赖</div>
        <div class="center">
          <div class="center-left">
            <div>{{ vItem.project_name }}@{{ vItem.project_version }}</div>
          </div>
          <div class="center-right">
            <span :style="{ color: levelColor(vItem.level) }">{{
              vItem.level
            }}</span>
          </div>
        </div>
        <i
          v-if="vItem.dependency_level > 0"
          class="icon iconfont rightFont"
          :class="vItem.open ? 'active' : ''"
          >&#xe69c;</i
        >
      </div>
      <div v-if="vItem.open" class="next">
        <StacksList :tree="vItem.next"></StacksList>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import qs from 'qs'
import StacksList from './stacksList.vue'
import { formatTimestamp } from '@/utils/utils'

@Component({
  name: 'LinkList',
  components: {
    StacksList,
  },
})
export default class LinkList extends VueBase {
  @Prop() tree: any
  @Prop() aggr_id: any
  created() {
    this.tree.forEach((element: any) => {
      this.$set(element, 'open', false)
    })
  }

  private async openRow(row: any) {
    if (!row.next) {
      const res = await this.services.sca.vulProjectAssets({
        project_id: row.project_id,
        project_version_id: row.project_version_id,
        vul_id: this.aggr_id,
      })
      if (res.status === 201) {
        this.$set(row, 'open', !row.open)
        this.$set(row, 'next', res.data)
      }
      return
    }
    this.$set(row, 'open', !row.open)
  }

  private levelColor(level: any) {
    switch (level) {
      case '高危':
        return '#E56363'
      case '中危':
        return '#F49E0B'
      case '低危':
        return '#2F90EA'
      case '无风险':
        return '#ABB2C0'
      case '信息':
        return '#DBDBDB'
    }
  }

  private levelLabel(level: any) {
    switch (level) {
      case 2:
        return '危险函数执行'
      case 0:
        return '外部参数传入'
      case 1:
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
.links {
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

  // .v-box + .v-box {
  //   .v-title-top-line {
  //     display: inline-block;
  //     width: 1px;
  //     height: 10px;
  //     position: absolute;
  //     background: #fff;
  //     left: -1px;
  //     top: 38px;
  //   }
  // }

  .only-one {
    .v-title-top-line {
      background: #fff !important;
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
    & + .v-box {
      .v-title-top-line {
        position: absolute;
        background: #b6bbc5;
        height: 48px;
        top: 0px;
        left: -1px;
        width: 1px;
      }
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
}
</style>
