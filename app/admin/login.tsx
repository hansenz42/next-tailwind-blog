'use client'

import Link from 'next/link'

import { useActionState } from 'react'
import { login } from './actions'

export default function Login({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(login, { error: '' })
  return (
    <div className="studio-login">
      <form action={action} className="studio-login-form">
        <h2>进入运营工作台</h2>
        <label htmlFor="admin-token">管理 Token</label>
        <input
          id="admin-token"
          name="token"
          type="password"
          autoComplete="current-password"
          required
          disabled={!configured}
          placeholder="输入管理 Token"
        />
        <button className="studio-primary" disabled={pending || !configured}>
          {pending ? '正在验证…' : '登录工作台 →'}
        </button>
        <p role="alert">
          {!configured
            ? '后台未启用：请在 Vercel 配置至少 32 位的 BLOG_ADMIN_TOKEN，然后重新部署。'
            : state.error}
        </p>
        <Link href="/">← 返回博客</Link>
      </form>
    </div>
  )
}
