<template>
  <div class="search-bar">
    <div class="flex-item">
      <el-select
        slot="prepend"
        v-model="searchType"
        :placeholder="$t('views.search.prependPlace')"
        clearable
        style="width: 84px"
        class="search-bar-select"
      >
        <el-option :label="$t('views.search.url')" value="url"></el-option>
        <el-option
          :label="$t('views.search.req_header_fs')"
          value="req_header_fs"
        ></el-option>
        <el-option
          :label="$t('views.search.req_data')"
          value="req_data"
        ></el-option>
        <el-option
          :label="$t('views.search.res_header')"
          value="res_header"
        ></el-option>
        <el-option
          :label="$t('views.search.res_body')"
          value="res_body"
        ></el-option>
      </el-select>
    </div>

    <div class="flex-item">
      <el-select
        slot="prepend"
        v-model="search_mode"
        :placeholder="$t('views.search.prependPlace')"
        style="width: 104px"
        class="search-bar-select"
      >
        <el-option :label="$t('views.search.contain')" :value="1"></el-option>
        <el-option :label="$t('views.search.exclude')" :value="2"></el-option>
      </el-select>
      <el-input
        v-model="searchValue"
        :placeholder="$t('views.search.searchValuePlace')"
        class="input-with-select"
        style="width: 264px"
        @keyup.enter.native="enterSearch"
      >
      </el-input>
    </div>
    <div class="flex-item">
      <el-popover
        v-model="showSelect"
        placement="bottom"
        width="400"
        trigger="click"
      >
        <div class="quick-selection-box">
          <div class="quick-selection-title">
            {{ $t('views.search.quickSelection') }}
          </div>
          <div class="quick-selection-ctl">
            <el-select v-model="timeNode" style="width: 80px">
              <el-option
                :label="$t('views.search.lately')"
                value="1"
              ></el-option>
              <el-option
                :label="$t('views.search.farthest')"
                value="2"
              ></el-option>
            </el-select>
            <el-input
              v-model="timeStep"
              type="number"
              style="width: 80px"
            ></el-input>
            <el-select v-model="timeUnit" style="width: 80px">
              <el-option
                :label="$t('views.search.day')"
                value="86400"
              ></el-option>
              <el-option
                :label="$t('views.search.hour')"
                value="3600"
              ></el-option>
              <el-option
                :label="$t('views.search.minute')"
                value="60"
              ></el-option>
              <el-option
                :label="$t('views.search.second')"
                value="1"
              ></el-option>
            </el-select>
            <el-button class="quick-btn" @click="enterTime">{{
              $t('views.search.enterTime')
            }}</el-button>
          </div>
          <div class="quick-selection-title" style="margin-bottom: 0px">
            {{ $t('views.search.commonlyU') }}
          </div>
          <div class="quick-selection-items">
            <div class="quick-selection-item" @click="getDate('day')">
              {{ $t('views.search.today') }}
            </div>
            <div class="quick-selection-item" @click="getDate('86400000')">
              {{ $t('views.search.24Hours') }}
            </div>
            <div class="quick-selection-item" @click="getDate('week')">
              {{ $t('views.search.thisWeek') }}
            </div>
            <div class="quick-selection-item" @click="getDate('604800000')">
              {{ $t('views.search.7Day') }}
            </div>
            <div class="quick-selection-item" @click="getDate('900000')">
              {{ $t('views.search.15Minutes') }}
            </div>
            <div class="quick-selection-item" @click="getDate('1800000')">
              {{ $t('views.search.30Minutes') }}
            </div>
            <div class="quick-selection-item" @click="getDate('3600000')">
              {{ $t('views.search.1Hour') }}
            </div>
          </div>
        </div>
        <div slot="reference" class="icon-select">
          <div style="width: 58px" class="time-select"></div>
          <i class="el-icon-time"></i>
          <i
            :class="showSelect && 'up'"
            class="el-icon-arrow-down el-icon-arrow"
          ></i>
        </div>
      </el-popover>
      <el-date-picker
        v-model="time_range"
        style="width: 340px"
        type="datetimerange"
        prefix-icon="none"
        range-separator="~"
        :clearable="false"
        class="picker-with-select"
      >
      </el-date-picker>
    </div>
    <div class="flex-item">
      <el-button
        slot="append"
        class="search-bar-enter"
        icon="el-icon-search"
        @click="enterSearch"
      ></el-button>
    </div>
  </div>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component, Emit } from 'vue-property-decorator'
