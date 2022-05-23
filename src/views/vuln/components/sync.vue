<template>
  <div class="sync">
    <div class="integration">
      <el-tooltip class="item" effect="dark" content="删除" placement="top">
        <div class="checkedAllBtn" @click="deleteVuln">
          <i class="icon iconfont">&#xe6ae;</i>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import VueBase from '@/VueBase'

@Component({ name: 'VulnList' })
export default class VulnList extends VueBase {
  @Prop() item: any
  @Prop() getTableData: any
  @Prop() source_type: any

  private toPathName(name: any) {
    this.$router.push({
      name: name,
    })
  }

  async deleteVuln() {
    this.$confirm(
      '该操作将会删除选中漏洞',
      this.$t('views.vulnList.recheckInfo') as string,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      const res = await this.services.vuln.vulListDelete({
        source_type: this.source_type,
        ids: String(this.item.id),
      })

      if (res.status !== 201) {
        this.$message({
          type: 'error',
          message: res.msg,
          showClose: true,
        })
      } else {
        this.$message({
          type: 'success',
          message: res.msg,
          showClose: true,
        })
      }
      this.getTableData(true)
    })
  }
}
</script>

<style scoped lang="scss">
.integration {
  display: flex;
  position: absolute;
  right: 6px;
  top: 0px;
  z-index: 3;
  .el-dropdown {
    padding: 0;
    .checkedAllBtn {
      margin-left: 0;
    }
  }
}
.update-box {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
  color: #38435a;
  width: 120px;
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &:hover {
    color: #1a80f2;
    background: #f6f8fa;
  }
  img {
    width: 16px;
    margin-right: 8px;
  }
}

.checkedAllBtn {
  width: 32px;
  height: 32px;
  background: #f2f3f5;
  border-radius: 2px;
  border: none;
  color: #4a72ae;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    color: #1a80f2;
  }
  i {
    line-height: 16px;
  }
}

.setting-box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 300px;
  .img-box {
    cursor: pointer;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: #f6f8fa;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .setting-title {
    cursor: pointer;
    font-size: 14px;
    color: #1a80f2;
  }
  img {
    width: 54px;
    height: 54px;
  }
}
</style>
