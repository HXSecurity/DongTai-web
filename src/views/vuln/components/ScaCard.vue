<template>
  <div class="card">
    <div
      class="card-title flex-row-space-between"
      style="height: 33px; min-height: 32px"
    >
      <span
        class="title"
        style="font-size: 14px; font-weight: bold; height: 32px"
        ><el-checkbox
          v-model="item.checked"
          style="margin-right: 12px; margin-top: 2px"
        ></el-checkbox>
        <span class="vul-name" :title="item.vul_name" @click="goDetail(item)">
          {{ item.vul_name }}
        </span>
      </span>
      <span
        class="time flex-column-center"
        style="font-size: 12px; height: 32px"
      >
        {{ fmtTime(item.create_time) }}
      </span>
    </div>
    <div class="card-content">
      <div class="card-content-item-box">
        <div style="position: absolute; top: 20px; right: 0">
          <Sync
            :item="item"
            :setting-inte="settingInte"
            :get-table-data="getTableData"
            :source_type="2"
          ></Sync>
        </div>

        <div class="card-content-item">
          <div class="label">编号：</div>
          <div class="value">
            <span v-for="(i, key) in CVENUMBERS" :key="'cve' + key">
              <span v-if="i.label" class="jump" @click="openWindow(i.link)"
                >{{ i.label }} </span
              >{{ key != CVENUMBERS.length - 1 && i.label ? '|' : '' }}
            </span>
          </div>
        </div>
      </div>
      <!-- <div class="card-content-item-box">
        <div class="card-content-item">
          <div class="label">开源许可证：</div>
          <div class="value">
            {{ item.license }}
            <span class="tag" :class="switchLevelClass(item.license_level)">
              {{ switchLevelTag(item.license_level) }}
            </span>
          </div>
        </div>
        <div class="card-content-item">
          <div class="label">修复版本：</div>
          <div class="value">{{ item.package_safe_version }}</div>
        </div>
        <div class="card-content-item">
          <div class="label">可利用性：</div>
          <div class="value">
            {{ item.availability_str }}
          </div>
        </div>
      </div> -->
      <div class="infoLine flex-row-space-between">
        <div class="flex-row-space-between" style="width: 60%">
          <span class="info">
            <i class="iconfont iconyingyong" style="color: #a3b0e2"></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.pro_info[0].asset__project_name"
              placement="top-start"
              :disabled="item.pro_info[0].asset__project_name.length <= 11"
            >
              <span
                class="dot"
                style="cursor: pointer"
                @click="
                  $router.push(
                    '/project/projectDetail/' +
                      item.pro_info[0].asset__project_id
                  )
                "
              >
                {{ item.pro_info[0].asset__project_name }}</span
              >
            </el-tooltip>
          </span>
          <span
            v-if="item.pro_info && item.pro_info.length > 1"
            class="info"
            style="color: #1a80f2; cursor: pointer"
            @click="open = !open"
            >(更多 {{ item.pro_info.length }} 个)
            <i
              style="vertical-align: middle"
              :class="open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i
          ></span>
          <span class="info" style="flex: 1.5">
            <i class="iconfont" :class="switchServerType(item.server_type)"></i>
            {{ item.pro_info[0].asset__agent__server__container }}
          </span>

          <span
            class="info"
            :style="
              item.level_id === 1
                ? { color: '#EA7171' }
                : item.level_id === 2
                ? { color: '#F39D0A' }
                : item.level_id === 3
                ? { color: '#2E8FE9' }
                : item.level_id === 4
                ? { color: '#7BC1AB' }
                : ''
            "
          >
            <i class="iconfont iconweixian"></i>
            {{ switchLevel(item.level_id) }}
          </span>
          <!-- <span class="info" style="flex: 1.2; line-height: 28px">
            <i
              class="iconfont iconshijian-2"
              style="color: #a2a5ab; font-size: 14px"
            ></i>
            {{ item.latest_time }}
          </span> -->
        </div>
        <div>
          <!-- <div class="tag">
                  {{ item.language }}
                </div>
                <div class="tag2" style="margin-left: 20px">
                  {{ item.type }}
                </div> -->
          <div class="tageIcon" style="margin-left: 20px">
            <i
              class="iconfont iconicon_yingyong_table"
              style="color: #e7f5e4"
            ></i>
            <span style="background: #e7f5e4; color: #63974e">
              {{ item.package_language }}
            </span>
          </div>
          <!-- 
          <div class="tageIcon" style="margin-left: 20px">
            <i
              class="iconfont iconicon_yingyong_table"
              style="color: #fce9de"
            ></i>
            <span
              style="background: #fce9de; color: #e07d43"
              :title="item.package_name"
              class="showDot"
            >
              {{ item.package_name }}
            </span>
          </div> -->
        </div>
      </div>
    </div>
    <div v-if="open" class="project-card">
      <div
        v-for="pro_info in item.pro_info"
        :key="pro_info.asset__project_id"
        class="project-card-item"
      >
        <i class="iconfont iconyingyong" style="color: #a3b0e2"></i>
        <el-tooltip
          effect="dark"
          :content="pro_info.asset__project_name"
          placement="top-start"
          :disabled="pro_info.asset__project_name.length <= 24"
        >
          <span
            class="asset_project_name"
            @click="
              $router.push(
                '/project/projectDetail/' + pro_info.asset__project_id
              )
            "
          >
            {{ pro_info.asset__project_name }}</span
          >
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
import Sync from './sync.vue'
@Component({ name: 'ScaCard', components: { Sync } })
export default class ScaCard extends VueBase {
  @Prop() item: any
  @Prop() searchObj: any
  @Prop() settingInte: any
  @Prop() getTableData: any

