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
            <span class="beta">beta</span>
          </div>
          <div
            class="language"
            :class="language === 'php' && 'active'"
            @click="changeLanguage('php')"
          >
            <img src="../../assets/img/deploy/php.png" />
            <span class="beta">beta</span>
          </div>

          <div
            class="language"
            :class="language === 'go' && 'active'"
            @click="changeLanguage('go')"
          >
            <img src="../../assets/img/deploy/go.png" />
            <span class="beta">beta</span>
          </div>
        </div>
        <div
          v-if="
            language === 'go' || language === 'php' || language === 'python'
          "
          class="title"
        >
          {{ obj[language].key }}
          Agent当前主要由社区维护，beta版本无法保证成功部署。
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
              :key="index"
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
        <div class="agentList">
          <el-form label-position="left" label-width="90px" :model="agentForm">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :label="$t('views.deploy.entryName')"
                  style="margin-bottom: 14px"
                >
                  <el-input
                    v-model="agentForm.entryName"
                    :placeholder="$t('views.deploy.entryNamePlaceholder')"
                    clearable
                    class="addUserInput"
                    size="small"
                    style="width: 240px"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label-width="90px"
                  style="margin-bottom: 14px"
                  :label="$t('views.deploy.projectTemplate')"
                >
                  <el-select
                    v-model="agentForm.projectTemplate"
                    class="addUserInput"
                    clearable
                    size="small"
                    style="width: 180px"
                  >
                    <el-option
                      v-for="(item, index) in projectList"
                      :key="index"
                      :label="item.template_name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="16">
                <el-form-item label="Tag" prop="template_name">
                  <div class="tagList" @click="tagclick">
                    <span
                      v-for="(item, index) in agentForm.tagList"
                      :key="index"
                      class="tagItem"
                    >
                      <span>{{ item }}</span>
                      <el-button
                        class="deletag"
                        type="text"
                        @click="deletag(item)"
                        >x</el-button
                      >
                    </span>
                    <el-input
                      v-show="agentForm.tagshow"
                      ref="agentTagInput"
                      v-model="agentForm.tagOption"
                      clearable
                      class="addUserInput"
                      size="mini"
                      style="width: 120px"
                      @blur="agentTagInputBlur"
                      @change="agentTagChange"
                    ></el-input>
                  </div>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item
                  label-width="90px"
                  :label="$t('views.deploy.projectVersion')"
                >
                  <el-input
                    v-model="agentForm.version"
                    :placeholder="$t('views.deploy.projectVersion')"
                    clearable
                    class="addUserInput"
                    size="small"
                    style="width: 240px"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
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
          <template v-if="language === 'go'">
            <div class="title-3 margin-t-16">
              1. {{ $t('views.deploy.go.ManualInstallation') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc1') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc2') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc3') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc4') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 24px">
              {{ $t('views.deploy.go.manualInstallationDesc5') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 24px">
              {{ $t('views.deploy.go.manualInstallationDesc6') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 24px">
              {{ $t('views.deploy.go.manualInstallationDesc7') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc8') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.go.manualInstallationDesc9') }}
            </div>
          </template>

          <template v-if="language === 'php'">
            <div class="title-3 margin-t-16">
              1. {{ $t('views.deploy.php.ManualInstallation') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.php.manualInstallationDesc1') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.php.manualInstallationDesc2') }}
            </div>
            <div class="install-desc margin-t-8" style="margin-left: 12px">
              {{ $t('views.deploy.php.manualInstallationDesc3') }}
            </div>
          </template>
          <template v-if="language === 'java'">
            <div class="title-3 margin-t-16">
              2. {{ $t('views.deploy.java.ManualInstallation') }}
            </div>
            <div class="install-tabs">
              <el-tabs v-model="activeName" @tab-click="getMd">
                <el-tab-pane
                  label="SpringBoot"
                  name="Spring-boot/Netty/Jetty/Sofa"
                >
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
                <!-- <el-tab-pane label="JBoss" name="JBoss">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane> -->
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
                <!-- <el-tab-pane label="WebLogic" name="WebLogic">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane> -->
                <!-- <el-tab-pane label="WebSphere" name="WebSphere">
                  <div class="install-tab-info margin-t-8">
                    <MyMarkdownIt
                      :content="md[activeName]"
                      style="color: #747c8c"
                    ></MyMarkdownIt>
                  </div>
                </el-tab-pane> -->
                <el-tab-pane label="东方通" name="东方通">
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
              2.{{ $t('views.deploy.python.settingName') }}
            </div>
            <div class="margin-t-8">
              {{ $t('views.deploy.python.n1') }}
            </div>
            <div>
              <p class="margin-t-8">{{ $t('views.deploy.python.n2') }}</p>
              <p class="margin-l-16">{{ $t('views.deploy.python.n3') }}</p>
              <p class="margin-t-8">{{ $t('views.deploy.python.n4') }}</p>
              <p class="margin-l-16">
                <a href="https://sysin.org/blog/windows-env/"
                  >https://sysin.org/blog/windows-env/</a
                >
              </p>
              <p class="margin-t-8">{{ $t('views.deploy.python.n5') }}</p>
              <p class="margin-t-8">
                {{ $t('views.deploy.python.n6') }}
              </p>
            </div>
            <div class="title-3 margin-t-16">
              3. {{ $t('views.deploy.python.settings') }}
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
          <!--
          <template v-if="language === 'php'">
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
          </template> -->
        </div>
        <template v-if="language !== 'php'">
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
                {{ uri }}
                {{ $t('views.deploy.java.p52') }}
              </p>
            </div>
            <div
              v-if="language === 'python'"
              class="margin-t-16 reload-markdown"
            >
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
                {{ uri }}
                {{ $t('views.deploy.python.p72') }}
              </p>
            </div>
          </div>
        </template>
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
          :key="index"
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
  private activeName = 'Spring-boot/Netty/Jetty/Sofa'
  private language = 'java'
  private token = ''
  private defaultTemplate = ''
  private uri = window.location.origin + '/openapi'
  private documents = []
  private tagOptions = []
  private md = {}
  private agentForm: any = {
    entryName: '',
    department: '',
    version: '',
    projectTemplate: '',
  }
  private departmentList = []
  private projectList = []

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
      download: 'java -jar dongtai-agent.jar -m install -p <pid>',
      video:
        'https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/install_java_agent.mp4',
    },
    python: {
      key: 'PYTHON',
      name: 'Python',
      term: [
        this.$t('views.deploy.python.os'),
        this.$t('views.deploy.python.term1'),
        this.$t('views.deploy.python.term2'),
        this.$t('views.deploy.python.term3'),
        this.$t('views.deploy.python.termA'),
        this.$t('views.deploy.python.termAa'),
        this.$t('views.deploy.python.termAb'),
        this.$t('views.deploy.python.termAc'),
        this.$t('views.deploy.python.termAd'),
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
    php: {
      key: 'PHP',
      name: 'PHP',
      term: [this.$t('views.deploy.php.term1')],
      download: 'pip3  install ./dongtai-agent-python.tar.gz',
      video:
        'https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/instatll_python_agent.mp4',
    },
    go: {
      key: 'GO',
      name: 'GO',
      term: [this.$t('views.deploy.go.term1')],
      download: '',
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
    if (language === 'php') {
      this.activeName = ''
      this.getDoc()
      return
    }
    if (language === 'go') {
      this.activeName = ''
      this.getDoc()
      return
    }
    this.getDoc()
    this.getMd()
  }

  get shell() {
    switch (this.language) {
      case 'java':
        return `curl -X GET "${this.uri}/api/v1/agent/download?url=${
          this.uri
        }&language=java&token=${
          this.agentForm.department || this.token
        }&projectName=${
          (this.agentForm.entryName && encodeURI(this.agentForm.entryName)) ||
          'Demo%20Project'
        }&projectVersion=${
          (this.agentForm.version && encodeURI(this.agentForm.version)) ||
          'V1.0'
        }&template_id=${
          this.agentForm.projectTemplate || this.defaultTemplate
        }" -H "Authorization: Token ${
          this.agentForm.department || this.token
        }" -o dongtai-agent.jar -k`

      case 'python':
        return `curl -X GET "${this.uri}/api/v1/agent/download?url=${
          this.uri
        }&language=python&token=${
          this.agentForm.department || this.token
        }&projectName=${
          (this.agentForm.entryName && encodeURI(this.agentForm.entryName)) ||
          'Demo%20Project'
        }&projectVersion=${
          (this.agentForm.version && encodeURI(this.agentForm.version)) ||
          'V1.0'
        }&template_id=${
          this.agentForm.projectTemplate || this.defaultTemplate
        }" -H "Authorization: Token ${
          this.agentForm.department || this.token
        }" -o dongtai-agent-python.tar.gz -k`
      case 'php':
        return `curl -X GET "${this.uri}/api/v1/agent/download?url=${
          this.uri
        }&language=php&token=${
          this.agentForm.department || this.token
        }&projectName=${
          (this.agentForm.entryName && encodeURI(this.agentForm.entryName)) ||
          'Demo%20Project'
        }&projectVersion=${
          (this.agentForm.version && encodeURI(this.agentForm.version)) ||
          'V1.0'
        }&template_id=${
          this.agentForm.projectTemplate || this.defaultTemplate
        }" -H "Authorization: Token ${
          this.agentForm.department || this.token
        }" -o php-agent.tar.gz`
      case 'go':
        return `curl -X GET "${this.uri}/api/v1/agent/download?url=${
          this.uri
        }&language=go&token=${
          this.agentForm.department || this.token
        }&projectName=${
          (this.agentForm.entryName && encodeURI(this.agentForm.entryName)) ||
          'Demo%20Project'
        }&projectVersion=${
          (this.agentForm.version && encodeURI(this.agentForm.version)) ||
          'V1.0'
        }&template_id=${
          this.agentForm.projectTemplate || this.defaultTemplate
        }" -H "Authorization: Token ${
          this.agentForm.department || this.token
        }" -o dongtai-go-agent-config.yaml`
    }
  }
  get pythonShell() {
    return
  }
  private goDoc(url: string) {
    window.open(url)
  }

  private tagclick() {
    this.agentForm.tagshow = true
    this.$nextTick(() => {
      ;(this.$refs.agentTagInput as any).focus()
    })
  }
  private agentTagInputBlur() {
    this.agentForm.tagshow = false
  }
  private agentTagChange() {
    if (!this.agentForm.tagList.includes(this.agentForm.tagOption)) {
      this.agentForm.tagList.push(this.agentForm.tagOption)
    }
    this.agentForm.tagOption = ''
  }
  private deletag(key: any) {
    this.agentForm.tagList = this.agentForm.tagList.filter((item: any) => {
      return item !== key
    })
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

  private async downloadAgent() {
    const url =
      window.location.origin +
      '/api/v1/agent/download?url=' +
      window.location.origin +
      '/openapi&language=' +
      this.language +
      `&token=${this.agentForm.department || this.token}&projectName=${
        (this.agentForm.entryName && encodeURI(this.agentForm.entryName)) ||
        'Demo%20Project'
      }&projectVersion=${
        (this.agentForm.version && encodeURI(this.agentForm.version)) || 'V1.0'
      }&template_id=${this.agentForm.projectTemplate || this.defaultTemplate}`
    console.log('url', url)
    window.open(url)
  }
  private async getDoc() {
    const docRes = await this.services.deploy.getDocuments({
      language: this.language,
    })
    if (docRes.status === 201) {
      this.documents = docRes.data.documents
    }
  }

  private async getUserToken() {
    const res = await this.services.user.userToken()
    if (res.status === 201) {
      this.token = res.data.token
    }
  }

  private async created() {
    this.agentForm.entryName = 'Demo Project'
    this.agentForm.version = 'V1.0'
    await this.getMd()
    await this.getDoc()
    this.getUserToken()
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
    .agentList {
      margin-top: 16px;
      .tagList {
        width: 360px;
        line-height: 40px;
        height: 40px;
        border: 1px solid #c4c4c4;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 8px;
        .tagItem {
          width: fit-content;
          color: #0969da;
          background: #ddf4ff;
          border-radius: 2em;
          height: 26px;
          line-height: 26px;
          padding: 0 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    }
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
        .beta {
          position: absolute;
          bottom: 0;
          right: 4px;
          font-size: 12px;
          color: #aaaaaa;
        }
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
.margin-l-16 {
  margin-left: 16px;
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
  ::v-deep.el-tabs__item:hover {
    color: #38435a;
  }
  ::v-deep.el-tabs__item {
    color: #38435a;
  }
  ::v-deep.el-tabs__active-bar {
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
