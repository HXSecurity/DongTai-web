<template>
  <main class="container">
    <div class="talentContent">
      <div class="titleLine flex-row-space-between">
        <div class="btn" @click="addDialogShow">
          <i class="iconfont iconxinzengyonghu"></i>
          {{ $t('views.talent.title.add') }}
        </div>
        <el-input
          v-model="keywords"
          style="width: 462px"
          :placeholder="$t('views.talent.title.placeholder')"
          @keyup.enter.native="newSelectData"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="newSelectData"
          />
        </el-input>
      </div>
      <el-table class="talentListTable" :data="tableData">
        <el-table-column
          :label="$t('views.talent.table.name')"
          prop="talent_name"
        ></el-table-column>
        <el-table-column
          :label="$t('views.talent.table.enable')"
          prop="is_active"
        >
          <template slot-scope="{ row }">
            {{
              row.is_active
                ? $t('views.talent.table.on')
                : $t('views.talent.table.off')
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.talent.table.create')"
          prop="create_time"
        >
          <template slot-scope="{ row }">
            {{ fmtStr(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.talent.table.update')"
          prop="update_time"
        >
          <template slot-scope="{ row }">
            {{ fmtStr(row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('views.talent.table.modifyBy')"
          prop="created"
        ></el-table-column>
        <el-table-column
          :label="$t('views.talent.table.operate')"
          width="100px"
        >
          <template slot-scope="{ row }">
            <i class="iconfont iconshezhi-2 pIcon" @click="talentEdit(row)"></i>
            <i
              class="iconfont iconshanchu-6 pIcon"
              @click="talentDelete(row.id)"
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
      :title="
        this.isEdit === false
          ? $t('views.talent.title.add')
          : $t('views.talent.title.modify')
      "
    >
      <el-form
        ref="ruleForm"
        label-width="150px"
        :model="talentForm"
        status-icon
      >
        <el-form-item :label="$t('views.talent.table.name')" prop="talent_name">
          <el-input
            v-model="talentForm.talent_name"
            :placeholder="$t('views.talent.add.placeholder')"
            clearable
            class="addTalentInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="this.isEdit === false"
          :label="$t('views.talent.add.email')"
        >
          <el-input
            v-model="talentForm.email"
            :placeholder="$t('views.talent.add.emailPlaceholder')"
            clearable
            class="addTalentInput"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.talent.add.enable')" prop="is_active">
          <el-select
            v-model="talentForm.is_active"
            class="addTalentInput"
            clearable
            style="width: 400px"
          >
            <el-option
              :label="$t('views.talent.add.on')"
              :value="true"
            ></el-option>
            <el-option
              :label="$t('views.talent.add.off')"
              :value="false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="submitBtn" @click="talentAdd">{{
            $t('views.talent.add.submit')
          }}</el-button>
          <el-button type="text" class="cancelBtn" @click="cancelAdd">{{
            $t('views.talent.add.cancel')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { TalentListObj, TalentAddParams } from './types'
import { Form } from 'element-ui'
import { formatTimestamp } from '@/utils/utils'
@Component({ name: 'TalentList' })
export default class TalentList extends VueBase {
  private page = 1
  private pageSize = 20
  private total = 0
  private keywords = ''
  private tableData: Array<TalentListObj> = []
  private addDialogOpen = false
  private isEdit = false
  private talentForm: TalentAddParams = {
    talent_name: '',
    is_active: true,
    id: 0,
  }
  created() {
    this.getTableData()
  }

  private fmtStr(timestamp: number | any) {
    return formatTimestamp(timestamp)
  }
  private addDialogShow() {
    this.talentForm = {
      talent_name: '',
      is_active: true,
    }
    this.addDialogOpen = true
    this.isEdit = false
  }

  private talentEdit(row: TalentListObj) {
    this.talentForm = {
      talent_name: row.talent_name,
      is_active: row.is_active,
      id: row.id,
    }
    this.addDialogOpen = true
    this.isEdit = true
  }

  private cancelAdd() {
    this.addDialogOpen = false
    this.isEdit = false
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
      name?: string
    } = {
      page: this.page,
      pageSize: this.pageSize,
    }
    if (this.keywords) {
      params.name = this.keywords
    }
    this.loadingStart()
    const { status, msg, data, total } = await this.services.talent.talentList(
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message({ type: 'error', message: msg, showClose: true })
      return
    }
    this.tableData = data
    this.total = total
  }

  private async talentAdd() {
    this.loadingStart()
    if (this.isEdit) {
      const params: TalentAddParams = {
        talent_name: this.talentForm.talent_name,
        is_active: this.talentForm.is_active,
        id: this.talentForm.id,
      }
      const { status, msg } = await this.services.talent.talentEdit(params)
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
      const params: TalentAddParams = {
        talent_name: this.talentForm.talent_name,
        email: this.talentForm.email,
        is_active: this.talentForm.is_active,
      }
      const { status, msg } = await this.services.talent.talentAdd(params)
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
  }

  private async talentDelete(id: number) {
    this.$confirm(this.$t('views.talent.delete.confirm') as string, {
      confirmButtonText: this.$t('views.talent.delete.confirmBtn') as string,
      cancelButtonText: this.$t('views.talent.delete.cancelBtn') as string,
      type: 'warning',
      center: true,
    }).then(async () => {
      this.loadingStart()
      const { status, msg } = await this.services.talent.talentDelete(id)
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
        message: msg,
        showClose: true,
      })
      this.getTableData()
    })
  }
}
</script>

<style scoped lang="scss">
.talentContent {
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
