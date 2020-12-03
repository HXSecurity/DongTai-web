<template>
  <div>
    <el-form :model="submitForm" label-width="100px" style="margin-top: 64px" status-icon :rules="rules" ref="ruleForm" >
      <el-form-item :label="$t('views.changePassword.username')">{{userInfo.username}}</el-form-item>
      <el-form-item :label="$t('views.changePassword.oldPassword')" prop="old_password">
        <el-input size="mini" show-password v-model="submitForm.old_password" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('views.changePassword.newPassword')" prop="new_password">
        <el-input size="mini" show-password v-model="submitForm.new_password" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('views.changePassword.confirmNewPassword')" prop="checkPass">
        <el-input size="mini" show-password v-model="submitForm.checkPass" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button size="mini" type="primary" @click="changePassword">
          {{$t('views.changePassword.submit')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/Vuebase'

@Component({ name: 'ChangePassword' })
export default class ChangePassword extends VueBase {
  submitForm = {
    old_password: '',
    new_password: '',
    checkPass: ''
  }

  private rules = {
    old_password: [
      { validator: this.validateOldPass, trigger: 'blur' }
    ],
    new_password: [
      { validator: this.validateNewPass, trigger: 'blur' }
    ],
    checkPass: [
      { validator: this.validateCheckPass, trigger: 'blur' }
    ]
  }

  $store: any
  get userInfo () {
    return this.$store.getters.userInfo
  }

  private validateOldPass (rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入旧密码'))
    } else {
      if (this.submitForm.old_password !== '') {
        this.$refs.ruleForm.validateField('new_password')
      }
      callback()
    }
  }

  private validateNewPass (rule: any, value: string, callback: any) {
    if (value === '') {
      callback(new Error('请输入新密码'))
    } else {
      if (this.submitForm.old_password !== '') {
        this.$refs.ruleForm.validateField('checkPass')
      }
      callback()
    }
  }

  private validateCheckPass (rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.submitForm.new_password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  };

  private changePassword () {
    this.$refs.ruleForm.validate(async (valid: any) => {
      if (valid) {
        const params = {
          username: this.userInfo.username,
          old_password: this.submitForm.old_password,
          new_password: this.submitForm.new_password
        }
        const { status, msg } = await this.services.login.changePassword(params)
        if (status !== 201) {
          this.$message.error(msg)
          return
        }
        this.$router.push('/login')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style scoped>

</style>
