<template>
  <main>
    <div class="change-pwd">
      <el-card
        v-for="(submitForm, index) in Hooks"
        :key="index"
        shandow="never"
        style="margin-bottom: 20px"
      >
        <div slot="header" class="clearfix">
          <span>WebHook</span>
          <span>
            <el-button
              style="float: right; padding: 3px 0; margin-left: 12px"
              type="text"
              @click="save(index)"
            >
              保存</el-button
            >
            <el-button
              style="float: right; padding: 3px 0; margin-left: 12px"
              type="text"
              @click="minus(index)"
            >
              删除</el-button
            >
          </span>
        </div>
        <el-form
          ref="ruleForm"
          class="ruleForm"
          :model="submitForm"
          :label-width="$i18n.locale == 'en' ? '160px' : '80px'"
          status-icon
        >
          <el-form-item label="url" prop="url">
            <el-input
              v-model="submitForm.url"
              size="mini"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <el-form-item label="type" prop="type">
            <el-select
              v-model="submitForm.type_id"
              size="mini"
              show-password
              style="width: 100%"
            >
              <el-option
                v-for="item in hookTypes"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Headers" prop="Headers">
            <el-input
              v-model="submitForm.headers"
              type="textarea"
              size="mini"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div style="float: right; height: 42px">
        <el-button size="mini" type="primary" class="btn" @click="add">
          新增
        </el-button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'Webhook' })
export default class Webhook extends VueBase {
  public Hooks: any = [
    {
      url: '',
      type_id: '',
      headers: '',
    },
  ]
  public hookTypes = []
  public add() {
    this.Hooks.push({
      url: '',
      type_id: '',
      headers: '',
    })
  }
  public async minus(index: number) {
    if (!this.Hooks[index].id) {
      this.Hooks.splice(index, 1)
      return
    }
    this.$confirm(
      this.$t('views.webhook.deleteConfirm') as string,
      this.$t('views.webhook.deleteConfirmPop') as string,
      {
        confirmButtonText: this.$t('views.userList.submit') as string,
        cancelButtonText: this.$t('views.userList.cancel') as string,
        type: 'warning',
      }
    ).then(async (i: any) => {
      const res = await this.services.setting.webhook_delete({
        id: this.Hooks[index].id,
      })
      if (res.status === 201) {
        this.$message.success(res.msg)
        this.Hooks.splice(index, 1)
        return
      }
      this.$message.error(res.msg)
    })
  }
  public async getTypeList() {
    const res = await this.services.setting.webhook_type()
    this.hookTypes = res.data.result
  }
  public async getWebhook() {
    const res = await this.services.setting.webhook_get()
    res.data.result &&
      res.data.result.forEach((item: any) => {
        if (item.headers) {
          item.headers = JSON.stringify(item.headers)
        } else {
          item.headers = ''
        }
      })
    this.Hooks = res.data.result
  }
  public async save(index: any) {
    const req = JSON.parse(JSON.stringify(this.Hooks[index]))
    if (req.headers) {
      req.headers = JSON.parse(req.headers)
    }
    const res = await this.services.setting.webhook_set(req)
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.Hooks[index].id = res.data.id
      return
    }
    this.$message.error(res.msg)
  }
  created() {
    this.getTypeList()
    this.getWebhook()
  }
}
</script>

<style scoped lang="scss">
main {
  .btn {
    background: #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
  }
  padding: 10px;
  .change-pwd {
    padding: 0 80px;
    .ruleForm {
      width: 620px;
    }
    ::v-deep.el-input__inner {
      border-radius: 2px;
    }
  }
  .header-row {
    display: flex;
    .el-input {
      flex: 2;
      + .el-input {
        margin: 0 8px;
      }
    }
    .header-btn {
      flex: 1;
    }
    & + .header-row {
      margin-top: 4px;
    }
  }
}
</style>
