<template>
  <main>
    <div class="search-card-list">
      <div class="search-card" v-for="item in tableData" :key="item.id"
           @click="$router.push(`/taint/poolDetail/${item.id}`)">
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
          <div>
            <label>调用链数量：</label>
            {{ item.link_count }}
          </div>
        </div>
        <div style="padding-left: 10px">

          <div class="top-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span>
              {{ item.top_stack }}
            </span>
          </div>
          <div class="bottom-stack">
            <i class="iconfont iconyuandianzhong"></i>
            <span>
              {{ item.bottom_stack }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import { DataObj, SearchParams, methodPoolSearchParams, Params } from './types/search'
import { formatTimestamp, debounce } from '@/utils/utils'
import Emitter from './Emitter'


@Component({ name: 'Search' })
export default class Search extends VueBase {
  private tableData: Array<DataObj> = []
  private searchParams: SearchParams = {
    name: '',
    msg: '',
    level: '',
    paramsList: []
  }
  private latest: number = 0
  private myDebounce: any

  created() {
    Emitter.on('searchParams', (searchParams) => {
      this.searchParams = searchParams
      this.resetData()
      this.getTableData(searchParams)
    })
  }

  mounted() {
    this.myDebounce = debounce(this.scroll, 500)
    window.addEventListener('scroll', this.myDebounce)
  }

  beforeDestroy() {
    Emitter.all.clear()
    window.removeEventListener('scroll', this.myDebounce)
  }

  private resetData(){
    this.latest = 0
    this.tableData = []
  }

  private scroll() {
    const bottomWindow = document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight - 2
    if (bottomWindow) {
      this.getTableData(this.searchParams)
    }
  }

  private async getTableData(searchParams: SearchParams) {
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
    const startStmp = new Date()
    const { status, data, latest, msg } = await this.services.taint.methodPoolSearch(this.latest, params)
    const endStmp = new Date()
    setTimeout(() => {
      this.loadingDone()
    }, 1000 - endStmp.getTime() + startStmp.getTime())
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.latest = latest
    this.tableData = [...this.tableData, ...data.reduce((list: DataObj[], item: DataObj) => {
      list.push({
        ...item,
        update_time: formatTimestamp(item.update_time)
      })
      return list
    }, [])]
    if (data.length < 20) {
      window.removeEventListener('scroll', this.myDebounce)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-card-list {
  .search-card {
    border: 1px solid #d6ddec;
    border-radius: 4px;
    background: #fff;
    margin-bottom: 10px;
    padding-bottom: 10px;
    cursor: pointer;


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
    }

    .top-stack {
      margin-top: 14px;
      position: relative;

      &:before {
        content: '';
        width: 1px;
        height: 30px;
        background: #dee4ea;
        position: absolute;
        left: 5px;
        top: 18px;
      }

      i {
        color: #5491ef;
        font-size: 12px;
        vertical-align: middle;
        margin-right: 5px;
      }

      span {
        width: calc(100% - 18px);
        word-break: break-all;
        display: inline-block;
        vertical-align: top;
      }
    }

    .bottom-stack {
      margin-top: 24px;

      i {
        color: #6ec79f;
        font-size: 12px;
        vertical-align: middle;
        margin-right: 5px;
      }

      span {
        width: calc(100% - 18px);
        word-break: break-all;
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}

.select-pagination {
  display: flex;
  flex-direction: row-reverse;
}
</style>
