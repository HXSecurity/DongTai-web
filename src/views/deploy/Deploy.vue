<template>
  <main>
    <div class="container">
      <div class="container-left">
        <div class="title">{{ $t('views.deploy.begin') }}</div>
        <div class="language-box">
          <div
            class="language"
            :class="language === 'java' && 'active'"
            @click="changeLanguage('java')"
          >
            <img src="../../assets/img/deploy/java.png" />
          </div>
          <div
            class="language"
            :class="language === 'python' && 'active'"
            @click="changeLanguage('python')"
          >
            <img src="../../assets/img/deploy/python.png" />
          </div>
        </div>
        <div class="title">
          {{ $t('views.deploy.installing') }} {{ obj[language].key }}
          {{ $t('views.deploy.agent') }}
        </div>
        <div class="description">
          <div class="description-body">
            <div class="title-2">
              {{ $t('views.deploy.term') }}
            </div>
            <p
              v-for="(item, index) in obj[language].term"
              :key="item"
              :style="{
                textIndent: `${
                  language === 'java' && index > 1 ? '20px' : '0'
                }`,
              }"
            >
              <span>{{ item }}</span>
            </p>
          </div>
        </div>
        <div class="title-2 margin-t-24">
          <span class="icon-no">1</span>
          {{ $t('views.deploy.download') }}
        </div>
        <div class="download">
          <p v-if="language === 'java'" class="download-desc margin-t-8">
            {{ $t('views.deploy.java.title2') }}
          </p>
          <div class="download-item margin-t-16">
            <div class="label">{{ $t('views.deploy.downloadWorld') }}：</div>
            <div class="info">
              <el-button class="download-btn" @click="downloadAgent"
                ><span class="el-icon-download"></span> DongTai
                {{ obj[language].name }} Agent</el-button
              >
            </div>
          </div>
          <div class="download-item margin-t-16">
            <div class="label">shell：</div>
            <div class="info">
              <div class="markdown">
                <span> {{ shell }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('views.deploy.copy')"
                  placement="top"
                >
                  <span
                    v-clipboard:error="onError"
                    v-clipboard:copy="shell"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy icon"
                  ></span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="title-2 margin-t-24">
          <span class="icon-no">2</span>
          {{ $t('views.deploy.install') }}
        </div>
        <div class="install">
          <template v-if="language === 'java'">
            <div class="title-3 margin-t-16">
              1. {{ $t('views.deploy.java.autoInstall') }}
            </div>
            <div class="install-desc margin-t-8">
              {{ $t('views.deploy.java.autoInstallDesc') }}
            </div>
            <div class="markdown margin-t-16">
              <span> {{ obj[language].download }} </span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.deploy.copy')"
                placement="top"
              >
                <span
                  v-clipboard:error="onError"
                  v-clipboard:copy="obj[language].download"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy icon"
                ></span>
              </el-tooltip>
            </div>
          </template>
          <template v-if="language === 'python'">
            <div class="title-3 margin-t-16">
              1. {{ $t('views.deploy.python.ManualInstallation') }}
            </div>
            <div class="install-desc margin-t-8">
              {{ $t('views.deploy.python.manualInstallationDesc') }}
            </div>
            <div class="markdown margin-t-16">
              <span> {{ obj[language].download }} </span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="$t('views.deploy.copy')"
                placement="top"
              >
                <span
                  v-clipboard:error="onError"
                  v-clipboard:copy="obj[language].download"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy icon"
                ></span>
              </el-tooltip>
            </div>
          </template>
          <template v-if="language === 'java'">
            <div class="title-3 margin-t-16">
              2. {{ $t('views.deploy.java.ManualInstallation') }}
            </div>
            <div class="install-tabs">
              <el-tabs v-model="activeName" @tab-click="getMd">
                <el-tab-pane label="SpringBoot" name="SpringBoot">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Tomcat" name="Tomcat">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="JBoss" name="JBoss">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Jetty" name="Jetty">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Resin" name="Resin">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="WebLogic" name="WebLogic">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="WebSphere" name="WebSphere">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
          <template v-if="language === 'python'">
            <div class="title-3 margin-t-16">
              2. {{ $t('views.deploy.python.settings') }}
            </div>
            <div class="install-tabs">
              <el-tabs v-model="activeName" @tab-click="getMd">
                <el-tab-pane label="Django" name="Django">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Flask" name="Flask">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
        </div>

        <div class="title-2 margin-t-24">
          <span class="icon-no">3</span> {{ $t('views.deploy.reloadTile') }}
        </div>
        <div class="reload">
          <div class="reload-desc margin-t-8">
            {{ $t('views.deploy.reloadDesc') }}
          </div>
          <div v-if="language === 'java'" class="margin-t-16 reload-markdown">
            <p class="indent">
              {{ $t('views.deploy.java.p1') }}
            </p>
            <p>{{ $t('views.deploy.java.p2') }}</p>
            <p class="indent">
              {{ $t('views.deploy.java.p3') }}
            </p>
            <p>{{ $t('views.deploy.java.p4') }}</p>
            <p class="indent">
              {{ $t('views.deploy.java.p51') }}
              {{ openapi }}
              {{ $t('views.deploy.java.p52') }}
            </p>
          </div>
          <div v-if="language === 'python'" class="margin-t-16 reload-markdown">
            <p class="indent">
              {{ $t('views.deploy.python.p1') }}
            </p>
            <p>{{ $t('views.deploy.python.p2') }}</p>
            <p class="indent">
              {{ $t('views.deploy.python.p3') }}
            </p>
            <p>{{ $t('views.deploy.python.p4') }}</p>
            <p class="indent">
              {{ $t('views.deploy.python.p5') }}
            </p>
            <p>{{ $t('views.deploy.python.p6') }}</p>
            <p class="indent">
              {{ $t('views.deploy.python.p71') }}
              {{ openapi }}
              {{ $t('views.deploy.python.p72') }}
            </p>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="title">{{ $t('views.deploy.help') }}</div>
        <div class="right-desc margin-t-16">
          {{ obj[language].name }}
          {{ $t('views.deploy.agentInstructions') }}
        </div>
        <div class="right-video margin-t-8">
          <video v-show="language === 'java'" controls>
            <source :src="obj.java.video" type="video/mp4" />
            您的浏览器不支持 HTML5 video 标签。
          </video>
          <video v-show="language === 'python'" controls>
            <source :src="obj.python.video" type="video/mp4" />
            您的浏览器不支持 HTML5 video 标签。
          </video>
        </div>
        <div class="title margin-t-32">
          {{ $t('views.deploy.moreDocument') }}
        </div>
        <div
          v-for="(item, index) in documents"
          :key="item.id"
          class="help-list"
          :class="index ? 'margin-t-24' : 'margin-t-32'"
        >
          <span @click="goDoc(item.url)">{{ item.title }}</span>
        </div>
        <div class="title margin-t-32">
          {{ $t('views.deploy.moreSupport') }}
        </div>
        <div class="help-list margin-t-24 color-blue">
          <span
            @click="
              goDoc('https://github.com/HXSecurity/DongTai/issues/new/choose')
            "
            >{{ $t('views.deploy.issue') }}</span
          >
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
  private activeName = 'SpringBoot'
  private language = 'java'
  private token = ''
  private openapi = 'http://wait.com'
  private documents = []
  private md = {}

  private obj = {
    java: {
      key: 'JAVA',
      name: 'Java',
      term: [
        this.$t('views.deploy.java.term1'),
        this.$t('views.deploy.java.term2'),
        this.$t('views.deploy.java.term3'),
        this.$t('views.deploy.java.term4'),
        this.$t('views.deploy.java.term5'),
        this.$t('views.deploy.java.term6'),
      ],
      download: 'java -jar agent.jar -m install -p <pid>',
      video:
        'https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/install_java_agent.mp4',
    },
    python: {
      key: 'PYTHON',
      name: 'Python',
      term: [
        this.$t('views.deploy.python.term1'),
        this.$t('views.deploy.python.term2'),
        this.$t('views.deploy.python.term3'),
        this.$t('views.deploy.python.term4'),
        this.$t('views.deploy.python.term4-1'),
        this.$t('views.deploy.python.term4-2'),
        this.$t('views.deploy.python.term6'),
        this.$t('views.deploy.python.term6-1'),
        this.$t('views.deploy.python.term6-2'),
        this.$t('views.deploy.python.term6-3'),
      ],
      download: 'pip3  install ./dongtai-agent-python.tar.gz',
      video:
        'https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/instatll_python_agent.mp4',
    },
  }
  changeLanguage(language: string) {
    this.language = language
    if (language === 'java') {
      this.activeName = 'SpringBoot'
    }
    if (language === 'python') {
      this.activeName = 'Django'
    }
    this.getDoc()
    this.getMd()
  }

  fmtUrl() {
    const url = new URL('/api/v1/agent/download', this.openapi)
    return url.href
  }

  get shell() {
    switch (this.language) {
      case 'java':
        return `curl -X GET "${this.fmtUrl()}?url=${
          this.openapi
        }&language=java" -H 'Authorization: Token ${
          this.token
        }' -o agent.jar -k`
      case 'python':
        return `curl -X GET "${this.fmtUrl()}?url=${
          this.openapi
        }&language=python&projectName=Demo%20Project" -H 'Authorization: Token ${
          this.token
        }' -o dongtai-agent-python.tar.gz -k`
    }
  }
  get pythonShell() {
    return
  }
  private goDoc(url: string) {
    window.open(url)
  }

  private onCopy() {
    this.$message({
      message: '已复制',
      type: 'success',
    })
  }

  private onError() {
    this.$message({
      message: '复制失败！',
      type: 'error',
    })
  }

  private async getMd() {
    if (this.md[this.activeName]) {
      return
    }
    const res = await this.services.deploy.getMD({
      language: this.language,
      middleware: this.activeName,
    })
    if (res.status === 201) {
      this.$set(this.md, this.activeName, res.data.desc)
    } else {
      this.$message.error(res.msg)
    }
  }

  private async getOpenapi() {
    const res = await this.services.setting.openapi()
    if (res.status === 201) {
      this.openapi = res.data.url
    } else {
      this.$message.error(res.msg)
    }
  }
  private async downloadAgent() {
    await this.services.deploy.agentDownload(this.openapi, this.language)
  }
  private async getDoc() {
    const docRes = await this.services.deploy.getDocuments({
      language: this.language,
    })
    if (docRes.status === 201) {
      this.documents = docRes.data.documents
    }
  }
  private async created() {
    const res = await this.services.deploy.getToken()
    if (res.status === 201) {
      this.token = res.data.token
    }
    await this.getOpenapi()
    await this.getMd()
    await this.getDoc()
  }
}
</script>

