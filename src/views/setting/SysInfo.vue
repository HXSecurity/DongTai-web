<template>
  <main>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="$t('views.sysInfo.global')"
        name="global"
      ></el-tab-pane>
      <el-tab-pane :label="$t('views.sysInfo.fuse')" name="agent"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName === 'agent'">
      <div class="agent-btn-box">
        <el-button
          class="btn-border"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click="add"
        >
          {{ $t('views.sysInfo.add') }}
        </el-button>
      </div>
      <el-table :data="jsons" class="info-table" border>
        <el-table-column prop="id" label="ID" width="60"> </el-table-column>
        <el-table-column label="自动降级" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.enableAutoFallback ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cluster_name"
          width="200"
          :label="$t('views.sysInfo.cluster_name')"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="cluster_version"
          :label="$t('views.sysInfo.cluster_version')"
        >
        </el-table-column>
        <el-table-column
          prop="priority"
          :label="$t('views.sysInfo.priority')"
          align="center"
        >
        </el-table-column>
        <el-table-column label="高频hook限流" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.hookLimitTokenPerSecond }}/秒
          </template>
        </el-table-column>
        <el-table-column label="高频流量限流" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.heavyTrafficLimitTokenPerSecond }}/秒
          </template>
        </el-table-column>
        <el-table-column label="CPU阈值" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.cpuUsagePercentage }}%
          </template>
        </el-table-column>
        <el-table-column label="内存阈值" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.memUsagePercentage }}%
          </template>
        </el-table-column>
        <el-table-column label="Agent数量" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.memUsagePercentage }}
          </template>
        </el-table-column>

        <el-table-column
          width="200"
          :label="$t('views.sysInfo.operation')"
          align="center"
        >
          <template slot-scope="scope">
            <div class="table-btn-box">
              <el-button
                type="text"
                size="small"
                style="color: #4a72ae"
                @click="edit(scope.row)"
              >
                {{ $t('views.sysInfo.edit') }}
              </el-button>
              <span class="l"> | </span>
              <el-button
                style="color: #f56262"
                size="small"
                type="text"
                @click="del(scope.row)"
              >
                {{ $t('views.sysInfo.del') }}
              </el-button>
            </div>
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
  async activated() {
    this.get_threshold()
    this.getInfo()
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
}
.btn-border {
  border-radius: 2px;
  color: #4a72ae;
  border-color: #4a72ae;
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

.table-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button {
    font-size: 14px;
  }
  .l {
    color: #38435a;
    line-height: 14px;
    padding: 4px 4px 8px 4px;
    display: inline-block;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}

.info-table {
  margin-top: 16px;
  &.el-table {
    /deep/th {
      background: #f6f8fa;
    }
  }
}
</style>
