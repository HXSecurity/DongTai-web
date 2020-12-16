<template>
  <main class="loginContainer">
    <!-- <div class="left-content"></div> -->
    <!-- <div class="right-content"> -->
    <div class="loginFooter"></div>
    <div class="loginCard">
      <div class="title">
        {{ $t('views.login.title') }}
      </div>
      <div class="subTitle">
        <span class="line"></span>
        {{ $t('views.login.subTitle') }}
        <span class="line"></span>
      </div>
      <el-form style="margin-top: 53px">
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
        <el-form-item style="margin-top: 54px">
          <el-button
            type="primary"
            style="width: 100%; background: #4a72ae"
            @click="login"
            @keyup.enter.native="login"
            >登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- </div> -->
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'Login' })
export default class Login extends VueBase {
  private userName = ''
  private password = ''

  private async login() {
    const params = {
      username: this.userName,
      password: this.password,
    }
    this.loadingStart()
    const { status, msg } = await this.services.user.login(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    await this.$router.push('/')
  }
}
</script>

<style scoped lang="scss">
.loginContainer {
  width: 100%;
  min-width: 1200px;
  height: 100vh;
  min-height: 600px;
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

  .loginFooter {
    background-image: url('../assets/img/loginBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 218px;
  }

  .loginCard {
    width: 610px;
    height: 567px;
    padding: 60px 73px;
    box-shadow: 0px 0px 16px 0px rgba(189, 197, 208, 0.5);
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    margin: auto;

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
</style>
