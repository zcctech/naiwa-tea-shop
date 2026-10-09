# 奶娃奶茶铺

一款手机竖屏 3D 奶茶店经营游戏。主角奶娃负责欢迎顾客、制作与交付奶茶，玩家点击接待即可自动完成一单。

## 在线试玩

- [公开试玩](https://naiwa-tea-shop.fairflute32.chatgpt.site)
- [GitHub Pages](https://zcctech.github.io/naiwa-tea-shop/)

支持手机与电脑浏览器，无须登录，进度保存在当前浏览器本地。

## 内容

- 连续曲面奶娃模型、绿色眼圈、深色手脚、围裙和口袋。
- 欢迎招手、握杯摇奶茶、交付时的表情变化。
- 木质柜台、茶罐、杯架、灯具、窗外小镇与柔和阴影。
- 每日营业与结算，五级店铺升级。
- 绿植、花瓶、灯串、粉色与蓝色墙面，可购买和切换。
- 音乐与音效开关、本地存档、刷新后继续制作。

## 本地运行

在仓库目录启动一个静态服务器，例如安装 Python 后运行：

```sh
python -m http.server 8000
```

打开 `http://localhost:8000`。场景采用 JavaScript 模块，请通过静态服务器访问，直接双击 HTML 可能被浏览器的模块安全规则限制。

## 文件

- `index.html`：界面、经营规则与存档。
- `assets/scene.js`：奶娃建模、动作、材质、店铺陈设与光照。
- `assets/window-garden.jpg`：生成的窗外街景纹理。
- `assets/three.module.min.js`：固定版本的 Three.js 0.170.0，随游戏一起提供。
- `assets/THREE-LICENSE.txt`：Three.js 的 MIT 许可。

已检查手机尺寸与桌面布局、完整营业日、结算、升级及等级上限、全部装饰、声音与存档。模型是根据参考图片重新制作的程序化模型。
