<template>
  <main class="sys-main">
    <div class="sys-info">
      <div class="go-back-title">
        <span @click="goBack"> <i class="el-icon-arrow-left"></i> 返回 </span>
      </div>
      <div class="agent-box">
        <div class="agent-btn-box">
          <div class="agent-title">
            熔断配置
            <!-- <i class="el-icon-question"></i> -->
          </div>
          <el-button
            class="btn-border"
            icon="el-icon-plus"
            size="small"
            @click="add(false)"
          >
            添加策略
          </el-button>
        </div>
        <el-table :data="jsons" class="info-table" row-key="id">
          <el-table-column width="44" align="left">
            <template>
              <i class="el-icon-rank rank-icon"></i>
            </template>
          </el-table-column>
          <el-table-column label="策略名称" width="220" align="left">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="cluster_name"
            width="270"
            label="指标"
          >
            <template slot-scope="scope">
              <span v-for="(t, i) in scope.row.metrics" :key="i">
                &nbsp;{{
                  enumObj['metric_type'] &&
                  enumObj['metric_type'][t.metric_type] &&
                  enumObj['metric_type'][t.metric_type].label
                }}
                &nbsp;</span
              >
            </template>
          </el-table-column>
          <el-table-column
            width="270"
            align="left"
            prop="cluster_version"
            label="目标"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.targets.length">
                <span v-for="(t, i) in scope.row.targets" :key="i">
                  &nbsp;{{
                    enumObj['target_type'] &&
                    enumObj['target_type'][t.target_type] &&
                    enumObj['target_type'][t.target_type].label
                  }}
                  &nbsp;</span
                >
              </template>
              <template v-else>&nbsp;全部&nbsp; </template>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            prop="priority"
            label="状态"
            align="left"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_enable"
                :active-value="1"
                :inactive-value="0"
                @change="changeEnable(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <div class="table-btn-box">
                <el-button type="text" size="small" @click="top(scope.row)">
                  置顶
                </el-button>
                <span class="l"> | </span>
                <el-button type="text" size="small" @click="add(scope.row)">
                  编辑
                </el-button>
                <span class="l"> | </span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    v-if="!scope.row.system_type"
                    size="small"
                    type="text"
                    @click="del(scope.row)"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="恢复成默认"
                  placement="top"
                >
                  <el-button
                    v-if="scope.row.system_type"
                    size="small"
                    type="text"
                    @click="reset(scope.row)"
                  >
                    <i class="icon iconfont">&#xe6af;</i>
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      :visible="agentConfigFlag"
      width="788px"
      custom-class="sysinfo-dialog"
      :show-close="false"
    >
      <template slot="title">
        <div class="info-dialog-title">添加策略</div>
      </template>
      <div class="dialog-body">
        <el-form :model="createFrom" label-position="right" label-width="68px">
          <el-form-item label="名称">
            <el-input
              v-model="createFrom.name"
              size="small"
              style="width: 556px"
            ></el-input>
          </el-form-item>
          <el-form-item label="目标">
            <div v-if="createFrom.targets.length">
              <el-select
                v-model="createFrom.targets[0].target_type"
                placeholder="选择目标"
                size="small"
                style="width: 240px; margin-right: 16px"
              >
                <el-option
                  v-for="(item, key) in enumObjArr.target_type"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span style="width: 28px; margin-right: 16px">条件</span>
              <el-select
                v-model="createFrom.targets[0].opt"
                style="width: 120px; margin-right: 16px"
                placeholder="条件"
                size="small"
              >
                <el-option
                  v-for="(item, key) in enumObjArr.target_operator"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                v-model="createFrom.targets[0].value"
                style="width: 120px; margin-right: 16px"
                placeholder="值"
                size="small"
              ></el-input>
              <i
                class="el-icon-delete"
                @click="removeArr(createFrom.targets, 0)"
              ></i>
            </div>
            <div v-if="createFrom.targets.length === 0" class="add-btn-box">
              <div
                class="add-btn"
                @click="
                  addArr(createFrom.targets, {
                    target_type: '',
                    opt: '',
                    value: '',
                  })
                "
              >
                <i class="el-icon-circle-plus-outline"></i> 添加条件
              </div>
            </div>
            <div
              v-if="createFrom.targets.length === 1"
              class="add-btn-box right"
            >
              <div
                class="add-btn"
                @click="
                  addArr(createFrom.targets, {
                    target_type: '',
                    opt: '',
                    value: '',
                  })
                "
              >
                <i class="el-icon-circle-plus-outline"></i> 添加条件
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-for="(target, index) in createFrom.targets"
            v-show="index"
            :key="'target' + index"
            label="与"
          >
            <div>
              <el-select
                v-model="target.target_type"
                placeholder="选择目标"
                size="small"
                style="width: 240px; margin-right: 16px"
              >
                <el-option
                  v-for="(item, key) in enumObjArr.target_type"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span style="width: 28px; margin-right: 16px">条件</span>
              <el-select
                v-model="target.opt"
                style="width: 120px; margin-right: 16px"
                placeholder="条件"
                size="small"
              >
                <el-option
                  v-for="(item, key) in enumObjArr.target_operator"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                v-model="target.value"
                style="width: 120px; margin-right: 16px"
                placeholder="值"
                size="small"
              ></el-input>

              <i
                class="el-icon-delete"
                @click="removeArr(createFrom.targets, index)"
              ></i>
            </div>
            <div
              v-if="createFrom.targets.length - 1 === index"
              class="add-btn-box right"
            >
              <div
                class="add-btn"
                @click="
                  addArr(createFrom.targets, {
                    target_type: '',
                    opt: '',
                    value: '',
                  })
                "
              >
                <i class="el-icon-circle-plus-outline"></i> 添加条件
              </div>
            </div>
          </el-form-item>
          <el-form-item label="处理">
            <el-radio-group v-model="createFrom.deal" size="small">
              <el-radio-button
                v-for="(item, key) in enumObjArr.deal_type"
                :key="key"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指标类型">
            <div>
              <el-radio-group
                v-model="createFrom.metric_group"
                size="small"
                :disabled="createFrom.metrics.length"
              >
                <el-radio-button
                  v-for="(item, key) in enumObjArr.metric_group"
                  :key="key"
                  :label="item.value"
                  >{{ item.label }}</el-radio-button
                >
              </el-radio-group>
            </div>

            <div
              v-for="(metric, index) in createFrom.metrics"
              :key="'metric' + index"
              style="margin-top: 24px"
            >
              <el-select
                v-model="metric.metric_type"
                placeholder="选择目标"
                size="small"
                style="width: 240px; margin-right: 16px"
              >
                <el-option
                  v-for="(item, key) in enumObjArr[
                    metric_type_group[createFrom.metric_group] + 'metric_type'
                  ]"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span style="width: 28px; margin-right: 16px">条件</span>
              <el-select
                v-model="metric.opt"
                style="width: 120px; margin-right: 16px"
                placeholder="条件"
                size="small"
              >
                <el-option
                  v-for="(item, key) in enumObjArr.metric_operator"
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                v-model="metric.value"
                style="width: 120px; margin-right: 16px"
                placeholder="值"
                size="small"
              >
                <span slot="suffix" style="padding-right: 4px">{{
                  unit_dict[metric.metric_type]
                }}</span>
              </el-input>
              <i
                class="el-icon-delete"
                @click="removeArr(createFrom.metrics, index)"
              ></i>
            </div>
            <div class="add-btn-box">
              <div
                class="add-btn"
                @click="
                  addArr(createFrom.metrics, {
                    metric_type: '',
                    opt: '',
                    value: '',
                  })
                "
              >
                <i class="el-icon-circle-plus-outline"></i> 添加条件
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn-box">
        <div class="cancel" @click="closeDialog">取消</div>
        <div class="save" @click="saveDialog">保存</div>
      </div>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import Sortable from 'sortablejs'
