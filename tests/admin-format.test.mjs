import assert from 'node:assert/strict'
import { test } from 'node:test'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const temp = await mkdtemp(join(tmpdir(), 'blog-admin-test-'))
await build({
  entryPoints: ['lib/admin/format.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: join(temp, 'format.mjs'),
})
const { formatArticle } = await import(pathToFileURL(join(temp, 'format.mjs')).href)
await rm(temp, { recursive: true, force: true })
const format = (text, platform = 'wechat') =>
  formatArticle(text, platform, 'jade', 'https://example.com', 'https://example.com/blog/article')

test('wechat exports inline styles and deduplicated reference URLs', () => {
  const { html } = format('## 标题\n\n[一](https://example.org) 和 [二](https://example.org)')
  assert.match(html, /style=/)
  assert.match(html, /参考链接/)
  assert.equal((html.match(/https:\/\/example.org\//g) || []).length, 1)
  assert.doesNotMatch(html, /<a /)
})
test('zhihu retains safe links and absolute image addresses', () => {
  const { html, warnings } = format('[链接](https://example.org)\n\n![图](/static/a.png)', 'zhihu')
  assert.match(html, /href="https:\/\/example.org\/"/)
  assert.match(html, /src="https:\/\/example.com\/static\/a.png"/)
  assert.equal(warnings.length, 1)
})
test('untrusted HTML, MDX and javascript URLs cannot execute', () => {
  const { html, warnings } = format(
    '<script>alert(1)</script>\n\n[危险](javascript:alert%281%29)\n\n<img src=x onerror="alert(1)">'
  )
  assert.doesNotMatch(html, /<script|<img|href="javascript:/)
  assert.match(html, /&lt;script&gt;/)
  assert.ok(warnings.length >= 2)
})
test('tables, tasks, reference links and footnotes preserve content', () => {
  const { html } = format(
    '| A | B |\n|---|---|\n| 1 | 2 |\n\n- [x] 完成\n\n[来源][ref]\n\n[ref]: https://example.org\n\n说明[^1]\n\n[^1]: 注释正文',
    'zhihu'
  )
  for (const value of ['<table', '<th', '☑', 'href="https://example.org/"', '注释正文'])
    assert.ok(html.includes(value), value)
})
test('unsupported diagrams and math remain visible with warnings', () => {
  const { html, warnings } = format('```mermaid\ngraph TD; A-->B\n```\n\n$$\nx^2\n$$')
  assert.match(html, /graph TD/)
  assert.match(html, /x\^2/)
  assert.equal(warnings.length, 2)
})
