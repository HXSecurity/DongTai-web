<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        {{ $t('menu.setting') }}
      </div>
      <div class="menu-warp">
        <div
          class="menu-item"
          :class="curModule('/setting/agentManage') ? 'currentModule' : ''"
          @click="$router.push('/setting/agentManage')"
        >
          {{ $t('menu.agentManage') }}
        </div>
        <div
          class="menu-item"
          :class="curModule('/setting/strategyManage') ? 'currentModule' : ''"
          @click="$router.push('/setting/strategyManage')"
        >
          {{ $t('menu.strategyManage') }}
        </div>
        <div
          class="menu-item"
          :class="curModule('/setting/upgradeOnline') ? 'currentModule' : ''"
          @click="$router.push('/setting/upgradeOnline')"
        >
          {{ $t('menu.upgradeOnline') }}
        </div>
        <div
          class="menu-item"
          :class="curModule('/setting/sysInfo') ? 'currentModule' : ''"
          @click="$router.push('/setting/sysInfo')"
        >
          {{ $t('menu.sysInfo') }}
        </div>
        <div
          class="menu-item"
          :class="curModule('/setting/changePassword') ? 'currentModule' : ''"
          @click="$router.push('/setting/changePassword')"
        >
          {{ $t('menu.changePassword') }}
        </div>
      </div>
    </div>
    <div class="route-warp">
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'SettingIndex' })
export default class SettingIndex extends VueBase {
  private curModule(path: string) {
    return this.$route.fullPath === path
  }
}
</script>

<style scoped lang="scss">
.slider-warp {
  margin-top: 14px;
  background: #fff;
  width: 234px;

  .title {
    height: 54px;
    padding: 0 6px;
    border-bottom: 1px solid #e6e9ec;
    font-size: 18px;
    font-weight: 600;
    color: #4a72ae;
  }

  .menu-warp {
    padding: 17px 6px 0 6px;

    .menu-item {
      width: 100%;
      height: 38px;
      line-height: 38px;
      color: #38435a;
      font-size: 14px;
      border-radius: 4px;
      padding-left: 8px;
      cursor: pointer;

      &:hover {
        color: #1a80f2;
        background: #f6f8fa;
      }
    }

    .currentModule {
      color: #1a80f2;
      background: #f6f8fa;
    }
  }
}

.route-warp {
  width: 952px;
  background: #ffffff;
  margin-top: 14px;
}
</style>
