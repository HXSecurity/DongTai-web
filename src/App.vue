<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class App extends Vue {
  name = 'App'
}
</script>

<style scoped>
#app {
  background: #f9fafb;
}
</style>
