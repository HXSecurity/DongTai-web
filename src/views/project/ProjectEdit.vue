<template>
  <main class="container">
    <div style="height: 28px"></div>
    <div class="content-warp">
      <div class="back" @click="$router.push('/project')">
        <i class="el-icon-back"></i>返回
      </div>
      <div class="title">{{ $t('views.projectEdit.title') }}</div>
      <el-form
        ref="submitForm"
        :model="submitForm"
        label-width="100px"
        style="margin-top: 32px"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('views.projectEdit.name')" prop="name">
          <el-input
            v-model="submitForm.name"
            style="width: 412px"
            :placeholder="$t('views.projectEdit.namePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.projectEdit.mode')">
          <el-radio
            v-model="submitForm.mode"
            :label="$t('views.projectEdit.mode1')"
            >{{ $t('views.projectEdit.mode1') }}</el-radio
          >
          <el-radio
            v-model="submitForm.mode"
            :label="$t('views.projectEdit.mode2')"
            >{{ $t('views.projectEdit.mode2') }}</el-radio
          >
        </el-form-item>
        <el-form-item :label="$t('views.projectEdit.agent')">
          <el-select
            v-model="submitForm.agentIdList"
            multiple
            style="width: 412px"
            :placeholder="$t('views.projectEdit.agentPlaceholder')"
            @change="agentChange"
          >
            <el-option
              v-for="item in engineList"
              :key="item.id"
              :value="item.id"
              :label="item.token"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.projectEdit.added')">
          <el-tag
            v-for="(tag, index) in engineSelectedList"
            :key="tag.id"
            closable
            type="info"
            style="margin-right: 10px"
            @close="idDelete(index)"
          >
            {{ tag.token }}
          </el-tag>
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            size="small"
            class="submit-btn"
            @click="projectAdd"
            >{{ $t('views.projectEdit.submit') }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Component({ name: 'ProjectEdit' })
export default class ProjectEdit extends VueBase {
  private submitForm: {
    name: string
    mode: string
    agentIdList: Array<number>
  } = {
    name: '',
    mode: this.$t('views.projectEdit.mode1') as string,
    agentIdList: [],
  }
  private engineList: Array<{ id: number; token: string }> = []
  private engineSelectedList: Array<{ id: number; token: string }> = []

  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.projectEdit.namePlaceholder'),
        trigger: 'blur',
      },
    ],
  }

  async created() {
    await this.getEngineList()
    if (this.$route.params.pid) {
      await this.projectDetail()
    }
  }

  private async projectDetail() {
    const { status, msg, data } = await this.services.project.projectDetail(
      this.$route.params.pid
    )
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.submitForm.name = data.name
    this.submitForm.mode = data.mode
    this.submitForm.agentIdList = data.agents.map((item: { id: any }) => {
      return item.id
    })
    this.agentChange()
  }

  private async getEngineList() {
    const idParams = this.$route.params.pid || '0'
    const { status, msg, data } = await this.services.project.getEngineList(
      idParams
    )
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.engineList = data
  }

  private agentChange() {
    this.engineSelectedList = this.engineList.reduce(
      (
        list: Array<{ id: number; token: string }>,
        item: { id: number; token: string }
      ) => {
        if (this.submitForm.agentIdList.includes(item.id)) {
          list.push({ ...item })
        }
        return list
      },
      []
    )
  }

  private idDelete(index: number) {
    this.submitForm.agentIdList = [
      ...this.submitForm.agentIdList.slice(0, index),
      ...this.submitForm.agentIdList.slice(index + 1),
    ]
    this.agentChange()
  }

  private projectAdd() {
    ;(this.$refs.submitForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: {
          name: string
          mode: string | any
          agent_ids: string
          pid?: string
        } = {
          name: this.submitForm.name,
          mode: this.submitForm.mode,
          agent_ids: this.submitForm.agentIdList.join(','),
        }
        if (this.$route.params.pid) {
          params.pid = this.$route.params.pid
        }
        const { status, msg } = await this.services.project.projectAdd(params)
        if (status !== 201) {
          this.$message.error(msg)
          return
        }
        this.$message.success(msg)
        await this.$router.push('/project')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 18px;
  background: #fff;
  min-height: calc(100vh - 92px);

  .back {
    color: #9ea3a8;
    cursor: pointer;

    i {
      font-size: 16px;
      margin-right: 8px;
    }
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #38435a;
    margin-top: 22px;
  }

  .submit-btn {
    width: 114px;
    border-radius: 2px;
    border: 1px solid #1a80f2;
    color: #1a80f2;
  }
}
</style>
