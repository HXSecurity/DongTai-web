<template>
  <main class="container">
    <div class="search-box" :class="active ? 'top' : ''">
      <SearchBar ref="SearchBar" @enter="search" />
    </div>
    <transition name="fade">
      <div v-if="!active" class="desc">
        <div class="title">{{ $t('views.search.commonly') }}：</div>
        <div class="example-box">
          <div class="example">
            <div class="label" :class="$i18n.locale">
              {{ $t('views.search.url') }}
            </div>
            <div class="info">/druid/</div>
          </div>
          <div class="example">
            <div class="label" :class="$i18n.locale">
              {{ $t('views.search.req_data') }}
            </div>
            <div class="info">whoami</div>
          </div>
          <div class="example">
            <div class="label" :class="$i18n.locale">
              {{ $t('views.search.res_header') }}
            </div>
            <div class="info">set-cookie</div>
          </div>
          <div class="example">
            <div class="label" :class="$i18n.locale">
              {{ $t('views.search.req_header_fs') }}
            </div>
            <div class="info">exec</div>
          </div>
          <div class="example">
            <div class="label" :class="$i18n.locale">
              {{ $t('views.search.req_data') }}
            </div>
            <div class="info">&lt;script&gt; alert(1) &lt;/script&gt;</div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="status" v-loading.body.lock="loadingFlag" class="search-list">
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
          <div v-if="!loadingFlag" class="no-data">
            {{ $t('views.search.empty') }}
          </div>
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
  private afterkeys = {}
  private loadingFlag = false
  private search([type, value]: any[]) {
    this.type = type
    this.value = value
    this.page = 1
    this.tableList = []
    this.afterkeys = {}
    if (!value) {
      this.$message.warning(this.$t('views.search.warning') as string)
    }

    if (value) {
      this.loadingFlag = true
      this.changeActive()
      this.getList()
    }
  }
  private async getList() {
    if (!this.active) {
      return
    }
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
    const exclude_ids = this.tableList.map((item) => {
      return item.method_pools.id
    })
    const SearchBar: any = this.$refs.SearchBar

    let afterObj: any = undefined
    for (let key in this.afterkeys) {
      if (!afterObj) {
        afterObj = {}
      }
      afterObj['search_after_' + key] = this.afterkeys[key]
    }

    const res: any = await this.services.taint.search({
      ...searchKey,
      search_mode: SearchBar.search_mode,
      time_range: [
        ~~(SearchBar.time_range[0].getTime() / 1000),
        ~~(SearchBar.time_range[1].getTime() / 1000),
      ],
      page_index: this.page,
      page_size: 10,
      ...afterObj,
      exclude_ids: exclude_ids,
    })
    this.loadingFlag = false
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    const tableList = res.data.method_pools.map((item: any) => {
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
    this.afterkeys = res.data.afterkeys
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
    z-index: 5;
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
      width: 948px;
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
          &.en {
            width: 120px;
          }
        }
        .info {
          width: 180px;
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
