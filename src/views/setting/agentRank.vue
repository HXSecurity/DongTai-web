<template>
  <main>
    <div class="change-pwd">
      <el-form
        ref="ruleForm"
        class="ruleForm"
        :model="submitForm"
        :label-width="$i18n.locale == 'en' ? '160px' : '80px'"
        style="margin-top: 54px"
        status-icon
      >
        <el-form-item label="降级条件" prop="values">
          <div
            v-for="(item, index) in submitForm.values"
            :key="index"
            class="header-row"
          >
            <el-input v-model="item.key" size="mini"></el-input>
            <el-select v-model="item.op" size="mini">
              <el-option label=">" value="gt"></el-option>
              <el-option label="<" value="lt"></el-option>
            </el-select>
            <el-input v-model="item.value" size="mini"></el-input>
            <div class="header-btn">
              <el-button
                v-if="index == submitForm.values.length - 1"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="add"
              ></el-button>
              <el-button
                v-if="submitForm.values.length > 1"
                size="mini"
                icon="el-icon-minus"
                circle
                @click="minus(index)"
              ></el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" class="btn">
            {{ $t('views.changePassword.submit') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'Webhook' })
export default class Webhook extends VueBase {
  public submitForm = {
    values: [{ key: '', op: '', value: '' }],
  }
  public add = () => {
    this.submitForm.values.push({ key: '', op: '', value: '' })
  }
  public minus = (index: number) => {
    this.submitForm.values.splice(index, 1)
  }
}
</script>

<style scoped lang="scss">
main {
  padding: 10px;
  .change-pwd {
    display: flex;
    justify-content: center;
    .ruleForm {
      width: 620px;
    }
    ::v-deep.el-input__inner {
      border-radius: 2px;
    }

    .btn {
      background: #4a72ae;
      border-color: #4a72ae;
      background: #4a72ae;
    }
  }
  .header-row {
    display: flex;
    .el-input {
      flex: 2;
      padding: 0 8px;
    }
    .el-select {
      flex: 2;
      padding: 0 8px;
    }
    .header-btn {
      flex: 1;
    }
    & + .header-row {
      margin-top: 4px;
    }
  }
}
</style>
