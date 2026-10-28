'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

type Counts = { site: number; page: number }

export default function ViewCounter() {
  const pathname = usePathname()
  const [result, setResult] = useState<{ path: string; counts: Counts } | null>(null)
  const pending = useRef<{ path: string; promise: Promise<Counts | null> } | null>(null)

  useEffect(() => {
    if (!pathname) return
    let active = true
    // Reuse the promise across React's effect replay, but count subsequent route visits.
    if (pending.current?.path !== pathname) {
      pending.current = {
        path: pathname,
        promise: fetch(`${process.env.BASE_PATH || ''}/api/views`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname, requestId: crypto.randomUUID() }),
          cache: 'no-store',
          signal: AbortSignal.timeout(6000),
        })
          .then(async (response) => {
            if (!response.ok || response.status === 204) return null
            const data = await response.json()
            return Number.isSafeInteger(data.site) &&
              data.site >= 0 &&
              Number.isSafeInteger(data.page) &&
              data.page >= 0
              ? { site: data.site, page: data.page }
              : null
          })
          .catch(() => null),
      }
    }
    pending.current.promise.then((counts) => {
      if (active) setResult(counts ? { path: pathname, counts } : null)
    })
    return () => {
      active = false
    }
  }, [pathname])

  // Keep the footer tidy during loading, in previews, and when the counter is unavailable.
  if (!result || result.path !== pathname) return null
  const format = (count: number) => count.toLocaleString('zh-CN')
  const article = pathname.startsWith('/blog/') && !pathname.startsWith('/blog/page/')
  return (
    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <FontAwesomeIcon icon={faEye} style={{ height: '1em', width: '1em' }} aria-hidden="true" />
      <span>全站访问 {format(result.counts.site)} 次</span>
      {article && <span> · 本文阅读 {format(result.counts.page)} 次</span>}
    </div>
  )
}
