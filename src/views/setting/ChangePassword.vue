<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="submitForm"
      label-width="100px"
      style="margin-top: 54px"
      status-icon
      :rules="rules"
    >
      <el-form-item :label="$t('views.changePassword.username')">{{
        userInfo.username
      }}</el-form-item>
      <el-form-item
        :label="$t('views.changePassword.oldPassword')"
        prop="old_password"
      >
        <el-input
          v-model="submitForm.old_password"
          size="mini"
          show-password
          style="width: 220px"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('views.changePassword.newPassword')"
        prop="new_password"
      >
        <el-input
          v-model="submitForm.new_password"
          size="mini"
          show-password
          style="width: 220px"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('views.changePassword.confirmNewPassword')"
        prop="checkPass"
      >
        <el-input
          v-model="submitForm.checkPass"
          size="mini"
          show-password
          style="width: 220px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          style="width: 104px"
          @click="changePassword"
        >
          {{ $t('views.changePassword.submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'ChangePassword' })
export default class ChangePassword extends VueBase {
  submitForm = {
    old_password: '',
    new_password: '',
    checkPass: '',
  }

  private rules = {
    old_password: [{ validator: this.validateOldPass, trigger: 'blur' }],
    new_password: [{ validator: this.validateNewPass, trigger: 'blur' }],
    checkPass: [{ validator: this.validateCheckPass, trigger: 'blur' }],
  }

  $store: any
  get userInfo() {
    return this.$store.getters.userInfo
  }

  private validateOldPass(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入旧密码'))
    } else {
      if (this.submitForm.old_password !== '') {
        this.$refs.ruleForm.validateField('new_password')
      }
      callback()
    }
  }

  private validateNewPass(rule: any, value: string, callback: any) {
    if (value === '') {
      callback(new Error('请输入新密码'))
    } else {
      if (this.submitForm.old_password !== '') {
        this.$refs.ruleForm.validateField('checkPass')
      }
      callback()
    }
  }

  private validateCheckPass(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.submitForm.new_password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  private changePassword() {
    this.$refs.ruleForm.validate(async (valid: any) => {
      if (valid) {
        const params = {
          username: this.userInfo.username,
          old_password: this.submitForm.old_password,
          new_password: this.submitForm.new_password,
        }
        this.loadingStart()
        const { status, msg } = await this.services.user.changePassword(params)
        this.loadingDone()
        if (status !== 201) {
          this.$message.error(msg)
          return
        }
        await this.$router.push('/login')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style scoped></style>
