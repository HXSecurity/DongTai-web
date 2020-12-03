<template>
  <main class="loginContainer">
    <Header></Header>
    <el-card class="loginCard">
      <el-form>
        <el-form-item>
          <div style="font-size: 20px;text-align: center">
            {{$t('views.login.title')}}
          </div>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="el-icon-user" v-model="userName" :placeholder="$t('views.login.usernamePlaceholder')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="el-icon-lock" show-password v-model="password" :placeholder="$t('views.login.passwordPlaceholder')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login" @keyup.enter.native="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '@/views/layout/Header.vue'
import VueBase from '@/Vuebase'

@Component({
  name: 'Login',
  components: {
    Header
  }
})
export default class Login extends VueBase {
  private userName: string= ''
  private password: string = ''
  private async login () {
    const params = {
      username: this.userName,
      password: this.password
    }
    const { status, msg } = await this.services.login.login(params)
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss">
.loginContainer {
  width: 100%;
  height: 100vh;
  background: #fff;
  position: relative;

  .logo {
    position: absolute;
    top: 25px;
    left: 51px;
  }

  .loginCard {
    width: 306px;
    height: 315px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
