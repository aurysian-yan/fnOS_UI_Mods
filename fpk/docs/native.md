💻 【实战】Native 应用构建 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/core-concepts/native)

`ctrl``K`

* [👋　欢迎加入](/docs/guide)
* [🚀　快速开始](/docs/category/快速开始)
* [📘　开发指南](/docs/category/开发指南)

  + [📚 【基础】架构概述](/docs/core-concepts/framework)
  + [📚 【基础】Manifest](/docs/core-concepts/manifest)
  + [📚 【基础】环境变量](/docs/core-concepts/environment-variables)
  + [📚 【基础】应用权限](/docs/core-concepts/privilege)
  + [📚 【基础】应用资源](/docs/core-concepts/resource)
  + [📚 【基础】应用入口](/docs/core-concepts/app-entry)
  + [📚 【基础】用户向导](/docs/core-concepts/wizard)
  + [🔥 【进阶】应用依赖关系](/docs/core-concepts/dependency)
  + [🔥 【进阶】运行时环境](/docs/core-concepts/runtime)
  + [🔥 【进阶】中间件服务](/docs/core-concepts/middleware)
  + [💻 【实战】Docker 应用构建](/docs/core-concepts/docker)
  + [💻 【实战】Native 应用构建](/docs/core-concepts/native)
  + [📜 【规范】图标 Icon](/docs/core-concepts/icon)
* [🔧　CLI 开发工具](/docs/category/cli-开发工具)
* [🔄　文档更新日志](/docs/category/文档更新日志)

* [📘　开发指南](/docs/category/开发指南)
* 💻 【实战】Native 应用构建

本页总览

💻 【实战】Native 应用构建
=================

