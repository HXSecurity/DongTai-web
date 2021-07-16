<template>
  <div>
    <el-tabs
      v-model="activeName"
      class="poolDetail-tab"
      @tab-click="changeActive"
    >
      <el-tab-pane label="污点调用图" name="taintGraph">
        <div class="graphWarp">
          <Dagre v-if="graphRefresh" :init-data="graphData"></Dagre>
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据包调试" name="flowDebug">
        <div class="httpTestWarp">
          <div class="bottom-btn-line">
            <el-button
              type="primary"
              size="small"
              :loading="buttonLoading"
              @click="send"
              >{{ buttonLoading ? '重放中' : '发送' }}</el-button
            >
          </div>
          <div class="flex-row-space-between">
            <div class="requestBox">
              <textarea v-model="vul.request"></textarea>
            </div>
            <div class="responseBox">
              <textarea v-model="vul.response"></textarea>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="依赖组件" name="dependency">
        <el-table
          class="sca-list"
          :data="vul.dependencies"
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
import { Component } from 'vue-property-decorator'
import merge from 'webpack-merge'
import VueBase from '@/VueBase'
import {
  SearchParams,
  methodPoolSearchParams,
  VulObj,
  TaintLinkObj,
  GraphData,
} from './types/search'
import Emitter from '@/views/taint/Emitter'
import Dagre from '@/components/G6/Dagre.vue'

@Component({
  name: 'PoolDetail',
  components: {
    Dagre,
  },
})
export default class PoolDetail extends VueBase {
  private vul: VulObj = {
    language: '',
    method_pool: '',
    request: '',
    response: '',
    url: '',
  }
  private activeName = 'taintGraph'
  // private taintLinkList: TaintLinkObj[] = []
  private graphRefresh = false
  private graphData: GraphData = {
    nodes: [],
    edges: [],
  }

  private changeActive(e: any) {
    this.$router.replace({
      query: merge(this.$route.query, { activeName: e.name }) as any,
    })
  }
  private buttonLoading = false
  private async send() {
    this.loadingStart()
    const res = await this.services.taint.replay({
      methodPoolId: this.$route.params.id,
      replayRequest: this.vul.request,
    })
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    const timer = setInterval(async () => {
      this.buttonLoading = true
      const resT = await this.services.taint.getReplay(res.data)
      if (resT.status === 201) {
        this.vul.response = resT.data
        clearInterval(timer)
        this.buttonLoading = false
      }
    }, 1000)
  }

  mounted() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName as string
    }
    Emitter.on('searchParams', (searchParams) =>
      this.methodPoolDetail(searchParams)
    )
  }

  private async methodPoolDetail(searchParams: SearchParams) {
    if (!this.$route.params.id) {
      return
    }
    const params: methodPoolSearchParams = {
      name: searchParams.name,
      msg: searchParams.msg,
      level: searchParams.level,
    }
    searchParams.paramsList.forEach((paramsObj) => {
      if (!paramsObj.key) {
        return
      }
      if (params.hasOwnProperty(paramsObj.key)) {
        params[paramsObj.key].push(paramsObj.value)
      } else {
        params[paramsObj.key] = [paramsObj.value]
      }
    })
    this.loadingStart()
    this.graphRefresh = false
    const { status, data, msg } = await this.services.taint.methodPoolDetail(
      this.$route.params.id,
      params
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.vul = data.vul
    this.graphData = data.graphData
    this.graphRefresh = true
  }
}
</script>

<style scoped lang="scss">
.httpTestWarp {
  width: 100%;
  min-height: 200px;
  background: #fff;
  border: 1px solid #d6ddec;
  border-radius: 4px;
  padding: 10px;

  .requestBox {
    flex: 1;
    height: 180px;

    > textarea {
      width: 100%;
      height: 100%;
      border: none;
      border-right: 1px solid #d3dbe6;
      outline: none;
    }
  }

  .responseBox {
    flex: 1;
    height: 180px;
    > textarea {
      width: 100%;
      height: 100%;
      padding-right: 2px;
      border: none;
      outline: none;
    }
  }

  .bottom-btn-line {
    text-align: right;
    border-bottom: 1px solid #d6ddec;
    padding-bottom: 10px;
  }
}

.graphWarp {
  background: #fff;
  margin-top: 10px;
}

.taintWarp {
  margin-top: 10px;
  background: #fff;

  padding: 10px;

  .taintLine {
    margin-top: 20px;
    line-height: 18px;

    .className {
      border: 1px solid #e9edf5;
      background: #fff;
      font-size: 14px;
      color: #646e83;
      padding: 5px;
      width: 500px;
      text-align: center;
      word-break: break-all;
    }

    .desc {
      border: 1px solid #e9edf5;
      background: #fff;
      font-size: 14px;
      color: #646e83;
      padding: 5px;
      width: 600px;
      text-align: center;
      word-break: break-all;
    }
  }
}
</style>
