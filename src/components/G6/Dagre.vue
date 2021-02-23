<template>
  <div style="position: relative" ref="container" id="container"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import G6, { Algorithm, Graph, ShapeOptions, ModelConfig, IGroup } from '@antv/g6'

import { EdgeConfig } from '@antv/g6-core/lib/types'

@Component({ name: 'Dagre' })
export default class Dagre extends Vue {
  private graph: Graph | undefined = undefined

  @Prop() initData!: {
    nodes: any[]
    edges: any[]
  }

  mounted() {
    this.graphInit()
  }

  graphInit() {
    const fittingString = (str: string, maxWidth: number, fontSize: number) => {
      let currentWidth = 0
      let res = str
      const pattern = new RegExp('[\u4E00-\u9FA5]+') // distinguish the Chinese charactors and letters
      str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth) return
        if (pattern.test(letter)) {
          currentWidth += fontSize
        } else {
          currentWidth += G6.Util.getLetterWidth(letter, fontSize)
        }
        if (currentWidth > maxWidth) {
          res = `${str.substr(0, i)}\n${fittingString(str.substr(i), maxWidth, fontSize)}`
        }
      })
      debugger
      return res
    }


    G6.registerNode(
      'sql',
      {
        drawShape(cfg: ModelConfig, group: IGroup) {
          const rect = group.addShape('rect', {
            attrs: {
              x: -75,
              y: -25,
              width: 150,
              height: Math.floor((cfg.name as string).length * 14 / 140) * 14 > 50 ? Math.floor((cfg.name as string).length * 14 / 140) * 14 : 50,
              radius: 10,
              textAlign: 'center',
              stroke: '#5B8FF9',
              fill: '#C6E5FF',
              lineWidth: 3
            },
            name: 'rect-shape'
          })
          if (cfg.name) {
            group.addShape('text', {
              attrs: {
                text: fittingString(cfg.name as string, 140, 14),
                x: 0,
                y: 4,
                fill: '#00287E',
                fontSize: 14,
                lineHeight: 16,
                textAlign: 'center',
                textBaseline: 'middle',
                fontWeight: 'bold'
              },
              name: 'text-shape'
            })
          }
          return rect
        }
      } as ShapeOptions,
      'single-node'
    )
    const graph = new G6.Graph({
      container: 'container',
      width: 1200,
      height: 500,
      layout: {
        type: 'dagre',
        nodesepFunc: (d: { id: string; }) => {
          if (d.id === '3') {
            return 500
          }
          return 50
        },
        ranksep: 70,
        controlPoints: true
      },
      defaultNode: {
        type: 'sql'
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 2,
          stroke: '#C2C8D5'
        }
      },
      nodeStateStyles: {
        selected: {
          stroke: '#d9d9d9',
          fill: '#5394ef'
        }
      },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select',
          {
            type: 'tooltip',
            formatText(model: any) {
              const cfg = model.conf
              const text: string[] = []
              cfg.forEach((row: { label: string; value: string; }) => {
                text.push(row.label + ':' + row.value + '<br>')
              })
              return text.join('\n')
            },
            offset: 30
          }
        ]
      },
      fitView: true
    })
    graph.data(this.initData)
    const edgeIds: string[] = []
    graph.edge((edge: EdgeConfig) => {
      if (edge.selected) {
        edge.id && edgeIds.push(edge.id)
      }
      return {
        id: edge.id
      }
    })
    graph.render()
    edgeIds.forEach((id: string) => {
      graph.setItemState(id, 'selected', true)
    })
    this.graph = graph
  }

  graphRefresh() {
    if (!this.graph) {
      this.graphInit()
    }

    (this.graph as Graph).data(this.initData)
    const edgeIds: string[] = [];
    (this.graph as Graph).edge((edge: EdgeConfig) => {
      if (edge.selected) {
        edge.id && edgeIds.push(edge.id)
      }
      return {}
    })
    console.log(edgeIds);
    (this.graph as Graph).render()
    edgeIds.forEach((id: string) => {
      (this.graph as Graph).setItemState(id, 'selected', true)
    })

  }
}
</script>

<style>
.g6-tooltip {
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
  background-color: #000;
  padding: 2px 8px;
}
</style>
