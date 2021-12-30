<template>
  <main class="depart">
    <div>
      <div class="top">
        <el-button class="btn" @click="addDialogShow()">
          <i class="el-icon-circle-plus-outline"></i>
          {{ $t('views.userList.addUser') }}
        </el-button>
        <el-input
          v-model="keyword"
          class="ipt"
          :placeholder="$t('views.userList.keywordPlaceholder')"
          @keyup.enter.native="newSelectData"
        ></el-input>
      </div>
      <div class="bottom">
        <el-table :data="tableData" class="depart-table" style="width: 100%">
          <el-table-column
            min-width="200"
            prop="username"
            :label="$t('views.userList.name')"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            :label="$t('views.userList.email')"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="is_superuser"
            :label="$t('views.userList.role')"
            width="180"
          >
            <template slot-scope="{ row }">
              {{
                row.is_superuser === 0
                  ? $t('views.userList.user')
                  : $t('views.userList.admin')
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="department.name"
            :label="$t('views.userList.department')"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            :label="$t('views.userList.phone')"
            width="180"
          >
          </el-table-column>
          <el-table-column
            :label="$t('views.userList.operate')"
            min-width="200"
          >
            <template slot-scope="{ row }">
              <i
                v-if="$store.getters.userInfo.role === 1"
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
      :visible.sync="addDialogOpen"
      top="8vh"
      :title="
        isAdd ? $t('views.userList.addUser') : $t('views.userList.editUser')
      "
    >
      <el-form
        ref="ruleForm"
        label-width="150px"
        :model="userForm"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('views.userList.name')" prop="username">
          <el-input
            v-model="userForm.username"
            :placeholder="$t('views.userList.namePlaceholder')"
            clearable
            class="addUserInput"
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userList.email')" prop="email">
          <el-input
            v-model="userForm.email"
            class="addUserInput"
            :placeholder="$t('views.userList.email')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userList.role')">
          <el-select
            v-model="userForm.role"
            class="addUserInput"
            clearable
            size="small"
            style="width: 400px"
          >
            <el-option
              :label="$t('views.userList.admin')"
              :value="2"
            ></el-option>
            <el-option
              :label="$t('views.userList.user')"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userList.department')">
          <el-cascader
            v-model="userForm.department"
            :props="{ checkStrictly: true, value: 'id', emitPath: false }"
            class="addUserInput"
            :options="options"
            :placeholder="$t('views.userList.department')"
            size="small"
            style="width: 400px"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('views.userList.phone')" prop="phone">
          <el-input
            v-model="userForm.phone"
            class="addUserInput"
            :placeholder="$t('views.userList.phonePlaceholder')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!userForm.uid"
          :label="$t('views.userList.password')"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            class="addUserInput"
            show-password
            :placeholder="$t('views.userList.passwordPlaceholder')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="userForm.uid"
          :label="$t('views.userList.password')"
        >
          <el-input
            v-model="userForm.password"
            class="addUserInput"
            show-password
            :placeholder="$t('views.userList.passwordPlaceholder')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!userForm.uid"
          :label="$t('views.userList.rePass')"
          prop="re_password"
        >
          <el-input
            v-model="userForm.re_password"
            class="addUserInput"
            show-password
            :placeholder="$t('views.userList.rePassPlaceholder')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="userForm.uid" :label="$t('views.userList.rePass')">
          <el-input
            v-model="userForm.re_password"
            class="addUserInput"
            show-password
            :placeholder="$t('views.userList.rePassPlaceholder')"
            clearable
            size="small"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="text"
            class="submitBtn"
            size="small"
            @click="userAdd"
            >{{ $t('views.userList.submit') }}</el-button
          >
          <el-button
            type="text"
            class="cancelBtn"
            size="small"
            @click="cancelAdd"
            >{{ $t('views.userList.cancel') }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { UserListObj, UserAddParams, Department } from './types'
import { Form } from 'element-ui'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'DepartmentList' })
export default class DepartmentList extends VueBase {
  private addDialogOpen = false
  private page = 1
  private allTotal = 0
  private isAdd = true
  private options = []
  private keyword = ''
  private form = {
    name: '',
    region: '',
    value: true,
  }

  private newSelectData() {
    this.page = 1
    this.getTableData()
  }
  private rules = {
    username: [
      {
        required: true,
        message: this.$t('views.userList.namePlaceholder'),
        trigger: 'blur',
      },
    ],
    email: [
      {
        required: true,
        message: this.$t('views.userList.emailPlaceholder'),
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        message: this.$t('views.userList.phonePlaceholder'),
        trigger: 'blur',
      },
    ],
    password: [{ validator: this.validateNewPass, trigger: 'blur' }],
    re_password: [{ validator: this.validateCheckPass, trigger: 'blur' }],
  }
  private validateNewPass(rule: any, value: string, callback: any) {
    if (value === '') {
      callback(new Error(this.$t('views.userList.needPWD') as string))
    } else {
      if (this.userForm.password !== '') {
        ;(this.$refs.ruleForm as Form).validateField('re_password')
      }
      callback()
    }
  }

  private async resetPwd(item: any) {
    this.$confirm(
      this.$t('views.userList.deleteConfirm') as string,
      this.$t('views.userList.deleteConfirmPop') as string,
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
    await this.getTableData()
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
    const res = await this.services.user.userList({
      page: this.page,
      pageSize: 10,
      keywords: this.keyword,
    })
    this.loadingDone()
    if (res.status === 201) {
      this.tableData = res.data
      this.allTotal = res.page.alltotal
    } else {
      this.$message.error(res.msg)
    }
  }

  private userForm: any = {
    username: '',
    password: '',
    re_password: '',
    email: '',
    role: 0,
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
      role: 0,
      department: '',
      phone: '',
      uid: 0,
    }
    this.addDialogOpen = true
  }

  private userEdit(row: UserListObj) {
    this.isAdd = false
    this.userForm = {
      username: row.username,
      password: '',
      re_password: '',
      email: row.email,
      role: row.is_superuser,
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
  created() {
    this.getTableData()
    this.departmentList()
  }
}
</script>

<style scoped lang="scss">
.depart {
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
    /deep/.el-table th {
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
