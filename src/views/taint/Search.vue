<template>
  <main class="container">
    <div class="search-box" :class="active ? 'top' : ''">
      <SearchBar @enter="search" />
    </div>
    <transition name="fade">
      <div v-if="!active" class="desc">
        <div class="title">常用查询语法：</div>
        <div class="example-box">
          <div class="example">
            <div class="label">URL</div>
            <div class="info">(.*?)/druid/.*?</div>
          </div>
          <div class="example">
            <div class="label">请求体</div>
            <div class="info">(.*?)whoami(.*?)</div>
          </div>
          <div class="example">
            <div class="label">方法签名</div>
            <div class="info">whoami</div>
          </div>
          <div class="example">
            <div class="label">响应头</div>
            <div class="info">set-cookie</div>
          </div>
          <div class="example">
            <div class="label">请求头</div>
            <div class="info">(.*?)exec</div>
          </div>
          <div class="example">
            <div class="label">响应体</div>
            <div class="info">&lt;script&gt; alert(1) &lt;/script&gt;</div>
          </div>
          <div class="example">
            <div class="label">污点数据</div>
            <div class="info">(.*?)rememberMe(.*?)</div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="status" class="search-list">
        <template v-if="tableList.length">
          <div
            v-for="item in tableList"
            :key="item.method_pools.id"
            class="search-list-item"
          >
            <SearchCard :info="item" />
          </div>
        </template>
        <template v-else>
          <div class="no-data">无匹配数据</div>
        </template>
      </div>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import SearchBar from '@/views/taint/SearchBar.vue'
import SearchCard from '@/views/taint/searchCard.vue'

@Component({
  name: 'TaintIndex',
  components: {
    SearchBar,
    SearchCard,
  },
})
export default class Index extends VueBase {
  private active = false
  private status = false
  private page = 1
  private dataEnd = false
  private type = ''
  private value = ''
  private tableList: Array<any> = []
  private afterkeys = ''

  private search([type, value]: any[]) {
    this.type = type
    this.value = value
    this.page = 1
    this.tableList = []
    this.afterkeys = ''
    if (!value) {
      this.$message.warning('请输入搜索内容')
    }
    if (value) {
      this.changeActive()
      this.getList()
    }
  }
  private async getList() {
    this.dataEnd = true
    const keyArr = [
      'url',
      'signature',
      'sinkvalues',
      'req_header_fs',
      'req_data',
      'res_header',
      'res_body',
    ]
    const searchKey = {}
    if (this.type) {
      searchKey[this.type] = this.value
    } else {
      for (let i = 0; i < keyArr.length; i++) {
        searchKey[keyArr[i]] = this.value
      }
    }
    const res: any = await this.services.taint.search({
      ...searchKey,
      page_index: this.page,
      page_size: 10,
      search_after_update_time: this.afterkeys || undefined,
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
    this.afterkeys = res.data.afterkeys.update_time
    this.tableList = this.tableList.concat(tableList)
    this.dataEnd = false
    if (tableList.length < 10) {
      this.dataEnd = true
    }
  }
  private changeActive() {
    if (this.status) {
    } else {
      this.active = !this.active
      setTimeout(() => {
        this.status = this.active
      }, 400)
    }
  }

  private myScroll() {
    const bottomWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 1
    if (bottomWindow) {
      if (!this.dataEnd) {
        this.page += 1
        this.getList()
      }
    }
  }

  mounted() {
    window.addEventListener('scroll', this.myScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.myScroll)
  }
}
</script>

<style scoped lang="scss">
main.container {
  background: #ffffff;
  min-height: calc(100vh - 64px);
  padding-bottom: 20px;
  box-sizing: border-box;
  position: relative;
  .search-box {
    z-index: 90;
    background: #fff;
    position: fixed;
    height: 72px;
    transition: all 0.4s;
    width: 1200px;
    box-sizing: border-box;
    left: calc(50vw - 600px);
    top: 20%;
    align-items: center;
    display: flex;
    justify-content: center;
    .search-bar {
      width: 908px;
    }
  }
  .top {
    box-shadow: 0px 1px 4px -4px #5e5e5e;
    top: 64px;
  }

  .desc {
    padding: calc(20% + 40px) 269px 0 269px;
    .title {
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
      color: #38435a;
      padding-bottom: 4px;
    }
    .example-box {
      display: flex;
      flex-wrap: wrap;
      .example {
        display: flex;
        width: 50%;
        padding: 12px 16px;
        .label {
          width: 68px;
          text-align: right;
          color: #959fb4;
          margin-right: 16px;
        }
        .info {
          font-size: 14px;
          line-height: 14px;
          color: #38435a;
        }
      }
    }
  }
  .search-list {
    padding: 104px 24px 0;
    .search-list-item + .search-list-item {
      margin-top: 12px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.no-data {
  padding-top: 200px;
  text-align: center;
  font-size: 16px;
  color: #bcbec2;
}
</style>
<style>
html {
  overflow-y: overlay;
}
</style>
