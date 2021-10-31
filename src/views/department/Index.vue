<template>
  <div class="container depart-box">
    <div class="left">
      <div class="title">{{ $t('menu.roleSetting') }}</div>
      <div class="dapart-list">
        <div
          v-for="(item, index) in getRouter"
          :key="index"
          :class="item.name === $route.name && 'active'"
          class="dapart-item"
          @click="$router.push({ name: item.name })"
        >
          {{ item.meta.name }}
        </div>
      </div>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
@Component({ name: 'DepartmentIndex' })
export default class DepartmentIndex extends VueBase {
  get getRouter() {
    const nowRoute = this.$store.getters.routers[0].children.filter(
      (item: any) => {
        return item.name == this.$route.matched[1].name
      }
    )
    return nowRoute[0].children
  }
}
</script>

<style scoped lang="scss">
.depart-box {
  display: flex;
  box-sizing: border-box;
  .left {
    margin: 16px 16px 0 0;
    background: #fff;
    width: 232px;
    .title {
      padding: 12px 16px 12px 24px;
      box-shadow: 0px 1px 0px #e6e9ec;
    }
    .dapart-list {
      padding: 8px;
      font-size: 14px;
      .dapart-item {
        padding: 12px;
        cursor: pointer;
        &.active {
          background: #f6f8fa;
          color: #1a80f2;
        }
      }
    }
  }
  .right {
    background: #fff;
    margin-top: 16px;
    width: 952px;
    padding: 24px;
  }
}
</style>
