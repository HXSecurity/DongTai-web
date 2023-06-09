<template>
  <main
    id="distribution"
    style="width: 100%"
    :style="{ height: height + 'px' }"
  ></main>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import * as echarts from 'echarts'

@Component({
  name: 'Distribution',
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

  private randerEchart() {
    const data: any = []
    const selected = {}
    this.data.forEach((item: any) => {
      data.push({ value: item.num, name: item.level_name })
      selected[item.level_name] = item.num > 0
    })
    const option: any = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const colorMap = {
            严重: '#E56363',
            高危: '#F49E0B',
            中危: '#2F90EA',
            低危: '#ACB4C4',
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
        borderWidth: 0,
        data: data.map((item: any) => item.name),
        selected: selected,
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '45%'],
          radius: ['40%', '70%'],
          color: ['#E56363', '#F49E0B', '#2F90EA', '#ACB4C4', '#D8D8D8'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '24',
              fontWeight: 'bold',
            },
          },
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    }
    const dom = (document as any).getElementById('distribution')
    if (!dom) {
      return
    }
    const myChart = echarts.init(dom)
    myChart.setOption(option)
  }
}
</script>

<style scoped lang="scss"></style>
