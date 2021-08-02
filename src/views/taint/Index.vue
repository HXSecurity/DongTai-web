<template>
  <main class="container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </main>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'TaintIndex' })
export default class Index extends VueBase {}
</script>

<style scoped lang="scss">
.policy-select {
  margin-bottom: 10px;

  > div {
    margin-left: 0;
  }
}

.search-params {
  border: 1px solid #d6ddec;
  border-radius: 4px;
  background: #fff;
  margin: 10px 0;
  padding: 10px;
  max-height: 23vh;
  overflow-y: auto;

  .paramsBtn {
    width: 60px;
  }
}

.search-btn-list {
  display: flex;
  justify-content: center;

  .btn {
    width: 100px;
  }
}

.saveBtn {
  width: 200px;
}
</style>
