# DongTai-web
[![DongTai-project](https://img.shields.io/badge/DongTai%20versions-beta-green)](https://github.com/HXSecurity/DongTai)
[![DongTai--web](https://img.shields.io/badge/DongTai--web-v1.0.0-lightgrey)](https://github.com/HXSecurity/DongTai-web)

[English](README.md)

## 项目介绍
“火线～洞态IAST”是一款专为甲方安全人员、甲乙代码审计工程师和0 Day漏洞挖掘人员量身打造的辅助工具，可用于集成devops环境进行漏洞检测、作为代码审计的辅助工具和自动化挖掘0 Day。

“火线～洞态IAST”具有五大模块，分别是`DongTai-webapi`、`DongTai-openapi`、`DongTai-engine`、`DongTai-web`、`agent`，其中：
- `DongTai-webapi`用于与`DongTai-web`交互，负责用户相关的API请求；
- `DongTai-openapi`用于与`agent`交互，处理agent上报的数据，向agent下发策略，控制agent的运行等
- `DongTai-engine`用于对`DongTai-openapi`接收到的数据进行分析、处理，计算存在的漏洞和可用的污点调用链等
- `DongTai-web`为“火线～洞态IAST”的前端项目，负责页面展示
- `agent`为各语言的数据采集端，从安装Agent的项目中采集相对应的数据，发送至`DongTai-openapi`服务

## 本地开发
1.安装`npm`依赖
```bash
$ npm install
```

2.修改本地配置文件

将目录下的 `.env` 文件中的 `VUE_TARGET_HOST = 'http://test.iast.huoxian.cn:8081'` 修改为 `VUE_TARGET_HOST = '你的后端服务所在地址'`

3.执行运行命令
```bash
$ npm run dev
```


## 部署方案
1.安装`npm`依赖
```bash
$ npm install
```

2.编译为可发布版本
```bash
$ npm run build
```

3.将`dist`目录放入nginx服务的静态资源目录

4.修改nginx配置，设置前端接口对应的后端服务，nginx的配置可参考`nginx.conf`

### 文档
- [官方文档](https://dongtai.io)
- [快速体验](https://iast.io)
