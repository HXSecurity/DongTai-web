<template>
  <main class="container"></main>
</template>

<script lang="ts">
import VueBase from '../../VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'ProjectDetail' })
export default class ProjectDetail extends VueBase {
  created() {
    this.projectsSummary()
  }
  private async projectsSummary() {
    const { status, msg, data } = await this.services.project.projectsSummary(
      this.$route.params.pid
    )
  }
}
</script>

<style scoped></style>