  private open = false

  fmtTime(str: any) {
    return formatTimestamp(str)
  }

  get CVENUMBERS() {
    const res = []
    for (let key in this.item.vul_cve_nums) {
      switch (key) {
        case 'cnnvd':
          res.push({
            label: this.item.vul_cve_nums[key],
            link: `http://www.cnnvd.org.cn/web/xxk/ldxqById.tag?CNNVD=${this.item.vul_cve_nums[key]}`,
          })
          break
        case 'cnvd':
          res.push({
            label: this.item.vul_cve_nums[key],
            link: `https://www.cnvd.org.cn/flaw/show/${this.item.vul_cve_nums[key]}`,
          })
          break
        case 'cve':
          res.push({
            label: this.item.vul_cve_nums[key],
            link: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${this.item.vul_cve_nums[key]}`,
          })
          break
        case 'cwe':
          res.push({
            label: this.item.vul_cve_nums[key],
            link: `https://cwe.mitre.org/data/definitions/${this.item.vul_cve_nums['cwe_num']}.html`,
          })
          break
      }
    }
    return res
  }

  openWindow(url: string) {
    window.open(url)
  }

  switchAva(availability: any) {
    switch (availability) {
      case 1:
        return '存在利用代码'
      case 2:
        return '存在分析文章'
      case 3:
        return '无利用信息'
    }
  }

  switchLanguage(language: number) {
    switch (language) {
      case 1:
        return 'JAVA'
      case 2:
        return 'PYTHON'
      case 3:
        return 'PHP'
      case 4:
        return 'G0'
    }
  }
  switchLevel(level: number) {
    switch (level) {
      case 1:
        return '高危'
      case 2:
        return '中危'
      case 3:
        return '低危'
      case 4:
        return '无风险'
    }
  }

  switchLevelTag(level: number) {
    switch (level) {
      case 1:
        return '高'
      case 2:
        return '中'
      case 3:
        return '低'
      case 0:
        return '无'
    }
  }

  switchLevelClass(level: number) {
    switch (level) {
      case 1:
        return 'high'
      case 2:
        return 'middle'
      case 3:
        return 'low'
      case 0:
        return 'none'
    }
  }

