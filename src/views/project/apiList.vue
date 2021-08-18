<template>
  <div class="apiList">
    <div class="selectForm">
      <div>
        <el-select
          v-model="searchObj.method"
          :placeholder="$t('views.apiList.methodPlaceHolder')"
          style="width: 160px; font-size: 14px"
          class="commonSelect"
          clearable
        >
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
        </el-select>
        <el-select
          v-model="searchObj.status"
          :placeholder="$t('views.apiList.statusPlaceHolder')"
          style="margin-left: 10px; width: 160px; font-size: 14px"
          class="commonSelect"
          clearable
        >
          <el-option
            :label="$t('views.apiList.unlimited')"
            value="unlimited"
          ></el-option>
          <el-option
            :label="$t('views.apiList.covered')"
            value="covered"
          ></el-option>
          <el-option
            :label="$t('views.apiList.uncovered')"
            value="uncovered"
          ></el-option>
        </el-select>
        <el-input
          v-model="searchObj.url"
          :placeholder="$t('views.apiList.searchPlaceHolder')"
          class="commonInput"
          style="margin-left: 10px; width: 312px"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <div style="margin-right: 20px">
        <span>
          {{ $t('views.apiList.rate') }}
        </span>
        <span>30%</span>
      </div>
    </div>
    <div class="infoList">
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <div class="collapse-title">
              <el-tag type="success" effect="dark"> POST </el-tag>
              <span class="title-api-path"> /api/v1/login </span>
              <span>
                <span class="title-api-info"> 用户登录接口 </span>
                <i class="el-icon-success" style="color: #65d6a6"></i>
              </span>
            </div>
          </template>
          <div>
            <div class="table-toolbar">
              <span> {{ $t('views.apiList.parameters') }} </span>
              <div>
                <el-button size="small">
                  {{ $t('views.apiList.view') }}</el-button
                >
                <el-button size="small">
                  {{ $t('views.apiList.send') }}</el-button
                >
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                prop="name"
                :label="$t('views.apiList.name')"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="type"
                :label="$t('views.apiList.type')"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="extra"
                :label="$t('views.apiList.extra')"
                min-width="180"
              >
              </el-table-column>
            </el-table>
            <div class="table-foot">
              <span class="res"> {{ $t('views.apiList.response') }} </span>
              <span class="type">java.lang.String</span>
            </div>

            <SearchCard
              style="margin-top: 20px"
              :is-api="true"
              :info="{ method_pools: {}, relations: { vulnerablities: [] } }"
            ></SearchCard>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SearchCard from '@/views/taint/searchCard.vue'
@Component({
  name: 'ApiList',
  components: {
    SearchCard,
  },
})
export default class Index extends Vue {
  private searchObj = {
    method: '',
    status: '',
    url: '',
  }
  private tableData = [
    { name: 'name', type: 'java.lang.String', extra: '' },
    { name: 'name', type: 'java.lang.String', extra: '' },
  ]
}
</script>

<style scoped lang="scss">
.apiList {
  .selectForm {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 14px;
    margin-bottom: 14px;
    .sort-btn {
      width: 38px;
      height: 38px;
      border: 1px solid #dcdfe6;
      color: #606266;
      display: inline-block;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      cursor: pointer;
    }
    .selectInput {
      float: right;
    }
  }
  .collapse-title {
    display: flex;
    align-items: center;
    /deep/.el-tag--dark {
      width: 70px;
      text-align: center;
    }
    .title-api-path {
      font-size: 16px;
      display: inline-block;
      width: 350px;
      margin-left: 20px;
    }
    .title-api-info {
      font-size: 16px;
      display: inline-block;
      margin-right: 20px;
    }
    .el-icon-success {
      font-size: 18px;
    }
  }
  .table-toolbar {
    padding: 6px 12px;
    > span {
      font-size: 14px;
      font-weight: 600;
    }
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
  }
  .table-foot {
    margin-left: 12px;
    margin-top: 12px;
    font-size: 14px;
    color: #515a6e;
    font-weight: 600;
    .res {
      display: inline-block;
      width: 175px;
    }
  }
}
</style>
