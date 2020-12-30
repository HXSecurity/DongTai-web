<template>
  <main>
    <div class="footerBg"></div>
    <div class="container flex-row-space-between">
      <div class="sliderWarp">
        <div class="step linghtStep">1</div>
        <div
          class="transitionline"
          :class="curStep >= 2 ? 'lightLine' : 'grayLine'"
        ></div>
        <div class="step" :class="curStep >= 2 ? 'linghtStep' : 'grayStep'">
          2
        </div>
        <div
          class="transitionline"
          :class="curStep === 3 ? 'lightLine' : 'grayLine'"
        ></div>
        <div class="step" :class="curStep === 3 ? 'linghtStep' : 'grayStep'">
          3
        </div>
      </div>
      <div class="contentWarp">
        <div v-if="curStep === 1" class="stepWarp">
          <el-form label-position="top" @submit.native.prevent>
            <el-form-item>
              <div class="title">第一步，选择Agent类型</div>
            </el-form-item>
            <el-form-item>
              <div style="label" class="label">请选择Agent类型</div>
              <el-select
                v-model="deployForm.agent"
                class="deploySelect"
                style="width: 514px"
                placeholder="请选择Agent类型"
              >
                <el-option
                  v-for="item in agents"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="desc">
                根据应用程序使用的开发语言选择对应的Agent类型，使用Java语言开发的应用程序选择Java、使用c#、.Net
                Framework开发的应用程序选择.Net Framework、使用.Net
                Core开发的应用程序选择.Net Core
              </div>
            </el-form-item>
            <el-form-item style="margin-top: 50px">
              <el-button type="text" class="nextBtn" @click="curStep = 2">
                下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="curStep === 2" class="stepWarp">
          <el-form label-position="top" @submit.native.prevent>
            <el-form-item>
              <div class="title">第二步，选择应用的运行环境</div>
            </el-form-item>
            <el-form-item>
              <div style="label" class="label">Java版本</div>
              <el-select
                v-model="deployForm.javaVersion"
                class="deploySelect"
                style="width: 514px"
                placeholder="请选择Java版本"
              >
                <el-option
                  v-for="item in javaVersion"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="label" class="label">中间件</div>
              <el-select
                v-model="deployForm.middleware"
                class="deploySelect"
                style="width: 514px"
                placeholder="请选择中间件"
              >
                <el-option
                  v-for="item in middlewares"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="label" class="label">操作系统</div>
              <el-select
                v-model="deployForm.system"
                class="deploySelect"
                style="width: 514px"
                placeholder="请选择操作系统"
              >
                <el-option
                  v-for="item in system"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-top: 50px">
              <el-button type="text" class="prevBtn" @click="curStep = 1">
                上一步
              </el-button>
              <el-button type="text" class="nextBtn" @click="agentDeploySubmit">
                下一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="curStep === 3" class="stepWarp">
          <el-form label-position="top" @submit.native.prevent>
            <el-form-item style="margin-bottom: 5px">
              <div class="title">第三步，下载与配置</div>
              <div class="token">
                <p style="color: #4a72ae">为了启用洞态，需要增加如下JVM配置</p>
                <p>-javaagent:/path/to/server/agent.jar</p>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <div style="label" class="label">下载</div>
              <div class="downloadInfo">
                <div class="desc">
                  下载洞态IAST的Agent，将agent.jar文件放入WEB服务器（中间件）所在机器上，保证agent.jar文件所在目录具有可写权限
                </div>
                <div class="moudleTitle">
                  手动下载：
                  <button
                    type="text"
                    class="downloadBtn"
                    @click="agentDownload"
                  >
                    <i class="el-icon-download"></i>
                    点击下载
                  </button>
                </div>
                <div class="moudleTitle">自动下载：</div>
                <div class="command token">
                  {{
                    `curl -X GET ${url}/api/v1/agent/download?url=${url}&jdk.version=${this.deployForm.javaVersion} -H
                  'Authorization: Token ${userToken}' -o agent.jar -k`
                  }}
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div style="label" class="label">配置</div>
              <div class="descWarp">
                <MyMarkdownIt :content="desc"></MyMarkdownIt>
              </div>
            </el-form-item>
            <el-form-item style="margin-top: 50px">
              <el-button type="text" class="prevBtn" @click="curStep = 2">
                上一步
              </el-button>
              <el-button type="text" class="nextBtn" @click="agentDeployFinish">
                完成
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'

