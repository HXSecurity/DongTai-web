<template>
  <div>
    <Header/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './Header.vue'
import Footer from './Footer.vue'
@Component({
  name: 'layoutIndex',
  components: {
    Header,
    Footer
  }
})
export default class Index extends Vue {

}
</script>

<style scoped>

</style>
