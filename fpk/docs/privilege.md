📚 【基础】应用权限 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/core-concepts/privilege)

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
* 📚 【基础】应用权限

本页总览

📚 【基础】应用权限
==========

权限就像是应用的"权限清单"，决定了应用在系统中能做什么、不能做什么。在 `config/privilege` 文件中，您可以定义应用运行时的权限级别和用户身份。

默认权限模式[​](#默认权限模式 "默认权限模式的直接链接")
--------------------------------

大多数应用都使用默认权限模式，这是最安全的运行方式：

### 应用用户运行[​](#应用用户运行 "应用用户运行的直接链接")

应用默认以**应用用户**的身份运行，这意味着：

* 系统会为您的应用创建一个专用的用户和用户组
* 所有应用进程都以这个专用用户身份运行
* 应用文件的所有者也是这个专用用户
* 应用只能访问自己的目录和系统允许的公共资源

### 用户配置[​](#用户配置 "用户配置的直接链接")

您可以通过以下字段自定义应用用户：

config/privilege

```
{  
    "defaults": {  
        "run-as": "package"  
    },  
    "username": "myapp_user",  
    "groupname": "myapp_group"  
}
```

* `username` - 应用专用用户名，默认为 manifest 中的 `appname`
* `groupname` - 应用专用用户组名，默认为 manifest 中的 `appname`
* `run-as` - 运行身份，默认为 `package`（应用用户）

如果未指定用户名和组名，系统会自动使用应用名称（对应 `manifest` 中的 `appname` 字段）创建用户和用户组。

Root 权限模式[​](#root-权限模式 "Root 权限模式的直接链接")
-----------------------------------------

重要提醒

Root 权限模式仅适用于飞牛官方合作的企业开发者。第三方应用默认无法在应用中心发布需要 root 权限的应用。

### 何时需要 Root 权限[​](#何时需要-root-权限 "何时需要 Root 权限的直接链接")

某些应用可能需要访问系统级资源或执行特权操作，比如：

* 修改系统配置文件
* 访问硬件设备
* 管理其他用户或服务
* 安装系统级软件包

### 配置方式[​](#配置方式 "配置方式的直接链接")

将 `run-as` 设置为 `root` 即可获得 root 权限：

config/privilege

```
{  
    "defaults": {  
        "run-as": "root"  
    },  
    "username": "myapp_user",  
    "groupname": "myapp_group"  
}
```

### Root 权限的影响[​](#root-权限的影响 "Root 权限的影响的直接链接")

启用 root 权限后：

* 应用脚本以 root 身份执行
* 应用进程可以以 root 身份或指定的应用用户身份运行
* 应用文件的所有者变为 root 用户
* 系统仍会创建应用专用用户和用户组（用于特定场景）

外部文件访问权限[​](#外部文件访问权限 "外部文件访问权限的直接链接")
--------------------------------------

### 默认限制[​](#默认限制 "默认限制的直接链接")

出于安全考虑，应用默认无法访问用户的个人文件。用户需要在应用设置中明确授权后，应用用户才能访问特定目录。

### 授权方式[​](#授权方式 "授权方式的直接链接")

方式一：用户可以在**应用设置**页面中：

![](https://static.fnnas.com/appcenter-marketing/20250829122923375.png)

1. 选择要授权的目录或文件
2. 设置访问权限类型：
   * **读写权限**：应用可以读取和修改文件
   * **只读权限**：应用只能读取文件，不能修改
   * **禁止访问**：应用无法访问该路径

方式二：通过 `config/resource` 的 `data-share` 设置默认的共享目录

权限最佳实践[​](#权限最佳实践 "权限��最佳实践的直接链接")
----------------------------------

### 安全原则[​](#安全原则 "安全原则的直接链接")

1. **默认安全**：优先使用应用用户模式，避免不必要的 root 权限
2. **明确授权**：通过向导让用户明确了解应用需要的权限

```
### 权限检查  
在应用脚本中，您可以检查当前运行的用户身份：  
  
```bash  
#!/bin/bash  
  
echo "当前运行用户: $TRIM_RUN_USERNAME"  
echo "应用专用用户: $TRIM_USERNAME"  
  
if [ "$TRIM_RUN_USERNAME" = "root" ]; then  
    echo "应用以 root 权限运行"  
else  
    echo "应用以应用用户权限运行"  
fi
```

通过合理的权限配置，您的应用既能够正常运行，又不会对系统安全造成威胁。

[上一页

📚 【基础】环境变量](/docs/core-concepts/environment-variables)[下一页

📚 【基础】应用资源](/docs/core-concepts/resource)

* [默认权限模式](#默认权限模式)
  + [应用用户运行](#应用用户运行)
  + [用户配置](#用户配置)
* [Root 权限模式](#root-权限模式)
  + [何时需要 Root 权限](#何时需要-root-权限)
  + [配置方式](#配置方式)
  + [Root 权限的影响](#root-权限的影响)
* [外部文件访问权限](#外部文件访问权限)
  + [默认限制](#默认限制)
  + [授权方式](#授权方式)
* [权限最佳实践](#权限最佳实践)
  + [安全原则](#安全原则)

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