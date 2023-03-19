<template>
  <div class="sensitive">
    <el-page-header class="header" @back="goBack"></el-page-header>
    <div class="box-card" shadow="never">
      <el-card>
        <div slot="header" class="clearfix">
          <span
            >{{ $t('views.sensitiveManage.t')
            }}<span class="beta">Beta</span></span
          >
        </div>
        <div>
          <p>
            {{ $t('views.sensitiveManage.p1') }}
          </p>
          <p class="mgt-10">
            {{ $t('views.sensitiveManage.p1-1') }}
          </p>
          <p class="text-indent">
            {{ $t('views.sensitiveManage.p1-2') }}
          </p>
          <p class="text-indent">
            {{ $t('views.sensitiveManage.p1-3') }}
          </p>
          <p class="text-indent">
            {{ $t('views.sensitiveManage.p1-4') }}
          </p>
          <p class="mgt-10">{{ $t('views.sensitiveManage.p2') }}</p>
          <p class="text-indent">{{ $t('views.sensitiveManage.p3') }}</p>
          <p class="text-indent">
            {{ $t('views.sensitiveManage.p4') }}
          </p>
        </div>
      </el-card>
    </div>
    <el-form
      ref="ruleForm"
      :label-width="$i18n.locale === 'en' ? '120px' : '80px'"
      :model="sensitiveForm"
      :rules="rules"
    >
      <el-form-item
        :label="$t('views.sensitiveManage.name')"
        prop="strategy_id"
      >
        <el-select v-model="sensitiveForm.strategy_id" filterable>
          <el-option
            v-for="(item, key) in strategyData"
            :key="item.vul_name + key"
            :value="item.id"
            :label="item.vul_name"
          ></el-option>
        </el-select>
        <el-tooltip
          :content="$t('views.sensitiveManage.tip')"
          placement="right"
          effect="light"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="$t('views.sensitiveManage.detail')"
        prop="pattern_type_id"
      >
        <el-radio
          v-for="item in pattern_type"
          :key="item.id"
          v-model="sensitiveForm.pattern_type_id"
          :label="item.id"
          >{{ item.name }}</el-radio
        >
      </el-form-item>
      <el-form-item :label="$t('views.sensitiveManage.fix')" prop="pattern">
        <el-input
          v-model="sensitiveForm.pattern"
          type="textarea"
          :placeholder="$t('views.sensitiveManage.fixP')"
          :autosize="{ minRows: 4, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('views.sensitiveManage.testData')"
        style="position: relative"
      >
        <el-input
          v-model="sensitiveForm.test_data"
          type="textarea"
          :placeholder="$t('views.sensitiveManage.testP')"
          :autosize="{ minRows: 4, maxRows: 4 }"
        ></el-input>
        <el-button
          icon="el-icon-video-play"
          size="small"
          class="btn test-btn"
          @click="regexValidation"
          >{{ $t('views.sensitiveManage.test') }}</el-button
        >
      </el-form-item>
      <el-form-item
        v-if="validatioData"
        :label="$t('views.sensitiveManage.res')"
      >
        {{ validatioData }}
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="text" class="submit" @click="sensitiveDialogEnter">
        {{ $t('views.projectEdit.save') }}
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'sensitiveManage' })
export default class sensitiveManage extends VueBase {
  private pattern_type = []
  private strategyData = []
  private pattern_type_map = {}
  private sensitiveForm: any = {}
  private validatioData = ''
  private rules = {
    strategy_id: [
      {
        required: true,
        message: this.$t('views.sensitiveManage.nameR') as string,
        trigger: 'blur',
      },
    ],
    pattern_type_id: [
      {
        required: true,
        message: this.$t('views.sensitiveManage.detailR') as string,
        trigger: 'blur',
      },
    ],
    pattern: [
      {
        required: true,
        message: this.$t('views.sensitiveManage.fixR') as string,
        trigger: 'blur',
      },
    ],
  }

  private async regexValidation() {
    const form: any = this.$refs.ruleForm
    form.validate(async (valid: boolean) => {
      if (valid) {
        this.loadingStart()
        const res = await this.services.setting.regex_validation({
          url: this.pattern_type_map[this.sensitiveForm.pattern_type_id].url,
          pattern: this.sensitiveForm.pattern,
          test_data: this.sensitiveForm.test_data,
        })
        this.loadingDone()
        if (res.status === 201) {
          if (res.data.data === '') {
            this.$message.warning(
              this.$t('views.sensitiveManage.noValidatio') as string
            )
          }
          this.validatioData = res.data.data
        } else {
          this.$message.error(res.msg)
        }
      }
    })
  }
  private async getStrategyData() {
    this.loadingStart()
    const { status, msg, data } = await this.services.setting.strategyList(
      true,
      {}
    )
    this.loadingDone()
    if (status !== 201) {
      this.$message({
        type: 'error',
        message: msg,
        showClose: true,
      })
      return
    }
    this.strategyData = data
  }

