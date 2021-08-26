<template>
  <header class="header">
    <div class="container flex-row-space-between header-warp">
      <div class="logo flex-column-center" @click="$router.push('/')">
        <img
          v-if="this.$i18n.locale == 'zh_cn'"
          src="../../assets/img/logo.png"
          alt="logo"
          style="width: 98px"
        />
        <img
          v-if="this.$i18n.locale == 'en'"
          src="../../assets/img/logo_en.png"
          alt="logo"
          style="width: 98px"
        />
      </div>
      <div v-if="userInfo" class="url-warp">
        <div
          v-for="item in $store.getters.routers[0].children.filter(
            (i) => i.meta && i.meta.isMenu
          )"
          :key="item.name"
          class="url flex-column-center"
          :class="currentRoute(item.path) ? 'currentRoute' : ''"
          @click="$router.push(item.path)"
        >
          {{ $t(item.meta.i18n) }}
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
      <div v-else style="display: flex; align-items: center">
        <el-button type="text" class="anent" @click="buildIAST">
          <i class="el-icon-plus"></i> {{ $t('base.deploy') }}
        </el-button>
        <Dropdown>
          <img class="titleImg" src="../../assets/img/touxiang@2x.png" alt="" />
          <DropdownMenu slot="list">
            <DropdownItem
              :disabled="true"
              style="color: #515a6e; cursor: default"
            >
              <span>
                {{ userInfo.username || '' }}
              </span></DropdownItem
            >
            <Dropdown placement="right-start">
              <DropdownItem divided>
                {{ $t('menu.language') }}
                <Icon type="ios-arrow-forward"></Icon>
              </DropdownItem>
              <DropdownMenu slot="list">
                <DropdownItem>
                  <p @click="changeLanguage('zh')">
                    {{ $t('menu.chinese') }}
                  </p></DropdownItem
                >
                <DropdownItem>
                  <p @click="changeLanguage('en')">
                    {{ $t('menu.englist') }}
                  </p></DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
            <DropdownItem>
              <p @click="logOut">{{ $t('base.logout') }}</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { Dropdown, DropdownMenu, DropdownItem, Icon } from 'view-design'
@Component({
  name: 'layoutHeader',
  components: {
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Icon,
  },
})
export default class Header extends VueBase {
  private show = false
  private async changeLanguage(language: string) {
    const userInfo: any = this.userInfo
    const res = await this.services.setting.setLang(language)
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    window.localStorage.setItem(userInfo.username + '-language', language)
    switch (language) {
      case 'zh':
        this.$i18n.locale = 'zh_cn'
        break
      case 'en':
        this.$i18n.locale = 'en'
        break
      default:
        this.$i18n.locale = 'zh_cn'
        break
    }
    this.$emit('reload')
  }
  get userInfo(): { role: number } {
    return this.$store.getters.userInfo
  }
  async buildIAST() {
    const res = await this.services.setting.openapi()
    if (res.status === 202) {
      if (this.userInfo.role === 1 || this.userInfo.role === 2) {
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
      return
    }
    if (res.status !== 201) {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
      return
    }
    this.$router.push('/deploy')
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
  created() {
    console.log(this.$store.getters.routers[0].children)
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
      margin-left: 26px;
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
      i {
        line-height: 0px;
        font-weight: 600;
      }
      color: #fff;
      height: 28px;
      padding-left: 6px;
      padding-right: 6px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
}
</style>
