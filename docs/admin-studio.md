# 博客运营工作台

入口：`/admin/`。与博客共用 Next.js / Vercel 项目，不需要数据库。

## 工作流

1. 使用管理 Token 登录，服务端签发 12 小时 HttpOnly / SameSite=Strict Cookie；生产环境启用 Secure。
2. 在文章库中搜索标题、摘要或标签，选择已发布文章或草稿。
3. 选择微信公众号或知乎，并选择青绿手记 / 墨色专栏。
4. 按需在 Markdown 页签临时修改正文。修改仅保留在当前页面，不写回 Git，刷新后丢弃。
5. 分别复制标题和正文，粘贴到目标平台。正文同时提供 `text/html` 和 `text/plain`。
6. 如果浏览器拒绝剪贴板权限，点击“选中正文”，使用系统复制快捷键。

公众号模式将链接转为文末参考链接；知乎模式保留超链接。图片使用博客域名下的绝对地址。目标平台可能清理样式或转存图片失败，发布前必须在平台预览。此功能不自动登录或发布到第三方平台。

## 支持范围

支持标准 Markdown、GFM 表格、任务列表、删除线、代码块、引用式链接、图片和脚注。Mermaid 和数学公式保留为源码 / LaTeX，并显示检查提示。原始 HTML / 自定义 MDX 组件转义为可见文本，不执行代码。代码块保留格式，暂未做语法高亮。标题单独复制，不加入正文。

文章来自 Contentlayer 的服务端 `allBlogs`，仅在通过身份验证后返回文章清单和所选正文，不向未登录页面注入文章数据。当前博客的索引模式为 `data/blog/**/*.mdx`；后台随博客重新部署更新内容，不支持在线新增或持久化编辑文章。

## 配置与部署

在 Vercel 当前博客项目中设置服务端环境变量 `BLOG_ADMIN_TOKEN`，至少 32 个字符，建议使用 36 字节随机生成值。不要使用 `NEXT_PUBLIC_` 前缀。未配置或值太短时，后台关闭且不能登录。

本次生成的登录凭据保存在本机 `.env.admin.local`，已在 Git 和 Vercel 上传列表中排除，文件权限为 0600。这不是 Next.js 自动加载的环境文件；本地开发可将该变量安全加入已有 `.env.local`，或通过进程环境注入。不要把凭据写进文章或版本控制。

部署前将同一 Token 配置到所需 Vercel 环境，再使用项目现有部署流程。后台要求服务器运行时，不支持 `EXPORT=1` 的纯静态导出。修改 Token 并重新部署将使旧会话失效。退出登录删除 `/admin` 下的会话 Cookie。

## 验证

- `node --test tests/admin-format.test.mjs`：平台转换及危险输入测试。
- `npx tsc --noEmit`：类型检查。
- `npx eslint app/admin lib/admin components/SiteFrame.tsx app/layout.tsx`：代码检查。
- `npm run build`：生产构建。
- 浏览器验收：错误 Token、正确登录、富文本剪贴板、平台切换、临时编辑、退出登录、移动端布局及博客前台。

## 设计参考

参考 [Markdown Nice](https://github.com/mdnice/markdown-nice) 的“Markdown → 主题排版 → 多平台复制”工作流；界面和转换器为本项目自行实现，未复制其源代码。