@Component({ name: 'Deploy' })
export default class Deploy extends VueBase {
  private curStep = 1
  private deployForm: {
    agent: string
    javaVersion: string
    middleware: string
    system: string
  } = {
    agent: '',
    javaVersion: '',
    middleware: '',
    system: '',
  }
  private agents: Array<string> = []
  private javaVersion: Array<string> = []
  private middlewares: Array<string> = []
  private system: Array<string> = []
  private userToken = ''
  private desc = ''
  private url = location.origin

  created() {
    this.getDeplogInfo()
    this.agentDeployInfo()
  }

  // 获取系统部署信息
  private async getDeplogInfo() {
    this.loadingStart()
    const {
      status,
      msg,
      data,
      step,
      user_token,
      desc,
    } = await this.services.deploy.getDeplogInfo()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    // this.curStep = step
    this.userToken = user_token
    this.desc = desc
    this.deployForm = {
      agent: data.agent_value,
      javaVersion: data.java_version,
      middleware: data.middleware,
      system: data.system,
    }
  }
  private async agentDeployInfo() {
    this.loadingStart()
    const { status, msg, data } = await this.services.deploy.agentDeployInfo()
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.agents = data.agents
    this.javaVersion = data.java_version
    this.middlewares = data.middlewares
    this.system = data.system
  }

  // 下载引擎
  private async agentDownload() {
    this.loadingStart()
    await this.services.deploy.agentDownload(
      this.url,
      this.deployForm.javaVersion
    )
    this.loadingDone()
  }

  //系统部署信息提交
  private async agentDeploySubmit() {
    const params = {
      agent_value: this.deployForm.agent,
      java_version: this.deployForm.javaVersion,
      middleware: this.deployForm.middleware,
      system: this.deployForm.system,
    }
    this.loadingStart()
    const {
      status,
      msg,
      user_token,
      desc,
    } = await this.services.deploy.agentDeploySubmit(params)
    this.loadingDone()
    if (status !== 201) {
      this.$message.error(msg)
      return
    }
    this.curStep = 3
    this.userToken = user_token
    this.desc = desc
  }

  private async agentDeployFinish() {
    this.curStep = 1
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss">
main {
  width: 100%;
  height: calc(100vh - 64px);
  background: #fff;

  .footerBg {
    background-image: url('../../assets/img/loginBg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 218px;
  }
}

.sliderWarp {
  width: 52px;
  text-align: center;

  .step {
    width: 52px;
    height: 52px;
    line-height: 52px;
    font-size: 20px;
    color: #fff;
    text-align: center;
    position: relative;
  }

  .transitionline {
    height: 182px;
    border-right: 1px dashed;
    width: 0;
    display: inline-block;
  }

  .lightLine {
    border-right-color: #4876c2;
  }

  .grayLine {
    border-right-color: #aab0bd;
  }

  .linghtStep {
    background: url('../../assets/img/deploy/lightIcon.png');
    background-size: 100% 100%;
    background-position: center center;
  }
  .grayStep {
    background: url('../../assets/img/deploy/grayIcon.png');
    background-size: 100% 100%;
    background-position: center center;
  }
}

.contentWarp {
  width: 906px;

  .stepWarp {
    .title {
      font-size: 24px;
      color: #1e2a3b;
      font-weight: 600;
    }

    .label {
      font-size: 16px;
      font-weight: 600;
      color: #1e2a3b;
      margin-bottom: 15px;
    }

    .desc {
      font-size: 14px;
      color: #9e9e9e;
      line-height: 18px;
      width: 524px;
    }

    .token {
      background: #f7f7f8;
      border-radius: 4px;
      width: 806px;
      padding: 11px;
      line-height: 18px;
    }

    .downloadInfo {
      width: 806px;
      line-height: 1;

      .desc {
        font-size: 14px;
        color: #808796;
        line-height: 20px;
        width: 100%;
      }

      .moudleTitle {
        color: #1e2a3b;
        font-size: 14px;
        margin-top: 14px;
      }

      .command {
        margin-top: 14px;
        word-break: break-all;
        line-height: 18px;
      }

      .downloadBtn {
        cursor: pointer;
        width: 94px;
        height: 26px;
        border-radius: 4px;
        background: #fff;
        border: 1px solid #4a72ae;
        color: #4a72ae;
      }
    }

    .descWarp {
      width: 806px;
      height: 282px;
      padding: 12px;
      background: #f9f9f9;
      overflow: auto;
    }

    .prevBtn {
      width: 124px;
      height: 38px;
      line-height: 0;
      border-radius: 2px;
      border: 1px solid #4a72ae;
      color: #4a72ae;
      background: #fff;
    }

    .nextBtn {
      width: 124px;
      height: 38px;
      line-height: 0;
      background: #4a72ae;
      border-radius: 2px;
      color: #fff;
    }
  }
}
</style>
