#  DongTai-web
[![DongTai-project](https://img.shields.io/badge/DongTai%20versions-beta-green)](https://github.com/HXSecurity/DongTai)
[![Github Version](https://img.shields.io/github/v/release/HXSecurity/DongTai-web?display_name=tag&include_prereleases&sort=semver)](https://github.com/HXSecurity/DongTai-web/releases)


[中文版本(Chinese version)](README.ZH_CN.md)

## Project introduction
"huoxian DongTaiIast" is an auxiliary tool specially designed for Party A's security personnel, Party A's code audit engineers and 0 day.

vulnerability mining personnel. It can be used to integrate Devops environment for vulnerability detection, as an auxiliary tool for code audit and automatic mining 0 day.
"huoxian DongTaiIast" has five modules, namely ` Dongtai webapi `, ` Dongtai OpenAPI`, ` Dongtai engine `, ` Dongtai web` and ` agent `, among which:

- `dongtai webapi `is used to interact with` Dongtai web `and is responsible for user related API requests;
- `dongtai OpenAPI `is used to interact with` agent `, process the data reported by agent, issue policies to agent, control the operation of agent, etc
- `dongtai engine `is used to analyze and process the data received by` Dongtai OpenAPI `, calculate the existing vulnerabilities and available stain call chains, etc
- `dongtai web `is the front-end project of "huoxian DongTaiIast" and is responsible for page display
- The `agent` is the data collection terminal of each language. It collects the corresponding data from the project where the probe is installed and sends it to the `Dongtai OpenAPI` service

## Local development

1. Install `NPM` dependency

```bash
$ npm install
```

2. Modify local configuration file

Change the `.env` file in the `directory_TARGET_HOST = 'http://test.iast.huoxian.cn:8081'` modified to ` Vue_TARGET_Host = 'address of your backend service'`

3. Execute the operation command

```bash
$ npm run dev
```

## Deployment scheme

1. Install `NPM` dependency

```bash
$ npm install
```

2. Compile to a releasable version

```bash
$ npm run build
```

3. Put the `dist` directory into the static resource directory of nginx service

4. Modify nginx configuration and set the back-end service corresponding to the front-end interface. For nginx configuration, refer to `nginx.conf`

### Documentation

- [official documents](https://dongtai.io)
- [quick experience](https://iast.io)

<img src="https://static.scarf.sh/a.png?x-pxid=f9b19108-458c-4e8b-be80-f6ff70241245" />