  switchServerType(serverType: string) {
    switch (serverType) {
      case 'tomcat':
        return 'icontomcat'
      case 'jetty':
        return 'iconJetty'
      case 'resin':
        return 'iconresin'
      case 'weblogic':
        return 'iconwebLogic'
      case 'websphere':
        return 'iconwebSphere'
      case 'jboss':
        return 'iconJBoss'

      default:
        return 'iconyingyong'
    }
  }
  private goDetail(item: any) {
    this.$router.push(
      `/vuln/scaDetail/${item.id}/1?status=` +
        this.searchObj.status +
        '&id=' +
        item.id
    )
  }
}
</script>

<style scoped lang="scss">
.card {
  .tageIcon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 20px;
    }
    span {
      margin-left: -3px;
      display: inline-block;
      line-height: 150%;
      height: 20px;
      font-size: 14px;
      padding-right: 6px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      font-weight: 500;
    }
  }

  margin-top: 14px;
  width: 100%;
  padding-bottom: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee4ea;

  .card-title {
    width: 100%;
    min-height: 48px;
    background: #f1f8ff;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #c8e0ff;
    padding: 0 12px;
    span {
      cursor: pointer;
    }

    .title {
      color: #38435a;
      font-size: 16px;
      max-width: 580px;
      display: flex;
      align-items: center;
    }

    .time {
      font-size: 14px;
      color: #586069;
    }
  }

  .card-content {
    padding: 0 12px;
    position: relative;
    .card-content-item-box {
      display: flex;
      justify-content: space-between;
    }
    .card-content-item {
      margin-top: 18px;
      display: flex;
      flex: 1;
      .label {
        color: #959fb4;
      }
      .value {
        color: #38435a;
        .tag {
          color: #e56363;
          background: rgba(229, 99, 99, 0.1);
          border-radius: 2px;
          font-size: 12px;
          padding: 2px;
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
          &.none {
            background: rgba(172, 180, 196, 0.1);
            border-radius: 2px;
            color: #abb2c0;
          }
        }
      }
    }

    .infoLine {
      margin-top: 18px;

      .info {
        flex: 1;
        line-height: 28px;
      }

      .tag {
        display: inline-block;
        color: #fff;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        background: #5495f3;
        padding-right: 10px;
        padding-left: 4px;
        position: relative;

        &:before {
          position: absolute;
          left: -17px;
          content: '';
          height: 20px;
          width: 18px;
          background-image: url('../../../assets/img/tag.png');
        }
      }

      .tag2 {
        display: inline-block;
        color: #fff;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        background: #e2ce94;
        padding-right: 10px;
        padding-left: 4px;
        position: relative;

        &:before {
          position: absolute;
          left: -17px;
          content: '';
          height: 20px;
          width: 18px;
          background-image: url('../../../assets/img/tag2.png');
        }
      }
    }
  }

  .icontomcat {
    color: #e6d088;
  }

  .iconJetty {
    color: #5cb896;
  }

  .iconresin {
    color: #86a0d5;
  }

  .iconwebLogic {
    color: #a4cbb9;
  }

  .iconwebSphere {
    color: #888dd1;
  }

  .iconJBoss {
    color: #41bad5;
  }

  .iconyingyong {
    color: #ddcc9e;
  }
}
.dot {
  display: inline-block;
  width: 90px;
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
.showDot {
  display: inline-block;
  max-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.update {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  margin-right: 12px;
  align-items: center;
  .update-box {
    height: 12px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    padding-left: 8px;
    img {
      margin-right: 4px;
      width: 14px;
    }
    color: #38435a;
    &:hover {
      color: #1a80f2;
    }
  }
  .update-box + .update-box {
    border-left: 1px solid #959fb4;
  }
}
.jump {
  cursor: pointer;
}

.project-card {
  margin: 8px 16px 0px 16px;
  background: rgba(242, 243, 245, 0.4);
  border-radius: 4px;
  color: #1a80f2;
  display: flex;
  flex-wrap: wrap;
  padding: 8px 0px;
  &-item {
    padding: 8px 16px;
    width: 25%;
  }
}
.project-card-item {
  display: flex;
  align-items: center;
}
.asset_project_name {
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 20px);
  cursor: pointer;
}

.vul-name {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
</style>
