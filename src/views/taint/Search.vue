<template>
  <main class="container">
    <div class="search-card-list">
      <div class="search-card" v-for="item in tableData">
        <div class="card-row">
          <div>
            <label>策略：</label>
            {{ item.rule }}
          </div>
          <div>
            <label>agent：</label>
            {{ item.agent_name }}
          </div>
        </div>
        <div class="card-row">
          <div>
            <label>URL：</label>
            {{ `${item.url}${item.req_params ? `?${item.req_params}` : ''}` }}
          </div>
        </div>
        <div class="card-row">
          <div>
            <label>风险函数：</label>
            <div class="list-box">
              <div class="line" v-for="(line,lineIndex) in item.sink_rules" :key="lineIndex">
                {{ line.value }}
              </div>
            </div>
          </div>
          <div>
            <label>组件：</label>
            <div class="list-box">
              <div class="line" v-for="(line,lineIndex) in item.dependencies" :key="lineIndex">
                {{ line.package_name }}&nbsp;存在&nbsp;{{ line.vul_count }}&nbsp;个漏洞
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <div class="select-pagination">-->
    <!--      <el-pagination background layout="prev, pager, next" :total="1000">-->
    <!--      </el-pagination>-->
    <!--    </div>-->
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { DataObj,SearchParams,methodPoolSearchParams } from './types/search'
import { formatTimestamp } from '@/utils/utils'
import Emitter from './Emitter'


@Component({ name: 'Search' })
export default class Search extends VueBase {
  private tableData: Array<DataObj> = []

  created() {
    Emitter.on('searchParams', this.getTableData)
  }

  private async getTableData(searchParams: SearchParams) {
    const params: methodPoolSearchParams = {
      name: searchParams.name,
      msg: searchParams.msg,
      level: searchParams.level
    }
    searchParams.paramsList.forEach((paramsObj)=>{
      if(!paramsObj.key){
        return;
      }
      if(params.hasOwnProperty(paramsObj.key)){
        params[paramsObj.key].push(paramsObj.value)
      }else{
        params[paramsObj.key] = [paramsObj.value]
      }
    })
    this.loadingStart()
    const { status, data, msg } = await this.services.taint.methodPoolSearch(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data.reduce((list: DataObj[], item: DataObj) => {
      list.push({
        ...item,
        update_time: formatTimestamp(item.update_time)
      })
      return list
    }, [])
  }
}
</script>

<style lang="scss" scoped>
main {
  padding: 10px 0 80px;
}
.search-card-list {
  .search-card {
    border: 1px solid #d6ddec;
    border-radius: 4px;
    background: #fff;
    margin-bottom: 10px;
    padding-bottom: 10px;


    .card-row {
      display: flex;
      justify-content: space-between;

      label {
        font-size: 14px;
        color: #3d434c;
      }

      > div {
        margin: 10px 10px 0;
        flex: 1;
        font-size: 14px;
        color: #2a303d;
        word-break: break-all;
      }

      .list-box {
        width: 570px;
        margin-top: 10px;
        border: 1px solid #c9cfe0;
        border-radius: 4px;
        overflow: auto;
        height: 100px;

        .line {
          padding-left: 5px;
          white-space: nowrap;
        }
      }
    }
  }
}

.select-pagination {
  display: flex;
  flex-direction: row-reverse;
}
</style>