@Component({ name: 'SysInfo' })
export default class SysInfo extends VueBase {
  private radio2 = '性能指标'
  private enumObj: any = {}
  private enumObjArr: any = {}
  mounted() {
    this.rowDrop()
  }
  //行拖拽
  rowDrop() {
    const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this: any = this
    Sortable.create(tbody, {
      async onEnd({ newIndex, oldIndex }: any) {
        const currRow = _this.jsons.splice(oldIndex, 1)[0]
        _this.jsons.splice(newIndex, 0, currRow)
        _this.loadingStart()
        if (newIndex === 0) {
          const res = await _this.services.setting.circuitPriority(
            _this.jsons[newIndex],
            {
              type: 1,
            }
          )
          if (res.status !== 201) {
            _this.$message.error(res.msg)
            return
          }
          _this.$message.success(res.msg)
          _this.get_threshold()
        } else {
          if (newIndex === _this.jsons.length - 1) {
            const res = await _this.services.setting.circuitPriority(
              _this.jsons[newIndex],
              {
                type: 3,
              }
            )
            if (res.status !== 201) {
              _this.$message.error(res.msg)
              return
            }
            _this.$message.success(res.msg)
            _this.get_threshold()
          }
          if (newIndex !== _this.jsons.length - 1) {
            const res = await _this.services.setting.circuitPriority(
              _this.jsons[newIndex],
              {
                type: 2,
                priority_range: [
                  _this.jsons[newIndex - 1].priority,
                  _this.jsons[newIndex + 1].priority,
                ],
              }
            )
            if (res.status !== 201) {
              _this.$message.error(res.msg)
              return
            }
            _this.$message.success(res.msg)
            _this.get_threshold()
          }
        }

        _this.loadingDone()
      },
    })
  }

