<template>
  <div class="search container">
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
      <div class="search-card">
        <div class="card-row">
          <div>策略</div>
          <div>url</div>
          <div>agent</div>
        </div>
        i
        <div class="card-row">
          <div style="flex: 2; margin-right: 60px">
            <div></div>
          </div>
          <div style="display: flex">
            <span class="search-card-label">组件:</span>
            <el-input type="textarea"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="select-pagination">
      <el-pagination background layout="prev, pager, next" :total="1000">
      </el-pagination>
    </div>
  </div>
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
} from './types/search'

@Component({ name: 'Search' })
export default class Search extends VueBase {
  policies: policy[] = []
  criteriaOptionS: criteriaOption[] = [
    { label: 'AND', value: 'and' },
    { label: 'OR', value: 'or' },
  ]
  nodeTypeOptionS: nodeTypeOption[] = [
    { label: '1', value: '节点1' },
    { label: '2', value: '节点2' },
  ]
  selectOptionS: selectOption[] = [
    { label: '1', value: '选项1' },
    { label: '2', value: '选项2' },
  ]
  paramsList: params[] = [{ criteria: '', nodeType: '', select: '', info: '' }]

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

  created() {
    for (let key = 0; key < 5; key++) {
      this.policies.push({
        name: 'test' + key,
        info: 'testInfo' + key,
      })
    }
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
    .card-row {
      > div {
        margin: 10px 20px;
        flex: 1;
      }

      display: flex;
      justify-content: space-between;
    }
  }
}

.select-pagination {
  display: flex;
  flex-direction: row-reverse;
}

.search-card-label {
  display: inline-block;
  width: 40px;
}
</style>
