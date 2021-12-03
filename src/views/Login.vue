<template>
  <main>
    <!-- <div class="left-content"></div> -->
    <!-- <div class="right-content"> -->
    <div class="loginContainer">
      <div class="loginCard">
        <div class="title">
          <img
            v-if="this.$i18n.locale == 'zh_cn'"
            :src="logo"
            alt="logo"
            style="width: 140px"
          />
          <img
            v-if="this.$i18n.locale == 'en'"
            :src="logo_en"
            alt="logo"
            style="width: 140px"
          />
        </div>
        <div class="subTitle">
          <span class="line"></span>
          {{ $t('views.login.subTitle') }}
          <span class="line"></span>
        </div>
        <el-form style="margin-top: 10px" @keyup.enter.native="login">
          <el-form-item :label="$t('views.login.user')">
            <el-input
              v-model="userName"
              clearable
              :placeholder="$t('views.login.usernamePlaceholder')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('views.login.password')">
            <el-input
              v-model="password"
              show-password
              clearable
              :placeholder="$t('views.login.passwordPlaceholder')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('views.login.captcha')">
            <br />
            <el-input
              v-model="captcha"
              style="width: 80%"
              clearable
              :placeholder="$t('views.login.captchaPlaceholder')"
            ></el-input
            ><el-image
              style="
                position: absolute;
                height: 36px;
                margin-top: 2px;
                margin-left: 10px;
              "
              :src="captcha_url"
              @click="initCaptcha()"
            ></el-image>
          </el-form-item>
          <el-form-item style="margin-top: 54px">
            <el-button
              type="primary"
              style="width: 100%; background: #4a72ae"
              @click="login"
              >{{ $t('base.login') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="loginFooter"></div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import emitter from './taint/Emitter'

@Component({ name: 'Login' })
export default class Login extends VueBase {
  private userName = ''
  private password = ''
  private captcha = ''
  private captcha_hash_key = ''
  private captcha_url = ''
  private login_lock = false
  private logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  private logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
  changelogo() {
    this.logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
    this.logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  }
  created() {
    emitter.on('changelogo', this.changelogo)
    this.initCaptcha()
  }

  private async initCaptcha() {
    const { status, data, msg } = await this.services.user.initCaptcha()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.captcha_url = data['image_url']
    this.captcha_hash_key = data['hash_key']
    this.captcha = ''
  }

  private async login() {
    if (this.login_lock) {
      return
    }
    this.login_lock = true
    const params = {
      username: this.userName,
      password: this.password,
      captcha: this.captcha,
      captcha_hash_key: this.captcha_hash_key,
    }
    this.loadingStart()
    const { status, data, msg } = await this.services.user.login(params)
    this.loadingDone()
    if (status === 201) {
      let lang =
        data.default_language ||
        (navigator as any).language ||
        (navigator as any).userLanguage
      lang = lang.substr(0, 2)
      await this.services.setting.setLang(lang)
      switch (lang) {
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
      await this.$store.dispatch('user/getUserInfo')
      await this.$router.push('/project')
    } else if (status === 204) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
    } else if (status === 203 || status === 202) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      this.initCaptcha()
    }
    this.login_lock = false
  }
}
</script>

<style scoped lang="scss">
main {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
.loginContainer {
  width: 100%;
  min-width: 1200px;
  // height: if((calc((100vh-218px) < 710px)), 800px, calc(100vh-218px));
  height: 710px;
  // height: calc(100vh - 218px);
  // min-height: 100px;
  background: #fff;
  position: relative;

  // .left-content {
  //   position: relative;
  //   flex: 1;
  //   background-image: url('../assets/img/loginBg.png');
  //   background-size: 100% 100%;
  //   background-repeat: no-repeat;
  // }

  // .right-content {
  //   flex: 1;
  //   position: relative;
  // }

  .loginCard {
    width: 610px;
    // height: 610px;
    padding: 60px 73px;
    box-shadow: 0px 0px 16px 0px rgba(189, 197, 208, 0.5);
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;

    .title {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: #2a303d;
    }

    .subTitle {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #a5acbc;

      .line {
        background: #d7dae1;
        height: 1px;
        width: 46px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 38px;

        &:last-child {
          margin-right: 0;
          margin-left: 38px;
        }
      }
    }
  }
}

.loginFooter {
  background-image: url('../assets/img/loginBg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // position: absolute;
  // bottom: 0;
  width: 100%;
  height: 218px;
  // margin-top: calc(100vh - 928px);
}
</style>

<style>
/*Edge compatible password input box*/
input[type='password']::-ms-reveal {
  display: none;
}
</style>
