<template>
  <main class="container">
    <div class="userContent">
      <div
        class="block"
        style="display: inline-block; float: left; width: 340px"
      >
        <el-tree
          :data="data"
          node-key="id"
          :default-expand-all="true"
          :current-node-key="1"
          :expand-on-click-node="false"
          :check-on-click-node="false"
          @node-click="SelectNode"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <template v-if="data.isEdit == 1">
              <el-input
                v-model="currentDepartmentName"
                class="tree-node-input"
                style="height: 20px; line-height: 20px"
                @blur="() => submitEdit(node, data)"
              ></el-input>
            </template>
            <span v-else>{{ node.label }}</span>
            <span>
              <el-button
                v-if="data.id != -1"
                type="text"
                size="mini"
                @click="() => edit(node, data)"
              >
                {{ $t('views.strategyManage.edit') }}
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => append(node, data)"
              >
                {{ $t('views.strategyManage.addChildren') }}
              </el-button>
              <el-button
                v-if="data.id != -1"
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                {{ $t('views.strategyManage.del') }}
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div style="display: inline-block; width: 828px">
        <div class="titleLine flex-row-space-between">
          <div class="btn" @click="addDialogShow">
            <i class="iconfont iconxinzengyonghu"></i>
            {{ $t('views.userList.addUser') }}
          </div>
          <el-input
            v-model="keywords"
            size="small"
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
          <el-table-column
            :label="$t('views.userList.name')"
            prop="username"
            min-width="150px"
          ></el-table-column>
          <el-table-column
            :label="$t('views.userList.email')"
            prop="email"
            min-width="200px"
          ></el-table-column>
          <el-table-column
            :label="$t('views.userList.role')"
            prop="is_superuser"
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
            :label="$t('views.userList.department')"
            prop="department.name"
            width="120px"
          ></el-table-column>
          <el-table-column
            :label="$t('views.userList.phone')"
            prop="phone"
            min-width="130px"
          ></el-table-column>
          <el-table-column
            :label="$t('views.userList.dateJoined')"
            prop="date_joined"
            min-width="150px"
          >
            <template slot-scope="scope">
              <div>
                {{ formatTime(scope.row.date_joined) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('views.userList.lastLogin')"
            prop="last_login"
            min-width="150px"
          >
            <template slot-scope="scope">
              <div>
                {{ formatTime(scope.row.last_login) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('views.userList.isActive')">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.is_active
                    ? $t('views.userList.on')
                    : $t('views.userList.off')
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('views.userList.operate')"
            width="100px"
            fixed="right"
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
          <el-input
            :value="userForm.department.name"
            class="addUserInput"
            :placeholder="$t('views.userList.email')"
            clearable
            disabled
            size="small"
            style="width: 400px"
          ></el-input>
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
import { UserListObj, UserAddParams } from './types'
import { Form } from 'element-ui'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'DepartmentList' })
export default class DepartmentList extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private newDepartment = false
  private currentDepartmentName = ''
  private department = {
    id: -1,
    name: '',
  }
  private isAdd = true
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
    department: {},
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
  private data = []
  private formatTime(time: string) {
    if (!time) {
      return this.$t('views.userList.notLogin') as string
    }
    return formatTimestamp(new Date(time).getTime())
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
    this.departmentList()
    this.getTableData()
  }

  private addDialogShow() {
    this.userForm = {
      username: '',
      password: '',
      re_password: '',
      email: '',
      role: 0,
      department: this.department,
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
      department: row.department,
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
      departmentId?: number
      keywords?: string
    } = {
      page: this.page,
      pageSize: this.pageSize,
      departmentId: this.department.id,
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
    const {
      status,
      msg,
      data,
    } = await this.services.department.departmentList()
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.data = data
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

  private append(node: any, data: any) {
    this.newDepartment = true
    const defaultDepartmentName = this.$t(
      'views.strategyManage.children'
    ) as string
    const newChild = {
      id: data.id + 1,
      label: this.$t('views.strategyManage.children') as string,
      isEdit: 1,
      children: [],
    }
    if (!data.children) {
      this.$set(data, 'children', [])
    }
    this.currentDepartmentName = defaultDepartmentName
    data.children.push(newChild)
  }

  private async remove(node: any, data: any) {
    const { status, msg } = await this.services.department.departmentDel(
      data.id
    )

    if (status === 201) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d: any) => d.id === data.id)
      children.splice(index, 1)
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
  }

  private SelectNode(data: any, node: any, obj: any) {
    node.expanded = true
    if (
      data.isEdit === undefined ||
      (data.isEdit === 0 && this.newDepartment == false && data.id !== -1)
    ) {
      this.department.id = data.id
      this.department.name = data.label
      this.getTableData()
    }
  }

  edit(node: any, data: { id: number; label: string; isEdit: boolean }) {
    this.newDepartment = false
    this.$set(data, 'isEdit', 1)
    this.currentDepartmentName = data.label
  }

  private async submitEdit(node: any, nodeData: any) {
    if (nodeData.label == this.currentDepartmentName) {
      this.currentDepartmentName = ''
      this.$set(nodeData, 'isEdit', 0)

      if (this.newDepartment) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex((d: any) => d.id === nodeData.id)
        children.splice(index, 1)
        this.newDepartment = false
      }
    } else {
      const params = {
        name: this.currentDepartmentName,
        parent: node.parent.data.id,
      }
      if (this.newDepartment) {
        // 创建部门
        const {
          status,
          msg,
          data,
        } = await this.services.department.departmentAdd(params)
        if (status !== 201) {
          this.$set(data, 'isEdit', 0)
          this.$message({
            type: 'error',
            message: msg,
            showClose: true,
          })
          return
        } else {
          this.$set(nodeData, 'id', data)
          this.$set(nodeData, 'label', this.currentDepartmentName)
          this.currentDepartmentName = ''
          this.$set(nodeData, 'isEdit', 0)
          this.$message({
            type: 'success',
            message: msg,
            showClose: true,
          })
        }
        this.newDepartment = false
      } else {
        const { status, msg } = await this.services.department.departmentUpdate(
          nodeData.id,
          params
        )
        if (status !== 201) {
          this.$set(nodeData, 'isEdit', 0)
          this.$message({
            type: 'error',
            message: msg,
            showClose: true,
          })
          return
        } else {
          this.$set(nodeData, 'label', this.currentDepartmentName)
          this.currentDepartmentName = ''
          this.$set(nodeData, 'isEdit', 0)
          this.$message({
            type: 'success',
            message: msg,
            showClose: true,
          })
        }
      }
    }
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-node-input {
  padding-right: 12px;
  /deep/.el-input__inner {
    height: 20px;
    line-height: 20px;
  }
}
</style>
