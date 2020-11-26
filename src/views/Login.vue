<template>
  <main class="loginContainer">
    <el-card class="loginCard">
      <el-form>
        <el-form-item>
          <div style="font-size: 20px;text-align: center">
            登录
          </div>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="el-icon-user" v-model="userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="el-icon-lock" show-password v-model="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  private userName: string= ''
  private password: string = ''
  private async login () {
    console.log(23)
    console.log(this.$services)
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
