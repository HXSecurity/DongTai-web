<template>
  <div class="content-warp">
    <div class="total-bar">
      <el-button size="small" class="btn" @click="addStrategy">{{
        $t('views.strategyManage.addTitle')
      }}</el-button>
      <div class="search">
        <el-input
          v-model="searchValue"
          size="small"
          :placeholder="$t('views.strategyManage.searchValue')"
          @keyup.enter.native="getTableData"
        ></el-input>
      </div>
    </div>
    <el-table :data="tableData" class="strategyManageTable">
      <el-table-column
        :label="$t('views.strategyManage.name')"
        prop="vul_name"
        width="160px"
      >
        <template slot-scope="{ row }">
          <div v-if="!row.isEdit" class="two-line">{{ row.vul_name }}</div>
          <el-input
            v-else
            v-model="row.vul_name"
            type="textarea"
            autosize
            resize="none"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.strategyManage.detail')"
        prop="vul_desc"
        min-width="300px"
      >
        <template slot-scope="{ row }">
          <div v-if="!row.isEdit">{{ row.vul_desc }}</div>
          <el-input
            v-else
            v-model="row.vul_desc"
            type="textarea"
            autosize
            resize="none"
            size="mini"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('views.strategyManage.fix')"
        prop="vul_fix"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="!row.isEdit">
            {{ row.vul_fix || $t('views.strategyManage.no') }}
          </div>
          <el-input
            v-else
            v-model="row.vul_fix"
            type="textarea"
            resize="none"
            autosize
            size="mini"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('views.strategyManage.level')"
        prop="level"
        min-width="200px"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>
            {{ vul_levels_map[row.level] }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="userInfo.role === 1 || userInfo.role === 2"
        :label="$t('views.strategyManage.status')"
        prop="state"
        width="100px"
      >
        <template slot-scope="{ row }">
          <div @click="stateChange(row.id, row.state)">
            <el-switch
              :value="row.state === 'enable'"
              active-color="#1A80F2"
              inactive-color="#C1C9D3"
            >
            </el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="userInfo.role === 1 || userInfo.role === 2"
        :label="$t('views.strategyManage.settings')"
        width="160px"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="!row.isEdit"
            size="small"
            class="btn"
            @click="editStart(row)"
            >{{ $t('views.strategyManage.edit') }}</el-button
          >
          <el-button size="small" class="btn" @click="deleteManage(row)">{{
            $t('views.strategyManage.del')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        background
        page-size="20"
        layout=" prev, pager, next, jumper,total"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog
      :show-close="false"
      :visible="showDialog"
      width="650px"
      :title="
        dialogForm.id
          ? $t('views.strategyManage.editTitle')
          : $t('views.strategyManage.addTitle')
      "
    >
      <el-form
        ref="ruleForm"
        :model="dialogForm"
        rules="rules"
        :label-width="$i18n.locale === 'en' ? '120px' : '80px'"
      >
        <el-form-item :label="$t('views.strategyManage.name')">
          <el-input v-model="dialogForm.vul_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.strategyManage.detail')">
          <el-input
            v-model="dialogForm.vul_desc"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.strategyManage.fix')">
          <el-input
            v-model="dialogForm.vul_fix"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('views.strategyManage.level')">
          <el-select v-model="dialogForm.level_id">
            <el-option
              v-for="item in vul_levels"
              :key="item.id"
              :label="item.name_value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('views.strategyManage.status')">
          <el-switch
            v-model="dialogForm.state"
            active-value="enable"
            inactive-value="disable"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="small" class="submit btn" @click="dialogEnter">
          {{ $t('views.projectEdit.save') }}
        </el-button>
        <el-button type="text" class="cancel" @click="dialogClose">
          {{ $t('views.projectEdit.clear') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { StrategyListObj } from '@/views/setting/types'

@Component({ name: 'StrategyManage' })
export default class StrategyManage extends VueBase {
  private tableData: Array<StrategyListObj> = []
  private showDialog = false
  private searchValue = ''
  private vul_levels = []
  private vul_levels_map = {}
  private page = 1
  private total = 0
  private dialogForm: any = {
    vul_name: '',
    vul_type: '',
    state: '',
    vul_desc: '',
    level_id: undefined,
    vul_fix: '',
  }
  async getVulLevels() {
    this.loadingStart()
    const res = await this.services.setting.vul_levels()
    this.loadingDone()
    if (res.status === 201) {
      this.vul_levels = res.data
      this.vul_levels.forEach((item: any) => {
        this.$set(this.vul_levels_map, item.id, item.name_value)
      })
    } else {
      this.$message.error(res.msg)
    }
  }
  async created() {
    await this.getVulLevels()
    await this.getTableData()
  }
  addStrategy() {
    this.showDialog = true
  }
  editStrategy(row: any) {
    this.dialogForm = JSON.parse(JSON.stringify(row))
    this.showDialog = true
  }
  dialogEnter() {
    if (this.dialogForm.id) {
      this.editStrategyApi()
    } else {
      this.addStrategyApi()
    }
  }
  async addStrategyApi() {
    const { status, msg } = await this.services.setting.addManage({
      vul_name: this.dialogForm.vul_name,
      vul_desc: this.dialogForm.vul_desc,
      vul_fix: this.dialogForm.vul_fix,
      vul_type: this.dialogForm.vul_name,
      level_id: this.dialogForm.level_id,
      state: this.dialogForm.state,
    })
    if (status === 201) {
      this.$message.success(msg)
      this.getTableData()
      this.dialogClose()
    } else {
      this.$message.error(msg)
    }
  }
  async editStrategyApi() {
    this.loadingStart()
    const { status, msg } = await this.services.setting.updateManage(
      this.dialogForm.id,
      {
        vul_name: this.dialogForm.vul_name,
        vul_desc: this.dialogForm.vul_desc,
        vul_fix: this.dialogForm.vul_fix,
        vul_type: this.dialogForm.vul_name,
        level_id: this.dialogForm.level_id,
        state: this.dialogForm.state,
      }
    )
    this.loadingDone()
    if (status === 201) {
      this.$message.success(msg)
      this.getTableData()
      this.dialogClose()
    } else {
      this.$message.error(msg)
    }
  }
  dialogClose() {
    this.showDialog = false
    this.dialogForm = {
      vul_name: '',
      vul_type: '',
      state: '',
      vul_desc: '',
      level_id: undefined,
      vul_fix: '',
    }
  }
  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }

  private backItem = {}
  private editStart(item: any) {
    this.showDialog = true
    this.dialogForm = JSON.parse(JSON.stringify(item))
  }

  private async deleteManage(item: any) {
    if (this.tableData.some((i: any) => i.isEdit)) {
      this.$message({
        type: 'warning',
        message: this.$t('views.strategyManage.warning') as string,
        showClose: true,
      })
      return
    }
    this.$confirm(
      this.$t('views.strategyManage.deleteWarning') as string,
      this.$t('views.strategyManage.deletePop') as string,
      {
        confirmButtonText: this.$t('views.strategyManage.enter') as string,
        cancelButtonText: this.$t('views.strategyManage.clear') as string,
        type: 'warning',
      }
    ).then(async () => {
      const { status, msg } = await this.services.setting.deleteManage(item.id)
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
      } else {
        this.$message({ type: 'success', message: msg, showClose: true })
        await this.getTableData()
      }
    })
  }

  private async editEnd(item: any, flag: boolean) {
    if (flag) {
      const { status, msg } = await this.services.setting.updateManage(
        item.id,
        { name: item.vul_name, vul_desc: item.vul_desc, vul_fix: item.vul_fix }
      )
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
      } else {
        this.$message({ type: 'success', message: msg, showClose: true })
      }
    } else {
      for (const key in item) {
        item[key] = this.backItem[key]
      }
      this.backItem = {}
    }
    this.$set(item, 'isEdit', false)
  }

  private async handleCurrentChange(page: number) {
    this.page = page
    await this.getTableData()
  }

  private async getTableData() {
    this.loadingStart()
    const {
      status,
      msg,
      data,
      page,
    } = await this.services.setting.strategyList(false, {
      page: this.page,
      page_size: 20,
      name: this.searchValue,
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
    this.total = page.alltotal
    this.tableData = data
  }

  private async stateChange(id: number, state: string) {
    if (state === 'enable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyDisable(id)
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
    if (state === 'disable') {
      this.loadingStart()
      const { status, msg } = await this.services.setting.strategyEnable(id)
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
  }
}
</script>

<style scoped lang="scss">
.content-warp {
  padding: 38px 14px 40px 14px;
}

.install {
  cursor: pointer;
  color: #a7afb9;
}

.uninstall {
  cursor: pointer;
  color: #a7afb9;
  margin-left: 18px;
}
.btn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}
.two-line {
  letter-spacing: 0;
  width: 140px;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /*要显示的行数*/
  -webkit-box-orient: vertical;
  font-size: 12px;
}
.total-bar {
  display: flex;
  justify-content: space-between;
}
.pagination-box {
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
