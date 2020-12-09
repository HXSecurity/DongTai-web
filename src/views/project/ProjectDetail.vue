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
            <i class="iconfont iconshijian00"></i>
            {{ $t('views.projectDetail.latest_time') }}
            {{ projectObj.latest_time }}
          </div>
          <div class="operate">
            <i class="iconfont icondaochu-5"></i>
            <i
              class="iconfont iconshezhi-2"
              @click="$router.push(`/project/projectEdit/${projectObj.id}`)"
            ></i>
          </div>
        </div>
      </div>
      <div class="projectVul">
        {{ $t('views.projectDetail.projectVul') }}
        <i class="iconfont iconchaolianjie"></i>
      </div>
      <div class="module flex-row-space-between">
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
  </main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'
import { ProjectObj } from './types'
import { formatTimestamp } from '@/utils/utils'
import * as echarts from 'echarts'
import { EChartsOption } from 'echarts'

@Component({ name: 'ProjectDetail' })
export default class ProjectDetail extends VueBase {
  private projectObj: ProjectObj = {
    id: 0,
    mode: '',
    name: '',
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
        left: '3%',
        right: '4%',
        bottom: '3%',
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

    const typeSummaryChart = echarts.init(
      document.getElementById('type_summary') as HTMLElement
    )
    const typeSummaryOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        data: data.type_summary.map((item: { type_name: string }) => {
          return item.type_name
        }),
      },
      series: [
        {
          type: 'pie',
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
          type: 'line',
        },
      ],
    }
    dayNumChart.setOption(dayNumOption)
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
        color: #b1b9c4;

        i {
          cursor: pointer;
          margin-left: 24px;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }

  .projectVul {
    cursor: pointer;
    font-size: 14px;
    color: #2e7def;
    margin-top: 13px;

    i {
      font-size: 14px;
      color: #b1b9c4;
    }
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
