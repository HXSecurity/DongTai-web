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
        <span v-if="$i18n.locale === 'zh_cn'" @click="goDetail(item.id)">
          {{
            `${item.uri}${$t('views.vulnList.is')}${item.http_method}${$t(
              'views.vulnList.reqHas'
            )}${item.type}${$t('views.vulnList.vule')}${
              item.taint_position
                ? `，${$t('views.vulnList.position')}：${item.taint_position}`
                : ''
            }`
          }}
        </span>
        <span v-if="$i18n.locale === 'en'" @click="goDetail(item.id)">
          {{ `${item.type} on \"${item.uri}\" with ${item.http_method}` }}
          {{ item.taint_position ? `, Positon:${item.taint_position}` : '' }}
        </span>
      </span>
      <span
        class="time flex-column-center"
        style="font-size: 12px; height: 32px"
      >
        {{ item.first_time }}
      </span>
    </div>
    <div class="card-content">
      <div class="top-stack">
        <i class="iconfont iconyuandianzhong"></i>
        <span>
          {{ item.top_stack }}
        </span>
      </div>
      <div class="bottom-stack">
        <i class="iconfont iconyuandianzhong"></i>
        <span>
          {{ item.bottom_stack }}
        </span>
      </div>
      <div class="infoLine flex-row-space-between">
        <div class="flex-row-space-between" style="width: 60%">
          <span class="info">
            <i class="iconfont iconyingyong" style="color: #a3b0e2"></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.project_name"
              placement="top-start"
              :disabled="item.project_name.length <= 11"
            >
              <span
                class="dot"
                style="cursor: pointer"
                @click="
                  $router.push('/project/projectDetail/' + item.project_id)
                "
              >
                {{ item.project_name }}</span
              >
            </el-tooltip>
          </span>
          <span class="info" style="flex: 1.5">
            <i class="iconfont" :class="switchServerType(item.server_type)"></i>
            {{ item.server_name }}
          </span>

          <span
            class="info"
            :style="
              item.level_type === 1
                ? { color: '#EA7171' }
                : item.level_type === 2
                ? { color: '#F39D0A' }
                : item.level_type === 3
                ? { color: '#2E8FE9' }
                : item.level_type === 4
                ? { color: '#7BC1AB' }
                : ''
            "
          >
            <i class="iconfont iconweixian"></i>
            {{ item.level }}
          </span>
          <span class="info" style="flex: 1.2">
            <i
              class="iconfont iconshijian-2"
              style="color: #a2a5ab; font-size: 14px"
            ></i>
            {{ item.latest_time }}
          </span>
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
              {{ item.language }}
            </span>
          </div>

          <div class="tageIcon" style="margin-left: 20px">
            <i
              class="iconfont iconicon_yingyong_table"
              style="color: #fce9de"
            ></i>
            <span
              style="background: #fce9de; color: #e07d43"
              :title="item.type"
              class="showDot"
            >
              {{ item.type }}
            </span>
          </div>

          <div class="tageIcon" style="margin-left: 20px">
            <i
              class="iconfont iconicon_yingyong_table"
              style="color: #e5f3f3"
            ></i>
            <span style="background: #e5f3f3; color: #3c9aa2">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { formatTimestamp, getPassedTime } from '@/utils/utils'
import VueBase from '@/VueBase'
@Component({ name: 'VulnList' })
export default class VulnList extends VueBase {
  @Prop() item: any
  @Prop() searchObj: any

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
  private goDetail(id: number) {
    this.$router.push(
      `/vuln/vulnDetail/1/${id}?status=` + this.searchObj.status
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
      max-width: 780px;
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

    .top-stack {
      margin-top: 14px;
      position: relative;
      color: #9199a2;
      &:before {
        content: '';
        width: 1px;
        height: 30px;
        background: #dee4ea;
        position: absolute;
        left: 5px;
        top: 14px;
      }

      i {
        color: #5491ef;
        font-size: 12px;
        vertical-align: top;
        margin-right: 5px;
      }

      span {
        width: calc(100% - 18px);
        word-break: break-all;
        display: inline-block;
        vertical-align: top;
      }
    }

    .bottom-stack {
      margin-top: 24px;
      color: #9199a2;
      i {
        color: #6ec79f;
        font-size: 12px;
        vertical-align: top;
        margin-right: 5px;
      }

      span {
        width: calc(100% - 18px);
        word-break: break-all;
        display: inline-block;
        vertical-align: top;
      }
    }

    .infoLine {
      margin-top: 24px;

      .info {
        flex: 1;
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
</style>
