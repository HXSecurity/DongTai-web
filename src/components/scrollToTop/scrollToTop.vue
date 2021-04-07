<template>
  <div class="back-top" @click="scrollToTop">UP</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ name: 'scrollToTop' })
export default class ScrollToTop extends Vue {
  private scrollToTop(){
    // document.documentElement.scrollTop = 0
    //
    // document.body.scrollIntoView()
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    })
  }
}

</script>

<style scoped>
  .back-top{
    display:inline-block;
    position: fixed;
    bottom: 60px;
    right: 60px;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    z-index: 9999;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0,0,0, .12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
</style>