<style scoped lang="scss">
main {
  width: 100%;
  height: calc(100vh - 64px);
  background: #fff;
}

.container {
  width: 1200px;
  display: flex;
  .container-left {
    box-sizing: border-box;
    width: 795px;
    padding: 24px;
    .language-box {
      padding: 16px 0;
      display: flex;
      .language {
        position: relative;
        width: 88px;
        height: 88px;
        background: #fff;
        border: 1px solid #c4c4c4;
        box-sizing: border-box;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 40%;
          height: 40%;
        }
        & + .language {
          margin-left: 12px;
        }
        &.active {
          border: 1px solid #1a80f2;
        }
      }
    }

    .description {
      padding: 16px 8px;
      border-bottom: 1px solid #e6e9ec;
      .description-body {
        background: #ebf0f5;
        border-radius: 2px;
        padding: 16px;
        p {
          margin-top: 16px;
        }
        p + p {
          margin-top: 8px;
        }
      }
    }
  }
  .container-right {
    width: 404px;
    border-left: 1px solid #e6e9ec;
  }
}
.title {
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #38435a;
}
.title-2 {
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #38435a;
  .icon-no {
    border: 2px solid #4a72ae;
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    color: #4a72ae;
    font-size: 14px;
  }
}
.title-3 {
  font-size: 14px;
  font-weight: 500;
}
.margin-t-24 {
  margin-top: 24px;
}
.margin-t-16 {
  margin-top: 16px;
}
.margin-t-32 {
  margin-top: 32px;
}
.margin-t-8 {
  margin-top: 8px;
}
.download {
  padding: 0 30px;
  .download-desc {
    font-size: 14px;
    line-height: 20px;
    color: #38435a;
  }
  .download-item {
    display: flex;
    align-items: center;
    .label {
      box-sizing: border-box;
      padding: 0 4px;
      width: 80px;
      text-align: right;
    }
    .info {
      word-wrap: break-word;
      word-break: break-all;
      flex: 1;
    }
    .download-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #ffffff;
      background: #4a72ae;
      border-radius: 2px;
    }
  }
}
.install {
  /deep/.el-tabs__item:hover {
    color: #38435a;
  }
  /deep/.el-tabs__item {
    color: #38435a;
  }
  /deep/.el-tabs__active-bar {
    color: #4a72ae;
    background-color: #4a72ae;
  }
  padding: 0 30px;
  .install-tab-info {
    height: 358px;
    overflow-y: auto;
    padding: 24px 16px;
    border: 1px solid #e6e9ec;
    border-radius: 2px;
  }
}
.reload {
  padding: 0 30px;
  .reload-markdown {
    border: 1px solid #e6e9ec;
    border-radius: 2px;
    padding: 24px 16px;
    p {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
.markdown {
  background: #ebf0f5;
  border-radius: 2px;
  color: #38435a;
  font-size: 14px;
  line-height: 32px;
  padding: 0 30px 0 16px;
  display: flex;
  align-items: center;
  position: relative;
  .icon {
    right: 10px;
    bottom: 8px;
    position: absolute;
    display: inline-block;
    color: #1a80f2;
    cursor: pointer;
  }
}

.container-right {
  padding: 24px;
  .right-desc {
    font-size: 14px;
    line-height: 20px;
  }
  .right-video {
    background: #c4c4c4;
    border-radius: 2px;
    height: 196px;
    video {
      width: 100%;
      height: 100%;
    }
  }
  .help-list {
    font-size: 14px;
    line-height: 20px;
    color: #4a72ae;
    span {
      cursor: pointer;
    }
  }
}
.color-blue {
  color: #4a72ae;
}
.indent {
  text-indent: 2em;
}
</style>
