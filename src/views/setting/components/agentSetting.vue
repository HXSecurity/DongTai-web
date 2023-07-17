<template>
  <div class="setting-box">
    <div class="setting-card">
      <div class="setting-card-title">主动验证</div>
      <div
        class="setting-card-switch"
        :class="form.vul_verifiy === '1' ? 'active' : ''"
      >
        <span>{{ form.vul_verifiy === '1' ? '已开启' : '已关闭' }}</span>
        <el-switch
          v-model="form.vul_verifiy"
          :active-value="'1'"
          :inactive-value="'0'"
          style="margin-left: 8px"
          :width="36"
          @change="profileModified"
        ></el-switch>
      </div>
    </div>
    <!-- <div class="setting-card">
      <div class="setting-card-title">熔断</div>
      <div
        class="setting-card-switch"
        :class="form.circuit_break === '1' ? 'active' : ''"
      >
        <span>{{ form.circuit_break === '1' ? '已开启' : '已关闭' }}</span>
        <el-switch
          v-model="form.circuit_break"
          :active-value="'1'"
          :inactive-value="'0'"
          style="margin-left: 8px"
          :width="36"
          @change="profileModified"
        ></el-switch>
        <span
          v-if="
            $store.getters.userInfo.role === 1 ||
            $store.getters.userInfo.role === 2
          "
          class="icon iconfont"
          style="color: #4a72ae"
          @click="toSetting"
          >&#xe69f;</span
        >
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'AgentSetting',
})
export default class AgentSetting extends VueBase {
  private form = {
    vul_verifiy: '0',
  }

  async getInfo() {
    const keys = []
    for (let key in this.form) {
      keys.push(key)
    }
    const res = await this.services.setting.profileGet({
      keys,
    })
    if (res.status === 201) {
      res.data.forEach((item: any) => {
        this.form[item.key] = item.value
      })
    } else {
      this.$message.error(res.msg)
    }
  }

  async profileModified(val: any) {
    if(val == 1) {
      const { status, msg, data } =
      await this.services.setting.vulRecheckPayload({
        page: 1,
        page_size: 20,
        language_id: 1,
      })
      
      if (status !== 201) {
        this.$message.error(msg)
        return
      }
      if (data?.length < 1) {
        this.$confirm('暂无可用规则，请点击跳转至规则配置', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          this.$router.push('/setting/hookRule')
        })
        return
      }
    }
    const data = []
    for (let key in this.form) {
      data.push({
        value: String(this.form[key]),
        key,
      })
    }
    const res = await this.services.setting.profileModified(data)
    if (res.status === 201) {
      this.$message.success(res.msg)
    } else {
      this.$message.error(res.msg)
    }
    this.getInfo()
  }

  created() {
    this.getInfo()
  }

  toSetting() {
    this.$router.push({ name: 'sysInfo' })
  }
}
</script>

<style scoped lang="scss">
.setting-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  .setting-card {
    flex: 1;
    margin-left: 8px;
    &-title {
      color: #38435a;
      font-weight: 600;
      margin-bottom: 14px;
    }
    &-switch {
      background: #f7f7f9;
      border-radius: 4px;
      height: 40px;
      padding: 0px 12px 0px 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      line-height: 16px;
      color: #b6bbc5;
      .icon {
        margin-left: 8px;
        cursor: pointer;
        &:hover {
          color: #1a80f2;
        }
      }
      &.active {
        span {
          color: #51cb74;
        }
      }
    }
  }
}
</style>
