<template>
  <main class="depart">
    <div>
      <div class="top">
        <el-button class="btn" @click="addDialogShow()">
          <i class="el-icon-circle-plus-outline"></i>
          {{ $t('menu.newConfiguration') }}
        </el-button>
      </div>
      <div class="bottom">
        <el-table :data="tableData" class="depart-table" style="width: 100%">
          <el-table-column width="140" prop="id" label="ID" align="center">
          </el-table-column>
          <el-table-column
            prop="template_name"
            :label="$t('menu.templateName')"
          >
          </el-table-column>
          <!-- <el-table-column :label="$t('menu.Form.time')" width="240">
            <template slot-scope="{ row }">
              <span>{{ formatTimestamp(row.latest_time) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            :label="$t('views.strategyManage.settings')"
            width="200"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="editTemplate(row)">{{
                $t('menu.Form.edit')
              }}</el-button>
              <el-button
                v-show="row.is_system !== 1"
                type="text"
                size="small"
                @click="delTemplate(row.id)"
                >{{ $t('menu.Form.delete') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :current-page.sync="page"
            :page-size="10"
            layout="total,prev,pager,next,jumper"
            :total="allTotal"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="addDialogOpen"
      custom-class="classDialog"
      :visible.sync="addDialogOpen"
      top="8vh"
      width="680px"
      :title="
        isAdd ? $t('menu.newConfiguration') : $t('menu.editConfiguration')
      "
    >
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="100px"
        :model="configForm"
        status-icon
        :rules="rules"
      >
        <el-row class="peizhi">
          <el-col :span="20">
            <div class="herder">{{ $t('menu.Form.BasicConfiguration') }}</div>
            <el-form-item :label="$t('menu.templateName')" prop="template_name">
              <el-input
                v-model="configForm.template_name"
                :placeholder="$t('menu.Form.namePlaceholder')"
                clearable
                class="addUserInput"
                size="small"
                style="width: 340px"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.Form.scanPolicy')" prop="scanPolicy">
              <el-select
                v-model="configForm.scanPolicy"
                class="addUserInput"
                clearable
                size="small"
                style="width: 340px"
              >
                <el-option
                  v-for="item in policyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('menu.Form.proactiveVerification')"
              prop="proactiveVerification"
            >
              <el-radio-group v-model="configForm.proactiveVerification">
                <el-radio :label="0" name="proactiveVerification">{{
                  $t('menu.Form.followSituation')
                }}</el-radio>
                <el-radio :label="1" name="proactiveVerification">{{
                  $t('menu.Form.close')
                }}</el-radio>
                <el-radio :label="2" name="proactiveVerification">{{
                  $t('menu.Form.open')
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="saveAddOrEdit">
          <el-button
            type="text"
            class="submitBtn"
            size="small"
            @click="creatProjecttemplat"
            >{{ $t('menu.Form.save') }}</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import { Form } from 'element-ui'

@Component({ name: 'projectTemplate' })
export default class projectTemplate extends VueBase {
  private addDialogOpen = false
  private page = 1
  private allTotal = 0
  private isAdd = true
  private options = []
  private wordOptions = []
  private severList = [
    {
      word: 'Herder',
      condition: this.$t('menu.Form.existenceKey'),
      fit: '',
      isEnable: false,
    },
  ]
  private policyList = []
  private keyword = ''
  private form = {
    name: '',
    region: '',
    value: true,
  }
  private addfiled() {
    this.severList.push({
      word: 'Herder',
      condition: this.$t('menu.Form.existenceKey'),
      fit: '',
      isEnable: false,
    })
  }
  private delfiled(index: any) {
    this.severList = this.severList.filter((item, key) => {
      return index !== key
    })
  }
  private newSelectData() {
    this.page = 1
    this.getTableData()
  }
  private rules = {
    template_name: [
      {
        required: true,
        message: this.$t('menu.Form.namePlaceholder'),
        trigger: 'blur',
      },
    ],
    scanPolicy: [
      {
        required: true,
        message: this.$t('menu.Form.namePlaceholder'),
        trigger: 'blur',
      },
    ],

    proactiveVerification: [
      {
        required: true,
        message: this.$t('menu.Form.proactiveVerificationPlaceholder'),
        trigger: 'change',
      },
    ],
  }
  formatTimestamp(time: number) {
    if (time) {
      return formatTimestamp(time)
    } else {
      return ''
    }
  }
  private async resetPwd(item: any) {
    this.$confirm(
      this.$t('views.userList.resetConfirm') as string,
      this.$t('views.userList.resetConfirmPop') as string,
      {
        confirmButtonText: this.$t('views.userList.submit') as string,
        cancelButtonText: this.$t('views.userList.cancel') as string,
        type: 'warning',
      }
    ).then(async () => {
      const { status, msg } = await this.services.user.reset({
        userId: item.id as number,
      })
      if (status === 201) {
        this.$message({
          type: 'success',
          message: msg,
          showClose: true,
        })
      } else {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
      }
    })
  }

  private async delTemplate(id: number) {
    this.$confirm(
      this.$t('views.userList.deleteConfirm') as string,
      this.$t('views.userList.deleteConfirmPop') as string,
      {
        confirmButtonText: this.$t('views.userList.submit') as string,
        cancelButtonText: this.$t('views.userList.cancel') as string,
        type: 'warning',
      }
    ).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.setting.delProjecttemplat({
        id,
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
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
      await this.getTableData()
    })
  }
  private validateCheckPass(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error(this.$t('views.userList.rePWD') as string))
    } else if (value !== this.configForm.password) {
      callback(new Error(this.$t('views.userList.diffPWD') as string))
    } else {
      callback()
    }
  }
  private handleCurrentChange(val: number) {
    this.page = val
    this.getTableData()
  }
  private tableData = []
  async getTableData() {
    this.loadingStart()
    const res = await this.services.setting.listProjecttemplat({
      page: this.page,
      page_size: 10,
    })
    this.loadingDone()
    if (res.status === 201) {
      this.tableData = res.data
      this.allTotal = res.page.alltotal
      return
    }
    this.$message.error(res.msg)
  }

  private configForm: any = {
    template_name: '',
    scanPolicy: '',
    proactiveVerification: '',
  }

  private addDialogShow() {
    this.configForm = {
      template_name: '',
      scanPolicy: '',
      proactiveVerification: '',
    }
    this.severList = [
      {
        word: 'Herder',
        condition: this.$t('menu.Form.existenceKey'),
        fit: '',
        isEnable: false,
      },
    ]
    this.addDialogOpen = true
  }

  private async editTemplate(row: any) {
    this.isAdd = false
    const res = await this.services.setting.getProjecttemplat({ id: row.id })
    console.log(res)
    this.configForm = {
      template_name: row.template_name,
      scanPolicy: row.scan_id,
      proactiveVerification: row.vul_validation,
      uid: row.id,
    }
    this.addDialogOpen = true
  }
  private cancelAdd() {
    this.addDialogOpen = false
    if (this.isAdd === false) {
      this.isAdd = true
    }
  }
  private creatProjecttemplat() {
    console.log(this.configForm.department)
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: any = {
          template_name: this.configForm.template_name,
          scan_id: this.configForm.scanPolicy,
          vul_validation: this.configForm.proactiveVerification,
        }
        if (this.configForm.uid) {
          params.id = this.configForm.uid
        }
        console.log(params)
        this.loadingStart()
        if (this.isAdd) {
          const { status, msg } =
            await this.services.setting.creatProjecttemplat(params)
          this.loadingDone()
          if (status !== 201) {
            this.$message({
              type: 'error',
              message: msg,
              showClose: true,
            })
            return
          }
          this.$message.success(msg)
        } else {
          const { status, msg } = await this.services.setting.putProjecttemplat(
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
          this.$message.success(msg)
        }
        this.addDialogOpen = false
        this.getTableData()
        this.isAdd = true
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  fmtOptions(options: Array<any>) {
    options.forEach((item: any) => {
      if (item.id < 0) {
        item.disabled = true
      }
      item.value = { name: item.label, id: item.id }
      if (item.children.length) {
        this.fmtOptions(item.children)
      } else {
        delete item.children
      }
    })
  }

  private async getPolicy() {
    const { status, msg, data } = await this.services.setting.strategyUserList()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.policyList = data
  }
  created() {
    this.getPolicy()
    this.getTableData()
  }
}
</script>
<style lang="scss">
.classDialog {
  .el-dialog__body {
    padding: 30px;
  }
}
</style>
<style scoped lang="scss">
.herder {
  line-height: 32px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
}
.peizhi {
  display: flex;
  justify-content: space-between;
}
.serverSetting {
  border: 1px solid #ebeef5;
  padding-bottom: 16px;
  &-herder {
    line-height: 50px;
    padding: 0 16px;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-he {
      font-weight: 600;
    }
  }
  .rowLine {
    width: calc(100% - 16px);
    margin: 0 8px;
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
    color: #959fb4;
  }
}
.saveAddOrEdit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.depart {
  padding: 20px;
  margin-top: 12px;
  .top {
    display: flex;
    justify-content: space-between;
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-color: #4a72ae;
      color: #4a72ae;
      border-radius: 2px;
      i {
        display: inline-block;
        margin-right: 6px;
      }
    }
    .ipt {
      border-radius: 2px;
      width: 320px;
    }
  }
  .bottom {
    padding-top: 20px;
    .depart-table {
      border: 1px solid #e6e9ec;
      border-bottom: none;
    }
    ::v-deep.el-table th {
      background: #f6f8fa !important;
      font-weight: 500;
      font-size: 14px;
      color: #959fb4;
    }
    .pagination {
      padding-top: 8px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.submitBtn {
  width: 124px;
  height: 38px;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
}

.cancelBtn {
  width: 124px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  font-size: 14px;
  color: #4a72ae;
}
.pIcon {
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    color: #1a80f2;
  }
}
</style>
