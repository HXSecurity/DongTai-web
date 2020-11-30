<template>
  <header class="header">
    <div class="container flex-row-space-between header-warp">
      <div class="logo flex-column-center">
        IAST
      </div>
      <div class="flex-column-center">
        <el-button type="text">登录</el-button>
        {{userInfo}}
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'layoutHeader'
})
export default class Header extends Vue {
  created () {
    // console.log(mapGetters)
    console.log(this.$store)
  }

  get userInfo () {
    return this.$store.getters.userInfo
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 64px;
  background: #fff;

  .header-warp{
    height: 100%;

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #12171F;
      line-height: 36px;
    }
  }

}
</style>
