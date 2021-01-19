<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
@Component({ name: 'DepartmentIndex' })
export default class DepartmentIndex extends VueBase {}
</script>

<style scoped lang="scss"></style>
