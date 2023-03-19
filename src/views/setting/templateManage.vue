<template>
  <div class="content-warp">
    <div>
      <div class="total-bar">
        <el-button
          size="small"
          class="btn-border"
          icon="el-icon-circle-plus-outline"
          @click="templateDialogAdd"
          >{{ $t('views.templateManage.add') }}</el-button
        >
        <div class="search-box">
          <el-input
            v-model="name"
            size="small"
            :placeholder="$t('views.templateManage.searchValue')"
            style="width: 200px; margin-left: 10px"
            class="search-input"
            @keydown.native.enter="getTableData"
          >
          </el-input>
          <el-button class="btn search" @click="getTableData">
            {{ $t('views.templateManage.search') }}
          </el-button>
        </div>
      </div>
      <el-table :data="tableData" class="templateManageTable" border>
        <el-table-column
          :label="$t('views.templateManage.name')"
          min-width="160px"
        >
          <template slot-scope="{ row }">
            <div class="vul_name" @click="toPath(1, row.id)">
              {{ row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('views.templateManage.status')"
          prop="state"
          width="140px"
          align="center"
        >
          <template slot-scope="{ row }">
            <div style="cursor: pointer" @click="stateChange(row)">
              <el-switch
                :value="row.status === 1"
                active-color="#1A80F2"
                inactive-color="#C1C9D3"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.templateManage.settings')"
          align="center"
          width="200px"
        >
          <template slot-scope="{ row }">
            <div class="table-btn-box">
              <el-button
                size="small"
                style="color: #4a72ae"
                type="text"
                @click="templateDialogEdit(row)"
                >{{ $t('views.templateManage.edit') }}</el-button
              >
              <span class="l"> | </span>
              <el-button
                size="small"
                type="text"
                style="color: #f56262"
                @click="templateDialogDelete(row)"
                >{{ $t('views.templateManage.del') }}</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          :current-page="page"
          background
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page_size"
          layout=" prev, pager, next, jumper, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
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

@Component({ name: 'templateManage' })
export default class templateManage extends VueBase {
  private tableData: Array<StrategyListObj> = []
  private page = 1
  private page_size = 20
  private total = 0
  private name = ''
  private async stateChange(row: any) {
    this.loadingStart()
    const res = await this.services.setting.update_scan_strategy({
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

  private handleSizeChange(val: number) {
    this.page_size = val
    this.getTableData()
  }

  private handleCurrentChange(val: number) {
    this.page = val
    this.getTableData()
  }

  async created() {
    this.loadingStart()
    await this.getTableData()
    this.loadingDone()
  }
  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }

  private async getTableData() {
    this.loadingStart()
    const { status, msg, data, page } =
      await this.services.setting.get_scan_strategy({
        page: this.page,
        page_size: this.page_size,
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
    if (data.length === 0 && this.page > 1) {
      this.page--
      await this.getTableData()
      return
    }
    this.tableData = data
    this.total = page.alltotal
  }

  toPath(view: any, id: any) {
    this.$router.push({
      name: 'template',
      query: {
        view,
        id,
      },
    })
  }

  private templateDialogAdd() {
    this.$router.push({ name: 'template' })
  }
  private templateDialogEdit(row: any) {
    this.$router.push({
      name: 'template',
      query: {
        id: row.id,
      },
    })
  }
  private async templateDialogDelete(row: any) {
    this.$confirm(
      this.$t('views.templateManage.deleteWarning') as string,
      this.$t('views.templateManage.deletePop') as string,
      {
        confirmButtonText: this.$t('views.templateManage.enter') as string,
        cancelButtonText: this.$t('views.templateManage.clear') as string,
        type: 'warning',
      }
    ).then(async () => {
      const res = await this.services.setting.delete_scan_strategy_one({
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
::v-deep.el-card__header {
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
::v-deep.el-card__body {
  background: rgba(255, 150, 87, 0.1);
  padding: 16px;
  padding-top: 0;
}
.content-warp {
  padding: 20px 14px 40px 14px;
}
.search-input {
  border-right: none;
}
.search-box {
  display: flex;
  align-items: center;
  ::v-deep.el-input__inner {
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
.templateManageTable {
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

.vul_name {
  color: rgba(26, 128, 242, 1);
  cursor: pointer;
}
</style>
