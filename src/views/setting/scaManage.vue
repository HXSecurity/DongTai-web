<template>
  <div class="sca-manage">
    <div class="top">
      <div class="total">
        <div>
          {{ $t('views.scaManage.component') }}：<span
            >{{ sca_count }} {{ $t('views.scaManage.race') }}</span
          >
        </div>
        <div>
          {{ $t('views.scaManage.vuln') }}：<span
            >{{ vuln_count }} {{ $t('views.scaManage.strip') }}</span
          >
        </div>
      </div>
      <div class="language">
        <div class="active">JAVA</div>
        <!-- <div>Python</div>
        <div>PHP</div>
        <div>Go</div> -->
      </div>
    </div>
    <div class="table-body">
      <div class="tool-bar">
        <el-input
          v-model="keyword"
          size="small"
          style="width: 260px"
          class="search-input"
          :placeholder="$t('views.scaManage.searchDesc')"
          @keyup.enter.native="handleCurrentChange(1)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleCurrentChange(1)"
          ></el-button>
        </el-input>
        <div>
          <el-button size="small" class="resetAllBtn" @click="openAdd"
            ><i class="el-icon-plus"></i> {{ $t('views.scaManage.addSca') }}
          </el-button>
        </div>
      </div>
      <div class="table-bar">
        <span style="color: #38435a">
          {{ $t('views.scaManage.selected') }}
          <span style="color: #4a72ae">{{ multipleSelection.length }} </span
          >{{ $t('views.scaManage.strip') }}
        </span>
        <div>
          <el-button
            size="small"
            class="resetAllBtn delete"
            @click="multipleDelete"
            >{{ $t('views.scaManage.del') }}</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        class="hookTable"
        border
        :header-row-style="{
          color: '#000',
          fontWeight: 600,
        }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :fixed="tableData.length ? 'left' : false"
        >
        </el-table-column>
        <template slot="empty">
          <div class="empty-box">
            <span>{{ $t('views.scaManage.empty') }}</span>
          </div>
        </template>
        <el-table-column label="GroupID" prop="group_id" width="160px">
        </el-table-column>
        <el-table-column label="AtrifactID" prop="atrifact_id" width="160px">
        </el-table-column>
        <el-table-column label="Version" prop="version"> </el-table-column>
        <el-table-column label="Sha1" prop="sha_1" width="300px">
        </el-table-column>
        <el-table-column label="PackageName" prop="package_name" width="120px">
        </el-table-column>
        <el-table-column label="License" prop="license" width="100px">
        </el-table-column>
        <el-table-column
          prop="address"
          :label="$t('views.scaManage.address')"
          align="center"
          width="200"
          :fixed="tableData.length ? 'right' : false"
        >
          <template slot-scope="scope">
            <div class="table-btn-box">
              <el-button
                type="text"
                size="small"
                style="color: #4a72ae"
                @click="editRow(scope.row)"
              >
                {{ $t('views.scaManage.edit') }}
              </el-button>
              <span class="l"> | </span>
              <el-popconfirm
                :title="$t('views.scaManage.delpop')"
                @confirm="deleteRow(scope.row)"
              >
                <el-button
                  slot="reference"
                  style="margin-left: -2px; color: #f56262"
                  size="small"
                  type="text"
                  >{{ $t('views.scaManage.del') }}</el-button
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          background
          layout=" prev, pager, next, jumper,total, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>

    <div class="sca-dialog">
      <el-dialog :visible.sync="scaDialog">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('views.scaManage.addSca')" name="add">
            <el-form :model="form" label-width="140px" size="small">
              <el-form-item label="GroupID" prop="group_id">
                <el-input
                  v-model="form.group_id"
                  :placeholder="$t('views.scaManage.GroupID')"
                ></el-input>
              </el-form-item>
              <el-form-item label="AtrifactID" prop="atrifact_id">
                <el-input
                  v-model="form.atrifact_id"
                  :placeholder="$t('views.scaManage.AtrifactID')"
                ></el-input>
              </el-form-item>
              <el-form-item label="Version" prop="version">
                <el-input
                  v-model="form.version"
                  :placeholder="$t('views.scaManage.Version')"
                ></el-input>
              </el-form-item>
              <el-form-item label="Sha1" prop="sha_1">
                <el-input
                  v-model="form.sha_1"
                  :placeholder="$t('views.scaManage.Sha1')"
                ></el-input>
              </el-form-item>
              <el-form-item label="PackageName" prop="package_name">
                <el-input
                  v-model="form.package_name"
                  :placeholder="$t('views.scaManage.PackageName')"
                ></el-input>
              </el-form-item>
              <el-form-item label="License" prop="license">
                <el-select
                  v-model="form.license"
                  :placeholder="$t('views.scaManage.License')"
                >
                  <el-option
                    v-for="item in license_list"
                    :key="item"
                    :value="item"
                    >{{ item }}</el-option
                  >
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('views.scaManage.upload')" name="upload">
            <div style="display: flex">
              <el-button size="mini" @click="download">{{
                $t('views.scaManage.download')
              }}</el-button>
              <el-upload
                style="margin-left: 12px"
                :action="path + '/scadb/maven/bulk'"
                :headers="{
                  'csrf-token': token,
                }"
                :show-file-list="false"
                :on-success="handleSuccess"
                :multiple="false"
                :before-upload="beforeUpload"
                name="file"
              >
                <el-button size="mini">{{
                  $t('views.scaManage.uploadBtn')
                }}</el-button>
              </el-upload>
            </div>
          </el-tab-pane>
        </el-tabs>

        <template slot="footer">
          <el-button size="small" @click="clearForm">{{
            $t('views.scaManage.clear')
          }}</el-button>
          <el-button size="small" type="primary" @click="enterAdd">{{
            $t('views.scaManage.enter')
          }}</el-button>
        </template>
      </el-dialog>
    </div>

    <el-dialog :visible.sync="scaEditDialog">
      <el-form :model="form" label-width="140px" size="small">
        <el-form-item label="GroupID">
          <el-input
            v-model="form.group_id"
            :placeholder="$t('views.scaManage.GroupID')"
          ></el-input>
        </el-form-item>
        <el-form-item label="AtrifactID">
          <el-input
            v-model="form.atrifact_id"
            :placeholder="$t('views.scaManage.AtrifactID')"
          ></el-input>
        </el-form-item>
        <el-form-item label="Version">
          <el-input
            v-model="form.version"
            :placeholder="$t('views.scaManage.Version')"
          ></el-input>
        </el-form-item>
        <el-form-item label="Sha1">
          <el-input
            v-model="form.sha_1"
            :placeholder="$t('views.scaManage.Sha1')"
          ></el-input>
        </el-form-item>
        <el-form-item label="PackageName">
          <el-input
            v-model="form.package_name"
            :placeholder="$t('views.scaManage.PackageName')"
          ></el-input>
        </el-form-item>
        <el-form-item label="License">
          <el-select
            v-model="form.license"
            :placeholder="$t('views.scaManage.License')"
          >
            <el-option v-for="item in license_list" :key="item">{{
              item
            }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template slot="footer">
        <el-button size="small" @click="clearForm">{{
          $t('views.scaManage.clear')
        }}</el-button>
        <el-button size="small" type="primary" @click="enterEdit">{{
          $t('views.scaManage.enter')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { LogItem } from './types'
import { getToken } from '@/utils/utils'

@Component({ name: 'ScaManage' })
export default class LogManage extends VueBase {
  path = process.env.VUE_APP_BASE_API
  token = getToken()
  tableData = []
  pageSize = 20
  currentPage = 1
  total = 0
  keyword = ''

  form = {
    id: 0,
    group_id: '',
    atrifact_id: '',
    version: '',
    sha_1: '',
    package_name: '',
    license: '',
  }
  sca_count = 0
  vuln_count = 0

  public beforeUpload(file: any) {
    const isJPG = file.type === 'text/csv'

    if (!isJPG) {
      this.$message.error(this.$t('views.changeLogo.warningPng') as string)
      return false
    }

    return isJPG
  }

  public handleSuccess(res: any) {
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.clearForm()
      this.getTableData()
    } else {
      this.$message.error(res.msg)
    }
  }

  async sca_stat() {
    const res = await this.services.setting.sca_stat()
    if (res.status === 201) {
      this.sca_count = res.data.sca_count
      this.vuln_count = res.data.vuln_count
    } else {
      this.$message.error(res.msg)
    }
  }

  scaEditDialog = false

  multipleDelete() {
    if (this.multipleSelection.length === 0) {
      this.$message.error(this.$t('views.scaManage.selectWarning') as string)
      return
    }
    this.$confirm(
      `${this.$t('views.scaManage.changeOne')}${this.$t(
        'views.scaManage.changeTwo'
      )}`,
      this.$t('views.scaManage.pop') as string,
      {
        confirmButtonText: this.$t('views.scaManage.enter') as string,
        cancelButtonText: this.$t('views.scaManage.clear') as string,
        type: 'warning',
      }
    )
      .then(async () => {
        const ids = this.multipleSelection.map((item: any) => item.id)
        const res = await this.services.setting.delete_sca_bulk({ ids: ids })
        if (res.status !== 201) {
          this.$message({
            type: 'error',
            message: res.msg,
            showClose: true,
          })
          return
        }
        this.$message({
          type: 'success',
          message: res.msg,
          showClose: true,
        })
        await this.getTableData()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  openAdd() {
    this.form = {
      id: 0,
      group_id: '',
      atrifact_id: '',
      version: '',
      sha_1: '',
      package_name: '',
      license: '',
    }
    this.scaDialog = true
  }

  async enterAdd() {
    if (this.activeName !== 'add') {
      this.clearForm()
      return
    }
    const res = await this.services.setting.add_sca(this.form)
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.clearForm()
      this.getTableData()
      return
    }
    this.$message.error(res.msg)
  }

  editRow(row: any) {
    this.form = JSON.parse(JSON.stringify(row))
    this.scaEditDialog = true
  }

  async deleteRow(row: any) {
    const res = await this.services.setting.delete_sca(row)
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.getTableData()
      return
    }
    this.$message.error(res.msg)
  }

  clearForm() {
    this.scaEditDialog = false
    this.scaDialog = false
    this.form = {
      id: 0,
      group_id: '',
      atrifact_id: '',
      version: '',
      sha_1: '',
      package_name: '',
      license: '',
    }
  }

  async enterEdit() {
    const res = await this.services.setting.edit_sca(this.form)
    if (res.status === 201) {
      this.clearForm()
      this.$message.success(res.msg)
      this.getTableData()
      return
    }
    this.$message.error(res.msg)
  }

  handleSizeChange(val: number) {
    this.pageSize = val
    this.getTableData()
  }

  handleCurrentChange(val: number) {
    this.currentPage = val
    this.getTableData()
  }

  multipleSelection = []
  handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  scaDialog = false

  name = ''
  activeName = 'add'

  license_list = []
  async get_license_list() {
    const res = await this.services.setting.get_license_list()
    if (res.status === 201) {
      this.license_list = res.data
      return
    }
    this.$message.error(res.msg)
  }

  download() {
    window.open(
      `${process.env.VUE_APP_BASE_API}/scadb/maven/template/maven_sca`
    )
  }

  created() {
    this.sca_stat()
    this.get_license_list()
    this.getTableData()
  }

  async getTableData() {
    this.loadingStart()
    const res = await this.services.setting.get_sca_strategy({
      page: this.currentPage,
      page_size: this.pageSize,
      name: this.keyword,
    })
    this.loadingDone()
    if (res.status === 201) {
      this.tableData = res.data
      this.total = res.page.alltotal
      return
    }
    this.$message.error(res.msg)
  }
}
</script>

<style lang="scss" scoped>
@mixin flex-space-between {
  display: flex;
  justify-content: space-between;
}

.sca-manage {
  padding: 20px;
  .top {
    @include flex-space-between;
    .total {
      display: flex;
      padding: 20px 20px 4px 20px;
      font-size: 14px;
      div {
        color: #959fb4;
        & + div {
          margin-left: 60px;
        }
      }
      span {
        color: #515a6e;
      }
    }
    .language {
      display: flex;
      padding: 20px 20px 4px 20px;
      div {
        width: 60px;
        line-height: 34px;
        text-align: center;
        color: #959fb4;
        // background: aliceblue;
        border: 2px solid aliceblue;
        cursor: pointer;
        //
        & + div {
          border-left: none;
        }
        &.active {
          color: #4a72ae;
          background: aliceblue;
        }
      }
    }
  }
  .table-body {
    padding: 20px;
    .tool-bar {
      padding: 16px 0;
      @include flex-space-between;
      .search-input {
        width: 140px;
        margin-right: 10px;
      }
    }
    .table-bar {
      @include flex-space-between;
    }

    .resetAllBtn {
      border: 1px solid #4a72ae;
      border-radius: 2px;
      background: #fff;
      color: #4a72ae;
      &.delete {
        border: 1px solid #f56262;
        box-sizing: border-box;
        border-radius: 2px;
        background: #fff;
        color: #f56262;
        padding-top: 6px;
        padding-bottom: 6px;
      }
    }
  }
  .table-pagination {
    margin-top: 16px;
  }
}
::v-deep.el-table th {
  background: #f8f9fb;
  color: #959fb4;
}
.hookTable {
  margin-top: 16px;
  &.el-table {
    ::v-deepth {
      background: #f6f8fa;
    }
  }
}

.table-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    font-size: 14px;
  }
  .l {
    color: #38435a;
    line-height: 14px;
    padding: 4px 4px 8px 4px;
    display: inline-block;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
