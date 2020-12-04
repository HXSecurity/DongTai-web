<template>
  <main class="container flex-row-space-between">
    <div class="slider-warp">
      <div class="title flex-column-center">
        {{$t('menu.setting')}}
      </div>
      <div class="menu-warp">
        <div class="menu-item" @click="$router.push('/setting/agentManage')" :class="curModule('/setting/agentManage') ? 'currentModule' : ''">
          {{$t('menu.agentManage')}}
        </div>
        <div class="menu-item">
          {{$t('menu.strategyManage')}}
        </div>
        <div class="menu-item">
          {{$t('menu.upgradeOnline')}}
        </div>
        <div class="menu-item">
          {{$t('menu.sysInfo')}}
        </div>
        <div class="menu-item" @click="$router.push('/setting/changePassword')" :class="curModule('/setting/changePassword') ? 'currentModule' : ''">
          {{$t('menu.changePassword')}}
        </div>
      </div>
    </div>
    <div class="route-warp">
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'SettingIndex' })
export default class SettingIndex extends Vue {
  private curModule (path: string) {
    return this.$route.fullPath === path
  }
}
</script>

<style scoped lang="scss">
.slider-warp {
  margin-top: 14px;
  background: #fff;
  width: 234px;

  .title{
    height: 54px;
    padding: 0 6px;
    border-bottom: 1px solid #E6E9EC;
    font-size: 18px;
    font-weight: 600;
    color: #4A72AE;
  }

  .menu-warp{
    padding: 17px 6px 0 6px;

    .menu-item{
      width: 100%;
      height: 38px;
      line-height: 38px;
      color: #38435A;
      font-size: 14px;
      border-radius: 4px;
      padding-left: 8px;
      cursor: pointer;

      &:hover{
        color: #1A80F2;
        background: #F6F8FA;
      }
    }

    .currentModule{
      color: #1A80F2;
      background: #F6F8FA;
    }
  }
}

.route-warp{
  width: 952px;
  background: #FFFFFF;
  margin-top: 14px;
}
</style>
