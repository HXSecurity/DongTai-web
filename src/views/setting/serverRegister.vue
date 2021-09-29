<template>
  <div class="content-warp">
    <el-form ref="form" label-width="140px">
      <el-form-item :label="$t('views.serverRegister.openAPI')">
        <el-input v-model="openapi" style="width: 90%"> </el-input>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button size="small" class="btn" @click="setOpenapi">{{
        $t('views.serverRegister.save')
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'ServerRegister' })
export default class StrategyManage extends VueBase {
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

    const apiArr = this.openapi.split('://')
    if (apiArr[0] != 'http' && apiArr[0] != 'https') {
      this.$message.warning(this.$t('views.serverRegister.onlyHttp') as string)
      return false
    }
    if (!apiArr[1]) {
      this.$message.warning(this.$t('views.serverRegister.urlError') as string)
      return
    }
    if (
      apiArr[1] &&
      (apiArr[1].indexOf('/127.') || apiArr[1].indexOf('/localhost.'))
    ) {
      this.$message.warning(
        this.$t('views.serverRegister.withoutLocalhost') as string
      )
      return false
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
</style>
