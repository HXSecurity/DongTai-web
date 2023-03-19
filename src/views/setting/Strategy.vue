<template>
  <div class="strategy">
    <el-page-header class="header" @back="goBack"></el-page-header>
    <div class="title">
      {{
        $route.query.view
          ? $t('views.strategyManage.viewTitle')
          : dialogForm.id
          ? $t('views.strategyManage.editTitle')
          : $t('views.strategyManage.addTitle')
      }}
    </div>
    <el-form
      ref="ruleForm"
      :model="dialogForm"
      :rules="rules"
      :label-width="$i18n.locale === 'en' ? '120px' : '80px'"
    >
      <el-form-item :label="$t('views.strategyManage.name')" prop="vul_name">
        <div v-if="$route.query.view">
          {{ dialogForm.vul_name }}
        </div>
        <el-input v-else v-model="dialogForm.vul_name"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('views.strategyManage.detail')"
        prop="vul_desc"
        style="position: relative"
      >
        <div v-if="$route.query.view">
          <MyMarkdownIt
            :content="dialogForm.vul_desc"
            style="color: #747c8c"
          ></MyMarkdownIt>
        </div>
        <el-input
          v-else
          v-model="dialogForm.vul_desc"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 4 }"
        ></el-input>
        <el-button
          v-if="!$route.query.view"
          icon="el-icon-view"
          size="small"
          class="btn test-btn"
          @click="preview(dialogForm.vul_desc)"
          >{{ $t('views.strategyManage.view') }}</el-button
        >
      </el-form-item>
      <el-form-item
        :label="$t('views.strategyManage.fix')"
        prop="fix"
        style="position: relative"
      >
        <div v-if="$route.query.view">
          <MyMarkdownIt
            :content="dialogForm.vul_fix || $t('views.strategyManage.no')"
            style="color: #747c8c"
          ></MyMarkdownIt>
        </div>
        <el-input
          v-else
          v-model="dialogForm.vul_fix"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 4 }"
        ></el-input>
        <el-button
          v-if="!$route.query.view"
          icon="el-icon-view"
          size="small"
          class="btn test-btn"
          @click="preview(dialogForm.vul_fix)"
          >{{ $t('views.strategyManage.view') }}</el-button
        >
      </el-form-item>
      <el-form-item :label="$t('views.strategyManage.level')" prop="level_id">
        <div v-if="$route.query.view">
          {{ vul_levels_map[dialogForm.level_id] }}
        </div>
        <el-select v-else v-model="dialogForm.level_id">
          <el-option
            v-for="item in vul_levels"
            :key="item.id"
            :label="item.name_value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('views.strategyManage.status')">
        <div v-if="$route.query.view">
          {{
            dialogForm.state === 'enable'
              ? $t('views.hookPage.on')
              : $t('views.hookPage.off')
          }}
        </div>
        <el-switch
          v-else
          v-model="dialogForm.state"
          active-value="enable"
          inactive-value="disable"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div v-if="!$route.query.view" slot="footer" style="text-align: center">
      <el-button type="small" class="submit btn" @click="dialogEnter">
        {{ $t('views.projectEdit.save') }}
      </el-button>
    </div>
    <el-dialog
      :title="$t('views.strategyManage.view')"
      :visible.sync="viewDialog"
      :show-close="false"
    >
      <div>
        <MyMarkdownIt
          :content="previewData"
          style="color: #747c8c"
        ></MyMarkdownIt>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button
          type="small"
          class="submit btn"
          @click="
            viewDialog = false
            previewData = ''
          "
        >
          {{ $t('views.strategyManage.enter') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'Strategy' })
export default class sensitiveManage extends VueBase {
  private viewDialog = false
  private previewData = ''
  private vul_levels = []
  private vul_levels_map = {}
  private dialogForm: any = {
    vul_name: '',
    vul_type: '',
    state: '',
    vul_desc: '',
    level_id: undefined,
    vul_fix: '',
  }
  private rules = {
    vul_name: [
      {
        required: true,
        message: this.$t('views.strategyManage.notnull') as string,
        trigger: 'blur',
      },
    ],
    vul_desc: [
      {
        required: true,
        message: this.$t('views.strategyManage.notnull') as string,
        trigger: 'blur',
      },
    ],
    level_id: [
      {
        required: true,
        message: this.$t('views.strategyManage.notnull') as string,
        trigger: 'blur',
      },
    ],
  }
  async preview(desc: string) {
    this.viewDialog = true
    this.previewData = desc
  }
  async getVulLevels() {
    this.loadingStart()
    const res = await this.services.setting.vul_levels()
    this.loadingDone()
    if (res.status === 201) {
      this.vul_levels = res.data
      this.vul_levels.forEach((item: any) => {
        this.$set(this.vul_levels_map, item.id, item.name_value)
      })
    } else {
      this.$message.error(res.msg)
    }
  }
  async created() {
    await this.getVulLevels()
    if (this.$route.query.id) {
      await this.getStrategy()
    }
  }
  async getStrategy() {
    const res = await this.services.setting.getStrategy(this.$route.query.id)
    if (res.status === 201) {
      this.dialogForm = res.data
    } else {
      this.$message.error(res.msg)
    }
  }
  dialogEnter() {
    const form: any = this.$refs.ruleForm
    form.validate((valid: boolean) => {
      if (valid) {
        if (this.$route.query.id) {
          this.editStrategyApi()
        } else {
          this.addStrategyApi()
        }
      }
    })
  }
  async goBack() {
    this.$router.push({ name: 'strategyManage' })
  }
  async addStrategyApi() {
    const { status, msg } = await this.services.setting.addManage({
      vul_name: this.dialogForm.vul_name,
      vul_desc: this.dialogForm.vul_desc,
      vul_fix: this.dialogForm.vul_fix,
      vul_type: this.dialogForm.vul_name,
      level_id: this.dialogForm.level_id,
      state: this.dialogForm.state,
    })
    if (status === 201) {
      this.$message.success(msg)
      this.goBack()
    } else {
      this.$message.error(msg)
    }
  }
  async editStrategyApi() {
    this.loadingStart()
    const { status, msg } = await this.services.setting.updateManage(
      this.dialogForm.id,
      {
        vul_name: this.dialogForm.vul_name,
        vul_desc: this.dialogForm.vul_desc,
        vul_fix: this.dialogForm.vul_fix,
        vul_type: this.dialogForm.vul_name,
        level_id: this.dialogForm.level_id,
        state: this.dialogForm.state,
      }
    )
    this.loadingDone()
    if (status === 201) {
      this.$message.success(msg)
      this.goBack()
    } else {
      this.$message.error(msg)
    }
  }
  get userInfo(): { username: string } {
    return this.$store.getters.userInfo
  }
}
</script>

<style scoped lang="scss">
.strategy {
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
.title {
  padding: 0 16px 16px 12px;
  font-size: 20px;
  font-weight: 600;
}
</style>
