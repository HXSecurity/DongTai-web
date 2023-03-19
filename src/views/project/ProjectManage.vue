<template>
  <main class="container manage-container">
    <div class="top-line flex-row-space-between">
      {{ $t('views.projectManage.title') }}
    </div>
    <div class="select-warp flex-row-space-between">
      <div class="flex-column-center">
        <el-button
          type="text"
          class="projectAdd"
          @click="$router.push('/project/projectEdit')"
        >
          <i class="iconfont">&#xe6ad;</i>
          <span>{{ $t('views.projectManage.add') }}</span>
        </el-button>
      </div>
      <div class="flex-column-center">
        <el-input
          v-model="searchObj.name"
          :placeholder="$t('views.projectManage.searchName')"
          style="width: 360px"
          size="small"
          @keyup.enter.native="newSelectData"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
    </div>
    <div class="list-warp">
      <el-table :data="tableData" class="projectList-table">
        <el-table-column prop="name" :label="$t('views.projectManage.name')">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.name"
              placement="top"
              :disabled="row.name.length < 44"
            >
              <div
                class="projectName"
                @click="$router.push(`/project/projectDetail/${row.id}`)"
              >
                {{ row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="480px"
          style="padding-left: 20px"
          :label="$t('views.projectManage.vul')"
        >
          <template slot-scope="{ row }">
            <span
              v-for="item in row.vul_count"
              :key="item.level"
              style="margin-right: 10px"
              class="level-type"
              :class="getLevel(item.level)"
            >
              {{ item.name }}&nbsp;&nbsp;&nbsp;{{ item.total }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="latest_time"
          width="250px"
          :label="$t('views.projectManage.time')"
        ></el-table-column>
        <el-table-column
          :label="$t('views.projectManage.manage')"
          width="120px"
        >
          <template slot-scope="{ row }">
            <div class="table-btn-box">
              <i
                class="iconfont iconshezhi-2 pIcon"
                @click="$router.push(`/project/projectEdit/${row.id}`)"
              ></i>
              <span class="l"></span>
              <i
                class="iconfont iconshanchu-6 pIcon"
                @click="projectDelete(row.id)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { ProjectListParams } from './types'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'ProjectManage' })
export default class ProjectManage extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private tableData: Array<ProjectListParams> = []
  private searchObj = {
    name: '',
  }

  private getLevel(type: number) {
    switch (type) {
      case 1:
        return 'height'
      case 2:
        return 'middle'
      case 3:
        return 'low'
      case 5:
        return 'info'
      default:
        break
    }
  }

  created() {
    this.getTableData()
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
    const params = {
      page: this.page,
      pageSize: this.pageSize,
      name: this.searchObj.name,
    }
    this.loadingStart()
    const { status, msg, data, page } = await this.services.project.projectList(
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
    this.tableData = data.reduce(
      (list: Array<ProjectListParams>, item: ProjectListParams) => {
        item.vul_count.sort((a, b) => a.level - b.level)
        list.push({
          ...item,
          latest_time: formatTimestamp(item.latest_time),
        })
        return list
      },
      []
    )
    this.total = page.alltotal
  }
  private async projectDelete(id: number) {
    this.$confirm(this.$t('views.projectManage.deleteConfirm') as string, '', {
      confirmButtonText: this.$t('views.projectManage.delete') as string,
      cancelButtonText: this.$t('views.projectManage.cancel') as string,
      type: 'warning',
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.project.projectDelete({ id })
      this.loadingDone()
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
        return
      }
      this.$message({
        type: 'success',
        message: this.$t('views.projectManage.deleteSuccess') as string,
        showClose: true,
      })
      this.getTableData()
    })
  }
}
</script>

<style scoped lang="scss">
.manage-container {
  margin-top: 16px;
  padding: 24px;
  background-color: #fff;

  .top-line {
    color: #38435a;
    font-size: 16px;
    font-weight: 600;
    img {
      width: 22px;
      height: 22px;
      cursor: pointer;
    }
  }
  .projectList-table {
    &.el-table {
      border-left: 1px solid #e5e6eb;
      border-right: 1px solid #e5e6eb;
      border-top: 1px solid #e5e6eb;
      ::v-deepth {
        background: #f2f3f5;
        .cell {
          color: #38435a;
          .el-checkbox {
            margin-left: 4px;
          }
        }
      }
    }
  }

  .level-type {
    height: 24px;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 32px;
    line-height: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &.height {
      background: rgba(229, 99, 99, 0.1);
      color: #e56363;
    }
    &.middle {
      background: rgba(244, 158, 11, 0.1);
      color: #f49e0b;
    }
    &.low {
      background: rgba(47, 144, 234, 0.1);
      color: #2f90ea;
    }
    &.info {
      background: rgba(172, 180, 196, 0.1);
      color: #abb2c0;
    }
  }
  .table-btn-box {
    display: flex;
    align-items: center;
    color: #1a80f2;
    .l {
      height: 10px;
      border-left: 1px solid #b6bbc5;
    }
    .iconshezhi-2 {
      margin-right: 12px;
    }
    .iconshanchu-6 {
      margin-left: 12px;
    }
  }
}
.select-warp {
  margin: 16px 0;
  width: 100%;
  .projectAdd {
    padding: 0 16px;
    background: #1a80f2;
    border-radius: 2px;
    border: 0px solid #1a80f2;
    color: #ffffff;
    height: 32px;
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 14px;
      margin-right: 4px;
    }
  }
}

.list-warp {
  width: 100%;
  background: #fff;
  min-height: calc(100vh - 153px);
}
.pIcon {
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    color: #1a80f2;
  }
}

.projectName {
  width: 200px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  cursor: pointer;
  color: #4b99f1;
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
