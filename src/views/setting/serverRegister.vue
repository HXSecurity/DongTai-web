<template>
  <div class="content-warp">
    <el-form ref="form" label-width="130px">
      <el-form-item label="dongtai-openapi：">
        <el-input v-model="openapi">
          <template slot="prepend">http://</template>
          <template slot="append">.com</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button size="small" class="btn" @click="setOpenapi">保 存</el-button>
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
    if (res.status !== 201) {
      this.$message.error(res.msg)
    } else {
      this.openapi = res.data.url
    }
  }
  public async setOpenapi() {
    const res = await this.services.setting.setOpenapi({ value: this.openapi })
    if (res.status !== 201) {
      this.$message.error(res.msg)
    } else {
      if (this.$route.query.needBack) {
        this.$router.push('/deploy')
      } else {
        this.$message.success('保存成功')
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
