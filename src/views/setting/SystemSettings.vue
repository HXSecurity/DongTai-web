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
    <el-row>
      <el-col :span="24">
        <el-form
          :label-width="$i18n.locale === 'en' ? '120px' : '80px'"
          :model="templateForm"
        >
          <el-form-item label="交叉验证" style="margin-bottom: 0px">
            <el-switch
              v-model="templateForm.status"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
            <a href="javascript:;" style="margin-left:340px;text-decoration: underline;" @click="getDocHandler">扫描器文档</a>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 0"
            label="漏洞类型"
          >
            <el-radio-group
              v-model="templateForm.fid"
              class="scanRadioGroup"
              size="mini"
              @change="isAllSelect"
            >
              <el-radio-button
                v-for="item in strategyTypeList"
                :key="item.level_id"
                :label="item.level_id"
              >
                {{ item.level_name }}{{`(${item.type_value.length})`}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <div>
              <el-checkbox
                v-model="isSelectAll"
                :disabled="$route.query.view"
                @change="selectAllChange"
              ></el-checkbox>
              全选
            </div>
          </el-form-item>
          <el-form-item v-if="strategyTypeList.length > 0">
            <div
              v-for="item in strategyTypeList[
                strategyTypeList.findIndex((i) => i.level_id === templateForm.fid)
              ].type_value"
              :key="item.strategy_id"
              class="typeTag"
              @click.prevent="checkIdChange(item.strategy_id)"
            >
              <el-checkbox
                :disabled="$route.query.view"
                :value="templateForm.content.some((id) => id === item.strategy_id)"
              ></el-checkbox>
              {{ item.vul_name }}
            </div>
          </el-form-item>
        </el-form>
        <div class="box-card" style="margin-top: 24px">
          <el-button type="primary" size="mini" @click="crossValidEdit">保存</el-button>
        </div>
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
  // 新功能添加
  private templateForm: any = {
    content: [],
    fid: 1,
    status: false
  }
  private isSelectAll = false
  private strategyTypeList: Array<{
    level_id: number
    level_name: number
    type_value: Array<{
      strategy_id: number
      level_id: number
      state: string
      vul_name: string
    }>
  }> = []
  
  private cacheTimeChange(date: Date) {
    console.log(date)
  }
  private async strategyTypes() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyTypes()
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    data
      .reduce(
        (
          list: any[],
          item: {
            level_id: number
            level_name: number
            type_value: Array<{
              strategy_id: number
              level_id: number
              state: string
              vul_name: string
            }>
          }
        ) => {
          list = [...list, ...item.type_value]
          return list
        },
        []
      )
      .forEach(
        (item: {
          strategy_id: number
          level_id: number
          state: string
          vul_name: string
        }) => {
          if (item.state === 'enable') {
            this.templateForm.content.push(item.strategy_id)
          }
        }
      )
    this.strategyTypeList = data
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
  
  private checkIdChange(id: number) {
    const idSet = new Set([...this.templateForm.content])
    if (idSet.has(id)) {
      idSet.delete(id)
    } else {
      idSet.add(id)
    }
    this.templateForm.content = [...idSet]
    this.isAllSelect()
  }
  private selectAllChange() {
    const idSet = new Set([...this.templateForm.content])
    this.strategyTypeList[
      this.strategyTypeList.findIndex(
        (i: { level_id: number }) => i.level_id === this.templateForm.fid
      )
    ].type_value.forEach(
      (item: {
        strategy_id: number
        level_id: number
        state: string
        vul_name: string
      }) => {
        if (this.isSelectAll) {
          idSet.add(item.strategy_id)
        } else {
          idSet.delete(item.strategy_id)
        }
      }
    )
    this.templateForm.content = [...idSet]
  }

  isAllSelect() {
    const idSet = new Set([...this.templateForm.content])
    this.isSelectAll = this.strategyTypeList[
      this.strategyTypeList.findIndex(
        (i: { level_id: number }) => i.level_id === this.templateForm.fid
      )
    ].type_value.every(
      (item: {
        strategy_id: number
        level_id: number
        state: string
        vul_name: string
      }) => {
        return idSet.has(item.strategy_id)
      }
    )
  }
  async cressValidGet() {
      const res = await this.services.setting.getCrossValid({});
      if(res.status === 201){
        this.templateForm.status = res.data.validation_status
        this.templateForm.content = [...res.data.strategy_id]
      } else {
        this.$message.error(res.msg)
      }
  }
  async crossValidEdit() {
    // 编辑确认
    const param = {
      strategy_id: [...this.templateForm.content],
      validation_status: this.templateForm.status
    }
    this.loadingStart()
    const res = await this.services.setting.updateCrossValid(
      param
    )
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
    } else {
      this.$message.error(res.msg)
    }
  }
  private async getDocHandler(){
    let res = await this.services.setting.getDocuments({})
    if (res.status === 201) {
      window.open(res.data.url)
    } else {
      this.$message.error(res.msg)
    }
  }
  created() {
    this.getClineData()
    this.strategyTypes()
    this.cressValidGet()
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
  .verfiy-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.typeTag {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}
</style>

