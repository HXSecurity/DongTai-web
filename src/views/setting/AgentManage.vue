<template>
  <div class="agent-content">
    <div class="agent-box">
      <div></div>
      <div class="tool-bar">
        <div class="state-tag-box">
          <div class="state-title">
            <span>Agent 安装状态</span>
            <el-select
              v-model="last_days"
              size="small"
              @change="getTableData(true)"
            >
              <el-option label="过去2天" :value="2"></el-option>
              <el-option label="过去7天" :value="7"></el-option>
              <el-option label="过去14天" :value="14"></el-option>
              <el-option label="过去30天" :value="30"></el-option>
              <el-option label="过去90天" :value="90"></el-option>
            </el-select>
          </div>
          <div class="state-card-box">
            <div
              class="all card"
              :class="state == 1 && 'active'"
              @click="changeState(1)"
            >
              <div class="left">
                <div class="dot"></div>
                <div class="label">全部</div>
              </div>
              <div class="number">{{ summary[1] }}</div>
            </div>
            <div
              class="runnig card"
              :class="state == 2 && 'active'"
              @click="changeState(2)"
            >
              <div class="left">
                <div class="dot"></div>
                <div class="label">运行中</div>
              </div>
              <div class="number">{{ summary[2] }}</div>
            </div>
            <div
              class="stop card"
              :class="state == 3 && 'active'"
              @click="changeState(3)"
            >
              <div class="left">
                <div class="dot"></div>
                <div class="label">暂停中</div>
              </div>
              <div class="number">{{ summary[3] }}</div>
            </div>
            <div
              class="unin card"
              :class="state == 4 && 'active'"
              @click="changeState(4)"
            >
              <div class="left">
                <div class="dot"></div>
                <div class="label">已离线</div>
              </div>
              <div class="number">{{ summary[4] }}</div>
            </div>
          </div>
        </div>
        <div class="agent-setting">
          <AgentSetting></AgentSetting>
        </div>
        <!-- <div class="selectForm">
          <div class="select-item">{{ $t('views.agentManage.state') }}：</div>
          <div
            v-for="item in stateOptions"
            :key="item.value"
            class="select-item"
            :class="item.value === state && 'active'"
            @click="changeState(item)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="tool-bar">
          <el-input
            v-model="searchValue"
            style="margin-left: 12px"
            size="small"
            :placeholder="$t('views.agentManage.searchValue')"
            @input="searchTable"
          ></el-input>
        </div> -->
      </div>
      <div class="table-big-box">
        <div class="button-bar">
          <div>
            <!-- <el-checkbox v-model="selectAll"></el-checkbox>
            <span style="margin: 0 12px 0 4px">全选</span> -->
            <el-button
              size="small"
              class="resetAllBtn"
              :disabled="!state"
              @click="agentStart(0)"
            >
              <div><i class="icon iconfont">&#xe6ab;</i> <span>启用</span></div>
            </el-button>
            <el-button
              size="small"
              class="resetAllBtn"
              :disabled="!state"
              @click="agentStop(0)"
            >
              <div><i class="icon iconfont">&#xe6ac;</i> <span>暂停</span></div>
            </el-button>
            <!-- <el-button
              size="small"
              class="resetAllBtn updateBtn"
              :disabled="!state || selectAll"
              @click="logExport"
            >
              <div>
                <i
                  class="icon iconfont"
                  style="font-size: 12px; overflow: inherit"
                  >&#xe6aa;</i
                >
                <span>导出日志</span>
              </div>
            </el-button> -->
            <!-- <el-button
              size="small"
              class="resetAllBtn updateBtn"
              :disabled="!state"
              @click="agentUpdate(0)"
            >
              <div>
                <i
                  class="icon iconfont"
                  style="font-size: 12px; overflow: inherit"
                  >&#xe6bc;</i
                >
                <span>批量升级</span>
              </div>
            </el-button> -->
            <!-- <el-button
              size="small"
              class="resetAllBtn exportBtn"
              @click="deleteAgents"
            >
              <div>
                <i class="icon iconfont">&#xe6aa;</i> <span>导出日志</span>
              </div>
            </el-button> -->
          </div>
          <div>
            <el-input
              v-model="searchValue"
              size="small"
              placeholder="请输入项目名"
              clearable
              @input="searchTable"
            ></el-input>
          </div>
        </div>
        <el-table
          ref="agentTable"
          :data="tableData"
          class="agentManageTable"
          header-align="center"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="agentSelectable"
          >
          </el-table-column>
          <el-table-column label="序号" prop="id" width="105">
          </el-table-column>
          <el-table-column
            label="UUID"
            prop="server__hostname"
            min-width="120px"
          >
            <template slot-scope="{ row }">
              <div class="dot project-name" @click="openDrawer(row)">
                {{ row.server__hostname || '未命名' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="事件记录" prop="events" min-width="120px">
            <template slot-scope="{ row }">
              <el-tooltip class="item" effect="dark" placement="top">
                <div class="dot">
                  {{ row.events && row.events[row.events.length - 1] }}
                </div>

                <div slot="content">
                  <div
                    v-for="item in row.new_events"
                    :key="item"
                    class="event-item"
                  >
                    {{ item.name }}{{ item.time && ':' }}
                    {{ item.time | formatTimestamp }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            width="150"
            label="关联项目"
            prop="bind_project__name"
          >
            <template slot-scope="{ row }">
              <div
                class="dot project-name"
                style="width: 140px"
                @click="toDetail(row.bind_project__id)"
              >
                {{ row.bind_project__name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="语言" prop="is_core_running" width="100px">
            <template slot-scope="{ row }">
              <div>
                <Language :language="row.language"></Language>
                <div class="version-row">
                  <i class="icon iconfont" style="color: #959fb4">&#xe6bd;</i>
                  <span>{{ row.version }}</span>
                  <el-tooltip
                    v-if="row.state !== 4 && row.language === 'JAVA'"
                    class="item"
                    effect="dark"
                    content="升级Agent"
                    placement="top"
                  >
                    <el-button
                      style="padding-top: 8px"
                      type="text"
                      @click="agentUpdate(row.id)"
                    >
                      <i class="icon iconfont">&#xe6bc;</i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="服务IP" width="180px">
            <template slot-scope="{ row }">
              <el-tooltip class="item" effect="dark" placement="top">
                <div class="dot">
                  {{
                    row.ipaddresses &&
                    row.ipaddresses[row.ipaddresses.length - 1]
                  }}
                </div>

                <div slot="content">
                  <div
                    v-for="item in row.ipaddresses"
                    :key="item"
                    class="event-item"
                  >
                    {{ item }}
                  </div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="资源" prop="server" width="230px">
            <template slot-scope="{ row }">
              <Resource
                :cpu_rate="row.cpu_rate"
                :disk_rate="row.disk_rate"
                :memory_rate="row.memory_rate"
              ></Resource>
            </template>
          </el-table-column>

          <el-table-column
            label="运行状态"
            prop="is_core_running"
            width="100px"
          >
            <template slot-scope="{ row }">
              <div>
                <Status :state="row.state"></Status>
              </div>
            </template>
          </el-table-column>
          <!-- 3   4 -->
          <el-table-column label="暂停/启用" width="140px">
            <template slot-scope="{ row }">
              <el-switch
                v-if="row.is_control === 0"
                v-model="row.state === 2 ? 1 : 0"
                :disabled="row.state === 4"
                :width="32"
                style="margin-right: 20px"
                :active-value="1"
                :inactive-value="0"
                @change="
                  (e) => {
                    changeCoreControl(row.id, e)
                  }
                "
              ></el-switch>
              <span
                v-else
                style="width: 52px; display: inline-block; padding-left: 10px"
              >
                <i class="el-icon-loading"></i>
              </span>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                content="下载日志"
                placement="top"
              >
                <el-button type="text" @click="exportAgent(row.id)">
                  <i class="icon iconfont">&#xe6aa;</i>
                </el-button>
              </el-tooltip> -->
            </template>
          </el-table-column>

          <!-- <el-table-column
            :label="$t('views.agentManage.manage')"
            width="280px"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <div class="table-btn-box">
                <template v-if="row.is_control === 1">
                  <el-button
                    style="color: #4a72ae; position: absolute; left: 0"
                    size="small"
                    type="text"
                    :class="!state && 'icon-disabled'"
                  >
                    <span class="el-text el-icon-loading"> </span>
                  </el-button>
                </template>
                <template>
                  <el-button
                    v-if="row.is_core_running == 0"
                    type="text"
                    size="small"
                    :disabled="row.is_control === 1"
                    style="color: #4a72ae"
                    @click="update(row.id, 3)"
                    ><span class="el-text">{{
                      $t('views.agentManage.startUp')
                    }}</span></el-button
                  >
                  <el-button
                    v-else
                    type="text"
                    size="small"
                    :disabled="row.is_control === 1"
                    style="color: #4a72ae"
                    @click="update(row.id, 4)"
                    ><span class="el-text">{{
                      $t('views.agentManage.suspend')
                    }}</span></el-button
                  >
                </template>

                <span class="l"> | </span>

                <el-button
                  v-if="row.is_core_running === 2"
                  type="text"
                  size="small"
                  style="color: #4a72ae"
                  :disabled="row.is_control === 1"
                  @click="update(row.id, 2)"
                >
                  <span class="el-text">{{
                    $t('views.agentManage.register')
                  }}</span></el-button
                >

                <el-button
                  v-if="row.is_core_running !== 2"
                  type="text"
                  size="small"
                  :disabled="row.is_control === 1"
                  style="color: #4a72ae"
                  @click="update(row.id, 5)"
                  ><span class="el-text">{{
                    $t('views.agentManage.uninstall')
                  }}</span></el-button
                >
                <span v-if="row.is_core_running !== 0" class="l"> | </span>

                <el-button
                  v-if="row.is_core_running !== 0"
                  type="text"
                  size="small"
                  :disabled="row.is_control === 1"
                  style="color: #4a72ae"
                  @click="update(row.id, 6)"
                  ><span class="el-text">{{
                    $t('views.agentManage.Demotion')
                  }}</span></el-button
                >
                <span v-if="row.is_core_running === 0" class="l"> | </span>

                <el-button
                  v-if="row.is_core_running === 0"
                  type="text"
                  size="small"
                  :disabled="row.is_control === 1"
                  style="color: #4a72ae"
                  @click="update(row.id, 7)"
                  ><span class="el-text">{{
                    $t('views.agentManage.recovery')
                  }}</span></el-button
                >
                <span class="l"> | </span>
                <el-button
                  type="text"
                  size="small"
                  style="color: #f56262"
                  @click="doDelete(row.id)"
                >
                  <span class="el-text">{{
                    $t('views.agentManage.delete')
                  }}</span>
                </el-button>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="bottom-box">
          <div style="color: rgb(56, 67, 90)">
            已选择
            <span style="color: rgb(74, 114, 174)">{{
              selectAll ? total : multipleSelection.length
            }}</span>
            项
          </div>
          <el-pagination
            style="float: right"
            :total="total"
            :current-page="page"
            :page-size="pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40, 50]"
            @current-change="currentChange"
            @size-change="sizeChange"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-drawer
      :visible.sync="drawer"
      show-close
      :with-header="false"
      custom-class="agent-drawer"
    >
      <div class="agent-drawer-title">
        {{ activeProject.server__hostname }}
      </div>
      <div class="agent-drawer-body">
        <div class="agent-drawer-body-item">
          <div class="label">关联项目</div>
          <div class="value">{{ activeProject.bind_project__name }}</div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">语言</div>
          <div class="value">
            <Language :language="activeProject.language"></Language>
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">服务IP</div>
          <div class="value">
            {{ `${activeProject.server__ip}:${activeProject.server__port}` }}
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">资源</div>
          <div class="value">
            <Resource
              :cpu_rate="activeProject.cpu_rate"
              :disk_rate="activeProject.disk_rate"
              :memory_rate="activeProject.memory_rate"
            ></Resource>
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">运行状态</div>
          <div class="value">
            <Status :state="activeProject.state"></Status>
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">安装时间</div>
          <div class="value">
            {{ activeProject.register_time | formatTimestamp }}
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">Agent 名称</div>
          <div class="value">
            {{ activeProject.alias || activeProject.token }}
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">路径</div>
          <div class="value">{{ activeProject.server__path }}</div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">负责人</div>
          <div class="value">
            {{ activeProject.bind_project__user__username }}
          </div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">漏洞数量</div>
          <div class="value">{{ activeProject.vul_count }}</div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">组件数量</div>
          <div class="value">{{ activeProject.sca_count }}</div>
        </div>
        <div class="agent-drawer-body-item">
          <div class="label">接口数量</div>
          <div class="value">{{ activeProject.api_count }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import { AgentListObj } from '@/views/setting/types'
import { formatTimestamp } from '@/utils/utils'
import AgentSetting from './components/agentSetting.vue'
import Status from './components/status.vue'
import Language from './components/language.vue'
import Resource from './components/resource.vue'

@Component({
  name: 'AgentManage',
  filters: {
    formatTimestamp(date: number | any) {
      if (!date) {
        return ''
      }
      return formatTimestamp(date)
    },
  },
  components: {
    AgentSetting,
    Status,
    Language,
    Resource,
  },
})
export default class AgentManage extends VueBase {
  private activeProject: any = {}
  private drawer = false

  private last_days = 2

  async openDrawer(row: AgentListObj) {
    const res = await this.services.setting.stat({
      id: row.id,
    })
    this.activeProject = row
    this.activeProject.api_count = res.data.api_count
    this.activeProject.sca_count = res.data.sca_count
    this.activeProject.vul_count = res.data.vul_count
    this.drawer = true
  }

  private toDetail(id: string) {
    this.$router.push(`/project/projectDetail/${id}`)
  }
  private summary = {}
  private tableData: Array<AgentListObj> = []
  private total = 0
  private page = 1
  private state = 1
  private pageSize = 10
  private currentPageSize = 0
  private currentPageDelete = 0
  private deleteDialogOpen = false
  private deleteSelectId = 0
  private stateOptions = [
    { value: 1, label: this.$t('views.agentManage.running') },
    { value: 0, label: this.$t('views.agentManage.not_running') },
  ]
  private searchValue = ''
  private multipleSelection: any = []
  private async update(id: any, type: any) {
    const res = await this.services.setting.update_core({
      id: id,
      core_status: type,
    })
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.getTableData(true)
      return
    }
    this.$message.error(res.msg)
  }

  private async updateAll(type: any) {
    const res = await this.services.setting.update_core_all({
      core_status: type,
    })
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.getTableData(true)
      return
    }
    this.$message.error(res.msg)
  }
  private async examine(row: any) {
    const res = await this.services.setting.audit({ id: row.id })
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.getTableData(true)
    } else {
      this.$message.error(res.msg)
    }
  }
  created() {
    this.getTableData(true)
    this.timer = setInterval(() => {
      // this.reflashTable()
      this.getTableData()
    }, 5000)
  }
  private timer: any
  private timeOuter: any
  private searchTable() {
    if (this.timeOuter) {
      clearTimeout(this.timeOuter)
      this.timeOuter = null
    }
    this.timeOuter = setTimeout(() => {
      this.getTableData(true)
    }, 400)
  }

  private exportAgent(id: any) {
    window.open('/api/v1/agent/log/' + id)
  }

  private openEdit(item: any) {
    item.isEdit = true
    item.backAlias = item.alias
  }

  private closeEdit(item: any) {
    item.isEdit = false
    item.alias = item.backAlias
  }

  get userInfo() {
    return this.$store.getters.userInfo
  }

  private async enterEdit(item: any) {
    const res = await this.services.setting.aliasModified({
      id: item.id,
      alias: item.alias,
    })
    if (res.status === 201) {
      this.$message.success(res.msg)
      item.isEdit = false
    } else {
      this.$message.error(res.msg)
    }
  }

  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  private beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
  private changeState(item: any) {
    this.state = item
    this.page = 1
    this.getTableData(true)
    clearInterval(this.timer)
    this.timer = null
    this.timer = setInterval(() => {
      // this.reflashTable()
      this.getTableData()
    }, 5000)
  }
  private currentChange(val: number | string) {
    this.page = parseInt(`${val}`)
    this.getTableData(true)
  }

  private sizeChange(val: number | string) {
    this.pageSize = parseInt(`${val}`)
    this.getTableData(true)
  }

  // private async reflashTable() {
  //   if (this.tableData.some((item: any) => item.isEdit)) {
  //     return
  //   }
  //   const params = {
  //     page: this.page,
  //     page_size: this.pageSize,
  //     state: this.state,
  //   }
  //   const { status, msg, data } = await this.services.setting.agentList(params)
  //   if (status !== 201) {
  //     this.$message({
  //       type: 'error',
  //       message: msg,
  //       showClose: true,
  //     })
  //     return
  //   }
  //   const dataMap = {}
  //   data.agents &&
  //     data.agents.forEach((item: any) => {
  //       return (dataMap[item.id] = item)
  //     })
  //   this.tableData.forEach((item: any) => {
  //     for (const key in item) {
  //       item[key] = dataMap[item.id][key]
  //     }
  //     try {
  //       item.system_load = JSON.parse(item.system_load)
  //     } catch (err) {
  //       item.system_load = { rate: 0 }
  //     }
  //   })
  //   this.getSummy()
  // }

  private agentSelectable(row: any) {
    return row.state !== 4
  }

  private async getTableData(showLoading = false) {
    const multipleSelectionID = this.multipleSelection.map(
      (item: any) => item.id
    )
    const params = {
      page: this.page,
      page_size: this.pageSize,
      state: this.state,
      last_days: this.last_days,
      project_name: this.searchValue,
    }
    if (showLoading) {
      this.loadingStart()
    }
    const { status, msg, data, page } = await this.services.setting.agentList(
      params
    )
    if (showLoading) {
      this.loadingDone()
    }
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    if (data.agents && data.agents.length === 0 && this.page > 1) {
      this.page--
      await this.getTableData(true)
      return
    }
    this.tableData = data.agents
    // this.tableData.forEach((item: any) => {
    //   this.$set(item, 'isEdit', false)
    //   this.$set(item, 'backAlias', '')
    //   try {
    //     item.system_load = JSON.parse(item.system_load)
    //   } catch (err) {
    //     item.system_load = { rate: 0 }
    //   }
    // })
    this.currentPageSize = data.length
    this.total = data.summary.alltotal
    this.currentPageDelete = 0
    this.getSummy()
    this.tableData.filter((item: any) => {
      return multipleSelectionID.some((m: any) => {
        if (item.id === m) {
          this.$nextTick(() => {
            const tab: any = this.$refs.agentTable
            tab.toggleRowSelection(item, true)
          })
        }
      })
    })
  }

  private async getSummy() {
    const res = await this.services.setting.summary()
    if (res.status !== 201) {
      this.$message.error(res.msg)
      return
    }
    this.summary = res.data
  }

  private async agentInstall(id: string | number) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentInstall({
      id: parseInt(`${id}`),
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    await this.getTableData()
  }

  private async deleteAgents() {
    if (this.multipleSelection.length === 0) {
      this.$message.warning(
        this.$t('views.agentManage.selectWarning') as string
      )
      return
    }
    this.$confirm(
      this.$t('views.agentManage.delAgentInfo') as string,
      this.$t('views.agentManage.delAgentPop') as string,
      {
        confirmButtonText: this.$t(
          'views.agentManage.confirmButtonText'
        ) as string,
        cancelButtonText: this.$t(
          'views.agentManage.cancelButtonText'
        ) as string,
        type: 'warning',
      }
    ).then(async () => {
      this.loadingStart()
      const params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
      const { status, msg } = await this.services.setting.deleteAgents(params)
      this.loadingDone()
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
        return
      }
      this.$message({
        type: 'success',
        message: msg,
        showClose: true,
      })
      await this.getTableData()
    })
  }

  private async agentStart(id: any) {
    if (this.selectAll) {
      this.updateAll(3)
      return
    }
    if (!this.state) {
      return
    }
    if (id === 0) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('views.agentManage.selectWarning') as string
        )
        return
      }
    }
    this.loadingStart()
    let params = {}
    if (id) {
      params = { id: parseInt(id) }
    } else {
      params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
    }
    const { status, msg } = await this.services.setting.agentStart(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
    await this.getTableData()
  }

  private async logExport() {
    if (this.selectAll) {
      return
    }
    if (!this.state) {
      return
    }
    if (this.multipleSelection.length === 0) {
      this.$message.warning(
        this.$t('views.agentManage.selectWarning') as string
      )
      return
    }
    const params = {
      ids: this.multipleSelection.map((item: any) => parseInt(item.id)),
    }
    const { status, msg } = await this.services.setting.log_export_batch({
      ids: params.ids,
      mode: 1,
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: '导出日志中，请留意通知信息',
      showClose: true,
    })
  }

  private async agentUpdate(id: any) {
    if (this.selectAll) {
      this.updateAll(8)
      return
    }
    if (!this.state) {
      return
    }
    if (id === 0) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('views.agentManage.selectWarning') as string
        )
        return
      }
    }
    this.loadingStart()
    let params: any = {}
    if (id) {
      params = { id: parseInt(id) }
    } else {
      params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
    }
    const { status, msg } = await this.services.setting.update_core({
      id: params.id,
      agent_ids: params.ids,
      core_status: 8,
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
    await this.getTableData()
  }

  private selectAll = false

  private async agentStop(id: any) {
    if (this.selectAll) {
      this.updateAll(4)
      return
    }
    if (!this.state) {
      return
    }
    if (id === 0) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(
          this.$t('views.agentManage.selectWarning') as string
        )
        return
      }
    }
    this.loadingStart()
    let params: any
    if (id) {
      params = { id: parseInt(id) }
    } else {
      params = {
        ids: String(
          this.multipleSelection.map((item: any) => parseInt(item.id))
        ),
      }
    }
    const { status, msg } = await this.services.setting.agentStop(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.$message({
      type: 'success',
      message: msg,
      showClose: true,
    })
    await this.getTableData()
  }

  private async agentUninstall(id: string | number) {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentUninstall({
      id: parseInt(`${id}`),
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    await this.getTableData()
  }

  private async doDelete(id: string | number) {
    this.$confirm(
      this.$t('views.strategyManage.deleteWarning') as string,
      this.$t('views.strategyManage.deletePop') as string,
      {
        confirmButtonText: this.$t('views.strategyManage.enter') as string,
        cancelButtonText: this.$t('views.strategyManage.clear') as string,
        type: 'warning',
      }
    ).then(async () => {
      const { status, msg } = await this.services.setting.agentDelete({
        id: Number(id),
      })
      if (status !== 201) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
        })
        return
      }
      this.$message({ type: 'success', message: msg, showClose: true })

      this.currentPageDelete = this.currentPageDelete + 1
      if (this.currentPageDelete === this.currentPageSize) {
        this.page = this.page - 1
      }
      await this.getTableData()
      this.deleteSelectId = 0
    })
  }

  private async agentDelete() {
    this.loadingStart()
    const { status, msg } = await this.services.setting.agentDelete({
      id: this.deleteSelectId,
    })
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
  }

  async changeCoreControl(id: any, e: any) {
    let type = 3
    switch (e) {
      case 1:
        type = 3
        break
      case 0:
        type = 4
        break
    }
    await this.update(id, type)
    // this.reflashTable()
    this.getTableData()
  }
}
</script>

