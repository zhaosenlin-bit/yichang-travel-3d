# 宜昌旅游 3D · 峡江山水长卷

沉浸式 3D 宜昌旅游 — 用 WebGL 渲染峡江山水与四大标志性景点。

## 四大景点

- 三峡大坝 — 高峡出平湖 · 世界第一水电工程（巨型混凝土坝体、五级船闸、动态水波）
- 屈原故里 — 端午源头 · 世界文化名人（楚风古建筑、屋顶几何、翠竹夹道）
- 三峡人家 — 峡江风情 · 土家文化活化石（吊脚楼、桅帆船、溪流、山林）
- 宜昌城景 — 滨江之城 · 水电之都（城市夜景、滨江摩天楼、星空）

## 架构

- React 18 + Vite 5
- Three.js + React Three Fiber + Drei
- Performance Monitor 帧率自适应降级
- 完全程序化生成 4 个房间的所有几何体与纹理，零外部 3D 资源
- 滚动 + 视差相机（走廊中前进/视差）
- 传送系统（地图覆盖层点击站点）
- 深链接（`?room=dam` 等直接打开对应房间）

## 本地开发

```bash
npm install
npm run dev     # http://localhost:5174
npm run build   # 输出到 dist/
```

## 目录

```
src/
├── data/attractions.js          # 4 大景点定义
├── context/SceneContext.jsx     # 场景状态：传送、房间、覆盖层
├── hooks/useInfiniteCamera.js   # 无限相机：滚动 + 视差
├── components/
│   ├── canvas/                  # 3D 场景（Experience、入口、走廊、4 房间）
│   ├── dom/                     # 2D 覆盖层 Preloader / PaperTransition
│   └── ui/                      # 导航、地图、房间信息
└── styles/                      # SCSS 主题
```

## 操作

- 点击入口门 → 打开 → 进入走廊
- 走廊中滚动鼠标 → 前进 / 后退
- 点击门 → 进入对应景点
- 右上角「地图」→ 任意传送
- 右上角「菜单」→ 关于本站
- 房间内点击底部按钮或「返走廊」→ 回到走廊
