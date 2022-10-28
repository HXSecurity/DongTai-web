<template>
  <main class="sca-dialog">
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">风险分析</div>
      <div class="sca-dialog-pic-box">
        <div class="sca-dialog-pic" style="margin-right: 8px">
          <div class="pic-title">漏洞分布</div>
          <div class="pic-info">
            <Distribution :data="level_data" :height="188"></Distribution>
          </div>
        </div>
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">关联项目</div>
      <div class="sca-dialog-info">
        <el-row :gutter="8">
          <el-col
            v-for="project in projects"
            :key="project.id"
            :span="8"
            style="margin-top: 8px"
          >
            <div class="project-box" @click="toProject(project.project_id)">
              <span class="project-name">
                {{ project.project_name }}
              </span>
            </div>
          </el-col>
        </el-row>
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
                {{ row.vul_title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="漏洞来源组件" width="150">
            <template slot-scope="{ row }">
              {{ row.origin_package }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="漏洞类型" width="150">
            <template slot-scope="{ row }">
              {{ row.vul_type }}
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
                  color: levelColor(row.level).color,
                  background: levelColor(row.level).bg,
                }"
              >
                {{ row.level }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="编号">
            <template slot-scope="{ row }">
              {{ row.cve_id }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import Distribution from '@/views/project/components/distribution.vue'
@Component({ name: 'ScaDialog', components: { Distribution } })
export default class ScaDialog extends VueBase {
  @Prop() dialogInfo: any
  private tableLoading = false
  private tableData: any = []
  async getAssetVuls() {
    this.tableLoading = true
    const res = await this.services.sca.assetVuls(this.dialogInfo.id)
    this.tableLoading = false
    this.tableData.push(...res.data)
  }

  private projects: any = []

  async getProjects() {
    const res = await this.services.sca.assetProjects(this.dialogInfo.id)
    this.projects.push(...res.data)
  }

  private toVulnD(item: any) {
    this.$router.push(
      `/vuln/scaDetail/${item.asset_vul_id}/1?status=1&id=${item.asset_vul_id}`
    )
  }

  toProject(id: any) {
    this.$router.push('/project/projectDetail/' + id)
  }

  created() {
    this.getAssetVuls()
    this.getProjects()
  }

  private levelColor(level: any) {
    switch (level) {
      case '高危':
        return { label: '高', color: '#E56363', bg: 'rgba(229, 99, 99, 0.1)' }
      case '中危':
        return { label: '中', color: '#F49E0B', bg: 'rgba(244, 158, 11, 0.1)' }
      case '低危':
        return { label: '低', color: '#2F90EA', bg: 'rgba(47, 144, 234, 0.1)' }
      case '无风险':
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
          label: '无风险',
          color: '#ABB2C0',
          bg: 'rgba(172, 180, 196, 0.1)',
        }
    }
  }

  private level_data: any = [
    {
      level_id: 1,
      level_name: '高危',
      num: this.dialogInfo.vul_high_count,
    },
    { level_id: 2, level_name: '中危', num: this.dialogInfo.vul_medium_count },
    { level_id: 3, level_name: '低危', num: this.dialogInfo.vul_low_count },
    {
      level_id: 4,
      level_name: '无风险',
      num: this.dialogInfo.vul_info_count,
    },
  ]
}
</script>

<style scoped lang="scss">
.sca-dialog {
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
  .project-box {
    padding: 8px 5px;
    background: #fafafa;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    .project-name {
      display: inline-block;
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
