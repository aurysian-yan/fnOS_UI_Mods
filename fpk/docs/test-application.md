🧪　测试应用 | 飞牛应用开放平台







[跳到主要内容](#__docusaurus_skipToContent_fallback)

[![Logo](/img/logo.png)

**飞牛应用开放平台**](/)[开发文档](/docs/guide)

[简体中文](#)

* [简体中文](/docs/quick-started/test-application)

`ctrl``K`

* [👋　欢迎加入](/docs/guide)
* [🚀　快速开始](/docs/category/快速开始)

  + [📋　准备工作](/docs/quick-started/prerequisites)
  + [✨　创建应用](/docs/quick-started/create-application)
  + [🧪　测试应用](/docs/quick-started/test-application)
  + [📤　上架应用](/docs/quick-started/publish-application)
* [📘　开发指南](/docs/category/开发指南)
* [🔧　CLI 开发工具](/docs/category/cli-开发工具)
* [🔄　文档更新日志](/docs/category/文档更新日志)

* [🚀　快速开始](/docs/category/快速开始)
* 🧪　测试应用

本页总览

🧪　测试应用
======

安装 fpk[​](#安装-fpk "安装 fpk的直接链接")
--------------------------------

将 fpk 文件放置到飞牛 fnOS 设备上安装测试：

### 方式一[​](#方式一 "方式一的直接链接")

使用 `appcenter-cli` 工具操作

```
appcenter-cli install-fpk App.Native.HelloFnosAppCenter.fpk
```

### 方式二[​](#方式二 "方式二的直接链接")

![](https://static.fnnas.com/appcenter-marketing/20250829100144099.png)

提示

手动安装入口仅用于应用测试用途，不得用于应用分发。温馨提醒，在系统后续更新中，将补充签名校验逻辑。

手动安装入口默认关闭，你可以 ssh 登录飞牛 fnOS 后输入以下命令开启

```
appcenter-cli manual-install enable
```

查看启动停止日志[​](#查看启动停止日志 "查看启动停止日志的直接链接")
--------------------------------------

按照 `cmd/main` 的配置，日志位置为 `/var/apps/App.Native.HelloFnosAppCenter/var/info.log`，可检查是否正常运行

点击桌面图标[​](#点击桌面图标 "点击桌面图标的直接链接")
--------------------------------

安装并启动完成后，桌面将出现名为 **应用中心案例** 的图标，点击即可访问应用

[上一页

✨　创建应用](/docs/quick-started/create-application)[下一页

📤　上架应用](/docs/quick-started/publish-application)

* [安装 fpk](#安装-fpk)
  + [方式一](#方式一)
  + [方式二](#方式二)
* [查看启动停止日志](#查看启动停止日志)
* [点击桌面图标](#点击桌面图标)

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