<template>
  <main>
    login: {{ login }}
  </main>
</template>

<script lang="ts">

import { Vue } from 'vue-property-decorator'

export default class Login extends Vue {
  login= '123'
}
</script>

<style scoped>

</style>
