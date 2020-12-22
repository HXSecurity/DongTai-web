<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
@Component({ name: 'UserIndex' })
export default class UserIndex extends VueBase {}
</script>

<style scoped lang="scss"></style>
