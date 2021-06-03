<template>
  <main class="container">
    <div v-if="projectObj" class="project-warp">
      <div class="title-warp">
        <div class="name">{{ projectObj.name }}</div>
        <div class="info-line flex-row-space-between">
          <div class="info">
            <i class="iconfont iconjiance-copy"></i>
            {{ $t('views.projectDetail.mode') }}
            <i class="mode">
              {{ projectObj.mode }}
            </i>
            <i class="iconfont icongerenzhongxin" style="font-size: 14px"></i>
            {{ $t('views.projectDetail.owner') }}
            <span style="margin-right: 40px"> {{ projectObj.owner }}</span>
            <i class="iconfont iconshijian00"></i>
            {{ $t('views.projectDetail.latest_time') }}
            <i style="margin-right: 40px">{{ projectObj.latest_time }}</i>
          </div>
          <div class="operate">
            <el-button type="text" class="operateBtn" @click="projectExport">
              <i class="iconfont icondaochu-5"></i>
              导出
            </el-button>
            <el-button
              type="text"
              class="operateBtn"
              @click="$router.push(`/project/projectEdit/${projectObj.id}`)"
            >
              <i class="iconfont iconshezhi-2"></i>
              设置
            </el-button>
          </div>
        </div>
      </div>
      <div class="projectVul flex-row-space-between">
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'desc' ? 'selected' : ''"
          @click="selectTab = 'desc'"
        >
          <i class="iconfont iconshuju1"></i>
          {{ $t('views.projectDetail.projectDesc') }}
        </el-button>
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'vul' ? 'selected' : ''"
          @click="selectTab = 'vul'"
        >
          <i class="iconfont iconloudong"></i>
          {{ $t('views.projectDetail.projectVul') }}
        </el-button>
        <el-button
          type="text"
          class="pTab"
          :class="selectTab === 'component' ? 'selected' : ''"
          @click="selectTab = 'component'"
        >
          <i class="el-icon-menu"></i>
          {{ $t('views.projectDetail.projectComponent') }}
        </el-button>
      </div>
      <div v-show="selectTab === 'desc'">
        <div class="module flex-row-space-between" id="type_summary_level_count">
          <div class="module-content">
            <div class="module-title">
              {{ $t('views.projectDetail.vulNum') }}
            </div>
            <div id="level_count" class="module-card"></div>
          </div>
          <div class="module-content">
            <div class="module-title">
              {{ $t('views.projectDetail.type') }}
            </div>
            <div id="type_summary" class="module-card"></div>
          </div>
        </div>
        <div class="module">
          <div class="module-title">
            {{ $t('views.projectDetail.vulNum') }}
          </div>
          <div id="day_num" class="module-card"></div>
        </div>
      </div>
      <div v-if="selectTab === 'vul'">
        <vul-list-component
          :project-id="$route.params.pid"
        ></vul-list-component>
      </div>
      <div v-if="selectTab === 'component'">
        <ScaList
          :project-id="$route.params.pid"
        ></ScaList>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { ProjectObj, SelectTabs } from './types'
import { formatTimestamp } from '@/utils/utils'
import request from '@/utils/request'
import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'
import VulListComponent from './VulListComponent.vue'
import ScaList from '../sca/ScaList.vue'
import { Message } from 'element-ui'

