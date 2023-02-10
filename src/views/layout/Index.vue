<template>
  <div>
    <Header class="layoutHeader" @reload="reload" />
    <keep-alive :exclude="$store.getters.vulnRouteInfo">
      <router-view
        v-if="$route.meta.keepAlive && flag"
        class="layoutMain"
      ></router-view>
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive && flag"
      class="layoutMain"
    ></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './Header.vue'
@Component({
  name: 'layoutIndex',
  components: {
    Header,
  },
})
export default class Index extends Vue {
  private flag = true
  private reload() {
    this.flag = false
    this.$nextTick(() => {
      this.flag = true
    })
  }
}
</script>

<style scoped lang="scss">
.layoutHeader {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
}

.layoutMain {
  min-height: calc(100vh - 64px);
  overflow: auto;
}
</style>
