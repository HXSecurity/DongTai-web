<template>
  <main id="type" style="width: 100%" :style="{ height: height + 'px' }"></main>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import * as echarts from 'echarts'

@Component({
  name: 'Type',
})
export default class Index extends VueBase {
  @Prop() data!: any
  @Prop() height!: number
  @Watch('data', { immediate: true, deep: true })
  onDataChanged() {
    this.randerEchart()
  }

  mounted() {
    this.randerEchart()
  }
  randerEchart() {
    let total = 0
    const legendData: any = ['高危', '中危', '低危', '无风险', '提示']
    const levelData: any = [
      { value: 0, name: '高危' },
      { value: 0, name: '中危' },
      { value: 0, name: '低危' },
      { value: 0, name: '无风险' },
      { value: 0, name: '提示' },
    ]
    const typeData: any = []
    this.data.forEach((item: any) => {
      legendData.push(item.type_name)
      levelData[item.type_level - 1].value += item.type_count
      total += item.type_count
      typeData.push({ value: item.type_count, name: item.type_name })
    })

    for (let i = 0; i < levelData.length; i++) {
      if (levelData[i].value === 0) {
        levelData.splice(i, 1)
        legendData.splice(i, 1)
        i--
      }
    }

    const option: any = {
      tooltip: {
        show: true,
        formatter: (params: any) => {
          if (params.componentIndex === 1) {
            return `
            <div style="display: flex;align-items: center;justify-content: space-between;width:160px; ">
                <p
                style="display: flex;width:100px; align-items: center;color:${params.color}" 
                >
                <span style="display:inline-block;white-space:pre-wrap;width:100px;margin-right: 6px;">${params.name}</span><span>${params.value}</span></p>
                <p style="color:#4A72AE">${params.percent}%</p>
                `
          }
          const colorMap = {
            高危: '#E56363',
            中危: '#F49E0B',
            低危: '#2F90EA',
            无风险: '#ACB4C4',
            提示: '#D8D8D8',
          }
          return `
            <div style="display: flex;align-items: center;justify-content: space-between;width:160px;height:8px;">
                <p
                style="display: flex; align-items: center;color:${
                  colorMap[params.name]
                }" 
                ><span style="width: 4px; height: 4px; background:${
                  colorMap[params.name]
                };  border-radius: 50%;  display: inline-block; margin-right: 4px;"></span> <span style=" margin-right: 6px;">${
            params.name
          }</span><span>${params.value}</span></p>
                <p style="color:#4A72AE">${params.percent}%</p>
                `
        },
      },
      legend: {
        tooltip: {
          show: true,
        },
        bottom: '0',
        data: legendData,
        type: 'scroll',
        formatter: function (name: any) {
          return (echarts as any).format.truncateText(
            name,
            90,
            '14px Microsoft Yahei',
            '…'
          )
        },
      },
      series: [
        {
          name: '类型分布',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          center: ['50%', '45%'],
          label: {
            position: 'inner',
            fontSize: 12,
            color: '#fff',
          },
          color: ['#E56363', '#F49E0B', '#2F90EA', '#ACB4C4', '#D8D8D8'],
          data: levelData,
        },
        {
          name: '类型分布',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          labelLine: {
            length: 30,
          },
          label: {
            show: false,
          },
          data: typeData,
        },
      ],
    }
    const dom = (document as any).getElementById('type')
    if (!dom) {
      return
    }
    const myChart = echarts.init(dom)
    myChart.setOption(option)
  }
}
</script>

<style scoped lang="scss"></style>
