<template>
  <main class="container">
    <div class="userContent">
      <div class="titleLine flex-row-space-between">
        <div class="btn">
          <i class="iconfont iconxinzengyonghu"></i>
          {{ $t('views.userList.addUser') }}
        </div>
        <el-input
          v-model="keywords"
          style="width: 462px"
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
          :label="$t('views.userList.userID')"
          prop="id"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.name')"
          prop="username"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.email')"
          prop="email"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.level')"
          prop="is_superuser"
        >
          <template slot-scope="{ row }">
            {{ row.is_superuser ? '超级管理员' : '普通用户' }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.userList.department')"
          prop="department"
        ></el-table-column>
        <el-table-column
          :label="$t('views.userList.phone')"
          prop="phone"
        ></el-table-column>
        <el-table-column :label="$t('views.userList.operate')">
          <template slot-scope="{ row }">
            <i
              class="iconfont iconshezhi-2 pIcon"
              @click="$router.push(`/project/projectEdit/${row.id}`)"
            ></i>
            <i
              class="iconfont iconshanchu-6 pIcon"
              @click="userDelete(row.id)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="addDialogOpen"></el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { UserListObj } from './types'

@Component({ name: 'UserList' })
export default class UserList extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tableData: Array<UserListObj> = []
  private addDialogOpen = false

  created() {
    this.getTableData()
  }
  private newSelectData() {
    this.page = 1
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
      this.$message.error(msg)
      return
    }
    this.tableData = data
    this.total = total
  }

  private async userDelete(uid: number) {
    this.loadingStart
    const { status, msg, data } = await this.services.user.userDelete({
      uid,
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
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
</style>
