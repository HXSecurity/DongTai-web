<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        {{ $t('menu.setting') }}
      </div>
      <div class="menu-warp">
        <template v-for="i in Routers">
          <div
            v-if="!hiddenMap[i.name]"
            :key="i.path"
            class="menu-item"
            :class="curModule(i.path) ? 'currentModule' : ''"
            @click="$router.push(i.path)"
          >
            {{ $t(i.meta.i18n) }}
          </div>
        </template>
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
  hiddenMap = {
    sensitive: true,
    strategy: true,
    template: true,
  }
  private curModule(path: string) {
    return this.$route.name === path
  }
  get Routers() {
    const R = this.$store.getters.routers[0].children.filter((i: any) => {
      return i.name === 'setting'
    })[0]
    if (R) {
      return R.children
    } else {
      return []
    }
  }
  created() {
    console.log()
  }
  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
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
