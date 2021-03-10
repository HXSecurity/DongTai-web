<template>
  <div class="hook-rule">
    <div class="top-info">
      <div class="column">
        <span class="top-title">规则总数</span>
        <span class="bottom-info">{{ base.ruleCount }}条</span>
      </div>
      <div class="column">
        <span class="top-title">规则类型</span>
        <span class="bottom-info">{{ base.typeCount }}种</span>
      </div>
      <div class="column">
        <span class="top-title">sink规则数量</span>
        <span class="bottom-info">{{ base.sinkCount }}条</span>
      </div>
    </div>
    <div class="info-body">
      <el-tabs v-model="type">
        <el-tab-pane label="污点源方法规则" name="1">
          <HookTable v-if="type === '1'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane label="传播方法规则" name="2">
          <HookTable v-if="type === '2'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane label="过滤方法规则" name="3">
          <HookTable v-if="type === '3'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane label="危险方法规则" name="4">
          <DangerTable v-if="type === '4'" :rule-type="type" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import DangerTable from '@/views/setting/components/dangerTable.vue'
import HookTable from '@/views/setting/components/hookTable.vue'
@Component({
  name: 'HookRule',
  components: {
    DangerTable,
    HookTable,
  },
})
export default class ChangePassword extends VueBase {
  type = '1'
  base = {
    ruleCount: 0,
    typeCount: 0,
    sinkCount: 0,
  }
  async getBase() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.hookRuleSummary()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.base = data
  }
  created() {
    this.getBase()
  }
}
</script>

<style scoped lang="scss">
.hook-rule {
  padding: 20px;
  .top-info {
    display: flex;
    justify-content: space-around;
    padding: 20px 20px;
    .column {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      + .column {
        border-left: 1px solid #ccc;
      }
      .top-title {
        font-size: 16px;
        line-height: 24px;
        color: #333;
      }
      .bottom-info {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
}
</style>
