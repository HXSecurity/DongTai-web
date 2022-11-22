<template>
  <div class="resource">
    <div class="resource-item">
      <span class="icon iconfont" style="color: #f49e0b">&#xe6b4;</span>
      <span>{{ disk_rate || 0 }}%</span>
    </div>
    <div class="resource-item">
      <span class="icon iconfont" style="color: #2f90ea">&#xe6a5;</span>
      <span>{{ cpu_rate || 0 }}%</span>
    </div>
    <div class="resource-item">
      <span class="icon iconfont" style="color: #1a80f2">&#xe6a3;</span>
      <span>{{ memory_rate || 0 }}%</span>
    </div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'Resource',
})
export default class Resource extends VueBase {
  @Prop() cpu_rate?: any
  @Prop() disk_rate?: any
  @Prop() memory_rate?: any
}
</script>

<style scoped lang="scss">
.resource {
  display: flex;
  justify-content: space-between;
  .resource-item {
    display: flex;
    align-items: center;
    span {
      display: inline-flex;
      line-height: 14px;
      + span {
        display: inline-flex;
        width: 54px;
      }
    }
    .icon {
      margin-right: 4px;
    }
  }
}
</style>
