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
        <el-tooltip class="item" effect="dark" placement="top">
          <div slot="content">已覆盖测试 API 数量: {{ coverCount }}<br/><br/>全部 API 数量: {{ totalCount }}</div>
          <span> {{ `(${coverCount}/${totalCount})` }} </span>
        </el-tooltip>
      </div>
    </div>
    <div class="infoList">
      <el-collapse v-model="openCollapse">
        <el-collapse-item
          v-for="(item, key) in apiList"
          :key="item.id"
          :name="key"
          :style="{ borderColor: getColor(item.method).borderColor }"
        >
          <template slot="title">
            <div
              class="collapse-title"
              :style="{ backgroundColor: getColor(item.method).bgColor }"
            >
              <el-tag :class="getType(item.method)" class="tag" effect="dark">
                {{ item.method }}
              </el-tag>
              <span class="title-api-path">
                {{ item.path }}
              </span>
              <span>
                <span class="title-api-info"> {{ item.description }} </span>
                <i
                  v-if="item.is_cover"
                  class="el-icon-success"
                  style="color: #65d6a6; margin-right: 16px"
                ></i>
              </span>

              <el-tag
                v-for="(vuln, index) in item.vulnerablities"
                :key="index"
                class="danger-tag"
                size="small"
                :style="
                  vuln.level_id === 1
                    ? { background: '#EA7171', borderColor: '#EA7171' }
                    : vuln.level_id === 2
                    ? { background: '#F39D0A', borderColor: '#F39D0A' }
                    : vuln.level_id === 3
                    ? { background: '#2E8FE9', borderColor: '#2E8FE9' }
                    : vuln.level_id === 4
                    ? { background: '#7BC1AB', borderColor: '#7BC1AB' }
                    : { background: '#EA7171', borderColor: '#EA7171' }
                "
              >
                {{ vuln.hook_type_name }}
              </el-tag>
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
                <el-button v-else size="small" @click="startSend(item)">
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
                <template slot-scope="scope">
                  <el-tooltip
                    effect="light"
                    :content="scope.row.parameter_type"
                    placement="top"
                  >
                    <span>
                      {{ scope.row.parameter_type_shortcut }}
                    </span>
                  </el-tooltip>
                </template>
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
              <el-tooltip
                class="item"
                effect="light"
                :content="item.return_type"
                placement="top"
              >
                <span>
                  {{ item.return_type_shortcut }}
                </span>
              </el-tooltip>
            </div>

            <SearchCard
              v-if="item.showSend"
              style="margin-top: 20px"
              :is-api="true"
              :info="{
                method_pools: {
                  id: item.poolId,
                  url: item.url || item.path,
                  req_header_fs: item.req_header_fs,
                  req_data: item.req_data,
                  res_header: item.res_header,
                  res_body: item.res_body,
                  update_time: item.update_time,
                },
                relations: { agent: item.agent, vulnerablities: [] },
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
  private totalCount = ''
  private coverCount = ''
  private openCollapse = [0]
  private apiList = []
  private getColor(type: string) {
    switch (type) {
      case 'GET':
        return { borderColor: '#61affe', bgColor: 'rgba(97,175,254,.1)' }
      case 'POST':
        return { borderColor: '#49cc90', bgColor: 'rgba(73,204,144,.1)' }
      case 'PUT':
        return { borderColor: '#fca130', bgColor: 'rgba(252,161,48,.1)' }
      case 'DELETE':
        return { borderColor: '#f93e3e', bgColor: 'rgba(249,62,62,.1)' }
      default:
        return { borderColor: '#909399', bgColor: '#EBEEF5' }
    }
  }
  private getType(type: string) {
    switch (type) {
      case 'GET':
        return 'iast-tag-get'
      case 'POST':
        return 'iast-tag-post'
      case 'PUT':
        return 'iast-tag-put'
      case 'DELETE':
        return 'iast-tag-delete'
      default:
        return 'iast-tag-other'
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
    item.url = res.data.url
    item.poolId = res.data.id
    item.req_header_fs = res.data.req_header_fs
    item.req_data = res.data.req_data
    item.res_body = res.data.res_body
    item.res_header = res.data.res_header
    item.update_time = res.data.update_time
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
        agent: item.agent,
        poolId: -1,
        parameters: item.parameters,
        path: item.path,
        vulnerablities: item.vulnerablities,
        method: item.method.apimethod,
        httpMethod: item.method.httpmethods[0],
        description: item.description,
        is_cover: item.is_cover,
        return_type: item.responses[0] && item.responses[0].return_type,
        return_type_shortcut:
          item.responses[0] && item.responses[0].return_type_shortcut,
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
        (this.searchObj.status === '' || this.searchObj.status === undefined
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
    this.totalCount = res.data.total_count
    this.coverCount = res.data.covered_count
  }

  async mounted() {
    this.cover()
    this.pageSize = Math.ceil((document.body.clientHeight - 280) / 48)
    await this.getApiList()
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

<style lang="scss">
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
    flex: 1;
    padding: 0 12px;
    ::v-deep.el-tag--dark {
      min-width: 70px;
      text-align: center;
    }
    .title-api-path {
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      max-width: 700px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
    .danger-tag {
      font-weight: 600;
      color: #fff;
      margin-left: 6px;
    }
  }
  .el-collapse-item__arrow {
    position: absolute;
    right: 0;
    font-size: 16px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0);
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
  .tag {
    text-align: center;
    min-width: 110px;
    font-weight: 600;
  }
  .iast-tag-get {
    border: none;
    background: #61affe;
  }
  .iast-tag-post {
    border: none;
    background: #49cc90;
  }
  .iast-tag-put {
    border: none;
    background: #fca130;
  }
  .iast-tag-delete {
    border: none;
    background: #f93e3e;
  }
  .iast-tag-other {
    border: none;
    background: #909399;
  }
  .el-collapse-item {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 6px;
    overflow: hidden;
  }
  .el-collapse-item__header {
    border-bottom: none;
  }
  .el-collapse-item__content {
    padding-left: 6px;
    padding-top: 6px;
    padding-right: 6px;
  }
}
</style>
