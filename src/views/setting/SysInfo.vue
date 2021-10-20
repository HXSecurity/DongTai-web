<template>
  <main>
    <div class="moudleTitle">授权信息</div>
    <div class="form-box">
      <div class="moudleTitle-th">
        cpu阈值
        <el-popover placement="top-start" width="300" trigger="hover">
          <p>当CPU利用率满足阈值条件时，Agent自动停止。</p>
          <p>当CPU利用率低于阈值条件时，Agent自动启动。</p>
          <i slot="reference" class="el-icon-question"></i>
        </el-popover>
      </div>

      <el-form
        ref="form"
        :disabled="userInfo.role !== 1 && userInfo.role !== 2"
        class="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="cpu利用率">
          <div class="cpu-box">
            <span style="margin-right: 16px"> ≥ </span>
            <el-input-number
              v-model="form.cpu_limit"
              :max="100"
              :min="0"
              :controls="false"
              style="margin-right: 12px"
            ></el-input-number>
            <span> %</span>
          </div>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button
            v-if="userInfo.role === 1 || userInfo.role === 2"
            class="btn"
            type="primary"
            @click="profileModified"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'SysInfo' })
export default class SysInfo extends VueBase {
  public form = {
    cpu_limit: '',
  }
  onSubmit() {
    console.log('确定')
  }

  get userInfo() {
    return this.$store.getters.userInfo
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

  async profileModified() {
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
  }
  created() {
    this.getInfo()
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}
.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 64px;
}
.moudleTitle {
  margin-top: 12px;
  font-size: 16px;
  color: #38435a;
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e9ec;
}
.moudleTitle-th {
  width: 470px;
  font-size: 16px;
  margin-bottom: 12px;
}

.btn-box {
  display: flex;
  justify-content: center;
  .btn {
    height: 36px;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 0;
    background: #4a72ae;
    border-color: #4a72ae;
    border-radius: 2px;
    margin-right: 20px;
  }
}

.cpu-box {
  display: flex;
  .label_th {
    font-size: 12px;
    width: 140px;
  }
}

.form {
  width: 470px;
}

.el-icon-question {
  cursor: pointer;
}
</style>
