<template>
  <main>
    <div class="moudleTitle">{{ $t('views.sysInfo.infoTitle') }}</div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="全局配置" name="global"></el-tab-pane>
      <el-tab-pane label="熔断降级" name="agent"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName === 'agent'">
      <div class="agent-btn-box">
        <el-button size="mini" type="primary" class="btn" @click="add">
          新增
        </el-button>
      </div>
      <el-table :data="jsons">
        <el-table-column prop="id" label="ID" width="60"> </el-table-column>
        <el-table-column prop="ip" label="ip" width="120"> </el-table-column>
        <el-table-column prop="port" label="端口"> </el-table-column>
        <el-table-column prop="hostname" label="主机名"> </el-table-column>
        <el-table-column prop="priority" label="优先级"> </el-table-column>
        <el-table-column prop="cluster_name" width="200" label="集群名称">
        </el-table-column>
        <el-table-column prop="cluster_version" label="集群版本">
        </el-table-column>
        <el-table-column width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="btn del-btn"
              @click="edit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="primary"
              class="btn del-btn"
              @click="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="activeName === 'global'" class="form-box">
      <div class="cpu-box">
        <div class="moudleTitle-th">
          {{ $t('views.sysInfo.agentThreshold') }}
          <el-popover placement="top-start" width="340" trigger="hover">
            <p>{{ $t('views.sysInfo.open') }}</p>
            <p>{{ $t('views.sysInfo.close') }}</p>
            <span slot="reference"> <i class="el-icon-question"></i>： </span>
          </el-popover>
        </div>
        <span style="margin-right: 16px">{{ $t('views.sysInfo.cpu') }} ≥ </span>
        <el-input-number
          v-if="userInfo.role == 1 || userInfo.role == 2"
          v-model="form.cpu_limit"
          :max="100"
          :min="0"
          :controls="false"
          style="margin-right: 12px"
          class="num-input"
        ></el-input-number>
        <span v-else>{{ form.cpu_limit }}</span>
        <span> %</span>
      </div>

      <div class="cpu-box">
        <div class="moudleTitle-th">
          {{ $t('views.sysInfo.vul_verifiy') }}
          <el-popover placement="top-start" width="340" trigger="hover">
            <p>{{ $t('views.sysInfo.vul') }}</p>
            <span slot="reference"> <i class="el-icon-question"></i>： </span>
          </el-popover>
        </div>
        <el-switch
          v-model="form.vul_verifiy"
          :disabled="userInfo.role !== 1 && userInfo.role !== 2"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </div>
      <div class="btn-box">
        <el-button
          v-if="userInfo.role === 1 || userInfo.role === 2"
          class="btn"
          type="primary"
          @click="profileModified"
          >{{ $t('views.sysInfo.enter') }}</el-button
        >
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
@Component({ name: 'SysInfo' })
export default class SysInfo extends VueBase {
  public activeName = 'global'
  public form = {
    cpu_limit: '',
    vul_verifiy: 0,
  }
  onSubmit() {
    console.log('确定')
  }

  get userInfo() {
    return this.$store.getters.userInfo
  }
  async getInfo() {
    const keys = []
    for (let key in this.form) {
      keys.push(key)
    }
    const res = await this.services.setting.profileGet({
      keys,
    })
    if (res.status === 201) {
      res.data.forEach((item: any) => {
        this.form[item.key] = item.value
      })
    } else {
      this.$message.error(res.msg)
    }
  }

  async profileModified() {
    const data = []
    for (let key in this.form) {
      data.push({
        value: String(this.form[key]),
        key,
      })
    }
    const res = await this.services.setting.profileModified(data)
    if (res.status === 201) {
      this.$message.success(res.msg)
    } else {
      this.$message.error(res.msg)
    }
  }

  private jsons: any = []
  private async get_threshold() {
    const res = await this.services.setting.get_threshold()
    if (res.status === 201) {
      this.jsons = res.data.result
    }
  }

  private async edit(row: any) {
    this.$router.push({ name: 'agentConfig', query: { id: row.id } })
  }

  private async del(row: any) {
    this.$confirm(this.$t('views.agentConfig.confirmDel') as string, '', {
      confirmButtonText: this.$t('views.agentConfig.confirm') as string,
      cancelButtonText: this.$t('views.agentConfig.cancel') as string,
      type: 'warning',
    }).then(async () => {
      const res = await this.services.setting.del_threshold({ id: row.id })
      if (res.status === 201) {
        this.$message.success(res.msg)
        this.get_threshold()
        return
      }
      this.$message.error(res.msg)
    })
  }
  add() {
    this.$router.push({ name: 'agentConfig' })
  }
  async created() {
    this.get_threshold()
    this.getInfo()
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}
.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 64px;
}
.moudleTitle {
  margin-top: 12px;
  font-size: 16px;
  color: #38435a;
  font-weight: 600;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e9ec;
}
.moudleTitle-th {
  width: 160px;
  font-size: 16px;
  display: flex;
}

.btn-box {
  display: flex;
  justify-content: center;
  .btn {
    height: 36px;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 0;
    background: #4a72ae;
    border-color: #4a72ae;
    border-radius: 2px;
    margin-right: 20px;
    margin-top: 20px;
    background: #4a72ae;
  }
}

.cpu-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 470px;
  .num-input {
    width: 120px;
    /deep/.el-input__inner {
      border-radius: 2px;
    }
  }
}

.form {
  width: 470px;
}

.el-icon-question {
  cursor: pointer;
}

.cpu-box + .cpu-box {
  margin-top: 20px;
}
</style>
