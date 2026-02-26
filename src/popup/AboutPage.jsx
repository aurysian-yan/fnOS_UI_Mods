export function AboutPage() {
  return (
    <div className="popup-about-page">
      <div className="card header popup-about-header">
        <div className="popup-about-kicker">FnOS UI Mods</div>
        <h1 className="popup-about-title">Popup Router</h1>
        <p className="popup-about-subtitle">
          这个页面由 React Router 壳层渲染，用于承载次级设置页。
        </p>
      </div>
      <div className="card popup-about-body">
        <div className="title">当前能力</div>
        <ul className="popup-about-list">
          <li>支持 hash 路由（适配扩展 popup）</li>
          <li>页面切换带滑动 + 淡入淡出过渡</li>
          <li>路由切换时保持原有 popup 功能不改动</li>
        </ul>
        <p className="tip">点击右下角按钮可返回主设置页。</p>
      </div>
    </div>
  );
}
