<template>
  <div>
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
    <div class="taintWarp">
      <div class="taintLine flex-row-space-between" v-for="(item,index) in taintLinkList" :key="item">
        <span class="className">
          {{`${item.className}.${item.methodName}()`}}
           <i
             v-if="index < taintLinkList.length - 1"
             class="step el-icon-bottom"
           ></i>
        </span>
        <span class="desc">
          污点数据输入源，调用类及方法: {{`${item.callerClass}.${item.callerMethod}()`}}{{
            item.callerLineNumber ? ' , 行号: '+ item.callerLineNumber: ''
          }}{{
            item.sourceHash.length > 0 ? ' , 污点值: '+ item.sourceHash.join(','): ''
          }}{{
            item.targetHash.length > 0 ? ' , 污点值2: '+ item.targetHash.join(','): ''
          }}
        </span>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { SearchParams, methodPoolSearchParams, VulObj, TaintLinkObj } from './types/search'
import Emitter from '@/views/taint/Emitter'


@Component({ name: 'PoolDetail' })
export default class PoolDetail extends VueBase {
  private vul: VulObj = {}
  private taintLinkList: TaintLinkObj[] = []

  mounted() {
    Emitter.on('searchParams', this.methodPoolDetail)
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
    const {
      status,
      data: { vul, taint_link },
      msg
    } = await this.services.taint.methodPoolDetail(this.$route.params.id, params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.vul = vul
    this.taintLinkList = taint_link
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

.taintWarp {
  margin-top: 10px;
  background: #fff;

  padding: 10px;

  .taintLine {
    margin-top: 20px;
    line-height: 18px;


    .className{
      border: 1px solid #e9edf5;
      background: #fff;
      font-size: 14px;
      color: #646e83;
      padding: 5px;
      width: 500px;
      text-align: center;
      word-break: break-all;
    }

    .desc{
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
