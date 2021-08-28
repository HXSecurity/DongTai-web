<template>
  <main>
    <div class="onlneTitle">
      {{ $t('views.upgradeOnline.online') }}
    </div>
    <div class="onlineDesc">
      {{ $t('views.upgradeOnline.onlineDesc') }}
    </div>
    <div class="address">
      {{ $t('views.upgradeOnline.address') }}
    </div>
    <div class="upgradeUrl">
      <el-input
        v-model="upgrade_url"
        :readonly="!editUrl"
        size="small"
        style="width: 400px"
        :class="editUrl ? '' : 'editInput'"
        @blur="editUrl = false"
      />
      <i
        v-if="!editUrl"
        class="iconfont iconbianji-6"
        @click="editUrl = true"
      ></i>
    </div>
    <div class="upradeOnline">
      <el-button type="text" class="onlineSubmit" @click="upgradeOnline">
        {{ $t('views.upgradeOnline.onlineSubmit') }}
      </el-button>
    </div>
    <div class="onlneTitle" style="margin-top: 60px">
      {{ $t('views.upgradeOnline.offline') }}
    </div>
    <div class="onlineDesc">
      {{ $t('views.upgradeOnline.offlineDesc') }}
    </div>
    <div class="address">
      {{ $t('views.upgradeOnline.select') }}
      <div style="display: inline-block; vertical-align: top">
        <el-upload
          ref="upload"
          action=""
          :http-request="uploadOneFile"
          :file-list="fileList"
          accept=".jar"
          :auto-upload="false"
        >
          <el-button slot="trigger" type="text" class="fileBtn"
            >选取文件</el-button
          >
          <el-button type="text" class="uploadBtn" @click="uploadOneFile"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip" style="margin-left: 20px">
            只能上传jar文件
          </div>
        </el-upload>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Upload } from 'element-ui'
import { Component } from 'vue-property-decorator'

interface myUpLoad extends Upload {
  uploadFiles: Array<{
    raw: File
  }>
}

@Component({ name: 'UpgradeOnline' })
export default class UpgradeOnline extends VueBase {
  private token = ''
  private upgrade_url = 'asd'
  private editUrl = false
  private fileList = []

  created() {
    this.userToken()
  }

  private async userToken() {
    const {
      status,
      msg,
      token,
      upgrade_url,
    } = await this.services.user.userToken()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.token = token
    this.upgrade_url = upgrade_url
  }

  private async upgradeOnline() {
    const params = {
      url: this.upgrade_url,
      token: this.token,
    }
    const { status, msg } = await this.services.setting.upgradeOnline(
      `Token ${this.token}`,
      params
    )
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
  }

  private async uploadOneFile() {
    console.log(this.$refs.upload)
    const formData = new FormData()
    formData.append('file', (this.$refs.upload as myUpLoad).uploadFiles[0].raw)
    const { status, msg } = await this.services.setting.upgradeOffline(formData)
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}

.onlneTitle {
  padding-top: 12px;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 22px;
  border-bottom: 1px solid #e6e9ec;
}

.onlineDesc {
  margin-top: 24px;
  font-size: 14px;
  font-weight: 400;
  color: #959fb4;
  line-height: 24px;
}

.address {
  margin-top: 29px;
  font-size: 14px;
  font-weight: 400;
  color: #959fb4;
  line-height: 24px;
}

.upgradeUrl {
  margin-top: 20px;

  i {
    color: #9eaab7;
    margin-left: 10px;
    cursor: pointer;
  }
}

.upradeOnline {
  margin-top: 50px;
  text-align: center;

  .onlineSubmit {
    width: 98px;
    height: 34px;
    line-height: 0;
    border-radius: 2px;
    border: 1px solid #1a80f2;
    font-size: 14px;
    color: #1a80f2;
  }
}

.fileBtn {
  margin-left: 20px;
  width: 110px;
  height: 32px;
  line-height: 0;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #a8b1bf;
  font-size: 14px;
  color: #a8b1bf;
}

.uploadBtn {
  margin-left: 20px;
  width: 120px;
  height: 32px;
  line-height: 0;
  border-radius: 2px;
  border: 1px solid #1a80f2;
  font-size: 14px;
  color: #1a80f2;
}
</style>
