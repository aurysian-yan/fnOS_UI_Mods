<div align="center">
<img width="64" height="64" alt="Group 4" src="https://github.com/user-attachments/assets/babf83e2-424d-466f-a50c-f2045481f045" />
<h1>FnOS_UI_Mods</h1>
<p>为 FnOS 的 UI 增加平滑圆角、毛玻璃背景及更多的悬停动画</p>
</div>
<img width="1920" height="1080" alt="Frame 6" src="https://github.com/user-attachments/assets/5e3c9275-1262-4f38-9daf-9b2edcc83856" />

## 介绍
基于向 WebUI HTML 内注入 CSS 与 JS 来实现修改样式和平滑圆角。使用了`corner-shape`属性来实现平滑圆角，需要 Chrome 139 版本及以上才能获得最佳效果。

### 可选项
窗口标题栏提供传统（类 Windows）与反转（类 macOS）两种样式：

!["传统"样式预览](https://github.com/user-attachments/assets/518ea41c-bc6e-4acf-a7e2-dac3107c382f)
!["反转"样式预览](https://github.com/user-attachments/assets/821c2176-768a-4eaa-8a38-5c6d56c6e2dd)

## 使用方法：
1. 拉取源代码
2. 将文件存放到 NAS 内，并使用 SSH 连接到 NAS
3. 在终端内执行`inject_fnos.sh`，进行 CSS 与 JS 的注入
4. 刷新 WebUI 页面

## 请注意：
本项目是对官方 WebUI HTML 文件的补丁项目，其原理为：动态向官方 WebUI 的 HTML head 部分插入自定义 patch 内容，用以增强 UI 层级显示和用户自定义功能。本项目可能依赖或受 WebUI 官方版本更新影响，如官方结构调整，本补丁可能无法正常工作或出现兼容性问题。不对补丁在未来版本中的可用性、兼容性或迁移支持做出任何保证。
**该项目为个人开发学习作品，并非飞牛官方内容，也未得到飞牛官方授权或认可。**

### 使用风险提示
本项目按“现状”（AS IS）提供，不提供任何明示或暗示的担保，包括但不限于适销性、适用于特定用途或不侵权等任何保证。用户在使用本项目及其修改或衍生版本时可能会遇到错误或意外行为，对使用过程中出现的任何问题（包括但不限于数据丢失、系统异常等），**用户需自行承担全部风险与责任**。在任何情况下，作者及贡献者对因使用本项目而导致的任何损害（直接、间接、偶发、特殊或后果性损害）均不承担责任。