  metric_type_group = {
    1: 'system_',
    2: 'jvm_',
    3: 'application_',
  }

  unit_dict = {}
  async top(row: any) {
    const res = await this.services.setting.circuitPriority(row, { type: 1 })
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success(res.msg)
    this.get_threshold()
  }

  async reset(row: any) {
    const res = await this.services.setting.circuitReset(row)
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success(res.msg)
    this.get_threshold()
  }

  async changeEnable(row: any) {
    const res = await this.services.setting.updateCircuit(row)
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success(res.msg)
    this.get_threshold()
  }

  async saveDialog() {
    let res: any
    if (this.createFrom.id) {
      res = await this.services.setting.updateCircuit(this.createFrom)
    } else {
      res = await this.services.setting.createCircuit(this.createFrom)
    }
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.$message.success(res.msg)
    this.get_threshold()
    this.closeDialog()
  }

  private closeDialog() {
    this.createFrom = {
      name: '',
      metric_group: 1,
      deal: 1,
      is_enable: 1,
      targets: [],
      metrics: [],
    }
    this.agentConfigFlag = false
  }

  private createFrom: any = {
    name: '',
    metric_group: 1,
    deal: 1,
    is_enable: 1,
    targets: [],
    metrics: [],
  }

  addArr(arr: any, item: any) {
    arr.push(item)
  }

  removeArr(arr: any, index: any) {
    arr.splice(index, 1)
  }

  goBack() {
    this.$router.push({
      name: 'agentManage',
    })
  }
  public activeName = 'global'
  public form = {
    cpu_limit: '',
    auto_audit: '',
  }
  onSubmit() {
    console.log('确定')
  }

  get userInfo() {
    return this.$store.getters.userInfo
  }
  async getInfo() {
    const keys = []
    for (let key in this.form) {
      keys.push(key)
    }
    const res = await this.services.setting.profileGet({
      keys,
    })
    if (res.status === 201) {
      res.data.forEach((item: any) => {
        this.form[item.key] = item.value
      })
    } else {
      this.$message.error(res.msg)
    }
  }

  async profileModified() {
    const data = []
    for (let key in this.form) {
      data.push({
        value: String(this.form[key]),
        key,
      })
    }
    const res = await this.services.setting.profileModified(data)
    if (res.status === 201) {
      this.$message.success(res.msg)
    } else {
      this.$message.error(res.msg)
    }
  }

  private jsons: any = []
  private async get_threshold() {
    const res = await this.services.setting.get_threshold()
    if (res.status === 201) {
      this.jsons = res.data
    }
  }

  private async edit(row: any) {
    // this.$router.push({ name: 'agentConfig', query: { id: row.id } })
  }

  private async del(row: any) {
    this.$confirm(this.$t('views.agentConfig.confirmDel') as string, '', {
      confirmButtonText: this.$t('views.agentConfig.confirm') as string,
      cancelButtonText: this.$t('views.agentConfig.cancel') as string,
      type: 'warning',
    }).then(async () => {
      const res = await this.services.setting.del_threshold({ id: row.id })
      if (res.status === 201) {
        this.$message.success(res.msg)
        this.get_threshold()
        return
      }
      this.$message.error(res.msg)
    })
  }

  private agentConfigFlag = false

