<template>
  <div class="language">
    <img
      :src="require(`@/assets/img/${language}.png`)"
      alt=""
      width="16px"
      height="16px"
    />
    <span>{{ language }}</span>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Language',
})
export default class Language extends VueBase {
  @Prop() language?: any
}
</script>

<style scoped lang="scss">
.language {
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
  }
}
</style>
