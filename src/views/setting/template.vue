<template>
  <div class="template">
    <el-page-header class="header" @back="goBack"></el-page-header>
    <el-form
      ref="ruleForm"
      :label-width="$i18n.locale === 'en' ? '120px' : '80px'"
      :model="templateForm"
      :rules="rules"
    >
      <el-form-item :label="$t('views.templateManage.name')" prop="name">
        <div v-if="$route.query.view">
          {{ templateForm.name }}
        </div>
        <el-input v-else v-model="templateForm.name" filterable> </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('views.templateManage.fid')"
        style="margin-bottom: 0"
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
            {{ item.level_name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!$route.query.view" style="margin-bottom: 0">
        <div>
          <el-checkbox
            v-model="isSelectAll"
            :disabled="$route.query.view"
            @change="selectAllChange"
          ></el-checkbox>
          {{ $t('views.templateManage.selectAll') }}
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
      <el-form-item :label="$t('views.templateManage.status')">
        <div v-if="$route.query.view">
          {{
            templateForm.status === 1
              ? $t('views.hookPage.on')
              : $t('views.hookPage.off')
          }}
        </div>
        <el-switch
          v-else
          v-model="templateForm.status"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div v-if="!$route.query.view" slot="footer" style="text-align: center">
      <el-button type="text" class="submit" @click="templateDialogEnter">
        {{ $t('views.projectEdit.save') }}
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'templateManage' })
export default class templateManage extends VueBase {
  private templateForm: any = {
    content: [],
    fid: 1,
    name: '',
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
  private checkIdChange(id: number) {
    if (this.$route.query.view) {
      return
    }
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

  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.templateManage.nameR') as string,
        trigger: 'blur',
      },
    ],
  }

  async templateAdd() {
    // 新增确认
    this.loadingStart()
    const res = await this.services.setting.create_scan_strategy(
      this.templateForm
    )
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.goBack()
    } else {
      this.$message.error(res.msg)
    }
  }
  async templateEdit() {
    // 编辑确认
    this.loadingStart()
    const res = await this.services.setting.update_scan_strategy(
      this.templateForm
    )
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.goBack()
    } else {
      this.$message.error(res.msg)
    }
  }
  async templateDialogEdit() {
    // 编辑获取数据
    const res = await this.services.setting.get_scan_strategy_one({
      id: this.$route.query.id,
    })
    if (res.status === 201) {
      this.templateForm.id = res.data.id
      this.templateForm.name = res.data.name
      this.templateForm.content = res.data.content
      this.templateForm.status = res.data.status
      this.isAllSelect()
    } else {
      this.$message.error(res.msg)
    }
  }
  templateDialogEnter() {
    const form: any = this.$refs.ruleForm
    form.validate((valid: boolean) => {
      if (valid) {
        if (this.$route.query.id) {
          this.templateEdit()
        } else {
          this.templateAdd()
        }
      }
    })
  }
  async goBack() {
    this.$router.push({ name: 'templateManage' })
  }
  async created() {
    this.loadingStart()
    await this.strategyTypes()
    if (this.$route.query.id) {
      await this.templateDialogEdit()
    }
    this.loadingDone()
  }
}
</script>

<style scoped lang="scss">
.template {
  padding: 24px;
}
.header {
  padding-bottom: 16px;
  color: #4a72ae;
  ::v-deep.el-page-header__left::after {
    display: none;
  }
}
::v-deep.el-card__header {
  background: rgba(255, 150, 87, 0.1);
  padding: 8px !important;
  border-bottom: none;
  .clearfix {
    background: rgba(255, 226, 208, 1);
    padding: 8px;
    .beta {
      display: inline-block;
      padding: 0px 6px;
      margin-left: 4px;
      color: #ff9657;
      background: #ffceb0;
      border-radius: 8px 8px 8px 0px;
    }
  }
}
::v-deep.el-card__body {
  background: rgba(255, 150, 87, 0.1);
  padding: 16px;
  padding-top: 0;
}
.content-warp {
  padding: 38px 14px 40px 14px;
}
.search-input {
  border-right: none;
}
.search-box {
  display: flex;
  align-items: center;
  ::v-deep.el-input__inner {
    border-right: none;
    border-radius: 0;
  }
}
.btn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  &.search {
    height: 34px;
    margin-left: -1px;
  }
}
.btn-border {
  border-radius: 2px;
  color: #4a72ae;
  border-color: #4a72ae;
}
.submit {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}
.cancel {
  width: 124px;
  height: 38px;
  line-height: 0;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}
.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.box-card {
  padding-bottom: 20px;
}
.test-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  border-radius: 4px;
  border: none;
  background: rgba(26, 128, 242, 0.1);
  color: rgba(26, 128, 242, 1);
}
.el-icon-question {
  font-size: 16px;
  margin-left: 6px;
  color: rgba(182, 187, 197, 1);
}

.typeTag {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}
</style>
