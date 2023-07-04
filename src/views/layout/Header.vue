<template>
  <div>
    <div v-if="sca_setup" style="background: #fff">
      <div class="header-top-bar">
        未配置ScaToken:<a
          target="_blank"
          href="https://doc.dongtai.io/docs/getting-started/server/deploy-sca"
          >点我配置</a
        >
      </div>
    </div>
    <header class="header">
      <div class="container flex-row-space-between header-warp">
        <div class="logo flex-column-center" @click="$router.push('/')">
          <img
            v-if="this.$i18n.locale == 'zh_cn'"
            :src="logo"
            alt="logo"
            style="width: 98px; height: 32px"
          />
          <img
            v-if="this.$i18n.locale == 'en'"
            :src="logo_en"
            alt="logo"
            style="width: 98px; height: 32px"
          />
        </div>
        <div v-if="userInfo" class="url-warp">
          <div
            v-for="item in $store.getters.routers[0].children.filter(
              (i) => i.meta && i.meta.isMenu
            )"
            :key="item.name"
            class="url flex-column-center"
            :class="currentRoute(item.name) ? 'currentRoute' : ''"
            @click="$router.push({ name: item.name })"
          >
            {{ $t(item.meta.i18n) }}
          </div>
        </div>
        <div
          v-if="!userInfo"
          class="url-warp"
          style="justify-content: space-between"
        >
          <!-- <div
          class="url flex-column-center"
          :class="currentRoute('taint') ? 'currentRoute' : ''"
          @click="$router.push({ name: 'taint' })"
        >
          {{ $t('menu.taintPool') }}
        </div> -->
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
          <!-- <div class="icon-btn" @click="$router.push({ name: 'taint' })">
            <el-tooltip
              class="item"
              effect="dark"
              content="数据查询"
              placement="bottom"
            >
              <span class="icon iconfont">&#xe6a2;</span>
            </el-tooltip>
          </div> -->
          <div class="icon-btn" @click="$router.push({ name: 'setting' })">
            <el-tooltip
              class="item"
              effect="dark"
              content="系统设置"
              placement="bottom"
            >
              <span class="icon iconfont"> &#xe6a1; </span>
            </el-tooltip>
          </div>

          <el-popover
            v-model="showPop"
            style="margin-right: 20px"
            placement="bottom"
            trigger="click"
            @show="showMessage()"
          >
            <div class="badge-header">
              <span>{{ $t('message.notice') }}</span>
              <el-button size="small" type="text" @click="deleteMessage(0)">{{
                $t('message.clearAll')
              }}</el-button>
            </div>
            <div
              v-loading="mLoading"
              class="msg-box"
              infinite-scroll-distance="20"
            >
              <div v-for="item in mList" :key="item.id" class="badge-info">
                <div>
                  <div class="info">
                    {{ item.message || $t('message.Empty')
                    }}<i
                      v-if="item.relative_url"
                      class="el-icon-link"
                      @click="goPath(item.relative_url)"
                    ></i>
                  </div>
                  <div class="time">{{ fmtStr(item.create_time * 1000) }}</div>
                </div>
                <div class="close" @click="deleteMessage(item.id)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
            <el-badge slot="reference" :value="count" :hidden="!count">
              <el-tooltip
                class="item"
                effect="dark"
                content="消息通知"
                placement="bottom"
              >
                <span class="icon-btn">
                  <i style="font-size: 16px" class="icon iconfont">&#xe6a0;</i>
                </span>
              </el-tooltip>
            </el-badge>
          </el-popover>
          <Dropdown>
            <img
              class="titleImg"
              src="../../assets/img/touxiang@2x.png"
              alt=""
            />
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
                  <!-- <DropdownItem>
                    <p @click="changeLanguage('en')">
                      {{ $t('menu.englist') }}
                    </p></DropdownItem
                  > -->
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
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { Dropdown, DropdownMenu, DropdownItem, Icon } from 'view-design'
import emitter from '../taint/Emitter'
import { formatTimestamp } from '../../utils/utils'
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
  private logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
  private logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  changelogo() {
    this.logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
    this.logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  }
  private goPath(str: string) {
    if (str) {
      window.open(str)
    }
  }
  private fmtStr(timestamp: number | any) {
    return formatTimestamp(timestamp)
  }
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
    if (this.$route && this.$route.meta) {
      document.title = this.$t(this.$route.meta.i18n) as string
    }
    this.$emit('reload')
  }
  get userInfo(): { role: number } {
    return this.$store.getters.userInfo
  }
  async buildIAST() {
    this.$router.push('/deploy')
  }

  async messageList() {
    const res = await this.services.message.list({
      page_size: this.mSize,
      page: this.num_pages,
    })
    console.log(res)
  }
  private count = 0
  async messageUnreadCount() {
    if (!this.userInfo) {
      return
    }
    const res = await this.services.message.unreadCount()
    if (res.status === 201) {
      this.count = res.data.new_message_count
    } else {
      this.$message.error(res.msg)
    }
  }

  private mList = []
  private mTotal = 0
  private mLoading = false
  private num_pages = 1
  private mSize = 999
  private showPop = false
  private async deleteMessage(id: number) {
    this.$confirm(
      this.$t('message.warning') as string,
      this.$t('message.tips') as string,
      {
        confirmButtonText: this.$t('message.confirm') as string,
        cancelButtonText: this.$t('message.cancel') as string,
        type: 'warning',
      }
    ).then(async () => {
      let res
      if (id) {
        res = await this.services.message.mDelete({
          id: id,
          all: false,
        })
      } else {
        res = await this.services.message.mDelete({
          all: true,
        })
      }
      if (res.status === 201) {
        this.showMessage()
        this.messageUnreadCount()
      } else {
        this.$message.error(res.msg)
      }
      this.showPop = true
    })
  }
  handleCurrentChange(val: number) {
    this.num_pages = val
    this.showMessage()
  }
  async showMessage() {
    this.mLoading = true
    const res = await this.services.message.list({
      page_size: this.mSize,
      page: this.num_pages,
    })
    await this.messageUnreadCount()
    this.mLoading = false
    if (res.status === 201) {
      this.mList = res.data.messages
      this.mTotal = res.data.page.alltotal
    } else {
      this.$message.error(res.msg)
    }
  }

  canShow(name: string) {
    return this.$store.getters.routers.includes(name)
  }
  private currentRoute(name: string): boolean {
    return this.$route.matched.some((item) => item.name === name)
  }

  private async logOut() {
    await this.$store.dispatch('user/logOut')
  }
  private timer: any = null

  get sca_setup(): any {
    return this.$store.state.user.userInfo?.sca_setup
  }

  created() {
    this.messageUnreadCount()
    this.timer = setInterval(() => {
      this.messageUnreadCount()
    }, 60 * 1000)
    emitter.on('changelogo', this.changelogo)
  }
}
</script>