<style scoped lang="scss">
.tool-bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  align-items: center;
  .state-tag-box {
    flex: 3;
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .state-title {
      display: flex;
      justify-content: space-between;
      color: #38435a;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .state-card-box {
      display: flex;
      .card {
        cursor: pointer;
        flex: 1;
        & + .card {
          margin-left: 16px;
        }

        &.all {
          &.active {
            background: #1a80f2;
            .left {
              .dot {
                background: #fff;
              }
              .label {
                color: #fff;
              }
            }
            .number {
              color: #fff;
            }
          }
          background: #e8f2fe;
          .left {
            .dot {
              background: #1a80f2;
            }
            .label {
              color: #38435a;
            }
          }
          .number {
            color: #1a80f2;
          }
        }

        &.runnig {
          &.active {
            background: #51cb74;
            .left {
              .dot {
                background: #fff;
              }
              .label {
                color: #fff;
              }
            }
            .number {
              color: #fff;
            }
          }
          background: #eefaf1;
          .left {
            .dot {
              background: #51cb74;
            }
            .label {
              color: #38435a;
            }
          }
          .number {
            color: #51cb74;
          }
        }

        &.stop {
          &.active {
            background: #4a72ae;
            .left {
              .dot {
                background: #fff;
              }
              .label {
                color: #fff;
              }
            }
            .number {
              color: #fff;
            }
          }
          background: #edf1f7;
          .left {
            .dot {
              background: #4a72ae;
            }
            .label {
              color: #38435a;
            }
          }
          .number {
            color: #4a72ae;
          }
        }

        &.unin {
          &.active {
            background: #b6bbc5;
            .left {
              .dot {
                background: #fff;
              }
              .label {
                color: #fff;
              }
            }
            .number {
              color: #fff;
            }
          }
          background: #f7f7f9;
          .left {
            .dot {
              background: #b6bbc5;
            }
            .label {
              color: #38435a;
            }
          }
          .number {
            color: #b6bbc5;
          }
        }

        background: #ccc;
        border-radius: 4px;
        height: 40px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .dot {
            width: 6px;
            height: 6px;
            background: red;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
        .number {
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }
  .agent-setting {
    flex: 1;
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    margin-left: 16px;
    height: 110px;
  }
}
.button-bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  align-items: center;
}
.selectForm {
  display: flex;
  padding: 0 10px 16px;
  .select-item {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-align: center;
    line-height: 28px;
    cursor: context-menu;
  }
  .select-item + .select-item {
    color: #959fb4;
    cursor: pointer;
    margin-left: 12px;
    width: 80px;
    height: 28px;
    border-radius: 28px;
  }
  .select-item.active {
    color: #4a72ae;
    background: aliceblue;
  }
}

.agent-content {
  padding: 16px 14px 40px 14px;
  display: flex;
  justify-content: center;
  .agent-box {
    width: 1200px;
  }
}

.dot {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.project-name {
  color: #1a80f2;
  cursor: pointer;
}

.install {
  cursor: pointer;
  color: #a7afb9;
}

.uninstall {
  cursor: pointer;
  color: #a7afb9;
  margin-left: 18px;
}
.resetAllBtn {
  padding: 8px 16px;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
  border: none;
  &.updateBtn {
    background: #f2f3f5;
    border-radius: 2px;
    color: #38435a;
    &:hover {
      background: #e5e6eb;
      color: #38435a;
    }
    &.is-disabled {
      background: #f2f3f5;
    }
  }
  div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .icon {
    font-size: 14px;
    margin-right: 8px;
  }
  &:hover {
    background: #1a80f2;
    color: #fff;
    border-radius: 2px;
  }
  &.exportBtn {
    background: #f2f3f5;
    color: #38435a;
    border-radius: 2px;
    border-color: #f2f3f5;
    width: 108px;
    &:hover {
      background: #e5e6eb;
      color: #38435a;
      border-radius: 2px;
    }
  }
}
.icon-disabled {
  cursor: not-allowed;
}

.edit-icon {
  margin-left: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #4a72ae;
  &.el-icon-close {
    color: red;
  }
}
.edit-agent {
  position: relative;
  .alias-num {
    position: absolute;
    display: inline-block;
    width: 60px;
    right: 42px;
    top: 9px;
    color: #959fb4;
  }
  ::v-deep.el-input__inner {
    background: #e6f8ea;
    border: none;
    padding: 0;
    padding-right: 60px;
  }
}

.agentManageTable {
  &.el-table {
    ::v-deepth {
      background: #f2f3f5;
      .cell {
        color: #38435a;
        .el-checkbox {
          margin-left: 4px;
        }
      }
    }
  }
}

.table-btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .el-button {
    box-sizing: border-box;
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

.bottom-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-big-box {
  background: #fff;
  padding: 16px;
}
</style>

<style lang="scss">
.agent-drawer {
  padding: 24px;
  &-title {
    padding-bottom: 16px;
    font-weight: 600px;
    box-shadow: inset 0px -1px 0px rgba(230, 233, 236, 0.5);
  }
  &-body {
    padding-top: 10px;
    &-item {
      display: flex;
      margin-bottom: 14px;
      .label {
        width: 94px;
        color: #acb4c4;
      }
      .value {
        flex: 1;
        color: #38435a;
      }
    }
  }
}
.event-item + .event-item {
  margin-top: 4px;
}
.version-row {
  display: flex;
  align-items: center;
  height: 32px;
  .icon {
    font-size: 12px;
    line-height: 100%;
  }
  > span {
    margin: 0 4px;
    color: #959fb4;
    line-height: 12px;
    font-size: 12px;
  }
}
</style>
