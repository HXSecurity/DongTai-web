<template>
  <main class="sca-dialog container">
    <div class="go-back-title">
      <span @click="goBack">
        <i class="el-icon-arrow-left"></i> 返回组件列表
      </span>
    </div>
    <div class="vuln-title flex-row-space-between">
      <div
        style="
          flex: 1;
          max-width: 800px;
          word-break: break-all;
          line-height: 24px;
          font-size: 16px;
          font-weight: 500;
        "
      >
        {{ detailInfo.aql || '-' }}
        <el-tag
          v-for="item in [detailInfo.language]"
          :key="item"
          size="small"
          :type="getTagColoe(item)"
          style="margin-left: 12px"
          >{{ item }}</el-tag
        >
      </div>
      <div class="btnWarp">
        当前版本:
        <span class="banben">{{ detailInfo.version || '-' }}</span>
      </div>
    </div>
    <!-- <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">安全版本</div>
      <div class="sca-dialog-info">
        <span
          v-for="(version, index) in detailInfo.unaffected_versions"
          :key="version"
          class="verson_item"
        >
          {{ version }}
          <span
            v-show="index !== detailInfo.unaffected_versions.length - 1"
            class="verson_split"
          ></span>
        </span>
      </div>
    </div> -->
    <!-- <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">修复建议</div>
      <div class="sca-dialog-info">
        <template v-if="detailInfo.latest_safe_version">
          升级{{ detailInfo.package_name }}@{{ detailInfo.version }}版本至{{
            detailInfo.latest_safe_version
          }}及以上版本。
        </template>
        <template v-else>暂无</template>
      </div>
    </div> -->
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">风险分析</div>
      <div class="sca-dialog-pic-box">
        <div class="sca-dialog-pic" style="margin-right: 8px">
          <div class="pic-title">漏洞分布</div>
          <div class="pic-info">
            <Distribution
              v-if="level_data.length > 0"
              :data="level_data"
              :height="188"
            ></Distribution>
          </div>
        </div>
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">关联项目</div>
      <div class="sca-dialog-info">
        <el-collapse
          v-for="(project, index) in projects"
          :key="project.id"
          v-model="project.activeId"
          accordion
          @change="handleChange"
        >
          <el-collapse-item :name="project.project_id" style="margin-top: 8px">
            <template slot="title">
              <!-- @click="toProject(project.project_id)" -->
              <div class="project-box">
                <span
                  class="project-name"
                  :style="
                    index === 0 && $route.query.projectId && 'color:#38435A'
                  "
                  @click="toProject(project.project_id, index)"
                >
                  {{ project.project_name }}
                </span>
              </div>
            </template>
            <div class="scainfoDetail">
              <div
                v-for="(item, index) in project.content"
                :key="index"
                class="project_content"
              >
                <span class="version_name"
                  >项目版本号：
                  <span>{{ item.project_version_name }}</span>
                </span>
                <span class="package_path"
                  >路径：
                  <span>{{ item.package_path }}</span>
                </span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="pagination">
          <el-pagination
            :page-sizes="[10, 20, 40, 50]"
            :page-size="projects_pageSize"
            :total="projects_total"
            :current-page="projects_page"
            layout=" prev, pager, next, sizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">漏洞信息</div>
      <div class="sca-dialog-info">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          class="sca-dialog-table"
        >
          <el-table-column prop="name" label="漏洞名称" width="380">
            <template slot-scope="{ row }">
              <span class="table-sca-name" @click="toVulnD(row)">
                {{ row.vul_name }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" label="漏洞来源组件" width="150">
            <template slot-scope="{ row }">
              {{ row.origin_package }}
            </template>
          </el-table-column> -->
          <el-table-column prop="type" label="漏洞类型" width="150">
            <template slot-scope="{ row }">
              <!-- <span v-for="(item, index) in row.vul_type" :key="index">{{
                item
              }}</span> -->
              <span v-for="type in row.vul_type" :key="type">{{ type }} </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="漏洞等级"
            align="center"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <span
                class="level-type"
                :style="{
                  color: levelColor(row.level_name).color,
                  background: levelColor(row.level_name).bg,
                }"
              >
                {{ row.level_name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="编号">
            <template slot-scope="{ row }">
              <span
                v-for="(i, key) in Object.values(row.vul_codes)"
                :key="'cve' + key"
              >
                <span v-if="i" class="jump">{{ i[0] }} </span>
                <span
                  v-show="key != Object.values(row.vul_codes).length - 1"
                  style="
                    display: inline-block;
                    width: 0px;
                    height: 10px;
                    border-left: 1px solid #b6bbc5;
                    margin: 0 10px;
                  "
                >
                </span>
              </span>
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
            @size-change="tableSizeChange"
            @current-change="tableCurrentChange"
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
      width="1080px"
    >
      <template slot="title">
        <div class="sca-dialog-title-box">
          <div class="top">{{ dialogInfo.vul_name }}</div>
          <span
            class="el-icon-close close-btn"
            @click="dialogFlag = false"
          ></span>
        </div>
      </template>
      <ScaDetail
        v-if="dialogFlag"
        :language="detailInfo.language"
        :dialog-info="dialogInfo"
      ></ScaDetail>
      <!-- <ScaDialog v-if="dialogFlag" :dialog-info="dialogInfo"></ScaDialog> -->
    </el-dialog>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import Distribution from '@/views/project/components/distribution.vue'
import ScaDetail from '@/views/sca/ScaDetail_tab.vue'

@Component({ name: 'ScaDialog', components: { Distribution, ScaDetail } })
export default class ScaDialog extends VueBase {
  private dialogInfo: any = {}
  private detailInfo: any = {}
  private tableLoading = false
  private tableData: any = []
  private activeName: any = []
  private dialogFlag = false

  async getAssetVuls() {
    this.tableLoading = true
    const res = await this.services.sca.assetVuls({
      package_name: this.$route.query.package_name,
      package_version: this.$route.query.package_version,
      language_id: this.$route.query.language_id,
      page: this.page,
      page_size: this.pageSize,
    })
    this.tableLoading = false
    this.tableData = res.data
    this.total = res.page.alltotal
  }

  private projects: any = []
  private projects_total = 0
  private projects_pageSize = 10
  private projects_page = 1
  private total = 0
  private pageSize = 10
  private page = 1

  async getProjects() {
    let params: any = {
      package_name: this.$route.query.package_name,
      package_version: this.$route.query.package_version,
      language_id: this.$route.query.language_id,
      page: this.projects_page,
      page_size: this.projects_pageSize,
    }
    if (this.$route.query.projectId) {
      params.project_id = this.$route.query.projectId
    }
    const res = await this.services.sca.assetProjects(params)
    this.projects = res.data
    this.projects_total = res.page.alltotal
  }
  tableSizeChange(val: number) {
    this.pageSize = val
    this.getAssetVuls()
  }
  tableCurrentChange(val: number) {
    this.page = val
    this.getAssetVuls()
  }
  handleSizeChange(val: number) {
    this.projects_pageSize = val
    this.getProjects()
  }
  handleCurrentChange(val: number) {
    this.projects_page = val
    this.getProjects()
  }
  async handleChange(val: any) {
    if (val) {
      console.log('val', val)
      const res = await this.services.sca.assetProjectId({
        package_name: this.$route.query.package_name,
        package_version: this.$route.query.package_version,
        language_id: this.$route.query.language_id,
        project_id: val,
      })
      this.projects = this.projects.map((item: any) => {
        if (item.project_id === val) {
          this.$set(item, 'content', res.data)
        }
        return item
      })
    }
  }
  private toVulnD(item: any) {
    this.dialogFlag = true
    this.dialogInfo = item
    // this.$router.push(
    //   `/vuln/scaDetail/${item.asset_vul_id}/1?status=1&id=${item.asset_vul_id}`
    // )
  }

  toProject(id: any, index: any) {
    if (index === 0 && this.$route.query.projectId) {
      return
    }
    this.$router.push('/project/projectDetail/' + id)
  }
  goBack = () => {
    this.$router.go(-1)
  }

  created() {
    this.getDetail()
    this.getAssetVuls()
    this.getProjects()
  }
  private level_data: any = []
  async getDetail() {
    const res = await this.services.sca.getScaDetail({
      package_name: this.$route.query.package_name,
      package_version: this.$route.query.package_version,
      language_id: this.$route.query.language_id,
    })
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.detailInfo = res.data
    this.level_data = res.data.vul_count_groupby_level.map(
      (item: any, index: any) => {
        return {
          level_id: index + 1,
          level_name: item.label,
          num: item.count || 0,
        }
      }
    )
  }
  private getTagColoe(language: string) {
    switch (language) {
      case 'Java':
        return 'danger'
      case 'PYTHON':
        return ''
      default:
        return ''
    }
  }
  private levelObj = {
    1: '高危',
    2: '中危',
    3: '低危',
    4: '提示',
  }
  private levelColor(level: any) {
    switch (level) {
      case '严重':
        return { label: '高', color: '#E56363', bg: 'rgba(229, 99, 99, 0.1)' }
      case '高危':
        return { label: '中', color: '#F49E0B', bg: 'rgba(244, 158, 11, 0.1)' }
      case '中危':
        return { label: '低', color: '#2F90EA', bg: 'rgba(47, 144, 234, 0.1)' }
      case '低危':
        return { label: '无', color: '#ABB2C0', bg: 'rgba(172, 180, 196, 0.1)' }
      default:
        return { label: '无', color: '#ABB2C0', bg: 'rgba(172, 180, 196, 0.1)' }
    }
  }

  private switchLevel(level: any) {
    switch (level) {
      case 1:
        return { label: '高', color: '#E56363', bg: 'rgba(229, 99, 99, 0.1)' }
      case 2:
        return { label: '中', color: '#F49E0B', bg: 'rgba(244, 158, 11, 0.1)' }
      case 3:
        return { label: '低', color: '#2F90EA', bg: 'rgba(47, 144, 234, 0.1)' }
      case 0:
        return {
          label: '提示',
          color: '#ABB2C0',
          bg: 'rgba(172, 180, 196, 0.1)',
        }
      default:
        return {
          label: '提示',
          color: '#ABB2C0',
          bg: 'rgba(172, 180, 196, 0.1)',
        }
    }
  }
}
</script>

<style scoped lang="scss">
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
.sca-dialog {
  margin-top: 14px;
  min-height: calc(100vh - 104px);
  margin-bottom: 26px;
  background: #fff;
  padding: 0 14px 41px 14px;
  .go-back-title {
    padding-top: 16px;
    color: #0085ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
  }
  .vuln-title {
    padding-top: 24px;
    padding-bottom: 10px;
    font-size: 16px;
    color: #38435a;
    // font-weight: 600;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
    align-items: center;
    .btnWarp {
      margin-left: 20px;
      display: flex;
      align-items: center;
      font-family: 'PingFang SC';
      font-style: normal;
      color: #959fb4;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      .banben {
        color: #38435a;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 8px;
      }
    }
  }
  .sca-dialog-desc-box {
    padding: 16px 0;
    .sca-dialog-title {
      color: #38435a;
      font-size: 16px;
      margin-bottom: 16px;
      font-weight: 500;
    }
    .sca-dialog-info {
      color: #38435a;
      line-height: 22px;
      .pagination {
        padding: 8px 0;
        display: flex;
        justify-content: flex-end;
      }
      .verson_item {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-right: 8px;
        .verson_split {
          display: inline-block;
          width: 0px;
          height: 10px;
          border-left: 1px solid #b6bbc5;
        }
      }
      ::v-deep .el-row {
        display: flex;
        flex-wrap: wrap;
        .el-card {
          min-width: 100%;
          height: 100%;
        }
      }
    }

    background: #ffffff;
    /* divide */
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
  }
  .sca-dialog-pic-box {
    display: flex;
    .sca-dialog-pic {
      flex: 1;
      .pic-title {
        font-weight: 500;
        font-size: 14px;
        color: #38435a;
        margin-bottom: 8px;
      }
      .pic-info-box {
        height: 188px;
        overflow: auto;
      }
      .pic-info {
        height: 188px;
        background: #fafafa;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .pic-info-item {
          display: flex;
          .label {
            width: 80px;
            color: #acb4c4;
            font-size: 14px;
            font-weight: 500;
          }
          .info {
            flex: 1;
            color: #38435a;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
    }
  }
  ::v-deep.el-collapse-item__content {
    padding-bottom: 0px;
  }
  ::v-deep.el-collapse {
    border-top: 0px solid #ebeef5;
  }
  .scainfoDetail {
    background: #fafafa;
    padding: 16px;

    // border-bottom: 1px solid #e6e9ec;
    .project_content {
      display: flex;
      align-items: center;
      gap: 20px;
      .version_name {
        width: 16%;
      }
      .package_path {
        flex: 1;
      }
    }
  }
  .project-box {
    padding: 8px 5px;
    // background: #fafafa;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 100%;
    .project-name {
      display: inline-block;
      min-width: 180px;
      max-width: 100%;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      color: #1a80f2;
    }
    .project-link {
      color: #959fb4;
    }
  }
  .sca-dialog-table {
    &.el-table {
      ::v-deepth {
        line-height: 0;
        color: #38435a;
        background: #f2f3f5;
      }
    }
    .table-sca-name {
      color: #1a80f2;
      cursor: pointer;
    }
    .level-type {
      width: 40px;
      height: 24px;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      &.height {
        background: rgba(229, 99, 99, 0.1);
        border-radius: 2px;
        color: #e56363;
      }
      &.middle {
        background: rgba(244, 158, 11, 0.1);
        border-radius: 2px;
        color: #f49e0b;
      }
      &.low {
        background: rgba(47, 144, 234, 0.1);
        border-radius: 2px;
        color: #2f90ea;
      }
      &.info {
        background: rgba(172, 180, 196, 0.1);
        border-radius: 2px;
        color: #abb2c0;
      }
    }
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