一个简单的 Notepad 应用[​](#一个简单的-notepad-应用 "一个简单的 Notepad 应用的直接链接")
--------------------------------------------------------------

提示

示例代码可以点击 [此处](https://static.fnnas.com/appcenter-marketing/20250917183504284.zip) 下载

我们使用 Vide Coding 实现了一个简易的 Notepad 程序，它支持在服务端保存笔记内容，在浏览器中进行查看和编辑。

相关技术栈如下：

* 后端使用 NodeJS + express 开发
* 前端使用 React + vite 开发

下载解压后，可以看到代码目录结构如下：

```
notepad/  
├── backend/  
│   ├── server.js  
│   └── package.json  
├── frontend/  
│   ├── public/  
│   │   └── styles.css  
│   ├── src/  
│   │   └── main.jsx  
│   ├── index.html  
│   ├── package.json  
│   └── vite.config.mjs  
├── scripts/  
│   └── build-combined.js  
├── package-lock.json  
├── package.json  
└── README.md
```

请自行准备好 NodeJS 环境，然后在终端执行如下命令，以完成本地运行

```
npm install --workspaces  
npm run start
```

一切顺利的话，你已经可以在浏览器访问 <http://localhost:5001> 来体验该应用了

为了在飞牛 fnOS 上运行，我们还需要将应用的前端和后端通过以下命令进行打包，完成后，你就能在 `dist/` 看到最终的可执行文件了

```
npm run build
```

接下来，我们需要将进行应用打包

创建飞牛 fnOS 应用打包目录[​](#创建飞牛-fnos-应用打包目录 "创建飞牛 fnOS 应用打包目录的直接链接")
--------------------------------------------------------------

在 `notepad/` 目录下执行 `fnpack create fnnas.notepad` 命令创建应用打包目录，这时候的目录结构应该如下：

```
notepad/  
├── backend/  
├── dist/  
│   ├── node_modules/  
│   ├── public/  
│   │   ├── assets/  
│   │   ├── index.html  
│   │   └── styles.css  
│   ├── server.js  
│   ├── package.json  
│   └── package-lock.json  
├── fnnas.notepad/  
│   ├── app/  
│   ├── manifest  
│   ├── cmd/  
│   │   ├── main  
│   │   ├── install_init  
│   │   ├── install_callback  
│   │   ├── uninstall_init     
│   │   ├── uninstall_callback  
│   │   ├── upgrade_init  
│   │   ├── upgrade_callback  
│   │   ├── config_init  
│   │   └── config_callback  
│   ├── config/  
│   │   ├── privilege  
│   │   └── resource  
│   ├── wizard/  
│   ├── LICENSE  
│   ├── ICON.PNG  
│   └── ICON_256.PNG  
├── frontend/  
├── scripts/  
├── package-lock.json  
├── package.json  
└── README.md
```

### 复制编译产物[​](#复制编译产物 "复制编译产物的直接链接")

`notepad/fnnas.notepad/app/` 目录用来存放应用的全部可执行文件和依赖。

在 `notepad/fnnas.notepad/app/` 目录下创建 `server/`，并复制 `notepad/dist/` 目录下的全部内容到 `server/` 目录下

### 编辑应用基本信息[​](#编辑应用基本信息 "编辑应用基本信息的直接链接")

notepad/fnnas.notepad/manifest

```
appname=fnnas.notepad  
version=0.0.1  
desc=A simple notepad  
arch=x86_64  
display_name=Notepad  
maintainer=someone  
distributor=someone  
desktop_uidir=ui  
desktop_applaunchname=fnnas.notepad.Application  
source=thirdparty
```

### 编辑应用权限[​](#编辑应用权限 "编辑应用权限的直接链接")

定义应用运行的权限，应用将以 `fnnas.notepad` 用户身份运行

notepad/fnnas.notepad/config/privilege

```
{  
    "defaults": {  
        "run-as": "package"  
    },  
    "username": "fnnas.notepad",  
    "groupname": "fnnas.notepad"  
}
```

### 编辑应用配置[​](#编辑应用配置 "编辑应用配置的直接链接")

我们希望将笔记内容放在用户可以查看和编辑的共享目录，所以定义data-share属性，如下：

notepad/fnnas.notepad/config/resource

```
{  
    "data-share": {  
        "shares": [  
            {  
                "name": "fnnas.notepad",  
                "permission": {  
                    "rw": [  
                        "fnnas.notepad"  
                    ]  
                }  
            }  
        ]  
    }  
}
```

### 编辑应用启停脚本[​](#编辑应用启停脚本 "编辑应用启停脚本的直接链接")

定义应用的启动和停止逻辑

notepad/fnnas.notepad/cmd/main

```
#!/bin/bash  
  
LOG_FILE="${TRIM_PKGVAR}/info.log"  
PID_FILE="${TRIM_PKGVAR}/app.pid"  
  
export PATH=/var/apps/nodejs_v22/target/bin:$PATH  
# data directory to write note.txt  
DATA_DIR="${TRIM_DATA_SHARE_PATHS%%:*}"  
# write the command to start your program here   
CMD="DATA_DIR=${DATA_DIR} PORT=5001 node ${TRIM_APPDEST}/server/server.js"  
  
log_msg() {  
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> ${LOG_FILE}  
}  
  
start_process() {  
    if status; then  
        return 0  
    fi  
  
    log_msg "Starting process ..."  
    # env >> ${LOG_FILE}  
    # run the nodejs process  
    bash -c "${CMD}" >> ${LOG_FILE} 2>&1 &  
    # write pid to pidfile  
    printf "%s" "$!" > ${PID_FILE}  
    # log_msg "${CMD}"  
    # log_msg "pid = $!"  
    return 0  
}  
  
stop_process() {  
    log_msg "Stopping process ..."  
  
    if [ -r "${PID_FILE}" ]; then  
        pid=$(head -n 1 "${PID_FILE}" | tr -d '[:space:]')  
          
        log_msg "pid=${pid}"  
        if ! check_process "${pid}"; then  
            # process not exist, delete pidfile  
            rm -f "${PID_FILE}"  
            log_msg "remove pid file 1"  
            return  
        fi  
  
        log_msg "send TERM signal to PID:${pid}..."  
        kill -TERM ${pid} >> ${LOG_FILE} 2>&1  
  
        local count=0  
        while check_process "${pid}" && [ $count -lt 10 ]; do  
            sleep 1  
            count=$((count + 1))  
            log_msg "waiting process terminal... (${count}s/10s)"  
        done  
  
        if check_process "${pid}"; then  
            log_msg "send KILL signal to PID:${pid}..."  
            kill -KILL "${pid}"  
            sleep 1  
            rm -f "${PID_FILE}"  
        else  
            log_msg "process killed... "  
        fi  
    fi  
  
    return 0  
}  
  
check_process() {  
    local pid=$1  
    if kill -0 "${pid}" 2>/dev/null; then  
        return 0  # process exist  
    else  
        return 1  # process not exist  
    fi  
}  
  
status() {  
    if [ -f "${PID_FILE}" ]; then  
        pid=$(head -n 1 "${PID_FILE}" | tr -d '[:space:]')  
        if check_process "${pid}"; then  
            return 0  
        else  
            # Process is not running but pidfile exists - clean it up  
            rm -f "${PID_FILE}"  
        fi      
    fi  
  
    return 1  
}  
  
case $1 in  
start)  
    # run start command. exit 0 if success, exit 1 if failed  
    start_process  
    ;;  
stop)  
    # run stop command. exit 0 if success, exit 1 if failed  
    stop_process  
    ;;  
status)  
    # check application status command. exit 0 if running, exit 3 if not running  
    if status; then   
        exit 0  
    else   
        exit 3  
    fi  
    ;;  
*)  
    exit 1  
    ;;  
esac
```

### 编辑桌面图标[​](#编辑桌面图标 "编辑桌面图标的直接链接")

```
notepad/  
├── backend/  
├── dist/  
├── fnnas.notepad/  
│   ├── app/  
│   │   ├── server/  
│   │   └── ui  
│   │       ├── images  
│   │       │   ├── icon_64.png  
│   │       │   └── icon_256.png  
│   │       └── config  
│   ├── manifest  
│   ├── cmd/  
│   ├── config/  
│   ├── wizard/  
│   ├── LICENSE  
│   ├── ICON.PNG  
│   └── ICON_256.PNG  
├── frontend/  
├── scripts/  
├── package-lock.json  
├── package.json  
└── README.md
```

config文件说明：

notepad/fnnas.notepad/app/ui/config

```
{  
    ".url": {  
        "fnnas.notepad.Application": {  
            "title": "Notepad",  
            "icon": "images/icon_{0}.png",  
            "type": "url",  
            "protocol": "http",  
            "port": "5001"  
        }  
    }  
}
```

新增两个图标文件，分辨率分别是 64x64 和 256x256。

打包成 fpk[​](#打包成-fpk "打包成 fpk的直接链接")
-----------------------------------

使用 `fnpack` CLI 工具打包应用

```
cd fnnas.notepad  
fnpack build
```

然后你可以在 `fnnas.notepad` 目录下看到 `fnnas.notepad.fpk` 文件，接下来你就可以到飞牛 fnOS 上测试应用了

### 集成编辑[​](#集成编辑 "集成编辑的直接链接")

如果我们希望每次 `npm run build` 编译项目时，都自动创建 `fpk` 文件，则可以在编译脚本中补充 `fnpack build` 逻辑。

在本项目中，可以在 `notepad/scripts/build-combined.js` 的最后补充 `fnpack build` 逻辑，如下所示:

```
const packDir = path.join(root, 'fnnas.notepad')  
const packServerDir = path.join(packDir, 'app', 'server');  
run(`rm -rf ${packServerDir}`)  
run(`mkdir ${packServerDir}`)  
run(`cp -r ${outDir}/* ${packServerDir}/`)  
run(`fnpack build -d ${packDir}`)
```

[上一页

💻 【实战】Docker 应用构建](/docs/core-concepts/docker)[下一页

📜 【规范】图标 Icon](/docs/core-concepts/icon)

* [一个简单的 Notepad 应用](#一个简单的-notepad-应用)
* [创建飞牛 fnOS 应用打包目录](#创建飞牛-fnos-应用打包目录)
  + [复制编译产物](#复制编译产物)
  + [编辑应用基本信息](#编辑应用基本信息)
  + [编辑应用权限](#编辑应用权限)
  + [编辑应用配置](#编辑应用配置)
  + [编辑应用启停脚本](#编辑应用启停脚本)
  + [编辑桌面图标](#编辑桌面图标)
* [打包成 fpk](#打包成-fpk)
  + [集成编辑](#集成编辑)

![](https://static2.fnnas.com/official/logo1.svg)

![](https://static2.fnnas.com/official/logo3.svg)

![](https://static2.fnnas.com/official/logo5.svg)

![](https://static2.fnnas.com/official/logo11.svg)

![](https://static2.fnnas.com/official/logo7.svg)

![](https://static2.fnnas.com/official/logo9.svg)

![icon](https://static2.fnnas.com/official/logo1.svg)

![icon](https://static2.fnnas.com/official/logo3.svg)

![icon](https://static2.fnnas.com/official/logo5.svg)

![icon](https://static2.fnnas.com/official/logo11.svg)

![icon](https://static2.fnnas.com/official/logo7.svg)

![icon](https://static2.fnnas.com/official/logo9.svg)

* [隐私协议](https://www.fnnas.com/privacy)
* [服务条款](https://www.fnnas.com/terms)
* [联系我们](https://help.fnnas.com/articles/fnosV1/contact/contact-us.md)
* [加入我们](https://www.zhipin.com/gongsi/ab73b7cfacff99221XB_2tu8E1I~.html?ka=company-intro)

Copyright © 广州铁刃智造技术有限公司 版权所有

[粤ICP备2023020469号](https://beian.miit.gov.cn/#/Integrated/recordQuery)