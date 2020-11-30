<template>
  <div>
    <Header class="layoutHeader"/>
    <router-view class="layoutMain"></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './Header.vue'
@Component({
  name: 'layoutIndex',
  components: {
    Header
  }
})
export default class Index extends Vue {

}
</script>

<style scoped lang='scss'>

.layoutHeader{
   position: sticky;
   top: 0;
   width: 100%;
}

.layoutMain{
  // margin-top: 64px;
  min-height: calc(100vh - 64px);
}

</style>
