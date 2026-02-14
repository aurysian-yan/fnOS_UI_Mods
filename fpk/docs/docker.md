💻 【实战】Docker 应用构建 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/core-concepts/docker)

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
* 💻 【实战】Docker 应用构建

本页总览

💻 【实战】Docker 应用构建
=================

创建应用[​](#创建应用 "创建应用的直接链接")
--------------------------

使用 `fnpack create my-app -t docker` 命令创建应用目录，my-app 请自行替换为你的应用名。
创建后的应用目录结构如下：

```
my-app/  
├── app/                            # 🗂️ 应用可执行文件目录  
│   ├── docker/                     # 🗂️ Docker 资源目录  
│   │   └── docker-compose.yaml     # Docker Compose 编排文件  
│   ├── ui/                         # 🗂️ 应用入口及视图  
│   │   ├── images/                 # 🗂️ 应用图标及图片资源目录  
│   │   └── config                  # 应用入口配置文件  
├── manifest                        # 应用包基本信息描述文件  
├── cmd/                            # 🗂️ 应用生命周期管理脚本  
│   ├── main                        # 应用主脚本，用于启动、停止、检查应用状态  
│   ├── install_init                # 应用安装初始化脚本  
│   ├── install_callback            # 应用安装回调脚本  
│   ├── uninstall_init              # 应用卸载初始化脚本  
│   ├── uninstall_callback          # 应用卸载回调脚本    
│   ├── upgrade_init                # 应用更新初始化脚本  
│   ├── upgrade_callback            # 应用更新回调脚本  
│   ├── config_init                 # 应用配置初始化脚本  
│   └── config_callback             # 应用配置回调脚本  
├── config/                         # 🗂️ 应用配置目录  
│   ├── privilege                   # 应用权限配置  
│   └── resource                    # 应用资源配置  
├── wizard/                         # 🗂️ 应用向导目录  
├── LICENSE                         # 应用许可证文件  
├── ICON.PNG                        # 应用包 64*64 图标文件  
└── ICON_256.PNG                    # 应用包 256*256 图标文件
```

1. 编辑 manifest 文件[​](#1-编辑-manifest-文件 "1. 编辑 manifest 文件的直接链接")
----------------------------------------------------------------

定义必须字段：

* `appname` - 应用的唯一标识符，就像人的身份证号一样，在整个系统中必须是唯一的
* `version` - 应用版本号，格式为 `x[.y[.z]][-build]`，例如：`1.0.0`、`2.1.3-beta`
* `display_name` - 在应用中心和应用设置中显示的名称，用户看到的就是这个名字
* `desc` - 应用的详细介绍，支持 HTML 格式，可以包含链接、图片等

其他字段可参考 [manifest指南](/docs/core-concepts/manifest) ，按需进行定义

2. 编辑 docker-compose.yaml 文件[​](#2-编辑-docker-composeyaml-文件 "2. 编辑 docker-compose.yaml 文件的直接链接")
------------------------------------------------------------------------------------------------

系统将根据 `docker-compose.yaml` 创建和启动容器编排。详细 compose 使用方法可移步 [Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)

`docker-compose.yaml` 允许使用环境变量，在执行前将进行替换，相关环境变量可参考 [环境变量指南](/docs/core-concepts/environment-variables)

3. 检查应用启停状态[​](#3-检查应用启停状态 "3. 检查应用启停状态的直接链接")
----------------------------------------------

默认情况下，无需定义启停逻辑，因为 Docker 应用的启停均由应用中心执行 compose 来管理。

然而，依然需要定义 Docker 应用是否在运行中，脚本中默认选择第一个容器的状态作为应用的启停状态，如不符合期望，可自行修改高亮部分。

/cmd/main

```
#!/bin/bash  
  
FILE_PATH="${TRIM_APPDEST}/docker/docker-compose.yaml"  
  
is_docker_running () {  
    DOCKER_NAME=""  
  
    if [ -f "$FILE_PATH" ]; then  
        DOCKER_NAME=$(cat $FILE_PATH | grep "container_name" | awk -F ':' '{print $2}' | xargs)  
        echo "DOCKER_NAME is set to: $DOCKER_NAME"  
    fi  
  
  
    if [ -n "$DOCKER_NAME" ]; then  
        docker inspect $DOCKER_NAME | grep -q "\"Status\": \"running\"," || exit 1  
        return  
    fi  
}  
  
case $1 in  
start)  
    # run start command. exit 0 if success, exit 1 if failed  
    # do nothing, docker application will be started by appcenter  
    exit 0  
    ;;  
stop)  
    # run stop command. exit 0 if success, exit 1 if failed  
    # do nothing, docker application will be stopped by appcenter  
    exit 0  
    ;;  
status)  
    # check application status command. exit 0 if running, exit 3 if not running  
    # check first container by default, you cound modify it by yourself  
    if is_docker_running; then  
        exit 0  
    else  
        exit 3  
    fi  
    ;;  
*)  
    exit 1  
    ;;  
esac%
```

4. 定义用户入口[​](#4-定义用户入口 "4. 定义用户入口��的直接链接")
------------------------------------------

即定义在飞牛 fnOS 上的桌面图标，详情可参考 [用户入口指南](/docs/core-concepts/app-entry)

5. 执行打包和测试[​](#5-执行打包和测试 "5. 执行打包和测试的直接链接")
-------------------------------------------

在根目录，使用 `fnpack build` 命令进行打包，获得 `fpk` 文件，参考 [测试应用指南](/docs/quick-started/test-application) 进行实机测试

[上一页

🔥 【进阶】中间件服务](/docs/core-concepts/middleware)[下一页

💻 【实战】Native 应用构建](/docs/core-concepts/native)

* [创建应用](#创建应用)
* [1. 编辑 manifest 文件](#1-编辑-manifest-文件)
* [2. 编辑 docker-compose.yaml 文件](#2-编辑-docker-composeyaml-文件)
* [3. 检查应用启停状态](#3-检查应用启停状态)
* [4. 定义用户入口](#4-定义用户入口)
* [5. 执行打包和测试](#5-执行打包和测试)

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