  async add(row: any) {
    if (row) {
      const res = await this.services.setting.getCircuit(row.id)
      if (res.status != 201) {
        this.$message.error(res.msg)
        return
      }
      this.createFrom = res.data
      this.agentConfigFlag = true
    } else {
      this.agentConfigFlag = true
    }
    // this.$router.push({ name: 'agentConfig' })
  }

  async created() {
    this.get_threshold()
    this.getInfo()
    const res = await this.services.setting.enum()
    this.enumObj = res.data

    for (let k in this.enumObj) {
      this.enumObjArr[k] = []
      for (let kk in this.enumObj[k]) {
        this.enumObjArr[k].push({
          name: this.enumObj[k][kk].name,
          value: Number(kk),
          label: this.enumObj[k][kk].label,
        })
      }
    }

    this.unit_dict = this.enumObj['UNIT_DICT']

    console.log(this.enumObjArr)

    for (let k in this.enumObj.metric_group) {
      this.createFrom.metric_group = k
      return
    }
  }
}
</script>

<style scoped lang="scss">
.go-back-title {
  padding-top: 16px;
  padding-left: 16px;
  color: #0085ff;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.agent-btn-box {
  display: flex;
  justify-content: space-between;
  .agent-title {
    color: #38435a;
    font-weight: 500;
    font-size: 16px;
  }
  .btn-border {
    background: #4a72ae;
    border-radius: 2px;
    color: #ffffff;
    border: none;
    font-size: 14px;
  }
}
.sys-main {
  display: flex;
  justify-content: center;
}
.sys-info {
  margin-top: 16px;
  width: 1200px;
  background: #fff;
}
.agent-box {
  padding: 20px;
}

.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 64px;
}
.moudleTitle {
  margin-top: 12px;
  font-size: 16px;
  color: #38435a;
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e9ec;
}
.moudleTitle-th {
  width: 160px;
  font-size: 16px;
  display: flex;
}

.btn-box {
  display: flex;
  justify-content: center;
  .btn {
    height: 36px;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 0;
    background: #4a72ae;
    border-color: #4a72ae;
    border-radius: 2px;
    margin-right: 20px;
    margin-top: 20px;
    background: #4a72ae;
  }
}

.cpu-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 470px;
  .num-input {
    width: 120px;
    ::v-deep.el-input__inner {
      border-radius: 2px;
    }
  }
}

.form {
  width: 470px;
}

.el-icon-question {
  cursor: pointer;
}

.cpu-box + .cpu-box {
  margin-top: 20px;
}

.table-btn-box {
  display: flex;
  align-items: center;
  color: #1a80f2;
  .el-button {
    font-size: 14px;
  }
  .l {
    color: #38435a;
    line-height: 14px;
    padding: 4px 12px 8px 12px;
    display: inline-block;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}

.info-table {
  margin-top: 16px;
  border-left: 1px solid rgba(230, 233, 236, 0.5);
  border-right: 1px solid rgba(230, 233, 236, 0.5);
  &.el-table {
    ::v-deepth {
      background: #f2f3f5;
      color: #38435a;
      padding-left: 10px;
    }
    ::v-deeptd {
      padding-left: 10px;
    }

    ::v-deep.el-table__row {
      .rank-icon {
        cursor: pointer;
        display: none;
      }
      &:hover {
        .rank-icon {
          display: inline;
        }
      }
    }
  }
}

.add-btn-box {
  display: flex;
  &.right {
    margin-top: 8px;
    justify-content: flex-end;
  }
  .add-btn {
    cursor: pointer;
    color: #1a80f2;
  }
}
.el-icon-delete {
  color: #1a80f2;
  cursor: pointer;
}
</style>

<style lang="scss">
.sysinfo-dialog {
  .info-dialog-title {
    color: #38435a;
    font-weight: 500;
    font-size: 16px;
  }
  .el-dialog__header {
    background: #ffffff;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 24px 64px;
  }
  .dialog-btn-box {
    display: flex;
    padding-left: 50px;
    margin-top: 40px;
    div {
      width: 60px;
      height: 32px;
      margin-left: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .cancel {
      background: #f2f3f5;
      border-radius: 2px;
      text-align: center;
      color: #38435a;
    }
    .save {
      background: #4a72ae;
      border-radius: 2px;
      text-align: center;
      color: #ffffff;
    }
  }
}
</style>
