<template>
  <div class="content-warp">
    <el-form ref="form">
      <el-form-item label="中文logo">
        <el-upload
          :action="path + '/filereplace/' + 'logo.png'"
          class="avatar-uploader"
          :headers="{
            'csrf-token': token,
          }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :multiple="false"
          name="file"
        >
          <img v-if="logo" :src="logo" class="avatar" />
        </el-upload>
      </el-form-item>

      <el-form-item label="英文logo">
        <el-upload
          :action="path + '/filereplace/' + 'logo_en.png'"
          class="avatar-uploader"
          :headers="{
            'csrf-token': token,
          }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :multiple="false"
          name="file"
        >
          <img v-if="logo_en" :src="logo_en" class="avatar" />
        </el-upload>
      </el-form-item>

      <el-form-item label="网站ico">
        <el-upload
          :action="path + '/filereplace/' + 'favicon.ico'"
          class="avatar-uploader"
          :headers="{
            'csrf-token': token,
          }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :multiple="false"
          name="file"
        >
          <img
            v-if="favicon"
            :src="favicon"
            class="avatar"
            style="width: 54px; height: 54px"
          />
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { getToken } from '@/utils/utils'
import emitter from '../taint/Emitter'

@Component({ name: 'ServerRegister' })
export default class StrategyManage extends VueBase {
  public path = process.env.VUE_APP_BASE_API
  public token = getToken()
  public logo = '/upload/assets/img/logo.png'
  public logo_en = '/upload/assets/img/logo_en.png'
  public favicon = '/upload/assets/img/favicon.ico'

  public handleAvatarSuccess(res: any) {
    if (res.status === 201) {
      this.$message.success(res.msg)
    } else {
      this.$message.error(res.msg)
    }
    this.logo = ''
    this.logo_en = ''
    this.favicon = ''
    this.$nextTick(() => {
      emitter.emit('changelogo')
      this.logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
      this.logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
      this.favicon = '/upload/assets/img/favicon.ico?v=' + String(Math.random())
    })
  }
  public openapi = ''
  public async getOpenapi() {
    const res = await this.services.setting.openapi()
    if (res.status === 202) {
      return
    }
    if (res.status !== 201) {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
    } else {
      this.openapi = res.data.url
    }
  }
  public async setOpenapi() {
    if (!this.openapi) {
      this.$message.warning(
        this.$t('views.serverRegister.saveWarning') as string
      )
      return
    }
    const res = await this.services.setting.setOpenapi({ value: this.openapi })
    if (res.status !== 201) {
      this.$message({
        type: 'error',
        message: res.msg,
        showClose: true,
      })
    } else {
      if (this.$route.query.needBack) {
        this.$router.push('/deploy')
      } else {
        this.$message({
          type: 'success',
          message: this.$t('views.serverRegister.saveSuccess') as string,
          showClose: true,
        })
      }
    }
  }
  created() {
    console.log(this.path)
    this.getOpenapi()
  }
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 38px 28px 40px 28px;
}
.btn-box {
  display: flex;
  justify-content: center;
}
.btn {
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}
.el-form-item {
  display: flex;
  align-items: center;
  margin-left: 40px;
}
.avatar-uploader .avatar {
  padding: 4px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .avatar:hover {
  border-color: #409eff;
}

.avatar {
  width: 268px;
  height: 88px;
  display: block;
}
</style>
