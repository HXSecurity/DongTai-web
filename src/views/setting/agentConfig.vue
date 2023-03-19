<template>
  <main class="agent-config-main">
    <div class="agent-config-box">
      <el-page-header class="header" @back="goBack"></el-page-header>
      <div>
        <el-form :model="json" inline label-width="160px" class="config-form">
          <el-form-item :label="$t('views.agentConfigEdit.pattern')">
            <el-switch v-model="senior"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('views.agentConfigEdit.open')">
            <el-switch v-model="json.details.enableAutoFallback"></el-switch>
          </el-form-item>
          <template v-if="!senior">
            <div class="title">{{ $t('views.agentConfigEdit.tag') }}</div>
            <el-form-item :label="$t('views.agentConfigEdit.cluster_name')">
              <el-input v-model="json.cluster_name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.cluster_version')">
              <el-input v-model="json.cluster_version"></el-input>
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.priority')">
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
              {{ $t('views.agentConfigEdit.hook_one') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.hook_one_desc_small')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item
              :label="`QPS(${$t('views.agentConfigEdit.secTag')}):`"
            >
              <el-input
                v-model="json.details.hookLimitTokenPerSecond"
              ></el-input
              >{{ $t('views.agentConfigEdit.times') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.flow') }}
              <el-tooltip class="item" effect="dark" placement="right">
                <span class="el-icon-question"></span>
                <div slot="content">
                  <div>{{ $t('views.agentConfigEdit.flow_sec') }}</div>
                </div>
              </el-tooltip>
            </div>
            <el-form-item
              :label="`QPS(${$t('views.agentConfigEdit.secTag')}):`"
            >
              <el-input
                v-model="json.details.heavyTrafficLimitTokenPerSecond"
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.maxCpu') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.maxCpuDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.maxCpuLabel')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.cpuUsage
                    .cpuUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitCpu') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitCpuDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.limitCpuLable')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.cpuUsage
                    .cpuUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.maxMemoryJVM') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.maxMemoryJVMDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.maxMemoryLabel')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitMemory') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitMemoryDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.maxMemoryLabel')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
          </template>
          <template v-if="senior">
            <div class="title">{{ $t('views.agentConfigEdit.tag') }}</div>
            <el-form-item :label="$t('views.agentConfigEdit.cluster_name')">
              <el-input v-model="json.cluster_name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.cluster_version')">
              <el-input v-model="json.cluster_version"></el-input>
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.priority')">
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
              {{ $t('views.agentConfigEdit.hook_one') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.hook_one_desc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item label="QPS:">
              <el-input
                v-model="json.details.hookLimitTokenPerSecond"
              ></el-input
              >{{ $t('views.agentConfigEdit.times') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.tagTime')">
              <el-input
                v-model="json.details.hookLimitInitBurstSeconds"
              ></el-input>
              {{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.flow') }}
              <el-tooltip class="item" effect="dark" placement="right">
                <span class="el-icon-question"></span>
                <div slot="content">
                  <div>{{ $t('views.agentConfigEdit.flow_sec') }}</div>
                  <div>{{ $t('views.agentConfigEdit.qpsDesc1') }}</div>
                  <div>
                    {{ $t('views.agentConfigEdit.qpsDesc2') }}
                  </div>
                  <div>{{ $t('views.agentConfigEdit.qpsDesc3') }}</div>
                </div>
              </el-tooltip>
            </div>
            <el-form-item label="QPS:">
              <el-input
                v-model="json.details.heavyTrafficLimitTokenPerSecond"
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.tagTime')">
              <el-input
                v-model="json.details.heavyTrafficLimitInitBurstSeconds"
              ></el-input
              >{{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.restoreTime')">
              <el-input
                v-model="json.details.heavyTrafficBreakerWaitDuration"
              ></el-input>
              {{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.maxCpu')
              }}<el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.maxCpuDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.cpuRate')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.cpuUsage
                    .cpuUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitCpu') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitCpuDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.cpuRate')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.cpuUsage
                    .cpuUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.maxMemoryJVM')
              }}<el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.maxMemoryJVMDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.maxMemoryLabel')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <el-form-item :label="`${$t('views.agentConfigEdit.userMemory')}`">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryUsage.used
                "
              ></el-input
              >字节
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitMemory') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitMemoryDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.limitMemoryLabel')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <el-form-item :label="`${$t('views.agentConfigEdit.userMemory')}`">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryUsage.used
                "
              ></el-input
              >字节
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitMemoryMaxOut') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitMemoryMaxOutDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.memoryRate')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryNoHeapUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.userMemory')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryNoHeapUsage
                    .used
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.byte') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.maxMemory')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.memoryNoHeapUsage
                    .max
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.byte') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.limitMemoryLimitOut') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.limitMemoryLimitOutDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.memoryRate')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryNoHeapUsage
                    .memUsagePercentage
                "
              ></el-input
              >%
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.userMemory')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryNoHeapUsage
                    .used
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.byte') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.maxMemory')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.memoryNoHeapUsage
                    .max
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.byte') }}
            </el-form-item>
            <div class="title title-btn">
              <span>
                {{ $t('views.agentConfigEdit.gcMax') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('views.agentConfigEdit.gcMaxDesc')"
                  placement="right"
                >
                  <span class="el-icon-question"></span>
                </el-tooltip>
              </span>
              <el-button
                class="add-btn"
                size="small"
                @click="
                  add(
                    json.details.performanceLimitMaxThreshold.garbageInfo
                      .collectionInfoList
                  )
                "
              >
                {{ $t('views.agentConfigEdit.add') }}</el-button
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
              <el-form-item :label="$t('views.agentConfigEdit.collectorName')">
                <el-input v-model="item.collectionName"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('views.agentConfigEdit.collectorFrequency')"
              >
                <el-input v-model="item.collectionCount"></el-input
                >{{ $t('views.agentConfigEdit.pcs') }}
              </el-form-item>
              <el-form-item :label="$t('views.agentConfigEdit.collectorTime')">
                <el-input v-model="item.collectionTime"></el-input
                >{{ $t('views.agentConfigEdit.second') }}
              </el-form-item>
              <el-form-item :label="$t('views.agentConfigEdit.collectorIsOld')">
                <el-radio v-model="item.tenured" :label="true">
                  {{ $t('views.agentConfigEdit.yes') }}
                </el-radio>
                <el-radio v-model="item.tenured" :label="false">
                  {{ $t('views.agentConfigEdit.no') }}
                </el-radio>
              </el-form-item>
            </div>
            <div class="title title-btn">
              <span>
                {{ $t('views.agentConfigEdit.gcLimit') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('views.agentConfigEdit.gcLimitDesc')"
                  placement="right"
                >
                  <span class="el-icon-question"></span>
                </el-tooltip>
              </span>
              <el-button
                class="add-btn"
                size="small"
                @click="
                  add(
                    json.details.performanceLimitRiskThreshold.garbageInfo
                      .collectionInfoList
                  )
                "
                >{{ $t('views.agentConfigEdit.add') }}</el-button
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
              <el-form-item :label="$t('views.agentConfigEdit.collectorName')">
                <el-input v-model="item.collectionName"></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('views.agentConfigEdit.collectorFrequency')"
              >
                <el-input v-model="item.collectionCount"></el-input
                >{{ $t('views.agentConfigEdit.pcs') }}
              </el-form-item>
              <el-form-item :label="$t('views.agentConfigEdit.collectorTime')">
                <el-input v-model="item.collectionTime"></el-input
                >{{ $t('views.agentConfigEdit.second') }}
              </el-form-item>
              <el-form-item :label="$t('views.agentConfigEdit.collectorIsOld')">
                <el-radio v-model="item.tenured" :label="true">{{
                  $t('views.agentConfigEdit.yes')
                }}</el-radio>
                <el-radio v-model="item.tenured" :label="false">{{
                  $t('views.agentConfigEdit.no')
                }}</el-radio>
              </el-form-item>
            </div>
            <div class="title">
              {{ $t('views.agentConfigEdit.threadMax') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.threadMaxDesc')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.nowThread')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.threadInfo
                    .threadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.maxThread')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.threadInfo
                    .peakThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.daemonThread')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.threadInfo
                    .daemonThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.IASTThread')">
              <el-input
                v-model="
                  json.details.performanceLimitMaxThreshold.threadInfo
                    .dongTaiThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.threadLimit') }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.agentConfigEdit.threadLimit')"
                placement="right"
              >
                <span class="el-icon-question"></span>
              </el-tooltip>
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.nowThread')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.threadInfo
                    .threadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.maxThread')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.threadInfo
                    .peakThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.daemonThread')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.threadInfo
                    .daemonThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.IASTThread')">
              <el-input
                v-model="
                  json.details.performanceLimitRiskThreshold.threadInfo
                    .dongTaiThreadCount
                "
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.secondaryDeg') }}
            </div>
            <el-form-item :label="$t('views.agentConfigEdit.tokenSec')">
              <el-input
                v-model="json.details.secondFallbackFrequencyTokenPerSecond"
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.tokenInitTime')">
              <el-input
                v-model="json.details.secondFallbackFrequencyInitBurstSeconds"
              ></el-input
              >{{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <el-form-item
              :label="$t('views.agentConfigEdit.openStatusMaxTime')"
            >
              <el-input v-model="json.details.secondFallbackDuration"></el-input
              >{{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <div class="title">
              {{ $t('views.agentConfigEdit.performanceFusing') }}
            </div>

            <el-form-item :label="$t('views.agentConfigEdit.failureRate')">
              <el-input
                v-model="json.details.performanceBreakerFailureRate"
              ></el-input
              >%
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.notAllow')">
              <el-input
                v-model="json.details.performanceLimitRiskMaxMetricsCount"
              ></el-input
              >{{ $t('views.agentConfigEdit.pcs') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.restoreTime')">
              <el-input
                v-model="json.details.performanceBreakerWaitDuration"
              ></el-input
              >{{ $t('views.agentConfigEdit.second') }}
            </el-form-item>
            <el-form-item :label="$t('views.agentConfigEdit.windowsSize')">
              <el-input
                v-model="json.details.performanceBreakerWindowSize"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div class="btn-box">
          <el-button class="submit btn" size="mini" @click="save">
            {{ $t('views.agentConfigEdit.enter') }}
          </el-button>
        </div>
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
  private senior = false
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
      heavyTrafficBreakerWaitDuration: 30,
      heavyTrafficLimitInitBurstSeconds: 2.0,
      heavyTrafficLimitTokenPerSecond: 100.0,
      hookLimitInitBurstSeconds: 10,
      hookLimitTokenPerSecond: 5000,
      performanceBreakerFailureRate: 100,
      performanceBreakerWaitDuration: 40,
      performanceBreakerWindowSize: 2,
      performanceLimitRiskMaxMetricsCount: 3,
      secondFallbackDuration: 1000000000000,
      secondFallbackFrequencyInitBurstSeconds: 1000000000000,
      secondFallbackFrequencyTokenPerSecond: 10,
      performanceLimitMaxThreshold: {
        cpuUsage: {
          cpuUsagePercentage: 100,
        },
        garbageInfo: {
          collectionInfoList: [
            {
              tenured: true,
              collectionName: 'G1 Old Generation',
              collectionTime: 500,
              collectionCount: 5,
            },
          ],
        },
        memoryNoHeapUsage: {
          max: 1000000000000,
          init: null,
          used: 1000000000000,
          committed: null,
          memUsagePercentage: 100,
        },
        memoryUsage: {
          max: 1000000000000,
          init: null,
          used: 1000000000000,
          committed: null,
          memUsagePercentage: 100,
        },
        threadInfo: {
          threadCount: 10000,
          peakThreadCount: 10000,
          daemonThreadCount: 1000,
          dongTaiThreadCount: 10000,
        },
      },
      performanceLimitRiskThreshold: {
        cpuUsage: { cpuUsagePercentage: 100 },
        garbageInfo: {
          collectionInfoList: [
            {
              tenured: true,
              collectionName: 'G1 Old Generation',
              collectionTime: 1000,
              collectionCount: 10,
            },
          ],
        },
        memoryNoHeapUsage: {
          max: 1000000000000,
          init: null,
          used: 1000000000000,
          committed: null,
          memUsagePercentage: 100,
        },
        memoryUsage: {
          max: 1000000000000,
          init: null,
          used: 1000000000000,
          committed: null,
          memUsagePercentage: 100,
        },
        threadInfo: {
          threadCount: 10000,
          peakThreadCount: 10000,
          daemonThreadCount: 1000,
          dongTaiThreadCount: 10000,
        },
        secondFallbackDuration: 12000,
        secondFallbackFrequencyInitBurstSeconds: 200.0,
        secondFallbackFrequencyTokenPerSecond: 0.01,
      },
    },
  }
  private cut(arr: any, index: any) {
    if (arr.length === 1) {
      this.$message.error(this.$t('views.agentConfigEdit.onleOne') as string)
      return
    }
    return arr.splice(index, 1)
  }
  private add(arr: any) {
    arr.push({
      tenured: true,
      collectionName: 'G1 Old Generation',
      collectionTime: 1000,
      collectionCount: 10,
    })
  }
  private async save() {
    const res = await this.services.setting.save_threshold(this.json)
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.goBack()
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

<style scope lang="scss">
.agent-config-main {
  display: flex;
  justify-content: center;
  margin-top: 16px;

  .agent-config-box {
    width: 1200px;
    background: #fff;
    padding: 20px;
  }
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
.config-form {
  .el-input {
    width: calc(100% - 34px);
    margin-right: 6px;
  }
}
</style>
