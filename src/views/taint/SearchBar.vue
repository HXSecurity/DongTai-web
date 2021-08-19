<template>
  <div class="search-bar">
    <el-input
      v-model="searchValue"
      :placeholder="$t('views.search.searchValuePlace')"
      class="input-with-select"
      @keyup.enter.native="enterSearch"
    >
      <el-select
        slot="prepend"
        v-model="searchType"
        :placeholder="$t('views.search.prependPlace')"
        clearable
        class="search-bar-select"
      >

        <el-option :label="$t('views.search.url')" value="url"></el-option>
        <el-option :label="$t('views.search.signature')" value="signature"></el-option>
        <el-option :label="$t('views.search.sinkvalues')" value="sinkvalues"></el-option>
        <el-option :label="$t('views.search.req_header_fs')" value="req_header_fs"></el-option>
        <el-option :label="$t('views.search.req_data')" value="req_data"></el-option>
        <el-option :label="$t('views.search.res_header')" value="res_header"></el-option>
        <el-option :label="$t('views.search.res_body')" value="res_body"></el-option>
      </el-select>
      <el-button
        slot="append"
        class="search-bar-enter"
        icon="el-icon-search"
        @click="enterSearch"
      ></el-button>
    </el-input>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component, Emit } from 'vue-property-decorator'
@Component({
  name: 'SearchBar',
})
export default class SearchBar extends VueBase {
  private searchType = ''
  private searchValue = ''
  @Emit('enter')
  private enterSearch() {
    return [this.searchType, this.searchValue]
  }
}
</script>

<style scoped lang="scss">
/deep/.el-input-group__prepend {
  border: none;
}

/deep/.el-input-group__append{
  border: none;
}

.search-bar-select {
  width: 220px;
  border: 1px solid #e6e9ec;
  background: #fff;
  border-radius: 2px 0 0 2px;
  height: 40px;
  border-right: 0;
}
.input-with-select {
  /deep/.el-input__inner {
    border: 1px solid #e6e9ec;
    background: #fff;
    border-right: 0px;
    border-left: 0;
  }
  position: relative;
  &::before {
    position: absolute;
    left: 220px;
    top: 10px;
    content: '';
    height: 20px;
    width: 1px;
    background: #e6e9ec;
    z-index: 10;
  }
  .search-bar-enter {
    background: #4a72ae;
    border-radius: 0px 2px 2px 0px;
    color: #fff;
    height: 40px;
    width: 64px;
    text-align: center;
  }
}
</style>
