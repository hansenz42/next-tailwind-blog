---
name: blog-diagrams
description: 为当前博客制作、修改和插入统一风格的中文示意图、数据结构图与流程图。用于文章配图或图示占位替换，沿用已确认的浅底、青绿点缀、圆角卡片风格；不约束摄影、封面插画或其他项目。
---

# 博客示意图风格

本 Skill 固定用户在 Ontology 文档预处理文章中确认的配图样式。后续本博客的同类图示默认沿用；用户明确指定的新要求优先。固定视觉语言，不固定文章领域、字段或业务流程。

## 视觉基准

制作前查看至少一张下列参考图。路径相对本文件；它们是项目内的持久化参考，不依赖聊天历史或生成工具的临时目录。

- [基础卡片样式](../../../public/static/blog/2026-10-28-doc-ontology-keywords/01-candidate-structure.png)：字体、留白、字段行与嵌套位置卡片的首选基准。
- [层级结构](../../../public/static/blog/2026-10-28-doc-ontology-keywords/02-document-meta.png)：父级卡片连接子级卡片。
- [循环流程](../../../public/static/blog/2026-10-28-doc-ontology-keywords/03-close-reading-loop.png)：输入、处理、判断、回路与输出。
- [字段扩展示例](../../../public/static/blog/2026-10-28-doc-ontology-keywords/04-candidate-evidence.png)：同一结构随处理逐步丰富。
- [分批汇总](../../../public/static/blog/2026-10-28-doc-ontology-keywords/05-normalization.png)：分组框选、处理与统一归并。

参考图仅约束风格与适用的布局，不要求把注意力机制、Ontology、证据字段等内容复制到其他文章。

## 视觉规范

- 横向画布默认 3:2，参考成品为 1536 × 1024；复杂图可以调整比例，优先保证博客正文宽度下的可读性。
- 暖白或极浅灰背景，白色卡片，深炭色文字，低饱和青绿色强调。颜色近似值供新图对齐：背景 `#FAFAF7`、卡片 `#FFFFFF`、主文字 `#101C26`、次文字 `#596873`、边框 `#7B8C96`、青绿 `#087D82`、浅青绿 `#D7EFEB`。这些是复现参考图的建议值，不是从成品精确采样的色值。
- 中文无衬线字体；左上主标题加粗、简短，下面可放一行较轻的说明。字号层级为标题、卡片标题、字段正文、辅助说明。
- 统一圆角和细边框，宽松留白，整齐对齐。用嵌套卡片、浅色分组与少量标签突出结构。
- 连线细而清楚；主流程以灰蓝箭头为主，循环或关键汇聚可用青绿。辅助上下文用虚线，与主流程区分。
- 不使用 3D、拟物、花哨渐变、厚重阴影、装饰性人物、无关图标、水印或虚构品牌标志。
- 中文标签优先，沿用正文已有的必要英文术语。减少图内长句，不用缩小字体塞入全部正文。

## 内容与布局

先从文章确定每张图要解释的一个问题，再选择布局：

- 数据结构图：用一个代表性条目展示必要字段；嵌套卡片表示多个出现位置或子项，不用大量重复条目填满画面。
- 层级图：上层对象连接下层对象，区分全局信息和局部信息；字段标签即可，不必编造具体值。
- 流程图：明确输入、处理、判断、循环和输出。回路须说明下一轮沿用什么状态；箭头不能暗示正文不存在的步骤。
- 分批整理图：用框选表现批次，处理后汇入统一结果；如果需要跨批次合并，应画清合并点。
- 同一数据结构的前后状态：沿用字段顺序和卡片布局，突出新增信息，不暗示每阶段另建无关的数据结构。

示例数据明确标注“示例数据，仅展示字段结构”。文章没有提供真实结果时，不把示例伪装为实验输出。业务细节以当前文章和必要的项目源码为准；不要仅为仿照样图添加字段或流程。特别留意阶段边界：例如本篇细读追加证据、建议与批注，归一化合并属于后续整理阶段。

## 生成与校验

默认用内置图片生成工具制作与已确认成品一致的 PNG，并把项目参考图作为风格参考输入。若用户要求可编辑 SVG，使用相同视觉规范制作矢量图；不要把位图称为 SVG。

提示词包含：用途、参考图仅用于风格、画布比例、准确中文文字、布局、箭头方向、必须保留与不得添加的内容。可用以下风格前缀，后接当前图的具体要求：

> Create one Chinese editorial diagram for a blog. Match the supplied reference's flat card-based style: warm off-white background, white rounded cards, thin gray-blue borders, dark Chinese sans-serif typography, muted teal accents, generous whitespace. Landscape 3:2 by default. Large legible Chinese labels, short title at top left, optional one-line subtitle. Reference is for visual style only; use the supplied article content and exact labels. No 3D, decorative illustration, heavy shadows, logos or invented fields. Keep arrows and grouping faithful to the specified logic.

逐张查看成品，核对中文、字段、箭头、分组、循环状态与正文是否一致。发现语义错误时定点修正，保留其他已确认元素。既有风格已获确认，后续同风格配图可直接完成，无须每次再请求样式确认；若用户只要一张样图，则仅交付样图。

## 项目落地

- 按项目惯例，把正式图片统一保存到 `public/static/blog/<article-slug>/`，使用稳定且有顺序的文件名，例如 `01-candidate-structure.png`、`02-document-meta.png`。
- 网站引用使用 `/static/blog/<article-slug>/<filename>.png`，不要写入本机绝对路径、生成工具路径或 `public/` 前缀。
- 在对应 `data/blog/*.mdx` 的占位处插入 Markdown 图片并填写有意义的中文 alt 文本；遵循文件现有的图片写法。
- 同一篇文章的配图放在同一目录；避免覆盖仍被使用的参考图。只做样图预览时，不必提前插入文章。
- 插入后检查所有引用能解析到实际文件、图示占位已按任务范围替换、图片尺寸一致且正文内容编译正常。全站构建若受字体下载等外部依赖影响，如实区分内容编译结果和整站构建结果。
- 配图完成不自动意味着发布完成。保持当前草稿状态，除非用户授权发布；发现示例等未完成内容时明确指出，不编造补齐，也不宣称已上线。
