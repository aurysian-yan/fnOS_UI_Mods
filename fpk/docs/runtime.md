🔥 【进阶】运行时环境 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/core-concepts/runtime)

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
* 🔥 【进阶】运行时环境

本页总览

🔥 【进阶】运行时环境
===========

Python 环境[​](#python-环境 "Python 环境的直接链接")
-----------------------------------------

![](https://static.fnnas.com/appcenter-marketing/20250916211501441.png)

通过 `manifest` 声明应用依赖指定版本的 Python 应用，应用中心将确保您的应用安装和启动时指定的 Python 环境已安装。

manifest

```
install_dep_apps=python312
```

在 `cmd` 相关脚本执行 python 命令前，需预先配置环境，将目标版本的 bin 路径置于 PATH 环境变量最前端，以确保当前命令行会话能正确调用指定版本的 python 及 pip 等命令。在此基础上，使用 Python 内置的 venv 模块为每个项目创建独立的虚拟环境，以隔离项目依赖，避免版本冲突。

```
# 可选版本：python312、python311、python310、python39、python38  
export PATH=/var/apps/python312/target/bin:$PATH  
  
# 创建虚拟环境  
python3 -m venv .venv  
  
# 激活虚拟环境  
source .venv/bin/activate  
  
# 安装 python 相关依赖到 .venv  
pip install -r requirements.txt
```

Node.js 环境[​](#nodejs-环境 "Node.js 环境的直接链接")
-------------------------------------------

![](https://static.fnnas.com/appcenter-marketing/20250916211008763.png)

通过 `manifest` 声明应用依赖指定版本的 Node.js 应用，应用中心将确保您的应用安装和启动时指定的 Node.js 环境已安装。

manifest

```
install_dep_apps=nodejs_v22
```

在 `cmd` 相关脚本执行前，需预先配置环境，将目标版本的 bin 路径置于 PATH 环境变量最前端，以确保当前命令行会话能正确调用指定版本的 node 及 npm 等命令。

```
# 可选版本：nodejs_v22、nodejs_v20、nodejs_v18、nodejs_v16、nodejs_v14  
export PATH=/var/apps/nodejs_v22/target/bin:$PATH  
  
# 确认node的版本  
node -v  
  
# 确认npm的版本  
npm -v
```

Java 环境[​](#java-环境 "Java 环境的直接链接")
-----------------------------------

![](https://static.fnnas.com/appcenter-marketing/20250919153027253.png)

通过 `manifest` 声明应用依赖指定版本的 Java 应用，应用中心将确保您的应用安装和启动时指定的 Java 环境已安装。

manifest

```
install_dep_apps=java-21-openjdk
```

在 `cmd` 相关脚本执行前，需预先配置环境，将目标版本的 bin 路径置于 PATH 环境变量最前端，以确保当前命令行会话能正确调用指定版本的 java 等命令。

```
# 可选版本：java-21-openjdk、java-17-openjdk、java-11-openjdk  
export PATH=/var/apps/java-21-openjdk/target/bin:$PATH  
  
# 确认java的版本  
java --version
```

[上一页

🔥 【进阶】应用依赖关系](/docs/core-concepts/dependency)[下一页

🔥 【进阶】中间件服务](/docs/core-concepts/middleware)

* [Python 环境](#python-环境)
* [Node.js 环境](#nodejs-环境)
* [Java 环境](#java-环境)

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