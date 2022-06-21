<template>
  <div class="status">
    <div class="dot" :class="state_text.class"></div>
    <div class="label">{{ state_text.label }}</div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Status',
})
export default class Status extends VueBase {
  @Prop() state!: any

  get state_text() {
    switch (this.state) {
      case 2:
        return { class: '', label: '运行中' }
      case 3:
        return { class: 'close', label: '暂停中' }
      case 4:
        return { class: 'uninstrall', label: '已离线' }
      default:
        return { class: 'uninstrall', label: '已离线' }
    }
  }
}
</script>

<style scoped lang="scss">
.status {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  .dot {
    margin-right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #51cb74;
    &.close {
      background: #4a72ae;
    }
    &.uninstrall {
      background: #b6bbc5;
    }
  }
  .label {
    color: '#38435A';
  }
}
</style>
