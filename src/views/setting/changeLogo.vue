<template>
  <div class="content-warp">
    <div class="logo-box">
      <div class="logo-title" style="font-size: 20px">
        {{ $t('views.changeLogo.settingTitle') }}
      </div>
      <div class="logo-info">
        {{ $t('views.changeLogo.settingInfo') }}
      </div>
    </div>
    <div class="logo-box">
      <div class="logo-title">{{ $t('views.changeLogo.uploadLogo') }}</div>
      <div class="logo-setting-box">
        <div class="logo-setting-box-left">
          <div class="text">
            {{ $t('views.changeLogo.uploadLogoOne') }}
          </div>
          <div class="text">
            {{ $t('views.changeLogo.uploadLogoTwo') }}
          </div>
          <div class="img">
            <img src="../../assets/img/logo.png" alt="" />
            <img src="../../assets/img/logo_en.png" alt="" />
          </div>
        </div>
        <div class="logo-setting-box-right">
          <div class="upload-box">
            <div class="upload-box-title">
              {{ $t('views.changeLogo.zhLogo') }}
            </div>
            <div class="upload-img-box">
              <el-upload
                :action="path + '/filereplace/' + 'logo.png'"
                class="avatar-uploader"
                :headers="{
                  'csrf-token': token,
                }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :multiple="false"
                :before-upload="beforeAvatarUploadLogo"
                name="file"
              >
                <div class="img-box">
                  <img v-if="logo" :src="logo" class="avatar" />
                </div>
              </el-upload>
              <div class="upload-img-info">
                {{ $t('views.changeLogo.change') }}
              </div>
            </div>
          </div>
          <div class="upload-box">
            <div class="upload-box-title">
              {{ $t('views.changeLogo.enLogo') }}
            </div>
            <div class="upload-img-box">
              <el-upload
                :action="path + '/filereplace/' + 'logo_en.png'"
                class="avatar-uploader"
                :headers="{
                  'csrf-token': token,
                }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :multiple="false"
                :before-upload="beforeAvatarUploadLogoEn"
                name="file"
              >
                <div class="img-box">
                  <img v-if="logo_en" :src="logo_en" class="avatar" />
                </div>
              </el-upload>
              <div class="upload-img-info">
                {{ $t('views.changeLogo.change') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="logo-box">
      <div class="logo-title">{{ $t('views.changeLogo.uploadIcon') }}</div>
      <div class="logo-setting-box">
        <div class="logo-setting-box-left">
          <div class="text">
            {{ $t('views.changeLogo.uploadIconOne') }}
          </div>
          <div class="text">
            {{ $t('views.changeLogo.uploadIconTwo') }}
          </div>
          <div class="img">
            <img style="width: 44px" src="../../assets/img/icon.png" alt="" />
          </div>
        </div>
        <div class="logo-setting-box-right">
          <div class="upload-box">
            <div class="upload-img-box">
              <el-upload
                :action="path + '/filereplace/' + 'favicon.ico'"
                class="avatar-uploader"
                :headers="{
                  'csrf-token': token,
                }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUploadIcon"
                :multiple="false"
                name="file"
              >
                <div class="img-box">
                  <img
                    v-if="favicon"
                    :src="favicon"
                    class="avatar"
                    style="width: 54px; height: 54px"
                  />
                </div>
              </el-upload>
              <div class="upload-img-info">
                {{ $t('views.changeLogo.change') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="logo-box">
      <div class="logo-title">品牌名称</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { getToken } from '@/utils/utils'
import emitter from '../taint/Emitter'

@Component({ name: 'ChangeLog' })
export default class StrategyManage extends VueBase {
  public beforeAvatarUploadLogo(file: any) {
    const isJPG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      this.$message.error(this.$t('views.changeLogo.warningPng') as string)
      return false
    }
    if (!isLt2M) {
      this.$message.error(this.$t('views.changeLogo.warning2M') as string)
      return false
    }
    return isJPG && isLt2M
  }
  public beforeAvatarUploadLogoEn(file: any) {
    const isJPG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      this.$message.error(this.$t('views.changeLogo.warningPng') as string)
      return false
    }
    if (!isLt2M) {
      this.$message.error(this.$t('views.changeLogo.warning2M') as string)
      return false
    }
    return isJPG && isLt2M
  }
  public beforeAvatarUploadIcon(file: any) {
    const isJPG = file.type.indexOf('ico') > -1
    const isLt2M = file.size / 1024 < 128

    if (!isJPG) {
      this.$message.error(this.$t('views.changeLogo.warningICO') as string)
      return false
    }
    if (!isLt2M) {
      this.$message.error(this.$t('views.changeLogo.warning128K') as string)
      return false
    }
    return isJPG && isLt2M
  }

  public path = process.env.VUE_APP_BASE_API
  public token = getToken()
  public logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  public logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
  public favicon = '/upload/assets/img/favicon.ico?v=' + String(Math.random())

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
.avatar-uploader {
  display: flex;
  justify-content: center;
  width: 100%;
  .avatar {
    width: 100%;
  }
}
.logo-box {
  padding: 16px;
  & + .logo-box {
    padding-top: 0;
  }
  .logo-title {
    font-size: 18px;
    font-weight: 500;
    color: #38435a;
    line-height: 28px;
    margin: 8px 0px;
  }
  .logo-info {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    text-align: left;
    line-height: 20px;
    color: #38435a;
    margin: 8px 0;
  }
  .logo-setting-box {
    display: flex;
    padding: 16px;
    background: #f8f9fb;
    .logo-setting-box-left {
      flex: 1;
      .text {
        color: #38435a;
        font-size: 14px;
        line-height: 24px;
        margin-top: 4px;
      }
      .img {
        display: flex;
        padding: 20px;
        justify-content: space-around;
        img {
          width: 30%;
        }
      }
    }
    .logo-setting-box-right {
      flex: 1;
      display: flex;
      justify-content: space-around;
      text-align: center;
      .upload-box {
        flex: 1;
        margin: 8px;
        ::v-deep.el-upload {
          display: flex !important;
          flex: 1;
        }
        .upload-box-title {
          margin-bottom: 4px;
        }
        .upload-img-box {
          padding: 8px;
          background: #fff;
        }
        .upload-img-info {
          margin-top: 4px;
        }
        .img-box {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #eef0f3;
          height: 140px;
          flex: 1;
          img {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
