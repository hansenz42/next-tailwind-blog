'use client'

import Link from 'next/link'

import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { formatArticle, Platform, Theme } from '../../lib/admin/format'
import siteMetadata from '@/data/siteMetadata'
import { logout, readArticle } from './actions'

type Article = {
  slug: string
  title: string
  date: string
  tags: string[]
  draft: boolean
  summary: string
}
export default function Studio({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Article | null>(null)
  const [source, setSource] = useState('')
  const [original, setOriginal] = useState('')
  const [platform, setPlatform] = useState<Platform>('wechat')
  const [theme, setTheme] = useState<Theme>('jade')
  const [view, setView] = useState<'preview' | 'source'>('preview')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [manualCopy, setManualCopy] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const request = useRef(0)
  const deferredSource = useDeferredValue(source)
  const filtered = articles.filter(
    (article) =>
      (filter === 'all' || (filter === 'draft' ? article.draft : !article.draft)) &&
      `${article.title} ${article.tags.join(' ')} ${article.summary}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )
  const articleUrl = `${siteMetadata.siteUrl}/blog/${selected?.slug || ''}`
  const formatted = useMemo(
    () => formatArticle(deferredSource, platform, theme, siteMetadata.siteUrl, articleUrl),
    [deferredSource, platform, theme, articleUrl]
  )
  const ready = !!selected && !loading && deferredSource === source

  async function selectArticle(article: Article) {
    if (source !== original && !window.confirm('切换文章将丢弃本次临时修改，是否继续？')) return
    const id = ++request.current
    setLoading(true)
    setStatus('')
    setManualCopy(false)
    try {
      const body = await readArticle(article.slug)
      if (id !== request.current) return
      setSelected(article)
      setSource(body)
      setOriginal(body)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '文章加载失败，请重试。')
    } finally {
      if (id === request.current) setLoading(false)
    }
  }
  async function copyTitle() {
    try {
      await navigator.clipboard.writeText(selected!.title)
      setStatus('标题已复制。')
    } catch {
      setStatus('无法写入剪贴板，请手动选择标题复制。')
    }
  }
  async function copyBody() {
    if (!ready) return
    const text = new DOMParser().parseFromString(formatted.html, 'text/html').body.innerText
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([formatted.html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        }),
      ])
      setStatus(`已复制${platform === 'wechat' ? '公众号' : '知乎'}正文。`)
      setManualCopy(false)
    } catch {
      setView('preview')
      setManualCopy(true)
      setStatus('浏览器未允许写入剪贴板。请点击“选中正文”，再按 ⌘C / Ctrl+C 复制。')
    }
  }
  function selectPreview() {
    if (!previewRef.current) return
    const range = document.createRange()
    range.selectNodeContents(previewRef.current)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
  return (
    <div className="studio">
      <aside className="studio-library">
        <Link href="/" className="studio-brand">
          <span className="studio-mark">森</span>
          <span>阿森毛不多</span>
        </Link>
        <div className="studio-library-heading">
          <h1>文章库</h1>
          <span>{articles.length}</span>
        </div>
        <label className="studio-search">
          <span className="sr-only">搜索文章或标签</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文章、标签…"
            type="search"
          />
        </label>
        <div className="studio-filters" aria-label="文章状态">
          {[
            ['all', '全部'],
            ['published', '已发布'],
            ['draft', '草稿'],
          ].map(([value, label]) => (
            <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value}>
              {label}
            </button>
          ))}
        </div>
        <nav className="studio-articles" aria-label="文章列表">
          {filtered.map((article) => (
            <button
              className={`studio-article ${selected?.slug === article.slug ? 'is-selected' : ''}`}
              onClick={() => selectArticle(article)}
              key={article.slug}
            >
              <span className="studio-article-meta">
                {article.date.slice(0, 10)} <span>{article.draft ? '草稿' : '已发布'}</span>
              </span>
              <strong>{article.title}</strong>
              <span className="studio-article-tags">
                {article.tags.slice(0, 2).join(' / ') || '未分类'}
              </span>
            </button>
          ))}
          {!filtered.length && <p className="studio-no-results">没有找到匹配文章。</p>}
        </nav>
        <div className="studio-library-footer">
          <form action={logout}>
            <button>退出登录 ↗</button>
          </form>
        </div>
      </aside>
      <section className="studio-workspace">
        <header className="studio-topbar">
          <span>
            工作台 <span className="studio-muted">/ 内容分发</span>
          </span>
          <a href="/" target="_blank" rel="noreferrer">
            查看博客 ↗
          </a>
        </header>
        <div className="studio-content">
          <div className="studio-toolbar">
            <div className="studio-platform" aria-label="目标平台">
              <button
                aria-pressed={platform === 'wechat'}
                onClick={() => {
                  setPlatform('wechat')
                  setStatus('')
                }}
              >
                <span aria-hidden="true">◉</span> 微信公众号
              </button>
              <button
                aria-pressed={platform === 'zhihu'}
                onClick={() => {
                  setPlatform('zhihu')
                  setStatus('')
                }}
              >
                <span aria-hidden="true">知</span> 知乎
              </button>
            </div>
            <label className="studio-theme-select">
              <span className="sr-only">排版风格</span>
              <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
                <option value="jade">青绿手记</option>
                <option value="ink">墨色专栏</option>
              </select>
            </label>
            <div className="studio-copy-actions">
              <button disabled={!ready} onClick={copyTitle}>
                复制标题
              </button>
              <button className="studio-primary" disabled={!ready} onClick={copyBody}>
                复制正文 ↗
              </button>
            </div>
          </div>
          <p className="studio-status" role="status" aria-live="polite">
            {loading ? '正在加载文章…' : status}
          </p>
          {selected ? (
            <div className="studio-editor-grid">
              <section className="studio-paper-panel">
                <div className="studio-paper-toolbar">
                  <div>
                    <button aria-pressed={view === 'preview'} onClick={() => setView('preview')}>
                      排版预览
                    </button>
                    <button aria-pressed={view === 'source'} onClick={() => setView('source')}>
                      Markdown
                    </button>
                  </div>
                  <span>
                    {source.replace(/\s/g, '').length.toLocaleString()} 字符
                    {source !== original ? ' · 已临时修改' : ''}
                  </span>
                </div>
                <div className="studio-article-title">
                  <span>
                    {selected.date.slice(0, 10)} / {selected.draft ? '草稿' : '博客文章'}
                  </span>
                  <h3>{selected.title}</h3>
                  <a href={articleUrl} target="_blank" rel="noreferrer">
                    查看原文 ↗
                  </a>
                </div>
                {view === 'source' ? (
                  <div className="studio-source">
                    <label className="sr-only" htmlFor="markdown-source">
                      Markdown 正文
                    </label>
                    <textarea
                      id="markdown-source"
                      value={source}
                      onChange={(event) => {
                        setSource(event.target.value)
                        setStatus('')
                      }}
                      spellCheck={false}
                    />
                    <p>临时编辑，不保存到原文。</p>
                    <button
                      onClick={() => {
                        if (window.confirm('恢复原文并丢弃临时修改？')) setSource(original)
                      }}
                    >
                      恢复原文
                    </button>
                  </div>
                ) : (
                  <div
                    className="studio-paper"
                    ref={previewRef}
                    dangerouslySetInnerHTML={{ __html: formatted.html }}
                  />
                )}
              </section>
              {(formatted.warnings.length > 0 || manualCopy) && (
                <div className="studio-checks">
                  {formatted.warnings.length > 0 && (
                    <details>
                      <summary>发布检查 · {formatted.warnings.length} 项</summary>
                      <ul className="studio-warnings">
                        {formatted.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {manualCopy && (
                    <button className="studio-primary" onClick={selectPreview}>
                      选中正文
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="studio-empty">
              <h3>选择文章</h3>
              {filtered[0] && (
                <button className="studio-primary" onClick={() => selectArticle(filtered[0])}>
                  打开最新文章 →
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
