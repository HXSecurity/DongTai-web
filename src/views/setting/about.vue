<template>
  <div class="about">
    <div class="logo">
      <img
        v-if="this.$i18n.locale == 'zh_cn'"
        :src="logo"
        alt="logo"
        style="width: 240px"
      />
      <img
        v-if="this.$i18n.locale == 'en'"
        :src="logo_en"
        alt="logo"
        style="width: 240px"
      />
      <div class="about-text">
        {{ $t('views.about.nowVersion') }}：{{ now_version }}
      </div>
      <div v-if="new_version && new_version === now_version" class="about-text">
        {{ $t('views.about.already') }}
      </div>
      <div v-if="new_version && new_version !== now_version" class="about-text">
        {{ $t('views.about.newVersion') }}：{{ new_version }}
        <span class="text-btn" @click="toUpdate">{{
          $t('views.about.update')
        }}</span>
      </div>
      <div v-if="!new_version" class="about-text">
        {{ $t('views.about.checking') }}
      </div>
      <div class="about-text">
        <div class="download-item margin-t-16">
          <div class="label">{{ $t('views.about.token') }}：</div>
          <div class="info">
            <div class="markdown">
              <span> {{ userToken }}</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.deploy.copy')"
                placement="top"
              >
                <span
                  v-clipboard:error="onError"
                  v-clipboard:copy="userToken"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy icon"
                ></span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="about-text">
        <span class="text-btn" @click="toHelp">{{
          $t('views.about.help')
        }}</span>
        <span class="text-btn" @click="toBug">{{
          $t('views.about.issue')
        }}</span>
        <span class="text-btn" @click="toApi">{{ $t('views.about.api') }}</span>
      </div>
      <div class="btn-box">
        <el-button class="btn" @click="versionVisible = true">{{
          $t('views.about.detail')
        }}</el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('views.about.version')"
      :visible.sync="versionVisible"
    >
      <div>
        <div v-for="(item, key) in versionMap" :key="key" class="row">
          <div :span="6" class="column name">
            {{ key }}
          </div>
          <div :span="4" class="column version">
            {{ item.version }}
          </div>
          <div :span="14" class="column hash">
            <template v-for="(i, k) in item">
              <p v-if="k !== 'version'" :key="k">{{ k }} : {{ i }}</p>
            </template>
          </div>
        </div>
      </div>
      <template slot="footer">
        <el-button
          v-clipboard:error="onError"
          v-clipboard:copy="versionString"
          v-clipboard:success="onCopy"
          class="btn"
          >{{ $t('views.about.copy') }}</el-button
        >
        <el-button class="btn-border" @click="versionVisible = false">{{
          $t('views.about.close')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
@Component({
  name: 'StatusMonitoring',
})
export default class StatusMonitoring extends VueBase {
  private logo = '/upload/assets/img/logo.png?v=' + String(Math.random())
  private logo_en = '/upload/assets/img/logo_en.png?v=' + String(Math.random())
  private now_version = ''
  private new_version = ''
  private versionVisible = false
  private versionMap: any = {}
  private versionString = ''
  private userToken = ''
  private async getVersion() {
    const res = await this.services.setting.version()
    this.new_version = res.data.tag_name.substr(1)
  }
  private async getNowVersion() {
    const res = await this.services.setting.nowVersion()
    const versionArr = res.data.split('\n')
    versionArr.pop()
    versionArr.forEach((item: any) => {
      const itemArr = item.split(',')
      const name = itemArr[0]
      const key = itemArr[1]
      const value = itemArr[2]
      if (this.versionMap[name]) {
        this.versionMap[name][key] = value
      } else {
        this.versionMap[name] = {
          [key]: value,
        }
      }
    })

    const res2 = await this.services.setting.versionlist()
    if (res2.status === 201) {
      this.versionMap = { ...res2.data, ...this.versionMap }
    }
    this.now_version = this.versionMap.DongTai.version
    this.versionString = JSON.stringify(this.versionMap)
  }
  private onError() {
    this.$message({
      showClose: true,
      message: this.$t('views.search.copyFail') as string,
      type: 'error',
    })
  }
  private onCopy() {
    this.$message({
      showClose: true,
      message: this.$t('views.search.copySuccess') as string,
      type: 'success',
    })
  }
  private toUpdate() {
    window.open(`https://docs.dongtai.io/docs/changelog/release-note`)
  }
  private toHelp() {
    window.open('https://doc.dongtai.io/')
  }

  private toBug() {
    window.open('https://github.com/HXSecurity/DongTai/issues')
  }
  private toApi() {
    window.open('https://i0x0fy4ibf.feishu.cn/docx/doxcnSoxZjm2nEMyT3KJwg6ej4e')
  }
  private async getUserToken() {
    const res = await this.services.user.userToken()
    if (res.status === 201) {
      this.userToken = res.data.token
    }
  }
  created() {
    this.getNowVersion()
    this.getUserToken()
    this.getVersion()
  }
}
</script>

<style scoped lang="scss">
.about {
  background-color: #fff;
  padding: 20px;
  display: flex;
  justify-content: center;
  height: 100%;
  img {
    margin-top: 160px;
    margin-left: -16px;
  }
  .about-text {
    margin-top: 10px;
    font-size: 16px;
    .download-item {
      display: flex;
      align-items: center;
      .label {
        box-sizing: border-box;
        padding: 0 4px;
        width: 100px;
        text-align: left;
      }
      .info {
        word-wrap: break-word;
        word-break: break-all;
        flex: 1;
      }
      .download-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #ffffff;
        background: #4a72ae;
        border-radius: 2px;
      }
    }
    .markdown {
      background: #ebf0f5;
      border-radius: 2px;
      color: #38435a;
      font-size: 14px;
      max-width: 400px;
      line-height: 32px;
      padding: 0 30px 0 16px;
      display: flex;
      align-items: center;
      position: relative;
      .icon {
        right: 10px;
        bottom: 8px;
        position: absolute;
        display: inline-block;
        color: #1a80f2;
        cursor: pointer;
      }
    }
    .margin-t-16 {
      // margin-top: 16px;
      margin-left: -12px;
    }
  }
  .row {
    display: flex;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .row + .row {
    border-top: 0px solid #ccc;
  }

  .column {
    flex: 8;
    border-left: 1px solid #ccc;
    font-size: 14px;
    padding: 6px;
    &.name {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.version {
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.hash {
      border-right: 1px solid #ccc;
    }
  }
  .el-row {
    border-top: 1px solid #ccc;
  }

  .btn {
    background: #4a72ae;
    border-radius: 2px;
    border-color: #4a72ae;
    color: #fff;
  }
  .btn-border {
    border-radius: 2px;
    color: #4a72ae;
    border-color: #4a72ae;
  }

  .text-btn {
    color: #4a72ae;
    cursor: pointer;
    margin-right: 20px;
  }
  .btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
