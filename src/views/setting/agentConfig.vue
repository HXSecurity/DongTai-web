<template>
  <main>
    <el-page-header class="header" @back="goBack"></el-page-header>
    <div>
      <el-form :model="json" inline label-width="160px">
        <el-form-item label="高级模式:">
          <el-switch v-model="senior"></el-switch>
        </el-form-item>
        <el-form-item label="开启自动降级:">
          <el-switch v-model="json.details.enableAutoFallback"></el-switch>
        </el-form-item>
        <template v-if="!senior">
          <div class="title">筛选标签:</div>
          <el-form-item label="集群名称:">
            <el-input v-model="json.cluster_name"></el-input>
          </el-form-item>
          <el-form-item label="集群版本:">
            <el-input v-model="json.cluster_version"></el-input>
          </el-form-item>
          <el-form-item label="权重:">
            <el-input v-model="json.priority"></el-input>
          </el-form-item>
          <el-form-item label="hostname:">
            <el-input v-model="json.hostname"></el-input>
          </el-form-item>
          <el-form-item label="ip:">
            <el-input v-model="json.ip"></el-input>
          </el-form-item>
          <el-form-item label="port:">
            <el-input v-model="json.port"></el-input>
          </el-form-item>
          <div class="title">单请求hook限流:</div>
          <el-form-item label="QPS(每秒令牌数):">
            <el-input v-model="json.details.hookLimitTokenPerSecond"></el-input>
          </el-form-item>
          <div class="title">高频流量限流:</div>
          <el-form-item label="QPS(每秒令牌数):">
            <el-input
              v-model="json.details.heavyTrafficLimitTokenPerSecond"
            ></el-input>
          </el-form-item>
          <div class="title">JVM CPU 最大阈值:</div>
          <el-form-item label="CPU使用率最大阈值:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.cpuUsage
                  .cpuUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM CPU 风险阈值:</div>
          <el-form-item label="CPU使用率风险阈值:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.cpuUsage
                  .cpuUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM 内存最大阈值:</div>
          <el-form-item label="内存使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM 内存风险阈值:</div>
          <el-form-item label="内存使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="senior">
          <div class="title">筛选标签:</div>
          <el-form-item label="集群名称:">
            <el-input v-model="json.cluster_name"></el-input>
          </el-form-item>
          <el-form-item label="集群版本:">
            <el-input v-model="json.cluster_version"></el-input>
          </el-form-item>
          <el-form-item label="权重:">
            <el-input v-model="json.priority"></el-input>
          </el-form-item>
          <el-form-item label="hostname:">
            <el-input v-model="json.hostname"></el-input>
          </el-form-item>
          <el-form-item label="ip:">
            <el-input v-model="json.ip"></el-input>
          </el-form-item>
          <el-form-item label="port:">
            <el-input v-model="json.port"></el-input>
          </el-form-item>
          <div class="title">
            单请求hook限流:
            <el-tooltip
              class="item"
              effect="dark"
              content="限制单个请求内每秒hook数量，初始令牌数 = QPS * 初始预放置令牌时间。"
              placement="right"
            >
              <span class="el-icon-question"></span>
            </el-tooltip>
          </div>
          <el-form-item label="QPS:">
            <el-input v-model="json.details.hookLimitTokenPerSecond"></el-input>
          </el-form-item>
          <el-form-item label="初始预放置令牌时间:">
            <el-input
              v-model="json.details.hookLimitInitBurstSeconds"
            ></el-input>
          </el-form-item>
          <div class="title">
            高频流量限流:<el-tooltip
              class="item"
              effect="dark"
              placement="right"
            >
              <span class="el-icon-question"></span>
              <div slot="content">
                <div>每秒限制处理请求数量</div>
                <div>QPS：每秒获得令牌数，每秒允许处理的请求数</div>
                <div>
                  初始预放置令牌时间：首次启动时，按“初始预放置令牌时间” *
                  QPS准备令牌数。
                </div>
                <div>自动恢复时间：被限流后，重新恢复正常检测的时间`</div>
              </div>
            </el-tooltip>
          </div>
          <el-form-item label="QPS:">
            <el-input
              v-model="json.details.heavyTrafficLimitTokenPerSecond"
            ></el-input>
          </el-form-item>
          <el-form-item label="初始预放置令牌时间:">
            <el-input
              v-model="json.details.heavyTrafficLimitInitBurstSeconds"
            ></el-input>
          </el-form-item>
          <el-form-item label="自动恢复时间:">
            <el-input
              v-model="json.details.heavyTrafficBreakerWaitDuration"
            ></el-input>
          </el-form-item>
          <div class="title">
            JVM CPU最大阈值:<el-tooltip
              class="item"
              effect="dark"
              content="JVM CPU使用率到达指定条件后开始降级"
              placement="right"
            >
              <span class="el-icon-question"></span>
            </el-tooltip>
          </div>
          <el-form-item label="CPU使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.cpuUsage
                  .cpuUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM CPU风险阈值:</div>
          <el-form-item label="CPU使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.cpuUsage
                  .cpuUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <div class="title">
            JVM 内存最大阈值:<el-tooltip
              class="item"
              effect="dark"
              content="JVM 内存使用到达指定条件后开始降级"
              placement="right"
            >
              <span class="el-icon-question"></span>
            </el-tooltip>
          </div>
          <el-form-item label="内存使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="已用内存（MB）:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryUsage.used
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM 内存风险阈值:</div>
          <el-form-item label="内存使用率阈值:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="已用内存（MB）:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryUsage.used
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM 堆外内存最大阈值:</div>
          <el-form-item label="内存使用率百分比:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryNoHeapUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="已用内存:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryNoHeapUsage.used
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="最大内存:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.memoryNoHeapUsage.max
              "
            ></el-input>
          </el-form-item>
          <div class="title">JVM 堆外内存风险阈值:</div>
          <el-form-item label="内存使用率百分比:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryNoHeapUsage
                  .memUsagePercentage
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="已用内存:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryNoHeapUsage
                  .used
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="最大内存:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.memoryNoHeapUsage.max
              "
            ></el-input>
          </el-form-item>
          <div class="title title-btn">
            垃圾回收最大阈值:
            <el-button
              class="add-btn"
              size="small"
              @click="
                add(
                  json.details.performanceLimitMaxThreshold.garbageInfo
                    .collectionInfoList
                )
              "
              >增 加</el-button
            >
          </div>
          <div
            v-for="(item, index) in json.details.performanceLimitMaxThreshold
              .garbageInfo.collectionInfoList"
            :key="index"
            class="form-box"
          >
            <el-button
              class="form-box-cut"
              size="small"
              @click="
                cut(
                  json.details.performanceLimitMaxThreshold.garbageInfo
                    .collectionInfoList,
                  index
                )
              "
            >
              <span class="el-icon-close"></span>
            </el-button>
            <el-form-item label="收集器名称:">
              <el-input v-model="item.collectionName"></el-input>
            </el-form-item>
            <el-form-item label="收集次数:">
              <el-input v-model="item.collectionCount"></el-input>
            </el-form-item>
            <el-form-item label="收集时间:">
              <el-input v-model="item.collectionTime"></el-input>
            </el-form-item>
            <el-form-item label="是否是老年代收集器:">
              <el-radio v-model="item.tenured" :label="true">是</el-radio>
              <el-radio v-model="item.tenured" :label="false">否</el-radio>
            </el-form-item>
          </div>
          <div class="title title-btn">
            垃圾回收风险阈值:
            <el-button
              class="add-btn"
              size="small"
              @click="
                add(
                  json.details.performanceLimitRiskThreshold.garbageInfo
                    .collectionInfoList
                )
              "
              >增加</el-button
            >
          </div>
          <div
            v-for="(item, index) in json.details.performanceLimitRiskThreshold
              .garbageInfo.collectionInfoList"
            :key="index"
            class="form-box"
          >
            <el-button
              class="form-box-cut"
              size="small"
              @click="
                cut(
                  json.details.performanceLimitRiskThreshold.garbageInfo
                    .collectionInfoList,
                  index
                )
              "
            >
              <span class="el-icon-close"></span
            ></el-button>
            <el-form-item label="收集器名称:">
              <el-input v-model="item.collectionName"></el-input>
            </el-form-item>
            <el-form-item label="收集次数:">
              <el-input v-model="item.collectionCount"></el-input>
            </el-form-item>
            <el-form-item label="收集时间:">
              <el-input v-model="item.collectionTime"></el-input>
            </el-form-item>
            <el-form-item label="是否是老年代收集器:">
              <el-radio v-model="item.tenured" :label="true">是</el-radio>
              <el-radio v-model="item.tenured" :label="false">否</el-radio>
            </el-form-item>
          </div>
          <div class="title">线程信息最大阈值配置:</div>
          <el-form-item label="当前线程数:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.threadInfo.threadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="峰值线程数:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.threadInfo
                  .peakThreadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="守护线程数:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.threadInfo
                  .daemonThreadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="洞态IAST线程数:">
            <el-input
              v-model="
                json.details.performanceLimitMaxThreshold.threadInfo
                  .dongTaiThreadCount
              "
            ></el-input>
          </el-form-item>
          <div class="title">线程信息风险阈值配置:</div>
          <el-form-item label="当前线程数:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.threadInfo
                  .threadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="峰值线程数:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.threadInfo
                  .peakThreadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="守护线程数:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.threadInfo
                  .daemonThreadCount
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="洞态IAST线程数:">
            <el-input
              v-model="
                json.details.performanceLimitRiskThreshold.threadInfo
                  .dongTaiThreadCount
              "
            ></el-input>
          </el-form-item>
          <div class="title">二次降级:</div>
          <el-form-item label="每秒获得令牌数:">
            <el-input
              v-model="json.details.secondFallbackFrequencyTokenPerSecond"
            ></el-input>
          </el-form-item>
          <el-form-item label="初始预放置令牌时间:">
            <el-input
              v-model="json.details.secondFallbackFrequencyInitBurstSeconds"
            ></el-input>
          </el-form-item>
          <el-form-item label="打开状态持续最大时间:">
            <el-input v-model="json.details.secondFallbackDuration"></el-input>
          </el-form-item>
          <div class="title">性能熔断:</div>

          <el-form-item label="失败率阈值:">
            <el-input
              v-model="json.details.performanceBreakerFailureRate"
            ></el-input>
          </el-form-item>
          <el-form-item label="不允许超过风险阈值的指标数量:">
            <el-input
              v-model="json.details.performanceLimitRiskMaxMetricsCount"
            ></el-input>
          </el-form-item>
          <el-form-item label="自动恢复时间:">
            <el-input
              v-model="json.details.performanceBreakerWaitDuration"
            ></el-input>
          </el-form-item>
          <el-form-item label="统计窗口大小:">
            <el-input
              v-model="json.details.performanceBreakerWindowSize"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-box">
        <el-button class="submit btn" size="mini" @click="save">
          确定
        </el-button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueJsonEditor from 'vue-json-editor'
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'AgentConfig', components: { VueJsonEditor } })
export default class AgentConfig extends VueBase {
  async goBack() {
    this.$router.push({ name: 'sysInfo' })
  }
  private senior = true
  private json: any = {
    cluster_name: '',
    cluster_version: '',
    hostname: '',
    id: 0,
    ip: '',
    port: 443,
    priority: 0,
    user: 0,
    details: {
      enableAutoFallback: true,
      heavyTrafficBreakerWaitDuration: 0,
      heavyTrafficLimitInitBurstSeconds: 0,
      heavyTrafficLimitTokenPerSecond: 0,
      hookLimitInitBurstSeconds: 0,
      hookLimitTokenPerSecond: 0,
      performanceBreakerFailureRate: 0,
      performanceBreakerWaitDuration: 0,
      performanceBreakerWindowSize: 0,
      performanceLimitRiskMaxMetricsCount: 0,
      secondFallbackDuration: 0,
      secondFallbackFrequencyInitBurstSeconds: 0,
      secondFallbackFrequencyTokenPerSecond: 0,
      performanceLimitMaxThreshold: {
        cpuUsage: {
          cpuUsagePercentage: 0,
        },
        garbageInfo: {
          collectionInfoList: [
            {
              collectionCount: 0,
              collectionName: '',
              collectionTime: 0,
              tenured: null,
            },
          ],
        },
        memoryNoHeapUsage: {
          max: null,
          init: null,
          used: 0,
          committed: null,
          memUsagePercentage: null,
        },
        memoryUsage: {
          max: null,
          init: null,
          used: null,
          committed: null,
          memUsagePercentage: 0,
        },
        threadInfo: {
          threadCount: null,
          peakThreadCount: null,
          daemonThreadCount: null,
          dongTaiThreadCount: 0,
        },
      },
      performanceLimitRiskThreshold: {
        cpuUsage: { cpuUsagePercentage: 0 },
        garbageInfo: {
          collectionInfoList: [
            {
              tenured: true,
              collectionName: null,
              collectionTime: 0,
              collectionCount: 0,
            },
          ],
        },
        memoryNoHeapUsage: {
          max: null,
          init: null,
          used: 0,
          committed: null,
          memUsagePercentage: null,
        },
        memoryUsage: {
          max: null,
          init: null,
          used: null,
          committed: null,
          memUsagePercentage: 0,
        },
        threadInfo: {
          threadCount: null,
          peakThreadCount: null,
          daemonThreadCount: null,
          dongTaiThreadCount: 0,
        },
        secondFallbackDuration: 0,
        secondFallbackFrequencyInitBurstSeconds: 0,
        secondFallbackFrequencyTokenPerSecond: 0,
      },
    },
  }
  private cut(arr: any, index: any) {
    if (arr.length === 1) {
      this.$message.error('至少保留一个')
      return
    }
    return arr.splice(index, 1)
  }
  private add(arr: any) {
    arr.push({
      tenured: true,
      collectionName: null,
      collectionTime: 0,
      collectionCount: 0,
    })
  }
  private async save() {
    const res = await this.services.setting.save_threshold(this.json)
    if (res.status === 201) {
      this.$message.success(res.msg)
      return
    }
    this.$message.error(res.msg)
  }
  private async get_threshold_byid() {
    if (this.$route.query.id) {
      const res = await this.services.setting.get_threshold_byid(
        this.$route.query.id
      )
      if (res.status === 201) {
        this.json = res.data.result
      }
    }
  }
  async created() {
    this.get_threshold_byid()
  }
}
</script>

<style lang="scss">
main {
  padding: 20px;
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .title-btn {
    display: flex;
    justify-content: space-between;
  }
  .btn-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .submit {
    width: 124px;
    height: 38px;
    line-height: 0;
    background: #4a72ae;
    border-radius: 2px;
    color: #fff;
  }

  .submit:hover {
    width: 124px;
    height: 38px;
    line-height: 0;
    background: #4a72ae;
    border-radius: 2px;
    color: #fff;
  }

  .form-box {
    & + .form-box {
      border-top: 1px solid #ccc;
      padding-top: 12px;
    }
    position: relative;
    &-cut {
      right: 0;
      position: absolute;
    }
  }
}
</style>