@Component({
  name: 'ProjectDetail',
  components: {
    VulListComponent,
    ScaList
  },
})
export default class ProjectDetail extends VueBase {
  private selectTab = SelectTabs.desc
  private projectObj: ProjectObj = {
    id: 0,
    mode: '',
    name: '',
    owner: '',
    latest_time: '',
  }
  mounted() {
    this.projectsSummary()
  }
  private async projectsSummary() {
    const { status, msg, data } = await this.services.project.projectsSummary(
      this.$route.params.pid
    )
    if (status !== 201) {
      this.$message.error(msg)
      return
    }

    const type_summary = document.getElementById('type_summary') as HTMLElement
    const level_count = document.getElementById('level_count') as HTMLElement
    const type_summary_level_count = document.getElementById('type_summary_level_count') as HTMLElement

    const height = Math.ceil(data.type_summary.length / 5) * 30
    const domHeight = type_summary.offsetHeight
    type_summary.style.height = domHeight + height + 'px'
    level_count.style.height = domHeight + height + 'px'
    type_summary_level_count.style.height = domHeight + 40 + height + 'px'

    this.projectObj = {
      ...data,
      name: data.name,
      latest_time: formatTimestamp(data.latest_time),
    }

    const levelCountChart = echarts.init(
      document.getElementById('level_count') as HTMLElement
    )
    const levelCountOption: EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        height: domHeight + height - 100,
        left: '3%',
        right: '4%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: data.level_count
          .map((item: { level_name: string }) => {
            return item.level_name
          })
          .reverse(),
      },
      series: [
        {
          type: 'bar',
          barWidth: 10,
          data: data.level_count
            .map((item: { num: number }) => {
              return item.num
            })
            .reverse(),
        },
      ],
    }
    levelCountChart.setOption(levelCountOption)
    const typeSummaryChart = echarts.init(type_summary as HTMLElement)
    const typeSummaryOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: data.type_summary.map((item: { type_name: string }) => {
          return item.type_name
        }),
      },
      series: [
        {
          type: 'pie',
          width: 580,
          height: 300,
          data: data.type_summary.reduce(
            (
              list: { name: any; value: any; tooltip: { formatter: string } }[],
              item: { type_name: any; type_count: any }
            ) => {
              list.push({
                name: item.type_name,
                value: item.type_count,
                tooltip: {
                  formatter: '类型<br />{b0}: {c0} ({d}%)<br />',
                },
              })
              return list
            },
            []
          ),
        },
      ],
    }
    typeSummaryChart.setOption(typeSummaryOption)

    const dayNumChart = echarts.init(
      document.getElementById('day_num') as HTMLElement
    )
    const dayNumOption: EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.day_num.map((item: { day_label: any }) => {
          return item.day_label
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.day_num.map((item: { day_num: any }) => {
            return item.day_num
          }),
          itemStyle: {
                color: 'rgba(99, 161, 242,1)'
            },
          type: 'line',
          areaStyle: {
                color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(99, 161, 242,1)'
                }, {
                    offset: 1,
                    color: 'rgba(99, 161, 242,0.3)'
                }])
            },
        },
      ],
    }
    dayNumChart.setOption(dayNumOption)
  }

  projectExport() {
    request
      .get(`/project/export?pid=${this.$route.params.pid}`, {
        responseType: 'blob', // 告诉服务器我们需要的响应格式
      })
      .then((res: any) => {
        if (res.hasOwnProperty('response')) {
          this.$message.error({ message: '报告导出失败', showClose: true })
        } else {
          const blob = new Blob([res], {
            type: 'application/octet-stream', // 将会被放入到blob中的数组内容的MIME类型
          })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = this.projectObj.name + '.doc'
          link.click()
          this.$message.success({ message: '报告导出成功', showClose: true })
        }
      })
      .catch((error) => {
        this.$message.error({ message: '报告导出失败', showClose: true })
      })
  }
}
</script>

<style scoped lang="scss">
.project-warp {
  margin-top: 28px;
  background: #fff;
  padding: 14px 14px 80px 14px;

  .title-warp {
    padding-bottom: 13px;
    border-bottom: 1px solid #e6e9ec;

    .name {
      font-size: 16px;
      color: #38435a;
      font-weight: 600;
    }

    .info-line {
      margin-top: 19px;

      .info {
        font-size: 14px;
        color: #a3a8b3;
        i {
          font-size: 14px;
        }

        .mode {
          color: #4fb794;
          margin-right: 45px;
          font-style: inherit;
        }
      }

      .operate {
        // color: #b1b9c4;

        .operateBtn {
          width: 80px;
          height: 32px;
          line-height: 0;
          border-radius: 2px;
          font-size: 14px;
          border: 1px solid #4a72ae;
          color: #4a72ae;
        }

        // i {
        //   cursor: pointer;
        //   margin-left: 24px;

        //   &:first-child {
        //     margin-left: 0;
        //   }
        // }
      }
    }
  }

  .projectVul {
    cursor: pointer;
    font-size: 14px;
    color: #2e7def;
    margin-top: 13px;

    .pTab {
      width: 49%;
      height: 32px;
      line-height: 0;
      border-radius: 2px;
      border: 1px solid #2e7def;
    }

    .selected {
      background: #2e7def;
      color: #fff;
    }

    // i {
    //   font-size: 14px;
    //   color: #b1b9c4;
    // }
  }

  .module {
    margin-top: 14px;

    .module-title {
      font-size: 14px;
      font-weight: 400;
      color: #38435a;
    }

    .module-card {
      margin-top: 18px;
      width: 100%;
      height: 342px;
      background: #ffffff;
      box-shadow: 0 0 16px 0 #eff2f6;
    }

    .module-content {
      width: 580px;
      height: 330px;

      .module-card {
        height: 298px;
      }
    }
  }
}
</style>
