<template>
  <main>
    <VueJsonEditor
      v-model="json"
      style="height: calc(100vh - 200px)"
      :mode="'code'"
    ></VueJsonEditor>
    <el-button size="mini" type="primary" class="btn" @click="save">
      保存
    </el-button>
  </main>
</template>

<script lang="ts">
import VueJsonEditor from 'vue-json-editor'
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'AgentConfig', components: { VueJsonEditor } })
export default class AgentConfig extends VueBase {
  private json = {}
  private async get_threshold() {
    const res = await this.services.setting.get_threshold()
    if (res.status === 201) {
      this.json = res.data
    }
  }
  private async save() {
    const res = await this.services.setting.save_threshold(this.json)
    if (res.status === 201) {
      this.$message.success(res.msg)
      return
    }
    this.$message.error(res.msg)
  }
  async created() {
    const res = await this.get_threshold()
  }
}
</script>

<style lang="scss">
main {
  padding: 10px;
  .jsoneditor-vue {
    height: 100%;
  }
  .btn {
    background: #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
  }
  .btn:hover {
    background: #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
  }
  .btn:active {
    background: #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
  }
  .btn:focus {
    background: #4a72ae;
    border-color: #4a72ae;
    background: #4a72ae;
  }
  .jsoneditor-poweredBy {
    display: none;
  }
}
</style>
