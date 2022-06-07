<template>
  <main id="trend" style="width: 100%; height: 298px"></main>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import * as echarts from 'echarts'

@Component({
  name: 'Trend',
})
export default class Index extends VueBase {
  @Prop() data!: any
  @Watch('data', { immediate: true, deep: true })
  onDataChanged() {
    this.randerEchart()
  }

  mounted() {
    this.randerEchart()
  }
  randerEchart() {
    const XData: any = []
    const YHData: any = []
    const YMData: any = []
    const YLData: any = []
    const YNData: any = []
    const YIData: any = []
    this.data.forEach((item: any, index: number) => {
      XData.push(item.day_label)
      YHData.push(item.day_num_level_1)
      YMData.push(item.day_num_level_2)
      YLData.push(item.day_num_level_3)
      YNData.push(item.day_num_level_5)
      YIData.push(item.day_num_level_4)
    })

    const option: any = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        bottom: '0',
        data: ['高危', '中危', '低危', '提示', '无风险'],
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '8%',
        top: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: XData,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          type: 'line',
          markLine: {
            symbol: ['none', 'none'],
            silent: true,
            label: { show: false },
            itemStyle: {
              normal: {
                color: '#F2F3F5',
              },
            },
            data: [
              { xAxis: 0 },
              { xAxis: 1 },
              { xAxis: 2 },
              { xAxis: 3 },
              { xAxis: 4 },
              { xAxis: 5 },
              { xAxis: 6 },
            ],
          },
        },
        {
          name: '高危',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          color: ['#E56363'],
          itemStyle: {
            borderColor: '#ffffff',
            borderType: 'solid',
            borderWidth: '1',
          },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(229, 99, 99, 0.66)',
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: YHData,
        },
        {
          name: '中危',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          color: ['#F49E0B'],
          itemStyle: {
            borderColor: '#ffffff',
            borderType: 'solid',
            borderWidth: '1',
          },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(244, 158, 11, 0.66)',
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: YMData,
        },
        {
          name: '低危',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          color: ['#2F90EA'],
          itemStyle: {
            borderColor: '#ffffff',
            borderType: 'solid',
            borderWidth: '1',
          },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(47, 144, 234, 0.66)',
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: YLData,
        },
        {
          name: '提示',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          color: ['#ACB4C4'],
          itemStyle: {
            borderColor: '#ffffff',
            borderType: 'solid',
            borderWidth: '1',
          },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(172, 180, 196, 0.66)',
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: YNData,
        },
        {
          name: '无风险',
          type: 'line',

          label: {
            show: true,
            position: 'top',
          },
          symbol: 'circle',
          symbolSize: 5,
          color: ['#D8D8D8'],
          itemStyle: {
            borderColor: '#ffffff',
            borderType: 'solid',
            borderWidth: '1',
          },
          areaStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(216, 216, 216, 0.66)',
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: YIData,
        },
      ],
    }
    const dom = (document as any).getElementById('trend')
    if (!dom) {
      return
    }
    const myChart = echarts.init((document as any).getElementById('trend'))
    myChart.setOption(option)
  }
}
</script>

<style scoped lang="scss"></style>
