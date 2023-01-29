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
          <el-table-column width="120" prop="username" label="ID">
          </el-table-column>
          <el-table-column
            prop="email"
            :label="$t('menu.templateName')"
            width="160"
          >
          </el-table-column>
          <el-table-column prop="role_name" label="Debug" width="140">
          </el-table-column>
          <el-table-column
            prop="department.name"
            :label="$t('menu.Maximumlength')"
            width="160"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            :label="$t('menu.SaveResponse')"
            width="200"
          >
          </el-table-column>
          <el-table-column :label="$t('views.strategyManage.settings')">
            <template slot-scope="{ row }">
              <i
                v-if="btnRole.some((item) => item === '重置密码')"
                class="iconfont iconzhongzhimima pIcon"
                @click="resetPwd(row)"
              ></i>
              <i class="iconfont iconshezhi-2 pIcon" @click="userEdit(row)"></i>
              <i
                class="iconfont iconshanchu-6 pIcon"
                @click="userDelete(row.id)"
              ></i>
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
      width="880px"
      :title="
        isAdd ? $t('menu.newConfiguration') : $t('menu.editConfiguration')
      "
    >
      <el-form
        ref="ruleForm"
        label-position="left"
        label-width="100px"
        :model="userForm"
        status-icon
        :rules="rules"
      >
        <el-row class="peizhi">
          <el-col :span="11">
            <div class="herder">{{ $t('menu.Form.BasicConfiguration') }}</div>
            <el-form-item :label="$t('menu.templateName')" prop="username">
              <el-input
                v-model="userForm.username"
                :placeholder="$t('menu.Form.namePlaceholder')"
                :disabled="!isAdd"
                clearable
                class="addUserInput"
                size="small"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.Form.scanPolicy')" prop="scanPolicy">
              <el-select
                v-model="userForm.scanPolicy"
                class="addUserInput"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="item in roleOptions"
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
              <el-radio-group v-model="userForm.proactiveVerification">
                <el-radio
                  :label="$t('menu.Form.followSituation')"
                  name="proactiveVerification"
                  >{{ $t('menu.Form.followSituation') }}</el-radio
                >
                <el-radio
                  :label="$t('menu.Form.close')"
                  name="proactiveVerification"
                  >{{ $t('menu.Form.close') }}</el-radio
                >
                <el-radio
                  :label="$t('menu.Form.open')"
                  name="proactiveVerification"
                  >{{ $t('menu.Form.open') }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <div class="herder">{{ $t('menu.Form.AgentConfiguration') }}</div>
            <el-form-item
              label="Dubeg"
              prop="delivery"
              size="small"
              label-width="160px"
              style="margin-bottom: 14px"
            >
              <el-switch v-model="userForm.delivery"></el-switch>
            </el-form-item>
            <el-form-item
              :label="$t('menu.Maximumlength')"
              prop="Maximumlength"
              label-width="160px"
              size="small"
              style="margin-bottom: 14px"
            >
              <el-input
                v-model="userForm.email"
                class="addUserInput"
                label-width="160px"
                :placeholder="$t('menu.Form.MaximumlengthPlaceholder')"
                clearable
                size="small"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('menu.SaveResponse')"
              label-width="160px"
              size="small"
              prop="delivery"
              style="margin-bottom: 14px"
            >
              <el-switch v-model="userForm.saveResponseRight"></el-switch>
            </el-form-item>
            <el-form-item
              :label="$t('menu.Form.Agent')"
              prop="agent"
              size="small"
              label-width="160px"
              style="margin-bottom: 14px"
            >
              <el-input
                v-model="userForm.Agent"
                class="addUserInput"
                :placeholder="$t('menu.Form.AgentPlaceholder')"
                clearable
                size="small"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="herder">{{ $t('menu.Form.ServerSettings') }}</div>
          <div class="serverSetting">
            <div class="serverSetting-herder">
              <span class="serverSetting-herder-he">{{
                $t('menu.Form.blacklist')
              }}</span>
              <el-button type="text" size="small" @click="addfiled">{{
                $t('menu.Form.newConditions')
              }}</el-button>
            </div>
            <el-row class="rowLine">
              <el-col :span="6">
                <div>{{ $t('menu.Form.matchingField') }}</div>
              </el-col>
              <el-col :span="10">
                <div>{{ $t('menu.Form.logicalRelationship') }}</div>
              </el-col>
              <el-col :span="4">
                <div>{{ $t('menu.Form.enable') }}</div>
              </el-col>
              <el-col :span="4">
                <div>{{ $t('menu.Form.operation') }}</div>
              </el-col>
            </el-row>
            <el-row
              v-for="(item, index) in severList"
              :key="index"
              class="rowLine"
            >
              <el-col :span="6">
                <el-select
                  v-model="item.word"
                  class="addUserInput"
                  clearable
                  size="small"
                  style="width: 120px"
                >
                  <el-option
                    v-for="item in wordOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-select
                  v-model="item.condition"
                  class="addUserInput"
                  clearable
                  size="small"
                  style="width: 140px; margin-right: 16px"
                >
                  <el-option
                    v-for="item in wordOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-input
                  v-model="item.fit"
                  class="addUserInput"
                  clearable
                  size="small"
                  style="width: 120px"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-switch v-model="item.isEnable"></el-switch>
              </el-col>
              <el-col :span="4">
                <el-button type="text" size="small" @click="delfiled(index)">{{
                  $t('menu.Form.delete')
                }}</el-button>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row class="saveAddOrEdit">
          <el-button
            type="text"
            class="submitBtn"
            size="small"
            @click="userAdd"
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
import { UserListObj, UserAddParams, Department } from './types'
import { Form } from 'element-ui'

@Component({ name: 'DepartmentList' })
export default class DepartmentList extends VueBase {
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
  private roleOptions = []
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
    username: [
      {
        required: true,
        message: this.$t('menu.Form.namePlaceholder'),
        trigger: 'blur',
      },
    ],
    delivery: [
      {
        required: true,
        message: this.$t('menu.Form.namePlaceholder'),
        trigger: 'blur',
      },
    ],
    Maximumlength: [
      {
        required: true,
        message: this.$t('menu.Form.MaximumlengthPlaceholder'),
        trigger: 'blur',
      },
    ],
    agent: [
      {
        required: true,
        message: this.$t('menu.Form.MaximumlengthPlaceholder'),
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
    email: [
      {
        required: true,
        message: this.$t('views.userList.emailPlaceholder'),
        trigger: 'blur',
      },
    ],
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

  private async userDelete(uid: number) {
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
      const { status, msg } = await this.services.user.userDelete({
        uid,
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
    } else if (value !== this.userForm.password) {
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
    this.loadingDone()
  }

  private userForm: any = {
    username: '',
    password: '',
    re_password: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    uid: 0,
  }

  private addDialogShow() {
    this.userForm = {
      username: '',
      password: '',
      re_password: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      uid: 0,
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

  private userEdit(row: any) {
    this.isAdd = false
    this.userForm = {
      username: row.username,
      password: '',
      re_password: '',
      email: row.email,
      role: row.role_id,
      department: row.department.id,
      phone: row.phone,
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
  private userAdd() {
    console.log(this.userForm.department)
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        const params: UserAddParams = {
          username: this.userForm.username,
          password: this.userForm.password,
          re_password: this.userForm.re_password,
          email: this.userForm.email,
          role: this.userForm.role,
          department: this.userForm.department,
          phone: this.userForm.phone,
        }
        if (this.userForm.uid) {
          params.uid = this.userForm.uid
        }
        console.log(params)
        this.loadingStart()
        if (this.isAdd) {
          const { status, msg } = await this.services.user.userAdd(params)
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
          const { status, msg } = await this.services.user.userEdit(params)
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
  async departmentList() {
    const res = await this.services.user.departmentList()
    if (res.status === 201) {
      this.fmtOptions(res.data)
      this.options = res.data
    }
  }

  private async getRoles() {
    console.log('1')
  }
  created() {
    this.getRoles()
    this.getTableData()
    this.departmentList()
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
