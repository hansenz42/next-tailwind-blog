import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const cookieName = 'blog-admin-session'
const lifetime = 60 * 60 * 12
const digest = (value: string) => createHash('sha256').update(value).digest()
export const configured = () => (process.env.BLOG_ADMIN_TOKEN?.length ?? 0) >= 32
export function matchesToken(value: string) {
  return configured() && timingSafeEqual(digest(value), digest(process.env.BLOG_ADMIN_TOKEN!))
}
function signature(value: string) {
  return createHmac('sha256', process.env.BLOG_ADMIN_TOKEN!)
    .update(`blog-admin:${value}`)
    .digest('hex')
}
export async function authenticated() {
  if (!configured()) return false
  const value = (await cookies()).get(cookieName)?.value
  if (!value) return false
  const [expiry, sig] = value.split('.')
  if (!/^\d+$/.test(expiry) || !sig || Number(expiry) <= Date.now()) return false
  return timingSafeEqual(digest(sig), digest(signature(expiry)))
}
export async function requireAdmin() {
  if (!(await authenticated())) throw new Error('登录已过期，请刷新页面重新登录。')
}
export async function startSession() {
  const expiry = String(Date.now() + lifetime * 1000)
  ;(await cookies()).set(cookieName, `${expiry}.${signature(expiry)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: lifetime,
  })
}
export async function endSession() {
  ;(await cookies()).set(cookieName, '', {
    path: '/admin',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}
