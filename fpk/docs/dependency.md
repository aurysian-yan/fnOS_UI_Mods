🔥 【进阶】应用依赖关系 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/core-concepts/dependency)

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
* 🔥 【进阶】应用依赖关系

本页总览

🔥 【进阶】应用依赖关系
============

在飞牛 fnOS 应用生态中，应用之间可能存在依赖关系。理解和管理这些依赖关系对于应用的正确运行至关重要。

声明依赖关系[​](#声明依赖关系 "声明依赖关系的直接链接")
--------------------------------

应用依赖是指一个应用需要其他应用先安装并运行才能正常工作。在 `manifest` 文件中，通过 `install_dep_apps` 字段来声明应用依赖。

manifest

```
version=1.0.0  
install_dep_apps=dep2:dep1
```

依赖管理[​](#依赖管理 "依赖管理的直接链接")
--------------------------

### 依赖检查逻辑[​](#依赖检查逻辑 "依赖检查逻辑的直接链接")

应用中心在应用安装、启用、停用、卸载、更新等流程中，会自动检查依赖关系：

1. **安装和启用流程**：检查依赖应用是否已安装和已启用，如果未安装则自动安装，如果未启用则自动启用
2. **停用和卸载流程**：检查是否有其他应用依赖当前应用，如果有则提示自动停用
3. **更新流程**： 检查是否有其他应用依赖当前应用，如果有则提示更新期间自动停用

### 依赖顺序[​](#依赖顺序 "依赖顺序的直接链接")

当存在多个依赖时，执行自动安装和自动启用的顺序是从后往前一个一个执行。

```
# 正确的依赖顺序，安装时将先安装dep1，后安装dep2  
install_dep_apps=dep2:dep1  
  
# 错误的依赖顺序，如果dep2依赖于dep1，可能导致问题  
install_dep_apps=dep1:dep2
```

### 嵌套依赖处理[​](#嵌套依赖处理 "嵌套依赖处理的直接链接")

应用中心仅对一层依赖进行检查，不做递归检查。如果 **应用A** 依赖 **应用B**，但不直接依赖于 **应用C**，同时 **应用B** 又依赖 **应用C**，则需要在 **应用A** 中同时声明依赖 **应用B** 和 **应用C**：

```
# 嵌套依赖的平铺定义  
install_dep_apps=depB:depC
```

[上一页

📚 【基础】用户向导](/docs/core-concepts/wizard)[下一页

🔥 【进阶】运行时环境](/docs/core-concepts/runtime)

* [声明依赖关系](#声明依赖关系)
* [依赖管理](#依赖管理)
  + [依赖检查逻辑](#依赖检查逻辑)
  + [依赖顺序](#依赖顺序)
  + [嵌套依赖处理](#嵌套依赖处理)

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