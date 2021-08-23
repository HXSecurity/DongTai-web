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
          @change="searchChange"
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
          @change="searchChange"
        >
          <el-option
            :label="$t('views.apiList.unlimited')"
            :value="undefined"
          ></el-option>
          <el-option
            :label="$t('views.apiList.covered')"
            :value="1"
          ></el-option>
          <el-option
            :label="$t('views.apiList.uncovered')"
            :value="0"
          ></el-option>
        </el-select>
        <el-input
          v-model="searchObj.url"
          :placeholder="$t('views.apiList.searchPlaceHolder')"
          class="commonInput"
          style="margin-left: 10px; width: 312px"
          @keyup.enter.native="searchChange"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="searchChange"
          />
        </el-input>
      </div>
      <div style="margin-right: 20px">
        <span>
          {{ $t('views.apiList.rate') }}
        </span>
        <span> {{ coverRate }} </span>
      </div>
    </div>
    <div class="infoList">
      <el-collapse>
        <el-collapse-item v-for="item in apiList" :key="item.id">
          <template slot="title">
            <div class="collapse-title">
              <el-tag :type="getType(item.method)" effect="dark">
                {{ item.method }}
              </el-tag>
              <span class="title-api-path"> {{ item.path }} </span>
              <span>
                <span class="title-api-info"> {{ item.description }} </span>
                <i
                  v-if="item.is_cover"
                  class="el-icon-success"
                  style="color: #65d6a6"
                ></i>
              </span>
            </div>
          </template>
          <div>
            <div class="table-toolbar">
              <span> {{ $t('views.apiList.parameters') }} </span>
              <div>
                <el-button
                  v-if="item.is_cover"
                  size="small"
                  @click="startView(item)"
                >
                  {{ $t('views.apiList.view') }}</el-button
                >
                <el-button size="small" @click="startSend(item)">
                  {{ $t('views.apiList.send') }}</el-button
                >
              </div>
            </div>
            <el-table :data="item.parameters" style="width: 100%">
              <el-table-column
                prop="name"
                :label="$t('views.apiList.name')"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="parameter_type"
                :label="$t('views.apiList.type')"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="annotation"
                :label="$t('views.apiList.extra')"
                min-width="180"
              >
              </el-table-column>
            </el-table>
            <div class="table-foot">
              <span class="res"> {{ $t('views.apiList.response') }} </span>
              <span class="type">{{ item.return_type }}</span>
            </div>

            <SearchCard
              v-if="item.showSend"
              style="margin-top: 20px"
              :is-api="true"
              :info="{
                method_pools: {
                  url: item.path,
                  req_header_fs: item.req_header_fs,
                  req_data: item.req_data,
                  res_header: item.res_header,
                  res_body: item.res_body,
                },
                relations: { vulnerablities: [] },
              }"
            ></SearchCard>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '../../VueBase'
import SearchCard from '@/views/taint/searchCard.vue'
@Component({
  name: 'ApiList',
  components: {
    SearchCard,
  },
})
export default class Index extends VueBase {
  @Prop() versionId: number | undefined
  @Prop(String) projectId!: string
  private searchObj = {
    method: '',
    status: '',
    url: '',
  }
  private dataEnd = false
  private page_index = 1
  private pageSize = 20
  private coverRate = ''
  private tableData = [
    { name: 'name', parameter_type: 'java.lang.String', extra: '' },
    { name: 'name', parameter_type: 'java.lang.String', extra: '' },
  ]

  private apiList = []
  private getType(type: string) {
    switch (type) {
      case 'GET':
        return 'success'
      case 'POST':
        return ''
      case 'PUT':
        return 'warning'
      case 'DELETE':
        return 'danger'
      default:
        return 'success'
    }
  }
  private async startView(item: any) {
    if (item.showSend) {
      item.showSend = false
    }
    const res = await this.services.project.relationrequest({
      project_id: this.projectId,
      version_id: this.versionId,
      api_route_id: item.id,
    })
    if (res.status !== 201) {
      this.$message.error(res.msg)
    }
    item.req_header_fs = res.data.req_header_fs
    item.req_data = res.data.req_data
    item.res_body = res.data.res_body
    item.res_header = res.data.res_header

    if (res.status)
      this.$nextTick(() => {
        item.showSend = true
      })
  }
  private startSend(item: any) {
    if (item.showSend) {
      item.showSend = false
    }
    this.$nextTick(() => {
      item.showSend = true
    })
  }
  private async getApiList() {
    this.loadingStart()
    const ids = this.apiList.map((item: any) => {
      return item.id
    })
    const res = await this.services.project.searchApi({
      exclude_ids: String(ids),
      page_size: this.pageSize,
      page_index: this.page_index,
      uri: this.searchObj.url,
      http_method: this.searchObj.method,
      is_cover: this.searchObj.status,
      project_id: this.projectId,
      version_id: this.versionId,
    })
    this.loadingDone()
    if (res.status !== 201) {
      this.$message.error(res.msg)
    }
    const apiList = res.data.map((item: any) => {
      return {
        id: item.id,
        parameters: item.parameters,
        path: item.path,
        method: item.method.apimethod,
        httpMethod: item.method.httpmethods[0],
        description: item.description,
        is_cover: item.is_cover,
        return_type: item.responses[0].return_type,
        req_header_fs: `${item.method.httpmethods[0]} ${item.path} HTTP/1.1`,
        req_data: '',
        res_header: '',
        res_body: '',
        showSend: false,
      }
    })
    this.apiList = this.apiList.concat(apiList)
    if (apiList.length < this.pageSize) {
      this.dataEnd = true
    }
  }

  private searchChange() {
    // First filter the front-end to meet the conditions, and then request the back-end to prevent excessive pressure on the database
    this.apiList = this.apiList.filter(
      (item: any) =>
        item.method.indexOf(this.searchObj.method) > -1 &&
        item.path.indexOf(this.searchObj.url) > -1 &&
        (this.searchObj.status == '' || this.searchObj.status == undefined
          ? true
          : item.is_cover === this.searchObj.status)
    )
    this.page_index = 1
    this.dataEnd = false
    this.getApiList()
  }

  private async cover() {
    const res = await this.services.project.coverRate({
      project_id: this.projectId,
      version_id: this.versionId,
    })
    if (res.status !== 201) {
      this.$message.error(res.msg)
    }
    this.coverRate = res.data.cover_rate
  }

  mounted() {
    this.cover()
    this.pageSize = Math.ceil((document.body.clientHeight - 280) / 48)
    this.getApiList()
    window.addEventListener('scroll', this.myScroll)
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.myScroll)
  }

  private myScroll() {
    const bottomWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 1
    if (bottomWindow) {
      if (!this.dataEnd) {
        this.page_index += 1
        this.getApiList()
      }
    }
  }
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
      min-width: 70px;
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
