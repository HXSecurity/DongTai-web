<template>
  <main>
    <div class="container">
      <div class="container-left">
        <div class="title">选择一种语言，开始安装</div>
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
        <div class="title">安装 {{ obj[language].key }} 探针</div>
        <div class="description">
          <div class="description-body">
            <div class="title-2">
              开始安装之前，检查你的环境，确保以下条件：
            </div>
            <p v-for="(item, index) in obj[language].term" :key="item">
              {{ index + 1 }}. {{ item }}
            </p>
          </div>
        </div>
        <div class="title-2 margin-t-24">
          <span class="icon-no">1</span> 下载探针
        </div>
        <div class="download">
          <p v-if="language === 'java'" class="download-desc margin-t-8">
            洞态 IAST 目前支持 JDK 1.6 以上版本的探针，支持 Windows/Linux
            操作系统，支持 Docker，支持所有的 Java Web 中间件
          </p>
          <div class="download-item margin-t-16">
            <div class="label">下载：</div>
            <div class="info">
              <el-button class="download-btn" @click="downloadAgent"
                ><span class="el-icon-download"></span> DongTai
                {{ obj[language].name }} Agent</el-button
              >
            </div>
          </div>
          <div class="download-item margin-t-16">
            <div class="label">shell命令：</div>
            <div class="info">
              <div class="markdown">
                <span> {{ shell }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="复制"
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
          <span class="icon-no">2</span> 安装探针
        </div>
        <div class="install">
          <template v-if="language === 'java'">
            <div class="title-3 margin-t-16">1. 自动安装</div>
            <div class="install-desc margin-t-8">
              上传 DongTai {{ obj[language].name }} Agent 探针到应用服务器，查看
              Web 应用的进行 Web 应用的进行 id，运行命令安装探针，如下：
            </div>
            <div class="markdown margin-t-16">
              <span> {{ obj[language].download }} </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
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
            <div class="title-3 margin-t-16">1. 手动安装</div>
            <div class="install-desc margin-t-8">
              找到第一步下载的压缩文件执行以下命令
            </div>
            <div class="markdown margin-t-16">
              <span> {{ obj[language].download }} </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
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
            <div class="title-3 margin-t-16">2. 手动安装</div>

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
            <div class="title-3 margin-t-16">2. 项目配置</div>
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
              </el-tabs>
            </div>
          </template>
        </div>

        <div class="title-2 margin-t-24">
          <span class="icon-no">3</span> 重启应用服务（自动安装跳过此步）
        </div>
        <div class="reload">
          <div class="reload-desc margin-t-8">请重启您的应用服务器。</div>
          <div v-if="language === 'java'" class="margin-t-16 reload-markdown">
            <p class="indent">
              若尚未启动 Web 应用服务器，请启动 Web
              应用服务器。然后再浏览器访问应用。稍等1-2分钟，刷新系统配置页面，点击引擎管理，查看探针是否注册成功。如果没有注册成功，按照如下步骤进行排查：
            </p>
            <p>1. 检查 agent.jar 文件</p>
            <p class="indent">
              运行 java -jar /tmp/agent.jar 命令，查看是否反馈 agent.jar
              的使用帮助，如果没有，说明 agent.jar
              文件不正确，请重新下载然后检查 agent.jar
              文件，如果仍然不正确，请前往 github 给工程师提交
              issue，我们会及时给您回复
            </p>
            <p>2. 检查网络情况</p>
            <p class="indent">
              在 Web 应用服务器中，检查是否可访问
              {{ openapi }}
              服务，如果不可访问，说明网络不通，请解决网络访问的问题；如果网络不存在问题，请前往
              github 给工程师提交 issue，我们会及时给您回复
            </p>
          </div>
          <div v-if="language === 'python'" class="margin-t-16 reload-markdown">
            <p class="indent">
              若尚未启动 Web 应用服务器，请启动 Web
              应用服务器。然后再浏览器访问应用。稍等1-2分钟，刷新系统配置页面，点击引擎管理，查看探针是否注册成功。如果没有注册成功，按照如下步骤进行排查：
            </p>
            <p>1. 检查 dongtai-agent-python.tar.gz 文件</p>
            <p class="indent">
              运行pip3 install ./dongtai-agent-python.tar.gz 命令，查看是否反馈
              dongtai-agent-python.tar.gz 的使用帮助，如果没有，说明
              dongtai-agent-python.tar.gz文件不正确，请重新下载然后检查
              dongtai-agent-python.tar.gz文件，如果仍然不正确，请前往 github
              给工程师提交 issue，我们会及时给您回复
            </p>
            <p>2. 检测Django项目的setting.py文件，MIDDLEWARE配置是否有增加</p>
            <p class="indent">
              'dongtai_agent_python.middlewares.django_middleware.FireMiddleware'
            </p>
            <p>3. 检查网络情况</p>
            <p class="indent">
              在 Web 应用服务器中，检查是否可访问
              http://a28754cd66991441d8d682808caecead-626172336.cn-north-1.elb.amazonaws.com.cn:8000
              服务，如果不可访问，说明网络不通，请解决网络访问的问题；如果网络不存在问题，请前往
              github 给工程师提交 issue，我们会及时给您回复
            </p>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="title">安装帮助</div>
        <div class="right-desc margin-t-16">
          {{ obj[language].name }} Agent 安装方法
        </div>
        <div class="right-video margin-t-8">
          <video controls>
            <source src="movie.mp4" type="video/mp4" />
            <source src="movie.ogg" type="video/ogg" />
            您的浏览器不支持 HTML5 video 标签。
          </video>
        </div>
        <div class="title margin-t-32">查阅更多文档</div>
        <div
          v-for="(item, index) in documents"
          :key="item.id"
          class="help-list"
          :class="index ? 'margin-t-24' : 'margin-t-32'"
        >
          <span @click="goDoc(item.url)">{{ item.title }}</span>
        </div>
        <div class="title margin-t-32">获得更多支持</div>
        <div class="help-list margin-t-24 color-blue">
          <span
            @click="
              goDoc('https://github.com/HXSecurity/DongTai/issues/new/choose')
            "
            >提交 ISSUE</span
          >
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import VueBase from '@/VueBase'
import { Component } from 'vue-property-decorator'
import App from '@/App.vue'

@Component({ name: 'Deploy' })
export default class Deploy extends VueBase {
  private activeName = 'SpringBoot'
  private language = 'java'
  private token = ''
  private openapi = ''
  private documents = []
  private md = {}

  private obj = {
    java: {
      key: 'JAVA',
      name: 'Java',
      term: [
        '检查Agent所在系统与DongTai OpenApi之间网络环境是否可以互相连接。',
        '确认Agent端所在环境在我们的支持列表中。',
      ],
      download: 'java -jar agent.jar -m install -p <pid>',
    },
    python: {
      key: 'PYTHON',
      name: 'Python',
      term: [
        'Python 版本：3.3及以上',
        '解释器：CPython',
        '中间件：uWSGI',
        'Web框架：Django',
        'Web Service：Django REST Framework',
        'python依赖包：psutil >= 5.8.0',
      ],
      download: 'pip3  install ./ dongtai-agent-python.tar.gz',
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
  get shell() {
    switch (this.language) {
      case 'java':
        return `curl -X GET "${this.openapi}/api/v1/agent/download?url=${this.openapi}&language=java" -H 'Authorization: Token ${this.token}' -o agent.jar -k`
      case 'python':
        return `curl -X GET "${this.openapi}/api/v1/agent/download?url=${this.openapi}&language=python&projectName=Demo%20Project" -H 'Authorization: Token ${this.token}' -o dongtai-agent-python.tar.gz -k`
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
    height: 243px;
    video {
      width: 100%;
      height: 100%;
    }
  }
  .help-list {
    font-size: 14px;
    line-height: 20px;
    color: #4a72ae;
    span{
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
