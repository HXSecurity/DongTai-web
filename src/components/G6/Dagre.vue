<template>
  <div class="dagre-com">
    <div class="minimap" :id="'minimap'+poolId"></div>
    <div style="position: relative" ref="container" :id="'container'+poolId"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import G6, { Graph, ShapeOptions, ModelConfig, IGroup } from '@antv/g6'

import { EdgeConfig } from '@antv/g6-core/lib/types'

@Component({ name: 'Dagre' })
export default class Dagre extends Vue {
  private graph: Graph | undefined = undefined
  @Prop() poolId:any
  @Prop() boxHeight?:any
  @Prop() width?:any
  @Prop() initData!: {
    nodes: any[]
    edges: any[]
  }

  mounted() {
    this.graphInit()
  }



  graphInit() {
    const nodeMap = {}
    for(let i=0;i<this.initData.nodes.length;i++){
        const item = this.initData.nodes[i]
       item.id = "node"+item.id
       if(nodeMap[item.id]){
         this.initData.nodes.splice(i,1)
         i--
       }else{
         nodeMap[item.id] = true
       }
    }
     this.initData.edges.forEach((item: any) => {
      item.id = "edge"+item.id
      item.source = "node"+item.source
      item.target = "node"+item.target
      })
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
      return res
    }


    G6.registerNode(
      'sql',
      {
        drawShape(cfg: ModelConfig, group: IGroup) {
          const computLength=(value:string):number=>{
            const ch_value_arr = value.match(/[\u4e00-\u9fa5]/g) || []
            const ch_value_length = ch_value_arr.length
            const upper_case_arr = value.match(/[A-Z]/g) || []
            const upper_case_length = upper_case_arr.length
            const length = (String(value).length) * 1.27
            return length
          }
          const rect = group.addShape('rect', {
            attrs: {
              x: -75,
              y: -25,
              width: 180,
              height: Math.floor(computLength(cfg.name as string)) > 50 ? Math.floor(computLength(cfg.name as string)) : 50,
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
                x: 14,
                y: -16,
                fill: '#00287E',
                fontSize: 14,
                lineHeight: 16,
                textAlign: 'center',
                textBaseline: 'top',
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
    const Minimap = new G6.Minimap({
      container: 'minimap'+this.poolId,
      size: [200,200],
    });

    const graph = new G6.Graph({
      container: 'container'+this.poolId,
      width: this.width || 1150,
      height: this.boxHeight || 290,
      plugins: [Minimap],
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
    graph.setMinZoom(0.5)
    graph.setMaxZoom(5)
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
.dagre-com{
  position: relative;
}
.minimap{
  position: absolute;
  z-index: 4;
  right:12px;
  top:12px;
  background: #fff;
  border: 1px solid #D3DBE6;
}
</style>
