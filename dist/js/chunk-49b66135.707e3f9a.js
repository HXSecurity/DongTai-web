(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-49b66135"],{"4ed7":function(t,a,e){t.exports=e.p+"img/python.bf9857b3.png"},"582d":function(t,a,e){t.exports=e.p+"img/go.24556bf1.png"},"93f3":function(t,a,e){t.exports=e.p+"img/php.f7a7ae25.png"},a193:function(t,a,e){},a699:function(t,a,e){"use strict";e("a193")},cbf4:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("main",[s("div",{staticClass:"container"},[s("div",{staticClass:"container-left"},[s("div",{staticClass:"title"},[t._v(t._s(t.$t("views.deploy.begin")))]),s("div",{staticClass:"language-box"},[s("div",{staticClass:"language",class:"java"===t.language&&"active",on:{click:function(a){return t.changeLanguage("java")}}},[s("img",{attrs:{src:e("ef61")}})]),s("div",{staticClass:"language",class:"python"===t.language&&"active",on:{click:function(a){return t.changeLanguage("python")}}},[s("img",{attrs:{src:e("4ed7")}})]),s("div",{staticClass:"language",class:"php"===t.language&&"active",on:{click:function(a){return t.changeLanguage("php")}}},[s("img",{attrs:{src:e("93f3")}}),s("span",{staticClass:"beta"},[t._v("beta")])]),s("div",{staticClass:"language",class:"go"===t.language&&"active",on:{click:function(a){return t.changeLanguage("go")}}},[s("img",{attrs:{src:e("582d")}}),s("span",{staticClass:"beta"},[t._v("beta")])])]),s("div",{staticClass:"title"},[t._v(" "+t._s(t.$t("views.deploy.installing"))+" "+t._s(t.obj[t.language].key)+" "+t._s(t.$t("views.deploy.agent"))+" ")]),s("div",{staticClass:"description"},[s("div",{staticClass:"description-body"},[s("div",{staticClass:"title-2"},[t._v(" "+t._s(t.$t("views.deploy.term"))+" ")]),t._l(t.obj[t.language].term,(function(a,e){return s("p",{key:a,style:{textIndent:"java"===t.language&&e>1?"20px":"0"}},[s("span",[t._v(t._s(a))])])}))],2)]),s("div",{staticClass:"title-2 margin-t-24"},[s("span",{staticClass:"icon-no"},[t._v("1")]),t._v(" "+t._s(t.$t("views.deploy.download"))+" ")]),s("div",{staticClass:"download"},["java"===t.language?s("p",{staticClass:"download-desc margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.java.title2"))+" ")]):t._e(),s("div",{staticClass:"download-item margin-t-16"},[s("div",{staticClass:"label"},[t._v(t._s(t.$t("views.deploy.downloadWorld"))+"：")]),s("div",{staticClass:"info"},[s("el-button",{staticClass:"download-btn",on:{click:t.downloadAgent}},[s("span",{staticClass:"el-icon-download"}),t._v(" DongTai "+t._s(t.obj[t.language].name)+" Agent")])],1)]),s("div",{staticClass:"download-item margin-t-16"},[s("div",{staticClass:"label"},[t._v("shell：")]),s("div",{staticClass:"info"},[s("div",{staticClass:"markdown"},[s("span",[t._v(" "+t._s(t.shell))]),s("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.$t("views.deploy.copy"),placement:"top"}},[s("span",{directives:[{name:"clipboard",rawName:"v-clipboard:error",value:t.onError,expression:"onError",arg:"error"},{name:"clipboard",rawName:"v-clipboard:copy",value:t.shell,expression:"shell",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"}],staticClass:"el-icon-document-copy icon"})])],1)])])]),s("div",{staticClass:"title-2 margin-t-24"},[s("span",{staticClass:"icon-no"},[t._v("2")]),t._v(" "+t._s(t.$t("views.deploy.install"))+" ")]),s("div",{staticClass:"install"},["java"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 1. "+t._s(t.$t("views.deploy.java.autoInstall"))+" ")]),s("div",{staticClass:"install-desc margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.java.autoInstallDesc"))+" ")]),s("div",{staticClass:"markdown margin-t-16"},[s("span",[t._v(" "+t._s(t.obj[t.language].download)+" ")]),s("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.$t("views.deploy.copy"),placement:"top"}},[s("span",{directives:[{name:"clipboard",rawName:"v-clipboard:error",value:t.onError,expression:"onError",arg:"error"},{name:"clipboard",rawName:"v-clipboard:copy",value:t.obj[t.language].download,expression:"obj[language].download",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"}],staticClass:"el-icon-document-copy icon"})])],1)]:t._e(),"python"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 1. "+t._s(t.$t("views.deploy.python.ManualInstallation"))+" ")]),s("div",{staticClass:"install-desc margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.python.manualInstallationDesc"))+" ")]),s("div",{staticClass:"markdown margin-t-16"},[s("span",[t._v(" "+t._s(t.obj[t.language].download)+" ")]),s("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:t.$t("views.deploy.copy"),placement:"top"}},[s("span",{directives:[{name:"clipboard",rawName:"v-clipboard:error",value:t.onError,expression:"onError",arg:"error"},{name:"clipboard",rawName:"v-clipboard:copy",value:t.obj[t.language].download,expression:"obj[language].download",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"}],staticClass:"el-icon-document-copy icon"})])],1)]:t._e(),"go"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 1. "+t._s(t.$t("views.deploy.go.ManualInstallation"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc1"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc2"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc3"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc4"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"24px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc5"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"24px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc6"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"24px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc7"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc8"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.go.manualInstallationDesc9"))+" ")])]:t._e(),"php"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 1. "+t._s(t.$t("views.deploy.php.ManualInstallation"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.php.manualInstallationDesc1"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.php.manualInstallationDesc2"))+" ")]),s("div",{staticClass:"install-desc margin-t-8",staticStyle:{"margin-left":"12px"}},[t._v(" "+t._s(t.$t("views.deploy.php.manualInstallationDesc3"))+" ")])]:t._e(),"java"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 2. "+t._s(t.$t("views.deploy.java.ManualInstallation"))+" ")]),s("div",{staticClass:"install-tabs"},[s("el-tabs",{on:{"tab-click":t.getMd},model:{value:t.activeName,callback:function(a){t.activeName=a},expression:"activeName"}},[s("el-tab-pane",{attrs:{label:"SpringBoot",name:"SpringBoot"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"Tomcat",name:"Tomcat"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"JBoss",name:"JBoss"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"Jetty",name:"Jetty"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"Resin",name:"Resin"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"WebLogic",name:"WebLogic"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"WebSphere",name:"WebSphere"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)])],1)],1)]:t._e(),"python"===t.language?[s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 2."+t._s(t.$t("views.deploy.python.settingName"))+" ")]),s("div",{staticClass:"margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.python.n1"))+" ")]),s("div",[s("p",{staticClass:"margin-t-8"},[t._v(t._s(t.$t("views.deploy.python.n2")))]),s("p",{staticClass:"margin-l-16"},[t._v(t._s(t.$t("views.deploy.python.n3")))]),s("p",{staticClass:"margin-t-8"},[t._v(t._s(t.$t("views.deploy.python.n4")))]),t._m(0),s("p",{staticClass:"margin-t-8"},[t._v(t._s(t.$t("views.deploy.python.n5")))]),s("p",{staticClass:"margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.python.n6"))+" ")])]),s("div",{staticClass:"title-3 margin-t-16"},[t._v(" 3. "+t._s(t.$t("views.deploy.python.settings"))+" ")]),s("div",{staticClass:"install-tabs"},[s("el-tabs",{on:{"tab-click":t.getMd},model:{value:t.activeName,callback:function(a){t.activeName=a},expression:"activeName"}},[s("el-tab-pane",{attrs:{label:"Django",name:"Django"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)]),s("el-tab-pane",{attrs:{label:"Flask",name:"Flask"}},[s("div",{staticClass:"install-tab-info margin-t-8"},[s("MyMarkdownIt",{staticStyle:{color:"#747c8c"},attrs:{content:t.md[t.activeName]}})],1)])],1)],1)]:t._e()],2),"php"!==t.language?[s("div",{staticClass:"title-2 margin-t-24"},[s("span",{staticClass:"icon-no"},[t._v("3")]),t._v(" "+t._s(t.$t("views.deploy.reloadTile"))+" ")]),s("div",{staticClass:"reload"},[s("div",{staticClass:"reload-desc margin-t-8"},[t._v(" "+t._s(t.$t("views.deploy.reloadDesc"))+" ")]),"java"===t.language?s("div",{staticClass:"margin-t-16 reload-markdown"},[s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.java.p1"))+" ")]),s("p",[t._v(t._s(t.$t("views.deploy.java.p2")))]),s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.java.p3"))+" ")]),s("p",[t._v(t._s(t.$t("views.deploy.java.p4")))]),s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.java.p51"))+" "+t._s(t.uri)+" "+t._s(t.$t("views.deploy.java.p52"))+" ")])]):t._e(),"python"===t.language?s("div",{staticClass:"margin-t-16 reload-markdown"},[s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.python.p1"))+" ")]),s("p",[t._v(t._s(t.$t("views.deploy.python.p2")))]),s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.python.p3"))+" ")]),s("p",[t._v(t._s(t.$t("views.deploy.python.p4")))]),s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.python.p5"))+" ")]),s("p",[t._v(t._s(t.$t("views.deploy.python.p6")))]),s("p",{staticClass:"indent"},[t._v(" "+t._s(t.$t("views.deploy.python.p71"))+" "+t._s(t.uri)+" "+t._s(t.$t("views.deploy.python.p72"))+" ")])]):t._e()])]:t._e()],2),s("div",{staticClass:"container-right"},[s("div",{staticClass:"title"},[t._v(t._s(t.$t("views.deploy.help")))]),s("div",{staticClass:"right-desc margin-t-16"},[t._v(" "+t._s(t.obj[t.language].name)+" "+t._s(t.$t("views.deploy.agentInstructions"))+" ")]),s("div",{staticClass:"right-video margin-t-8"},[s("video",{directives:[{name:"show",rawName:"v-show",value:"java"===t.language,expression:"language === 'java'"}],attrs:{controls:""}},[s("source",{attrs:{src:t.obj.java.video,type:"video/mp4"}}),t._v(" 您的浏览器不支持 HTML5 video 标签。 ")]),s("video",{directives:[{name:"show",rawName:"v-show",value:"python"===t.language,expression:"language === 'python'"}],attrs:{controls:""}},[s("source",{attrs:{src:t.obj.python.video,type:"video/mp4"}}),t._v(" 您的浏览器不支持 HTML5 video 标签。 ")])]),s("div",{staticClass:"title margin-t-32"},[t._v(" "+t._s(t.$t("views.deploy.moreDocument"))+" ")]),t._l(t.documents,(function(a,e){return s("div",{key:a.id,staticClass:"help-list",class:e?"margin-t-24":"margin-t-32"},[s("span",{on:{click:function(e){return t.goDoc(a.url)}}},[t._v(t._s(a.title))])])})),s("div",{staticClass:"title margin-t-32"},[t._v(" "+t._s(t.$t("views.deploy.moreSupport"))+" ")]),s("div",{staticClass:"help-list margin-t-24 color-blue"},[s("span",{on:{click:function(a){return t.goDoc("https://github.com/HXSecurity/DongTai/issues/new/choose")}}},[t._v(t._s(t.$t("views.deploy.issue")))])])],2)])])},i=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("p",{staticClass:"margin-l-16"},[e("a",{attrs:{href:"https://sysin.org/blog/windows-env/"}},[t._v("https://sysin.org/blog/windows-env/")])])}],n=e("1da1"),o=e("d4ec"),l=e("bee2"),c=e("262e"),r=e("2caf"),p=(e("96cf"),e("99af"),e("9ab4")),v=e("8c73"),d=e("60a3"),g=function(t){Object(c["a"])(e,t);var a=Object(r["a"])(e);function e(){var t;return Object(o["a"])(this,e),t=a.apply(this,arguments),t.activeName="SpringBoot",t.language="java",t.token="",t.uri=window.location.origin+"/openapi",t.documents=[],t.md={},t.obj={java:{key:"JAVA",name:"Java",term:[t.$t("views.deploy.java.term1"),t.$t("views.deploy.java.term2"),t.$t("views.deploy.java.term3"),t.$t("views.deploy.java.term4"),t.$t("views.deploy.java.term5"),t.$t("views.deploy.java.term6")],download:"java -jar agent.jar -m install -p <pid>",video:"https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/install_java_agent.mp4"},python:{key:"PYTHON",name:"Python",term:[t.$t("views.deploy.python.os"),t.$t("views.deploy.python.term1"),t.$t("views.deploy.python.term2"),t.$t("views.deploy.python.term3"),t.$t("views.deploy.python.termA"),t.$t("views.deploy.python.termAa"),t.$t("views.deploy.python.termAb"),t.$t("views.deploy.python.termAc"),t.$t("views.deploy.python.termAd"),t.$t("views.deploy.python.term4"),t.$t("views.deploy.python.term4-1"),t.$t("views.deploy.python.term4-2"),t.$t("views.deploy.python.term6"),t.$t("views.deploy.python.term6-1"),t.$t("views.deploy.python.term6-2"),t.$t("views.deploy.python.term6-3")],download:"pip3  install ./dongtai-agent-python.tar.gz",video:"https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/instatll_python_agent.mp4"},php:{key:"PHP",name:"PHP",term:[t.$t("views.deploy.php.term1")],download:"pip3  install ./dongtai-agent-python.tar.gz",video:"https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/instatll_python_agent.mp4"},go:{key:"GO",name:"GO",term:[t.$t("views.deploy.go.term1")],download:"",video:"https://huoqi-public.oss-cn-beijing.aliyuncs.com/iast/instatll_python_agent.mp4"}},t}return Object(l["a"])(e,[{key:"changeLanguage",value:function(t){return this.language=t,"java"===t&&(this.activeName="SpringBoot"),"python"===t&&(this.activeName="Django"),"php"===t||"go"===t?(this.activeName="",void this.getDoc()):(this.getDoc(),void this.getMd())}},{key:"shell",get:function(){switch(this.language){case"java":return'curl -X GET "'.concat(this.uri,"/api/v1/agent/download?url=").concat(this.uri,'&language=java" -H "Authorization: Token ').concat(this.token,'" -o agent.jar -k');case"python":return'curl -X GET "'.concat(this.uri,"/api/v1/agent/download?url=").concat(this.uri,'&language=python&projectName=Demo%20Project" -H "Authorization: Token ').concat(this.token,'" -o dongtai-agent-python.tar.gz -k');case"php":return'curl -X GET "'.concat(this.uri,"/api/v1/agent/download?url=").concat(this.uri,'&language=php" -H "Authorization: Token ').concat(this.token,'" -o php-agent.tar.gz');case"go":return'curl -X GET "'.concat(this.uri,"/api/v1/agent/download?url=").concat(this.uri,'&language=go" -H "Authorization: Token ').concat(this.token,'" -o dongtai-go-agent-config.yaml')}}},{key:"pythonShell",get:function(){}},{key:"goDoc",value:function(t){window.open(t)}},{key:"onCopy",value:function(){this.$message({message:"已复制",type:"success"})}},{key:"onError",value:function(){this.$message({message:"复制失败！",type:"error"})}},{key:"getMd",value:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!this.md[this.activeName]){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,this.services.deploy.getMD({language:this.language,middleware:this.activeName});case 4:a=t.sent,201===a.status?this.$set(this.md,this.activeName,a.data.desc):this.$message.error(a.msg);case 6:case"end":return t.stop()}}),t,this)})));function a(){return t.apply(this,arguments)}return a}()},{key:"downloadAgent",value:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:a=window.location.origin+"/api/v1/agent/download?url="+window.location.origin+"/openapi&language="+this.language,window.open(a);case 2:case"end":return t.stop()}}),t,this)})));function a(){return t.apply(this,arguments)}return a}()},{key:"getDoc",value:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.services.deploy.getDocuments({language:this.language});case 2:a=t.sent,201===a.status&&(this.documents=a.data.documents);case 4:case"end":return t.stop()}}),t,this)})));function a(){return t.apply(this,arguments)}return a}()},{key:"created",value:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.services.deploy.getToken();case 2:return a=t.sent,201===a.status&&(this.token=a.data.token),t.next=6,this.getMd();case 6:return t.next=8,this.getDoc();case 8:case"end":return t.stop()}}),t,this)})));function a(){return t.apply(this,arguments)}return a}()}]),e}(v["a"]);g=Object(p["b"])([Object(d["a"])({name:"Deploy"})],g);var u=g,m=u,y=(e("a699"),e("2877")),h=Object(y["a"])(m,s,i,!1,null,"0f736a02",null);a["default"]=h.exports},ef61:function(t,a,e){t.exports=e.p+"img/java.ad5afceb.png"}}]);
//# sourceMappingURL=chunk-49b66135.707e3f9a.js.map