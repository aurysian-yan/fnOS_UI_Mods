📦　fnpack | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/cli/fnpack)

`ctrl``K`

* [👋　欢迎加入](/docs/guide)
* [🚀　快速开始](/docs/category/快速开始)
* [📘　开发指南](/docs/category/开发指南)
* [🔧　CLI 开发工具](/docs/category/cli-开发工具)

  + [📦　fnpack](/docs/cli/fnpack)
  + [⚙️　appcenter-cli](/docs/cli/appcentercli)
* [🔄　文档更新日志](/docs/category/文档更新日志)

* [🔧　CLI 开发工具](/docs/category/cli-开发工具)
* 📦　fnpack

本页总览

📦　fnpack
========

`fnpack` 是飞牛 fnOS 应用打包的便利工具，它帮助您快速创建应用项目结构并将应用打包成可安装的 `fpk` 文件。无论您是初学者还是经验丰富的开发者，这个工具都能让应用开发变得更加简单高效。

更新提示

本文档于 **2025-12-31** 新增了部分内容。

工具下载Update![​](#工具下载update "工具下载update的直接链接")
---------------------------------------------

`fnpack` 已预置到飞牛 fnOS 中，同时也支持在本地使用，可根据操作系统进行下载：

* **Windows x86**: [fnpack-1.2.1-windows-amd64](https://static2.fnnas.com/fnpack/fnpack-1.2.1-windows-amd64)
* **Linux x86**: [fnpack-1.2.1-linux-amd64](https://static2.fnnas.com/fnpack/fnpack-1.2.1-linux-amd64)
* **Linux ARM**: [fnpack-1.2.1-linux-arm64](https://static2.fnnas.com/fnpack/fnpack-1.2.1-linux-arm64)
* **Mac Intel**: [fnpack-1.2.1-darwin-amd64](https://static2.fnnas.com/fnpack/fnpack-1.2.1-darwin-amd64)
* **Mac M系列**: [fnpack-1.2.1-darwin-arm64](https://static2.fnnas.com/fnpack/fnpack-1.2.1-darwin-arm64)

创建应用项目[​](#创建应用项目 "创建应用项目的直接链接")
--------------------------------

### 基本创建命令[​](#基本创建命令 "基本创建命令的直接链接")

使用 `fnpack create` 命令可以快速创建应用项目：

```
# 创建独立项目  
fnpack create <appname>  
# 不带应用访问入口，使用纯服务类型的项目  
fnpack create <appname> --without-ui true  
  
# 创建 Docker 应用项目  
fnpack create <appname> --template docker  
# 无应用访问入口Docker应用，使用纯服务类型的项目  
fnpack create <appname> --template docker --without-ui true
```

### 关于 Docker 应用模板[​](#关于-docker-应用模板 "关于 Docker 应用模板的直接链接")

* 自动生成 `docker-compose.yaml` 文件，需手动编辑
* 自动生成 `shares/data` 目录的挂载映射配置，可自行修改
* 自动生成 `cmd/main` 的 `status` 检查代码，可自行修改

### 项目结构示例[​](#项目结构示例 "项目结构示例的直接链接")

创建后的项目结构如下：

```
myapp/  
├── app/                            # 应用可执行文件目录  
│   ├── ui/  
│   │   ├── images/  
│   │   └── config  
│   └── docker/                     # Docker 配置（Docker 应用模板）  
│       └── docker-compose.yaml  
├── cmd/                            # 应用生命周期管理脚本  
│   ├── main  
│   ├── install_init  
│   ├── install_callback  
│   ├── uninstall_init  
│   ├── uninstall_callback  
│   ├── upgrade_init  
│   ├── upgrade_callback  
│   ├── config_init  
│   └── config_callback  
├── config/  
│   ├── privilege                   # 应用权限配置  
│   └── resource                    # 应用资源配置  
├── wizard/  
│   ├── install                     # 安装向导配置  
│   ├── uninstall                   # 卸载向导配置  
│   └── config                      # 配置向导  
├── manifest                        # 应用基本信息  
├── LICENSE                         # 许可证文件  
├── ICON.PNG                        # 应用图标（64x64）  
└── ICON_256.PNG                    # 应用图标（256x256）
```

打包应用项目[​](#打包应用项目 "打包应用项目的直接链接")
--------------------------------

### 基本打包命令[​](#基本打包命令 "基本打包命令的直接链接")

使用 `fnpack build` 命令将应用打包成 `fpk` 文件

```
# 在应用目录中执行打包  
cd myapp  
fnpack build  
  
## 指定打包的目录  
fnpack build --directory <path>
```

打包校验规则：

| 路径 | 类型 | 校验规则 |
| --- | --- | --- |
| `manifest` | 文件 | 必须存在，且必选字段存在 |
| `config/privilege` | 文件 | 必须存在，且符合 `JSON` 格式 |
| `config/resource` | 文件 | 必须存在，且符合 `JSON` 格式 |
| `ICON.PNG` | 文件 | 必须存在 |
| `ICON_256.PNG` | 文件 | 必须存在 |
| `app/` | 目录 | 必须存在 |
| `cmd/` | 目录 | 必须存在 |
| `wizard/` | 目录 | 必须存在 |
| `app/{manifest.desktop_uidir}/` | 目录 | 若有定义，则目录必须存在 |

### 本地安装工具方法[​](#本地安装工具方法 "本地安装工具方法的直接链接")

```
# Linux/macOS 安装  
chmod +x fnpack-1.2.1-linux-amd64  
sudo mv fnpack-1.2.1-linux-amd64 /usr/local/bin/fnpack  
  
# 验证安装  
fnpack --help
```

最佳实践[​](#最佳实践 "最佳实践的直接链接")
--------------------------

1. **模板选择**：根据应用类型选择合适的模板
2. **集成编译**：将打包目录创建于代码目录下，并将 **`fnpack build`** 命令集成到代码编译脚本中

通过合理使用 **fnpack**，您可以更高效地开发和管理飞牛 **fnOS** 应用，专注于应用功能本身而不是繁琐的配置工作。

[上一页

🔧　CLI 开发工具](/docs/category/cli-开发工具)[下一页

⚙️　appcenter-cli](/docs/cli/appcentercli)

* [工具下载Update!](#工具下载update)
* [创建应用项目](#创建应用项目)
  + [基本创建命令](#基本创建命令)
  + [关于 Docker 应用模板](#关于-docker-应用模板)
  + [项目结构示例](#项目结构示例)
* [打包应用项目](#打包应用项目)
  + [基本打包命令](#基本打包命令)
  + [本地安装工具方法](#本地安装工具方法)
* [最佳实践](#最佳实践)

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