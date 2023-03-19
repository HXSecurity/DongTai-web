<template>
  <div class="url">
    <div class="top">
      <div class="title">
        {{ url.url }}
      </div>
      <div class="btn">
        <span>
          <i class="el-icon-delete-solid" @click="deleteHeaderVul"></i>
        </span>
        <span v-if="show" @click="show = !show">
          <span>
            <i class="el-icon-caret-top"></i>
          </span>
        </span>
        <span v-else @click="show = !show">
          <span>
            <i class="el-icon-caret-bottom"></i>
          </span>
        </span>
      </div>
    </div>
    <div v-show="show" class="bottom">
      <div class="selectForm">
        <div>
          <div
            v-for="item in httpOptions"
            :key="item.value"
            class="select-item"
            :class="item.value === state && 'active'"
            @click="state = item.value"
          >
            {{ item.label }}
          </div>
        </div>

        <div class="replay-box">
          <!-- <div class="replay-btn" @click="goToPoolDetail">
            <i class="iconfont icon" style="margin-right: 4px; font-size: 12px"
              >&#xe6b3;</i
            >请求重放
          </div> -->
          <el-select
            v-model="requsetIndex"
            class="request-select"
            size="small"
            @change="changeRequest"
          >
            <el-option
              v-for="(request, key) in url.details"
              :key="key"
              :value="key"
              :label="request.agent_name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div v-show="state === 1" class="markdownContent httpRequest">
        <MyMarkdownIt :content="req_md" style="color: #747c8c"></MyMarkdownIt>
      </div>
      <div v-show="state === 0" class="markdownContent httpRequest">
        <MyMarkdownIt :content="res_md" style="color: #747c8c"></MyMarkdownIt>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component } from 'vue-property-decorator'
import VueBase from '@/VueBase'
import emitter from '@/views/taint/Emitter'

@Component({ name: 'UrlComponent' })
export default class LinkList extends VueBase {
  @Prop() url: any

  private state = 1
  private httpOptions = [
    { value: 1, label: '请求' },
    { value: 0, label: '响应' },
  ]

  private requsetIndex = 0
  private req_md = ''
  private res_md = ''

  private changeRequest(e: any) {
    this.requsetIndex = e
    this.req_md = this.url.details[e].req_header.split(`\n`).join('<br/>')
    this.res_md = this.url.details[e].res_header.split(`\n`).join('<br/>')
  }

  private show = false

  private async deleteHeaderVul() {
    this.$confirm('确定删除该URL吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const res = await this.services.vuln.deleteHeaderVul(this.url.id)
        if (res.status === 201) {
          this.$message.success('删除成功')
          emitter.emit('getUrls')
        } else {
          this.$message.error('删除失败')
        }
      })
      .catch(() => {
        return false
      })
  }

  created() {
    this.req_md = this.url.details[this.requsetIndex].req_header
      .split(`\n`)
      .join('<br/>')
    this.res_md = this.url.details[this.requsetIndex].res_header
      .split(`\n`)
      .join('<br/>')
  }
}
</script>

<style scoped lang="scss">
.url {
  .top {
    padding: 12px 8px;
    border-top: 1px solid #e6e9ec;
    display: flex;
    justify-content: space-between;
    .btn {
      span {
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
  .bottom {
    .selectForm {
      display: flex;
      padding: 16px 0 0 0;
      justify-content: space-between;
      .select-item {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        color: #959fb4;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        width: 60px;
        height: 32px;
        border-radius: 32px;
      }
      .select-item.active {
        color: #1a80f2;
        background: #f6f8fa;
      }
      .request-select {
        width: 364px;
      }
    }
    .markdownContent {
      height: 196px;
      overflow-y: auto;
      margin-top: 16px;
      padding: 6px;
      /* 分隔线 */
      border: 1px solid #e6e9ec;
      border-radius: 2px;
      background: #fff;
      ::v-deep(tt) {
        color: red !important;
        font-style: normal !important;
      }
    }
  }
}
</style>
