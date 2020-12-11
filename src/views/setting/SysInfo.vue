<template>
  <main>
    <div class="moudleTitle">授权信息</div>
    <div class="labelTitle">lincense</div>
    <div class="content">XXXXXXXXXXX</div>
    <div class="labelTitle">授权时间</div>
    <div class="content">XXXXXXXXXXX</div>
    <div class="labelTitle">服务到期</div>
    <div class="content">XXXXXXXXXXX</div>
    <div class="labelTitle">客户名称</div>
    <div class="content">XXXXXXXXXXX</div>
    <div class="moudleTitle" style="margin-top: 20px">系统配额</div>
    <div class="labelTitle">系统版本</div>
    <div class="labelTitle">检测引擎版本</div>
    <div class="labelTitle">运行时长</div>
    <div class="labelTitle">CPU使用率</div>
    <div class="labelTitle">内存使用率</div>
    <div class="labelTitle">硬盘使用率</div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'SysInfo' })
export default class SysInfo extends VueBase {}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}
.moudleTitle {
  margin-top: 12px;
  font-size: 16px;
  color: #38435a;
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e9ec;
}

.labelTitle {
  margin-top: 24px;
  font-size: 14px;
  color: #959fb4;
}

.content {
  margin-top: 18px;
  font-size: 14px;
  color: #38435a;
  line-height: 21px;
}
</style>
