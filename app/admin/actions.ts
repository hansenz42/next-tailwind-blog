'use server'

import { redirect } from 'next/navigation'
import { allBlogs } from 'contentlayer/generated'
import { endSession, matchesToken, requireAdmin, startSession } from '../../lib/admin/auth'

export async function login(_state: { error: string }, form: FormData) {
  const token = form.get('token')
  if (typeof token !== 'string' || token.length > 512 || !matchesToken(token)) {
    return { error: 'Token 不正确，或后台尚未配置。' }
  }
  await startSession()
  redirect('/admin')
}
export async function logout() {
  await endSession()
  redirect('/admin')
}
export async function readArticle(slug: string) {
  await requireAdmin()
  const article = allBlogs.find((article) => article.slug === slug)
  if (!article) throw new Error('文章不存在。')
  return article.body.raw
}
