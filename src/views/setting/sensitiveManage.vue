<template>
  <div class="content-warp">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span
            >{{ $t('views.sensitiveManage.t')
            }}<span class="beta">Beta</span></span
          >
        </div>
        <div>
          <p>
            {{ $t('views.sensitiveManage.p1') }}
          </p>
          <p>{{ $t('views.sensitiveManage.p2') }}</p>
          <p>{{ $t('views.sensitiveManage.p3') }}</p>
          <p>
            {{ $t('views.sensitiveManage.p4') }}
          </p>
          <p>
            {{ $t('views.sensitiveManage.p5') }}
          </p>
          <p>
            {{ $t('views.sensitiveManage.p6') }}
          </p>
        </div>
      </el-card>
    </div>
    <div>
      <div class="total-bar">
        <el-button
          size="small"
          class="btn-border"
          icon="el-icon-circle-plus-outline"
          @click="sensitiveDialogAdd"
          >{{ $t('views.sensitiveManage.add') }}</el-button
        >
        <div class="search-box">
          <el-input
            v-model="name"
            size="small"
            :placeholder="$t('views.sensitiveManage.searchValue')"
            style="width: 200px; margin-left: 10px"
            class="search-input"
            @keydown.native.enter="getTableData"
          >
          </el-input>
          <el-button class="btn search" @click="getTableData">
            {{ $t('views.sensitiveManage.search') }}
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" class="sensitiveManageTable">
        <el-table-column
          :label="$t('views.sensitiveManage.name')"
          prop="vul_name"
          width="160px"
        >
          <template slot-scope="{ row }">
            <div class="two-line">
              {{ row.strategy_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.sensitiveManage.detail')"
          prop="vul_desc"
          min-width="300px"
        >
          <template slot-scope="{ row }">
            <div>
              {{
                pattern_type_map[row.pattern_type_id] &&
                pattern_type_map[row.pattern_type_id].name
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('views.sensitiveManage.fix')"
          prop="vul_fix"
          min-width="200px"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{ row.pattern }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('views.sensitiveManage.status')"
          prop="state"
          width="100px"
        >
          <template slot-scope="{ row }">
            <div style="cursor: pointer" @click="stateChange(row)">
              <el-switch
                :disabled="userInfo.role !== 1 && userInfo.role !== 2"
                :value="row.status === 1"
                active-color="#1A80F2"
                inactive-color="#C1C9D3"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="userInfo.role === 1 || userInfo.role === 2"
          :label="$t('views.sensitiveManage.settings')"
          width="160px"
        >
          <template slot-scope="{ row }">
            <el-button
              size="small"
              class="btn"
              @click="sensitiveDialogEdit(row)"
              >{{ $t('views.sensitiveManage.edit') }}</el-button
            >

            <el-button
              size="small"
              class="btn"
              @click="sensitiveDialogDelete(row)"
              >{{ $t('views.sensitiveManage.del') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          :current-page="page"
          background
          layout=" prev, pager, next, jumper,total"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { StrategyListObj } from '@/views/setting/types'

@Component({ name: 'sensitiveManage' })
export default class sensitiveManage extends VueBase {
  private tableData: Array<StrategyListObj> = []
  private pattern_type = []
  private pattern_type_map = {}
  private page = 1
  private total = 0
  private name = ''
  private async stateChange(row: any) {
    this.loadingStart()
    const res = await this.services.setting.update_sensitive_info_rule({
      ...row,
      ...{ status: row.status === 0 ? 1 : 0 },
    })
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.getTableData()
    } else {
      this.$message.error(res.msg)
    }
  }

  private handleCurrentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  async created() {
    this.loadingStart()
    await this.getPatternType()
    await this.getTableData()
    this.loadingDone()
  }
  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }

  private async getPatternType() {
    const res = await this.services.setting.pattern_type()
    if (res.status === 201) {
      this.pattern_type = res.data
      this.pattern_type.forEach((item: any) => {
        this.$set(this.pattern_type_map, item.id, {
          name: item.name,
          url: item.url,
        })
      })
    } else {
      this.$message.error(res.msg)
    }
  }
  private async getTableData() {
    this.loadingStart()
    const {
      status,
      msg,
      data,
      page,
    } = await this.services.setting.get_sensitive_info_rule({
      page: this.page,
      page_size: 20,
      name: this.name,
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
    this.tableData = data
    this.total = page.alltotal
  }
  private sensitiveDialogAdd() {
    this.$router.push({ name: 'sensitive' })
  }
  private sensitiveDialogEdit(row: any) {
    this.$router.push({
      name: 'sensitive',
      query: {
        id: row.id,
      },
    })
  }
  private async sensitiveDialogDelete(row: any) {
    this.$confirm(
      this.$t('views.projectEdit.deleteWarning') as string,
      this.$t('views.projectEdit.deletePop') as string,
      {
        confirmButtonText: this.$t('views.projectEdit.enter') as string,
        cancelButtonText: this.$t('views.projectEdit.clear') as string,
        type: 'warning',
      }
    ).then(async () => {
      const res = await this.services.setting.delete_sensitive_info_rule_one({
        id: row.id,
      })
      if (res.status === 201) {
        this.$message({
          type: 'success',
          message: res.msg,
        })
        this.getTableData()
      } else {
        this.$message({
          type: 'error',
          message: res.msg,
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
/deep/.el-card__header {
  background: rgba(255, 150, 87, 0.1);
  padding: 8px !important;
  border-bottom: none;
  .clearfix {
    background: rgba(255, 226, 208, 1);
    padding: 8px;
    .beta {
      display: inline-block;
      padding: 0px 6px;
      margin-left: 4px;
      color: #ff9657;
      background: #ffceb0;
      border-radius: 8px 8px 8px 0px;
    }
  }
}
/deep/.el-card__body {
  background: rgba(255, 150, 87, 0.1);
  padding: 16px;
  padding-top: 0;
}
.content-warp {
  padding: 38px 14px 40px 14px;
}
.search-input {
  border-right: none;
}
.search-box {
  display: flex;
  align-items: center;
  /deep/.el-input__inner {
    border-right: none;
    border-radius: 0;
  }
}
.btn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  &.search {
    height: 34px;
    margin-left: -1px;
  }
}
.btn-border {
  border-radius: 2px;
  color: #4a72ae;
  border-color: #4a72ae;
}
.submit {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}
.cancel {
  width: 124px;
  height: 38px;
  line-height: 0;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}
.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.pagination-box {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
