<template>
  <main
    class="container scroll-class"
    :style="{ display: projectId && 'flex' }"
  >
    <div :class="projectId ? '' : 'fixed-warp'">
      <div class="slider-warp" :style="{ marginTop: projectId && '14px' }">
        <div class="title flex-column-center" style="height: 54px">
          <div class="flex-row-space-between">
            <span class="filter-title">过滤器 </span>
            <el-button type="text" class="reset-btn" @click="reset">
              <span>重置全部</span>
            </el-button>
          </div>
        </div>
        <div
          v-if="searchOptionsObj.level.length"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 等级 </span>
        </div>
        <el-checkbox
          v-for="item in searchOptionsObj.level"
          :key="item.level_id"
          v-model="searchObj.level"
          :label="item.level_id"
          class="flex-row-space-between module-line"
          @change="getTableData(true)"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.level }}
            </div>
            <div class="num">
              {{ item.count }}
            </div>
          </div>
        </el-checkbox>

        <div
          v-if="searchOptionsObj.language.length"
          class="module-title flex-row-space-between"
        >
          <span class="filter-box-title"> 语言 </span>
        </div>
        <el-checkbox
          v-for="item in searchOptionsObj.language"
          :key="item.language"
          v-model="searchObj.language"
          :label="item.language_id"
          class="flex-row-space-between module-line"
          @change="getTableData(true)"
        >
          <div class="check-label">
            <div class="selectOption">
              {{ item.language }}
            </div>
            <div class="num">
              {{ item.count }}
            </div>
          </div>
        </el-checkbox>
      </div>
    </div>

    <div
      class="main-warp"
      :style="{ marginLeft: projectId && '28px', width: projectId && '910px' }"
    >
      <div class="sca-list">
        <div class="selectForm">
          <div class="selectInput">
            <el-input
              v-model="searchObj.keyword"
              placeholder="请输入组件名称搜索"
              class="commonInput"
              size="small"
              @keyup.enter.native="newSelectData"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="newSelectData"
              />
            </el-input>

            <div class="sort-box">
              <el-select
                v-model="searchObj.order"
                size="small"
                class="commonSelect vulnSelect"
                placeholder="选择排序条件"
                clearable
                @change="newSelectData"
              >
                <el-option
                  v-for="item in searchOptionsObj.orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <i
                v-if="searchObj.sort === null"
                class="el-icon-sort sort-btn"
                @click="sortSelect(true)"
              ></i>
              <i
                v-if="searchObj.sort === true"
                class="el-icon-sort-up sort-btn"
                @click="sortSelect(false)"
              ></i>
              <i
                v-if="searchObj.sort === false"
                class="el-icon-sort-down sort-btn"
                @click="sortSelect(null)"
              ></i>
            </div>
          </div>
        </div>
        <el-table
          class="sca-list-table"
          :data="tableData"
          style="width: 100%; margin-top: 18px; cursor: pointer"
          @row-click="goDetail"
        >
          <el-table-column
            label="组件名称"
            prop="package_name"
            fixed="left"
            min-width="240"
          >
            <template slot-scope="{ row }">
              <span class="pkg-name"
                >{{ row.package_name }} : {{ row.version }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="漏洞" prop="license" width="300px">
            <template slot-scope="{ row }">
              <div class="danger-box">
                <div class="height">{{ row.vul_critical_count }}</div>
                <div class="middle">{{ row.vul_high_count }}</div>
                <div class="low">{{ row.vul_medium_count }}</div>
                <div class="info">{{ row.vul_low_count }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :page-sizes="[10, 20, 40, 50]"
            :page-size="pageSize"
            :total="total"
            :current-page="page"
            layout=" prev, pager, next, sizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFlag"
      custom-class="sca-dialog"
      :show-close="false"
      append-to-body
      destroy-on-close
      close-on-click-modal
      width="980px"
    >
      <template slot="title">
        <div class="sca-dialog-title-box">
          <div class="top">{{ dialogInfo.package_name }}</div>
          <span
            class="el-icon-close close-btn"
            @click="dialogFlag = false"
          ></span>
          <div class="bottom">
            <div class="bottom-item">
              <div class="label">语言</div>
              <div class="info">{{ dialogInfo.language }}</div>
            </div>
            <div class="bottom-item">
              <div class="label">当前版本</div>
              <div class="info">{{ dialogInfo.version }}</div>
            </div>
            <div class="bottom-item">
              <div class="label">安全版本</div>
              <div class="info">
                <div class="version-box">
                  <p
                    v-if="
                      dialogInfo.safe_version_list &&
                      dialogInfo.safe_version_list.length
                    "
                  >
                    <el-popover placement="bottom" width="100" trigger="hover">
                      <div
                        v-for="(version, index) in dialogInfo.safe_version_list"
                        :key="index"
                        style="font-size: 12px; color: #51cb74; margin-top: 4px"
                      >
                        {{ version.version }}
                      </div>
                      <template slot="reference">
                        <div>
                          <span class="el-icon-user"></span>
                          {{ dialogInfo.latest_safe_version || '暂无' }}
                        </div>
                      </template>
                    </el-popover>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <ScaDialog v-if="dialogFlag" :dialog-info="dialogInfo"></ScaDialog>
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp } from '@/utils/utils'
import ScaDialog from './ScaDialog.vue'
import VueBase from '@/VueBase'
import { ScaListObj } from './types'
import ScrollToTop from '@/components/scrollToTop/scrollToTop.vue'

@Component({ name: 'ScaList', components: { ScrollToTop, ScaDialog } })
export default class ScaList extends VueBase {
  @Prop() version: string | number | undefined
  @Prop() projectId: any
  private sortSelect(flag: any) {
    this.searchObj.sort = flag
    this.newSelectData()
  }
  total = 0

  private dialogInfo = {}

  private debounceMyScroll: any
  private page = 1
  private pageSize = 10
  private dataEnd = false
  private tableData: Array<ScaListObj> = []
  private searchOptionsObj: any = {
    language: [],
    level: [],
    license: [],
    orderOptions: [
      {
        label: this.$t('views.scaList.orderOptions.level'),
        value: 'level',
      },
      {
        label: '漏洞数量',
        value: 'vul_count',
      },
    ],
  }

  private levelColor(level: any) {
    switch (level) {
      case 1:
        return { label: '高', color: '#E56363', bg: 'rgba(229, 99, 99, 0.1)' }
      case 2:
        return { label: '中', color: '#F49E0B', bg: 'rgba(244, 158, 11, 0.1)' }
      case 3:
        return { label: '低', color: '#2F90EA', bg: 'rgba(47, 144, 234, 0.1)' }
      case 0:
        return { label: '无', color: '#ABB2C0', bg: 'rgba(172, 180, 196, 0.1)' }
    }
  }

  private searchObj: any = {
    language: [],
    level: [],
    keyword: '',
    license: [],
    project_id: undefined,
    order: '',
    sort: null,
  }

  created() {
    if (this.projectId) {
      this.searchObj.project_id = this.projectId
    }
  }

  private reset() {
    this.searchObj.language = []
    this.searchObj.level = []
    this.searchObj.order = ''
    this.searchObj.sort = null
    this.searchObj.license = []
    this.searchObj.keyword = ''
    if (this.$route.name !== 'projectDetail/:pid') {
      this.searchObj.project_id = ''
    }
    this.newSelectData()
  }

  private kw = ''
  private async querySearchAsync(queryString: string, cb: any) {
    console.log(queryString)
    const res = await this.services.setting.searchProject({ name: queryString })
    if (res.status === 201) {
      const data = res.data.map((item: any) => {
        return {
          value: item.name,
          id: item.id,
        }
      })
      cb(data)
    }
  }

  private languageChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.language = val
    this.newSelectData()
  }

  private levelChange(val: string, stop: boolean) {
    if (stop) {
      return
    }
    this.searchObj.level = val
    this.newSelectData()
  }

  private newSelectData() {
    this.page = 1
    this.tableData = []
    this.getTableData()
  }

  mounted() {
    this.getTableData()
    this.scaSummary()
  }

  handleSizeChange(val: number) {
    this.pageSize = val
    this.getTableData()
  }
  handleCurrentChange(val: number) {
    this.page = val
    this.getTableData()
  }
  formatTimestamp(val: string) {
    return formatTimestamp(val)
  }
  public async getTableData(flag?: undefined | boolean) {
    if (flag) {
      this.page = 1
    }
    let sort = 'asc'
    if (!this.searchObj.sort) {
      sort = 'desc'
    }
    const params: any = {
      page: this.page,
      page_size: this.pageSize,
      language_ids: this.searchObj.language,
      level_ids: this.searchObj.level,
      license_ids: this.searchObj.license,
      order: sort,
      project_id: Number(this.projectId),
      project_version_id: this.version,
    }
    if (this.searchObj.keyword) {
      params.keyword = this.searchObj.keyword
    }
    if (this.searchObj.order) {
      params.order_field = this.searchObj.order
    }
    if (!this.projectId) {
      delete params.project_id
    }
    this.loadingStart()
    const { status, data, msg, page } = await this.services.sca.scaList(params)
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

  public async scaSummary() {
    const params: any = {
      keyword: this.searchObj.keyword,
    }
    if (this.projectId || this.version) {
      params.project_id = this.projectId
      params.version_id = this.version
    }
    this.loadingStart()
    console.log('params', params)
    const { status, data, msg } = await this.services.sca.scaSummary(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.searchOptionsObj.language = data.language
    this.searchOptionsObj.level = data.level
    this.searchOptionsObj.license = data.license
  }

  private dialogFlag = false
  private goDetail(row: any) {
    // this.dialogInfo = row
    // this.dialogFlag = true
    console.log(row)
    if (this.projectId) {
      this.$router.push({
        path: `/sca/scalistDetail/1/${row.id}`,
        query: {
          projectId: this.projectId,
          package_name: row.package_name,
          package_version: row.version,
          language_id: row.language_id,
        },
      })
      return
    }
    this.$router.push({
      path: `/sca/scalistDetail/1/${row.id}`,
      query: {
        package_name: row.package_name,
        package_version: row.version,
        language_id: row.language_id,
      },
    })
  }
  projectNameSplit(name: string, total: number) {
    if (name.length > total) {
      return name.substring(0, total)
    }
    return name
  }
}
</script>

<style scoped lang="scss">
.flex-row-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-title {
  font-weight: 500;
  font-size: 16px;
  color: #38435a;
}
.filter-box-title {
  padding: 10px 0;
  color: #38435a;
}
.fixed-warp {
  position: fixed;
  top: 0;
  bottom: 0;
}

.commonInput {
  flex: 1;
}

.pkg-name {
  color: #1a80f2;
}
.version-box {
  p {
    display: block;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.pkg-version {
  font-size: 12px;
  color: #51cb74;
}
.danger-box {
  display: flex;
  > div {
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 24px;
    display: flex;
  }
  .height {
    background: rgba(229, 99, 99, 0.1);
    border-radius: 2px 0px 0px 2px;
    color: #e56363;
  }
  .middle {
    color: #f49e0b;
    background: rgba(244, 158, 11, 0.1);
  }
  .low {
    color: #2f90ea;
    background: rgba(47, 144, 234, 0.1);
  }
  .info {
    color: #abb2c0;
    background: rgba(172, 180, 196, 0.1);
    border-radius: 0px 2px 2px 0px;
  }
}

.sort-box {
  display: inline-flex;
  align-items: center;
}
.sort-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  color: #606266;
  display: inline-block;
  background: #fff;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  cursor: pointer;
}

.vulnSelect {
  width: 134px;
  margin-left: 8px;
  ::v-deep.el-input__inner {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.sort-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.selectInput {
  display: flex;
}

.btn {
  width: 72px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  color: #fff;
}

.slider-warp {
  width: 234px;
  margin-top: 78px;
  background: #fff;
  overflow: auto;
  padding: 0 12px 20px 12px;
  height: calc(100vh - 92px);

  .title {
    padding: 10px 0;
    border-bottom: 1px solid #e6e9ec;
    font-size: 18px;
    font-weight: normal;
    color: #38435a;
  }

  .module-title {
    font-size: 16px;
    font-weight: 500;
    color: #38435a;
  }

  .reset-btn {
    color: #4a72ae;
    cursor: pointer;
  }

  .module-line {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    margin-right: 0;
    ::v-deep.el-checkbox__label {
      flex: 1;
      .check-label {
        display: flex;
        justify-content: space-between;
      }
    }

    .selectOption {
      display: inline-block;
      max-width: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #38435a;
      font-size: 14px;
      font-weight: 400;
    }

    .num {
      color: #38435a;
      font-size: 14px;
      font-weight: 400;
    }
    &.is-checked {
      .selectOption {
        color: #1a80f2;
      }

      .num {
        color: #1a80f2;
      }
    }
  }
}
.main-warp {
  padding-top: 14px;
  margin-left: 248px;

  .selectForm {
    width: 100%;
  }
}

.sca-list {
  background: #fff;
  margin-bottom: 24px;
  padding: 16px;
  .pagination {
    padding: 8px 0;
    display: flex;
    justify-content: flex-end;
  }
}
.sca-list-table {
  margin-top: 16px;
  &.el-table {
    ::v-deepth {
      line-height: 0;
      color: #38435a;
      background: #f2f3f5;
    }
  }
}

.sca-dialog-title-box {
  .top {
    color: #38435a;
  }
  .bottom {
    display: flex;
    margin-top: 16px;
    justify-content: space-between;
    .bottom-item {
      display: flex;
      flex: 1;
      .label {
        color: #acb4c4;
      }
      .info {
        margin-left: 8px;
        color: #38435a;
      }
    }
  }
}
::v-deep.btn-quicknext {
  & + .number {
    display: none;
  }
}
</style>

<style lang="scss">
.sca-dialog {
  .el-dialog__header {
    background: #fafafa;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 0px 24px 16px 24px;
  }
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    &:hover {
      color: #1a80f2;
    }
  }
}

.tag {
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;
}
</style>