@Component({
  name: 'SearchBar',
})
export default class SearchBar extends VueBase {
  private searchType = ''
  private searchValue = ''
  private showSelect = false
  public search_mode = 1
  private timeStep = 15
  private timeUnit = '60'
  private timeNode = '1'
  public time_range = [
    new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
    new Date(),
  ]
  @Emit('enter')
  private enterSearch() {
    return [this.searchType, this.searchValue]
  }

  private enterTime() {
    if (this.timeStep <= 0) {
      this.$message.warning(this.$t('views.search.timeWarning') as string)
      return
    }
    if (this.timeNode === '1') {
      this.time_range = [
        new Date(
          new Date().getTime() - this.timeStep * Number(this.timeUnit) * 1000
        ),
        new Date(),
      ]
    } else {
      this.services.taint.timerange().then((res) => {
        if (res.status === 201) {
          this.time_range = [
            new Date(res.data * 1000),
            new Date(
              res.data * 1000 + this.timeStep * Number(this.timeUnit) * 1000
            ),
          ]
        } else {
          this.time_range = [
            new Date(
              new Date().getTime() -
                this.timeStep * Number(this.timeUnit) * 1000
            ),
            new Date(),
          ]
        }
      })
    }
    this.showSelect = false
  }

  private getDate(time: string) {
    if (time === 'day') {
      this.time_range = [this.getNowDayStar(), this.getNowDayEnd()]
      this.showSelect = false

      return
    }
    if (time === 'week') {
      this.time_range = [this.getStartDayOfWeek(), this.getEndDayOfWeek()]
      this.showSelect = false
      return
    }
    const now = new Date()
    const end = new Date(now.getTime() - Number(time))
    this.time_range = [end, now]
    this.showSelect = false
  }

  now = new Date() // 当前日期
  nowDayOfWeek = this.now.getDay() // 今天本周的第几天
  nowDay = this.now.getDate() // 当前日
  nowMonth = this.now.getMonth() // 当前月

  getNowDayStar() {
    return new Date(this.now.getFullYear(), this.nowMonth, this.nowDay, 0, 0, 0)
  }
  getNowDayEnd() {
    return new Date(
      this.now.getFullYear(),
      this.nowMonth,
      this.nowDay,
      23,
      59,
      59
    )
  }
  getStartDayOfWeek() {
    var day = this.nowDayOfWeek || 7
    return new Date(
      this.now.getFullYear(),
      this.nowMonth,
      this.nowDay + 1 - day
    )
  }
  getEndDayOfWeek() {
    var day = this.nowDayOfWeek || 7
    return new Date(
      this.now.getFullYear(),
      this.nowMonth,
      this.nowDay + 7 - day,
      23,
      59,
      59
    )
  }
}
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .flex-item {
    align-items: center;
    display: flex;
    ::v-deep.el-input__inner {
      border-radius: 0;
      border-color: #c8e0ff;
    }
    .input-with-select {
      ::v-deep.el-input__inner {
        border-left: none;
      }
    }
    .picker-with-select {
      &.el-input__inner {
        border-left: none;
      }
      ::v-deep.el-range-input {
        width: 45% !important;
      }
    }
  }
  .search-bar-enter {
    border-radius: 0;
    border-color: #4a72ae;
    background: #4a72ae;
    color: #fff;
  }
  .icon-select {
    position: relative;
    .el-icon-time {
      position: absolute;
      top: 12px;
      left: 10px;
      color: #c0c4cc;
    }
  }
  .time-select {
    border: 1px solid #c8e0ff;
    height: 40px;
    cursor: pointer;
  }
  .el-icon-arrow {
    position: absolute;
    top: 12px;
    right: 10px;
    color: #c0c4cc;
    transition: all 0.2s;
    &.up {
      transform: rotate(180deg);
    }
  }
}
</style>

<style lang="scss">
.el-input__icon.el-range__icon.none {
  display: none;
}

.quick-selection-box {
  padding: 12px;
  .quick-selection-title {
    padding-left: 6px;
    font-size: 14px;
    color: #38435a;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .quick-selection-ctl {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e6e9ec;
    .el-input__inner {
      border-radius: 2px;
      border-color: #c8e0ff;
    }
    .input-with-select {
      .el-input__inner {
        border-left: none;
      }
    }
    .quick-btn {
      border-radius: 2px;
      border-color: #4a72ae;
      color: #4a72ae;
    }
  }
  .quick-selection-items {
    padding-left: 6px;
    display: flex;
    flex-wrap: wrap;
    .quick-selection-item {
      margin-top: 20px;
      width: 50%;
      color: #4a72ae;
      cursor: pointer;
    }
  }
}
</style>
