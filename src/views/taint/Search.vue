<template>
  <main class="container">
    <div class="policy-select">
      <el-select
        v-model="value"
        popper-class="search-select"
        :placeholder="$t('views.search.defPolicy')"
      >
        <el-option
          v-for="item in policies"
          :key="item.name"
          :label="item.info"
          :value="item.name"
        >
          <div class="select-title">
            {{ item.name }}
          </div>
          <div class="select-info">{{ item.info }}</div>
        </el-option>
      </el-select>
      <el-select
        v-model="value"
        popper-class="search-select"
        :placeholder="$t('views.search.myPolicy')"
      >
        <el-option
          v-for="item in policies"
          :key="item.name"
          :label="item.info"
          :value="item.name"
        >
          <div class="select-title">
            {{ item.name }}
          </div>
          <div class="select-info">{{ item.info }}</div>
        </el-option>
      </el-select>
    </div>
    <div class="search-params">
      <div
        v-for="(form, index) in paramsList"
        :key="index"
        class="search-params-item"
      >
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item v-if="index === 0" label="查询条件"></el-form-item>
          <el-form-item v-else>
            <el-select v-model="form.criteria" placeholder="查询条件">
              <el-option
                v-for="item in criteriaOptionS"
                :key="item.value"
                :label="item.label"
                value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.nodeType" placeholder="选择节点类型">
              <el-option
                v-for="item in nodeTypeOptionS"
                :key="item.value"
                :label="item.label"
                value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.select">
              <el-option
                v-for="item in selectOptionS"
                :key="item.value"
                :label="item.label"
                value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.info"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add">+</el-button>
            <el-button type="primary" @click="del(form)">-</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="search-btn-list">
      <el-button type="primary">保存</el-button>
      <el-button>搜索</el-button>
    </div>
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
              <div class="line" v-for="(line,lineIndex) in item.dependencies" :key="lineIndex">
                {{ line.package_name }}&nbsp;存在&nbsp;{{line.vul_count}}&nbsp;个漏洞
              </div>
            </div>
          </div>
          <div>
            <label>组件：</label>
            <div class="list-box">
              <div class="line" v-for="(line,lineIndex) in item.dependencies" :key="lineIndex">
                {{ line.package_name }}&nbsp;存在&nbsp;{{line.vul_count}}&nbsp;个漏洞
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
import {
  policy,
  params,
  criteriaOption,
  nodeTypeOption,
  selectOption,
  dataObj
} from './types/search'
import { formatTimestamp } from '@/utils/utils'

@Component({ name: 'Search' })
export default class Search extends VueBase {
  private tableData: Array<dataObj> = []
  private policies: policy[] = []
  private criteriaOptionS: criteriaOption[] = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' }
  ]
  private nodeTypeOptionS: nodeTypeOption[] = [
    { label: '1', value: '节点1' },
    { label: '2', value: '节点2' }
  ]
  private selectOptionS: selectOption[] = [
    { label: '1', value: '选项1' },
    { label: '2', value: '选项2' }
  ]
  paramsList: params[] = [{ criteria: '', nodeType: '', select: '', info: '' }]

  created() {
    this.getTableData()
    for (let key = 0; key < 5; key++) {
      this.policies.push({
        name: 'test' + key,
        info: 'testInfo' + key
      })
    }
  }

  add(): void {
    this.paramsList.push({ criteria: '', nodeType: '', select: '', info: '' })
  }

  del(i: params): void {
    this.paramsList[0].criteria = ''
    this.paramsList.some((item, index) => {
      if (item == i) {
        this.paramsList.splice(index, 1)
        return false
      }
    })
  }

  private async getTableData() {
    const params = {}
    this.loadingStart()
    const { status, data, msg } = await this.services.taint.methodPoolSearch(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.tableData = data.reduce((list: dataObj[], item: dataObj) => {
      list.push({
        ...item,
        update_time: formatTimestamp(item.update_time)
      })
      return list
    }, [])
  }
}
</script>

<style lang="scss">
.search-select {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: normal;

    .select-title {
      border-top: 1px solid #ccc;
    }

    .select-info {
      margin-top: 6px;
    }
  }
}
</style>

<style lang="scss" scoped>
main {
  padding: 10px 0 80px;
}

.policy-select {
  > div {
    margin-left: 20px;
  }
}

.search-btn-list {
  display: flex;
  justify-content: center;
}

.search-card-list {
  .search-card {
    border: 1px solid #bfd1e3;
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
        margin: 10px 20px 0;
        flex: 1;
        font-size: 14px;
        color: #2a303d;
        word-break: break-all;
      }

      .list-box {
        width: 550px;
        margin-top: 10px;
        border: 1px solid #c9cfe0;
        border-radius: 4px;
        overflow: auto;
        height: 100px;

        .line{
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
