<template>
  <main class="sca-dialog">
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">修复建议</div>
      <div class="sca-dialog-info">
        升级fastjson@1.2.4版本至1.3.5及以上版本，升级fastjson@1.2.4版本至1.3.5及以上版本，升级4版本至1.3.5及以上版本
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">风险分析</div>
      <div class="sca-dialog-pic-box">
        <div class="sca-dialog-pic" style="margin-right: 8px">
          <div class="pic-title">漏洞分布</div>
          <div class="pic-info">
            <Distribution :data="level_data" :height="188"></Distribution>
          </div>
        </div>

        <div class="sca-dialog-pic" style="margin-left: 8px">
          <div class="pic-title">开源许可证</div>
          <div class="pic-info" style="padding: 16px">
            <div class="pic-info-item">
              <div class="label">许可证名称</div>
              <div class="info">Apache 2.0</div>
            </div>
            <div class="pic-info-item">
              <div class="label">风险</div>
              <div class="info">高</div>
            </div>
            <div class="pic-info-item">
              <div class="label">许可证说明</div>
              <div class="info">
                允许商业集成,允许商业集成,允许商业集成,允许商业集成允许商业集成
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">关联项目</div>
      <div class="sca-dialog-info">
        <el-row :gutter="8">
          <el-col :span="8">
            <div class="project-box">
              <span class="project-name">commons-fi...</span>
              <span class="project-link">（3层直接引用）</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="project-box">
              <span class="project-name">commons-fi...</span>
              <span class="project-link">（3层直接引用）</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="project-box">
              <span class="project-name">commons-fi...</span>
              <span class="project-link">（3层直接引用）</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="project-box">
              <span class="project-name">commons-fi...</span>
              <span class="project-link">（3层直接引用）</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="sca-dialog-desc-box">
      <div class="sca-dialog-title">漏洞信息</div>
      <div class="sca-dialog-info">
        <el-table
          :data="tableData"
          style="width: 100%"
          class="sca-dialog-table"
        >
          <el-table-column
            prop="name"
            label="漏洞名称"
            width="280"
            show-overflow-tooltip=""
          >
            <template slot-scope="{ row }">
              <span class="table-sca-name">
                {{ row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="漏洞类型"
            width="120"
            show-overflow-tooltip=""
          >
            <template slot-scope="{ row }">
              {{ row.type }}
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="漏洞等级"
            align="center"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <span :class="row.level_type" class="level-type">
                {{ row.level }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="编号">
            <template slot-scope="{ row }">
              {{ row.num }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import Distribution from '@/views/project/components/distribution.vue'
@Component({ name: 'ScaDialog', components: { Distribution } })
export default class ScaDialog extends VueBase {
  private level_data = [
    { level_id: 1, level_name: '高危', num: 11 },
    { level_id: 2, level_name: '中危', num: 1 },
    { level_id: 3, level_name: '低危', num: 0 },
    { level_id: 4, level_name: '无风险', num: 0 },
    { level_id: 5, level_name: '提示', num: 0 },
  ]
  private tableData = [
    {
      name: 'fastjson@1.2.3反序列化漏洞',
      type: '反序列化漏洞',
      level: '高危',
      level_type: 'height',
      num: 'CVE-2022-12341',
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
            font-weight: 500;
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
    .project-name {
      color: #1a80f2;
    }
    .project-link {
      color: #959fb4;
    }
  }
  .sca-dialog-table {
    &.el-table {
      /deep/th {
        line-height: 0;
        color: #38435a;
        background: #f2f3f5;
      }
    }
    .table-sca-name {
      color: #1a80f2;
    }
    .level-type {
      width: 40px;
      height: 24px;
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
