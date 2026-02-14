⚙️　appcenter-cli | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/cli/appcentercli)

`ctrl``K`

* [👋　欢迎加入](/docs/guide)
* [🚀　快速开始](/docs/category/快速开始)
* [📘　开发指南](/docs/category/开发指南)
* [🔧　CLI 开发工具](/docs/category/cli-开发工具)

  + [📦　fnpack](/docs/cli/fnpack)
  + [⚙️　appcenter-cli](/docs/cli/appcentercli)
* [🔄　文档更新日志](/docs/category/文档更新日志)

* [🔧　CLI 开发工具](/docs/category/cli-开发工具)
* ⚙️　appcenter-cli

本页总览

⚙️　appcenter-cli
================

`appcenter-cli` 是飞牛 fnOS 系统预装的应用中心管理工具，它让您能够通过命令行来管理应用的安装、配置和系统设置。无论您是开发者还是系统管理员，这个工具都能帮助您更高效地管理应用。

安装应用[​](#安装应用 "安装应用的直接链接")
--------------------------

### 通过 fpk 文件安装[​](#通过-fpk-文件安装 "通过 fpk 文件安装的直接链接")

使用 `appcenter-cli install-fpk` 命令可以安装打包好的应用文件：

```
# 基本安装命令  
appcenter-cli install-fpk myapp.fpk  
  
# 指定环境变量文件进行静默安装  
appcenter-cli install-fpk myapp.fpk --env config.env
```

#### 环境变量文件格式[​](#环境变量文件格式 "环境变量文件格式的直接链接")

当应用包含安装向导时，您可以通过环境变量文件来跳过交互式配置。环境变量文件使用简单的键值对格式：

config.env

```
# 应用配置  
wizard_admin_username=admin  
wizard_admin_password=mypassword123  
wizard_database_type=sqlite  
wizard_app_port=8080  
  
# 系统设置  
wizard_agree_terms=true
```

#### 设置默认安装位置[​](#设置默认安装位置 "设置默认安装位置的直接链接")

如果您的系统有多个存储空间，可以设置默认的安装位置：

```
# 查看当前默认存储空间  
appcenter-cli default-volume  
  
# 设置存储空间1为默认安装位置  
appcenter-cli default-volume 1  
  
# 设置存储空间2为默认安装位置  
appcenter-cli default-volume 2
```

### 从本地目录安装[​](#从本地目录安装 "从本地目录安装的直接链接")

当您在开发环境中测试应用时，可以直接从应用目录安装，无需先打包成 fpk 文件：

```
# 在应用开发目录中执行  
cd /path/to/myapp  
appcenter-cli install-local
```

这个命令会自动完成打包和安装过程，大大提升开发测试效率。

系统管理[​](#系统管理 "系统管理的直接链接")
--------------------------

### 手动安装功能[​](#手动安装功能 "手动安装功能的直接链接")

当您需要与团队成员分享应用时，可以临时开启手动安装功能：

```
# 查看当前状态  
appcenter-cli manual-install  
  
# 开启手动安装功能  
appcenter-cli manual-install enable  
  
# 关闭手动安装功能  
appcenter-cli manual-install disable
```

开启后，其他用户就可以通过应用中心的手动安装入口来安装您分享的 fpk 文件。

### 应用管理[​](#应用管理 "应用管理的直接链接")

```
# 查看已安装的应用列表  
appcenter-cli list  
  
# 启动应用  
appcenter-cli start myapp  
  
# 停止应用  
appcenter-cli stop myapp
```

最佳实践[​](#最佳实践 "最佳实践的直接链接")
--------------------------

### 安装前准备[​](#安装前准备 "安装前准备的直接链接")

1. **检查存储空间**：确保有足够的存储空间安装应用
2. **准备配置文件**：为包含向导的应用准备环境变量文件
3. **验证 fpk 文件**：确保 fpk 文件完整且未损坏

### 开发工作流[​](#开发工作流 "开发工作流的直接链接")

1. **本地开发**：使用 `install-local` 快速测试
2. **打包测试**：使用 `install-fpk` 测试打包版本
3. **配置管理**：使用环境变量文件管理不同环境的配置

### 安全考虑[​](#安全考虑 "安全考虑的直接链接")

* 手动安装功能仅在需要时开启，使用完毕后及时关闭
* 环境变量文件包含敏感信息，注意文件权限管理
* 生产环境安装前先在测试环境验证

通过合理使用 `appcenter-cli`，您可以更高效地管理飞牛 fnOS 应用，提升开发和部署效率。

[上一页

📦　fnpack](/docs/cli/fnpack)[下一页

🔄　文档更新日志](/docs/category/文档更新日志)

* [安装应用](#安装应用)
  + [通过 fpk 文件安装](#通过-fpk-文件安装)
  + [从本地目录安装](#从本地目录安装)
* [系统管理](#系统管理)
  + [手动安装功能](#手动安装功能)
  + [应用管理](#应用管理)
* [最佳实践](#最佳实践)
  + [安装前准备](#安装前准备)
  + [开发工作流](#开发工作流)
  + [安全考虑](#安全考虑)

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