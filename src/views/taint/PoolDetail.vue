<template>
  <div>
    <el-tabs class="poolDetail-tab" v-model="activeName">
      <el-tab-pane label="图" name="first">
        <div class="graphWarp">
          <Dagre v-if="graphRefresh" :init-data="graphData"></Dagre>
        </div>
      </el-tab-pane>
      <el-tab-pane label="调试" name="second">
        <div class="httpTestWarp ">
          <div class="bottom-btn-line">
            <el-button type="primary" size="small">发送</el-button>
          </div>
          <div class="flex-row-space-between">
            <div class="requestBox">
              <textarea v-model="vul.req_header"></textarea>
            </div>
            <div class="responseBox">
              {{ vul.res_body }}
            </div>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>


    <!--    <div class="taintWarp">-->
    <!--      <div class="taintLine flex-row-space-between" v-for="(item,index) in taintLinkList" :key="item">-->
    <!--        <span class="className">-->
    <!--          {{ `${item.className}.${item.methodName}()` }}-->
    <!--           <i-->
    <!--             v-if="index < taintLinkList.length - 1"-->
    <!--             class="step el-icon-bottom"-->
    <!--           ></i>-->
    <!--        </span>-->
    <!--        <span class="desc">-->
    <!--          污点数据输入源，调用类及方法: {{ `${item.callerClass}.${item.callerMethod}()` }}{{-->
    <!--            item.callerLineNumber ? ' , 行号: ' + item.callerLineNumber : ''-->
    <!--          }}{{-->
    <!--            item.sourceHash.length > 0 ? ' , 污点值: ' + item.sourceHash.join(',') : ''-->
    <!--          }}{{-->
    <!--            item.targetHash.length > 0 ? ' , 污点值2: ' + item.targetHash.join(',') : ''-->
    <!--          }}-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { SearchParams, methodPoolSearchParams, VulObj, TaintLinkObj, GraphData } from './types/search'
import Emitter from '@/views/taint/Emitter'
import Dagre from '@/components/G6/Dagre.vue'


@Component({
  name: 'PoolDetail',
  components: {
    Dagre
  }
})
export default class PoolDetail extends VueBase {
  private vul: VulObj = {
    language: '',
    method_pool: '',
    req_header: '',
    res_body: '',
    url: ''
  }
  private activeName: string = 'first'
  // private taintLinkList: TaintLinkObj[] = []
  private graphRefresh: boolean = false
  private graphData: GraphData = {
    nodes: [],
    edges: []
  }

  mounted() {
    Emitter.on('searchParams', (searchParams) => this.methodPoolDetail(searchParams))
  }

  private async methodPoolDetail(searchParams: SearchParams) {
    if (!this.$route.params.id) {
      return
    }
    const params: methodPoolSearchParams = {
      name: searchParams.name,
      msg: searchParams.msg,
      level: searchParams.level
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
    const { status, data, msg } = await this.services.taint.methodPoolDetail(this.$route.params.id, params)
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
      outline: none;
    }
  }

  .responseBox {
    flex: 1;
    height: 180px;
  }

  .bottom-btn-line {
    text-align: right;
    border-bottom: 1px solid #d6ddec;
    margin-top: 10px;
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
