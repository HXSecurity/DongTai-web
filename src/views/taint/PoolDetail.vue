<template>
  <div class="container">
    <el-tabs
      v-model="activeName"
      class="poolDetail-tab"
      @tab-click="changeActive"
    >
      <el-tab-pane
        :label="$t('views.scaList.tableHeaders.dataTest')"
        name="flowDebug"
      >
        <SearchCard v-if="info" :info="info" :show-graph="false" />
        <div class="dagre-box">
          <Dagre
            v-if="graphData.nodes[0]"
            :pool-id="$route.params.id"
            :init-data="graphData"
            :box-height="1200"
          ></Dagre>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('views.scaList.tableHeaders.componentInfo')"
        name="dependency"
      >
        <el-table
          class="sca-list"
          :data="dependencies"
          style="width: 100%; margin-top: 18px; cursor: pointer"
          sort-by="vul_count"
        >
          <el-table-column
            :label="$t('views.scaList.tableHeaders.name')"
            prop="package_name"
          ></el-table-column>
          <el-table-column
            :label="$t('views.scaList.tableHeaders.version')"
            prop="version"
          ></el-table-column>
          <el-table-column
            :label="$t('views.scaList.tableHeaders.count')"
            prop="vul_count"
          ></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import SearchCard from '@/views/taint/searchCard.vue'
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import merge from 'webpack-merge'
import { GraphData } from './types/search'
import Dagre from '@/components/G6/Dagre.vue'

@Component({
  name: 'PoolDetail',
  components: {
    SearchCard,
    Dagre,
  },
})
export default class PoolDetail extends VueBase {
  private activeName = 'flowDebug'
  private info: any = null
  private graphData: GraphData = {
    nodes: [],
    edges: [],
  }
  private dependencies = []
  private changeActive(e: any) {
    this.$router.replace({
      query: merge(this.$route.query, { activeName: e.name }) as any,
    })
  }
  private async getSca() {
    const res = await this.services.taint.sca({
      method_pool_id: this.$route.params.id,
    })
    if (res.status === 201) {
      this.dependencies = res.data
    }
  }
  private async getList() {
    const res: any = await this.services.taint.search({
      id: this.$route.params.id,
    })
    const tableList = res.data.method_pools.map((item: any, index: number) => {
      const vulnerablities_count_map = {}
      const relations_map = {}
      res.data.aggregation.vulnerablities_count.forEach((i: any) => {
        vulnerablities_count_map[i.method_pool_id] = i
      })

      res.data.relations.forEach((i: any) => {
        relations_map[i.method_pool_id] = i
      })
      return {
        method_pools: item,
        vulnerablities_count: vulnerablities_count_map[item.id],
        relations: relations_map[item.id],
      }
    })
    this.info = tableList[0]
  }

  private async getMethodPool() {
    const res = await this.services.taint.graph({
      method_pool_id: this.$route.params.id,
      method_pool_type: 'normal',
    })
    if (res.status === 201) {
      this.graphData = res.data
    }
  }

  mounted() {
    this.getList()
    this.getMethodPool()
    this.getSca()
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 24px;
  background: #ffffff;
  min-height: calc(100vh - 64px);
}
.dagre-box {
  margin-top: 24px;
  height: 1200px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #c8e0ff;
}
</style>