  async sensitiveAdd() {
    // 新增确认
    this.loadingStart()
    this.sensitiveForm.status = 0
    const res = await this.services.setting.create_sensitive_info_rule(
      this.sensitiveForm
    )
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.goBack()
    } else {
      this.$message.error(res.msg)
    }
  }
  async sensitiveEdit() {
    // 编辑确认
    this.loadingStart()
    const res = await this.services.setting.update_sensitive_info_rule(
      this.sensitiveForm
    )
    this.loadingDone()
    if (res.status === 201) {
      this.$message.success(res.msg)
      this.goBack()
    } else {
      this.$message.error(res.msg)
    }
  }
  async sensitiveDialogEdit() {
    // 编辑获取数据
    const res = await this.services.setting.get_sensitive_info_rule_one({
      id: this.$route.query.id,
    })
    if (res.status === 201) {
      this.sensitiveForm = res.data
    } else {
      this.$message.error(res.msg)
    }
  }
  sensitiveDialogEnter() {
    const form: any = this.$refs.ruleForm
    form.validate((valid: boolean) => {
      if (valid) {
        if (this.$route.query.id) {
          this.sensitiveEdit()
        } else {
          this.sensitiveAdd()
        }
      }
    })
  }
  async goBack() {
    this.$router.push({ name: 'sensitiveManage' })
  }
  async created() {
    this.loadingStart()
    await this.getPatternType()
    await this.getStrategyData()
    if (this.$route.query.id) {
      await this.sensitiveDialogEdit()
    }
    this.loadingDone()
  }

  private async getPatternType() {
    const res = await this.services.setting.pattern_type()
    if (res.status === 201) {
      this.pattern_type = res.data
      this.pattern_type.forEach((item: any) => {
        this.$set(this.pattern_type_map, item.id, {
          name: item.name,
          url: item.url,
        })
      })
    } else {
      this.$message.error(res.msg)
    }
  }
}
</script>

<style scoped lang="scss">
.sensitive {
  padding: 24px;
}
.header {
  padding-bottom: 16px;
  color: #4a72ae;
  ::v-deep.el-page-header__left::after {
    display: none;
  }
}
::v-deep.el-card__header {
  background: rgba(255, 150, 87, 0.1);
  padding: 8px !important;
  border-bottom: none;
  .clearfix {
    background: rgba(255, 226, 208, 1);
    padding: 8px;
    .beta {
      display: inline-block;
      padding: 0px 6px;
      margin-left: 4px;
      color: #ff9657;
      background: #ffceb0;
      border-radius: 8px 8px 8px 0px;
    }
  }
}
::v-deep.el-card__body {
  background: rgba(255, 150, 87, 0.1);
  padding: 16px;
  padding-top: 0;
}
.content-warp {
  padding: 38px 14px 40px 14px;
}
.search-input {
  border-right: none;
}
.search-box {
  display: flex;
  align-items: center;
  ::v-deep.el-input__inner {
    border-right: none;
    border-radius: 0;
  }
}
.btn {
  height: 28px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
  &.search {
    height: 34px;
    margin-left: -1px;
  }
}
.btn-border {
  border-radius: 2px;
  color: #4a72ae;
  border-color: #4a72ae;
}
.submit {
  width: 124px;
  height: 38px;
  line-height: 0;
  background: #4a72ae;
  border-radius: 2px;
  color: #fff;
}
.cancel {
  width: 124px;
  height: 38px;
  line-height: 0;
  border-radius: 2px;
  border: 1px solid #4a72ae;
  color: #4a72ae;
}
.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.box-card {
  padding-bottom: 20px;
  color: #38435a;
  border: none;
}
.test-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  border-radius: 4px;
  border: none;
  background: rgba(26, 128, 242, 0.1);
  color: rgba(26, 128, 242, 1);
}
.el-icon-question {
  font-size: 16px;
  margin-left: 6px;
  color: rgba(182, 187, 197, 1);
}
.text-indent {
  text-indent: 2em;
}
.mgt-10 {
  margin-top: 10px;
}
</style>
