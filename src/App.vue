<template>
  <div id="app">
    <router-view />
    <el-button class="service" icon="el-icon-service" circle @click="toService">
    </el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'App',
})
export default class App extends Vue {
  toService() {
    const userId = this.$store.getters.userInfo
      ? this.$store.getters.userInfo.userid
      : ''
    const route: any = this.$route
    const pageName = this.$t(route.meta.i18n)
    const customerInfo = pageName + ',' + userId
    window.open(
      'https://support.qq.com/product/371942?customInfo=' + customerInfo
    )
  }
}
</script>

<style scoped>
#app {
  background: #f4f4f4;
}
.service {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}
</style>
