<template>
  <main class="depart">
    <div>
      <div class="top">
        <el-button class="btn" style="visibility: hidden">
          <i class="el-icon-circle-plus-outline" @click="addDepart()"></i>
        </el-button>
        <el-input
          v-model="keyword"
          class="ipt"
          :placeholder="$t('views.strategyManage.twnamep')"
          @keyup.enter.native="newSelectData"
        ></el-input>
      </div>
      <div class="bottom">
        <el-table
          row-key="id"
          :data="tableData"
          :tree-props="{ children: 'children' }"
          style="width: 100%"
          default-expand-all
        >
          <el-table-column
            prop="label"
            :label="$t('views.strategyManage.tname')"
          >
          </el-table-column>
          <el-table-column :label="$t('views.strategyManage.operate')">
            <template slot-scope="scope">
              <el-button type="text" @click="addDepart(scope.row)">{{
                $t('views.strategyManage.addChildren')
              }}</el-button>
              <el-button
                v-if="scope.row.id > 0"
                type="text"
                @click="editDepart(scope.row)"
                >{{ $t('views.strategyManage.edit') }}</el-button
              >
              <el-button
                v-if="scope.row.id > 0"
                type="text"
                @click="deleteDepart(scope.row)"
                >{{ $t('views.strategyManage.del') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="$t('views.strategyManage.operate')"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          ref="ruleForm"
          :model="form"
          label-width="140px"
          :rules="rules"
        >
          <el-form-item :label="$t('views.strategyManage.tname')" prop="name">
            <el-input
              v-model="form.name"
              class="depart-dialog-item"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('views.strategyManage.clear') }}
          </el-button>
          <el-button type="primary" @click="enterAdd">{{
            $t('views.strategyManage.enter')
          }}</el-button>
        </div>
      </el-dialog>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { UserListObj, UserAddParams, Department } from './types'
import { Form } from 'element-ui'

@Component({ name: 'DepartmentList' })
export default class DepartmentList extends VueBase {
  private dialogFormVisible = false
  private type = 'add'
  private keyword = ''
  private addDepart(row: any) {
    this.type = 'add'
    this.dialogFormVisible = true
    this.form.talent = row.departmentId
    this.form.parent = row.id > 0 ? row.id : -1
    console.log(this.form)
  }
  private editDepart(row: any) {
    this.type = 'edit'
    this.dialogFormVisible = true
    this.form.talent = row.departmentId
    this.form.id = row.id
    this.form.name = row.label
  }

  private async deleteDepart(row: any) {
    const params = { talent: 0, id: 0 }
    params.talent = row.departmentId
    params.id = row.id
    const res = await this.services.department.departmentDel(row.id, params)
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.departmentList()
    } else {
      this.$message.error(res.msg)
    }
  }
  private newSelectData() {
    this.departmentList()
  }
  private enterAdd() {
    ;(this.$refs.ruleForm as Form).validate(async (valid: any) => {
      if (valid) {
        if (this.form.name === '') {
          this.$message.warning(
            this.$t('views.strategyManage.twname') as string
          )
          return
        }
        let res: any
        switch (this.type) {
          case 'add':
            res = await this.services.department.departmentAdd(this.form)
            break
          case 'edit':
            res = await this.services.department.departmentUpdate(
              this.form.id,
              this.form
            )
            break
        }
        if (res.status === 201) {
          this.$message.success(res.msg)
          this.form = {
            id: 0,
            name: '',
            parent: 0,
            talent: 0,
          }
          this.dialogFormVisible = false
          this.departmentList()
        } else {
          this.$message.error(res.msg)
        }
      }
    })
  }
  private form = {
    name: '',
    parent: 0,
    id: 0,
    talent: 0,
  }
  private rules = {
    name: [
      {
        required: true,
        message: this.$t('views.strategyManage.twname') as string,
        trigger: 'change',
      },
    ],
  }
  private tableData = []
  fmtOptions(options: Array<any>, id: number) {
    options.forEach((item: any) => {
      if (id) {
        item.departmentId = id
      } else {
        item.departmentId = -item.id
      }
      if (item.children.length) {
        this.fmtOptions(item.children, item.departmentId)
      } else {
        delete item.children
      }
    })
  }
  async departmentList() {
    const res = await this.services.user.departmentList()
    if (res.status === 201) {
      res.data = res.data.filter(
        (item: any) => item.label.indexOf(this.keyword) > -1
      )
      this.fmtOptions(res.data, 0)
      this.tableData = res.data
    }
  }
  created() {
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
/deep/.depart-dialog-item {
  width: calc(100% - 160px);
}
/deep/.add-user {
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: 500;
  color: #4a72ae;
  border-top: 1px solid #ccc;
}
</style>
