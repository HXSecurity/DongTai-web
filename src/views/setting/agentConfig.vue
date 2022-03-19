<template>
  <main>
    <div v-for="(item, index) in jsons" :key="index" class="json-box">
      <el-button
        size="mini"
        type="primary"
        class="btn save-btn"
        @click="save(item.json)"
      >
        保存
      </el-button>

      <VueJsonEditor
        v-model="item.json"
        style="height: calc(100vh - 200px); margin-top: 20px"
        :mode="'code'"
      ></VueJsonEditor>
    </div>

    <div class="agent-btn-box">
      <el-button size="mini" type="primary" class="btn" @click="add">
        新增
      </el-button>
    </div>
  </main>
</template>

<script lang="ts">
import VueJsonEditor from 'vue-json-editor'
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'AgentConfig', components: { VueJsonEditor } })
export default class AgentConfig extends VueBase {
  private jsons: any = []
  private async get_threshold() {
    const res = await this.services.setting.get_threshold()
    if (res.status === 201) {
      res.data.result.forEach((item: any) => {
        this.jsons.push({ json: item })
      })
    }
  }
  private add() {
    this.jsons.push({ json: {} })
  }
  private async save(json: any) {
    const res = await this.services.setting.save_threshold(json)
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
  .agent-btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
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
  .json-box {
    position: relative;
    .save-btn {
      right: 12px;
      top: 4px;
      position: absolute;
      z-index: 4;
    }
  }
}
</style>
