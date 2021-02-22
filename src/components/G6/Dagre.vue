<template>
  <div ref="container" id="container"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import G6, { Graph,ShapeOptions,ModelConfig,IGroup } from '@antv/g6'
// import insertCss from 'insert-css';

import VueBase from '@/VueBase'

@Component({ name: 'Dagre' })
export default class Dagre extends Vue {
  private graph: Graph | undefined = undefined

  @Prop() initData!: {
    nodes: any[]
    edges: any[]
  }

  mounted(){
    this.graphInit()
  }

  graphInit() {
    G6.registerNode(
      'sql',
      {
        drawShape(cfg:ModelConfig, group:IGroup) {
          const rect = group.addShape('rect', {
            attrs: {
              x: -75,
              y: -25,
              width: 150,
              height: 50,
              radius: 10,
              stroke: '#5B8FF9',
              fill: '#C6E5FF',
              lineWidth: 3,
            },
            name: 'rect-shape',
          });
          if (cfg.name) {
            group.addShape('text', {
              attrs: {
                text: cfg.name,
                x: 0,
                y: 0,
                fill: '#00287E',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'middle',
                fontWeight: 'bold',
              },
              name: 'text-shape',
            });
          }
          return rect;
        },
      } as ShapeOptions,
      'single-node',
    );

    // const container = this.$refs.container
    // const width = (container as HTMLElement).scrollWidth
    // const height = (container as HTMLElement).scrollHeight || 500
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
    graph.data(this.initData);
    graph.render();
  }
}
</script>

<style scoped>

</style>
