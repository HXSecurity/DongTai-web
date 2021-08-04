<template>
  <div class="hook-rule">
    <div class="top-info">
      <div class="column">
        <span class="top-title">{{ $t('views.hookPage.allHooksNum') }}:</span>
        <span class="bottom-info">{{ base.ruleCount }}</span>
        {{ $t('views.hookPage.strip') }}
      </div>
      <div class="column">
        <span class="top-title">{{ $t('views.hookPage.hooksType') }}:</span>
        <span class="bottom-info">{{ base.typeCount }}</span>
        {{ $t('views.hookPage.race') }}
      </div>
      <div class="column">
        <span class="top-title"
          >{{ $t('views.hookPage.sinkHooksNum') }}:</span
        >
        <span class="bottom-info">{{ base.sinkCount }}</span>
        {{ $t('views.hookPage.strip') }}
      </div>
    </div>
    <div class="info-body">
      <el-tabs v-model="type" class="info-tabs">
        <el-tab-pane
          :label="$t('views.hookPage.sourceRule')"
          name="2"
          class="info-tab"
        >
          <HookTable v-if="type === '2'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.propRule')"
          name="1"
          class="info-tab"
        >
          <HookTable v-if="type === '1'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.filterRule')"
          name="3"
          class="info-tab"
        >
          <HookTable v-if="type === '3'" :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.dangerRule')"
          name="4"
          class="info-tab"
        >
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
  type = '2'
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
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.base = data
  }
  created() {
    this.getBase()
  }
}
</script>

<style lang="scss">
.hook-rule {
  .info-tabs {
    .el-tabs__header {
      margin: 12px 20px 0px 20px;
    }
    .el-tabs__item {
      &:hover {
        color: #000;
      }
      &.is-active {
        color: #1a80f2;
      }
    }

    //.el-tabs__header {
    //  background: #fff;
    //  .el-tabs__nav-wrap {
    //    &::after {
    //      display: none;
    //    }
    //  }
    //  .el-tabs__active-bar {
    //    display: none;
    //  }
    //  .el-tabs__item {
    //    border: 1px solid #ccc;
    //    height: 32px;
    //    padding: 10px 20px;
    //    line-height: 14px;
    //    margin-left: 12px;
    //    border-radius: 3px;
    //    &.is-active {
    //      border: 1px solid #2d82ff !important;
    //    }
    //  }
    //}
  }
}
</style>

<style scoped lang="scss">
.hook-rule {
  padding: 20px;
  .top-info {
    display: flex;
    padding: 20px 20px 4px 20px;
    .column {
      display: flex;
      align-items: center;
      + .column {
        margin-left: 60px;
      }
      .top-title {
        font-size: 14px;
        color: #959fb4;
      }
      .bottom-info {
        font-size: 14px;
        margin: 0 6px;
        color: #38435a;
      }
    }
  }
}
</style>
