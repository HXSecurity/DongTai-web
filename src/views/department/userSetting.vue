<template>
  <main class="depart">
    <div>
      <div class="top">
        <el-button class="btn" @click="openDialog('add')">
          <i class="el-icon-circle-plus-outline"></i> 新增部门
        </el-button>
        <el-input class="ipt" placeholder="输入部门名称进行搜索"></el-input>
      </div>
      <div class="bottom">
        <el-table :data="tableData" class="depart-table" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="openDialog('edit', scope.row)"
                >编辑</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :current-page.sync="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, prev,pager,next,jumper"
            :total="1000"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="140px" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="form.name"
            class="depart-dialog-item"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="name">
          <el-input
            v-model="form.name"
            class="depart-dialog-item"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="region">
          <el-select
            v-model="form.region"
            class="depart-dialog-item"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="region">
          <el-select
            v-model="form.region"
            class="depart-dialog-item"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="name">
          <el-input
            v-model="form.name"
            class="depart-dialog-item"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="name">
          <el-input
            v-model="form.name"
            class="depart-dialog-item"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="name">
          <el-input
            v-model="form.name"
            class="depart-dialog-item"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <div class="depart-dialog-item">
            <el-switch v-model="form.value"> </el-switch>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
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
  private dialogFormVisible = false
  private openDialog(type: string, row?: any) {
    this.dialogFormVisible = true
  }
  private form = {
    name: '',
    region: '',
    value: true,
  }
  private rules = {
    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
    region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
  }
  private tableData = [
    {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄',
    },
    {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄',
    },
    {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄',
    },
  ]
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
</style>
