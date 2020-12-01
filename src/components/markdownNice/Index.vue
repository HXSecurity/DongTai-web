<template>
  <div
    id="nice"
    ref="markdown"
  />
</template>

<script>
import { markdownParser } from './myMarkdownIt'
import './theme.css'
import './codeStyle.css'

export default {
  name: "MyMarkdownIt",
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // this.initData()
    this.$refs.markdown.innerHTML = markdownParser.render(this.content)
  },
  // methods: {
  //   // initData () {
  //   // }
  // }
}
</script>

<style scoped>

</style>
