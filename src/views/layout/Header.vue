<template>
  <header class="header">
    <div class="container flex-row-space-between header-warp">
      <div class="logo flex-column-center" @click="$router.push('/')">
        IAST
      </div>
      <div class="url-warp">
        <div class="url flex-column-center" :class="currentRoute('/vuln') ? 'currentRoute' : ''">
          {{ $t('menu.vuln') }} /
        </div>
      </div>
      <div v-if="!userInfo" class="flex-column-center">
        <el-button v-if="!userInfo" type="text" @click="$router.push('/login')">{{ $t('menu.login') }}</el-button>
      </div>
      <div v-else>
        <el-dropdown>
          <div style="height: 64px" class="flex-column-center">
            <div>
              <img class="titleImg" src="../../assets/img/touxiang@2x.png" alt="">
              <span>
               {{ userInfo.username || '' }}
              </span>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <p
                @click="logOut"
              >
                退出
              </p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({ name: 'layoutHeader' })
export default class Header extends Vue {
  $store: any
  get userInfo () {
    return this.$store.getters.userInfo
  }

  private currentRoute (path: string): boolean {
    return this.$route.matched.some(item => item.path === path)
  }

  private logOut () {
    this.$store.dispatch('logOut')
    this.$router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 64px;
  background: #fff;

  .header-warp {
    height: 100%;

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #12171F;
      line-height: 36px;
      cursor: pointer;
    }

    .url-warp {
      flex: 1;
      margin-left: 68px;
      height: 100%;

      .url {
        height: 100%;
        font-size: 16px;
        font-weight: normal;
        color: #38435A;
        cursor: pointer;
      }

      .currentRoute{
        color: #DC3C3A;
      }
    }

    .titleImg{
      width: 46px;
      height: 46px;
      border: 1px solid #DDE4EF;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 14px;
    }
  }

}
</style>
