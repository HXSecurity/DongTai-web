<template>
  <div>
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
      <div class="v-title" :style="{ background: bgColor(vItem.level_type) }">
        <div
          class="v-title-before"
          :style="{ background: levelColor(vItem.level_type) }"
        ></div>
        <div
          class="v-title-dot"
          :style="{ background: levelColor(vItem.level_type) }"
        ></div>
        {{ vItem.url }}
      </div>
      <div :class="vItem.open ? 'vuln-info-open' : 'vuln-info-close'">
        <ListVulnInfo
          v-if="vItem.vulnInfo"
          :vuln="vItem.vulnInfo"
        ></ListVulnInfo>
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
.v-title {
  padding: 8px 16px;
  margin-left: 12px;
  color: #38435a;
  position: relative;
  cursor: pointer;
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
    height: 36px;
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
    left: -16px;
    top: 14px;
  }
}

.v-box + .v-box {
  .v-title-top-line {
    display: inline-block;
    width: 1px;
    height: 14px;
    position: absolute;
    background: #fff;
    left: -1px;
    top: 8px;
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
      height: 8px;
      top: 0px;
      left: -1px;
      width: 1px;
    }
  }
  .v-title-top-line {
    display: inline-block;
    width: 1px;
    height: 24px;
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
    top: 26px;
  }
}
.last-no-border {
  border-left: 1px solid #fff;
}

.open-box {
  max-height: 550px;
  overflow: auto;
  min-height: 0;
  transition: all 0.3s;
}

.close-box {
  max-height: 0;
  overflow: hidden;
  min-height: 0;
  transition: all 0.3s;
}

.vuln-info-open {
  transition: all 0.3s;
}

.vuln-info-open,
.vuln-info-close {
  &::-webkit-scrollbar {
    display: none;
  }
}
.vuln-info-close {
  transition: 0.3s;
  max-height: 0px;
  overflow: hidden;
  padding: 0px 0px 0px 0px;
}
</style>
