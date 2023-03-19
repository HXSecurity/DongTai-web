<template>
  <main class="container">
    <div class="userContent">
      <div class="titleLine flex-row-space-between">
        <div class="btn" @click="addDialogShow">
          <i class="iconfont iconxinzengyonghu"></i>
          {{ $t('views.userList.addUser') }}
        </div>
        <el-input
          v-model="keywords"
          style="width: 462px"
          :placeholder="$t('views.userList.keywordPlaceholder')"
          @keyup.enter.native="newSelectData"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
      <el-table class="userListTable" :data="tableData">
        <!-- <el-table-column
          :label="$t('views.userList.userID')"
          prop="id"
          width="90px"
        ></el-table-column> -->
        <el-table-column
          :label="$t('views.userList.name')"
          prop="username"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.email')"
          prop="email"
        ></el-table-column>
        <el-table-column :label="$t('views.userList.role')" prop="is_superuser">
          <template slot-scope="{ row }">
            {{
              row.is_superuser
                ? $t('views.userList.admin')
                : $t('views.userList.user')
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.userList.department')"
          prop="department.name"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.phone')"
          prop="phone"
        ></el-table-column>
        <el-table-column :label="$t('views.userList.operate')" width="100px">
          <template slot-scope="{ row }">
            <i class="iconfont iconshezhi-2 pIcon" @click="userEdit(row)"></i>
            <i
              class="iconfont iconshanchu-6 pIcon"
              @click="userDelete(row.id)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: right; margin-top: 10px"
        layout="total, prev, pager, next, jumper"
        :hide-on-single-page="total > pageSize"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <el-dialog
      v-if="addDialogOpen"
      :visible.sync="addDialogOpen"
      top="8vh"
      :title="$t('views.userList.addUser')"
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
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userList.email')" prop="email">
          <el-input
            v-model="userForm.email"
            class="addUserInput"
            :placeholder="$t('views.userList.email')"
            clearable
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.userList.role')">
          <el-select
            v-model="userForm.role"
            class="addUserInput"
            clearable
            style="width: 400px"
          >
            <el-option
              :label="$t('views.userList.admin')"
              :value="1"
            ></el-option>
            <el-option
              :label="$t('views.userList.user')"
              :value="0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userList.department')">
          <el-select
            v-model="userForm.department.name"
            class="addUserInput"
            filterable
            allow-create
            :placeholder="$t('views.userList.departmentPlaceholder')"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in departments"
              :key="item.id"
              :value="item.name"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.userList.phone')" prop="phone">
          <el-input
            v-model="userForm.phone"
            class="addUserInput"
            :placeholder="$t('views.userList.phonePlaceholder')"
            clearable
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
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="submitBtn" @click="userAdd">{{
            $t('views.userList.submit')
          }}</el-button>
          <el-button type="text" class="cancelBtn" @click="cancelAdd">{{
            $t('views.userList.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { UserListObj, UserAddParams } from './types'
import { Form } from 'element-ui'

@Component({ name: 'UserList' })
export default class UserList extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tableData: Array<UserListObj> = []
  private departments: Array<{
    id: number
    name: string
  }> = []
  private addDialogOpen = false
  private userForm: UserAddParams = {
    username: '',
    password: '',
    re_password: '',
    email: '',
    role: 0,
    department: {
      id: -1,
      name: '',
    },
    phone: '',
    uid: 0,
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
  private validateCheckPass(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error(this.$t('views.userList.rePWD') as string))
    } else if (value !== this.userForm.password) {
      callback(new Error(this.$t('views.userList.diffPWD') as string))
    } else {
      callback()
    }
  }

  created() {
    this.getTableData()
    this.departmentList()
  }

  private addDialogShow() {
    this.userForm = {
      username: '',
      password: '',
      re_password: '',
      email: '',
      role: 0,
      department: {
        id: -1,
        name: '',
      },
      phone: '',
      uid: 0,
    }
    this.addDialogOpen = true
  }

  private userEdit(row: UserListObj) {
    this.userForm = {
      username: row.username,
      password: '',
      re_password: '',
      email: row.email,
      role: row.is_superuser ? 1 : 0,
      department: row.department,
      phone: row.phone,
      uid: row.id,
    }
    this.addDialogOpen = true
  }

  private cancelAdd() {
    this.addDialogOpen = false
  }
  private newSelectData() {
    this.page = 1
    this.getTableData()
  }
  private currentChange(val: number) {
    this.page = val
    this.getTableData()
  }
  private async getTableData() {
    const params: {
      page: number
      pageSize: number
      keywords?: string
    } = {
      page: this.page,
      pageSize: this.pageSize,
    }
    if (this.keywords) {
      params.keywords = this.keywords
    }
    this.loadingStart()
    const { status, msg, data, total } = await this.services.user.userList(
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
    this.tableData = data
    this.total = total
  }

  private async departmentList() {
    this.loadingStart()
    const { status, msg, data } = await this.services.user.departmentList()
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.departments = data
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
        this.loadingStart()
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
        this.addDialogOpen = false
        this.getTableData()
      } else {
        console.log('error submit!!')
        return false
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
}
</script>

<style scoped lang="scss">
.userContent {
  margin-top: 28px;
  background: #fff;
  padding: 14px;
  font-size: 14px;
  min-height: calc(100vh - 113px);

  .titleLine {
    .btn {
      color: #959ea9;
      cursor: pointer;
      i {
        font-size: 14px;
        color: #5495f3;
        margin-right: 10px;
      }
    }
  }

  .pIcon {
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      color: #1a80f2;
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
</style>
