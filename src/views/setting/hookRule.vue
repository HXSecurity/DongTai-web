<template>
  <div class="hook-rule">
    <div class="top-bar">
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
      <div class="top-select">
        <div
          v-for="item in languageOptions"
          :key="item.id"
          :class="activeLanguage === item.id && 'active'"
          @click="activeLanguage !== item.id && changeLanguage(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="info-body">
      <el-tabs v-if="reflash" v-model="type" class="info-tabs">
        <el-tab-pane
          :label="$t('views.hookPage.sourceRule')"
          name="2"
          class="info-tab"
        >
          <HookTable
            v-if="type === '2'"
            :get-base="getBase"
            :active-language="activeLanguage"
            :active-language-name="activeLanguageName"
            :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.propRule')"
          name="1"
          class="info-tab"
        >
          <HookTable
            v-if="type === '1'"
            :get-base="getBase"
            :active-language="activeLanguage"
            :active-language-name="activeLanguageName"
            :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.filterRule')"
          name="3"
          class="info-tab"
        >
          <HookTable
            v-if="type === '3'"
            :get-base="getBase"
            :active-language="activeLanguage"
            :active-language-name="activeLanguageName"
            :rule-type="type"
        /></el-tab-pane>
        <el-tab-pane
          :label="$t('views.hookPage.dangerRule')"
          name="4"
          class="info-tab"
        >
          <DangerTable
            v-if="type === '4'"
            :get-base="getBase"
            :active-language="activeLanguage"
            :active-language-name="activeLanguageName"
            :rule-type="type"
          />
        </el-tab-pane>
        <el-tab-pane label="主动验证" name="5" class="info-tab">
          <VulnTable
            v-if="type === '5'"
            :get-base="getBase"
            :active-language="activeLanguage"
            :active-language-name="activeLanguageName"
            :rule-type="type"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import DangerTable from '@/views/setting/components/dangerTable.vue'
import VulnTable from '@/views/setting/components/vulnTable.vue'
import HookTable from '@/views/setting/components/hookTable.vue'
@Component({
  name: 'HookRule',
  components: {
    DangerTable,
    HookTable,
    VulnTable,
  },
})
export default class ChangePassword extends VueBase {
  activeLanguage = 0
  activeLanguageName = ''
  languageOptions = []
  reflash = false
  changeLanguage(item: any) {
    this.activeLanguage = item.id
    this.activeLanguageName = item.name
    this.reflash = false
    this.$nextTick(() => {
      this.getBase()
      this.reflash = true
    })
  }
  type = '2'
  base = {
    ruleCount: 0,
    typeCount: 0,
    sinkCount: 0,
  }
  async getBase() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.hookRuleSummary({
      language_id: this.activeLanguage,
    })
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
  async getProgramLanguage() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.programLanguage()
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.languageOptions = data
    this.activeLanguage = data[0].id
    this.activeLanguageName = data[0].name
    this.type = '2'
    this.$nextTick(() => {
      this.getBase()
      this.reflash = true
    })
  }
  created() {
    this.getProgramLanguage()
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
  .top-bar {
    display: flex;
    justify-content: space-between;
    .top-select {
      padding: 20px 20px 4px 20px;
      display: flex;
      div {
        width: 60px;
        line-height: 34px;
        text-align: center;
        color: #959fb4;
        // background: aliceblue;
        border: 2px solid aliceblue;
        cursor: pointer;
        //
        & + div {
          border-left: none;
        }
        &.active {
          color: #4a72ae;
          background: aliceblue;
        }
      }
    }
  }
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
