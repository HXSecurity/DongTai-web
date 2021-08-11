<template>
  <header class="header">
    <div class="container flex-row-space-between header-warp">
      <div class="logo flex-column-center" @click="$router.push('/')">
        <img
          src="../../assets/img/logo.png"
          alt="logo"
          style="width: 98px; height: 22px"
        />
      </div>
      <div v-if="userInfo" class="url-warp">
        <div
          class="url flex-column-center"
          :class="currentRoute('/project') ? 'currentRoute' : ''"
          @click="$router.push('/project')"
        >
          {{ $t('menu.project') }}
        </div>
        <div
          class="url flex-column-center"
          :class="currentRoute('/vuln') ? 'currentRoute' : ''"
          @click="$router.push('/vuln')"
        >
          {{ $t('menu.vuln') }}
        </div>
        <div
          class="url flex-column-center"
          :class="currentRoute('/sca') ? 'currentRoute' : ''"
          @click="$router.push('/sca')"
        >
          {{ $t('menu.sca') }}
        </div>
        <div
          class="url flex-column-center"
          :class="currentRoute('/taint') ? 'currentRoute' : ''"
          @click="$router.push('/taint')"
        >
          {{ $t('menu.taintPool') }}
        </div>
        <div
          class="url flex-column-center"
          :class="currentRoute('/setting') ? 'currentRoute' : ''"
          @click="$router.push('/setting')"
        >
          {{ $t('menu.setting') }}
        </div>
        <div
          v-if="userInfo.role === 1 || userInfo.role === 2"
          class="url flex-column-center"
          :class="currentRoute('/department') ? 'currentRoute' : ''"
          @click="$router.push('/department')"
        >
          {{ $t('menu.department') }}
        </div>
        <div
          v-if="userInfo.role === 1"
          class="url flex-column-center"
          :class="currentRoute('/talent') ? 'currentRoute' : ''"
          @click="$router.push('/talent')"
        >
          {{ $t('menu.talent') }}
        </div>
      </div>
      <div
        v-if="!userInfo"
        class="url-warp"
        style="justify-content: space-between"
      >
        <div
          class="url flex-column-center"
          :class="currentRoute('/taint') ? 'currentRoute' : ''"
          @click="$router.push('/taint')"
        >
          {{ $t('menu.taintPool') }}
        </div>
        <el-button
          v-if="!userInfo && $route.name !== 'login'"
          type="text"
          @click="$router.push('/login')"
          >{{ $t('menu.login') }}
        </el-button>
      </div>
      <div v-else>
        <el-button type="text" class="anent" @click="buildIAST">
          {{ $t('base.deploy') }}
        </el-button>
        <el-dropdown>
          <div style="height: 64px" class="flex-column-center">
            <div>
              <img
                class="titleImg"
                src="../../assets/img/touxiang@2x.png"
                alt=""
              />
              <span>
                {{ userInfo.username || '' }}
              </span>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <p @click="logOut">{{ $t('base.logout') }}</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'layoutHeader' })
export default class Header extends VueBase {
  get userInfo(): { role: number } {
    return this.$store.getters.userInfo
  }
  async buildIAST() {
    const res = await this.services.setting.openapi()
    if (res.status !== 201) {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
    } else {
      if (res.data.url) {
        this.$router.push('/deploy')
      } else {
        if (this.userInfo.role === 1) {
          this.$message({
            type: 'warning',
            message: this.$t('base.setOpenapi') as string,
            showClose: true,
          })
          this.$router.push('/setting/serverRegister?needBack=1')
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('base.helpOpenapi') as string,
            showClose: true,
          })
        }
      }
    }
  }

  canShow(name: string) {
    return this.$store.getters.routers.includes(name)
  }
  private currentRoute(path: string): boolean {
    return this.$route.matched.some((item) => item.path === path)
  }

  private async logOut() {
    await this.$store.dispatch('user/logOut')
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
      color: #12171f;
      line-height: 36px;
      cursor: pointer;
    }

    .url-warp {
      flex: 1;
      margin-left: 68px;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: start;

      .url {
        height: 100%;
        font-size: 16px;
        font-weight: normal;
        color: #38435a;
        cursor: pointer;
        margin-left: 10px;
        min-width: 100px;
        text-align: center;
        padding: 0 15px;

        &:first-child {
          margin-left: 0;
        }

        &:hover {
          color: #4a72ae;
          background: aliceblue;
          border-bottom: 2px solid #4a72ae;
        }
      }

      .currentRoute {
        color: #4a72ae;
        background: aliceblue;
        border-bottom: 2px solid #4a72ae;
      }
    }

    .titleImg {
      width: 46px;
      height: 46px;
      border: 1px solid #dde4ef;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 14px;
    }

    .anent {
      color: #fff;
      width: 82px;
      height: 28px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
}
</style>
