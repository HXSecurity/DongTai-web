<template>
  <div class="system-setting">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="header">
              <b>清理配置</b>
              <el-switch
                v-model="cacheIo"
                active-text="开启"
                inactive-text="关闭"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            > -->
          </div>
          <div class="clear-cache">
            <div class="clear-cache-box">
              <span>每天</span>
              <el-time-picker
                v-model="cacheTime"
                style="display: inline-block; width: 140px; margin: 0 8px"
                placeholder="请选择时间点"
                value-format="HH:mm"
                format="HH:mm"
                size="mini"
                @change="cacheTimeChange"
              ></el-time-picker>
              <span>清理</span>
              <el-input-number
                v-model="cache"
                style="display: inline-block; width: 140px; margin: 0 8px"
                :min="1"
                :step="1"
                size="mini"
              ></el-input-number>
              天前数据
            </div>
            <div class="clear-cache-box">
              <el-button size="mini" type="primary" @click="cleanData"
              >保存变更</el-button
              >
              <el-button size="mini" type="primary" @click="dataCleanTask"
              >立即清理</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
@Component({
  name: 'SystemSettings',
  filters: {
    formatTimestamp(date: number | any) {
      return formatTimestamp(date)
    },
  },
})
export default class SystemSettings extends VueBase {
  private reflashFlag = false

  private cache = 1
  private cacheIo = false
  private cacheTime = '00:00'

  private cacheTimeChange(date: Date) {
    console.log(date)
  }

  private async cleanData() {
    this.loadingStart()
    let obj = {
      clean_time: this.cacheTime,
      days_before: this.cache,
      enable: this.cacheIo,
    }
    const res = await this.services.setting.dataClean(obj)
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success('变更成功')
  }
  // 查询清理配置时间
  private async getClineData() {
    this.loadingStart()
    let obj = {}
    const res = await this.services.setting.getDataClean(obj)
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.cache = res.data.days_before
    this.cacheTime = res.data.clean_time
    this.cacheIo = res.data.enable
  }
  // 立即清理
  private async dataCleanTask() {
    this.loadingStart()
    let obj = {
      days_before: this.cache,
    }
    const res = await this.services.setting.dataCleanTask(obj)
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success('清理成功')
  }

  created() {
    this.getClineData()
  }
}
</script>

<style scoped lang="scss">
.system-setting {
  padding: 12px 20px;
  .text {
    font-size: 14px;
  }

  .item {
    font-size: 24px;
    text-align: center;
  }
  .green {
    color: #0a0;
  }
  .red {
    color: #e00;
  }
  .footer {
    text-align: center;
    margin-top: 12px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    position: relative;
    margin: 10px;
    i {
      cursor: pointer;
    }
    .el-icon-refresh {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 16px;
      color: #409eff;
      &.loading {
        animation: rotating 1s linear infinite;
      }
    }
  }
  .clear-cache {
    display: flex;
    justify-content: space-between;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
</style>

