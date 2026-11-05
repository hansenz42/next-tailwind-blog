import { remark } from 'remark'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

type Node = {
  type: string
  value?: string
  children?: Node[]
  depth?: number
  url?: string
  alt?: string
  lang?: string
  ordered?: boolean
  start?: number | null
  identifier?: string
  checked?: boolean | null
}
export type Platform = 'wechat' | 'zhihu'
export type Theme = 'jade' | 'ink'
const escape = (value = '') =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!
  )

// Render a safe, deliberately small HTML vocabulary. Never evaluate MDX or copy raw HTML.
export function formatArticle(
  markdown: string,
  platform: Platform,
  theme: Theme,
  siteUrl: string,
  articleUrl: string
) {
  const warnings = new Set<string>()
  const links: string[] = []
  const color = theme === 'jade' ? '#147d70' : '#292c32'
  const tree = remark()
    .use(remarkGfm)
    .use(remarkCjkFriendly)
    .use(remarkMath)
    .parse(markdown) as Node
  const definitions = new Map<string, Node>()
  function collect(node: Node) {
    if (node.type === 'definition' || node.type === 'footnoteDefinition')
      definitions.set(`${node.type}:${node.identifier}`, node)
    node.children?.forEach(collect)
  }
  collect(tree)
  function safeUrl(value: string, image = false) {
    try {
      const url = new URL(value, value.startsWith('/') ? siteUrl : articleUrl + '/')
      if (['http:', 'https:'].includes(url.protocol) || (!image && url.protocol === 'mailto:'))
        return escape(url.href)
    } catch {
      /* Report unsupported addresses without rendering them. */
    }
    warnings.add('存在不支持的链接或图片地址，已移除地址。')
    return ''
  }
  const wrap = (tag: string, body: string, style = '', attrs = '') =>
    `<${tag}${style ? ` style="${style}"` : ''}${attrs}>${body}</${tag}>`
  function render(node: Node): string {
    const children = () => (node.children || []).map(render).join('')
    switch (node.type) {
      case 'root':
        return children()
      case 'text':
        return escape(node.value)
      case 'paragraph':
        return wrap('p', children(), 'margin:0 0 20px;line-height:1.85;')
      case 'heading':
        return wrap(
          `h${node.depth}`,
          children(),
          `font-size:${node.depth === 1 ? 28 : node.depth === 2 ? 22 : 18}px;font-weight:700;line-height:1.5;margin:32px 0 18px;color:${color};${node.depth === 2 ? `border-bottom:1px solid ${color};padding-bottom:10px;` : ''}`
        )
      case 'strong':
        return wrap('strong', children(), `font-weight:700;color:${color};`)
      case 'emphasis':
        return wrap('em', children())
      case 'delete':
        return wrap('del', children())
      case 'break':
        return '<br />'
      case 'thematicBreak':
        return '<hr style="border:0;border-top:1px solid #ddd;margin:30px 0;" />'
      case 'blockquote':
        return wrap(
          'blockquote',
          children(),
          `margin:22px 0;padding:16px 20px;border-left:3px solid ${color};background:#f4f7f6;color:#56615d;`
        )
      case 'list':
        return wrap(
          node.ordered ? 'ol' : 'ul',
          children(),
          'padding-left:26px;margin:16px 0;',
          node.ordered ? ` start="${node.start || 1}"` : ''
        )
      case 'listItem':
        return wrap(
          'li',
          (node.checked == null ? '' : node.checked ? '☑ ' : '☐ ') + children(),
          'margin:8px 0;'
        )
      case 'inlineCode':
        return wrap(
          'code',
          escape(node.value),
          'font-family:monospace;background:#f1f3f3;color:#a24c36;padding:2px 5px;border-radius:3px;'
        )
      case 'code':
        if (node.lang === 'mermaid')
          warnings.add('Mermaid 图表暂以源码保留，请替换为图片后再发布。')
        return wrap(
          'pre',
          wrap('code', escape(node.value)),
          'font-family:monospace;font-size:13px;line-height:1.7;background:#f3f5f4;padding:18px;overflow-x:auto;white-space:pre;'
        )
      case 'math':
      case 'inlineMath':
        warnings.add('数学公式暂以 LaTeX 文本保留，请在目标平台检查或替换为图片。')
        return wrap(
          node.type === 'math' ? 'p' : 'span',
          escape(node.value),
          'font-family:monospace;'
        )
      case 'linkReference': {
        const definition = definitions.get(`definition:${node.identifier}`)
        return definition ? render({ ...node, type: 'link', url: definition.url }) : children()
      }
      case 'imageReference': {
        const definition = definitions.get(`definition:${node.identifier}`)
        return definition
          ? render({ ...node, type: 'image', url: definition.url })
          : escape(node.alt)
      }
      case 'link': {
        const url = safeUrl(node.url || '')
        if (!url) return children()
        if (platform === 'wechat') {
          if (!links.includes(url)) links.push(url)
          return (
            children() +
            wrap('sup', `[${links.indexOf(url) + 1}]`, `color:${color};font-size:11px;`)
          )
        }
        return wrap('a', children(), `color:${color};text-decoration:underline;`, ` href="${url}"`)
      }
      case 'image': {
        const url = safeUrl(node.url || '', true)
        warnings.add('图片使用公开地址；粘贴后请检查平台是否成功转存，失败时需手动上传。')
        return url
          ? `<img src="${url}" alt="${escape(node.alt)}" style="max-width:100%;height:auto;display:block;margin:20px auto;" />`
          : escape(node.alt)
      }
      case 'table':
        return wrap(
          'table',
          (node.children || [])
            .map((row, index) =>
              wrap(
                'tr',
                (row.children || [])
                  .map((cell) =>
                    wrap(
                      index === 0 ? 'th' : 'td',
                      (cell.children || []).map(render).join(''),
                      `border:1px solid #dce2df;padding:10px;text-align:left;${index === 0 ? 'background:#f3f5f4;font-weight:700;' : ''}`
                    )
                  )
                  .join('')
              )
            )
            .join(''),
          'border-collapse:collapse;width:100%;font-size:14px;margin:20px 0;'
        )
      case 'footnoteReference':
        return wrap('sup', `[注 ${escape(node.identifier)}]`)
      case 'footnoteDefinition':
        return wrap(
          'p',
          `注 ${escape(node.identifier)}：${children()}`,
          'font-size:13px;color:#64706b;'
        )
      case 'definition':
        return ''
      case 'html':
        warnings.add('原始 HTML / MDX 组件未执行，已按文本保留，请检查并改为 Markdown。')
        return wrap('p', escape(node.value), 'color:#996333;white-space:pre-wrap;')
      default:
        warnings.add(`存在待检查的格式：${node.type}`)
        return node.value ? escape(node.value) : children()
    }
  }
  let body = render(tree)
  if (/^\s*(import|export)\s/m.test(markdown))
    warnings.add('检测到 import / export，请检查是否为 MDX 声明并从发布正文中移除。')
  if (links.length)
    body += wrap(
      'section',
      wrap('h3', '参考链接') +
        links
          .map((url, i) =>
            wrap('p', `[${i + 1}] ${url}`, 'font-size:12px;word-break:break-all;margin:8px 0;')
          )
          .join(''),
      'border-top:1px solid #ddd;margin-top:32px;padding-top:12px;'
    )
  return {
    html: wrap(
      'section',
      body,
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.85;color:#303a35;word-wrap:break-word;text-align:left;'
    ),
    warnings: [...warnings],
  }
}
