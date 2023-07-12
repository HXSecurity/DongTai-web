<template>
  <main class="container">
    <div style="height: 28px"></div>
    <div class="content-warp">
      <div class="back">
        <span @click="$router.go(-1)">
          <i class="el-icon-arrow-left"></i>{{ $t('views.projectEdit.back') }}
        </span>
      </div>
      <div class="info-content">
        <div v-if="newEdit" class="info-content-warp">
          <div v-for="(i, k) in prjectEditMenu" :key="k">
            <template v-if="i.children.length === 0">
              <div
                class="info-content-item"
                :class="changeMenu === i.name ? 'currentModule' : ''"
                @click="changeMenu = i.name"
              >
                {{ i.name }}
              </div>
            </template>
          </div>
        </div>
        <div v-if="newEdit" class="info-box">
          <div v-if="changeMenu === '基础设置'" class="info">
            <div class="title">项目设置</div>
            <el-form
              ref="submitForm"
              :model="submitForm"
              :label-width="$i18n.locale === 'en' ? '160px' : '120px'"
              status-icon
              :rules="rules"
            >
              <el-form-item :label="$t('views.projectEdit.name')" prop="name">
                <el-input
                  v-model="submitForm.name"
                  style="width: 500px"
                  :placeholder="$t('views.projectEdit.namePlaceholder')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('views.deploy.openLog')"
                prop="enable_log"
              >
                <el-select
                  v-model="submitForm.enable_log"
                  clearable
                  :placeholder="$t('views.deploy.openLogPlaceholder')"
                >
                  <el-option label="yes" :value="true" />
                  <el-option label="no" :value="false" />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('views.deploy.logLevel')"
                prop="log_level"
              >
                <el-select
                  v-model="submitForm.log_level"
                  clearable
                  :placeholder="$t('views.deploy.logLevelPlaceholder')"
                >
                  <el-option label="TRACE" value="TRACE" />
                  <el-option label="INFO" value="INFO" />
                  <el-option label="DEBUG" value="DEBUG" />
                  <el-option label="WARN" value="WARN" />
                  <el-option label="ERROR" value="ERROR" />
                </el-select>
              </el-form-item>
              <template v-if="!advanced">
                <el-form-item>
                  <span class="advancedSetting" @click="advanced = true">
                    {{ $t('views.projectEdit.advanced') }}
                  </span>
                </el-form-item>
              </template>
              <template v-if="advanced">
                <el-form-item :label="$t('views.projectEdit.vul_verifiy')">
                  <el-radio v-model="submitForm.vul_validation" :label="0">
                    {{ $t('views.projectEdit.followAll') }}
                  </el-radio>
                  <el-radio v-model="submitForm.vul_validation" :label="1">
                    {{ $t('views.projectEdit.off') }}
                  </el-radio>
                  <el-radio v-model="submitForm.vul_validation" :label="2">
                    {{ $t('views.projectEdit.on') }}
                  </el-radio>
                </el-form-item>
                <!-- <el-form-item>
                <template slot="label">
                  {{ $t('views.projectEdit.agent') }}
                  <el-popover placement="top-start" width="340" trigger="hover">
                    <p>{{ $t('views.projectEdit.agent_popover') }}</p>
                    <span slot="reference">
                      <i class="el-icon-question"></i>
                    </span>
                  </el-popover>
                </template>
                <el-select
                  v-model="submitForm.agentIdList"
                  multiple
                  filterable
                  style="width: 500px"
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
              </el-form-item> -->
                <el-form-item prop="version_name">
                  <template slot="label">
                    {{ $t('views.projectEdit.version_name') }}
                    <el-popover
                      placement="top-start"
                      width="340"
                      trigger="hover"
                    >
                      <p>{{ $t('views.projectEdit.version_name_popover') }}</p>
                      <span slot="reference">
                        <i class="el-icon-question"></i>
                      </span>
                    </el-popover>
                  </template>
                  <el-input
                    v-model="submitForm.version_name"
                    style="width: 500px"
                    :placeholder="
                      $t('views.projectEdit.versionNamePlaceholder')
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('views.projectEdit.description')"
                  prop="description"
                >
                  <el-input
                    v-model="submitForm.description"
                    style="width: 500px"
                    :placeholder="
                      $t('views.projectEdit.descriptionPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item>
                <el-button
                  type="text"
                  size="small"
                  class="submit-btn clear"
                  @click="$router.go(-1)"
                  >取消</el-button
                >
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
          <div v-else class="info1">
            <el-tabs v-model="type" class="info-tabs" style="margin-top: 14px">
              <el-tab-pane label="黑名单" name="1" class="info-tab">
                <HookTable
                  v-if="type === '1'"
                  :project-id="$route.params.pid"
                  :rule-type="type"
              /></el-tab-pane>
              <el-tab-pane label="白名单" name="2" class="info-tab">
                <HookTable
                  v-if="type === '2'"
                  :project-id="$route.params.pid"
                  :rule-type="type"
              /></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div v-else class="info-box1">
          <div class="info">
            <div class="title">项目设置</div>
            <el-form
              ref="submitForm"
              :model="submitForm"
              :label-width="$i18n.locale === 'en' ? '160px' : '120px'"
              status-icon
              :rules="rules"
            >
              <el-form-item :label="$t('views.projectEdit.name')" prop="name">
                <el-input
                  v-model="submitForm.name"
                  style="width: 500px"
                  :placeholder="$t('views.projectEdit.namePlaceholder')"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('views.deploy.openLog')"
                prop="enable_log"
              >
                <el-select
                  v-model="submitForm.enable_log"
                  clearable
                  :placeholder="$t('views.deploy.openLogPlaceholder')"
                >
                  <el-option label="yes" :value="true" />
                  <el-option label="no" :value="false" />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('views.deploy.logLevel')"
                prop="log_level"
              >
                <el-select
                  v-model="submitForm.log_level"
                  clearable
                  :placeholder="$t('views.deploy.logLevelPlaceholder')"
                >
                  <el-option label="TRACE" value="TRACE" />
                  <el-option label="INFO" value="INFO" />
                  <el-option label="DEBUG" value="DEBUG" />
                  <el-option label="WARN" value="WARN" />
                  <el-option label="ERROR" value="ERROR" />
                </el-select>
              </el-form-item>
              <template v-if="!advanced">
                <el-form-item>
                  <span class="advancedSetting" @click="advanced = true">
                    {{ $t('views.projectEdit.advanced') }}
                  </span>
                </el-form-item>
              </template>
              <template v-if="advanced">
                <el-form-item :label="$t('views.projectEdit.vul_verifiy')">
                  <el-radio v-model="submitForm.vul_validation" :label="0">
                    {{ $t('views.projectEdit.followAll') }}
                  </el-radio>
                  <el-radio v-model="submitForm.vul_validation" :label="1">
                    {{ $t('views.projectEdit.off') }}
                  </el-radio>
                  <el-radio v-model="submitForm.vul_validation" :label="2">
                    {{ $t('views.projectEdit.on') }}
                  </el-radio>
                </el-form-item>
                <!-- <el-form-item>
                <template slot="label">
                  {{ $t('views.projectEdit.agent') }}
                  <el-popover placement="top-start" width="340" trigger="hover">
                    <p>{{ $t('views.projectEdit.agent_popover') }}</p>
                    <span slot="reference">
                      <i class="el-icon-question"></i>
                    </span>
                  </el-popover>
                </template>
                <el-select
                  v-model="submitForm.agentIdList"
                  multiple
                  filterable
                  style="width: 500px"
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
              </el-form-item> -->
                <el-form-item prop="version_name">
                  <template slot="label">
                    {{ $t('views.projectEdit.version_name') }}
                    <el-popover
                      placement="top-start"
                      width="340"
                      trigger="hover"
                    >
                      <p>{{ $t('views.projectEdit.version_name_popover') }}</p>
                      <span slot="reference">
                        <i class="el-icon-question"></i>
                      </span>
                    </el-popover>
                  </template>
                  <el-input
                    v-model="submitForm.version_name"
                    style="width: 500px"
                    :placeholder="
                      $t('views.projectEdit.versionNamePlaceholder')
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('views.projectEdit.description')"
                  prop="description"
                >
                  <el-input
                    v-model="submitForm.description"
                    style="width: 500px"
                    :placeholder="
                      $t('views.projectEdit.descriptionPlaceholder')
                    "
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item>
                <el-button
                  type="text"
                  size="small"
                  class="submit-btn clear"
                  @click="$router.go(-1)"
                  >取消</el-button
                >
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
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="scanAddDialogOpen"
      :title="$t('views.projectEdit.addScan')"
      width="650px"
    >
      <div>
        <el-form :label-width="$i18n.locale === 'en' ? '120px' : '80px'">
          <el-form-item :label="$t('views.projectEdit.scanName')">
            <el-input
              v-model="scanForm.name"
              class="commonInput"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.projectEdit.fid')"
            style="margin-bottom: 0"
          >
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
              {{ $t('views.projectEdit.selectAll') }}
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
          {{ $t('views.projectEdit.save') }}
        </el-button>
        <el-button
          type="text"
          class="cancel"
          @click="scanAddDialogOpen = false"
        >
          {{ $t('views.projectEdit.clear') }}
        </el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { Form } from 'element-ui'
import HookTable from '@/views/project/components/hookTable.vue'

@Component({
  name: 'ProjectEdit',
  components: {
    HookTable,
  },
})
export default class ProjectEdit extends VueBase {
  private prjectEditMenu = [
    {
      id: 0,
      name: '基础设置',
      children: [],
    },
    {
      id: 1,
      name: 'Server设置',
      open: false,
      children: [
        {
          f: 1,
          fname: 'Server设置',
          id: 2,
          name: '用户代码识别',
        },
      ],
    },
  ]
  private newEdit = false
  private changeMenu = '基础设置'
  private type = '1'
  private advanced = false
  private departmentList = []
  private radio = ''
  private submitForm: {
    name: string
    mode: string
    agentIdList: Array<number>
    version_name: string
    description: string
    vul_validation: number
    base_url: string
    test_req_header_key: string
    test_req_header_value: string
    log_level: any
    enable_log: any
  } = {
    name: '',
    mode: this.$t('views.projectEdit.mode1') as string,
    agentIdList: [],
    version_name: '',
    description: '',
    vul_validation: 0,
    base_url: '',
    test_req_header_key: '',
    test_req_header_value: '',
    log_level: '',
    enable_log: '',
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
  private Hopen(i: any) {
    i.open = !i.open
    let arr = i.children.map((item: any) => {
      return item.name
    })
    console.log(arr)
    if (arr.includes(this.changeMenu)) {
      return
    }
    // this.changeMenu = i.children[0].name
  }
  private async getListDepartment() {
    // 部门list
    const res = await this.services.deploy.getDepartment({})
    if (res.status === 201) {
      this.departmentList = res.data
      return
    }
    this.$message.error(res.msg)
  }
  async created() {
    if (this.$route.params.pid) {
      this.newEdit = true
    }
    await this.getEngineList()
    await this.getListDepartment()
    await this.strategyUserList()
    if (this.$route.params.pid) {
      await this.projectDetail()
      await this.getHeaderId()
    }
    this.changeMenu = '基础设置'
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
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }

    if (!this.strategyList.some((item) => data.scan_id === item.id)) {
      this.strategyList.push({ id: data.scan_id, name: data.scan_name })
    }

    this.submitForm.name = data.name
    this.submitForm.mode = data.mode
    this.submitForm.agentIdList = data.agents.map((item: { id: any }) => {
      return item.id
    })
    this.submitForm.version_name = data.versionData?.version_name
    this.submitForm.description = data.versionData?.description
    this.submitForm.vul_validation = data.vul_validation
    this.submitForm.base_url = data.base_url
    this.submitForm.test_req_header_key = data.test_req_header_key
    this.submitForm.test_req_header_value = data.test_req_header_value
    this.submitForm.enable_log = data.enable_log
    this.submitForm.log_level = data.log_level
    this.agentChange()
  }

  private async getEngineList() {
    const idParams = this.$route.params.pid || '0'
    const { status, msg, data } = await this.services.project.getEngineList(
      idParams
    )
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
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
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.strategyList = data
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
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.scanAddDialogOpen = false
    this.strategyUserList()
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
          version_name: string | undefined
          description: string | undefined
          vul_validation: number
          base_url: string
          test_req_header_key: string
          test_req_header_value: string
          enable_log: any
          log_level: any
        } = {
          name: this.submitForm.name,
          mode: this.submitForm.mode,
          agent_ids: this.submitForm.agentIdList.join(','),
          version_name: this.submitForm.version_name
            ? this.submitForm.version_name
            : undefined,
          description: this.submitForm.description
            ? this.submitForm.description
            : undefined,
          vul_validation: this.submitForm.vul_validation,
          base_url: this.submitForm.base_url,
          test_req_header_key: this.submitForm.test_req_header_key,
          test_req_header_value: this.submitForm.test_req_header_value,
          enable_log: this.submitForm.enable_log,
          log_level: this.submitForm.log_level,
        }
        if (this.$route.params.pid) {
          params.pid = this.$route.params.pid
        }
        const { status, msg } = await this.services.project.projectAdd(params)
        if (status !== 201) {
          this.$message({
            type: 'error',
            message: msg,
            showClose: true,
          })
          return
        }
        this.$message({
          type: 'success',
          message: msg,
          showClose: true,
        })
        await this.$router.go(-1)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private header_id = []
  private async getHeaderId() {
    const res = await this.services.project.req_headers({
      id: this.$route.params.pid,
    })
    if (res.status === 201) {
      this.header_id = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 18px;
  background: #fff;
  min-height: calc(100vh - 92px);

  .back {
    color: #0085ff;
    cursor: pointer;

    i {
      font-size: 16px;
      margin-right: 8px;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #38435a;
    margin-top: 24px;
    margin-bottom: 32px;
  }

  .submit-btn {
    border: 1px solid #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
    color: #ffffff;
    border-radius: 2px;
    padding: 6px 16px;
    &.clear {
      border: 1px solid #959fb4;
      border-color: #959fb4;
      background: #ffffff;
      color: #959fb4;
      border-radius: 2px;
      padding: 6px 16px;
    }
  }

  .addStrategyIcon {
    color: #1a80f2;
    font-size: 14px;
    cursor: pointer;
    margin-left: 10px;
  }
  .advancedSetting {
    color: #1a80f2;
    font-size: 14px;
    cursor: pointer;
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

.info-content {
  display: flex;
  justify-content: center;
  .info-content-warp {
    padding: 17px 6px 0 6px;
    width: 200px;
    margin-right: 32px;

    .info-content-item {
      width: 100%;
      height: 38px;
      line-height: 38px;
      color: #38435a;
      font-size: 14px;
      border-radius: 4px;
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      &:hover {
        color: #1a80f2;
        background: #f6f8fa;
      }
      &.active {
        color: #1a80f2;
      }
    }

    .currentModule {
      color: #1a80f2;
      background: #f6f8fa;
    }
  }
}
.info-content-item-group {
  overflow: hidden;
  transition: all 0.2s;
  .info-content-item {
    padding-left: 32px !important;
    font-weight: 400 !important;
  }
}
.el-icon-arrow-down {
  transition: all 0.2s;
  &.active {
    transform: rotate(180deg);
  }
}

.info-box {
  display: flex;
  flex: 1;
  // justify-content: center;
  .info {
    width: 700px;
  }
  .info1 {
    width: 100%;
  }
}
.info-box1 {
  display: flex;
  flex: 1;
  justify-content: center;
  .info {
    width: 700px;
  }
  .info1 {
    width: 100%;
  }
}

.scan-line {
  display: flex;
  align-items: center;
}
</style>
