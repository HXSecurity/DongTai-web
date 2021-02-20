<template>
  <div>
    <div class="httpTestWarp ">
      <div class="flex-row-space-between">
        <div class="requestBox">
          <textarea v-model="vul.req_header"></textarea>
        </div>
        <div class="responseBox">
          {{ vul.res_body }}
        </div>
      </div>
      <div class="bottom-btn-line">
        <el-button type="primary">发送</el-button>
      </div>
    </div>
    <div class="taintWarp">
      <div class="taintLine" v-for="item in taintLinkList" :key="item"></div>
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
    text-align: center;
    margin-top: 10px;
  }
}

.taintWarp {
  margin-top: 10px;
  background: #fff;
  border: 1px solid #d6ddec;
  border-radius: 4px;
  padding: 10px;

  .taintLine {

  }
}
</style>
