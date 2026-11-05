import type { Metadata } from 'next'
import { allBlogs } from 'contentlayer/generated'
import { authenticated, configured } from '../../lib/admin/auth'
import Studio from './studio'
import Login from './login'
import './studio.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: '博客运营工作台',
  robots: { index: false, follow: false },
}
export default async function AdminPage() {
  if (!(await authenticated())) return <Login configured={configured()} />
  const articles = allBlogs
    .map(({ slug, title, date, tags, draft, summary }) => ({
      slug,
      title,
      date,
      tags: tags || [],
      draft: !!draft,
      summary: summary || '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
  return <Studio articles={articles} />
}
