<template>
  <div class="status-monitoring">
    <el-row>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div
            class="item"
            :class="healthData.dongtai_openapi.status ? 'green' : 'red'"
          >
            {{
              healthData.dongtai_openapi.status
                ? $t('views.statusMonitoring.on')
                : $t('views.statusMonitoring.off')
            }}
          </div>
          <div class="footer">
            <span>{{ $t('views.statusMonitoring.dongtai_openapi') }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div
            class="item"
            :class="healthData.dongtai_engine.status ? 'green' : 'red'"
          >
            {{
              healthData.dongtai_engine.status
                ? $t('views.statusMonitoring.on')
                : $t('views.statusMonitoring.off')
            }}
          </div>
          <div class="footer">
            {{ $t('views.statusMonitoring.dongtai_engine') }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="hover">
          <div class="item" :class="healthData.oss.status ? 'green' : 'red'">
            {{
              healthData.oss.status
                ? $t('views.statusMonitoring.on')
                : $t('views.statusMonitoring.off')
            }}
          </div>
          <div class="footer">
            {{ $t('views.statusMonitoring.oss') }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>
              {{ $t('views.statusMonitoring.dongtai_engine') }}
            </span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            > -->
          </div>
          <div
            v-for="(i, k) in healthData.engine_monitoring_indicators"
            :key="k"
            class="text"
          >
            {{ i.name }}:{{ i.value }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            >
          </div>
          <div v-for="o in 3" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            >
          </div>
          <div v-for="o in 3" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'

@Component({
  name: 'StatusMonitoring',
  filters: {
    formatTimestamp(date: number | any) {
      return formatTimestamp(date)
    },
  },
})
export default class StatusMonitoring extends VueBase {
  private healthData = {
    dongtai_openapi: {
      status: 0,
    },
    dongtai_engine: {
      status: 0,
    },
    engine_monitoring_indicators: [
      {
        value: 0,
        name: '',
      },
      {
        value: 0,
        name: '',
      },
    ],
  }
  private async getHealth() {
    const res = await this.services.setting.health()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.healthData = res.data
  }
  created() {
    this.getHealth()
  }
}
</script>

<style scoped lang="scss">
.status-monitoring {
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
    margin: 10px;
  }
}
</style>