<style scoped lang="scss">
.header-top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  color: #f49e0b;
  background-color: rgba(244, 158, 11, 0.2);
  a {
    color: #f49e0b;
    text-decoration: underline;
  }
}
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
      justify-content: flex-start;

      .url {
        height: 100%;
        font-size: 16px;
        font-weight: normal;
        color: #38435a;
        cursor: pointer;
        min-width: 88px;
        text-align: center;
        padding: 0 15px;

        &:first-child {
          margin-left: 0;
        }

        &:hover {
          color: #1a80f2;
          background: #f6f8fa;
        }
      }

      .currentRoute {
        color: #1a80f2;
        background: #f6f8fa;
        position: relative;
        &::after {
          position: absolute;
          content: '';
          width: 28px;
          height: 2px;
          background: #1a80f2;
          border-radius: 2px 2px 0px 0px;
          bottom: 2px;
          left: 50%;
          margin-left: -14px;
        }
      }
    }

    .titleImg {
      width: 32px;
      height: 32px;
      border: 1px solid #dde4ef;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 14px;
      margin-left: -12px;
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
.icon-btn {
  display: flex;
  cursor: pointer;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  color: #38435a;
  &:hover {
    background: #f6f8fa;
    color: #1a80f2;
  }
  .icon.iconfont {
    font-size: 16px;
    height: 24px;
  }
}
.badge-header {
  display: flex;
  justify-content: space-between;
  height: 56px;
  border-bottom: 1px solid #e6e9ec;
  margin-right: -12px;
  margin-left: -12px;
  margin-top: -12px;
  line-height: 56px;
  min-width: 400px;
  span {
    margin-left: 12px;
    color: #38435a;
  }
  .el-button {
    color: #4a72ae;
    font-size: 14px;
    margin-right: 12px;
  }
}
.badge-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 18px;
  border-bottom: 1px solid #e6e9ec;
  width: 380px;
  padding: 16px 0px;
  .info {
    color: #38435a;
    margin-bottom: 6px;
  }
  .time {
    color: #959fb4;
  }
  .close {
    width: 24px;
    height: 24px;
    background: #f4f7f9;
    border-radius: 2px;
    color: #1a80f2;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .el-icon-link {
    color: #1a80f2;
    margin-left: 2px;
    cursor: pointer;
  }
}
.msg-box {
  height: 400px;
  overflow: auto;
}
::v-deep.el-badge__content.is-fixed {
  top: 4px;
  right: 24px;
}
</style>
