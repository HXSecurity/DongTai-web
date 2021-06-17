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
          <!-- <el-radio
            v-model="submitForm.mode"
            :label="$t('views.projectEdit.mode2')"
            >{{ $t('views.projectEdit.mode2') }}</el-radio
          > -->
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
              :label="item.short_name"
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
        <el-form-item :label="$t('views.projectEdit.scan')" prop="scanId">
          <el-select
            v-model="submitForm.scanId"
            style="width: 412px"
            :placeholder="$t('views.projectEdit.scanPlaceholder')"
            @change="agentChange"
          >
            <el-option
              v-for="item in strategyList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
          <i
            class="el-icon-circle-plus-outline addStrategyIcon"
            @click="scanAddDialogShow"
          >
            {{ $t('views.projectEdit.scanAdd') }}
          </i>
        </el-form-item>
        <el-form-item
          :label="$t('views.projectEdit.version_name')"
          prop="version_name"
        >
          <el-input
            v-model="submitForm.version_name"
            style="width: 412px"
            :placeholder="$t('views.projectEdit.versionNamePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.projectEdit.description')"
          prop="description"
        >
          <el-input
            v-model="submitForm.description"
            style="width: 412px"
            :placeholder="$t('views.projectEdit.descriptionPlaceholder')"
          ></el-input>
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
    <el-dialog :visible.sync="scanAddDialogOpen" title="创建策略" width="650px">
      <div>
        <el-form label-width="80px">
          <el-form-item label="策略名称">
            <el-input
              v-model="scanForm.name"
              class="commonInput"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="漏洞类型" style="margin-bottom: 0">
            <el-radio-group
              v-model="scanForm.fid"
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
          <el-form-item style="margin-bottom: 0">
            <div>
              <el-checkbox
                v-model="isSelectAll"
                @change="selectAllChange"
              ></el-checkbox>
              全选
            </div>
          </el-form-item>
          <el-form-item v-if="strategyTypeList.length > 0">
            <div
              v-for="item in strategyTypeList[
                strategyTypeList.findIndex((i) => i.level_id === scanForm.fid)
              ].type_value"
              :key="item.strategy_id"
              class="typeTag"
              @click.prevent="checkIdChange(item.strategy_id)"
            >
              <el-checkbox
                :value="scanForm.ids.some((id) => id === item.strategy_id)"
              ></el-checkbox>
              {{ item.vul_name }}
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" class="submit" @click="strategyUserAdd">
          保存
        </el-button>
        <el-button
          type="text"
          class="cancel"
          @click="scanAddDialogOpen = false"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
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
    scanId: number | undefined
    version_name: string
    description: string
  } = {
    name: '',
    mode: this.$t('views.projectEdit.mode1') as string,
    agentIdList: [],
    scanId: undefined,
    version_name: '',
    description: '',
  }
  private engineList: Array<{
    id: number
    short_name: string
    token: string
  }> = []
  private engineSelectedList: Array<{
    id: number
    token: string
  }> = []
  private strategyList: Array<{ id: number; name: string }> = []
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
  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.projectEdit.namePlaceholder'),
        trigger: 'blur',
      },
    ],
    scanId: [
      {
        required: true,
        message: this.$t('views.projectEdit.scanPlaceholder'),
        trigger: 'change',
      },
    ],
  }

  private scanAddDialogOpen = false
  private scanForm: {
    ids: Array<number>
    name: string
    fid: number
  } = {
    ids: [],
    fid: 1,
    name: '',
  }
  private isSelectAll = false

  async created() {
    await this.getEngineList()
    await this.strategyUserList()
    if (this.$route.params.pid) {
      await this.projectDetail()
    }
  }

  private scanAddDialogShow() {
    this.scanAddDialogOpen = true
    this.scanForm = {
      ids: [],
      fid: 1,
      name: '',
    }
    this.strategyTypes()
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
    this.submitForm.scanId = data.scan_id
    this.submitForm.version_name = data.versionData?.version_name
    this.submitForm.description = data.versionData?.description
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
  private selectAllChange() {
    const idSet = new Set([...this.scanForm.ids])
    this.strategyTypeList[
      this.strategyTypeList.findIndex(
        (i: { level_id: number }) => i.level_id === this.scanForm.fid
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
    this.scanForm.ids = [...idSet]
  }
  private checkIdChange(id: number) {
    const idSet = new Set([...this.scanForm.ids])
    if (idSet.has(id)) {
      idSet.delete(id)
    } else {
      idSet.add(id)
    }
    this.scanForm.ids = [...idSet]
    this.isAllSelect()
  }

  isAllSelect() {
    const idSet = new Set([...this.scanForm.ids])
    this.isSelectAll = this.strategyTypeList[
      this.strategyTypeList.findIndex(
        (i: { level_id: number }) => i.level_id === this.scanForm.fid
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

  private async strategyUserList() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyUserList()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.strategyList = data
  }

  private async strategyTypes() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyTypes()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
            this.scanForm.ids.push(item.strategy_id)
          }
        }
      )
    this.strategyTypeList = data
  }

  private async strategyUserAdd() {
    const params = {
      ids: this.scanForm.ids.join(','),
      name: this.scanForm.name,
    }
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyUserAdd(
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.scanAddDialogOpen = false
    this.strategyUserList()
    // 设置策略id为刚增加的策略
    this.submitForm.scanId = data.id
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
          scan_id: number
          pid?: string
          version_name: string | undefined
          description: string | undefined
        } = {
          name: this.submitForm.name,
          mode: this.submitForm.mode,
          agent_ids: this.submitForm.agentIdList.join(','),
          scan_id: this.submitForm.scanId as number,
          version_name: this.submitForm.version_name
            ? this.submitForm.version_name
            : undefined,
          description: this.submitForm.description
            ? this.submitForm.description
            : undefined,
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

  .addStrategyIcon {
    color: #1a80f2;
    font-size: 14px;
    cursor: pointer;
    margin-left: 10px;
  }
}

.typeTag {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
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
</style>
