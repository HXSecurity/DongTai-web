<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        {{ $t('menu.setting') }}
      </div>
      <div class="menu-warp">
        <!-- <template v-for="i in Routers">
          <div
            v-if="!hiddenMap[i.name]"
            :key="i.path"
            class="menu-item"
            :class="curModule(i.name) ? 'currentModule' : ''"
            @click="$router.push(i.path)"
          >
            {{ $t(i.meta.i18n) }}
          </div>
        </template> -->
        <div v-for="(i, k) in menuGroup" :key="k">
          <template v-if="i.length == 1">
            <div
              v-if="RouterMap[i[0]]"
              :key="RouterMap[i[0]].path"
              class="menu-item"
              :class="curModule(RouterMap[i[0]].path) ? 'currentModule' : ''"
              @click="$router.push(RouterMap[i[0]].path)"
            >
              {{ $t(RouterMap[i[0]].meta.i18n) }}
            </div>
          </template>
          <template v-else>
            <div>
              <div
                v-if="i.filter((z) => RouterMap[z]).length > 0"
                class="menu-item"
                :class="i.some((ii) => $route.name === ii) ? 'active' : ''"
                @click="menuActive[k] = !menuActive[k]"
              >
                <span>{{ k }}</span>
                <span
                  class="el-icon-arrow-down"
                  :class="menuActive[k] ? 'active' : ''"
                ></span>
              </div>
              <div
                class="menu-item-group"
                :style="`height:${
                  menuActive[k]
                    ? i.filter((z) => RouterMap[z]).length * 38 + 'px'
                    : '0px'
                }`"
              >
                <template v-for="j in i">
                  <div
                    v-if="RouterMap[j]"
                    :key="RouterMap[j] && RouterMap[j].path"
                    class="menu-item"
                    :class="curModule(RouterMap[j].path) ? 'currentModule' : ''"
                    @click="$router.push(RouterMap[j].path)"
                  >
                    {{ $t(RouterMap[j].meta.i18n) }}
                  </div>
                </template>
              </div>
            </div>
          </template>
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
  menuActive = {
    策略管理: true,
    // 组织管理: false,
  }

  menuGroup = {
    策略管理: [
      'strategyManage',
      // 'templateManage',
      'hookRule',
      'sensitiveManage',
      // 'scaManage',
    ],
    // 项目模版: ['projectTemplate'],
    密码修改: ['changePassword'],
    品牌配置: ['changeLogo'],
    // 状态监控: ['StatusMonitoring'],
    // 系统配置: ['SystemSettings'],
    // 操作日志: ['logManage'],
    关于洞态: ['about'],
  }
  private curModule(path: string) {
    return this.$route.name === path
  }

  RouterMap = {}

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
    this.Routers.forEach((route: any) => {
      this.RouterMap[route.name] = route
    })
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
    height: 48px;
    padding: 0 24px;
    border-bottom: 1px solid #e6e9ec;
    font-size: 16px;
    font-weight: 600;
    color: #38435a;
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
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      &:hover {
        color: #1a80f2;
        background: #f6f8fa;
      }
      &.active {
        color: #1a80f2;
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

.el-icon-arrow-down {
  transition: all 0.2s;
  &.active {
    transform: rotate(180deg);
  }
}
.menu-item-group {
  overflow: hidden;
  transition: all 0.2s;
  .menu-item {
    padding-left: 32px !important;
    font-weight: 400 !important;
  }
}
</style>
