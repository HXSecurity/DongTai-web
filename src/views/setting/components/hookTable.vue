<template>
  <div class="table-body">
    <div>
      <el-button @click="hookTypeDialog = true">添加规则类型</el-button>
      <el-button @click="hookDialog = true">添加规则</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="rule_type" label="规则类型" width="180">
      </el-table-column>
      <el-table-column prop="value" label="规则详情" width="180">
      </el-table-column>
      <el-table-column prop="source" label="污点输入" width="180">
      </el-table-column>
      <el-table-column prop="target" label="污点输出" width="180">
      </el-table-column>
      <el-table-column prop="inherit" label="是否继承" width="180">
        <template slot-scope="scope">
          {{ scope.row.inherit === 'true' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="修改时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.update_time | formatTimestamp }}
        </template>
      </el-table-column>
      <el-table-column prop="user" label="创建者" width="180">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="180">
      </el-table-column>
    </el-table>

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

    <el-dialog :visible.sync="hookTypeDialog">
      <el-form :model="hookType" label-width="80px">
        <el-form-item label="规则集">
          <span>{{ hookType.key1 }}</span>
        </el-form-item>
        <el-form-item label="类型名称">
          <el-input v-model="hookType.key2"></el-input>
        </el-form-item>
        <el-form-item label="类型简称">
          <el-input v-model="hookType.key3"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="hookType.key4"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="hookDialog">
      <el-form :model="hook" label-width="80px">
        <el-form-item label="规则集">
          <span>{{ hookType.key1 }}</span>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-input v-model="hookType.key2"></el-input>
        </el-form-item>
        <el-form-item label="规则详情">
          <el-input v-model="hookType.key2"></el-input>
        </el-form-item>
        <template>
          <el-form-item label="污点去向">
            <el-select
              v-model="hookType.key2"
              placeholder="请选择数据源"
              style="width: 79%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div style="float: right">
              <el-button type="text">增加</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="hookType.key2"
              placeholder="请选择逻辑关系"
              style="width: 25%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="hookType.key2"
              placeholder="参数"
              style="width: 25%; margin-left: 2%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="hookType.key2"
              style="width: 25%; margin-left: 2%"
            ></el-input>
            <div style="float: right">
              <el-button type="text">增加</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </el-form-item>
        </template>
        <template>
          <el-form-item label="污点去向">
            <el-select
              v-model="hookType.key2"
              placeholder="请选择数据源"
              style="width: 79%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <div style="float: right">
              <el-button type="text">增加</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="hookType.key2"
              placeholder="请选择逻辑关系"
              style="width: 25%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="hookType.key2"
              placeholder="参数"
              style="width: 25%; margin-left: 2%"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              v-model="hookType.key2"
              style="width: 25%; margin-left: 2%"
            ></el-input>
            <div style="float: right">
              <el-button type="text">增加</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="继承深度">
          <el-radio v-model="hookType.radio" label="1">仅当前类</el-radio>
          <el-radio v-model="hookType.radio" label="2">仅子类</el-radio>
          <el-radio v-model="hookType.radio" label="2">当前类及其子类</el-radio>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueBase from '../../../VueBase'
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
@Component({
  name: 'HookTable',
  filters : {
    formatTimestamp(date: number | any) {
      return formatTimestamp(date)
    },
  }
})
export default class HookTable extends VueBase {
  @Prop({ default: '0', type: String }) ruleType!: string
  hookTypeDialog = false
  hookDialog = false
  hookType = { key1: '', key2: '', key3: '', key4: false }
  hook = {}
  options = [{ label: '1', key: '2' }]
  tableData = []
  pageSize = 20
  currentPage = 1
  total = 0
  async getTable() {
    this.loadingStart()
    const {
      status,
      msg,
      data,
      page,
    } = await this.services.setting.hookRuleList({
      page: this.currentPage,
      pageSize: this.pageSize,
      type: this.ruleType,
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.total = page.alltotal
    this.tableData = data
  }
  handleSizeChange(val: number) {
    this.pageSize = val
    this.currentPage = 1
    this.getTable()
  }
  handleCurrentChange(val: number) {
    this.currentPage = val
    this.getTable()
  }
  created() {
    this.getTable()
  }

}
</script>

<style scoped>
.table-body {
  padding: 20px;
}
</style>
